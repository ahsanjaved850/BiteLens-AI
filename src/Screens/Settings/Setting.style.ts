import { StyleSheet } from "react-native";

export const settingStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  body: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },

  // Header
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1A1A1A",
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
    fontWeight: "500",
  },

  // Profile Card
  profileCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    marginTop: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    alignItems: "center",
  },
  profileImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F0F0F0",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  profileInitials: {
    fontSize: 32,
    fontWeight: "700",
    color: "#666",
  },
  profileName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  editProfileButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 10,
    backgroundColor: "#F5F5F5",
    borderRadius: 20,
  },
  editProfileText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
  },

  // Section Styles
  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginTop: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    overflow: "hidden",
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#999",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  // Setting Item
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: "#F0F0F0",
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
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  settingItemContent: {
    flex: 1,
  },
  settingItemLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 2,
  },
  settingItemValue: {
    fontSize: 13,
    color: "#666",
    fontWeight: "500",
  },
  settingItemRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingItemValueRight: {
    fontSize: 15,
    color: "#666",
    fontWeight: "600",
    marginRight: 8,
  },
  chevronIcon: {
    color: "#999",
  },

  // Danger Zone
  dangerSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginTop: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#FEE2E2",
  },
  dangerSectionHeader: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: "#FEF2F2",
  },
  dangerSectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#DC2626",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  dangerItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
  },
  dangerItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  dangerIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FEE2E2",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  dangerItemLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#DC2626",
  },

  // Action Buttons
  actionButton: {
    backgroundColor: "#000000",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 24,
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  logoutButton: {
    backgroundColor: "#F5F5F5",
  },
  logoutButtonText: {
    color: "#1A1A1A",
  },

  // App Info
  appInfoSection: {
    alignItems: "center",
    marginTop: 32,
    marginBottom: 16,
  },
  appVersion: {
    fontSize: 13,
    color: "#999",
    fontWeight: "500",
  },
  appLogo: {
    width: 32,
    height: 32,
    borderRadius: 8,
    marginBottom: 8,
  },

  // Stats Card
  statsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginTop: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
  },
  statItem: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: "#666",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
