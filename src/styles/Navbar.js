import { StyleSheet } from "react-native";

export const navbar = StyleSheet.create({
  bottomNav: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#fff",
    paddingVertical: 8,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  navButton: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    paddingVertical: 5,
  },
  navIcon: {
    resizeMode: "contain",
    height: 28,
    width: 28,
    marginBottom: 3,
  },
  navLabel: {
    fontSize: 12,
    color: "#888",
  },
  activeNavLabel: {
    fontSize: 12,
    color: "#4CAF50",
    fontWeight: "600",
  },
  activeIndicator: {
    position: "absolute",
    top: 0,
    height: 3,
    width: "40%",
    backgroundColor: "#4CAF50",
    borderRadius: 2,
  },
});
