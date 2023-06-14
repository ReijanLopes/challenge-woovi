import { useState } from "react";
import { ScrollView, SafeAreaView, Text, View } from "react-native";
import { useLazyLoadQuery, graphql } from "react-relay";

import { useSearchParams } from "react-router-native";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Info from "./Info";
import QrCode from "./QrCode";

import { formatNumberInString } from "./utils";

import styles from "./style";

import { PaymentPixQuery as PaymentPixQueryType } from "./__generated__/PaymentPixQuery.graphql";

const PaymentPixQuery = graphql`
  query PaymentPixQuery($userId: ID!, $debtId: ID!) {
    getUser(id: $userId) {
      _id
      name
    }
    getDebt(id: $debtId) {
      value
      tax {
        value
        cet
      }
    }
  }
`;

export default function PaymentPix() {
  const [params] = useSearchParams();
  const userId = params.get("userId");
  const debtId = params.get("debtId");
  const installment = Number(params.get("installment"));
  const query = useLazyLoadQuery<PaymentPixQueryType>(PaymentPixQuery, {
    userId,
    debtId,
  });
  const [qrCodeError, setQrCodeError] = useState(null);

  const name = query?.getUser?.name;
  const value = query.getDebt?.value;
  const tax = query?.getDebt?.tax?.value;
  const cet = query?.getDebt?.tax?.cet;
  const totalMoreTax = Math.round(value * (1 + tax / 100) ** installment);
  const valueOfInstallments = Math.round(totalMoreTax / (installment + 1));
  const valueOfInstallmentsString = formatNumberInString(valueOfInstallments);

  return (
    <ScrollView
      style={[styles.fullWidth, styles.padding_10, styles.marginTopBottom_20]}
    >
      <SafeAreaView
        style={[styles.container, styles.fullWidth, styles.alignItems_center]}
      >
        <Header />
        <View style={styles.marginTopBottom_20}>
          <Text
            style={[
              styles.bold,
              styles.title,
              styles.textCenter,
              styles.alignItems_center,
            ]}
          >
            {name}, pague a entrada de
          </Text>
          <Text
            style={[
              styles.bold,
              styles.title,
              styles.textCenter,
              styles.alignItems_center,
            ]}
          >
            R$ {valueOfInstallmentsString} pelo Pix
          </Text>
        </View>

        <QrCode
          variables={{
            tax,
            userId,
            debtId,
            installment,
            totalMoreTax,
            valueOfInstallments,
          }}
          setError={setQrCodeError}
        />
        {qrCodeError ? (
          <View style={[styles.center, styles.fullWidth]}>
            <Text style={[styles.color_red, styles.fontSize_10]}>
              Ouve algum erro na criação do QrCode
            </Text>
          </View>
        ) : null}

        <Info
          debtId={debtId}
          cet={cet}
          installmentLength={installment + 1}
          totalMoreTax={formatNumberInString(totalMoreTax)}
          valueOfInstallments={valueOfInstallmentsString}
        />

        <Footer />
      </SafeAreaView>
    </ScrollView>
  );
}
