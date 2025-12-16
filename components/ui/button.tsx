import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";



const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
    pretty: `
  relative bg-[#e65a5a]   text-white rounded-full hover:bg-[#e65a5a]/90
  px-6 group isolate inline-flex items-center justify-center gap-2
  overflow-hidden text-sm font-medium transition duration-300 ease-[cubic-bezier(0.4,0.36,0,1)]
  before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:rounded-full
  before:bg-gradient-to-b before:from-[#e65a5a]/60 before:to-[#e65a5a]/60 before:opacity-80
  before:transition-all before:duration-300
  after:pointer-events-none after:absolute before:inset-0 after:-z-10 after:rounded-full
  after:bg-gradient-to-b after:from-transparent after:to-[#e65a5a]/20 after:mix-blend-overlay
  hover:before:shadow-[inset_0_0_12px_4px_rgba(255,255,255,0.5)] cursor-pointer font-bold
`
,
        iosBlack: `

                    relative inline-flex items-center justify-center gap-2
                    h-10 px-6 rounded-full font-medium text-base whitespace-nowrap
                    text-white bg-black border border-neutral-800
                    shadow-[inset_0_2px_3px_rgba(255,255,255,0.4),inset_0_-2px_3px_rgba(255,255,255,0.2)]
                    transition-all duration-150 ease-out
                    overflow-hidden isolate cursor-pointer group
                    before:absolute before:inset-0 before:rounded-full
                    before:bg-linear-to-b before:from-white/25 before:to-transparent before:opacity-40
                    before:transition-all before:duration-150
                    hover:bg-neutral-900 w-full
                    hover:before:opacity-60
                    hover:shadow-[inset_0_3px_6px_rgba(255,255,255,0.6),inset_0_-3px_6px_rgba(255,255,255,0.6)]
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-800
                    active:scale-[0.98]
                    disabled:pointer-events-none disabled:opacity-50
         
`,

        ios: `
  relative bg-white text-neutral-900 border border-neutral-200 
  rounded-full inline-flex items-center justify-center gap-2
  text-sm font-medium transition duration-300 ease-[cubic-bezier(0.4,0.36,0,1)]
  hover:bg-neutral-200 active:bg-neutral-200
  shadow-sm hover:shadow-2xl cursor-pointer select-none
  focus:outline-none focus:ring-2 ring-neutral-300 `,
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };