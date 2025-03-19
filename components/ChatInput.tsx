"use client"

import { useState } from "react"
import { StyleSheet, TextInput, TouchableOpacity, View, Keyboard } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import Animated, { useAnimatedStyle, withSpring, useSharedValue } from "react-native-reanimated"

import { IconSymbol } from "@/components/ui/IconSymbol"

interface ChatInputProps {
  value: string
  onChangeText: (text: string) => void
  onSend: (text: string) => void
}

export function ChatInput({ value, onChangeText, onSend }: ChatInputProps) {
  const [isFocused, setIsFocused] = useState(false)
  const scale = useSharedValue(1)

  const handleSend = () => {
    if (value.trim()) {
      onSend(value)
      Keyboard.dismiss()

      // Animate the send button
      scale.value = 0.8
      setTimeout(() => {
        scale.value = 1
      }, 100)
    }
  }

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withSpring(scale.value) }],
    }
  })

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={isFocused ? ["#222", "#333"] : ["#1a1a1a", "#222"]}
        style={[styles.inputContainer, isFocused && styles.inputContainerFocused]}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder="Type a message..."
          placeholderTextColor="#777"
          style={styles.input}
          multiline
          maxLength={500}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />

        <Animated.View style={animatedStyle}>
          <TouchableOpacity
            onPress={handleSend}
            style={[styles.sendButton, !value.trim() && styles.sendButtonDisabled]}
            disabled={!value.trim()}
          >
            <LinearGradient
              colors={value.trim() ? ["#333", "#444"] : ["#222", "#333"]}
              style={styles.sendButtonGradient}
            >
              <IconSymbol size={20} name="paperplane.fill" color={value.trim() ? "#fff" : "#777"} />
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </LinearGradient>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginVertical: 8,
  },
  inputContainerFocused: {
    borderWidth: 1,
    borderColor: "#444",
  },
  input: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
    maxHeight: 100,
    paddingTop: 8,
    paddingBottom: 8,
  },
  sendButton: {
    marginLeft: 8,
    borderRadius: 20,
    overflow: "hidden",
  },
  sendButtonDisabled: {
    opacity: 0.7,
  },
  sendButtonGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
})

