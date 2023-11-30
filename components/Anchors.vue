<template>
  <v-list class="bg-transparent anchor-list">
    <v-list-item>
      <a href="#start" class="text-decoration-none text-body-1 text-gray-600">
        <nuxt-link></nuxt-link>
        Voltar para o topo
      </a>
    </v-list-item>
    <v-list-item v-for="anchor in anchors" :key="anchor">
      <a
        :href="anchor.link"
        class="text-decoration-none text-body-1 text-gray-600"
        >{{ anchor.name }}</a
      >
    </v-list-item>
  </v-list>
</template>

<script setup>
const props = defineProps({
  anchors: {
    type: Array,
    default: () => [],
  },
});

const anchors = props.anchors;
</script>

<style scoped>
.anchor-list {
  position: sticky;
  top: 100px;
  height: fit-content;
  padding: 0;
  margin: 0;
  width: 100%;
  max-width: 300px;
  border-radius: 10px;
}
</style>
