import { getInitialDetails, getProfile } from "@/backend/getData";
import { updateWeightStats } from "@/backend/sendData";
import { LoadingState } from "@/src/components/LoadingState/LoadingState";
import { dataAnalysis } from "@/src/utils/dataAnalysis";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  Vibration,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { dataStyles } from "./Data.style";

export const DataOverview = () => {
  const [details, setDetails] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<"current" | "goal" | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);

  const fetchData = async (showRefreshing = false) => {
    try {
      if (showRefreshing) setRefreshing(true);

      const data = await getProfile();
      const initialDetails = await getInitialDetails();
      setProfile(data);
      setDetails(initialDetails);
    } catch (err: any) {
      console.log(err);
    } finally {
      if (showRefreshing) setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    fetchData(true);
  };

  const handleOpenModal = (type: "current" | "goal") => {
    Vibration.vibrate(10);
    setModalType(type);
    setInputValue("");
    setModalVisible(true);
  };

  const handleConfirmWeight = async () => {
    if (!inputValue.trim()) {
      Vibration.vibrate([0, 50, 50, 50]);
      alert("Please enter a valid weight");
      return;
    }

    setLoading(true);
    try {
      const newWeight = parseFloat(inputValue);

      if (isNaN(newWeight) || newWeight <= 0) {
        alert("Please enter a valid number");
        setLoading(false);
        return;
      }

      Vibration.vibrate(50); // Success feedback

      if (modalType === "current") {
        await updateWeightStats(
          newWeight.toString(),
          profile?.target_weight?.toString() || ""
        );
      } else if (modalType === "goal") {
        await updateWeightStats(
          profile?.weight?.toString() || "",
          newWeight.toString()
        );
      }

      // Recalculate BMI and macros with new data
      const updatedProfile = await getProfile();
      await dataAnalysis(
        modalType === "current" ? newWeight : updatedProfile.weight,
        updatedProfile.height,
        updatedProfile.age,
        modalType === "goal" ? newWeight : updatedProfile.target_weight,
        updatedProfile.gender,
        updatedProfile.goal
      );

      // Refresh all data
      await fetchData();

      setModalVisible(false);
      setInputValue("");
    } catch (err: any) {
      console.log("Error updating weight:", err);
      Vibration.vibrate([0, 50, 50, 50]);
      alert("Failed to update weight. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Calculate progress percentage
  const calculateProgress = () => {
    if (!profile?.weight || !profile?.target_weight) return 0;

    const current = parseFloat(profile.weight);
    const target = parseFloat(profile.target_weight);
    const initial = current; // You might want to store initial weight separately

    if (current === target) return 100;

    const totalChange = Math.abs(initial - target);
    const currentChange = Math.abs(initial - current);

    return Math.min((currentChange / totalChange) * 100, 100);
  };

  const progress = calculateProgress();
  const weightDifference =
    profile?.weight && profile?.target_weight
      ? Math.abs(
          parseFloat(profile.weight) - parseFloat(profile.target_weight)
        ).toFixed(1)
      : 0;

  // Get BMI category color
  const getBMICategoryColor = (category: string) => {
    switch (category?.toLowerCase()) {
      case "underweight":
        return "#3B82F6";
      case "normal":
        return "#10B981";
      case "overweight":
        return "#F59E0B";
      case "obese":
        return "#EF4444";
      default:
        return "#6B7280";
    }
  };

  if (loading && !modalVisible) {
    return <LoadingState type="setup" message="Updating your profile..." />;
  }

  return (
    <SafeAreaView style={dataStyles.container}>
      {/* Header */}
      <View style={dataStyles.headerContainer}>
        <Text style={dataStyles.headerTitle}>Overview</Text>
      </View>

      <ScrollView
        style={dataStyles.body}
        contentContainerStyle={dataStyles.contentContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
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
                <Text style={dataStyles.dataCardUnit}> kg</Text>
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
                <Text style={dataStyles.dataCardUnit}> kg</Text>
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
                      details?.bmi_category
                    )}15`,
                    color: getBMICategoryColor(details?.bmi_category),
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

        {/* Weight Progress Card - Moved to Bottom */}
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
                <Text style={dataStyles.weightUnit}> kg</Text>
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
                {weightDifference} kg to go
              </Text>
            </View>

            <View style={dataStyles.weightBox}>
              <Text style={dataStyles.weightLabel}>Goal</Text>
              <Text style={dataStyles.weightValue}>
                {profile?.target_weight || "--"}
                <Text style={dataStyles.weightUnit}> kg</Text>
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
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={dataStyles.modalOverlay}>
          <View style={dataStyles.modalContent}>
            <Text style={dataStyles.modalTitle}>
              {modalType === "current"
                ? "Log Current Weight"
                : "Update Goal Weight"}
            </Text>
            <Text style={dataStyles.modalSubtitle}>
              {modalType === "current"
                ? "Enter your current weight to track your progress"
                : "Set a new target weight for your fitness journey"}
            </Text>

            <View style={dataStyles.inputContainer}>
              <Text style={dataStyles.inputLabel}>Weight (kg)</Text>
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
                  onPress={() => setModalVisible(false)}
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
