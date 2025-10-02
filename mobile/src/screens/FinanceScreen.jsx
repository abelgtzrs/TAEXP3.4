import React from "react";
import { View, Text, StyleSheet } from "react-native";

const FinanceScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Finance</Text>
      <Text style={styles.text}>Transactions & bills preview will display here.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#0f172a" },
  title: { fontSize: 20, fontWeight: "600", color: "white", marginBottom: 8 },
  text: { color: "#cbd5e1" },
});

export default FinanceScreen;
