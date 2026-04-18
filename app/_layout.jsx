import * as NavigationBar from "expo-navigation-bar";
import { Stack } from "expo-router";
import { useEffect } from "react";
import "../global.css";

export default function Layout() {
  useEffect(() => {
    const configureNavBar = async () => {
      try {
        await NavigationBar.setBackgroundColorAsync("#2b2b2b");
        await NavigationBar.setButtonStyleAsync("light");
      } catch (error) {
        console.log("NavigationBar error:", error);
      }
    };

    configureNavBar();
  }, []);

  return (
    <Stack
      screenOptions={{
        headerTitleAlign: "center",
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
