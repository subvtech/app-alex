<template>
  <v-card
    data-testid="trails-card"
    :min-width="width.min"
    :max-width="width.max"
    :class="{
      'vertical-grid': isVertical,
      'horizontal-grid column-gap-4 card': !isVertical,
      'hover-shadow': isHovering,
    }"
    variant="outlined"
    color="gray-100"
    rounded="lg"
    class="grid bg-white"
    @click="() => emits('open')"
    @mouseover="isHovering = true"
    @mouseleave="isHovering = false"
  >
    <div class="header">
      <v-img
        :src="image.url || '/images/cover_image_course.svg'"
        :alt="image.alt"
        :class="{ grayscale: hide }"
        cover
        height="100%"
        aspect-ratio="2.5"
      />

      <v-tooltip
        :text="$t('components.learningPlan.cardTrails.hidden')"
        location="bottom center"
      >
        <template #activator="{ props: propsTooltip }">
          <alex-custom-chip
            v-if="hide"
            v-bind="propsTooltip"
            class="hidden-icon"
            status="dark"
            icon="mdi-eye-off-outline"
            variant="elevated"
          >
          </alex-custom-chip>
        </template>
      </v-tooltip>

      <div data-testid="trails-card-hover-area" :class="{ hover: isHovering }">
        <alex-inputs-dropdown
          v-if="direction !== 'HORIZONTAL'"
          v-model="showOptions"
          :close-on-content-click="false"
          :class="{ hidden: !isHovering && !showOptions }"
          :items="dropdownItems(hide)"
        >
          <template #activator="{ props: propsMenu, isActive }">
            <v-tooltip
              :text="$t('components.learningPlan.cardTrails.options')"
              location="bottom center"
            >
              <template #activator="{ props: optionsTooltipProps }">
                <alex-custom-button
                  v-if="isHovering || isActive"
                  data-testid="alex-learningplan-card-hover-options"
                  variant="secondary"
                  v-bind="{ ...propsMenu, ...optionsTooltipProps }"
                  icon="mdi-dots-vertical"
                  class="options"
                  size="small"
                />
              </template>
            </v-tooltip>
          </template>
        </alex-inputs-dropdown>
      </div>
    </div>
    <div
      class="d-flex flex-column gap-3"
      :class="{
        'py-2': !isVertical,
        'pa-4 pb-6': isVertical,
      }"
    >
      <div class="d-flex gap-2 align-center justify-space-between">
        <v-tooltip
          :text="name"
          :location="isVertical ? 'top center' : 'top left'"
          :disabled="isActiveTitleTooltip"
          max-width="360"
        >
          <template #activator="{ props: propsTooltip }">
            <h5
              v-bind="propsTooltip"
              class="text-body-2 text-gray-900 ellipsis lines-2 max-height-48"
              :class="{ 'grayscale-2': hide, 'max-width-80': !isVertical }"
            >
              {{ name }}
            </h5>
          </template>
        </v-tooltip>

        <div v-if="!isVertical && canEdit" class="align-self-start">
          <alex-inputs-dropdown
            v-model="showOptions"
            :close-on-content-click="false"
            :class="{ hidden: !isHovering && !showOptions }"
            :items="dropdownItems(hide)"
          >
            <template #activator="{ props: propsMenu }">
              <v-tooltip
                :text="$t('components.learningPlan.cardTrails.options')"
                location="bottom center"
              >
                <template #activator="{ props: optionsTooltipProps }">
                  <alex-custom-button
                    variant="text"
                    v-bind="{ ...propsMenu, ...optionsTooltipProps }"
                    icon="mdi-dots-vertical"
                    size="small"
                  />
                </template>
              </v-tooltip>
            </template>
          </alex-inputs-dropdown>
        </div>
      </div>

      <div
        class="text-body-5 text-gray-600 ellipsis lines-3"
        lines="three"
        :class="{ 'grayscale-2': hide, 'max-width-80': !isVertical }"
      >
        {{ description }}
      </div>
      <div class="mt-auto">
        <v-tooltip
          :text="listBlocks"
          :disabled="!hasBlocks"
          location="bottom center"
          data-testid="trails-documents-tooltip"
        >
          <template #activator="{ props: propsTooltip }">
            <div
              class="documents"
              v-bind="propsTooltip"
              data-testid="trails-documents-icon"
            >
              <v-icon size="20" color="gray-600"
                >mdi-text-box-multiple-outline</v-icon
              >
              <span data-testid="trails-documents-icon-counter-type">{{
                blocks?.length || 0
              }}</span>
            </div>
          </template>
        </v-tooltip>
      </div>
    </div>
  </v-card>
</template>

<script setup lang="ts">
interface Block {
  type: 'carousel' | 'video' | (string & {});
}
interface LearningPlanCard {
  image: { url: string; alt?: string };
  name: string;
  description: string;
  hide?: boolean;
  blocks?: Block[];
  canEdit: boolean;
}
const { t } = useI18n();
const props = withDefaults(defineProps<LearningPlanCard>(), {
  direction: 'VERTICAL',
  hide: false,
  blocks: undefined,
  canEdit: false,
});
const isHovering = ref(false);
const direction = useDirection('mobile');
const showOptions = ref(false);
const isVertical = computed(() => direction.value === 'VERTICAL');
const width = computed(() =>
  isVertical.value ? { min: 240, max: 260 } : { min: 300, max: 350 },
);
const isActiveTitleTooltip = computed(() => {
  if (isVertical.value) return props.name.length < 30;
  else return props.name.length < 30;
});

const blocksInfo = computed(() => {
  return props.blocks?.reduce((info, block) => {
    if (Object.hasOwn(info, block.type)) {
      info[block.type] += 1;
    } else {
      info[block.type] = 1;
    }
    return info;
  }, {});
});

const isPlural = (value: number) => (value > 1 ? 's' : '');

const listBlocks = computed(() => {
  let stringBlocks = '';
  if (blocksInfo.value) {
    for (const [key, value] of Object.entries(blocksInfo.value)) {
      stringBlocks += `${value} ${t(
        `components.learningPlan.cardTrails.${key}`,
      )}${isPlural(value)}; `;
    }
  }
  return stringBlocks;
});

const hasBlocks = computed(() => {
  if (props.blocks) {
    return !!props.blocks.length;
  }
  return false;
});

const dropdownItems = (hidden: boolean) => {
  return [
    {
      text: hidden
        ? t('components.learningPlan.cardTrails.visibility.show')
        : t('components.learningPlan.cardTrails.visibility.hide'),
      icon: hidden ? 'mdi-eye-outline' : 'mdi-eye-off-outline',
      onClick: () => {
        emits('toggleVisibility');
      },
    },
    {
      text: t('components.learningPlan.cardTrails.configurations'),
      icon: 'mdi-cog-outline',
      onClick: () => emits('configurations'),
    },
    {
      text: t('components.learningPlan.cardTrails.copy'),
      icon: 'mdi-content-copy',
      onClick: () => emits('copy'),
    },
  ];
};

const emits = defineEmits([
  'open',
  'configurations',
  'toggleVisibility',
  'copy',
]);
</script>

<style scoped lang="scss">
.card {
  min-height: 175px;
}
.grid {
  display: grid;
  align-content: stretch;
  height: fit-content;
}

.vertical-grid {
  grid-template-rows: 150px 1fr;
  grid-template-columns: 1fr;
}

.horizontal-grid {
  grid-template-columns: 120px 1fr auto;
  grid-template-rows: 1fr;
}

.header {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.favorite,
.hidden-icon,
.options,
.hover {
  position: absolute;
}

.hidden-icon {
  bottom: 16px;
  right: 16px;
  z-index: 1;
}

.options {
  top: 16px;
  right: 16px;
}

.hover {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #0005;
  transition: background 300ms ease-in-out;
}

.hidden {
  visibility: hidden;
}

.grayscale {
  filter: grayscale(100%);
}
.grayscale-2 {
  filter: grayscale(100%);
  opacity: 0.6;
}

.column-gap-4 {
  column-gap: 16px;
}

.documents {
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgb(var(--v-theme-gray-600));
  border: 1px solid #fff;
  border-color: rgb(var(--v-theme-gray-100));
  padding: 8px;
  gap: 8px;
  border-radius: 8px;
  width: fit-content;
}

.max-height-48 {
  max-height: 48px;
}

.max-width-80 {
  max-width: 125px;
}

.hover-shadow {
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.1);
}
</style>
