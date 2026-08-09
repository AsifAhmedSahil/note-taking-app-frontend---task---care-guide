import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "md" | "lg";
};

const baseStyles =
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-control font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 disabled:cursor-not-allowed disabled:opacity-50";

const variantStyles = {
  primary: "bg-accent text-accent-foreground shadow-sm hover:bg-accent-hover",
  secondary: "border border-border bg-surface text-foreground hover:bg-muted/10",
  danger: "bg-red-600 text-white shadow-sm hover:bg-red-700",
  ghost: "text-muted hover:bg-muted/10 hover:text-foreground",
};

const sizeStyles = {
  md: "h-9 px-4 text-sm",
  lg: "h-10 px-5 text-sm",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = "primary", size = "md", className = "", ...props },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type="button"
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";