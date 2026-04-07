import { StyleSheet } from "react-native";

const C = {
  bg: "#FFFDF7",
  bgWarm: "#FFF9ED",
  bgCard: "#FFFFFF",
  bgGray: "#F5F3EE",

  textDark: "#0F1923",
  text: "#1B2838",
  textSec: "#5A6B7E",
  textLight: "#9CA8B7",
  textOnDark: "#FFFFFF",

  primary: "#F5A623",
  primaryLight: "#FFF8EC",
  primaryMuted: "#FFE8C2",

  secondary: "#1B2838",
  accent: "#FF6B35",

  border: "#EDE8DF",
  borderLight: "#F5F0E8",
  divider: "#F0EBE3",

  danger: "#DC2626",
  dangerLight: "#FEF2F2",
  dangerBorder: "#FECACA",
};

export const settingStyles = StyleSheet.create({
  // ─── Shell ─────────────────────────────────────────────────────
  container: {
    flex: 1,
    backgroundColor: C.bg,
  },
  body: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 110,
  },

  // ─── Header ────────────────────────────────────────────────────
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: C.textDark,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: C.textSec,
    marginTop: 4,
    fontWeight: "500",
  },

  // ─── Profile Card ──────────────────────────────────────────────
  profileCard: {
    backgroundColor: C.bgCard,
    borderRadius: 24,
    marginTop: 12,
    padding: 24,
    shadowColor: "#1B2838",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 4,
    alignItems: "center",
  },
  profileImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: C.primaryMuted,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  profileInitials: {
    fontSize: 30,
    fontWeight: "800",
    color: C.primary,
  },
  profileName: {
    fontSize: 22,
    fontWeight: "800",
    color: C.textDark,
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  profileEmail: {
    fontSize: 14,
    color: C.textSec,
    fontWeight: "500",
  },
  editProfileButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 10,
    backgroundColor: C.bgGray,
    borderRadius: 50,
  },
  editProfileText: {
    fontSize: 14,
    fontWeight: "600",
    color: C.text,
  },

  // ─── Section ───────────────────────────────────────────────────
  section: {
    backgroundColor: C.bgCard,
    borderRadius: 20,
    marginTop: 16,
    shadowColor: "#1B2838",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
    overflow: "hidden",
  },
  sectionHeader: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: C.textLight,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },

  // ─── Setting Item ──────────────────────────────────────────────
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: C.borderLight,
  },
  settingItemLast: {
    borderBottomWidth: 0,
  },
  settingItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingIconContainer: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: C.bgGray,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  settingItemContent: {
    flex: 1,
  },
  settingItemLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: C.textDark,
    marginBottom: 2,
  },
  settingItemValue: {
    fontSize: 13,
    color: C.textSec,
    fontWeight: "500",
  },
  settingItemRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingItemValueRight: {
    fontSize: 15,
    color: C.textSec,
    fontWeight: "600",
    marginRight: 8,
  },
  chevronIcon: {
    color: C.textLight,
  },

  // ─── Danger Zone ───────────────────────────────────────────────
  dangerSection: {
    backgroundColor: C.bgCard,
    borderRadius: 20,
    marginTop: 16,
    shadowColor: "#1B2838",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: C.dangerBorder,
  },
  dangerSectionHeader: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 10,
    backgroundColor: C.dangerLight,
  },
  dangerSectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: C.danger,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  dangerItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: C.bgCard,
  },
  dangerItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  dangerIconContainer: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: C.dangerLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  dangerItemLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: C.danger,
  },

  // ─── Action Buttons ────────────────────────────────────────────
  actionButton: {
    backgroundColor: C.secondary,
    paddingVertical: 16,
    borderRadius: 50,
    alignItems: "center",
    marginTop: 24,
    shadowColor: C.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: C.textOnDark,
  },
  logoutButton: {
    backgroundColor: C.bgGray,
    shadowOpacity: 0,
    elevation: 0,
  },
  logoutButtonText: {
    color: C.text,
  },

  // ─── App Info ──────────────────────────────────────────────────
  appInfoSection: {
    alignItems: "center",
    marginTop: 32,
    marginBottom: 16,
  },
  appVersion: {
    fontSize: 13,
    color: C.textLight,
    fontWeight: "500",
    marginTop: 8,
  },
  appLogo: {
    width: 32,
    height: 32,
    borderRadius: 8,
    marginBottom: 8,
  },

  // ─── Stats Card ────────────────────────────────────────────────
  statsCard: {
    backgroundColor: C.bgCard,
    borderRadius: 20,
    marginTop: 16,
    padding: 20,
    shadowColor: "#1B2838",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
  },
  statItem: {
    flex: 1,
    backgroundColor: C.bgWarm,
    borderRadius: 16,
    padding: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: C.borderLight,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "800",
    color: C.textDark,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: C.textSec,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});