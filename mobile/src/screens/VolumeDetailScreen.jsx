import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { api } from "../api/client";

const VolumeDetailScreen = ({ route }) => {
  const { id } = route.params;
  const [volume, setVolume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get(`/admin/volumes/${id}`);
        setVolume(data.volume || data);
      } catch (e) {
        setError(e.message || "Failed to load volume");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading)
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Loading...</Text>
      </View>
    );
  if (error)
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  if (!volume)
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Not found.</Text>
      </View>
    );

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
      <Text style={styles.title}>{volume.title || volume.number}</Text>
      <Text style={styles.meta}>Edition: {volume.edition || "—"}</Text>
      {volume?.bodyLines?.slice(0, 50).map((line, idx) => (
        <Text key={idx} style={styles.bodyLine}>
          {line}
        </Text>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#0f172a" },
  title: { fontSize: 22, fontWeight: "700", color: "white", marginBottom: 6 },
  meta: { fontSize: 12, color: "#94a3b8", marginBottom: 12 },
  bodyLine: { color: "#cbd5e1", marginBottom: 4, fontSize: 13, lineHeight: 18 },
  text: { color: "#cbd5e1" },
  error: { color: "#f87171" },
});

export default VolumeDetailScreen;
