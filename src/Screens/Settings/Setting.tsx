import { Ionicons } from "@expo/vector-icons";
import { JSX } from "react";
import {
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSetting } from "./Setting.logic";
import {
  APP_VERSION,
  HEIGHT_UNIT,
  SECTION_TITLES,
  SETTINGS_ITEMS,
  WEIGHT_UNIT,
} from "./Setting.static";
import { settingStyles } from "./Setting.style";

export const Setting = (): JSX.Element => {
  const {
    profile,
    refreshing,
    handleRefresh,
    handleConfirmDelete,
    handleSettingItemPress,
    getInitials,
  } = useSetting();

  return (
    <SafeAreaView style={settingStyles.container} edges={["top"]}>
      <View style={settingStyles.headerContainer}>
        <Text style={settingStyles.headerTitle}>Settings</Text>
      </View>

      <ScrollView
        style={settingStyles.body}
        contentContainerStyle={settingStyles.contentContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#F5A623"
            colors={["#F5A623"]}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <View style={settingStyles.profileCard}>
          <View style={settingStyles.profileImageContainer}>
            <Text style={settingStyles.profileInitials}>
              {getInitials(profile?.full_name || "")}
            </Text>
          </View>
          <Text style={settingStyles.profileName}>
            {profile?.full_name || "User"}
          </Text>
        </View>

        {/* Personal Information */}
        <View style={settingStyles.section}>
          <View style={settingStyles.sectionHeader}>
            <Text style={settingStyles.sectionTitle}>
              {SECTION_TITLES.PERSONAL_INFO}
            </Text>
          </View>

          <View style={settingStyles.settingItem}>
            <View style={settingStyles.settingItemLeft}>
              <View style={settingStyles.settingIconContainer}>
                <Ionicons
                  name={SETTINGS_ITEMS.FULL_NAME.icon as any}
                  size={18}
                  color="#5A6B7E"
                />
              </View>
              <View style={settingStyles.settingItemContent}>
                <Text style={settingStyles.settingItemLabel}>
                  {SETTINGS_ITEMS.FULL_NAME.label}
                </Text>
                <Text style={settingStyles.settingItemValue}>
                  {profile?.full_name || SETTINGS_ITEMS.FULL_NAME.placeholder}
                </Text>
              </View>
            </View>
          </View>

          <View style={settingStyles.settingItem}>
            <View style={settingStyles.settingItemLeft}>
              <View style={settingStyles.settingIconContainer}>
                <Ionicons
                  name={SETTINGS_ITEMS.AGE.icon as any}
                  size={18}
                  color="#5A6B7E"
                />
              </View>
              <View style={settingStyles.settingItemContent}>
                <Text style={settingStyles.settingItemLabel}>
                  {SETTINGS_ITEMS.AGE.label}
                </Text>
                <Text style={settingStyles.settingItemValue}>
                  {profile?.age
                    ? `${profile.age} ${SETTINGS_ITEMS.AGE.suffix}`
                    : SETTINGS_ITEMS.AGE.placeholder}
                </Text>
              </View>
            </View>
          </View>

          <View
            style={[settingStyles.settingItem, settingStyles.settingItemLast]}
          >
            <View style={settingStyles.settingItemLeft}>
              <View style={settingStyles.settingIconContainer}>
                <Ionicons
                  name={SETTINGS_ITEMS.GENDER.icon as any}
                  size={18}
                  color="#5A6B7E"
                />
              </View>
              <View style={settingStyles.settingItemContent}>
                <Text style={settingStyles.settingItemLabel}>
                  {SETTINGS_ITEMS.GENDER.label}
                </Text>
                <Text style={settingStyles.settingItemValue}>
                  {profile?.gender || SETTINGS_ITEMS.GENDER.placeholder}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Physical Details */}
        <View style={settingStyles.section}>
          <View style={settingStyles.sectionHeader}>
            <Text style={settingStyles.sectionTitle}>
              {SECTION_TITLES.PHYSICAL_DETAILS}
            </Text>
          </View>

          <View style={settingStyles.settingItem}>
            <View style={settingStyles.settingItemLeft}>
              <View style={settingStyles.settingIconContainer}>
                <Ionicons
                  name={SETTINGS_ITEMS.WEIGHT.icon as any}
                  size={18}
                  color="#5A6B7E"
                />
              </View>
              <View style={settingStyles.settingItemContent}>
                <Text style={settingStyles.settingItemLabel}>
                  {SETTINGS_ITEMS.WEIGHT.label}
                </Text>
              </View>
            </View>
            <View style={settingStyles.settingItemRight}>
              <Text style={settingStyles.settingItemValueRight}>
                {profile?.weight
                  ? `${profile.weight} ${WEIGHT_UNIT}`
                  : SETTINGS_ITEMS.WEIGHT.placeholder}
              </Text>
            </View>
          </View>

          <View style={settingStyles.settingItem}>
            <View style={settingStyles.settingItemLeft}>
              <View style={settingStyles.settingIconContainer}>
                <Ionicons
                  name={SETTINGS_ITEMS.HEIGHT.icon as any}
                  size={18}
                  color="#5A6B7E"
                />
              </View>
              <View style={settingStyles.settingItemContent}>
                <Text style={settingStyles.settingItemLabel}>
                  {SETTINGS_ITEMS.HEIGHT.label}
                </Text>
              </View>
            </View>
            <View style={settingStyles.settingItemRight}>
              <Text style={settingStyles.settingItemValueRight}>
                {profile?.height
                  ? `${profile.height} ${HEIGHT_UNIT}`
                  : SETTINGS_ITEMS.HEIGHT.placeholder}
              </Text>
            </View>
          </View>

          <View
            style={[settingStyles.settingItem, settingStyles.settingItemLast]}
          >
            <View style={settingStyles.settingItemLeft}>
              <View style={settingStyles.settingIconContainer}>
                <Ionicons
                  name={SETTINGS_ITEMS.GOAL_WEIGHT.icon as any}
                  size={18}
                  color="#5A6B7E"
                />
              </View>
              <View style={settingStyles.settingItemContent}>
                <Text style={settingStyles.settingItemLabel}>
                  {SETTINGS_ITEMS.GOAL_WEIGHT.label}
                </Text>
              </View>
            </View>
            <View style={settingStyles.settingItemRight}>
              <Text style={settingStyles.settingItemValueRight}>
                {profile?.target_weight
                  ? `${profile.target_weight} ${WEIGHT_UNIT}`
                  : SETTINGS_ITEMS.GOAL_WEIGHT.placeholder}
              </Text>
            </View>
          </View>
        </View>

        {/* Support & Legal */}
        <View style={settingStyles.section}>
          <View style={settingStyles.sectionHeader}>
            <Text style={settingStyles.sectionTitle}>
              {SECTION_TITLES.SUPPORT_LEGAL}
            </Text>
          </View>

          <TouchableOpacity
            style={settingStyles.settingItem}
            activeOpacity={0.7}
            onPress={handleSettingItemPress}
          >
            <View style={settingStyles.settingItemLeft}>
              <View style={settingStyles.settingIconContainer}>
                <Ionicons
                  name={SETTINGS_ITEMS.HELP_CENTER.icon as any}
                  size={18}
                  color="#5A6B7E"
                />
              </View>
              <View style={settingStyles.settingItemContent}>
                <Text style={settingStyles.settingItemLabel}>
                  {SETTINGS_ITEMS.HELP_CENTER.label}
                </Text>
                <Text style={settingStyles.settingItemValue}>
                  {SETTINGS_ITEMS.HELP_CENTER.description}
                </Text>
              </View>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              style={settingStyles.chevronIcon}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={settingStyles.settingItem}
            activeOpacity={0.7}
            onPress={handleSettingItemPress}
          >
            <View style={settingStyles.settingItemLeft}>
              <View style={settingStyles.settingIconContainer}>
                <Ionicons
                  name={SETTINGS_ITEMS.TERMS.icon as any}
                  size={18}
                  color="#5A6B7E"
                />
              </View>
              <View style={settingStyles.settingItemContent}>
                <Text style={settingStyles.settingItemLabel}>
                  {SETTINGS_ITEMS.TERMS.label}
                </Text>
                <Text style={settingStyles.settingItemValue}>
                  {SETTINGS_ITEMS.TERMS.description}
                </Text>
              </View>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              style={settingStyles.chevronIcon}
            />
          </TouchableOpacity>
        </View>

        {/* Danger Zone */}
        <View style={settingStyles.dangerSection}>
          <View style={settingStyles.dangerSectionHeader}>
            <Text style={settingStyles.dangerSectionTitle}>
              {SECTION_TITLES.DANGER_ZONE}
            </Text>
          </View>

          <TouchableOpacity
            style={settingStyles.dangerItem}
            onPress={handleConfirmDelete}
            activeOpacity={0.7}
          >
            <View style={settingStyles.dangerItemLeft}>
              <View style={settingStyles.dangerIconContainer}>
                <Ionicons
                  name={SETTINGS_ITEMS.DELETE_ACCOUNT.icon as any}
                  size={18}
                  color="#DC2626"
                />
              </View>
              <Text style={settingStyles.dangerItemLabel}>
                {SETTINGS_ITEMS.DELETE_ACCOUNT.label}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#DC2626" />
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View style={settingStyles.appInfoSection}>
          <Image
            source={require("@/assets/images/nutritrack-app-icon-1024.png")}
            style={{ width: 44, height: 44, borderRadius: 12 }}
            resizeMode="contain"
          />
          <Text style={settingStyles.appVersion}>{APP_VERSION}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};