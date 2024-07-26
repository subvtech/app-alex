<template>
  <div class="d-flex justify-center align-center">
    <ToggleGroup v-model="imagePosition" type="single" size="sm">
      <v-tooltip
        v-for="option in options"
        :key="option.value"
        :text="getTooltip(option.value)"
        content-class="bg-white tw-text-white tw-rounded-md tw-p-2 tw-shadow-md"
        location="top center"
        transition="fade-transition"
      >
        <template #activator="{ props: tooltip }">
          <ToggleGroupItem
            :value="option.value"
            :aria-label="option.value"
            v-bind="tooltip"
          >
            <component :is="option.icon" class="tw-h-4 tw-w-4" />
          </ToggleGroupItem>
        </template>
      </v-tooltip>
    </ToggleGroup>
    <v-divider class="divider mx-2" vertical></v-divider>
    <Slider v-model="imageSize" :max="100" :min="25" :step="25" color="green" />
    <span class="mx-2">{{ imageSize[0] }}%</span>
  </div>
</template>

<script setup lang="ts">
import {
  AlignHorizontalDistributeCenter,
  AlignHorizontalDistributeEnd,
  AlignHorizontalDistributeStart,
} from 'lucide-vue-next';

const { t } = useI18n();

interface propsValue {
  image: {
    size: number;
    position: string;
  };
}

const emit = defineEmits(['update:imageSize', 'update:imagePosition']);

const props = defineProps<propsValue>();

const options = ref([
  { value: 'start', icon: AlignHorizontalDistributeStart },
  { value: 'center', icon: AlignHorizontalDistributeCenter },
  { value: 'end', icon: AlignHorizontalDistributeEnd },
]);

const getTooltip = (value: string) => {
  return t(`components.tiptap.mediaUpload.tooltip.${value}`);
};

const imageSize = ref([props.image.size]);
const imagePosition = ref(props.image.position);

watch(
  () => props.image,
  (value) => {
    imageSize.value = [value.size];
    imagePosition.value = value.position;
  },
);

watch(imageSize, (value) => {
  emit('update:imageSize', value[0]);
});

watch(imagePosition, (value) => {
  emit('update:imagePosition', value);
});
</script>

<style scoped>
.divider {
  border-color: rgb(var(--v-theme-gray-800));
}
</style>
