import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Image, Text, TouchableOpacity, View } from "react-native";
import { useImageExamine } from "./ImageExamine.logic";
import {
  ImageExamineProps,
  OPTION_CONFIGS,
  UI_TEXT,
} from "./ImageExamine.static";
import { imageExamineStyles } from "./imageExamine.style";

const PROCESSING_STAGES = [
  "Scanning your meal...",
  "Detecting ingredients...",
  "Estimating calories...",
  "Calculating macros...",
  "Building your nutrition summary ✨",
];

const AnimatedProcessingText: React.FC<{ style?: object }> = ({ style }) => {
  const [stageIndex, setStageIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const translateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 240,
          useNativeDriver: true,
        }),
        Animated.timing(translateAnim, {
          toValue: -6,
          duration: 240,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setStageIndex((prev) => (prev + 1) % PROCESSING_STAGES.length);
        translateAnim.setValue(6);

        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 360,
            useNativeDriver: true,
          }),
          Animated.timing(translateAnim, {
            toValue: 0,
            duration: 360,
            useNativeDriver: true,
          }),
        ]).start();
      });
    }, 1800);

    return () => clearInterval(interval);
  }, [fadeAnim, translateAnim]);

  return (
    <Animated.Text
      style={[
        imageExamineStyles.processingText,
        {
          opacity: fadeAnim,
          transform: [{ translateY: translateAnim }],
        },
        style,
      ]}
    >
      {PROCESSING_STAGES[stageIndex]}
    </Animated.Text>
  );
};
const PremiumProcessingAnimation: React.FC = () => {
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scanAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const dotOne = useRef(new Animated.Value(0.35)).current;
  const dotTwo = useRef(new Animated.Value(0.35)).current;
  const dotThree = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ]),
    );

    const rotateLoop = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2600,
        useNativeDriver: true,
      }),
    );

    const scanLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnim, {
          toValue: 1,
          duration: 1600,
          useNativeDriver: true,
        }),
        Animated.timing(scanAnim, {
          toValue: 0,
          duration: 1600,
          useNativeDriver: true,
        }),
      ]),
    );

    const glowLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
    );

    const createDotLoop = (dot: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: 1,
            duration: 360,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0.35,
            duration: 360,
            useNativeDriver: true,
          }),
        ]),
      );

    pulseLoop.start();
    rotateLoop.start();
    scanLoop.start();
    glowLoop.start();
    createDotLoop(dotOne, 0).start();
    createDotLoop(dotTwo, 180).start();
    createDotLoop(dotThree, 360).start();

    return () => {
      pulseLoop.stop();
      rotateLoop.stop();
      scanLoop.stop();
      glowLoop.stop();
    };
  }, [pulseAnim, rotateAnim, scanAnim, glowAnim, dotOne, dotTwo, dotThree]);

  const pulseScale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.28],
  });

  const pulseOpacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.35, 0],
  });

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const scanTranslate = scanAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-62, 62],
  });

  const glowScale = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.08],
  });

  return (
    <View style={imageExamineStyles.premiumProcessingWrap}>
      <Animated.View
        style={[
          imageExamineStyles.processingPulseRing,
          {
            opacity: pulseOpacity,
            transform: [{ scale: pulseScale }],
          },
        ]}
      />

      <Animated.View
        style={[
          imageExamineStyles.processingGlowCard,
          {
            transform: [{ scale: glowScale }],
          },
        ]}
      >
        <Animated.View
          style={[
            imageExamineStyles.processingOuterRing,
            {
              transform: [{ rotate }],
            },
          ]}
        />

        <View style={imageExamineStyles.processingCore}>
          <Ionicons name="sparkles" size={30} color="#F47B20" />

          <Animated.View
            style={[
              imageExamineStyles.processingScanLine,
              {
                transform: [{ translateY: scanTranslate }],
              },
            ]}
          />
        </View>
      </Animated.View>

      <View style={imageExamineStyles.processingDotsRow}>
        <Animated.View
          style={[imageExamineStyles.processingDot, { opacity: dotOne }]}
        />
        <Animated.View
          style={[imageExamineStyles.processingDot, { opacity: dotTwo }]}
        />
        <Animated.View
          style={[imageExamineStyles.processingDot, { opacity: dotThree }]}
        />
      </View>
    </View>
  );
};

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
      {/* ── Option Cards — only shown when no image is selected ── */}
      {!image && (
        <>
          <View style={imageExamineStyles.optionsGrid}>
            {/* Camera Card */}
            <TouchableOpacity
              style={[
                imageExamineStyles.optionCard,
                imageExamineStyles.cameraCard,
                cameraPressed && imageExamineStyles.optionCardPressed,
              ]}
              onPress={handleTakeCameraPhoto}
              onPressIn={() => setCameraPressed(true)}
              onPressOut={() => setCameraPressed(false)}
              activeOpacity={1}
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
                  size={26}
                  color={OPTION_CONFIGS.CAMERA.iconColor}
                />
              </View>
              <Text style={imageExamineStyles.optionTitle}>
                {OPTION_CONFIGS.CAMERA.title}
              </Text>
              <Text style={imageExamineStyles.optionSubtitle}>
                {OPTION_CONFIGS.CAMERA.subtitle}
              </Text>
            </TouchableOpacity>

            {/* Gallery Card */}
            <TouchableOpacity
              style={[
                imageExamineStyles.optionCard,
                imageExamineStyles.galleryCard,
                galleryPressed && imageExamineStyles.optionCardPressed,
              ]}
              onPress={handlePickGalleryImage}
              onPressIn={() => setGalleryPressed(true)}
              onPressOut={() => setGalleryPressed(false)}
              activeOpacity={1}
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
                  size={26}
                  color={OPTION_CONFIGS.GALLERY.iconColor}
                />
              </View>
              <Text style={imageExamineStyles.optionTitle}>
                {OPTION_CONFIGS.GALLERY.title}
              </Text>
              <Text style={imageExamineStyles.optionSubtitle}>
                {OPTION_CONFIGS.GALLERY.subtitle}
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {image && (
        <View style={imageExamineStyles.imagePreviewContainer}>
          <View style={imageExamineStyles.previewHeader}>
            {processing ? (
              <AnimatedProcessingText style={{ flex: 1 }} />
            ) : (
              <>
                <View style={imageExamineStyles.previewStatusDot} />
                <Text style={imageExamineStyles.previewLabel}>
                  {UI_TEXT.IMAGE_SELECTED}
                </Text>
                <Ionicons name="checkmark-circle" size={18} color="#2ECC71" />
              </>
            )}
          </View>

          {/* Full-width image */}
          <View style={imageExamineStyles.previewImageWrapper}>
            <Image
              source={{ uri: image }}
              style={imageExamineStyles.previewImage}
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

            {/*
             * Processing overlay — single spinner lives here ONLY.
             * AnimatedProcessingText reused here below the spinner.
             */}
            {processing && (
              <View style={imageExamineStyles.processingOverlay}>
                <PremiumProcessingAnimation />

                <AnimatedProcessingText />

                {/* <Text style={imageExamineStyles.processingSubtext}>
                  AI-powered nutrition analysis
                </Text> */}
              </View>
            )}
          </View>
        </View>
      )}
    </View>
  );
};
