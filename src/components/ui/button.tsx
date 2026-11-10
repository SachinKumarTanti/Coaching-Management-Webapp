import * as React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "accent" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading = false, children, disabled, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] select-none";

    const variantStyles = {
      primary: "bg-primary text-white hover:bg-primary-hover focus-visible:ring-primary shadow-sm",
      secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200 focus-visible:ring-slate-400",
      outline: "border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 focus-visible:ring-slate-400",
      accent: "bg-accent text-slate-950 font-semibold hover:bg-accent-hover focus-visible:ring-accent shadow-sm",
      ghost: "text-slate-700 hover:bg-slate-100 focus-visible:ring-slate-300",
      destructive: "bg-rose-600 text-white hover:bg-rose-700 focus-visible:ring-rose-500 shadow-sm",
    };

    const sizeStyles = {
      sm: "h-9 px-3 text-sm",
      md: "h-11 px-4 text-base min-h-[44px]", // 44px min height for mobile touch targets
      lg: "h-12 px-6 text-lg min-h-[48px]",
      icon: "h-11 w-11 min-h-[44px] min-w-[44px]",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button };
