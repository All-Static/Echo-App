import { router, Stack } from "expo-router";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from "../lib/firebaseConfig";

const COLORS = {
  primary: "#7CCBFF",
  background: "#FAF7F2",
  white: "#FFFFFF",
  accent: "#2EC4B6",
  text: "#1E1E1E",
  secondaryText: "#6B7280",
  border: "#E5E7EB",
};

export default function CreateAccountScreen() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleCreateAccount = async () => {
    if (!fullName || !email || !password) {
      alert("Please fill in all fields");
      return;
    }

    if (!email.includes("@")) {
      alert("Invalid email");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await updateProfile(userCredential.user, {
        displayName: fullName,
      });

      alert("Account created!");
      router.replace("/home");
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: "" }} />

      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Get started with Echo</Text>

          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor={COLORS.secondaryText}
            value={fullName}
            onChangeText={setFullName}
          />

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={COLORS.secondaryText}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={COLORS.secondaryText}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleCreateAccount}
          >
            <Text style={styles.primaryButtonText}>Create Account</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.signInText}>
              Already have an account? Sign In
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },

  backText: {
    color: COLORS.secondaryText,
    fontSize: 16,
    marginBottom: 24,
  },

  title: {
    fontSize: 32,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 16,
    color: COLORS.secondaryText,
    marginBottom: 28,
  },

  input: {
    width: "100%",
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 15,
    marginBottom: 14,
    color: COLORS.text,
    fontSize: 16,
  },

  primaryButton: {
    width: "100%",
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 8,
  },

  primaryButtonText: {
    color: COLORS.white,
    fontWeight: "800",
    fontSize: 16,
  },

  signInText: {
    textAlign: "center",
    color: COLORS.secondaryText,
    fontSize: 15,
    marginTop: 18,
  },
});