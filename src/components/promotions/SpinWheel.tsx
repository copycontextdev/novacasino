import { useEffect, useRef } from "react";
import { motion, useAnimation } from "motion/react";
import type { SabiSpinReward } from "@/types/api.types";

interface SpinWheelProps {
  rewards: SabiSpinReward[];
  targetRewardId: number | null;
  isSpinning: boolean;
  resetKey: number;
  onSpinComplete: () => void;
}

export function SpinWheel({
  rewards,
  targetRewardId,
  isSpinning,
  resetKey,
  onSpinComplete,
}: SpinWheelProps) {
  const controls = useAnimation();
  const rotationRef = useRef(0);

  useEffect(() => {
    rotationRef.current = 0;
    controls.set({ rotate: 0 });
  }, [controls, resetKey]);

  useEffect(() => {
    if (!isSpinning || targetRewardId === null || rewards.length === 0) {
      return;
    }

    const targetIndex = rewards.findIndex((reward) => reward.id === targetRewardId);
    if (targetIndex === -1) {
      return;
    }

    const segmentAngle = 360 / rewards.length;
    const targetAngle = 360 - (targetIndex * segmentAngle + segmentAngle / 2);
    const currentAngle = ((rotationRef.current % 360) + 360) % 360;
    const deltaToTarget = ((targetAngle - currentAngle) + 360) % 360;
    const finalRotation = rotationRef.current + 360 * 8 + deltaToTarget;

    void controls
      .start({
        rotate: finalRotation,
        transition: {
          duration: 3.6,
          ease: [0.16, 1, 0.3, 1],
        },
      })
      .then(() => {
        rotationRef.current = finalRotation % 360;
        onSpinComplete();
      });
  }, [controls, isSpinning, onSpinComplete, rewards, targetRewardId]);

  return (
    <div className="relative mx-auto flex h-[min(20rem,calc(100vw-5rem))] w-[min(20rem,calc(100vw-5rem))] items-center justify-center md:h-[24rem] md:w-[24rem]">
      <div className="absolute -top-4 left-1/2 z-20 -translate-x-1/2 border-x-16 border-b-0 border-t-28 border-x-transparent border-t-primary drop-shadow-[0_0_12px_rgba(242,120,75,0.55)]" />

      <motion.div
        animate={controls}
        className="relative h-full w-full overflow-hidden rounded-full border-10 border-primary/25 bg-surface shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_24px_60px_rgba(0,0,0,0.35)]"
      >
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
          {rewards.map((reward, index) => {
            const angle = 360 / rewards.length;
            const startAngle = index * angle;
            const endAngle = (index + 1) * angle;

            const x1 = 50 + 50 * Math.cos((Math.PI * startAngle) / 180);
            const y1 = 50 + 50 * Math.sin((Math.PI * startAngle) / 180);
            const x2 = 50 + 50 * Math.cos((Math.PI * endAngle) / 180);
            const y2 = 50 + 50 * Math.sin((Math.PI * endAngle) / 180);

            const largeArcFlag = angle > 180 ? 1 : 0;
            const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

            return (
              <g key={reward.id}>
                <path
                  d={pathData}
                  fill={reward.background_color}
                  stroke="rgba(255,255,255,0.12)"
                  strokeWidth="0.7"
                />
                <text
                  x="77"
                  y="50"
                  fill={reward.text_color}
                  fontSize="4.2"
                  fontWeight="700"
                  textAnchor="middle"
                  transform={`rotate(${startAngle + angle / 2}, 50, 50)`}
                  style={{ pointerEvents: "none" }}
                  className="select-none"
                >
                  {reward.name}
                </text>
              </g>
            );
          })}
        </svg>

        <div className="absolute inset-0 rounded-full shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05),inset_0_10px_30px_rgba(255,255,255,0.06)]" />
      </motion.div>

      <div className="absolute left-1/2 top-1/2 z-10 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-primary/25 bg-surface-container shadow-[0_0_28px_rgba(242,120,75,0.25)]">
        <div className="h-5 w-5 rounded-full bg-primary shadow-[0_0_16px_rgba(242,120,75,0.4)]" />
      </div>
    </div>
  );
}
