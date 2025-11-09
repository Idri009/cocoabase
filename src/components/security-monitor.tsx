"use client";

import { useEffect, useRef } from "react";
import { useSecurityStore } from "@/store/security";
import { useAlertsStore } from "@/store/alerts";
import { useWalletStore } from "@/store/wallets";

type RiskDescriptor = {
  key: string;
  message: string;
  resolution?: string;
  condition: boolean;
};

export default function SecurityMonitor() {
  const settings = useSecurityStore((state) => state.settings);
  const recordEvent = useSecurityStore((state) => state.recordEvent);
  const watchlist = useWalletStore((state) => state.watchlist);
  const activeAddresses = useWalletStore((state) => state.activeAddresses);
  const addAlert = useAlertsStore((state) => state.addAlert);

  const triggeredRef = useRef(new Set<string>());

  useEffect(() => {
    const totalExternalWallets = watchlist.filter(
      (wallet) => wallet.source === "watchlist"
    ).length;
    const totalActive = activeAddresses.length;

    const risks: RiskDescriptor[] = [
      {
        key: "transaction-pin-disabled",
        message:
          "Transaction PIN is disabled while multiple wallets are monitored. Enable PIN protection to guard critical actions.",
        resolution: "Transaction PIN safeguarding restored.",
        condition:
          !settings.transactionPinEnabled && totalExternalWallets + totalActive > 1,
      },
      {
        key: "session-timeout-high",
        message:
          "Session auto-lock exceeds 15 minutes. Consider reducing the timeout to prevent unattended exposure.",
        resolution: "Session auto-lock returned to recommended range.",
        condition: settings.sessionTimeoutMinutes > 15,
      },
      {
        key: "phishing-code-missing",
        message:
          "Anti-phishing phrase is not configured. Add a phrase to spot spoofed signing prompts.",
        resolution: "Anti-phishing phrase configured.",
        condition: !settings.phishingCode,
      },
      {
        key: "third-party-monitoring-disabled",
        message:
          "Third-party signer monitoring is disabled while watch wallets are tracked. Re-enable monitoring to flag rogue approvals.",
        resolution: "Third-party signer monitoring re-enabled.",
        condition:
          !settings.monitorThirdPartySigners && totalExternalWallets > 0,
      },
    ];

    risks.forEach((risk) => {
      const isTriggered = risk.condition;
      const previouslyTriggered = triggeredRef.current.has(risk.key);

      if (isTriggered && !previouslyTriggered) {
        triggeredRef.current.add(risk.key);
        recordEvent({
          type: "risk_detected",
          message: risk.message,
        });
        addAlert({
          type: "system",
          severity: "warning",
          title: "Security risk detected",
          description: risk.message,
          dedupeKey: `security-${risk.key}`,
          source: { kind: "system" },
        });
      } else if (!isTriggered && previouslyTriggered) {
        triggeredRef.current.delete(risk.key);
        if (risk.resolution) {
          recordEvent({
            type: "monitor_resolution",
            message: risk.resolution,
          });
        }
      }
    });
  }, [
    settings,
    watchlist,
    activeAddresses,
    addAlert,
    recordEvent,
  ]);

  return null;
}


