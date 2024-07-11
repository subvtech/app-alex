import { type VariantProps, cva } from 'class-variance-authority';

export { default as Toggle } from './Toggle.vue';

export const toggleVariants = cva(
  'tw-inline-flex tw-items-center tw-justify-center tw-rounded-md tw-text-sm tw-font-medium ring-offset-background tw-transition-colors hover:tw-bg-muted hover:tw-text-muted-foreground focus-visible:tw-outline-none focus-visible:tw-ring-2 focus-visible:tw-ring-ring focus-visible:tw-ring-offset-2 disabled:tw-pointer-events-none disabled:tw-opacity-50 data-[active=true]:tw-bg-accent data-[active=true]:tw-text-accent-foreground',
  {
    variants: {
      variant: {
        default: 'tw-bg-transparent',
        outline:
          'tw-border tw-border-input tw-bg-transparent hover:tw-bg-accent hover:tw-text-accent-foreground',
      },
      size: {
        default: 'tw-h-10 tw-px-3',
        sm: 'tw-h-9 tw-px-2.5',
        lg: 'tw-h-11 tw-px-5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export type ToggleVariants = VariantProps<typeof toggleVariants>;
