import { getInitialDetails, getProfile } from "@/backend/getData";
import { updatePhysique } from "@/backend/sendData";
import { LoadingState } from "@/src/components/LoadingState/LoadingState";
import { dataAnalysis } from "@/src/utils/dataAnalysis";
import { useEffect, useState } from "react";
import {
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { homeStyles } from "../Home/Home.style";
import { dataStyles } from "./Data.style";

export const DataOverview = () => {
  const [details, setDetails] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<"current" | "goal" | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      const data = await getProfile();
      const initialDetails = await getInitialDetails();
      setProfile(data);
      setDetails(initialDetails);
    } catch (err: any) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (type: "current" | "goal") => {
    setModalType(type);
    setInputValue("");
    setModalVisible(true);
  };

  const handleConfirmWeight = async () => {
    if (!inputValue.trim()) {
      alert("Please enter a valid weight");
      return;
    }

    setLoading(true);
    try {
      const newWeight = parseFloat(inputValue);

      if (modalType === "current") {
        await updatePhysique(
          profile?.age?.toString() || "",
          profile?.height?.toString() || "",
          newWeight.toString(),
          profile?.target_weight?.toString() || ""
        );
      } else if (modalType === "goal") {
        await updatePhysique(
          profile?.age?.toString() || "",
          profile?.height?.toString() || "",
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
      alert("Failed to update weight. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingState type="setup" message="Updating your profile..." />;
  }

  return (
    <ScrollView style={homeStyles.body}>
      <View style={homeStyles.heading}>
        <Text style={homeStyles.logoName}>Overview</Text>
      </View>

      <View style={dataStyles.section}>
        <Text style={dataStyles.sectionHeading}>Goal Weight</Text>
        <View style={dataStyles.cardStyle}>
          <Text style={homeStyles.impDetails}>{profile?.target_weight}kg</Text>
          <TouchableOpacity
            style={dataStyles.updateButton}
            onPress={() => handleOpenModal("goal")}
          >
            <Text style={dataStyles.update}>Update</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={dataStyles.section}>
        <Text style={dataStyles.sectionHeading}>Current Weight</Text>
        <View>
          <View style={dataStyles.cardStyle}>
            <Text style={homeStyles.impDetails}>{profile?.weight}kg</Text>
            <TouchableOpacity
              style={dataStyles.updateButton}
              onPress={() => handleOpenModal("current")}
            >
              <Text style={dataStyles.update}>Log Weight</Text>
            </TouchableOpacity>
          </View>
          <Text style={homeStyles.notesDetails}>
            Try to update once a week so we can adjust your plan to ensure you
            hit goal!
          </Text>
        </View>
      </View>

      <View style={dataStyles.section}>
        <Text style={dataStyles.sectionHeading}>BMI</Text>
        <Text>
          Your BMI score:{" "}
          <Text style={dataStyles.sectionHeading}>{details?.bmi}</Text>
        </Text>
        <Text>
          Category:{" "}
          <Text style={dataStyles.sectionHeading}>{details?.bmi_category}</Text>
        </Text>
      </View>

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

            <TextInput
              style={dataStyles.textInput}
              placeholder="Enter weight in kg"
              keyboardType="decimal-pad"
              value={inputValue}
              onChangeText={setInputValue}
              editable={!loading}
            />

            <View style={dataStyles.buttonContainer}>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                disabled={loading}
              >
                <Text style={dataStyles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleConfirmWeight}
                disabled={loading}
                style={dataStyles.confirmButton}
              >
                <Text style={dataStyles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};
