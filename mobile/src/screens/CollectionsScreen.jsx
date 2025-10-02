import React from "react";
import { View, Text, StyleSheet } from "react-native";

const CollectionsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Collections</Text>
      <Text style={styles.text}>List of collections will be displayed here.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#0f172a" },
  title: { fontSize: 20, fontWeight: "600", color: "white", marginBottom: 8 },
  text: { color: "#cbd5e1" },
});

export default CollectionsScreen;
