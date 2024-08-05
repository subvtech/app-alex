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
      'vertical-grid card': isVertical,
      'horizontal-grid pa-2 column-gap-4': !isVertical,
      'hover-shadow': isHovering,
      project: type === 'project',
    }"
    @click="() => emits('open')"
    @mouseover="isHovering = true"
    @mouseleave="isHovering = false"
  >
    <div class="header" :class="{ rounded: !isVertical }">
      <div
        v-if="institution"
        class="tw-absolute tw-bottom-4 tw-left-4 tw-p-1 tw-w-40 tw-z-10 tw-bg-[#001a3395] tw-rounded-md"
      >
        <v-img
          :src="
            institution.cover ||
            'https://www.larsaodomingos.com.br/static/media/logo.5f673bd4.png'
          "
          :alt="image.alt"
          :class="{ grayscale: hide }"
          cover
        />
      </div>
      <v-img
        :src="image.url || '/images/cover_image_course.svg'"
        :alt="image.alt"
        :class="{ grayscale: hide }"
        cover
        height="100%"
        aspect-ratio="2.5"
      />

      <alex-custom-chip
        v-if="type === 'course'"
        :text="$t(`components.learningPlan.card.type.${type}`)"
        size="small"
        status="primary"
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
            status="primary"
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
      class="d-flex flex-column gap-4 justify-space-between overflow-auto"
      data-testid="alex-learningplan-card-content-area"
      :class="{
        'grayscale-2': hide,
        'py-2': !isVertical,
        'pa-4': isVertical,
      }"
    >
      <alex-custom-chip
        v-if="product"
        :text="product"
        status="primary"
        variant="elevated"
        class="tw-w-fit"
      />
      <div class="d-flex flex-column tw-flex-grow pa-0 gap-2">
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
        class="tw-w-full tw-flex gap-6 tw-flex-wrap py-2 tw-justify-start"
        :class="{
          'justify-space-between': !!members?.length,
        }"
      >
        <alex-learningplan-card-info
          class="!tw-w-full !tw-max-w-[52%]"
          :avatar="{
            url: facilitator.imageURL,
            name: facilitator.name,
          }"
          :title="
            type === 'project'
              ? 'Líder'
              : $t('components.learningPlan.card.facilitator')
          "
          :subtitle="facilitator.name"
        />
        <alex-learningplan-card-info
          v-if="type === 'course'"
          class="!tw-w-full !tw-max-w-[40%]"
          icon="alex:trail"
          :title="$t('components.learningPlan.card.trails')"
          :subtitle="trailsCount"
        />

        <alex-custom-avatar-group
          v-if="members && type !== 'course'"
          class="tw-pl-2"
          :avatar-items="members"
          :size="36"
        />
      </div>
    </div>
    <div
      v-if="!isVertical && options"
      class="h-full position-absolute"
      style="right: 9px; top: 9px"
    >
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
  title: string;
  image: { url: string; alt?: string };
  description: string;
  trailsCount?: number;
  hide?: boolean;
  hideFavoritedButton?: boolean;
  members?: member[];
  facilitator: { name: string; imageURL?: string };
  favorited?: boolean;
  options?: boolean;
  product?: string;
  institution?: InstitutionsType;
}

const props = withDefaults(defineProps<LearningPlanCardProps>(), {
  hideFavoritedButton: false,
  favorited: false,
  hide: false,
  type: 'course',
  status: 'start',
  members: () => [],
  product: undefined,
  institution: undefined,
  options: true,
  trailsCount: 0,
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
  isVertical.value ? { min: 300, max: 375 } : { min: 300, max: 1280 },
);
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
.card.project {
  min-height: 340px !important;
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
.vertical-grid.project {
  grid-template-rows: 80px 1fr;
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
  z-index: 1;
}
.hidden-icon {
  bottom: 16px;
  right: 16px;
  z-index: 1;
}
.card.project .hidden-icon {
  z-index: 0;
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
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.1);
}
</style>
