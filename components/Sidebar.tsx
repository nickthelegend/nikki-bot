"use client"

import { useEffect } from "react"
import { StyleSheet, TouchableOpacity, View, Animated, Dimensions, Platform } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { router } from "expo-router"

import { ThemedText } from "@/components/ThemedText"
import { IconSymbol } from "@/components/ui/IconSymbol"
import { useSidebarState, toggleSidebar, getSidebarAnimations, updateSidebarAnimations } from "@/utils/sidebarState"

const { width } = Dimensions.get("window")
const SIDEBAR_WIDTH = width * 0.75

export function Sidebar() {
  const { isOpen } = useSidebarState()
  const { translateX, opacity } = getSidebarAnimations()

  useEffect(() => {
    updateSidebarAnimations(SIDEBAR_WIDTH)
  }, [isOpen])

  const navigateTo = (route) => {
    toggleSidebar()
    setTimeout(() => {
      router.push(route)
    }, 300)
  }

  return (
    <>
      <Animated.View
        style={[
          styles.overlay,
          {
            opacity,
            display: isOpen ? "flex" : "none",
          },
        ]}
        pointerEvents={isOpen ? "auto" : "none"}
        onTouchStart={toggleSidebar}
      />
      <Animated.View
        style={[
          styles.sidebar,
          {
            transform: [{ translateX }],
          },
        ]}
      >
        <LinearGradient colors={["#121212", "#1a1a1a"]} style={styles.sidebarContent}>
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <IconSymbol size={32} name="sparkles" color="#fff" />
              <ThemedText style={styles.appName}>AI Assistant</ThemedText>
            </View>
            <TouchableOpacity onPress={toggleSidebar} style={styles.closeButton}>
              <IconSymbol size={24} name="xmark" color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.menuItems}>
            <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo("/")}>
              <IconSymbol size={24} name="bubble.left.fill" color="#fff" style={styles.menuIcon} />
              <ThemedText style={styles.menuText}>Chat</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo("/settings")}>
              <IconSymbol size={24} name="gear" color="#fff" style={styles.menuIcon} />
              <ThemedText style={styles.menuText}>Settings</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo("/about")}>
              <IconSymbol size={24} name="info.circle.fill" color="#fff" style={styles.menuIcon} />
              <ThemedText style={styles.menuText}>About</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo("/contact")}>
              <IconSymbol size={24} name="envelope.fill" color="#fff" style={styles.menuIcon} />
              <ThemedText style={styles.menuText}>Contact</ThemedText>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <ThemedText style={styles.version}>Version 1.0.0</ThemedText>
          </View>
        </LinearGradient>
      </Animated.View>
    </>
  )
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#000",
    zIndex: 10,
  },
  sidebar: {
    position: "absolute",
    top: 0,
    left: 0,
    width: SIDEBAR_WIDTH,
    height: "100%",
    zIndex: 20,
  },
  sidebarContent: {
    flex: 1,
    paddingTop: Platform.OS === "ios" ? 50 : 30,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  appName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: 10,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(40, 40, 40, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  menuItems: {
    marginTop: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  menuIcon: {
    marginRight: 15,
  },
  menuText: {
    fontSize: 18,
    color: "#fff",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  version: {
    fontSize: 14,
    color: "#777",
  },
})

