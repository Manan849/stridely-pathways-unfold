
import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // Apple-style + responsive size and min-w, fit parent without overflow
          "flex h-11 w-full min-w-0 rounded-lg border border-gray-200 bg-white px-4 py-2 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-accent/60 focus:border-accent/80 disabled:opacity-60 transition-all font-sfpro min-h-[44px]",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
