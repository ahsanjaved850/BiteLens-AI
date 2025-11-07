import { NutritionData, sendImageToAI } from "@/src/utils/sendImageToAI";
import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from "react-native";
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
  const [processing, setProcessing] = useState(false);
  const [cameraPressed, setCameraPressed] = useState(false);
  const [galleryPressed, setGalleryPressed] = useState(false);

  useEffect(() => {
    (async () => {
      const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
      const mediaStatus =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!cameraStatus.granted || !mediaStatus.granted) {
        Alert.alert(
          "Permission Required",
          "Camera and photo library access are needed to log your meals. Please enable them in your device settings.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Open Settings", onPress: () => {} },
          ]
        );
      }
    })();
  }, []);

  /**
   * Converts any image format (HEIF, HEIC, PNG, WebP, etc.) to JPEG
   * with multiple fallback strategies to ensure maximum compatibility
   */
  // const convertImageToJPEG = async (uri: string): Promise<string> => {
  //   try {
  //     console.log("Converting image from URI:", uri);

  //     // Get file info to check format
  //     const fileInfo = await FileSystem.getInfoAsync(uri);
  //     console.log("File info:", fileInfo);

  //     if (!fileInfo.exists) {
  //       throw new Error("Image file does not exist");
  //     }

  //     // Primary conversion attempt with high quality
  //     try {
  //       const manipulatedImage = await ImageManipulator.manipulateAsync(
  //         uri,
  //         [{ resize: { width: 2048 } }], // Resize large images while maintaining aspect ratio
  //         {
  //           compress: 0.9, // High quality compression
  //           format: ImageManipulator.SaveFormat.JPEG,
  //           base64: false,
  //         }
  //       );

  //       console.log("Image converted successfully:", manipulatedImage.uri);
  //       return manipulatedImage.uri;
  //     } catch (primaryError) {
  //       console.warn(
  //         "Primary conversion failed, trying fallback:",
  //         primaryError
  //       );

  //       // Fallback: Try conversion without resize
  //       const fallbackImage = await ImageManipulator.manipulateAsync(
  //         uri,
  //         [], // No transformations
  //         {
  //           compress: 0.85,
  //           format: ImageManipulator.SaveFormat.JPEG,
  //           base64: false,
  //         }
  //       );

  //       console.log("Fallback conversion successful:", fallbackImage.uri);
  //       return fallbackImage.uri;
  //     }
  //   } catch (error: any) {
  //     console.error("Error converting image to JPEG:", error);

  //     // Last resort: Return original URI and let base64 conversion handle it
  //     console.log("Using original URI as last resort");
  //     throw new Error(
  //       `Failed to process image format: ${error.message || "Unknown error"}`
  //     );
  //   }
  // };

  /**
   * Reads image as base64 with error handling and validation
   */
  const readImageAsBase64 = async (uri: string): Promise<string> => {
    try {
      // Verify file exists before reading
      const fileInfo = await FileSystem.getInfoAsync(uri);

      if (!fileInfo.exists) {
        throw new Error("Image file not found");
      }

      // Read file as base64
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      if (!base64 || base64.length === 0) {
        throw new Error("Failed to read image data");
      }

      console.log("Base64 data length:", base64.length);
      return base64;
    } catch (error: any) {
      console.error("Error reading image as base64:", error);
      throw new Error(
        `Failed to read image: ${error.message || "Unknown error"}`
      );
    }
  };

  const handleImage = async (uri: string) => {
    try {
      setImage(uri);
      setProcessing(true);
      onLoading?.(true);
      Vibration.vibrate(10);

      console.log("Processing image:", uri);

      // Step 1: Convert image to JPEG format (handles HEIF, HEIC, PNG, WebP, etc.)
      let jpegUri: string;
      try {
        // jpegUri = await convertImageToJPEG(uri);
        jpegUri = uri;
      } catch (conversionError: any) {
        console.warn(
          "Image conversion failed, attempting direct read:",
          conversionError
        );
        // If conversion fails, try using original URI
        jpegUri = uri;
      }

      // Step 2: Read the image file as base64
      const base64 = await readImageAsBase64(jpegUri);

      // Step 3: Send to AI for analysis
      console.log("Sending image to AI for analysis...");
      const nutritionData = await sendImageToAI(base64);
      console.log("AI Nutrition Data received:", nutritionData);

      // Success vibration
      Vibration.vibrate(50);

      // Return results
      onResult(nutritionData, uri);
    } catch (err: any) {
      console.error("Error in handleImage:", err);
      setProcessing(false);
      onLoading?.(false);

      // Error vibration pattern
      Vibration.vibrate([0, 50, 50, 50]);

      // User-friendly error message
      const errorMessage = err.message?.includes("format")
        ? "This image format is not supported. Please try a different photo."
        : err.message?.includes("read")
        ? "Could not read the image file. Please try again."
        : "We couldn't analyze this image. Please try a clearer photo of your meal.";

      Alert.alert("Analysis Failed", errorMessage, [
        { text: "OK", style: "default" },
      ]);
    }
  };

  const pickGalleryImage = async () => {
    try {
      Vibration.vibrate(10);

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: false,
        quality: 1,
        // Explicitly allow all image formats
        allowsMultipleSelection: false,
      });

      if (!result.canceled && result.assets.length > 0) {
        const selectedAsset = result.assets[0];
        console.log("Gallery image selected:", {
          uri: selectedAsset.uri,
          width: selectedAsset.width,
          height: selectedAsset.height,
          type: selectedAsset.type,
        });

        await handleImage(selectedAsset.uri);
      }
    } catch (err: any) {
      console.error("Gallery error:", err);
      Alert.alert(
        "Gallery Error",
        "Failed to access your photo library. Please check permissions.",
        [{ text: "OK", style: "default" }]
      );
    }
  };

  const takeCameraPhoto = async () => {
    try {
      Vibration.vibrate(10);

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        quality: 1,
        // Camera settings for best quality
        exif: false, // Don't need EXIF data
      });

      if (!result.canceled && result.assets.length > 0) {
        const capturedAsset = result.assets[0];
        console.log("Camera photo captured:", {
          uri: capturedAsset.uri,
          width: capturedAsset.width,
          height: capturedAsset.height,
          type: capturedAsset.type,
        });

        await handleImage(capturedAsset.uri);
      }
    } catch (err: any) {
      console.error("Camera error:", err);
      Alert.alert(
        "Camera Error",
        "Failed to access your camera. Please check permissions.",
        [{ text: "OK", style: "default" }]
      );
    }
  };

  const handleRemoveImage = () => {
    Vibration.vibrate(10);
    setImage(null);
    setProcessing(false);
    onLoading?.(false);
  };

  return (
    <View style={imageExamineStyles.container}>
      {/* Camera Option */}
      <TouchableOpacity
        style={[
          imageExamineStyles.optionButton,
          cameraPressed && imageExamineStyles.optionButtonPressed,
        ]}
        onPress={takeCameraPhoto}
        onPressIn={() => setCameraPressed(true)}
        onPressOut={() => setCameraPressed(false)}
        activeOpacity={0.7}
        disabled={processing}
      >
        <View
          style={[
            imageExamineStyles.iconContainer,
            imageExamineStyles.cameraIconContainer,
          ]}
        >
          <Ionicons name="camera" size={24} color="#3B82F6" />
        </View>
        <View style={imageExamineStyles.optionTextContainer}>
          <Text style={imageExamineStyles.optionTitle}>Take a Photo</Text>
          <Text style={imageExamineStyles.optionSubtitle}>
            Capture your meal with camera
          </Text>
        </View>
        <View style={imageExamineStyles.chevronContainer}>
          <Ionicons
            name="chevron-forward"
            size={20}
            style={imageExamineStyles.chevronIcon}
          />
        </View>
      </TouchableOpacity>

      {/* Gallery Option */}
      <TouchableOpacity
        style={[
          imageExamineStyles.optionButton,
          galleryPressed && imageExamineStyles.optionButtonPressed,
        ]}
        onPress={pickGalleryImage}
        onPressIn={() => setGalleryPressed(true)}
        onPressOut={() => setGalleryPressed(false)}
        activeOpacity={0.7}
        disabled={processing}
      >
        <View
          style={[
            imageExamineStyles.iconContainer,
            imageExamineStyles.galleryIconContainer,
          ]}
        >
          <Ionicons name="images" size={24} color="#10B981" />
        </View>
        <View style={imageExamineStyles.optionTextContainer}>
          <Text style={imageExamineStyles.optionTitle}>
            Choose from Gallery
          </Text>
          <Text style={imageExamineStyles.optionSubtitle}>
            Select an existing photo
          </Text>
        </View>
        <View style={imageExamineStyles.chevronContainer}>
          <Ionicons
            name="chevron-forward"
            size={20}
            style={imageExamineStyles.chevronIcon}
          />
        </View>
      </TouchableOpacity>

      {/* Image Preview */}
      {image && (
        <View style={imageExamineStyles.imagePreviewContainer}>
          <View style={imageExamineStyles.previewHeader}>
            <Ionicons name="checkmark-circle" size={20} color="#10B981" />
            <Text style={imageExamineStyles.previewLabel}>
              {processing ? "Analyzing image..." : "Image selected"}
            </Text>
          </View>

          <View style={imageExamineStyles.previewImageWrapper}>
            <Image
              source={{ uri: image }}
              style={imageExamineStyles.previewImage}
              resizeMode="cover"
            />

            {!processing && (
              <TouchableOpacity
                style={imageExamineStyles.removeButton}
                onPress={handleRemoveImage}
                activeOpacity={0.8}
              >
                <Ionicons name="close" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            )}

            {processing && (
              <View style={imageExamineStyles.processingOverlay}>
                <ActivityIndicator size="large" color="#3B82F6" />
                <Text style={imageExamineStyles.processingText}>
                  Analyzing nutrition...
                </Text>
              </View>
            )}
          </View>
        </View>
      )}
    </View>
  );
};
