"use client"

import { useState, useRef, useEffect } from "react"
import { StyleSheet, FlatList, KeyboardAvoidingView, Platform, View } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated"
import { ThemedView } from "@/components/ThemedView"
import { ChatInput } from "@/components/ChatInput"
import { MessageBubble } from "@/components/MessageBubble"
import { TypingIndicator } from "@/components/TypingIndicator"
import { GradientHeader } from "@/components/GradientHeader"
import { getChatResponse, loadChatHistory, getChatHistoryMessages, type ChatMessage } from "@/utils/chatService"

// Initial messages to show in the chat
const initialMessages: ChatMessage[] = [
  { id: "1", text: "Hello, how can I help you today?", sender: "bot", timestamp: new Date() },
]

export default function ChatScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputText, setInputText] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const flatListRef = useRef<FlatList<ChatMessage>>(null)

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true })
      }, 100)
    }
  }, [messages])

  useEffect(() => {
    async function fetchChatHistory() {
      try {
        setIsLoading(true)
        await loadChatHistory()
        const historyMessages = getChatHistoryMessages()
        console.log(historyMessages)
        // Set messages directly from history, don't append
        setMessages(historyMessages)
      } catch (error) {
        console.error("Error loading chat history:", error)
        // Fallback to initial greeting if loading fails
        setMessages(initialMessages)
      } finally {
        setIsLoading(false)
      }
    }

    fetchChatHistory()
  }, [])

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return

    // Add user message to the chat
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: text,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prevMessages) => [...prevMessages, userMessage])
    setInputText("")
    setIsTyping(true)

    try {
      // Get response from AI
      const response = await getChatResponse(text)

      // Add bot response to the chat - the response is already added to chat history
      // in getChatResponse, so we just need to update our local state
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: "bot",
        timestamp: new Date(),
      }

      setMessages((prevMessages) => [...prevMessages, botMessage])
    } catch (error) {
      console.error("Error getting chat response:", error)

      // Add error message
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I encountered an error. Please try again.",
        sender: "bot",
        timestamp: new Date(),
        isError: true,
      }

      setMessages((prevMessages) => [...prevMessages, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const renderMessage = ({ item }: { item: ChatMessage }) => (
    <Animated.View
      entering={item.sender === "user" ? FadeInUp.delay(100) : FadeInDown.delay(100)}
      style={styles.messageContainer}
    >
      <MessageBubble message={item} />
    </Animated.View>
  )

  return (
    <ThemedView style={styles.container}>
      <GradientHeader title="AI Assistant" />

      <LinearGradient colors={["#121212", "#1a1a1a"]} style={styles.chatContainer}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <TypingIndicator />
          </View>
        ) : (
          <>
            <FlatList
              ref={flatListRef}
              data={messages}
              renderItem={renderMessage}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.messagesList}
              showsVerticalScrollIndicator={false}
            />

            {isTyping && (
              <Animated.View entering={FadeInUp} style={styles.typingContainer}>
                <TypingIndicator />
              </Animated.View>
            )}
          </>
        )}
      </LinearGradient>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        style={styles.inputContainer}
      >
        <ChatInput value={inputText} onChangeText={setInputText} onSend={handleSendMessage} />
      </KeyboardAvoidingView>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  messagesList: {
    paddingTop: 100, // Space for header
    paddingBottom: 20,
  },
  messageContainer: {
    marginVertical: 4,
  },
  typingContainer: {
    marginLeft: 16,
    marginBottom: 8,
  },
  inputContainer: {
    paddingBottom: Platform.OS === "ios" ? 30 : 10,
    paddingHorizontal: 16,
    backgroundColor: "#0a0a0a",
    borderTopWidth: 1,
    borderTopColor: "#222",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
})

