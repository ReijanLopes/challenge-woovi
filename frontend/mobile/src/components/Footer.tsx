import { Text, Image, View } from "react-native";
import { Octicons } from "@expo/vector-icons";
import styles from "../style";

export default function Footer() {
  return (
    <View
      style={[styles.footerContainer, styles.flexDirection_row, styles.center]}
    >
      <View style={styles.marginR_3}>
        <Octicons name="shield-check" size={14} color="#b9b8b9" />
      </View>

      <Text style={[styles.footerText, styles.fontSize_12]}>
        Pagamento 100% seguro via:
      </Text>
      <Image
        source={require("../../assets/logo_gray.png")}
        style={styles.footerImage}
      />
    </View>
  );
}
