import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useImageExamine } from "./ImageExamine.logic";
import {
  ImageExamineProps,
  OPTION_CONFIGS,
  UI_TEXT,
} from "./ImageExamine.static";
import { imageExamineStyles } from "./imageExamine.style";

export const ImageExamine: React.FC<ImageExamineProps> = ({
  onSuccess,
  onLoading,
  onClose,
}) => {
  const {
    image,
    processing,
    cameraPressed,
    galleryPressed,
    setCameraPressed,
    setGalleryPressed,
    handlePickGalleryImage,
    handleTakeCameraPhoto,
    handleRemoveImage,
  } = useImageExamine({ onSuccess, onLoading, onClose });

  return (
    <View style={imageExamineStyles.container}>
      {/* Only show options when no image is selected */}
      {!image && (
        <>
          {/* Camera Option */}
          <TouchableOpacity
            style={[
              imageExamineStyles.optionButton,
              cameraPressed && imageExamineStyles.optionButtonPressed,
            ]}
            onPress={handleTakeCameraPhoto}
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
              <Ionicons
                name={OPTION_CONFIGS.CAMERA.icon as any}
                size={24}
                color={OPTION_CONFIGS.CAMERA.iconColor}
              />
            </View>
            <View style={imageExamineStyles.optionTextContainer}>
              <Text style={imageExamineStyles.optionTitle}>
                {OPTION_CONFIGS.CAMERA.title}
              </Text>
              <Text style={imageExamineStyles.optionSubtitle}>
                {OPTION_CONFIGS.CAMERA.subtitle}
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
            onPress={handlePickGalleryImage}
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
              <Ionicons
                name={OPTION_CONFIGS.GALLERY.icon as any}
                size={24}
                color={OPTION_CONFIGS.GALLERY.iconColor}
              />
            </View>
            <View style={imageExamineStyles.optionTextContainer}>
              <Text style={imageExamineStyles.optionTitle}>
                {OPTION_CONFIGS.GALLERY.title}
              </Text>
              <Text style={imageExamineStyles.optionSubtitle}>
                {OPTION_CONFIGS.GALLERY.subtitle}
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
        </>
      )}

      {/* Image Preview */}
      {image && (
        <View style={imageExamineStyles.imagePreviewContainer}>
          <View style={imageExamineStyles.previewHeader}>
            <Ionicons name="checkmark-circle" size={20} color="#10B981" />
            <Text style={imageExamineStyles.previewLabel}>
              {processing ? UI_TEXT.ANALYZING : UI_TEXT.IMAGE_SELECTED}
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
                  {UI_TEXT.ANALYZING_NUTRITION}
                </Text>
              </View>
            )}
          </View>
        </View>
      )}
    </View>
  );
};
