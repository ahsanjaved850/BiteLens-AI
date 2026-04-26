import RevenueCatUI, { PAYWALL_RESULT } from "react-native-purchases-ui";

/**
 * Present the RevenueCat paywall and return whether the user purchased.
 *
 * - Shows the paywall you designed in the RevenueCat dashboard
 * - Returns `true` if user purchased or restored a purchase
 * - Returns `false` if user cancelled, error, or paywall not presented
 *
 * Usage:
 * ```
 * const didPurchase = await presentPaywall();
 * if (didPurchase) {
 *   // User is now premium — proceed with animation
 * }
 * ```
 */
export const presentPaywall = async (): Promise<boolean> => {
  try {
    const paywallResult: PAYWALL_RESULT =
      await RevenueCatUI.presentPaywall();

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

/**
 * Present paywall ONLY if user doesn't already have the entitlement.
 * Use this when you want to skip the paywall for existing subscribers.
 *
 * @param entitlementId - The entitlement identifier (default: "pro")
 */
export const presentPaywallIfNeeded = async (
  entitlementId: string = "BiteLens AI Premium"
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