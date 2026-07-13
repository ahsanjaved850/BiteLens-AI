import { LoadingState } from "@/src/components/LoadingState/LoadingState";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Linking,
  Modal,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useData } from "./Data.logic";
import { MODAL_SUBTITLES, MODAL_TITLES, WEIGHT_UNIT } from "./Data.static";
import { dataStyles, GRADIENT } from "./Data.style";
import { WeightTrendCard } from "./WeightTrendCard";

const SOURCES = {
  BMI: {
    label: "WHO — Body Mass Index Classification",
    url: "https://www.who.int/data/gho/data/themes/topics/topic-details/GHO/body-mass-index",
  },
  TDEE: {
    label: "Mifflin-St Jeor Equation — PubMed",
    url: "https://pubmed.ncbi.nlm.nih.gov/15883556/",
  },
  MACROS: {
    label: "Dietary Reference Intakes — National Academies",
    url: "https://nap.nationalacademies.org/catalog/10490/dietary-reference-intakes-for-energy-carbohydrate-fiber-fat-fatty-acids-cholesterol-protein-and-amino-acids",
  },
  WEIGHT: {
    label: "NIH — Weight Management Guidelines",
    url: "https://www.niddk.nih.gov/health-information/weight-management",
  },
} as const;

const CitationLink: React.FC<{ label: string; url: string }> = ({
  label,
  url,
}) => (
  <TouchableOpacity
    onPress={() => Linking.openURL(url)}
    activeOpacity={0.6}
    style={dataStyles.citationRow}
  >
    <Ionicons name="open-outline" size={12} color="#7A8A98" />
    <Text style={dataStyles.citationText}>{label}</Text>
  </TouchableOpacity>
);

export const DataOverview = () => {
  const {
    details,
    profile,
    modalVisible,
    modalType,
    inputValue,
    loading,
    refreshing,
    inputFocused,
    weightLogs,
    progress,
    weightDifference,
    handleRefresh,
    handleOpenModal,
    handleCloseModal,
    handleConfirmWeight,
    getBMICategoryColor,
    setInputValue,
    setInputFocused,
  } = useData();

  // Controls the collapsible sources dropdown
  const [sourcesOpen, setSourcesOpen] = useState(false);

  if (loading && !modalVisible) {
    return <LoadingState type="setup" message="Updating your profile..." />;
  }

  return (
    /*
     * Same pattern as Home & Login:
     * Outer View = white  →  owns bottom home-indicator (no peach bar)
     * SafeAreaView edges={["top"]}  →  top status bar stays peach
     * LinearGradient on header: peach → cream → white
     */
    <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <SafeAreaView style={dataStyles.container} edges={["top"]}>
        {/* ── Header with gradient ── */}
        <LinearGradient
          colors={[GRADIENT.top, GRADIENT.mid, GRADIENT.bottom]}
          locations={[0, 0.5, 1]}
          style={dataStyles.headerContainer}
        >
          <Text style={dataStyles.headerTitle}>Progress</Text>
        </LinearGradient>

        <ScrollView
          style={dataStyles.body}
          contentContainerStyle={dataStyles.contentContainer}
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
          {/* ── Weight Management ── */}
          <View style={dataStyles.section}>
            <View style={dataStyles.sectionHeader}>
              <Text style={dataStyles.sectionTitle}>Weight Management</Text>
            </View>

            <View style={dataStyles.dataCard}>
              <View style={dataStyles.dataCardLeft}>
                <Text style={dataStyles.dataCardLabel}>Current Weight</Text>
                <Text style={dataStyles.dataCardValue}>
                  {profile?.weight || "--"}
                  <Text style={dataStyles.dataCardUnit}> {WEIGHT_UNIT}</Text>
                </Text>
              </View>
              <TouchableOpacity
                style={dataStyles.updateButton}
                onPress={() => handleOpenModal("current")}
                activeOpacity={0.75}
              >
                <Text style={dataStyles.updateButtonText}>Log</Text>
              </TouchableOpacity>
            </View>

            <View style={dataStyles.dataCard}>
              <View style={dataStyles.dataCardLeft}>
                <Text style={dataStyles.dataCardLabel}>Goal Weight</Text>
                <Text style={dataStyles.dataCardValue}>
                  {profile?.target_weight || "--"}
                  <Text style={dataStyles.dataCardUnit}> {WEIGHT_UNIT}</Text>
                </Text>
              </View>
              <TouchableOpacity
                style={dataStyles.updateButton}
                onPress={() => handleOpenModal("goal")}
                activeOpacity={0.75}
              >
                <Text style={dataStyles.updateButtonText}>Update</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ── Weight Trend Graph ── */}
          <WeightTrendCard
            logs={weightLogs}
            currentWeight={profile?.weight}
            goalWeight={profile?.target_weight}
          />

          {/* ── BMI ── */}
          <View style={dataStyles.section}>
            <View style={dataStyles.sectionHeader}>
              <Text style={dataStyles.sectionTitle}>Body Mass Index</Text>
            </View>

            <View style={dataStyles.bmiCard}>
              <View style={dataStyles.bmiHeader}>
                <Text style={dataStyles.bmiScore}>{details?.bmi || "--"}</Text>
                <Text
                  style={[
                    dataStyles.bmiCategory,
                    {
                      backgroundColor: `${getBMICategoryColor(details?.bmi_category || "")}20`,
                      color: getBMICategoryColor(details?.bmi_category || ""),
                    },
                  ]}
                >
                  {details?.bmi_category || "Calculating..."}
                </Text>
              </View>

              <View style={dataStyles.bmiScale}>
                <View
                  style={[
                    dataStyles.bmiScaleSegment,
                    { backgroundColor: "#3B82F6" },
                  ]}
                />
                <View
                  style={[
                    dataStyles.bmiScaleSegment,
                    { backgroundColor: "#2ECC71" },
                  ]}
                />
                <View
                  style={[
                    dataStyles.bmiScaleSegment,
                    { backgroundColor: "#F59E0B" },
                  ]}
                />
                <View
                  style={[
                    dataStyles.bmiScaleSegment,
                    { backgroundColor: "#EF4444" },
                  ]}
                />
              </View>
            </View>
          </View>

          {/* ── Weight Progress ── */}
          <View style={dataStyles.weightProgressCard}>
            <View style={dataStyles.progressHeader}>
              <Text style={dataStyles.progressTitle}>Weight Progress</Text>
              {progress > 0 && (
                <View style={dataStyles.trendBadge}>
                  <Ionicons name="trending-down" size={14} color="#2ECC71" />
                  <Text style={dataStyles.trendText}>On Track</Text>
                </View>
              )}
            </View>

            <View style={dataStyles.weightVisualization}>
              <View style={dataStyles.weightBox}>
                <Text style={dataStyles.weightLabel}>Current</Text>
                <Text style={dataStyles.weightValue}>
                  {profile?.weight || "--"}
                  <Text style={dataStyles.weightUnit}> {WEIGHT_UNIT}</Text>
                </Text>
              </View>

              <View style={dataStyles.progressTrackWrap}>
                <View style={dataStyles.progressTrackBase}>
                  <LinearGradient
                    colors={["#FDBA74", "#F47B20"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[
                      dataStyles.progressTrackFill,
                      { width: `${Math.min(progress, 100)}%` },
                    ]}
                  />
                </View>

                {/* "You are here" marker — walks toward the goal as progress increases */}
                <View
                  style={[
                    dataStyles.progressMarker,
                    { left: `${Math.min(Math.max(progress, 4), 96)}%` },
                  ]}
                >
                  <View style={dataStyles.progressMarkerDot}>
                    <Ionicons name="walk" size={12} color="#FFFFFF" />
                  </View>
                </View>

                {/* Goal flag — the destination the marker is heading toward */}
                <View style={dataStyles.progressFlag}>
                  <Ionicons name="flag" size={14} color="#F47B20" />
                </View>

                <Text style={dataStyles.progressPercentage}>
                  {weightDifference} {WEIGHT_UNIT} to go
                </Text>
              </View>

              <View style={dataStyles.weightBox}>
                <Text style={dataStyles.weightLabel}>Goal</Text>
                <Text style={dataStyles.weightValue}>
                  {profile?.target_weight || "--"}
                  <Text style={dataStyles.weightUnit}> {WEIGHT_UNIT}</Text>
                </Text>
              </View>
            </View>

            <View style={dataStyles.noteCard}>
              <Text style={dataStyles.noteText}>
                - Update your weight weekly to keep your nutrition plan accurate
              </Text>
            </View>
          </View>

          {/* ── Health Disclaimer & Sources — collapsible dropdown ── */}
          <View style={dataStyles.disclaimerCard}>
            {/*
             * Tappable trigger row — toggles the dropdown.
             * Chevron icon rotates 180° when open to signal state clearly.
             */}
            <TouchableOpacity
              style={dataStyles.disclaimerTrigger}
              onPress={() => setSourcesOpen((prev) => !prev)}
              activeOpacity={0.7}
            >
              <View style={dataStyles.disclaimerTriggerLeft}>
                <Ionicons
                  name="information-circle-outline"
                  size={18}
                  color="#F47B20"
                />
                <Text style={dataStyles.disclaimerTitle}>
                  Health Information Sources
                </Text>
              </View>
              <Ionicons
                name={sourcesOpen ? "chevron-up" : "chevron-down"}
                size={18}
                color="#B0BECA"
              />
            </TouchableOpacity>

            {/* Expanded body — only rendered when open */}
            {sourcesOpen && (
              <View style={dataStyles.disclaimerBody}>
                <Text style={dataStyles.disclaimerText}>
                  Calculations in this app are based on established scientific
                  formulas and guidelines. This information is for general
                  wellness purposes only and does not constitute medical advice.
                  Consult a healthcare professional before making significant
                  changes to your diet or exercise routine.
                </Text>

                <View style={dataStyles.sourcesContainer}>
                  <CitationLink
                    label={SOURCES.BMI.label}
                    url={SOURCES.BMI.url}
                  />
                  <CitationLink
                    label={SOURCES.TDEE.label}
                    url={SOURCES.TDEE.url}
                  />
                  <CitationLink
                    label={SOURCES.MACROS.label}
                    url={SOURCES.MACROS.url}
                  />
                  <CitationLink
                    label={SOURCES.WEIGHT.label}
                    url={SOURCES.WEIGHT.url}
                  />
                </View>
              </View>
            )}
          </View>
        </ScrollView>

        {/* ── Weight Modal ── */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={handleCloseModal}
        >
          <View style={dataStyles.modalOverlay}>
            <View style={dataStyles.modalContent}>
              <Text style={dataStyles.modalTitle}>
                {modalType === "current"
                  ? MODAL_TITLES.CURRENT
                  : MODAL_TITLES.GOAL}
              </Text>
              <Text style={dataStyles.modalSubtitle}>
                {modalType === "current"
                  ? MODAL_SUBTITLES.CURRENT
                  : MODAL_SUBTITLES.GOAL}
              </Text>

              <View style={dataStyles.inputContainer}>
                <Text style={dataStyles.inputLabel}>
                  Weight ({WEIGHT_UNIT})
                </Text>
                <TextInput
                  style={[
                    dataStyles.textInput,
                    inputFocused && dataStyles.textInputFocused,
                  ]}
                  placeholder="Enter weight"
                  placeholderTextColor="#B0BECA"
                  keyboardType="decimal-pad"
                  value={inputValue}
                  onChangeText={setInputValue}
                  editable={!loading}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  autoFocus
                />
              </View>

              {loading ? (
                <View style={dataStyles.loadingContainer}>
                  <ActivityIndicator size="large" color="#F47B20" />
                  <Text style={dataStyles.loadingText}>Updating...</Text>
                </View>
              ) : (
                <View style={dataStyles.buttonContainer}>
                  <TouchableOpacity
                    onPress={handleCloseModal}
                    style={dataStyles.cancelButton}
                    activeOpacity={0.7}
                  >
                    <Text style={dataStyles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handleConfirmWeight}
                    style={dataStyles.confirmButton}
                    activeOpacity={0.75}
                  >
                    <Text style={dataStyles.confirmButtonText}>Confirm</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </View>
  );
};
