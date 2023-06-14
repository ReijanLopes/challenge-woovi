import React, { useCallback, useMemo, useState } from "react";
import { ScrollView, SafeAreaView, View, Text, Pressable } from "react-native";
import { useLazyLoadQuery, graphql } from "react-relay";
import { useNavigate, useSearchParams } from "react-router-native";
import { Octicons } from "@expo/vector-icons";

import Header from "./components/Header";
import Footer from "./components/Footer";

import { useDebounce, formatNumberInString } from "./utils";

import styles from "./style";

import { PaymentMethodQuery as PaymentMethodQueryType } from "./__generated__/PaymentMethodQuery.graphql";

const PaymentMethodQuery = graphql`
  query PaymentMethodQuery($userId: ID!, $debtId: ID!) {
    getUser(id: $userId) {
      _id
      name
    }
    getDebt(id: $debtId) {
      value
      cashback
      numberOfInstallments
      tax {
        value
      }
    }
  }
`;

const immediateRefund = (value: number) => {
  return Math.floor((value / 100) * 0.01).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

const Flag = ({
  title,
  text,
  bgColor,
}: {
  title: string;
  text: string;
  bgColor: string;
}) => {
  return (
    <View
      style={[
        styles.flexDirection_row,
        styles.flag,
        styles.bgColor_darkBlue,
        styles.position_relative,
      ]}
    >
      <Text
        style={[
          styles.bold,
          styles.marginR_5,
          styles.color_white,
          styles.fontSize_12,
        ]}
      >
        {title}
      </Text>
      <Text style={[styles.color_white, styles.fontSize_12]}>{text}</Text>
      <View
        style={[styles.triangle, styles.size_20, { backgroundColor: bgColor }]}
      ></View>
    </View>
  );
};

const SelectPayment = ({
  flag,
  select,
  cashback,
  setSelect,
  onNavigate,
  valueTotal,
  borderRadius,
  titleCategory,
  installmentValue,
  quantityInstallments,
}: {
  flag?: { title: string; text: string } | null;
  select: number;
  borderRadius?: any;
  setSelect: React.Dispatch<React.SetStateAction<number>>;
  cashback?: number;
  onNavigate?: () => void;
  valueTotal?: string;
  titleCategory?: React.ReactNode | null;
  installmentValue: string;
  quantityInstallments: number;
}) => {
  const handleClickDebounce = useDebounce(() => {
    onNavigate();
  }, 500);

  const selected = select === quantityInstallments;

  return (
    <Pressable
      style={[
        styles.selectPaymentContainer,
        styles.fullWidth,
        styles.position_relative,
        selected && styles.selectedElement,
        borderRadius.start,
        borderRadius.end,
        {
          zIndex: selected ? 1 : 0,
          marginTop: quantityInstallments === 2 ? 25 : -1,
        },
      ]}
      onPress={() => {
        setSelect(quantityInstallments);
        handleClickDebounce();
      }}
    >
      {titleCategory && (
        <View style={styles.titleCategoryContainer}>{titleCategory}</View>
      )}
      <View
        style={[styles.flexDirection_row, styles.justifyContent_spaceBetween]}
      >
        <Text style={styles.fontSize_18}>
          <Text style={styles.bold}>{quantityInstallments}x</Text> R${" "}
          {installmentValue}
        </Text>
        <View
          style={[
            styles.size_20,
            styles.center,
            selected ? undefined : styles.border_gray,
          ]}
        >
          {selected ? (
            <Octicons name="check-circle-fill" size={18} color="#00e2ae" />
          ) : null}
        </View>
      </View>
      {cashback ? (
        <Text style={[styles.fontSize_12, styles.cashback]}>
          Ganhe {cashback}% de Cashback
        </Text>
      ) : null}
      {valueTotal ? (
        <Text style={[styles.fontSize_12, styles.color_B9B8B9]}>
          Total: R$ {valueTotal}
        </Text>
      ) : null}
      {flag?.title ? (
        <Flag
          title={flag?.title}
          text={flag?.text}
          bgColor={selected ? "#f0fcf8" : "#FFFF"}
        />
      ) : null}
    </Pressable>
  );
};

type borderRadiusSelectPayment = {
  start:
    | {
        borderTopStartRadius?: number;
        borderTopEndRadius?: number;
      }
    | {};
  end:
    | {
        borderBottomEndRadius?: number;
        borderBottomStartRadius?: number;
      }
    | {};
};

const title = ["Pix", "Pix Parcelado"];
export default function PaymentMethod() {
  const [params] = useSearchParams();
  const userId = params.get("userId"); // add your userId;
  const debtId = params.get("debtId"); // add your debtId;

  const query = useLazyLoadQuery<PaymentMethodQueryType>(PaymentMethodQuery, {
    userId,
    debtId,
  });

  const [select, setSelect] = useState(null);
  const navigate = useNavigate();

  const name = query?.getUser?.name;
  const value = query?.getDebt?.value;
  const numberOfInstallments = query?.getDebt?.numberOfInstallments;
  const tax = query?.getDebt?.tax.value;
  const cashback = query?.getDebt?.cashback;

  const validatedAction = useMemo(
    () => userId && debtId && name && value,
    [userId, debtId, name, value]
  );

  const renderList = useCallback(
    (_, idx: number) => {
      const installments = idx + 1;

      const borderRadius: borderRadiusSelectPayment = useMemo(() => {
        const start =
          installments === 1 || installments === 2
            ? styles.borderStartRadius
            : {};

        const end =
          installments === 1 || installments === 7
            ? styles.borderEndRadius
            : {};

        return { start, end };
      }, [idx]);

      const valueTotal =
        idx == 0 ? value : Math.round(value * (1 + tax / 100) ** idx);
      const quantityInstallments = idx == 0 ? value : valueTotal / installments;

      const refund = immediateRefund(value);

      const textFlag = useMemo(
        () => ({
          0: {
            title: `🤑 ${refund}`,
            text: "de volta no seu Pix na hora",
          },
          3: {
            title: `-${Math.ceil((1 + tax / 100) ** 3)} % de juros`,
            text: "Melhor opção de parcelamento",
          },
        }),
        [refund, tax]
      );

      return (
        <SelectPayment
          borderRadius={borderRadius}
          key={idx}
          titleCategory={
            title[idx] ? (
              <View style={styles.titleCategory}>
                <Text style={styles.bold}>{title[idx]}</Text>
              </View>
            ) : null
          }
          installmentValue={formatNumberInString(quantityInstallments)}
          valueTotal={
            installments === 1 ? undefined : formatNumberInString(valueTotal)
          }
          quantityInstallments={installments}
          cashback={installments === 1 ? cashback : undefined}
          flag={textFlag[idx]}
          select={select}
          setSelect={setSelect}
          onNavigate={() => {
            validatedAction
              ? navigate(
                  `/paymentPix?userId=${userId}&debtId=${debtId}&installment=${idx}`
                )
              : null;
          }}
        />
      );
    },
    [select]
  );

  return (
    <ScrollView style={[styles.marginTopBottom_20, styles.fullWidth]}>
      <SafeAreaView
        style={[
          styles.container,
          styles.fullWidth,
          styles.alignItems_center,
          styles.minHeight_100vh,
        ]}
      >
        <Header />
        <View style={styles.marginTopBottom_20}>
          {validatedAction && (
            <Text style={[styles.bold, styles.title, styles.center]}>
              {name}, como você quer pagar?
            </Text>
          )}
        </View>
        {validatedAction ? (
          <View style={[styles.fullWidth, styles.padding_10]}>
            {Array.from({ length: numberOfInstallments }).map(renderList)}
          </View>
        ) : (
          <Text>Lamentamos, mas ocorreu um erro</Text>
        )}

        <Footer />
      </SafeAreaView>
    </ScrollView>
  );
}
