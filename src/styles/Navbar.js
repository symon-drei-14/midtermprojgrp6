// styles/Navbar.js
import { StyleSheet, Platform } from "react-native";

export const navbar = StyleSheet.create({
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderTopWidth: 1,
    borderTopColor: "rgba(226, 232, 240, 0.5)",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: Platform.OS === "ios" ? 24 : 16,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  navButton: {
    flexDirection: "column",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 16,
    minWidth: 60,
  },
  navButtonActive: {
    backgroundColor: "#DBEAFE",
    transform: [{ scale: 1.05 }],
  },
  navIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  navIconImg: {
    width: 24,
    height: 24,
    marginBottom: 4,
  },
  navLabel: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
  navLabelActive: {
    color: "#3B82F6",
    fontWeight: "600",
  },
});