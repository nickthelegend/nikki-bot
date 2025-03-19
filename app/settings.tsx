"use client"

import React from "react"
import { StyleSheet, Switch, ScrollView, TouchableOpacity, Alert, Platform } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import Animated, { FadeInRight } from "react-native-reanimated"
import { router } from "expo-router"

import { ThemedText } from "@/components/ThemedText"
import { ThemedView } from "@/components/ThemedView"
import { IconSymbol } from "@/components/ui/IconSymbol"
import { clearChatHistory } from "@/utils/chatService"
import { toggleSidebar } from "@/utils/sidebarState"
import { Sidebar } from "@/components/Sidebar"

export default function SettingsScreen() {
  const [darkMode, setDarkMode] = React.useState(true)
  const [notifications, setNotifications] = React.useState(true)
  const [soundEffects, setSoundEffects] = React.useState(true)
  const [clearSuccess, setClearSuccess] = React.useState(false)

  const handleClearHistory = async () => {
    Alert.alert(
      "Clear Chat History",
      "Are you sure you want to clear your entire chat history? This cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            try {
              await clearChatHistory()
              setClearSuccess(true)
              setTimeout(() => setClearSuccess(false), 3000)
            } catch (error) {
              console.error("Error clearing chat history:", error)
              Alert.alert("Error", "Failed to clear chat history. Please try again.")
            }
          },
        },
      ],
    )
  }

  const renderSettingItem = (icon, title, description, value, onValueChange, delay = 0) => (
    <Animated.View entering={FadeInRight.delay(delay)} style={styles.settingItem}>
      <LinearGradient
        colors={["#1a1a1a", "#222"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.settingGradient}
      >
        <IconSymbol size={24} name={icon} color="#fff" style={styles.settingIcon} />
        <ThemedView style={styles.settingTextContainer}>
          <ThemedText type="subtitle">{title}</ThemedText>
          <ThemedText style={styles.settingDescription}>{description}</ThemedText>
        </ThemedView>
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: "#444", true: "#5c5c5c" }}
          thumbColor={value ? "#fff" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
        />
      </LinearGradient>
    </Animated.View>
  )

  const renderHeader = () => (
    <LinearGradient colors={["#000", "rgba(0,0,0,0.8)", "rgba(0,0,0,0)"]} style={styles.header}>
      <TouchableOpacity onPress={toggleSidebar} style={styles.menuButton}>
        <IconSymbol size={24} name="line.3.horizontal" color="#fff" />
      </TouchableOpacity>
      <ThemedView style={styles.titleContainer}>
        <ThemedText style={styles.title}>Settings</ThemedText>
      </ThemedView>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <IconSymbol size={24} name="chevron.left" color="#fff" />
      </TouchableOpacity>
    </LinearGradient>
  )

  return (
    <ThemedView style={styles.container}>
      <Sidebar />
      {renderHeader()}

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {renderSettingItem("moon.stars.fill", "Dark Mode", "Enable dark theme for the app", darkMode, setDarkMode, 100)}

        {renderSettingItem(
          "bell.badge.fill",
          "Notifications",
          "Receive chat notifications",
          notifications,
          setNotifications,
          200,
        )}

        {renderSettingItem(
          "speaker.wave.2.fill",
          "Sound Effects",
          "Play sounds for messages",
          soundEffects,
          setSoundEffects,
          300,
        )}

        <Animated.View entering={FadeInRight.delay(400)} style={styles.actionSection}>
          <TouchableOpacity onPress={handleClearHistory}>
            <LinearGradient
              colors={["#2a1a1a", "#3a2a2a"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.actionButton}
            >
              <IconSymbol size={24} name="trash.fill" color="#ff6b6b" style={styles.actionIcon} />
              <ThemedText style={styles.actionText}>Clear Chat History</ThemedText>
            </LinearGradient>
          </TouchableOpacity>

          {clearSuccess && <ThemedText style={styles.successText}>Chat history cleared successfully!</ThemedText>}
        </Animated.View>
      </ScrollView>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingTop: Platform.OS === "ios" ? 50 : 40,
    paddingBottom: 20,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(40, 40, 40, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(40, 40, 40, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 100, // Space for header
    paddingBottom: 40,
    paddingHorizontal: 16,
  },
  settingItem: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  settingGradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
  },
  settingIcon: {
    marginRight: 16,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingDescription: {
    fontSize: 14,
    color: "#aaa",
    marginTop: 4,
  },
  actionSection: {
    marginTop: 24,
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
  },
  actionIcon: {
    marginRight: 16,
  },
  actionText: {
    color: "#ff6b6b",
    fontSize: 16,
    fontWeight: "600",
  },
  successText: {
    color: "#4cd964",
    marginTop: 8,
    textAlign: "center",
  },
})

