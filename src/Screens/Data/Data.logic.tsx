import {
  getInitialDetails,
  getProfile,
  getWeightLogs,
} from "@/backend/getData";
import { logWeight, updateWeightStats } from "@/backend/sendData";
import { dataAnalysis } from "@/src/utils/dataAnalysis";
import * as Haptics from "expo-haptics";
import { useEffect, useState } from "react";
import {
  BMI_CATEGORY_COLORS,
  InitialDetailsData,
  ModalType,
  ProfileData,
  WeightLog,
} from "./Data.static";

export const useData = () => {
  const [details, setDetails] = useState<InitialDetailsData | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<ModalType>(null);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const [weightLogs, setWeightLogs] = useState<WeightLog[]>([]);
  const getTodayStr = () => new Date().toISOString().split("T")[0];

  const createWeightLogId = () => {
    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (showRefreshing = false) => {
    try {
      if (showRefreshing) setRefreshing(true);

      const data = await getProfile();
      setProfile(data);

      // ── CHANGED: fetch real weight history from DB instead of seeding fake state ──
      const logs = await getWeightLogs();
      setWeightLogs(logs);

      const initialDetails = await getInitialDetails();
      setDetails(initialDetails);
    } catch (err: any) {
      console.log(err);
    } finally {
      if (showRefreshing) setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchData(true);
  };

  const handleOpenModal = (type: "current" | "goal") => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setModalType(type);
    setInputValue("");
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleConfirmWeight = async () => {
    if (!inputValue.trim()) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      alert("Please enter a valid weight");
      return;
    }

    const newWeight = parseFloat(inputValue);

    if (isNaN(newWeight) || newWeight <= 0) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      alert("Please enter a valid number");
      return;
    }

    setLoading(true);
    try {
      // Determine which weights to use for update
      const currentWeight =
        modalType === "current"
          ? newWeight.toString()
          : profile?.weight?.toString() || "";

      const goalWeight =
        modalType === "goal"
          ? newWeight.toString()
          : profile?.target_weight?.toString() || "";

      // Update weight in database
      await updateWeightStats(currentWeight, goalWeight);

      // ── CHANGED: persist new weight entry to weight_logs table ──
      if (modalType === "current") {
        await logWeight(currentWeight);
      }

      // Get fresh profile data
      const updatedProfile = await getProfile();

      if (modalType === "current") {
        const today = getTodayStr();

        setWeightLogs((prev) => {
          return [
            ...prev,
            {
              id: createWeightLogId(),
              date: today,
              weight: newWeight,
            },
          ].sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
          );
        });
      }

      // Validate all required fields exist
      if (
        updatedProfile.weight &&
        updatedProfile.height &&
        updatedProfile.age &&
        updatedProfile.target_weight &&
        updatedProfile.gender &&
        updatedProfile.goal
      ) {
        // Use the correct weight values for analysis
        const weightForAnalysis =
          modalType === "current" ? newWeight : Number(updatedProfile.weight);

        const targetWeightForAnalysis =
          modalType === "goal"
            ? newWeight
            : Number(updatedProfile.target_weight);

        // Call dataAnalysis with correct values
        await dataAnalysis(
          weightForAnalysis,
          Number(updatedProfile.height),
          Number(updatedProfile.age),
          targetWeightForAnalysis,
          updatedProfile.gender,
          updatedProfile.goal,
        );
      }

      // SUCCESS - Now give feedback
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Refresh data to show updated values
      await fetchData();

      // Close modal and reset
      setModalVisible(false);
      setInputValue("");
    } catch (err: any) {
      console.log("Error updating weight:", err);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      alert("Failed to update weight. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = () => {
    if (!profile?.weight || !profile?.target_weight) return 0;

    const current = parseFloat(profile.weight);
    const target = parseFloat(profile.target_weight);
    const initial = current;

    if (current === target) return 100;

    const totalChange = Math.abs(initial - target);
    const currentChange = Math.abs(initial - current);

    return Math.min((currentChange / totalChange) * 100, 100);
  };

  const calculateWeightDifference = () => {
    if (!profile?.weight || !profile?.target_weight) return 0;

    return Math.abs(
      parseFloat(profile.weight) - parseFloat(profile.target_weight),
    ).toFixed(1);
  };

  const getBMICategoryColor = (category: string) => {
    const lowerCategory = category?.toLowerCase();
    return (
      BMI_CATEGORY_COLORS[lowerCategory as keyof typeof BMI_CATEGORY_COLORS] ||
      BMI_CATEGORY_COLORS.DEFAULT
    );
  };

  return {
    details,
    profile,
    modalVisible,
    modalType,
    inputValue,
    loading,
    refreshing,
    inputFocused,
    weightLogs,
    progress: calculateProgress(),
    weightDifference: calculateWeightDifference(),
    handleRefresh,
    handleOpenModal,
    handleCloseModal,
    handleConfirmWeight,
    getBMICategoryColor,
    setInputValue,
    setInputFocused,
  };
};
