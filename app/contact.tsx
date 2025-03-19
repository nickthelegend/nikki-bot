"use client"

import { useState } from "react"
import { StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, View, Platform } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import Animated, { FadeInUp } from "react-native-reanimated"
import { router } from "expo-router"

import { ThemedText } from "@/components/ThemedText"
import { ThemedView } from "@/components/ThemedView"
import { IconSymbol } from "@/components/ui/IconSymbol"
import { toggleSidebar } from "@/utils/sidebarState"
import { Sidebar } from "@/components/Sidebar"

export default function ContactScreen() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = () => {
    if (!name.trim() || !email.trim() || !message.trim()) {
      Alert.alert("Error", "Please fill in all fields")
      return
    }

    if (!email.includes("@") || !email.includes(".")) {
      Alert.alert("Error", "Please enter a valid email address")
      return
    }

    setIsSubmitting(true)

    // Simulate sending the message
    setTimeout(() => {
      setIsSubmitting(false)
      Alert.alert("Message Sent", "Thank you for your message. We'll get back to you soon!", [
        {
          text: "OK",
          onPress: () => {
            setName("")
            setEmail("")
            setMessage("")
          },
        },
      ])
    }, 1500)
  }

  const renderHeader = () => (
    <LinearGradient colors={["#000", "rgba(0,0,0,0.8)", "rgba(0,0,0,0)"]} style={styles.header}>
      <TouchableOpacity onPress={toggleSidebar} style={styles.menuButton}>
        <IconSymbol size={24} name="line.3.horizontal" color="#fff" />
      </TouchableOpacity>
      <ThemedView style={styles.titleContainer}>
        <ThemedText style={styles.title}>Contact Us</ThemedText>
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
        <Animated.View entering={FadeInUp.delay(100)} style={styles.introSection}>
          <ThemedText style={styles.introTitle}>Get in Touch</ThemedText>
          <ThemedText style={styles.introText}>
            Have questions, feedback, or need assistance? We'd love to hear from you. Fill out the form below and we'll
            get back to you as soon as possible.
          </ThemedText>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(200)} style={styles.formSection}>
          <View style={styles.inputContainer}>
            <ThemedText style={styles.inputLabel}>Name</ThemedText>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              placeholderTextColor="#777"
            />
          </View>

          <View style={styles.inputContainer}>
            <ThemedText style={styles.inputLabel}>Email</ThemedText>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Your email address"
              placeholderTextColor="#777"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <ThemedText style={styles.inputLabel}>Message</ThemedText>
            <TextInput
              style={[styles.input, styles.messageInput]}
              value={message}
              onChangeText={setMessage}
              placeholder="Your message"
              placeholderTextColor="#777"
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
          </View>

          <TouchableOpacity
            style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <LinearGradient
              colors={isSubmitting ? ["#333", "#444"] : ["#444", "#555"]}
              style={styles.submitButtonGradient}
            >
              <ThemedText style={styles.submitButtonText}>{isSubmitting ? "Sending..." : "Send Message"}</ThemedText>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(300)} style={styles.contactInfoSection}>
          <ThemedText style={styles.contactInfoTitle}>Other Ways to Reach Us</ThemedText>

          <View style={styles.contactItem}>
            <IconSymbol size={20} name="envelope.fill" color="#fff" style={styles.contactIcon} />
            <ThemedText style={styles.contactText}>support@aiassistant.com</ThemedText>
          </View>

          <View style={styles.contactItem}>
            <IconSymbol size={20} name="phone.fill" color="#fff" style={styles.contactIcon} />
            <ThemedText style={styles.contactText}>+1 (555) 123-4567</ThemedText>
          </View>

          <View style={styles.contactItem}>
            <IconSymbol size={20} name="location.fill" color="#fff" style={styles.contactIcon} />
            <ThemedText style={styles.contactText}>123 AI Street, Tech City, TC 12345</ThemedText>
          </View>
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
    paddingTop: 100,
    paddingBottom: 40,
    paddingHorizontal: 16,
  },
  introSection: {
    marginBottom: 24,
  },
  introTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 12,
  },
  introText: {
    fontSize: 16,
    color: "#ddd",
    lineHeight: 24,
  },
  formSection: {
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#333",
    borderRadius: 8,
    padding: 12,
    color: "#fff",
    fontSize: 16,
  },
  messageInput: {
    minHeight: 120,
  },
  submitButton: {
    marginTop: 8,
    borderRadius: 8,
    overflow: "hidden",
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonGradient: {
    paddingVertical: 14,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  contactInfoSection: {
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    padding: 16,
  },
  contactInfoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 16,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  contactIcon: {
    marginRight: 12,
  },
  contactText: {
    fontSize: 16,
    color: "#ddd",
  },
})

