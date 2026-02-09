import * as React from "react"
import { Link } from "react-router-dom"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const f1ButtonVariants = cva(
  "inline-flex h-12 items-center justify-center rounded-full px-8 text-sm font-bold tracking-wide transition-all duration-300 hover:scale-[1.02] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-f1-neon focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-f1-neon text-white shadow-lg shadow-f1-neon/20 border border-white/30 hover:bg-f1-neon hover:brightness-110 hover:shadow-f1-neon/50",
        outline:
          "border border-f1-card-border bg-secondary/80 text-foreground backdrop-blur-sm hover:bg-secondary hover:text-white hover:border-f1-neon/50 hover:shadow-f1-neon/30 hover:brightness-110",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-12 px-8",
        sm: "h-9 px-4 rounded-full",
        lg: "h-14 px-10 rounded-full text-base",
        icon: "h-10 w-10 px-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface F1ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof f1ButtonVariants> {
  to?: string
}

const F1Button = React.forwardRef<HTMLButtonElement, F1ButtonProps>(
  ({ className, variant, size, to, ...props }, ref) => {
    // If 'to' prop is provided, render as a React Router Link
    if (to) {
      return (
        <Link
          to={to}
          className={cn(f1ButtonVariants({ variant, size, className }))}
        >
          {props.children}
        </Link>
      )
    }

    return (
      <button
        className={cn(f1ButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
F1Button.displayName = "F1Button"

export { F1Button, f1ButtonVariants }
