import { NutritionData, sendImageToAI } from "@/src/utils/sendImageToAI";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";

type Props = {
  onResult: (data: NutritionData) => void;
};

export const ImageExamine: React.FC<Props> = ({ onResult }) => {
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
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const nutritionData = await sendImageToAI(base64);
      console.log("AI Nutrition Data:", nutritionData);

      onResult(nutritionData);
    } catch (err) {
      Alert.alert("Error", (err as Error).message);
    }
  };

  const pickGalleryImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      await handleImage(result.assets[0].uri);
    }
  };

  const takeCameraPhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      await handleImage(result.assets[0].uri);
    }
  };

  return (
    <View style={{ marginVertical: 10 }}>
      <TouchableOpacity onPress={pickGalleryImage}>
        <Text>Pick Image from Gallery</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={takeCameraPhoto}>
        <Text>Take Image from Camera</Text>
      </TouchableOpacity>
      {image && (
        <Image
          source={{ uri: image }}
          style={{ width: 150, height: 100, marginVertical: 10 }}
          resizeMode="contain"
        />
      )}
    </View>
  );
};
