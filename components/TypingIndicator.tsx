"use client"

import { useEffect } from "react"
import { StyleSheet, View } from "react-native"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  withSequence,
  Easing,
} from "react-native-reanimated"
import { LinearGradient } from "expo-linear-gradient"

export function TypingIndicator() {
  // Animation values for each dot
  const dot1Opacity = useSharedValue(0.3)
  const dot2Opacity = useSharedValue(0.3)
  const dot3Opacity = useSharedValue(0.3)

  // Animation styles
  const dot1Style = useAnimatedStyle(() => ({
    opacity: dot1Opacity.value,
  }))

  const dot2Style = useAnimatedStyle(() => ({
    opacity: dot2Opacity.value,
  }))

  const dot3Style = useAnimatedStyle(() => ({
    opacity: dot3Opacity.value,
  }))

  // Start the animation
  useEffect(() => {
    const animationConfig = {
      duration: 400,
      easing: Easing.inOut(Easing.ease),
    }

    // Animate each dot with a delay
    dot1Opacity.value = withRepeat(
      withSequence(withTiming(1, animationConfig), withTiming(0.3, animationConfig)),
      -1, // Infinite repeat
    )

    dot2Opacity.value = withDelay(
      200,
      withRepeat(
        withSequence(withTiming(1, animationConfig), withTiming(0.3, animationConfig)),
        -1, // Infinite repeat
      ),
    )

    dot3Opacity.value = withDelay(
      400,
      withRepeat(
        withSequence(withTiming(1, animationConfig), withTiming(0.3, animationConfig)),
        -1, // Infinite repeat
      ),
    )
  }, [])

  return (
    <LinearGradient colors={["#1a1a1a", "#2a2a2a"]} style={styles.container}>
      <View style={styles.dotsContainer}>
        <Animated.View style={[styles.dot, dot1Style]} />
        <Animated.View style={[styles.dot, dot2Style]} />
        <Animated.View style={[styles.dot, dot3Style]} />
      </View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    alignSelf: "flex-start",
  },
  dotsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#fff",
    marginHorizontal: 3,
  },
})

