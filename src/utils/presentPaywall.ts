import RevenueCatUI, { PAYWALL_RESULT } from "react-native-purchases-ui";

export const presentPaywall = async (): Promise<boolean> => {
  try {
    const paywallResult: PAYWALL_RESULT = await RevenueCatUI.presentPaywall();

    switch (paywallResult) {
      case PAYWALL_RESULT.PURCHASED:
      case PAYWALL_RESULT.RESTORED:
        return true;

      case PAYWALL_RESULT.NOT_PRESENTED:
      case PAYWALL_RESULT.ERROR:
      case PAYWALL_RESULT.CANCELLED:
      default:
        return false;
    }
  } catch (error) {
    console.error("Error presenting paywall:", error);
    return false;
  }
};

export const presentPaywallIfNeeded = async (
  entitlementId: string = "Orca AI Premium",
): Promise<boolean> => {
  try {
    const paywallResult: PAYWALL_RESULT =
      await RevenueCatUI.presentPaywallIfNeeded({
        requiredEntitlementIdentifier: entitlementId,
      });

    switch (paywallResult) {
      case PAYWALL_RESULT.PURCHASED:
      case PAYWALL_RESULT.RESTORED:
        return true;

      // NOT_PRESENTED means user already has the entitlement — treat as success
      case PAYWALL_RESULT.NOT_PRESENTED:
        return true;

      case PAYWALL_RESULT.ERROR:
      case PAYWALL_RESULT.CANCELLED:
      default:
        return false;
    }
  } catch (error) {
    console.error("Error presenting paywall:", error);
    return false;
  }
};
