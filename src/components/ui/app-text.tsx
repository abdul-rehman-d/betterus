import type { PropsWithChildren } from "react";
import { Text, type TextProps } from "react-native";

type Props = TextProps &
  PropsWithChildren & {
    variant?: "display" | "title" | "subtitle" | "body" | "label" | "caption" | "metric";
  };
const variants = {
  display: "font-heading text-[30px] leading-9 text-plum",
  title: "font-heading text-2xl leading-8 text-plum",
  subtitle: "font-heading-semibold text-xl leading-7 text-plum",
  body: "font-body text-[15px] leading-[22px] text-muted",
  label: "font-body-semibold text-[15px] leading-5 text-plum",
  caption: "font-body text-xs leading-4 text-muted",
  metric: "font-heading text-[38px] leading-[44px] text-plum",
} as const;
export default function AppText({ className, variant = "body", ...props }: Props) {
  return <Text className={`${variants[variant]} ${className ?? ""}`} {...props} />;
}
