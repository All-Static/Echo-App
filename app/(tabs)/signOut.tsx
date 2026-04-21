import { router } from "expo-router";
import { signOut } from "firebase/auth";
import { useEffect } from "react";
import {
    ActivityIndicator,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { auth } from "@/lib/firebaseConfig";

export default function SignOutScreen() {
  useEffect(() => {
    const doSignOut = async () => {
      try {
        await signOut(auth);
        router.replace("/login");
      } catch (error) {
        console.log("Sign out error:", error);
      }
    };

    doSignOut();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <ActivityIndicator size="large" />
        <Text style={styles.text}>Signing out...</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
  },
  text: {
    marginTop: 10,
    fontSize: 16,
  },
});