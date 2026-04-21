import { Tabs, router } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

import { adminEmails } from "@/constants/adminEmails";
import { auth } from "@/lib/firebaseConfig";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        router.replace("/login");
        return;
      }

      const email = user.email?.toLowerCase() || "";
      setIsAdmin(adminEmails.includes(email));
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) return null;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="square.grid.2x2.fill" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="signOut"
        options={{
          title: "Sign Out",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="arrow.right.square" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="userBook"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="userBookings"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="admin"
        options={{
          href: isAdmin ? "/(tabs)/admin" : null,
        }}
      />
    </Tabs>
  );
}