import { StyleSheet, View, StatusBar } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import Animated, { FadeIn } from "react-native-reanimated"

import { ThemedText } from "@/components/ThemedText"

interface GradientHeaderProps {
  title: string
}

export function GradientHeader({ title }: GradientHeaderProps) {
  const insets = useSafeAreaInsets()

  return (
    <Animated.View
      entering={FadeIn}
      style={[styles.container, { paddingTop: insets.top || StatusBar.currentHeight || 40 }]}
    >
      <LinearGradient colors={["#000", "rgba(0,0,0,0.8)", "rgba(0,0,0,0)"]} style={styles.gradient}>
        <View style={styles.titleContainer}>
          <ThemedText type="title" style={styles.title}>
            {title}
          </ThemedText>
        </View>
      </LinearGradient>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  gradient: {
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 44,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
})

