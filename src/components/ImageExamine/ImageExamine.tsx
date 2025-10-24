import { NutritionData, sendImageToAI } from "@/src/utils/sendImageToAI";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";
import { imageExamineStyles } from "./imageExamine.style";

type Props = {
  onResult: (data: NutritionData, imageUri: string) => void;
  onLoading?: (loading: boolean) => void;
  onClose?: () => void;
};

export const ImageExamine: React.FC<Props> = ({
  onResult,
  onLoading,
  onClose,
}) => {
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
      const mediaStatus =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!cameraStatus.granted || !mediaStatus.granted) {
        Alert.alert(
          "Permission Denied",
          "Camera and media permission are required"
        );
      }
    })();
  }, []);

  const handleImage = async (uri: string) => {
    try {
      setImage(uri);
      onLoading?.(true);

      // Read the image file as base64 using the legacy FileSystem API
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      if (!base64) {
        throw new Error("Failed to read image file");
      }

      const nutritionData = await sendImageToAI(base64);
      console.log("AI Nutrition Data:", nutritionData);

      onResult(nutritionData, uri);
    } catch (err: any) {
      console.error("Error in handleImage:", err);
      onLoading?.(false);
      Alert.alert("Error", err.message || "Failed to process image");
    }
  };

  const pickGalleryImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled && result.assets.length > 0) {
        await handleImage(result.assets[0].uri);
      }
    } catch (err: any) {
      console.error("Gallery error:", err);
      Alert.alert("Error", "Failed to pick image from gallery");
    }
  };

  const takeCameraPhoto = async () => {
    try {
      let result = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled && result.assets.length > 0) {
        await handleImage(result.assets[0].uri);
      }
    } catch (err: any) {
      console.error("Camera error:", err);
      Alert.alert("Error", "Failed to take photo");
    }
  };

  return (
    <View style={imageExamineStyles.container}>
      <TouchableOpacity
        style={imageExamineStyles.optionButton}
        onPress={takeCameraPhoto}
      >
        <MaterialCommunityIcons
          name="camera"
          size={24}
          color="#007AFF"
          style={imageExamineStyles.iconSpacing}
        />
        <View style={imageExamineStyles.optionTextContainer}>
          <Text style={imageExamineStyles.optionTitle}>Take a Photo</Text>
          <Text style={imageExamineStyles.optionSubtitle}>
            Use your camera to capture the meal
          </Text>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={24} color="#999" />
      </TouchableOpacity>

      <TouchableOpacity
        style={imageExamineStyles.optionButton}
        onPress={pickGalleryImage}
      >
        <MaterialCommunityIcons
          name="image"
          size={24}
          color="#34C759"
          style={imageExamineStyles.iconSpacing}
        />
        <View style={imageExamineStyles.optionTextContainer}>
          <Text style={imageExamineStyles.optionTitle}>
            Upload from Gallery
          </Text>
          <Text style={imageExamineStyles.optionSubtitle}>
            Choose an existing photo from your device
          </Text>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={24} color="#999" />
      </TouchableOpacity>

      {image && (
        <View style={imageExamineStyles.imagePreviewContainer}>
          <Text style={imageExamineStyles.previewLabel}>Selected Image</Text>
          <Image
            source={{ uri: image }}
            style={imageExamineStyles.previewImage}
            resizeMode="cover"
          />
        </View>
      )}
    </View>
  );
};
