<template>
  <v-container
    class="page rounded-lg bg-white pa-6 gap-6 d-flex flex-column align-start pb-15"
  >
    <alex-documentation-header :title="title" :description="description" />
    <alex-documentation-accordions-props-list
      :data="listProps"
      show-positions
    />
    <alex-documentation-example
      v-for="item in examples"
      :snippets="item.snippets"
      :title="item.title"
      :description="item.description"
    >
    </alex-documentation-example>
    <alex-documentation-playground :data="listProps">
      <template #component="{ props }">
        <alex-documentation-buttons-tooltip
          :disabled="props.disabled"
          :icon="props.icon"
          :icon-size="props.iconSize"
          :rounded="props.rounded"
          :variant="props.variant"
          :tooltip-location="props.tooltipLocation"
          :tooltip-text="props.tooltipText"
        />
      </template>
    </alex-documentation-playground>
  </v-container>
</template>

<script setup lang="ts">
import { ExampleComponentType } from '~/components/alex/documentation/Example.vue';
import { PlaygroundItemType } from '~/components/alex/documentation/Playground.vue';
import { TooltipButtonComponentType } from '~/components/alex/documentation/buttons/Tooltip.vue';

definePageMeta({
  layout: 'components',
  middleware: 'auth',
});

const title = 'Tooltip Button';
const description = 'É usado como alex-custom-button dentro de um v-tooltip';
const tooltipButtonProps: TooltipButtonComponentType = {
  tooltipText: 'text',
  tooltipLocation: 'top',
  variant: 'success',
  icon: 'mdi-content-copy',
  rounded: false,
  disabled: false,
  iconSize: 'large',
};

const listProps: PlaygroundItemType[] = [
  {
    name: 'tooltipText',
    type: 'string',
    required: false,
    default: '',
    description: 'The text that will be shown in the tooltip box',
    initialValue: tooltipButtonProps.tooltipText,
  },
  {
    name: 'tooltipLocation',
    type: "'start' | 'bottom' | 'end' | 'top'",
    required: false,
    default: 'top',
    description: 'The position the tooltip box will appear',
    initialValue: tooltipButtonProps.tooltipLocation,
  },
  {
    name: 'variant',
    type: "'primary' | 'secondary' | 'tertiary' | 'text' | 'error' | 'success' | 'warning' | 'info'",
    required: false,
    default: 'success',
    description: 'The alex-custom-button variant to be applied',
    initialValue: tooltipButtonProps.variant,
  },
  {
    name: 'icon',
    type: 'string',
    required: false,
    default: 'mdi-content-copy',
    description: 'The icon to be shown inside the button',
    initialValue: tooltipButtonProps.icon,
  },
  {
    name: 'iconSize',
    type: "'default' | 'small' | 'large'",
    required: false,
    default: 'large',
    description: 'The icon size inside the button',
    initialValue: tooltipButtonProps.iconSize,
  },
  {
    name: 'disabled',
    type: 'boolean',
    required: false,
    default: 'false',
    description: 'Whether the button will be active or not',
    initialValue: tooltipButtonProps.disabled,
  },
  {
    name: 'rounded',
    type: 'boolean',
    required: false,
    default: 'false',
    description: 'If true it applies border-radius 50% to the button',
    initialValue: tooltipButtonProps.rounded,
  },
];

const examples = ref<ExampleComponentType[]>([
  {
    snippets: [
      {
        template: `<alex-documentation-buttons-tooltip
            :disabled="props.disabled"
            :icon="props.icon"
            :icon-size="props.iconSize"
            :rounded="props.rounded"
            :variant="props.variant"
            :tooltip-location="props.tooltipLocation"
            :tooltip-text="props.tooltipText"
        />`,
        label: 'Template',
      },
      {
        template: `const tooltipButtonProps: TooltipButtonComponentType = {
  tooltipText: 'text',
  tooltipLocation: 'top',
  variant: 'success',
  icon: 'mdi-content-copy',
  rounded: false,
  disabled: false,
  iconSize: 'large',
};`,
        label: 'Script',
      },
    ],
    hasExample: true,
    title: 'Basic Usage',
    description: '',
  },
]);
</script>
