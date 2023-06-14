import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  TouchableWithoutFeedback,
  LayoutAnimation,
  TextInput,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import styles from "../style";

type option = {
  value: string;
  label: string;
  status: string;
};

export default function Select({
  options,
  label,
  defaultValue,
  placeholder = "Selecione uma opção",
  onChange,
  onBlur,
}: {
  defaultValue?: option;
  options: Array<option>;
  label: string;
  placeholder?: string;
  onChange?: (e: string | React.ChangeEvent<any>) => void;
  onBlur?: (e: any) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [selectedOption, setSelectedOption] = useState(
    defaultValue?.value ? defaultValue : null
  );

  const handleOptionPress = (option: option) => {
    setSelectedOption(option);
    setExpanded(false);
    onChange ? onChange(option?.value) : null;
  };

  const toggleExpanded = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  const renderTouchable = useCallback(
    (option: option) => (
      <TouchableWithoutFeedback
        key={option.value}
        onPress={() => handleOptionPress(option)}
        style={styles.padding_10}
      >
        <View style={[styles.padding_10, styles.borderColor_d8e1ef]}>
          <Text>{option.label}</Text>
        </View>
      </TouchableWithoutFeedback>
    ),
    [expanded]
  );
  return (
    <View style={[styles.position_relative, styles.fullWidth]}>
      <View style={styles.selectContainerLabel}>
        <Text style={styles.fontSize_10}>{label}</Text>
      </View>
      <TouchableWithoutFeedback onPress={toggleExpanded}>
        <View
          style={[
            styles.padding_10,
            styles.borderRadius_3,
            styles.alignItems_center,
            styles.justifyContent_spaceBetween,
            styles.fullWidth,
            styles.flexDirection_row,
            {
              borderColor:
                expanded && options?.[0]?.value ? "#31b5f3" : "#d8e1ef",
            },
          ]}
        >
          <Text style={{ color: selectedOption ? "black" : "#d8e1ef" }}>
            {selectedOption ? selectedOption?.label : placeholder}
          </Text>
          {options?.[0]?.value ? (
            <MaterialIcons
              name={expanded ? "arrow-drop-up" : "arrow-drop-down"}
              size={24}
              color="black"
            />
          ) : null}
        </View>
      </TouchableWithoutFeedback>

      <View
        style={[
          styles.overflow_hidden,
          {
            height: expanded && options?.[0]?.value ? options.length * 40 : 0,
          },
        ]}
      >
        {options?.[0]?.value ? options.map(renderTouchable) : ""}
      </View>
      <TextInput
        editable={false}
        value={selectedOption?.value}
        placeholder={placeholder}
        onBlur={onBlur}
        style={styles.display_none}
      />
    </View>
  );
}
