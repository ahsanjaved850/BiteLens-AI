import { sendImageToAI } from "@/src/utils/sendImageToAI";
import {
  saveMealToDatabase,
  supabase,
  uploadMealImage,
} from "@/src/utils/supabase";
import * as FileSystem from "expo-file-system/legacy";
import * as Haptics from "expo-haptics";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import {
  ALERT_MESSAGES,
  ERROR_KEYWORDS,
  IMAGE_MANIPULATION_OPTIONS,
  IMAGE_PICKER_OPTIONS,
  ImageExamineProps,
} from "./ImageExamine.static";

export const useImageExamine = ({
  onSuccess,
  onLoading,
}: ImageExamineProps) => {
  const [image, setImage] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [cameraPressed, setCameraPressed] = useState(false);
  const [galleryPressed, setGalleryPressed] = useState(false);

  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
    const mediaStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!cameraStatus.granted || !mediaStatus.granted) {
      Alert.alert(
        ALERT_MESSAGES.PERMISSION_REQUIRED.title,
        ALERT_MESSAGES.PERMISSION_REQUIRED.message,
        [
          {
            text: ALERT_MESSAGES.PERMISSION_REQUIRED.cancelText,
            style: "cancel",
          },
          {
            text: ALERT_MESSAGES.PERMISSION_REQUIRED.settingsText,
            onPress: () => {},
          },
        ]
      );
    }
  };

  const convertImageToJPEG = async (uri: string): Promise<string> => {
    try {
      console.log("Converting image from URI:", uri);

      const fileInfo = await FileSystem.getInfoAsync(uri);
      console.log("File info:", fileInfo);

      if (!fileInfo.exists) {
        throw new Error("Image file does not exist");
      }

      try {
        const manipulatedImage = await ImageManipulator.manipulateAsync(
          uri,
          [{ resize: { width: IMAGE_MANIPULATION_OPTIONS.RESIZE_WIDTH } }],
          {
            compress: IMAGE_MANIPULATION_OPTIONS.PRIMARY_COMPRESS,
            format: ImageManipulator.SaveFormat.JPEG,
            base64: false,
          }
        );

        console.log("Image converted successfully:", manipulatedImage.uri);
        return manipulatedImage.uri;
      } catch (primaryError) {
        console.warn(
          "Primary conversion failed, trying fallback:",
          primaryError
        );

        const fallbackImage = await ImageManipulator.manipulateAsync(uri, [], {
          compress: IMAGE_MANIPULATION_OPTIONS.FALLBACK_COMPRESS,
          format: ImageManipulator.SaveFormat.JPEG,
          base64: false,
        });

        console.log("Fallback conversion successful:", fallbackImage.uri);
        return fallbackImage.uri;
      }
    } catch (error: any) {
      console.error("Error converting image to JPEG:", error);
      console.log("Using original URI as last resort");
      throw new Error(
        `Failed to process image format: ${error.message || "Unknown error"}`
      );
    }
  };

  const readImageAsBase64 = async (uri: string): Promise<string> => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(uri);

      if (!fileInfo.exists) {
        throw new Error("Image file not found");
      }

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

  const getErrorMessage = (error: any): string => {
    const message = error.message?.toLowerCase() || "";

    if (message.includes(ERROR_KEYWORDS.FORMAT)) {
      return ALERT_MESSAGES.ANALYSIS_FAILED.formatError;
    } else if (message.includes(ERROR_KEYWORDS.READ)) {
      return ALERT_MESSAGES.ANALYSIS_FAILED.readError;
    } else if (message.includes(ERROR_KEYWORDS.AUTHENTICATED)) {
      return ALERT_MESSAGES.ANALYSIS_FAILED.authError;
    } else if (message.includes(ERROR_KEYWORDS.UPLOAD)) {
      return ALERT_MESSAGES.ANALYSIS_FAILED.uploadError;
    }

    return ALERT_MESSAGES.ANALYSIS_FAILED.defaultMessage;
  };

  const handleImage = async (uri: string) => {
    try {
      setImage(uri);
      setProcessing(true);
      onLoading?.(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      console.log("Processing image:", uri);

      let jpegUri: string;
      try {
        jpegUri = await convertImageToJPEG(uri);
      } catch (conversionError: any) {
        console.warn(
          "Image conversion failed, attempting direct read:",
          conversionError
        );
        jpegUri = uri;
      }

      const base64 = await readImageAsBase64(jpegUri);

      console.log("Sending image to AI for analysis...");
      const nutritionData = await sendImageToAI(base64);
      console.log("AI Nutrition Data received:", nutritionData);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("User not authenticated");
      }

      console.log("Uploading image to Supabase Storage...");
      const imageUrl = await uploadMealImage(jpegUri, user.id);
      console.log("Image uploaded successfully:", imageUrl);

      console.log("Saving meal to database...");
      const mealData = {
        name: nutritionData.name,
        calories: parseFloat(nutritionData.calories),
        protein: parseFloat(nutritionData.protein),
        carbs: parseFloat(nutritionData.carbs),
        fat: parseFloat(nutritionData.fats),
        sugar: parseFloat(nutritionData.sugar),
        sodium: parseFloat(nutritionData.sodium),
        fiber: parseFloat(nutritionData.fiber),
        ingredients: nutritionData.ingredients,
        meal_image: imageUrl,
      };

      await saveMealToDatabase(mealData);
      console.log("Meal saved successfully!");

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      setProcessing(false);
      onLoading?.(false);
      setImage(null);

      await onSuccess(mealData);
    } catch (err: any) {
      console.error("Error in handleImage:", err);
      setProcessing(false);
      onLoading?.(false);

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

      const errorMessage = getErrorMessage(err);

      Alert.alert(ALERT_MESSAGES.ANALYSIS_FAILED.title, errorMessage, [
        { text: ALERT_MESSAGES.ANALYSIS_FAILED.buttonText, style: "default" },
      ]);
    }
  };

  const handlePickGalleryImage = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: IMAGE_PICKER_OPTIONS.ALLOWS_EDITING,
        quality: IMAGE_PICKER_OPTIONS.QUALITY,
        allowsMultipleSelection: IMAGE_PICKER_OPTIONS.ALLOWS_MULTIPLE,
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
        ALERT_MESSAGES.GALLERY_ERROR.title,
        ALERT_MESSAGES.GALLERY_ERROR.message,
        [{ text: ALERT_MESSAGES.GALLERY_ERROR.buttonText, style: "default" }]
      );
    }
  };

  const handleTakeCameraPhoto = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: IMAGE_PICKER_OPTIONS.ALLOWS_EDITING,
        quality: IMAGE_PICKER_OPTIONS.QUALITY,
        exif: false,
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
        ALERT_MESSAGES.CAMERA_ERROR.title,
        ALERT_MESSAGES.CAMERA_ERROR.message,
        [{ text: ALERT_MESSAGES.CAMERA_ERROR.buttonText, style: "default" }]
      );
    }
  };

  const handleRemoveImage = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setImage(null);
    setProcessing(false);
    onLoading?.(false);
  };

  return {
    image,
    processing,
    cameraPressed,
    galleryPressed,
    setCameraPressed,
    setGalleryPressed,
    handlePickGalleryImage,
    handleTakeCameraPhoto,
    handleRemoveImage,
  };
};
