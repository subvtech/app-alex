<template>
  <h2 class="text-h3 text-gray-800">Component Playground</h2>
  <p class="text-subtitle-2 text-gray-500">
    Aqui você pode testar algumas das propriedades do componente e ver como elas
    se comportam.
  </p>
  <v-row class="w-100 align-center wrap">
    <v-col cols="12" md="7" align="center">
      <slot
        name="component"
        :props="{ ...componentOptionalProps, ...componentRequiredProps }"
      />
    </v-col>
    <v-divider vertical/>
    <v-col class="pa-3 gap-4">
      <div class="d-flex flex-wrap gap-3">
        <div v-for="(item, index) in data" class="w-max-content">
          <alex-inputs-text-field
            v-if="item.type === 'string'"
          
            v-model="playgroundValues[index]"
            :name="item.name"
            hide-details
            :required="item.required"
            :placeholder="item.name"
            :label="item.name"
            clearable
          />
        </div>
      </div>

      <div class="d-flex flex-wrap gap-3">
        <div v-for="(item, index) in data">
          <alex-inputs-text-field
            v-if="item.type === 'number'"
            v-model="playgroundValues[index]"
            :name="item.name"
            type="number"
            hide-details
            :placeholder="item.name"
            :label="item.name"
            clearable
          />
        </div>
      </div>

      <div class="d-flex flex-wrap">
        <div v-for="(item, index) in data">
          <v-checkbox
            v-if="item.type === 'boolean'"
            v-model="playgroundOptions[index]"
            hide-details
            :label="item.name"
            color="primary"
          />
        </div>
      </div>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { PropItemType } from '@/components/alex/documentation/accordions/PropList.vue';

export interface PlaygroundItemType extends PropItemType {
    initialValue: any
}

export interface PlaygroundComponentType {
  title?: string;
  data: PlaygroundItemType[];
}
const props = withDefaults(defineProps<PlaygroundComponentType>(), {
  title: 'Component Props',
});

const playgroundOptions = ref<any[]>(
  props.data.filter((item) => !item.required && item.type !== 'string').map((item) => item.initialValue),
);
const playgroundValues = ref<string[]>(
  props.data.filter((item) => item.type === 'string').map((item) => item.initialValue),
);

const componentRequiredProps = computed(() => {
  const result: { [x: string]: any } = {};

  props.data.forEach((item, index) => {
    if (item.required || item.type === 'string') {
      result[item.name] = playgroundValues.value[index];
    }
  });
  return result;
});

const componentOptionalProps = computed(() => {
  const result: { [x: string]: any } = {};
  props.data.forEach((item, index) => {
    if (!(item.required && item.type === 'string')) {
      switch (item.type) {
        case 'boolean':
          result[item.name] = playgroundOptions.value[index];
          break;
        case 'string':
          break;
        case 'number':
          result[item.name] = 0;
          break;
        case 'array':
          result[item.name] = [];
          break;
        default:
          result[item.name] = {};
          break;
      }
    }
  });
  return result;
});
</script>
<style scope lang="scss">
.w-max-content{
    min-width: 200px;
}
</style>