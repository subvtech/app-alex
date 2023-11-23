<template>
  <v-hover v-slot="{ isHovering, props }">
    <v-card
      v-bind="props"
      :min-width="width.min"
      :max-width="width.max"
      :class="{
        'vertical-grid': isVertical,
        'horizontal-grid pa-2 column-gap-4': !isVertical,
        'hover-shadow': isHovering,
      }"
      variant="outlined"
      color="gray-100"
      rounded="lg"
      class="grid bg-white"
      @click="() => emits('open')"
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
          <template v-slot:activator="{ props }">
            <alex-custom-chip
              v-if="hide"
              v-bind="props"
              class="hidden-icon"
              size="large"
              status="dark"
              icon="mdi-eye-off-outline"
              variant="elevated"
            >
            </alex-custom-chip>
          </template>
        </v-tooltip>

        <div :class="{ hover: isHovering }">
          <v-menu v-if="!hideFavorited">
            <template #activator="{ props: propsMenu }">
              <v-tooltip
                :text="$t('components.learningPlan.card.favorite')"
                location="bottom center"
              >
                <template #activator="{ props }">
                  <v-btn-secondary
                    v-if="isHovering"
                    v-bind="{ ...propsMenu, ...props }"
                    icon="mdi-cards-heart"
                    class="favorite"
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
                <template #activator="{ props }">
                  <v-btn-secondary
                    v-if="
                      direction !== 'HORIZONTAL' && (isHovering || isActive)
                    "
                    v-bind="{ ...propsMenu, ...props }"
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
        class="d-flex flex-column gap-4"
        :class="{
          'grayscale-2': hide,
          'py-2': !isVertical,
          'pa-4': isVertical,
        }"
      >
        <div class="d-flex flex-column pa-0 gap-2">
          <v-tooltip
            :text="name"
            :location="isVertical ? 'top center' : 'top left'"
            max-width="360"
            :disabled="isActiveTitleTooltip"
          >
            <template v-slot:activator="{ props }">
              <h5 v-bind="props" class="text-h5 text-gray-900 ellipsis lines-2">
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

        <div class="d-flex gap-6 flex-wrap py-2">
          <alex-learningplan-card-info
            :image="{
              name: facilitator.name,
              url: facilitator?.imageURL,
            }"
            :title="$t('components.learningPlan.card.facilitator')"
            :subtitle="facilitator.name"
          />
          <alex-learningplan-card-info
            icon="mdi-trails"
            :title="$t('components.learningPlan.card.trails')"
            :subtitle="trailsNumber"
          />
        </div>
      </div>

      <div v-if="!isVertical" class="h-full">
        <v-menu :close-on-content-click="false">
          <template #activator="{ props }">
            <v-btn-tertiary v-bind="props" icon="mdi-dots-vertical" />
          </template>
          <v-list>
            <v-list-item
              v-if="hide"
              :title="$t('components.learningPlan.card.visibility.show')"
              prepend-icon="mdi-eye-outline"
              @click="() => console.log('mostrar')"
            />
            <v-list-item
              v-else
              :title="$t('components.learningPlan.card.visibility.hide')"
              prepend-icon="mdi-eye-off-outline"
              @click="() => console.log('Ocultar')"
            />
            <v-list-item
              :title="$t('components.learningPlan.card.configurations')"
              prepend-icon="mdi-cog-outline"
              @click="() => console.log('Configurações')"
            />
          </v-list>
        </v-menu>
      </div>
    </v-card>
  </v-hover>
</template>

<script setup lang="ts">
interface LearningPlanCard {
  image: { url: string; alt?: string };
  name: string;
  description: string;
  facilitator: { name: string; imageURL?: string };
  trailsNumber: number;
  type?: 'project' | 'course' | (string & {});
  hide?: boolean;
  hideFavorited?: boolean;
  favorited?: boolean;
  direction?: 'HORIZONTAL' | 'VERTICAL';
}
const props = withDefaults(defineProps<LearningPlanCard>(), {
  hideFavorited: false,
  favorited: false,
  direction: 'VERTICAL',
  hide: false,
  type: 'project',
});
const options = ref(false);
const isVertical = computed(() => props.direction === 'VERTICAL');
const width = computed(() =>
  props.direction === 'VERTICAL'
    ? { min: 300, max: 400 }
    : { min: 688, max: 959 },
);
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
  grid-template-columns: minmax(200px, 300px) minmax(400px, 1fr) auto;
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
