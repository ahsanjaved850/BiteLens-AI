import Purchases from "react-native-purchases";
import RevenueCatUI, { PAYWALL_RESULT } from "react-native-purchases-ui";
import { ENTITLEMENT_ID } from "./revenuecat";

const silentRestore = async (): Promise<boolean> => {
  try {
    const customerInfo = await Purchases.restorePurchases();
    const hasEntitlement =
      customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;
    if (hasEntitlement) {
      console.log(
        "RC silentRestore: active entitlement found, skipping paywall",
      );
    }
    return hasEntitlement;
  } catch (e) {
    // Restore failing is fine — just proceed to show the paywall normally
    console.warn("RC silentRestore failed (non-blocking):", e);
    return false;
  }
};

export const presentPaywall = async (): Promise<boolean> => {
  try {
    // Restore first — prevents error 7 for reinstalled users in TestFlight/production
    const alreadySubscribed = await silentRestore();
    if (alreadySubscribed) {
      // They already have an active subscription — treat as success
      return true;
    }

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
  entitlementId: string = ENTITLEMENT_ID,
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
