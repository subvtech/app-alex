import { type VariantProps, cva } from 'class-variance-authority';

export { default as Sheet } from './Sheet.vue';
export { default as SheetTrigger } from './SheetTrigger.vue';
export { default as SheetClose } from './SheetClose.vue';
export { default as SheetContent } from './SheetContent.vue';
export { default as SheetHeader } from './SheetHeader.vue';
export { default as SheetTitle } from './SheetTitle.vue';
export { default as SheetDescription } from './SheetDescription.vue';
export { default as SheetFooter } from './SheetFooter.vue';

export const sheetVariants = cva(
  'tw-fixed tw-z-[50] tw-top-[64px] tw-max-w-[640px] tw-h-full tw-gap-4 tw-bg-background tw-shadow-lg tw-transition tw-ease-in-out data-[state=open]:tw-animate-in data-[state=closed]:tw-animate-out data-[state=closed]:tw-duration-300 data-[state=open]:tw-duration-300',
  {
    variants: {
      side: {
        top: 'tw-inset-x-0 tw-top-0 tw-border-b data-[state=closed]:tw-slide-out-to-top data-[state=open]:tw-slide-in-from-top',
        bottom:
          'tw-inset-x-0 tw-bottom-0 tw-border-t data-[state=closed]:tw-slide-out-to-bottom data-[state=open]:tw-slide-in-from-bottom',
        left: 'tw-inset-y-0 tw-left-0 tw-h-full tw-w-3/4 tw-border-r data-[state=closed]:tw-slide-out-to-left data-[state=open]:tw-slide-in-from-left tw-sm:tw-max-w-sm',
        right:
          'tw-inset-y-0 tw-right-0 tw-h-full tw-w-3/4 tw-border-l data-[state=closed]:tw-slide-out-to-right data-[state=open]:tw-slide-in-from-right tw-sm:tw-max-w-sm',
      },
    },
    defaultVariants: {
      side: 'right',
    },
  },
);

export type SheetVariants = VariantProps<typeof sheetVariants>;
