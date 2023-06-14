import React, { useState } from "react";
import {
  View,
  Text,
  TouchableWithoutFeedback,
  LayoutAnimation,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import styles from "../style";

interface ExpandableButtonProps {
  gap?: number;
  title: string;
  children: React.ReactNode;
}

export default function ShowMore({
  gap,
  title,
  children,
}: ExpandableButtonProps) {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <View style={styles.fullWidth}>
      <TouchableWithoutFeedback onPress={toggleExpanded}>
        <View
          style={[
            styles.justifyContent_spaceBetween,
            styles.alignItems_center,
            styles.flexDirection_row,
          ]}
        >
          <Text style={[styles.fontSize_12, styles.bold]}>{title}</Text>
          <View style={styles.marginR_5}>
            <MaterialIcons
              name={expanded ? "keyboard-arrow-up" : "keyboard-arrow-down"}
              size={20}
              color="black"
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
      {expanded && (
        <View style={[styles.marginTop_10, { gap: gap || 0 }]}>{children}</View>
      )}
    </View>
  );
}
