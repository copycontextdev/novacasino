import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronRight } from "lucide-react";
import type { SabiPromotionBanner } from "@/types/api.types";

const ROTATE_MS = 6500;

function isBannerSchedulable(banner: SabiPromotionBanner): boolean {
  if (!banner.is_active) return false;
  const now = Date.now();
  if (banner.start_date) {
    const t = new Date(banner.start_date).getTime();
    if (Number.isFinite(t) && t > now) return false;
  }
  if (banner.end_date) {
    const t = new Date(banner.end_date).getTime();
    if (Number.isFinite(t) && t < now) return false;
  }
  return true;
}

export function filterActivePromotionBanners(
  banners: SabiPromotionBanner[] | undefined,
): SabiPromotionBanner[] {
  if (!banners?.length) return [];
  return banners.filter(isBannerSchedulable);
}

export function PromotionBannerCarousel({ banners }: { banners: SabiPromotionBanner[] }) {
  const [index, setIndex] = useState(0);
  const list = useMemo(() => banners.filter((b) => b.image), [banners]);

  useEffect(() => {
    setIndex(0);
  }, [list]);

  useEffect(() => {
    if (list.length <= 1) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % list.length);
    }, ROTATE_MS);
    return () => window.clearInterval(id);
  }, [list.length]);

  if (!list.length) return null;

  const current = list[index]!;

  const openLink = () => {
    if (current.link) window.open(current.link, "_blank", "noopener,noreferrer");
  };

  return (
    <section className="relative h-48 md:h-80 rounded-sm overflow-hidden border border-white/5 bg-surface-container-low group">
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45 }}
          className="absolute inset-0"
        >
          <img
            src={current.image}
            alt={current.title ?? "Promotion"}
            className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-[1.02] transition-transform duration-[2s]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface/10 to-surface/20 z-10" />
          <div className="relative z-20 h-full flex flex-col justify-center p-6 md:p-12 max-w-xl">
            {current.title ? (
              <h1 className="text-2xl md:text-5xl font-headline font-extrabold text-white tracking-tight mb-2 md:mb-3">
                {current.title}
              </h1>
            ) : null}
            {current.description ? (
              <p className="text-on-surface-variant text-sm md:text-base mb-4 md:mb-6 line-clamp-3">
                {current.description}
              </p>
            ) : null}
            {current.link ? (
              <button
                type="button"
                onClick={openLink}
                className="inline-flex items-center gap-2 w-fit rounded-full bg-white text-surface px-5 py-2 md:px-8 md:py-3 text-xs md:text-sm font-bold hover:bg-primary hover:text-on-primary transition-colors shadow-lg"
              >
                {current.button_text ?? "Learn more"}
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : null}
          </div>
        </motion.div>
      </AnimatePresence>

      {list.length > 1 ? (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {list.map((b, i) => (
            <button
              key={b.id}
              type="button"
              aria-label={`Show banner ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-8 bg-primary" : "w-2 bg-white/40 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
