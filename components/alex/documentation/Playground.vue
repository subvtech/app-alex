<template>
  <h2 class="text-h3 text-gray-800">Component Playground</h2>
  <p class="text-subtitle-2 text-gray-500">
    Aqui você pode testar algumas das propriedades do componente e ver como elas
    se comportam.
  </p>
  <v-row class="w-100 d-flex align-center wrap playground-direction">
    <v-col class="" justify="center" align="center" cols="12" md="7">
      <slot name="component" :props="{ ...componentProps }" />
    </v-col>

    <v-divider class="my-6 w-100 divider-1" />
    <v-divider class="mx-6 divider-2" vertical />
    <v-col class="pa-3 d-flex flex-column gap-6">
      <div class="d-flex flex-wrap gap-3">
        <div v-for="(item, index) in data">
          <alex-inputs-text-field
            v-if="item.type === 'string'"
            class="w-min-50"
            v-model="playgroundValues[index]"
            :name="item.name"
            hide-details
            :required="item.required"
            :placeholder="item.name"
            :label="item.name"
            clearable
          />
        </div>
        <div v-for="(item, index) in data">
          <alex-inputs-text-field
            v-if="item.type === 'number'"
            class="w-max-40"
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

      <div class="d-flex flex-wrap gap-3">
        <div v-for="(item, index) in data">
          <v-checkbox
            v-if="item.type === 'boolean'"
            v-model="playgroundValues[index]"
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
import { PropItemType } from '@/components/alex/documentation/accordions/PropsList.vue';

export interface PlaygroundItemType extends PropItemType {
  initialValue: any;
}

export interface PlaygroundComponentType {
  title?: string;
  data: PlaygroundItemType[];
}
const props = withDefaults(defineProps<PlaygroundComponentType>(), {
  title: 'Component Props',
});

const { data } = toRefs(props);

const playgroundValues = ref<any[]>(
  props.data.map((item) => item.initialValue),
);

const componentProps = computed(() => {
  const result: { [x: string]: any } = {};

  data.value.forEach((item, index) => {
    result[item.name] = playgroundValues.value[index];
  });
  return result;
});
</script>
<style scope lang="scss">
.playground-direction {
  flex-direction: column;
}

.w-min-50 {
  min-width: 200px;
}
.w-max-40 {
  max-width: 160px;
}

.divider-1 {
  display: flex;
}

.divider-2 {
  display: none;
}
@media (min-width: 1000px) {
  .playground-direction {
    flex-direction: row !important;
  }

  .divider-1 {
    display: none;
  }

  .divider-2 {
    display: flex;
  }
}
</style>
