import { type VariantProps, cva } from 'class-variance-authority';

export { default as Button } from './Button.vue';

export const buttonVariants = cva(
  'tw-inline-flex tw-items-center tw-justify-center tw-whitespace-nowrap tw-rounded-md tw-text-sm tw-font-medium tw-ring-offset-background tw-transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 tw-disabled:pointer-events-none tw-disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'tw-bg-primary tw-text-primary-foreground hover:bg-primary/90',
        destructive:
          'tw-bg-destructive tw-text-destructive-foreground hover:bg-destructive/90',
        outline:
          'tw-border tw-border-input tw-bg-background hover:bg-accent hover:text-accent-foreground',
        secondary:
          'tw-bg-secondary tw-text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'tw-text-primary tw-underline-offset-4 hover:tw-underline',
      },
      size: {
        default: 'tw-h-10 tw-px-4 tw-py-2',
        xs: 'tw-h-7 tw-rounded tw-px-2',
        sm: 'tw-h-9 tw-rounded-md tw-px-3',
        lg: 'tw-h-11 tw-rounded-md tw-px-8',
        icon: 'tw-h-10 tw-w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;
