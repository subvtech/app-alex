<template>
  <v-data-table :headers="headers" :items="items" />
</template>

<script setup lang="ts">
const props = defineProps({
  tableBlock: {
    type: Object,
    required: true,
  },
});

const { tableBlock } = toRefs(props);

const headers = computed(() => {
  if (!tableBlock.value.content.length) {
    return [];
  }
  const header = tableBlock.value.content[0];

  return header.map((column, idx) => {
    return {
      text: column,
      value: column.toLowerCase().trim().split(' ').join('_') + idx,
    };
  });
});

const items = computed(() => {
  if (!tableBlock.value.content.length || tableBlock.value.content.length < 2) {
    return [];
  }

  const header = tableBlock.value.content[0].map(
    (column, idx) => column.toLowerCase().trim().split(' ').join('_') + idx,
  );

  const rows = tableBlock.value.content.slice(1);

  return rows.map((row, rowIdx) => {
    return row.reduce(
      (rowData, rowValue, index) => {
        rowData[header[index]] = rowValue;

        return rowData;
      },
      { key: rowIdx },
    );
  });
});
</script>
