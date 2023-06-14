import React, { useState, useEffect, useMemo } from "react";
import "core-js/stable";
import { graphql, useMutation } from "react-relay";
import { useOpenPix, Charge } from "@openpix/react";
import QRCode from "react-native-qrcode-svg";
import { useNavigate } from "react-router-native";

import { View, Text, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";

import { formatDate_DDMMYYYYHHMM, useDebounce } from "./utils";

import styles from "./style";

import type { QrCodeMutation as QrCodeMutationType } from "./__generated__/QrCodeMutation.graphql";

type variables = {
  tax: number;
  debtId: string;
  userId: string;
  installment: number;
  totalMoreTax: number;
  valueOfInstallments: number;
};

const QrCodeMutation = graphql`
  mutation QrCodeMutation($input: DebtInput) {
    updateDebt(input: $input) {
      value
      cashback
    }
  }
`;

const QrCode = ({
  variables,
  setError,
}: {
  variables: variables;
  setError: React.Dispatch<any>;
}) => {
  const [commit] = useMutation<QrCodeMutationType>(QrCodeMutation);
  const [charge, setCharge] = useState<Charge | null>(null);

  const navigate = useNavigate();

  const data = new Date();
  const currentMonth = data.getMonth();
  data.setDate(5);
  const handlePay = (charge: Charge) => {
    // I don't know with the "charge" information it would be used so it is unused, but it is necessary for the payment function
    const installments = Array.from({ length: variables?.installment + 1 }).map(
      (_, idx: number) => {
        const expires = data.setMonth(currentMonth + (idx + 1));

        return {
          status: idx === 0 ? "paid" : "onTime",
          idMonth: idx + 1,
          value: variables?.valueOfInstallments,
          expires: String(new Date(expires)),
        };
      }
    );
    commit({
      variables: {
        input: {
          _id: variables?.debtId,
          totalValue: variables?.totalMoreTax,
          installments: installments,
          user: variables?.userId,
        },
      },
      onCompleted() {
        navigate(
          `/paymentCard?userId=${variables?.userId}&debtId=${variables?.debtId}`
        );
      },
      onError(error) {
        setError(error);
      },
    });
  };

  const { chargeCreate } = useOpenPix({
    appID: process.env.APP_ID,
    handlePay,
  });

  const newCharge = () => {
    const { charge, error } = chargeCreate({
      correlationID: variables?.debtId,
      value: variables?.valueOfInstallments,
      comment: "Donate",
    });

    setCharge(charge);

    if (error) {
      setError(error);
      return;
    }

    charge ? handleExpires() : null;
  };

  useEffect(() => {
    newCharge();
  }, []);

  const handleExpires = useDebounce(() => {
    newCharge();
  }, charge?.expiresIn);

  const timeRemainingInSeconds = useMemo(() => {
    return charge?.expiresIn
      ? formatDate_DDMMYYYYHHMM(charge?.expiresIn)
      : "00/00/0000 - 00:00";
  }, [charge?.expiresIn]);

  const copyToClipboard = () => {
    const text = charge?.brcode
      ? charge?.brcode
      : "Copiar o QrCode não foi possivel";

    Clipboard.setStringAsync(text);
  };

  return (
    <View style={[styles.center, styles.fullWidth]}>
      <View style={[styles.border_gray, styles.center, styles.QrCodeContainer]}>
        {charge ? (
          <QRCode size={250} value={charge?.brcode} />
        ) : (
          <View style={styles.padding_30}>
            <Text style={styles.textCenter}>
              Houve algum erro na geração do QRcode
            </Text>
          </View>
        )}
      </View>

      <Pressable
        style={[
          styles.flag,
          styles.flexDirection_row,
          styles.bgColor_darkBlue,
          styles.center,
          styles.marginTop_10,
        ]}
        onPress={() => {
          copyToClipboard();
        }}
      >
        <Text
          style={[styles.color_white, styles.fontSize_14, styles.marginR_5]}
        >
          Clique para copiar QR CODE
        </Text>
        <MaterialIcons name="file-copy" size={18} color="white" />
      </Pressable>

      <View
        style={[styles.marginTopBottom_20, styles.center, styles.fullWidth]}
      >
        <Text style={[styles.fontSize_12, styles.text_gray]}>
          Prazo de pagamento:
        </Text>
        <Text style={[styles.fontSize_12, styles.bold]}>
          {timeRemainingInSeconds}
        </Text>
      </View>
    </View>
  );
};

export default QrCode;
