import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { JSX, useState } from "react";
import {
  Linking,
  Modal,
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
  HEALTH_DISCLAIMER_TEXT,
  HEALTH_SOURCES,
  HEIGHT_UNIT,
  SECTION_TITLES,
  SETTINGS_ITEMS,
  WEIGHT_UNIT,
} from "./Setting.static";
import { GRADIENT, settingStyles } from "./Setting.style";

const HealthDisclaimerModal: React.FC<{
  visible: boolean;
  onClose: () => void;
}> = ({ visible, onClose }) => (
  <Modal
    animationType="slide"
    presentationStyle="pageSheet"
    visible={visible}
    onRequestClose={onClose}
  >
    <SafeAreaView style={settingStyles.disclaimerContainer} edges={["top"]}>
      {/* Header */}
      <View style={settingStyles.disclaimerHeader}>
        <Text style={settingStyles.disclaimerHeaderTitle}>
          Health Disclaimer
        </Text>
        <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
          <Ionicons name="close-circle" size={28} color="#B0BECA" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={settingStyles.disclaimerScrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Icon badge */}
        <View style={settingStyles.disclaimerIconWrap}>
          <Ionicons name="medical-outline" size={32} color="#F47B20" />
        </View>

        {/* Disclaimer text */}
        <Text style={settingStyles.disclaimerText}>
          {HEALTH_DISCLAIMER_TEXT}
        </Text>

        {/* Sources */}
        <View style={settingStyles.disclaimerSourcesSection}>
          <Text style={settingStyles.disclaimerSourcesTitle}>
            Scientific Sources & References
          </Text>

          {HEALTH_SOURCES.map((source, index) => (
            <TouchableOpacity
              key={index}
              style={settingStyles.disclaimerSourceCard}
              onPress={() => Linking.openURL(source.url)}
              activeOpacity={0.7}
            >
              <View style={settingStyles.disclaimerSourceContent}>
                <Text style={settingStyles.disclaimerSourceLabel}>
                  {source.title}
                </Text>
                <Text style={settingStyles.disclaimerSourceName}>
                  {source.source}
                </Text>
              </View>
              <Ionicons name="open-outline" size={16} color="#7A8A98" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Note */}
        <View style={settingStyles.disclaimerNoteCard}>
          <Ionicons
            name="information-circle-outline"
            size={16}
            color="#F47B20"
          />
          <Text style={settingStyles.disclaimerNoteText}>
            If you experience any adverse health effects, discontinue use and
            consult your doctor immediately.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  </Modal>
);

export const Setting = (): JSX.Element => {
  const {
    profile,
    refreshing,
    handleRefresh,
    handleConfirmDelete,
    handleSettingItemPress,
    getInitials,
  } = useSetting();

  const [disclaimerVisible, setDisclaimerVisible] = useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <SafeAreaView style={settingStyles.container} edges={["top"]}>
        {/* ── Header with gradient ── */}
        <LinearGradient
          colors={[GRADIENT.top, GRADIENT.mid, GRADIENT.bottom]}
          locations={[0, 0.5, 1]}
          style={settingStyles.headerContainer}
        >
          <Text style={settingStyles.headerTitle}>Settings</Text>
        </LinearGradient>

        <ScrollView
          style={settingStyles.body}
          contentContainerStyle={settingStyles.contentContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="#F47B20"
              colors={["#F47B20"]}
            />
          }
          showsVerticalScrollIndicator={false}
        >
          {/* ── Profile Card ── */}
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

          {/* ── Personal Information ── */}
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
                    color="#F47B20"
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
                    color="#F47B20"
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
                    color="#F47B20"
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

          {/* ── Physical Details ── */}
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
                    color="#F47B20"
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
                    color="#F47B20"
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
                    color="#F47B20"
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

          {/* ── Support & Legal ── */}
          <View style={settingStyles.section}>
            <View style={settingStyles.sectionHeader}>
              <Text style={settingStyles.sectionTitle}>
                {SECTION_TITLES.SUPPORT_LEGAL}
              </Text>
            </View>

            <TouchableOpacity
              style={[settingStyles.settingItem, settingStyles.settingItemLast]}
              onPress={() => {
                handleSettingItemPress();
                setDisclaimerVisible(true);
              }}
              activeOpacity={0.7}
            >
              <View style={settingStyles.settingItemLeft}>
                <View style={settingStyles.settingIconContainer}>
                  <Ionicons
                    name={SETTINGS_ITEMS.HEALTH_DISCLAIMER.icon as any}
                    size={18}
                    color="#F47B20"
                  />
                </View>
                <View style={settingStyles.settingItemContent}>
                  <Text style={settingStyles.settingItemLabel}>
                    {SETTINGS_ITEMS.HEALTH_DISCLAIMER.label}
                  </Text>
                  <Text style={settingStyles.settingItemValue}>
                    {SETTINGS_ITEMS.HEALTH_DISCLAIMER.description}
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#B0BECA" />
            </TouchableOpacity>
          </View>

          {/* ── Danger Zone ── */}
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

          {/* ── App Info — text wordmark replaces image logo ── */}
          <View style={settingStyles.appInfoSection}>
            <Text style={settingStyles.appWordmark}>orca</Text>
            <Text style={settingStyles.appVersion}>{APP_VERSION}</Text>
          </View>
        </ScrollView>

        {/* ── Health Disclaimer Modal ── */}
        <HealthDisclaimerModal
          visible={disclaimerVisible}
          onClose={() => setDisclaimerVisible(false)}
        />
      </SafeAreaView>
    </View>
  );
};
