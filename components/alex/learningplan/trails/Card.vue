<template>
  <v-card
    data-testid="alex-learningplan-trails-card"
    :min-width="width.min"
    :max-width="width.max"
    :class="{
      'vertical-grid': isVertical,
      'horizontal-grid column-gap-4': !isVertical,
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
        :src="image.url"
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
        <template v-slot:activator="{ props }">
          <alex-custom-chip
            v-if="hide"
            v-bind="props"
            class="hidden-icon"
            status="dark"
            icon="mdi-eye-off-outline"
            variant="elevated"
          >
          </alex-custom-chip>
        </template>
      </v-tooltip>

      <div :class="{ hover: isHovering }">
        <v-menu
          v-model="options"
          :close-on-content-click="false"
          :class="{ hidden: !isHovering && !options }"
        >
          <template #activator="{ props: propsMenu, isActive }">
            <v-tooltip
              :text="$t('components.learningPlan.cardTrails.options')"
              location="bottom center"
            >
              <template #activator="{ props }">
                <alex-custom-button
                  v-if="direction !== 'HORIZONTAL' && (isHovering || isActive)"
                  v-bind="{ ...propsMenu, ...props }"
                  class="options"
                  size="small"
                  variant="secondary"
                  icon="mdi-dots-vertical"
                />
              </template>
            </v-tooltip>
          </template>
          <v-list>
            <v-list-item
              v-if="hide"
              :title="$t('components.learningPlan.cardTrails.visibility.show')"
              prepend-icon="mdi-eye-outline"
              @click="() => emits('show')"
            />
            <v-list-item
              v-else
              :title="$t('components.learningPlan.cardTrails.visibility.hide')"
              prepend-icon="mdi-eye-off-outline"
              @click="() => emits('hide')"
            />
            <v-list-item
              :title="$t('components.learningPlan.cardTrails.copy')"
              prepend-icon="mdi-content-copy"
              @click="() => emits('copy')"
            />
            <v-list-item
              :title="$t('components.learningPlan.cardTrails.configurations')"
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
        'py-2': !isVertical,
        'pa-4 pb-6': isVertical,
      }"
    >
      <div class="d-flex gap-2 align-center">
        <v-tooltip
          :text="name"
          :location="isVertical ? 'top center' : 'top left'"
          max-width="360"
          :disabled="isActiveTitleTooltip"
        >
          <template v-slot:activator="{ props }">
            <h5
              v-bind="props"
              class="text-body-2 text-gray-900 ellipsis lines-2 max-height-48"
              :class="{ 'grayscale-2': hide }"
            >
              {{ name }}
            </h5>
          </template>
        </v-tooltip>

        <div v-if="!isVertical">
          <v-menu :close-on-content-click="false">
            <template #activator="{ props }">
              <alex-custom-button
                v-bind="props"
                icon="mdi-dots-vertical"
                size="small"
                variant="text"
              />
            </template>
            <v-list>
              <v-list-item
                v-if="hide"
                :title="
                  $t('components.learningPlan.cardTrails.visibility.show')
                "
                prepend-icon="mdi-eye-outline"
                @click="() => emits('show')"
              />
              <v-list-item
                v-else
                :title="
                  $t('components.learningPlan.cardTrails.visibility.hide')
                "
                prepend-icon="mdi-eye-off-outline"
                @click="() => emits('hide')"
              />
              <v-list-item
                :title="$t('components.learningPlan.cardTrails.copy')"
                prepend-icon="mdi-content-copy"
                @click="() => emits('copy')"
              />
              <v-list-item
                :title="$t('components.learningPlan.cardTrails.configurations')"
                prepend-icon="mdi-cog-outline"
                @click="() => emits('configurations')"
              />
            </v-list>
          </v-menu>
        </div>
      </div>

      <div
        class="text-body-5 text-gray-600 ellipsis lines-3"
        lines="three"
        :class="{ 'grayscale-2': hide }"
      >
        {{ description }}
      </div>
      <v-tooltip
        :text="organizeDocuments as unknown as string"
        :disabled="!hasDocuments"
        location="bottom center"
      >
        <template #activator="{ props }">
          <div class="documents" v-bind="props">
            <v-icon size="20" color="gray-600"
              >mdi-text-box-multiple-outline</v-icon
            >
            <span>{{ documents?.length || 0 }}</span>
          </div>
        </template>
      </v-tooltip>
    </div>
  </v-card>
</template>

<script setup lang="ts">
interface LearningPlanCard {
  image: { url: string; alt?: string };
  name: string;
  description: string;
  hide?: boolean;
  direction?: 'HORIZONTAL' | 'VERTICAL';
  documents?: [{ type: string; number: number }];
}
const { t } = useI18n();
const props = withDefaults(defineProps<LearningPlanCard>(), {
  direction: 'VERTICAL',
  hide: false,
  documents: undefined,
});
const isHovering = ref(false);
const options = ref(false);
const isVertical = computed(() => props.direction === 'VERTICAL');
const width = computed(() =>
  props.direction === 'VERTICAL'
    ? { min: 240, max: 260 }
    : { min: 300, max: 350 },
);
const isActiveTitleTooltip = computed(() => {
  if (isVertical.value) return props.name.length < 30;
  else return props.name.length < 60;
});

const organizeDocuments = computed(() => {
  let string = '';
  props.documents?.map(
    (item) =>
      (string += `${item.number} ${t(
        `components.learningPlan.cardTrails.${item.type}`,
      )};`),
  );
  return string;
});

const hasDocuments = computed(() => {
  if (props.documents) {
    return !!props.documents.length;
  }
  return false;
});
const emits = defineEmits(['open', 'configurations', 'show', 'hide', 'copy']);
</script>

<style scoped lang="scss">
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
  top: 16px;
  left: 16px;
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

.hover-shadow {
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.1);
}
</style>
