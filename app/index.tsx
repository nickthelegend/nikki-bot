"use client"

import { useState, useRef, useEffect } from "react"
import {
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  View,
  TouchableOpacity,
  Keyboard,
  Dimensions,
  InteractionManager,
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated"
import { Menu } from "lucide-react-native"
import { ThemedView } from "@/components/ThemedView"
import { ThemedText } from "@/components/ThemedText"
import { ChatInput } from "@/components/ChatInput"
import { MessageBubble } from "@/components/MessageBubble"
import { TypingIndicator } from "@/components/TypingIndicator"
import { toggleSidebar } from "@/utils/sidebarState"
import { Sidebar } from "@/components/Sidebar"
import { getChatResponse, loadChatHistory, getChatHistoryMessages, type ChatMessage } from "@/utils/chatService"

// Initial messages to show in the chat
const initialMessages: ChatMessage[] = [
  { id: "1", text: "Hello, how can I help you today?", sender: "bot", timestamp: new Date() },
]

// Get screen dimensions
const { height: screenHeight } = Dimensions.get("window")

// Extra padding for the bottom of the list
const EXTRA_PADDING = 50

export default function ChatScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputText, setInputText] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [keyboardVisible, setKeyboardVisible] = useState(false)
  const [keyboardHeight, setKeyboardHeight] = useState(0)
  const flatListRef = useRef<FlatList<ChatMessage>>(null)
  const [contentHeight, setContentHeight] = useState(0)

  // Listen for keyboard events
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (e) => {
        setKeyboardVisible(true)
        setKeyboardHeight(e.endCoordinates.height)
        // Scroll with a delay to ensure layout has updated
        InteractionManager.runAfterInteractions(() => {
          setTimeout(() => scrollToBottom(true), 150)
        })
      },
    )

    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => {
        setKeyboardVisible(false)
        setKeyboardHeight(0)
      },
    )

    return () => {
      keyboardDidShowListener.remove()
      keyboardDidHideListener.remove()
    }
  }, [])

  // Enhanced scroll to bottom function
  const scrollToBottom = (animated = true) => {
    if (flatListRef.current && messages.length > 0) {
      // Use setTimeout to ensure the scroll happens after any pending UI updates
      setTimeout(() => {
        try {
          flatListRef.current?.scrollToEnd({ animated })
        } catch (error) {
          console.error("Error scrolling to end:", error)
        }
      }, 50)
    }
  }

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      InteractionManager.runAfterInteractions(() => {
        scrollToBottom()
      })
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

    // Immediately scroll to bottom after sending message
    scrollToBottom()

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

      // Scroll to bottom again after receiving response
      scrollToBottom()
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

  // Handle input focus - scroll to bottom
  const handleInputFocus = () => {
    // Use a timeout to ensure the keyboard is fully shown before scrolling
    InteractionManager.runAfterInteractions(() => {
      setTimeout(() => scrollToBottom(true), 300)
    })
  }

  const renderMessage = ({ item }: { item: ChatMessage }) => (
    <Animated.View
      entering={item.sender === "user" ? FadeInUp.delay(100) : FadeInDown.delay(100)}
      style={styles.messageContainer}
    >
      <MessageBubble message={item} />
    </Animated.View>
  )

  // Custom header with hamburger menu
  const renderHeader = () => (
    <View style={styles.headerWrapper}>
      <LinearGradient colors={["#000", "#121212"]} style={styles.header} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>
        <TouchableOpacity onPress={toggleSidebar} style={styles.menuButton}>
          <Menu size={24} color="#fff" />
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          {/* <LinearGradient
            colors={["#333", "#222"]}
            style={styles.titleBackground}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          > */}
            <ThemedText style={styles.title}>NIKKI ❤</ThemedText>
          {/* </LinearGradient> */}
        </View>
      </LinearGradient>
    </View>
  )

  // Track content size changes
  const handleContentSizeChange = (width: number, height: number) => {
    setContentHeight(height)
    scrollToBottom()
  }

  return (
    <ThemedView style={styles.container}>
      {/* Add the Sidebar component */}
      <Sidebar />

      {/* Replace GradientHeader with custom header */}
      {renderHeader()}

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
              contentContainerStyle={[
                styles.messagesList,
                // Add extra padding at the bottom
                { paddingBottom: keyboardVisible ? keyboardHeight + EXTRA_PADDING : EXTRA_PADDING },
              ]}
              showsVerticalScrollIndicator={true}
              onContentSizeChange={handleContentSizeChange}
              onLayout={() => {
                // Scroll to bottom on initial layout
                InteractionManager.runAfterInteractions(() => {
                  scrollToBottom(false)
                })
              }}
              removeClippedSubviews={false}
              initialNumToRender={messages.length}
              maxToRenderPerBatch={10}
              windowSize={10}
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
        <ChatInput
          value={inputText}
          onChangeText={setInputText}
          onSend={handleSendMessage}
          onFocus={handleInputFocus}
        />
      </KeyboardAvoidingView>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  headerWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: Platform.OS === "ios" ? 50 : 40,
    paddingBottom: 15,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(40, 40, 40, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  titleBackground: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 120,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 2,
    textShadowColor: "rgba(255, 255, 255, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 5,
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  messagesList: {
    paddingTop: 100, // Space for header
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

