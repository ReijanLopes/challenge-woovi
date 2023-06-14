import { View, ActivityIndicator } from "react-native";

import styles from "../style";

export default function LoadingSpinner() {
  return (
    <View style={[styles.container, styles.fullWidth, styles.center]}>
      <ActivityIndicator size="large" color="#02D69D" />
    </View>
  );
}
