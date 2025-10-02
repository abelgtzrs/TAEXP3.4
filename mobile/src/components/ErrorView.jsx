import React from "react";
import { View, Text, StyleSheet } from "react-native";

const ErrorView = ({ message = "Something went wrong" }) => (
  <View style={styles.container}>
    <Text style={styles.text}>{message}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#0f172a", padding: 16 },
  text: { color: "#f87171" },
});

export default ErrorView;
