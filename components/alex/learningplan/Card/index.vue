<template>
  <v-card
    class="grid bg-white"
    variant="outlined"
    color="gray-100"
    rounded="lg"
    data-testid="alex-learningplan-card"
    :min-width="width.min"
    :max-width="width.max"
    :class="{
      'vertical-grid': isVertical,
      'horizontal-grid pa-2 column-gap-4': !isVertical,
      'hover-shadow': isHovering,
    }"
    @click="() => emits('open')"
    @mouseover="isHovering = true"
    @mouseleave="isHovering = false"
  >
    <div :class="{ rounded: !isVertical }" class="header">
      <v-img
        :src="image.url"
        :alt="image.alt"
        :class="{ grayscale: hide }"
        cover
        height="100%"
        aspect-ratio="2.5"
      />

      <alex-custom-chip
        :text="$t(`components.learningPlan.card.type.${type}`)"
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
        class="alex-learningplan-card-hover-area"
        :class="{ hover: isHovering }"
      >
        <v-menu v-if="!hideFavoritedButton">
          <template #activator="{ props: propsMenu }">
            <v-tooltip
              :text="$t('components.learningPlan.card.favorite')"
              location="bottom center"
            >
              <template #activator="{ props: favoritedTooltipProps }">
                <alex-custom-button
                  v-if="isHovering"
                  v-bind="{ ...propsMenu, ...favoritedTooltipProps }"
                  icon="mdi-cards-heart"
                  class="favorite"
                  variant="secondary"
                  :class="{ 'text-error-0': favorited }"
                  @click="() => emits('favorite')"
                />
              </template>
            </v-tooltip>
          </template>
        </v-menu>
        <v-menu
          v-model="options"
          :close-on-content-click="false"
          :class="{ hidden: !isHovering && !options }"
        >
          <template #activator="{ props: propsMenu, isActive }">
            <v-tooltip
              :text="$t('components.learningPlan.card.options')"
              location="bottom center"
            >
              <template #activator="{ props: optionsTooltipProps }">
                <alex-custom-button
                  v-if="direction !== 'HORIZONTAL' && (isHovering || isActive)"
                  variant="secondary"
                  v-bind="{ ...propsMenu, ...optionsTooltipProps }"
                  icon="mdi-dots-vertical"
                  class="options"
                />
              </template>
            </v-tooltip>
          </template>
          <v-list>
            <v-list-item
              v-if="hide"
              :title="$t('components.learningPlan.card.visibility.show')"
              prepend-icon="mdi-eye-outline"
              @click="() => emits('show')"
            />
            <v-list-item
              v-else
              :title="$t('components.learningPlan.card.visibility.hide')"
              prepend-icon="mdi-eye-off-outline"
              @click="() => emits('hide')"
            />
            <v-list-item
              :title="$t('components.learningPlan.card.configurations')"
              prepend-icon="mdi-cog-outline"
              @click="() => emits('configurations')"
            />
          </v-list>
        </v-menu>
      </div>
    </div>
    <div
      class="alex-learningplan-card-content-area d-flex flex-column gap-4"
      :class="{
        'grayscale-2': hide,
        'py-2': !isVertical,
        'pa-4': isVertical,
      }"
    >
      <alex-custom-chip
        v-if="type !== 'course'"
        :text="$t(`components.learningPlan.card.status.${status}`)"
        size="small"
        :status="statusConfig.variant"
        variant="flat"
        :prepend-icon="statusConfig.icon"
      />
      <div class="d-flex flex-column pa-0 gap-2">
        <v-tooltip
          :text="name"
          :location="isVertical ? 'top center' : 'top left'"
          max-width="360"
          :disabled="isActiveTitleTooltip"
        >
          <template #activator="{ props: nameTooltipProps }">
            <h5
              v-bind="nameTooltipProps"
              class="text-h5 text-gray-900 ellipsis lines-2"
            >
              {{ name }}
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
        :class="{ 'justify-space-between': participants?.length }"
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
          v-else-if="participants && type === 'course_project'"
          :avatar-items="participants"
          :size="36"
        />
      </div>
    </div>

    <div v-if="!isVertical" class="h-full">
      <v-menu :close-on-content-click="false">
        <template #activator="{ props: optionsProps }">
          <alex-custom-button
            v-bind="optionsProps"
            variant="text"
            icon="mdi-dots-vertical"
          />
        </template>
        <v-list>
          <v-list-item
            v-if="hide"
            :title="$t('components.learningPlan.card.visibility.show')"
            prepend-icon="mdi-eye-outline"
            @click="() => emits('show')"
          />
          <v-list-item
            v-else
            :title="$t('components.learningPlan.card.visibility.hide')"
            prepend-icon="mdi-eye-off-outline"
            @click="() => emits('hide')"
          />
          <v-list-item
            :title="$t('components.learningPlan.card.configurations')"
            prepend-icon="mdi-cog-outline"
            @click="() => emits('configurations')"
          />
        </v-list>
      </v-menu>
    </div>
  </v-card>
</template>

<script setup lang="ts">
interface participant {
  name: string;
  image?: {
    url: string;
    alt?: string;
  };
}

interface LearningPlanCardProps {
  type?: 'project' | 'course' | 'course_project';
  image: { url: string; alt?: string };
  name: string;
  description: string;
  facilitator: { name: string; imageURL?: string };
  trailsCount: number;
  hide?: boolean;
  hideFavoritedButton?: boolean;
  favorited?: boolean;
  direction?: 'HORIZONTAL' | 'VERTICAL';
  status?: 'start' | 'in_progress' | 'done';
  participants?: participant[];
}

const props = withDefaults(defineProps<LearningPlanCardProps>(), {
  hideFavoritedButton: false,
  favorited: false,
  direction: 'VERTICAL',
  hide: false,
  type: 'course',
  status: 'start',
  participants: undefined,
});

const isHovering = ref(false);
const options = ref(false);
const isVertical = computed(() => props.direction === 'VERTICAL');
const width = computed(() =>
  props.direction === 'VERTICAL'
    ? { min: 300, max: 400 }
    : { min: 688, max: 959 },
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
  if (isVertical.value) return props.name.length < 60;
  else return props.name.length < 84;
});
const emits = defineEmits([
  'open',
  'favorite',
  'configurations',
  'show',
  'hide',
]);
</script>

<style scoped lang="scss">
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

.hover-shadow {
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.1);
}
</style>
