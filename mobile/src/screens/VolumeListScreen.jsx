import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { api } from "../api/client";
import { useNavigation } from "@react-navigation/native";

const VolumeListScreen = () => {
  const [volumes, setVolumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get("/admin/volumes");
        setVolumes(data?.volumes || data || []);
      } catch (e) {
        setError(e.message || "Failed to load volumes");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Volumes</Text>
      <FlatList
        data={volumes}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={() => navigation.navigate("VolumeDetail", { id: item._id })}>
            <Text style={styles.itemTitle}>{item.title || item.number}</Text>
            <Text numberOfLines={1} style={styles.itemSub}>
              {item.edition || "—"}
            </Text>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#0f172a" },
  title: { fontSize: 20, fontWeight: "600", color: "white", marginBottom: 8 },
  text: { color: "#cbd5e1" },
  error: { color: "#f87171" },
  item: { padding: 12, backgroundColor: "#1e293b", borderRadius: 6 },
  itemTitle: { color: "white", fontSize: 16, fontWeight: "600" },
  itemSub: { color: "#94a3b8", fontSize: 12, marginTop: 2 },
  sep: { height: 8 },
});

export default VolumeListScreen;
