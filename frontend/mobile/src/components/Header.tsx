import { View, Image } from "react-native";
import styles from "../style";

export default function Header() {
  return (
    <View
      style={[styles.fullWidth, styles.paddingTop_40, styles.alignItems_center]}
    >
      <Image
        source={require("../../assets/logo.png")}
        style={styles.headerLogo}
      />
    </View>
  );
}
