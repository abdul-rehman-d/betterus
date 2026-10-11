import type { PropsWithChildren } from "react";
import { Text, type TextProps } from "react-native";

type Props = TextProps &
  PropsWithChildren & {
    variant?: "display" | "title" | "subtitle" | "body" | "label" | "caption" | "metric";
  };
const variants = {
  display: "font-heading text-[34px] leading-[40px] tracking-[-1px] text-plum",
  title: "font-heading text-[25px] leading-8 tracking-[-0.5px] text-plum",
  subtitle: "font-heading-semibold text-[19px] leading-7 tracking-[-0.2px] text-plum",
  body: "font-body text-[15px] leading-[23px] text-muted",
  label: "font-body-semibold text-[14px] leading-5 text-plum",
  caption: "font-body text-[12px] leading-[17px] text-muted",
  metric: "font-heading text-[42px] leading-[48px] tracking-[-1.5px] text-plum",
} as const;
export default function AppText({ className, variant = "body", ...props }: Props) {
  return <Text className={`${variants[variant]} ${className ?? ""}`} {...props} />;
}
