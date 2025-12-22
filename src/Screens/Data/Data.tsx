import { LoadingState } from "@/src/components/LoadingState/LoadingState";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
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
import { dataStyles } from "./Data.style";

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

  if (loading && !modalVisible) {
    return <LoadingState type="setup" message="Updating your profile..." />;
  }

  return (
    <SafeAreaView style={dataStyles.container} edges={["top"]}>
      <View style={dataStyles.headerContainer}>
        <Text style={dataStyles.headerTitle}>Overview</Text>
      </View>

      <ScrollView
        style={dataStyles.body}
        contentContainerStyle={dataStyles.contentContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#3B82F6"
            colors={["#3B82F6"]}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Weight Management Section */}
        <View style={dataStyles.section}>
          <View style={dataStyles.sectionHeader}>
            <View>
              <Text style={dataStyles.sectionTitle}>Weight Management</Text>
            </View>
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
              activeOpacity={0.7}
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
              activeOpacity={0.7}
            >
              <Text style={dataStyles.updateButtonText}>Update</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* BMI Section */}
        <View style={dataStyles.section}>
          <View style={dataStyles.sectionHeader}>
            <View>
              <Text style={dataStyles.sectionTitle}>Body Mass Index (BMI)</Text>
            </View>
          </View>

          <View style={dataStyles.bmiCard}>
            <View style={dataStyles.bmiHeader}>
              <Text style={dataStyles.bmiScore}>{details?.bmi || "--"}</Text>
              <Text
                style={[
                  dataStyles.bmiCategory,
                  {
                    backgroundColor: `${getBMICategoryColor(
                      details?.bmi_category || ""
                    )}15`,
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
                  { backgroundColor: "#10B981" },
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

        {/* Weight Progress Card */}
        <View style={dataStyles.weightProgressCard}>
          <View style={dataStyles.progressHeader}>
            <Text style={dataStyles.progressTitle}>Weight Progress</Text>
            {progress > 0 && (
              <View style={dataStyles.trendBadge}>
                <Ionicons name="trending-down" size={14} color="#16A34A" />
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

            <View style={dataStyles.progressBarContainer}>
              <View style={dataStyles.progressBar}>
                <View
                  style={[
                    dataStyles.progressBarFill,
                    { width: `${progress}%` },
                  ]}
                />
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
              Update your weight weekly to keep your nutrition plan accurate
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Update Weight Modal */}
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
              <Text style={dataStyles.inputLabel}>Weight ({WEIGHT_UNIT})</Text>
              <TextInput
                style={[
                  dataStyles.textInput,
                  inputFocused && dataStyles.textInputFocused,
                ]}
                placeholder="Enter weight"
                placeholderTextColor="#999"
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
                <ActivityIndicator size="large" color="#000000" />
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
                  activeOpacity={0.7}
                >
                  <Text style={dataStyles.confirmButtonText}>Confirm</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};
