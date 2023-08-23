<template>
  <span>
    <ol v-if="Array.isArray(items) && type === 'ordered' && !!items[0].content">
      <li v-for="(item, index) in items" :key="index" class="ordered-item">
        <span v-html="item.content" />
        <NestedList
          v-if="!!item.items && item.items.length > 0"
          :items="item.items"
          type="ordered"
        />
      </li>
    </ol>
    <ul
      v-else-if="
        Array.isArray(items) && type === 'unordered' && !!items[0].content
      "
    >
      <li v-for="(item, index) in items" :key="index">
        <span v-html="item.content" />
        <NestedList
          v-if="!!item.items && item.items.length > 0"
          :items="item.items"
          type="unordered"
        />
      </li>
    </ul>
    <ol v-else-if="Array.isArray(items) && type === 'ordered'">
      <li v-for="(item, index) in items" :key="index" v-html="item" />
    </ol>
    <ul v-else-if="Array.isArray(items) && type === 'unordered'">
      <li v-for="(item, index) in items" :key="index" v-html="item" />
    </ul>
    <span v-else>
      <li v-if="items && !!items.content">{{ items.content }}</li>
      <li v-else v-html="items" />
    </span>
  </span>
</template>

<script setup lang="ts">
const props = defineProps({
  type: {
    type: String,
    default: 'ordered',
  },
  items: {
    type: Array as unknown as PropType<{content: string}>,
  },
});
const { type, items } = toRefs(props);
</script>
<style scoped>
ol {
  counter-reset: section;
  list-style-type: none;
}

li.ordered-item::before {
  counter-increment: section;
  content: counters(section, '.') ' ';
}
</style>
