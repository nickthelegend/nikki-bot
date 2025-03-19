import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai"
import * as SecureStore from "expo-secure-store"

// Your API key - in production, use environment variables or secure storage
// For demo purposes, we'll use a placeholder - replace with your actual API key
const API_KEY = "AIzaSyAd5C1JBKOS5ex8hyu-33-wAneu4TOeajc" // Replace with your actual API key
const MODEL_NAME = "gemini-1.5-flash"

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(API_KEY)

// System instruction for the AI
const SYSTEM_INSTRUCTION =
  "You are my girlfriend, you shall speak Telugu-English, be Gen Z style, with Telangana slang. Be affectionate, casual, and use phrases like 'ra', 'babe','abbayi','ayya', etc. Mix Telugu words with English. Use emojis occasionally."

// In-memory chat history for display purposes
let displayChatHistory: Array<{ role: string; parts: Array<{ text: string }> }> = []

// Define the message type for consistency
export interface ChatMessage {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: Date
  isError?: boolean
}

// Track if we've already loaded the history to prevent duplicates
let historyLoaded = false

// Initial greeting message (not part of the API chat history)
const initialGreeting = "Hey pilaga! How are you doing today? 😊 Nenu ready to chat with you!"

// Load chat history from secure storage on app start
export async function loadChatHistory() {
  // If we've already loaded the history, don't load it again
  if (historyLoaded) {
    return displayChatHistory
  }

  try {
    const savedHistory = await SecureStore.getItemAsync("chatHistory")
    if (savedHistory) {
      displayChatHistory = JSON.parse(savedHistory)
    } else {
      // Initialize with an empty history - we'll display the greeting separately
      displayChatHistory = []
      await saveChatHistory()
    }
    historyLoaded = true
    return displayChatHistory
  } catch (error) {
    console.error("Error loading chat history:", error)
    return displayChatHistory
  }
}

// Save chat history to secure storage
async function saveChatHistory() {
  try {
    await SecureStore.setItemAsync("chatHistory", JSON.stringify(displayChatHistory))
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

    // Add user message to display history
    displayChatHistory.push({ role: "user", parts: [{ text: message }] })

    // For the first message, use generateContent with system instruction
    if (displayChatHistory.length <= 1) {
      // Combine system instruction with user message
      const promptWithInstruction = `${SYSTEM_INSTRUCTION}\n\nUser: ${message}`

      // Generate content with the combined prompt
      const result = await model.generateContent(promptWithInstruction)
      const responseText = result.response.text()

      // Add AI response to display history
      displayChatHistory.push({ role: "model", parts: [{ text: responseText }] })

      // Save updated history
      await saveChatHistory()

      return responseText
    }

    // For subsequent messages, we'll use the chat history approach
    // First, create a history array with our system instruction as the first message
    const historyWithInstruction = [
      { role: "user", parts: [{ text: SYSTEM_INSTRUCTION }] },
      {
        role: "model",
        parts: [
          {
            text: "I understand. I'll respond as your Telugu-English speaking girlfriend with Gen Z style and Telangana slang.",
          },
        ],
      },
    ]

    // Then add the actual conversation history (skipping the first system instruction exchange)
    const chatHistory = displayChatHistory.slice(0, -1) // Exclude the current user message

    // Start a new chat with the history
    const chat = model.startChat({
      history: historyWithInstruction.concat(chatHistory),
      generationConfig: {
        temperature: 0.9, // Slightly higher temperature for more creative responses
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

    // Send the message and get a response
    const result = await chat.sendMessage(message)
    const responseText = result.response.text()

    // Add AI response to display history
    displayChatHistory.push({ role: "model", parts: [{ text: responseText }] })

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
    return "Hey ra! How are you doing? 😊 Nenu miss you so much!"
  } else if (message.toLowerCase().includes("how are you")) {
    return "I'm doing super fine mowa! Just thinking about you and all. Nuvvu ela unnav?"
  } else if (message.toLowerCase().includes("weather")) {
    return "Arey, weather is too hot ra! Baytaki vellalante kuda kastam. AC lo kurchoni let's chat all day!"
  } else if (message.toLowerCase().includes("name")) {
    return "Silly mowa, you know my name! I'm your girlfriend! 😘 Marchipoyava?"
  } else if (message.toLowerCase().includes("joke")) {
    const jokes = [
      "Why did the Telugu guy go to the party? Because party leka pothe life bokka ra! 😂",
      "What do you call a Hyderabadi ghost? Bhoot biryani! 🍗👻",
      "Nenu and you are like chai and biscuit - perfect combo mowa! 😘",
      "Why did I fall for you? Because gravity tho paatu, your smile kuda pull chesindi ra! 💕",
      "What's the difference between you and chocolate? Nothing - both are sweet and I can't live without either! 🍫",
    ]
    return jokes[Math.floor(Math.random() * jokes.length)]
  } else {
    return "Arey mowa, network issues unnai anukunta. Koncham sepu wait chesi malli try cheyyi, okay na? Miss you! 💕"
  }
}

/**
 * Clear the chat history
 */
export async function clearChatHistory(): Promise<void> {
  displayChatHistory = []
  await saveChatHistory()
}

/**
 * Get the current chat history
 * @returns The chat history as an array of messages
 */
export function getChatHistoryMessages(): Array<ChatMessage> {
  // If chat history is empty, return just the initial greeting
  if (displayChatHistory.length === 0) {
    return [
      {
        id: "initial",
        text: initialGreeting,
        sender: "bot",
        timestamp: new Date(),
      },
    ]
  }

  // Convert the chat history to the message format
  return displayChatHistory.map((message, index) => ({
    id: index.toString(),
    text: message.parts[0].text,
    sender: message.role === "user" ? "user" : "bot",
    timestamp: new Date(),
  }))
}

// Reset the history loaded flag (useful for testing or when switching users)
export function resetHistoryLoadedFlag() {
  historyLoaded = false
}

