import React, { useState } from "react";
import {
  View,
  TextInput as TextInputNative,
  Text,
  KeyboardTypeOptions,
} from "react-native";
import styles from "../style";

import { useDebounce } from "../utils";

export default function TextInput({
  mask,
  width,
  value,
  label,
  error,
  onChange,
  onBlur,
  placeholder,
  keyboardType,
}: {
  width?: string | number;
  value?: string;
  label?: string;
  onChange: (e: string | React.ChangeEvent<any>) => void;
  onBlur: (e: any) => void;
  placeholder?: string;
  keyboardType?: string;
  mask?: (e: string) => string | { error?: string } | undefined;
  error?: string;
}) {
  const [currentValue, setCurrentValue] = useState(value);
  const [err, setError] = useState(error ? error : null);

  const [isFocused, setIsFocused] = useState(false);
  const handleChange = (value: string) => {
    const formattedValue = mask ? mask(value) : value;
    if (formattedValue?.error) {
      useDebounce(() => {
        setError(null);
      }, 200);
      return setError(formattedValue?.error);
    }
    formattedValue ? onChange(formattedValue) : null;
    setCurrentValue(formattedValue);
  };
  return (
    <View style={[styles.position_relative, { width: width || "100%" }]}>
      <View style={styles.titleInputContainer}>
        {label && <Text style={styles.fontSize_10}>{label}</Text>}
      </View>

      <TextInputNative
        value={currentValue}
        onChangeText={handleChange}
        onBlur={(e) => {
          onBlur(e);
          setIsFocused(false);
        }}
        placeholder={placeholder}
        onFocus={() => {
          setIsFocused(true);
        }}
        keyboardType={(keyboardType as KeyboardTypeOptions) || "default"}
        style={[
          styles.padding_10,
          styles.textInput,
          styles.fullWidth,
          { borderColor: isFocused ? "#31b5f3" : "#d8e1ef" },
        ]}
      />
      {err || error ? (
        <View>
          <Text style={[styles.color_red, styles.fontSize_10]}>
            {err || error}
          </Text>
        </View>
      ) : null}
    </View>
  );
}
