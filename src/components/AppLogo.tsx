import React from "react";
import clsx from "clsx";
import { APP_CONSTANTS } from "@/lib/app_constants";

type LogoProps = { 
  variant?: "nav" | "loader"; 
  className?: string;
};

export const AppLogo: React.FC<LogoProps> = ({ 
  variant = "nav", 
  className = "",
}) => {
  const sizeStyles = {
    nav: "h-8 w-auto",        // small (navbar)
    loader: "h-20 w-auto",   // larger (loader)
  };

  return (
    <div
      className={clsx(
        "flex items-center justify-center",
        // 'bg-primary', // tailwind bg classes
        variant === "loader" && "p-4 rounded-2xl",
        className
      )}
    >
      <img
        src={APP_CONSTANTS.logoTransparentSrc}
        alt={"logo"}
        className={clsx(
          "object-contain select-none",
          sizeStyles[variant]
        )}
        draggable={false}
      />
    </div>
  );
};