<template>
  <v-card
    class="grid"
    variant="outlined"
    color="gray-100"
    rounded="lg"
    data-testid="alex-learningplan-card"
    :min-width="width.min"
    :max-width="width.max"
    :class="{
      'vertical-grid card': isVertical,
      'horizontal-grid pa-2 column-gap-4 trail-card bg-green': !isVertical,
      'hover-shadow': isHovering,
    }"
    @click="() => emits('open')"
    @mouseover="isHovering = true"
    @mouseleave="isHovering = false"
  >
    <div :class="{ rounded: !isVertical }" class="header">
      <v-img
        :src="image.url || '/images/cover_image_course.svg'"
        :alt="image.alt"
        :class="{ grayscale: hide }"
        cover
        height="100%"
        aspect-ratio="2.5"
      />

      <alex-custom-chip
        :text="
          $t(
            `components.learningPlan.card.type.${
              type === 'course_project' ? 'project' : type
            }`,
          )
        "
        size="small"
        status="dark"
        class="type"
        variant="elevated"
      />
      <v-tooltip
        :text="$t('components.learningPlan.card.hidden')"
        location="bottom center"
      >
        <template #activator="{ props: hiddenTooltipProps }">
          <alex-custom-chip
            v-if="hide"
            v-bind="hiddenTooltipProps"
            class="hidden-icon"
            size="large"
            status="dark"
            icon="mdi-eye-off-outline"
            variant="elevated"
          >
          </alex-custom-chip>
        </template>
      </v-tooltip>

      <div
        data-testid="alex-learningplan-card-hover-area"
        :class="{ hover: isHovering }"
      >
        <v-tooltip
          :text="$t('components.learningPlan.card.favorite')"
          location="bottom center"
        >
          <template #activator="{ props: favoritedTooltipProps }">
            <alex-custom-button
              v-if="isHovering && !hideFavoritedButton"
              v-bind="favoritedTooltipProps"
              icon="mdi-cards-heart"
              class="favorite"
              variant="secondary"
              :class="{ 'text-error-0': favorited }"
              @click.stop="() => emits('favorite')"
            />
          </template>
        </v-tooltip>
        <alex-custom-dropdown
          v-if="direction !== 'HORIZONTAL' && options"
          v-model="showOptions"
          :close-on-content-click="false"
          :class="{ hidden: !isHovering && !showOptions }"
          :items="dropdownItems(hide)"
        >
          <template #activator="{ props: propsMenu, isActive }">
            <v-tooltip
              :text="$t('components.learningPlan.card.options')"
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
                />
              </template>
            </v-tooltip>
          </template>
        </alex-custom-dropdown>
      </div>
    </div>
    <div
      class="d-flex flex-column gap-4 justify-space-between"
      data-testid="alex-learningplan-card-content-area"
      :class="{
        'grayscale-2': hide,
        'py-2': !isVertical,
        'pa-4': isVertical,
      }"
    >
      <alex-custom-chip
        v-if="type !== 'course'"
        data-testid="alex-learningplan-card-status-chip"
        size="small"
        variant="flat"
        :status="statusConfig.variant"
        :text="$t(`components.learningPlan.card.status.${status}`)"
        :prepend-icon="statusConfig.icon"
      />
      <div class="d-flex flex-column pa-0 gap-2">
        <v-tooltip
          :text="title"
          :location="isVertical ? 'top center' : 'top left'"
          max-width="360"
          :disabled="isActiveTitleTooltip"
        >
          <template #activator="{ props: nameTooltipProps }">
            <h5
              v-bind="nameTooltipProps"
              class="text-h5 text-gray-900 ellipsis lines-2"
            >
              {{ title }}
            </h5>
          </template>
        </v-tooltip>
        <v-card-subtitle
          class="text-body-3 text-gray-600 ellipsis lines-3"
          lines="three"
          >{{ description }}</v-card-subtitle
        >
      </div>

      <div
        class="d-flex gap-6 flex-wrap py-2"
        :class="{ 'justify-space-between': members?.length }"
      >
        <alex-learningplan-card-info
          :avatar="{
            url: facilitator.imageURL,
            name: facilitator.name,
          }"
          :title="$t('components.learningPlan.card.facilitator')"
          :subtitle="facilitator.name"
        />
        <alex-learningplan-card-info
          v-if="type !== 'course_project'"
          icon="alex:trail"
          :title="$t('components.learningPlan.card.trails')"
          :subtitle="trailsCount"
        />

        <alex-custom-avatar-group
          v-else-if="members && type === 'course_project'"
          :avatar-items="members"
          :size="36"
        />
      </div>
    </div>

    <div v-if="!isVertical && options" class="h-full">
      <alex-inputs-dropdown
        v-model="showOptions"
        :close-on-content-click="false"
        :class="{ hidden: !isHovering && !showOptions }"
        :items="dropdownItems(hide)"
      >
        <template #activator="{ props: propsMenu }">
          <v-tooltip
            :text="$t('components.learningPlan.card.options')"
            location="bottom center"
          >
            <template #activator="{ props: optionsTooltipProps }">
              <alex-custom-button
                variant="text"
                v-bind="{ ...propsMenu, ...optionsTooltipProps }"
                icon="mdi-dots-vertical"
              />
            </template>
          </v-tooltip>
        </template>
      </alex-inputs-dropdown>
    </div>
  </v-card>
</template>

<script setup lang="ts">
interface member {
  name: string;
  image?: {
    url: string;
    alt?: string;
  };
}

interface LearningPlanCardProps {
  type?: 'project' | 'course' | 'course_project';
  image: { url: string; alt?: string };
  title: string;
  description: string;
  facilitator: { name: string; imageURL?: string };
  trailsCount: number;
  hide?: boolean;
  hideFavoritedButton?: boolean;
  favorited?: boolean;
  status?: 'start' | 'in_progress' | 'done';
  members?: member[];
  options?: boolean;
}

const props = withDefaults(defineProps<LearningPlanCardProps>(), {
  hideFavoritedButton: false,
  favorited: false,
  hide: false,
  type: 'course',
  status: 'start',
  members: undefined,
  options: true,
});

const { t } = useI18n();
const direction = useDirection();
const isHovering = ref(false);
const showOptions = ref(false);
const isVertical = computed(() => direction.value === 'VERTICAL');
const dropdownItems = (hidden: boolean) => {
  return [
    {
      text: hidden
        ? t('components.learningPlan.card.visibility.show')
        : t('components.learningPlan.card.visibility.hide'),
      icon: hidden ? 'mdi-eye-outline' : 'mdi-eye-off-outline',
      onClick: () => {
        emits('toggleVisibility');
      },
    },
    {
      text: t('components.learningPlan.card.configurations'),
      icon: 'mdi-cog-outline',
      onClick: () => emits('configurations'),
    },
  ];
};
const width = computed(() =>
  isVertical.value ? { min: 300, max: 375 } : { min: 688, max: 959 },
);
const statusConfig = computed<{ icon: string; variant: any }>(() => {
  switch (props.status) {
    // eslint-disable-next-line default-case-last
    default:
    case 'start':
      return {
        icon: 'mdi-clock',
        variant: 'blue',
      };
    case 'in_progress':
      return {
        icon: 'mdi-clock',
        variant: 'warning',
      };
    case 'done':
      return {
        icon: 'mdi-check',
        variant: 'success',
      };
  }
});
const isActiveTitleTooltip = computed(() => {
  if (isVertical.value) return props.title.length < 60;
  else return props.title.length < 84;
});
const emits = defineEmits([
  'open',
  'favorite',
  'configurations',
  'toggleVisibility',
]);
</script>

<style scoped lang="scss">
.card {
  min-height: 460px !important;
}

.trail-card {
  min-height: 200px !important;
}

.grid {
  display: grid;
  align-content: stretch;
  height: fit-content;
}

.vertical-grid {
  grid-template-rows: 250px 1fr;
  grid-template-columns: 1fr;
}

.horizontal-grid {
  grid-template-columns: minmax(220px, 300px) minmax(370px, 1fr) auto;
  grid-template-rows: 1fr;
}

.header {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.type,
.favorite,
.hidden-icon,
.options,
.hover {
  position: absolute;
}
.type {
  top: 16px;
  left: 16px;
}
.hidden-icon {
  bottom: 16px;
  right: 16px;
  z-index: 1;
}

.favorite {
  bottom: 16px;
  left: 16px;
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

.hover-shadow {
  box-shadow: 0px 4px 10px 0px rgba(247, 4, 4, 0.1);
}
</style>
