import { StyleSheet, View } from "react-native"
import { LinearGradient } from "expo-linear-gradient"

import { ThemedText } from "@/components/ThemedText"

interface Message {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: Date
  isError?: boolean
}

interface MessageBubbleProps {
  message: Message
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.sender === "user"
  const formattedTime = formatTime(message.timestamp)

  // Choose gradient colors based on sender and error state
  const gradientColors = isUser ? ["#333", "#444"] : message.isError ? ["#3a1a1a", "#4a2a2a"] : ["#1a1a1a", "#2a2a2a"]

  return (
    <View style={[styles.container, isUser ? styles.userContainer : styles.botContainer]}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.bubble, isUser ? styles.userBubble : styles.botBubble, message.isError && styles.errorBubble]}
      >
        <ThemedText style={styles.messageText}>{message.text}</ThemedText>
        <ThemedText style={styles.timestamp}>{formattedTime}</ThemedText>
      </LinearGradient>
    </View>
  )
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    maxWidth: "80%",
  },
  userContainer: {
    alignSelf: "flex-end",
  },
  botContainer: {
    alignSelf: "flex-start",
  },
  bubble: {
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 10,
    minHeight: 40,
  },
  userBubble: {
    borderBottomRightRadius: 4,
  },
  botBubble: {
    borderBottomLeftRadius: 4,
  },
  errorBubble: {
    borderWidth: 1,
    borderColor: "#5a3a3a",
  },
  messageText: {
    color: "#fff",
    fontSize: 16,
    lineHeight: 22,
  },
  timestamp: {
    color: "#aaa",
    fontSize: 12,
    alignSelf: "flex-end",
    marginTop: 4,
  },
})

