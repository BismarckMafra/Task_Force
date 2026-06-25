import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

export function Button({
  className = "",
  variant = "primary",
  type = "button",
  ...props
}: ButtonProps) {
  const base =
    "inline-flex h-11 w-full items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60";
  const variants = {
    primary: "bg-emerald-700 text-white hover:bg-emerald-800",
    secondary:
      "border border-slate-300 bg-white text-slate-900 hover:border-slate-400 hover:bg-slate-50",
  };

  return <button className={`${base} ${variants[variant]} ${className}`} type={type} {...props} />;
}
