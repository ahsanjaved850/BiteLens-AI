import { MealData } from "@/src/utils/supabase";

export interface ImageExamineProps {
  onSuccess: (mealData: MealData) => Promise<void>;
  onLoading?: (loading: boolean) => void;
  onClose?: () => void;
}

export const IMAGE_PICKER_OPTIONS = {
  MEDIA_TYPES: ["images"],
  QUALITY: 1,
  ALLOWS_EDITING: false,
  ALLOWS_MULTIPLE: false,
};

export const IMAGE_MANIPULATION_OPTIONS = {
  RESIZE_WIDTH: 1200, // smaller max width — good for food photos
  PRIMARY_COMPRESS: 0.75, // 75% quality — noticeably smaller, still looks great
  FALLBACK_COMPRESS: 0.65, // 65% fallback
};

export const OPTION_CONFIGS = {
  CAMERA: {
    title: "Camera",
    subtitle: "Take a picture of your meal",
    icon: "camera",
    iconColor: "#3B82F6",
    iconBgColor: "#DBEAFE",
  },
  GALLERY: {
    title: "Gallery",
    subtitle: "Pick an existing picture",
    icon: "images",
    iconColor: "#10B981",
    iconBgColor: "#DCFCE7",
  },
} as const;

export const UI_TEXT = {
  ANALYZING: "Analyzing image...",
  IMAGE_SELECTED: "Image selected",
} as const;

export const ALERT_MESSAGES = {
  PERMISSION_REQUIRED: {
    title: "Permission Required",
    message:
      "Camera and photo library access are needed to log your meals. Please enable them in your device settings.",
    cancelText: "Cancel",
    settingsText: "Open Settings",
  },
  ANALYSIS_FAILED: {
    title: "Analysis Failed",
    defaultMessage: "We couldn't analyze this image. Please try again.",
    formatError:
      "This image format is not supported. Please try a different photo.",
    readError: "Could not read the image file. Please try again.",
    authError: "Please sign in to add meals.",
    uploadError:
      "Failed to upload image. Please check your internet connection.",
    buttonText: "OK",
  },
  GALLERY_ERROR: {
    title: "Gallery Error",
    message: "Failed to access your photo library. Please check permissions.",
    buttonText: "OK",
  },
  CAMERA_ERROR: {
    title: "Camera Error",
    message: "Failed to access your camera. Please check permissions.",
    buttonText: "OK",
  },
} as const;

export const ERROR_KEYWORDS = {
  FORMAT: "format",
  READ: "read",
  AUTHENTICATED: "authenticated",
  UPLOAD: "upload",
} as const;
