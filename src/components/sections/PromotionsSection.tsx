/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Gift, Award } from "lucide-react";
import { PromotionBannerCarousel } from "@/components/PromotionBannerCarousel";

interface PromotionsSectionProps {
  promotionBanners: any[];
}

const PromotionsSection = ({ promotionBanners }: PromotionsSectionProps) => (
  <div className="space-y-8">
    {promotionBanners.length > 0 ? (
      <PromotionBannerCarousel banners={promotionBanners} />
    ) : null}
    <h2 className="text-2xl md:text-4xl font-headline font-extrabold tracking-tight">Promotions & Rewards</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
      <div className="glass-panel p-5 md:p-8 rounded-2xl border border-white/5 flex items-center gap-4 md:gap-6">
        <Gift className="w-12 h-12 text-primary shrink-0" />
        <div>
          <h3 className="text-sm md:text-xl font-headline font-extrabold mb-1">Daily Rewards</h3>
          <p className="text-[10px] md:text-sm text-on-surface-variant">Login daily for bonus opportunities.</p>
        </div>
      </div>
      <div className="glass-panel p-5 md:p-8 rounded-2xl border border-white/5 flex items-center gap-4 md:gap-6">
        <Award className="w-12 h-12 text-tertiary shrink-0" />
        <div>
          <h3 className="text-sm md:text-xl font-headline font-extrabold mb-1">VIP Rewards</h3>
          <p className="text-[10px] md:text-sm text-on-surface-variant">Level up for exclusive perks.</p>
        </div>
      </div>
    </div>
  </div>
);

export default PromotionsSection;
