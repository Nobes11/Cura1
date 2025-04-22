import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const signatureButtonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-teal-500 to-emerald-500 text-white hover:from-teal-600 hover:to-emerald-600 active:scale-95 shadow-md",
        primary: "bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 active:scale-95 shadow-md",
        physician: "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 active:scale-95 shadow-md",
        nurse: "bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600 active:scale-95 shadow-md",
        urgent: "bg-gradient-to-r from-red-500 to-rose-500 text-white hover:from-red-600 hover:to-rose-600 active:scale-95 shadow-md",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
      shape: {
        default: "rounded-md",
        pill: "rounded-full",
        diamond: "rounded-md rotate-45",  // Content will need to be counter-rotated
        hexagon: "clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      shape: "default",
    },
  }
);

export interface SignatureButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof signatureButtonVariants> {
  asChild?: boolean;
  loading?: boolean;
  providerInfo?: {
    id: string;
    name: string;
  }
}

const SignatureButton = React.forwardRef<HTMLButtonElement, SignatureButtonProps>(
  ({ className, variant, size, shape, asChild = false, loading = false, providerInfo, children, ...props }, ref) => {
    const Comp = "button";
    const isRotated = shape === "diamond";
    
    return (
      <Comp
        className={cn(signatureButtonVariants({ variant, size, shape, className }))}
        ref={ref}
        disabled={props.disabled || loading}
        {...props}
      >
        <span className={isRotated ? "-rotate-45 flex items-center" : "flex items-center"}>
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2">
                <path d="M7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3"></path>
                <path d="M9 4a2 2 0 1 1 3 3L7 12h3"></path>
              </svg>
              {children || "Sign"}
            </>
          )}
        </span>
        {providerInfo && (
          <div className="absolute bottom-0 left-0 right-0 text-xs opacity-80 bg-black/10 py-0.5 text-center">
            {providerInfo.name}
          </div>
        )}
      </Comp>
    );
  }
);

SignatureButton.displayName = "SignatureButton";

export { SignatureButton, signatureButtonVariants };
