import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { FadeIn } from "react-native-reanimated";

// ─────────────────────────────────────────────
// ✅ FIXED BASE URL (IMPORTANT)
// ─────────────────────────────────────────────
const BASE_URL = "http://192.168.1.5:5000/api/patients";

const API = {
  getPatients: async () => {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error(`GET failed: ${res.status}`);
    return res.json();
  },

  createPatient: async (data) => {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`POST failed: ${res.status}`);
    return res.json();
  },

  deletePatient: async (id) => {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error(`DELETE failed: ${res.status}`);
    return res.json();
  },
};

// ─────────────────────────────────────────────
// PATIENT CARD
// ─────────────────────────────────────────────
const PatientCard = ({ item, index, onDelete }) => {
  return (
    <Animated.View
      entering={FadeIn.delay(index * 80).duration(300)}
      style={styles.patientContainer}
    >
      <View style={styles.patientCard}>
        <View style={styles.cardTopRow}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>
              {item.name?.charAt(0).toUpperCase() || "?"}
            </Text>
          </View>

          <View style={styles.patientInfo}>
            <Text style={styles.patientName}>{item.name}</Text>
            <Text style={styles.patientAge}>Age: {item.age}</Text>
            <Text style={styles.patientId}>ID: #{item.id}</Text>
          </View>
        </View>

        <View style={styles.diseaseBadgeRow}>
          <View style={styles.diseaseBadge}>
            <Text style={styles.diseaseText}>🩺 {item.disease}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => onDelete(item.id)}
        >
          <Text style={styles.actionText}>🗑 Delete</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

// ─────────────────────────────────────────────
// MAIN SCREEN
// ─────────────────────────────────────────────
export default function PatientsScreen() {
  const [patients, setPatients] = useState([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [disease, setDisease] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [adding, setAdding] = useState(false);

  // LOAD PATIENTS
  const loadPatients = async () => {
    try {
      const data = await API.getPatients();
      setPatients(Array.isArray(data) ? data : []);
    } catch (err) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  // ADD PATIENT
  const handleAdd = async () => {
    if (!name || !age || !disease) {
      Alert.alert("Fill all fields");
      return;
    }

    try {
      setAdding(true);

      await API.createPatient({
        name,
        age: parseInt(age),
        disease,
      });

      setName("");
      setAge("");
      setDisease("");
      loadPatients();

      Alert.alert("Success", "Patient added");
    } catch (err) {
      Alert.alert("Error", err.message);
    } finally {
      setAdding(false);
    }
  };

  // DELETE PATIENT
  const handleDelete = async (id) => {
    try {
      await API.deletePatient(id);
      loadPatients();
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  };

  // REFRESH
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadPatients();
    setRefreshing(false);
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1e1b4b" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>🏥 Patients</Text>
          <Text style={styles.headerSub}>Total: {patients.length}</Text>
        </View>

        {/* FORM */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Add Patient</Text>

          <TextInput
            placeholder="Name"
            style={styles.input}
            value={name}
            onChangeText={setName}
          />

          <TextInput
            placeholder="Age"
            style={styles.input}
            keyboardType="numeric"
            value={age}
            onChangeText={setAge}
          />

          <TextInput
            placeholder="Disease"
            style={styles.input}
            value={disease}
            onChangeText={setDisease}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleAdd}
            disabled={adding}
          >
            <Text style={styles.buttonText}>
              {adding ? "Adding..." : "Add Patient"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* LIST */}
        <FlatList
          data={patients}
          keyExtractor={(item) => item.id?.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item, index }) => (
            <PatientCard item={item} index={index} onDelete={handleDelete} />
          )}
        />
      </View>
    </GestureHandlerRootView>
  );
}

// ─────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f6ff" },

  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    backgroundColor: "#1e1b4b",
    padding: 20,
    paddingTop: 50,
  },
  headerTitle: { color: "white", fontSize: 22, fontWeight: "bold" },
  headerSub: { color: "#a5b4fc" },

  card: {
    margin: 15,
    padding: 15,
    backgroundColor: "white",
    borderRadius: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },

  button: {
    backgroundColor: "#1e1b4b",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "white", fontWeight: "bold" },

  patientContainer: {
    margin: 10,
  },

  patientCard: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
  },

  cardTopRow: { flexDirection: "row" },

  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1e1b4b",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  avatarText: { color: "white", fontSize: 18 },

  patientName: { fontSize: 16, fontWeight: "bold" },
  patientAge: { color: "#555" },
  patientId: { color: "#999" },

  diseaseBadgeRow: { marginTop: 10 },

  diseaseBadge: {
    backgroundColor: "#eef2ff",
    padding: 6,
    borderRadius: 6,
  },

  diseaseText: { color: "#1e1b4b" },

  deleteButton: {
    marginTop: 10,
    backgroundColor: "red",
    padding: 8,
    borderRadius: 6,
    alignItems: "center",
  },

  actionText: { color: "white" },
});
