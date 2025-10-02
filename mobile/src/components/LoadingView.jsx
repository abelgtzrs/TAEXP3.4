import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";

const LoadingView = () => (
  <View style={styles.container}>
    <ActivityIndicator size="large" color="#14b8a6" />
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#0f172a" },
});

export default LoadingView;
