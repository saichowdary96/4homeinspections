import {
  Home,
  Tag,
  HardHat,
  CalendarCheck,
  CalendarPlus,
  Wind,
  Thermometer,
  Search,
  FileText,
  ShieldCheck,
  BadgeCheck,
  Zap,
  Eye,
  Cpu,
  MessageCircle,
  Award,
  type LucideProps,
} from "lucide-react";

/**
 * Maps the string `icon` names used in our data files to Lucide components,
 * so content authors can reference icons declaratively without importing.
 */
const iconMap = {
  Home,
  Tag,
  HardHat,
  CalendarCheck,
  CalendarPlus,
  Wind,
  Thermometer,
  Search,
  FileText,
  ShieldCheck,
  BadgeCheck,
  Zap,
  Eye,
  Cpu,
  MessageCircle,
  Award,
} as const;

export type IconName = keyof typeof iconMap;

export function Icon({ name, ...props }: { name: string } & LucideProps) {
  const Component = iconMap[name as IconName] ?? Home;
  return <Component {...props} />;
}
