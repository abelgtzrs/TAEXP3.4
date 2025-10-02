import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { useAuth } from "../context/AuthContext";

const MoreScreen = () => {
  const { logout, user } = useAuth();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>More</Text>
      <Text style={styles.text}>Logged in as: {user?.email}</Text>
      <Button title="Logout" onPress={logout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#0f172a" },
  title: { fontSize: 20, fontWeight: "600", color: "white", marginBottom: 8 },
  text: { color: "#cbd5e1", marginBottom: 16 },
});

export default MoreScreen;
