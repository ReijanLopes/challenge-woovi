import React from "react";
import { Text, View, StyleSheet, Pressable } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import Header from "./components/Header";

import styles from "./style";

type Props = {
  children: React.ReactNode;
};
type State = {
  error: Error;
};
class ErrorBoundaryRetry extends React.Component<Props, State> {
  state = {
    error: null,
  };

  static getDerivedStateFromError(error: Error) {
    return {
      error,
    };
  }

  render() {
    const { error } = this.state;

    if (error != null) {
      return (
        <View
          style={[
            styles.errorBoundaryContainer,
            styles.center,
            styles.padding_10,
          ]}
        >
          <Header />
          <Text style={styles.marginBottom_15}>Ocorreu um erro</Text>
          <Text>Error: {error?.message}</Text>
          <Text>{JSON.stringify(error?.source, null, 2)}</Text>
          <Pressable onPress={() => this.setState({ error: null })}>
            <AntDesign name="reload1" size={20} color="black" />
          </Pressable>
        </View>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundaryRetry;
