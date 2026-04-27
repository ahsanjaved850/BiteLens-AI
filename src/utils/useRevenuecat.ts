import { useCallback, useEffect, useState } from "react";
import Purchases, { CustomerInfo } from "react-native-purchases";
import { ENTITLEMENT_ID } from "./revenuecat";


interface RevenueCatState {
  isProUser: boolean;
  customerInfo: CustomerInfo | null;
  isLoading: boolean;
  checkEntitlement: () => Promise<boolean>;
}


export const useRevenueCat = (): RevenueCatState => {
  const [isProUser, setIsProUser] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkEntitlement = useCallback(async (): Promise<boolean> => {
    try {
      const info = await Purchases.getCustomerInfo();
      setCustomerInfo(info);

      const hasEntitlement =
        info.entitlements.active[ENTITLEMENT_ID] !== undefined;
      setIsProUser(hasEntitlement);
      return hasEntitlement;
    } catch (error) {
      console.error("Error checking entitlement:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Check on mount
    checkEntitlement();

    // Listen for changes (e.g., subscription renewed, cancelled, etc.)
    const listener = (info: CustomerInfo) => {
      setCustomerInfo(info);
      const hasEntitlement =
        info.entitlements.active[ENTITLEMENT_ID] !== undefined;
      setIsProUser(hasEntitlement);
    };

    Purchases.addCustomerInfoUpdateListener(listener);

    return () => {
      Purchases.removeCustomerInfoUpdateListener(listener);
    };
  }, [checkEntitlement]);

  return { isProUser, customerInfo, isLoading, checkEntitlement };
};