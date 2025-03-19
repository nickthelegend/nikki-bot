"use client"

import { useState, useEffect } from "react"
import { Animated } from "react-native"

// Create a singleton state that can be imported anywhere
let isOpen = false
let listeners: Array<(open: boolean) => void> = []

// Function to toggle sidebar state
export function toggleSidebar() {
  isOpen = !isOpen
  // Notify all listeners of the change
  listeners.forEach((listener) => listener(isOpen))
}

// Function to get current state
export function isSidebarOpen() {
  return isOpen
}

// Hook to subscribe to sidebar state changes
export function useSidebarState() {
  const [sidebarOpen, setSidebarOpen] = useState(isOpen)

  useEffect(() => {
    // Add listener
    const listener = (open: boolean) => {
      setSidebarOpen(open)
    }
    listeners.push(listener)

    // Remove listener on cleanup
    return () => {
      listeners = listeners.filter((l) => l !== listener)
    }
  }, [])

  return {
    isOpen: sidebarOpen,
    toggle: toggleSidebar,
  }
}

// Animation values
const animationValues = {
  translateX: new Animated.Value(-1000), // Start offscreen
  opacity: new Animated.Value(0),
}

// Get animation values
export function getSidebarAnimations() {
  return animationValues
}

// Update animations based on sidebar state
export function updateSidebarAnimations(width: number) {
  if (isOpen) {
    Animated.parallel([
      Animated.timing(animationValues.translateX, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(animationValues.opacity, {
        toValue: 0.5,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start()
  } else {
    Animated.parallel([
      Animated.timing(animationValues.translateX, {
        toValue: -width,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(animationValues.opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start()
  }
}

