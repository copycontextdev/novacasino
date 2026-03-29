import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface AppTabItem {
  key: string;
  name: string;
  content: ReactNode;
  icon?: LucideIcon;
  panelClassName?: string;
}

interface AppTabProps {
  items: AppTabItem[];
  initialIndex?: number;
  listClassName?: string;
  panelsClassName?: string;
  tabClassName?: string;
  selectedTabClassName?: string;
  unselectedTabClassName?: string;
  panelClassName?: string;
}

export default function AppTab({
  items,
  initialIndex = 0,
  listClassName,
  panelsClassName,
  tabClassName,
  selectedTabClassName,
  unselectedTabClassName,
  panelClassName,
}: AppTabProps) {
  return (
    <TabGroup defaultIndex={initialIndex}>
      <TabList
        className={cn(
          "flex flex-wrap gap-2 rounded-full border border-white/10 bg-surface p-1.5",
          listClassName,
        )}
      >
        {items.map(({ key, name, icon: Icon }) => (
          <Tab
            key={key}
            className={({ selected }) =>
              cn(
                "inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm font-bold transition-all focus:outline-none",
                selected
                  ? "bg-primary text-on-primary shadow-[0_0_26px_rgba(242,120,75,0.28)]"
                  : "text-on-surface-variant hover:text-on-surface",
                selected ? selectedTabClassName : unselectedTabClassName,
                tabClassName,
              )
            }
          >
            {Icon ? <Icon className="h-4 w-4" /> : null}
            {name}
          </Tab>
        ))}
      </TabList>

      <TabPanels className={cn("mt-6", panelsClassName)}>
        {items.map((item) => (
          <TabPanel
            key={item.key}
            className={cn("focus:outline-none", panelClassName, item.panelClassName)}
          >
            {item.content}
          </TabPanel>
        ))}
      </TabPanels>
    </TabGroup>
  );
}
