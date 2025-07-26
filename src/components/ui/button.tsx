import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-base font-bold transition-all border-2 border-black focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-sage text-black shadow-brutalist hover:translate-x-1 hover:translate-y-1 hover:shadow-none",
        destructive: "bg-destructive text-destructive-foreground shadow-brutalist hover:translate-x-1 hover:translate-y-1 hover:shadow-none",
        outline: "bg-background text-black shadow-brutalist hover:bg-mint hover:translate-x-1 hover:translate-y-1 hover:shadow-none",
        secondary: "bg-cream text-black shadow-brutalist hover:translate-x-1 hover:translate-y-1 hover:shadow-none",
        ghost: "border-transparent shadow-none hover:bg-mint hover:border-black hover:shadow-brutalist",
        link: "text-primary border-transparent shadow-none underline-offset-4 hover:underline",
        accent: "bg-lavender text-black shadow-brutalist hover:translate-x-1 hover:translate-y-1 hover:shadow-none",
        bright: "bg-lime text-black shadow-brutalist hover:translate-x-1 hover:translate-y-1 hover:shadow-none",
      },
      size: {
        default: "h-12 px-6 py-3 rounded-sm",
        sm: "h-10 px-4 py-2 rounded-sm text-sm",
        lg: "h-14 px-8 py-4 rounded-sm text-lg",
        icon: "h-12 w-12 rounded-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
