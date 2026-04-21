import { router } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { adminEmails } from "../constants/adminEmails";
import { auth } from "../lib/firebaseConfig";

export default function LoginScreen() {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
       auth,
      email.trim().toLowerCase(),
      password
);

      const user = userCredential.user;
      const userEmail = user.email?.trim().toLowerCase() ?? "";
      const isAdmin = adminEmails.includes(userEmail);

      if (isAdmin) {
        router.replace("/(tabs)/admin");
      } else {
        router.replace("/(tabs)/dashboard");
      }
    } catch (error: any) {
      alert(error.message);
      console.log("Login error:", error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="none"
      >
        <View style={styles.container}>
          <View style={styles.content}>
            <View style={styles.logoBlock}>
              <Text style={styles.logoText}>Echo</Text>
            </View>

            <Text style={styles.subtitle}>
              Laundry has never been easier.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => setShowLoginForm((prev) => !prev)}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>
              {showLoginForm ? "Close Sign In" : "Sign In"}
            </Text>
          </TouchableOpacity>

          {showLoginForm && (
            <View style={styles.loginForm}>
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor={COLORS.secondaryText}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                textContentType="emailAddress"
              />

              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={COLORS.secondaryText}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="password"
              />

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleLogin}
                activeOpacity={0.8}
              >
                <Text style={styles.submitButtonText}>Continue</Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.push("/create-account")}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryButtonText}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const COLORS = {
  primary: "#7CCBFF",
  background: "#FAF7F2",
  white: "#FFFFFF",
  accent: "#2EC4B6",
  text: "#1E1E1E",
  secondaryText: "#6B7280",
  border: "#E5E7EB",
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    padding: 24,
  },
  content: {
    alignItems: "center",
  },
  logoBlock: {
    width: 200,
    height: 200,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 20,
  },
  logoText: {
    fontSize: 45,
    fontWeight: "bold",
    color: COLORS.white,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.secondaryText,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  primaryButton: {
    width: "100%",
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontWeight: "800",
    fontSize: 16,
  },
  secondaryButton: {
    width: "100%",
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    backgroundColor: COLORS.white,
  },
  secondaryButtonText: {
    color: COLORS.secondaryText,
    fontWeight: "600",
    fontSize: 16,
  },
  loginForm: {
    width: "100%",
    marginTop: 12,
    marginBottom: 10,
  },
  input: {
    width: "100%",
    height: 52,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    marginBottom: 12,
    color: COLORS.text,
  },
  submitButton: {
    width: "100%",
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#0F172A",
    fontWeight: "700",
    fontSize: 15,
  },
});