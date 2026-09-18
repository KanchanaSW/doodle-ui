"use client";

import { AccountAccessCard } from "./AccountAccessCard";
import { BillingPlanCard } from "./BillingPlanCard";
import { ClaimableBalanceCard } from "./ClaimableBalanceCard";
import { ContributionHistoryCard } from "./ContributionHistoryCard";
import { DividendIncomeCard } from "./DividendIncomeCard";
import { KitchenSinkCard } from "./KitchenSinkCard";
import { MilestoneCard } from "./MilestoneCard";
import { MobileConnectCard } from "./MobileConnectCard";
import { NavListsCard } from "./NavListsCard";
import { NewChatCard } from "./NewChatCard";
import { PayoutThresholdCard } from "./PayoutThresholdCard";
import { QuickActionsCard } from "./QuickActionsCard";
import { SavingsTargetsCard } from "./SavingsTargetsCard";
import { SetupProgressCard } from "./SetupProgressCard";
import { SupportFaqCard } from "./SupportFaqCard";
import { TeamActivityCard } from "./TeamActivityCard";

export function BentoShowcase() {
  return (
    <section
      className="max-w-[1400px] mx-auto px-4 md:px-8 pb-16 md:pb-20"
      aria-label="Component showcase"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
        <div className="grid gap-4">
          <ClaimableBalanceCard />
          <TeamActivityCard />
          <NavListsCard />
          <SavingsTargetsCard />
        </div>

        <div className="grid gap-4">
          <KitchenSinkCard />
          <SetupProgressCard />
          <ContributionHistoryCard />
        </div>

        <div className="grid gap-4">
          <BillingPlanCard />
          <NewChatCard />
          <PayoutThresholdCard />
          <DividendIncomeCard />
        </div>

        <div className="grid gap-4">
          <MilestoneCard />
          <SupportFaqCard />
          <MobileConnectCard />
          <AccountAccessCard />
          <QuickActionsCard />
        </div>
      </div>
    </section>
  );
}
