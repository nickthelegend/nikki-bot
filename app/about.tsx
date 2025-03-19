import { StyleSheet, ScrollView, TouchableOpacity, Linking, View, Platform } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import Animated, { FadeInUp } from "react-native-reanimated"
import { router } from "expo-router"

import { ThemedText } from "@/components/ThemedText"
import { ThemedView } from "@/components/ThemedView"
import { IconSymbol } from "@/components/ui/IconSymbol"
import { toggleSidebar } from "@/utils/sidebarState"
import { Sidebar } from "@/components/Sidebar"

export default function AboutScreen() {
  const renderHeader = () => (
    <LinearGradient colors={["#000", "rgba(0,0,0,0.8)", "rgba(0,0,0,0)"]} style={styles.header}>
      <TouchableOpacity onPress={toggleSidebar} style={styles.menuButton}>
        <IconSymbol size={24} name="line.3.horizontal" color="#fff" />
      </TouchableOpacity>
      <ThemedView style={styles.titleContainer}>
        <ThemedText style={styles.title}>About</ThemedText>
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
        <Animated.View entering={FadeInUp.delay(100)} style={styles.logoContainer}>
          <LinearGradient
            colors={["#333", "#222"]}
            style={styles.logoBackground}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <IconSymbol size={80} name="sparkles" color="#fff" />
          </LinearGradient>
          <ThemedText style={styles.appName}>AI Assistant</ThemedText>
          <ThemedText style={styles.version}>Version 1.0.0</ThemedText>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(200)} style={styles.section}>
          <ThemedText style={styles.sectionTitle}>About This App</ThemedText>
          <ThemedText style={styles.sectionText}>
            AI Assistant is a powerful chatbot powered by Google's Gemini 1.5 Flash model. It provides intelligent
            responses to your questions and can assist with a wide range of tasks.
          </ThemedText>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(300)} style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Features</ThemedText>
          <View style={styles.featureItem}>
            <IconSymbol size={20} name="checkmark.circle.fill" color="#4cd964" style={styles.featureIcon} />
            <ThemedText style={styles.featureText}>Advanced AI-powered responses</ThemedText>
          </View>
          <View style={styles.featureItem}>
            <IconSymbol size={20} name="checkmark.circle.fill" color="#4cd964" style={styles.featureIcon} />
            <ThemedText style={styles.featureText}>Persistent chat history</ThemedText>
          </View>
          <View style={styles.featureItem}>
            <IconSymbol size={20} name="checkmark.circle.fill" color="#4cd964" style={styles.featureIcon} />
            <ThemedText style={styles.featureText}>Beautiful dark mode interface</ThemedText>
          </View>
          <View style={styles.featureItem}>
            <IconSymbol size={20} name="checkmark.circle.fill" color="#4cd964" style={styles.featureIcon} />
            <ThemedText style={styles.featureText}>Secure and private conversations</ThemedText>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(400)} style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Powered By</ThemedText>
          <ThemedText style={styles.sectionText}>
            Google Gemini 1.5 Flash - A state-of-the-art large language model designed to provide helpful, harmless, and
            honest responses.
          </ThemedText>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(500)} style={styles.section}>
          <TouchableOpacity style={styles.linkButton} onPress={() => Linking.openURL("https://ai.google.dev/")}>
            <ThemedText style={styles.linkText}>Learn more about Google AI</ThemedText>
            <IconSymbol size={16} name="arrow.up.right.square" color="#fff" />
          </TouchableOpacity>
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
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  logoBackground: {
    width: 120,
    height: 120,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  appName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  version: {
    fontSize: 16,
    color: "#aaa",
  },
  section: {
    width: "100%",
    marginBottom: 24,
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 16,
    color: "#ddd",
    lineHeight: 24,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  featureIcon: {
    marginRight: 12,
  },
  featureText: {
    fontSize: 16,
    color: "#ddd",
  },
  linkButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#333",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  linkText: {
    fontSize: 16,
    color: "#fff",
    marginRight: 8,
  },
})

