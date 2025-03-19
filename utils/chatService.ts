import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai"
import * as SecureStore from "expo-secure-store"

// Your API key - in production, use environment variables or secure storage
// For demo purposes, we'll use a placeholder - replace with your actual API key
const API_KEY = "AIzaSyAd5C1JBKOS5ex8hyu-33-wAneu4TOeajc"; // Replace with your actual API key
const MODEL_NAME = "gemini-1.5-flash"

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(API_KEY)

// In-memory chat history
let chatHistory: Array<{ role: string; parts: Array<{ text: string }> }> = []

// Define the message type for consistency
export interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  isError?: boolean;
}

// Track if we've already loaded the history to prevent duplicates
let historyLoaded = false;

// Load chat history from secure storage on app start
export async function loadChatHistory() {
  // If we've already loaded the history, don't load it again
  if (historyLoaded) {
    return chatHistory;
  }
  
  try {
    const savedHistory = await SecureStore.getItemAsync("chatHistory")
    if (savedHistory) {
      chatHistory = JSON.parse(savedHistory)
    } else {
      // Initialize with a greeting if no history exists
      chatHistory = [
        { role: "model", parts: [{ text: "Hello, how can I help you today?" }] },
      ]
      await saveChatHistory()
    }
    historyLoaded = true;
    return chatHistory
  } catch (error) {
    console.error("Error loading chat history:", error)
    return chatHistory
  }
}

// Save chat history to secure storage
async function saveChatHistory() {
  try {
    await SecureStore.setItemAsync("chatHistory", JSON.stringify(chatHistory))
  } catch (error) {
    console.error("Error saving chat history:", error)
  }
}

/**
 * Get a chat response from the Gemini model
 * @param message - The user's message
 * @returns The AI's response
 */
export async function getChatResponse(message: string): Promise<string> {
  try {
    // Create a chat model
    const model = genAI.getGenerativeModel({ model: MODEL_NAME })

    // Start a chat session
    const chat = model.startChat({
      history: chatHistory,
      generationConfig: {
        temperature: 0.8,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 1024,
      },
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
      ],
    })

    // Add user message to history
    chatHistory.push({ role: "user", parts: [{ text: message }] })

    // Send the message and get a response
    const result = await chat.sendMessage(message)
    const responseText = result.response.text()

    // Add AI response to history
    chatHistory.push({ role: "model", parts: [{ text: responseText }] })

    // Save updated history
    await saveChatHistory()

    return responseText
  } catch (error) {
    console.error("Error getting chat response:", error)

    // Fallback to mock response if there's an error
    return getMockResponse(message)
  }
}

/**
 * Get a mock response for testing or when the API fails
 * @param message - The user's message
 * @returns A mock response
 */
function getMockResponse(message: string): string {
  if (message.toLowerCase().includes("hello") || message.toLowerCase().includes("hi")) {
    return "Hello! I'm your AI assistant. How can I help you today?"
  } else if (message.toLowerCase().includes("how are you")) {
    return "I'm functioning well, thank you for asking! How can I assist you?"
  } else if (message.toLowerCase().includes("weather")) {
    return "I don't have access to real-time weather data, but I can help you find a weather service or app that provides accurate forecasts for your location."
  } else if (message.toLowerCase().includes("name")) {
    return "I'm an AI assistant powered by Google's Gemini model. You can call me Gemini Assistant!"
  } else if (message.toLowerCase().includes("joke")) {
    const jokes = [
      "Why don't scientists trust atoms? Because they make up everything!",
      "Why did the scarecrow win an award? Because he was outstanding in his field!",
      "What do you call a fake noodle? An impasta!",
      "How does a penguin build its house? Igloos it together!",
      "Why don't eggs tell jokes? They'd crack each other up!",
    ]
    return jokes[Math.floor(Math.random() * jokes.length)]
  } else {
    return "I'm having trouble connecting to my AI services right now. Please try again later."
  }
}

/**
 * Clear the chat history
 */
export async function clearChatHistory(): Promise<void> {
  chatHistory = [{ role: "model", parts: [{ text: "Hello, how can I help you today?" }] }]
  await saveChatHistory()
}

/**
 * Get the current chat history
 * @returns The chat history as an array of messages
 */
export function getChatHistoryMessages(): Array<ChatMessage> {
  // Convert the chat history to the message format
  return chatHistory.map((message, index) => ({
    id: index.toString(),
    text: message.parts[0].text,
    sender: message.role === "user" ? "user" : "bot",
    timestamp: new Date(),
  }))
}
