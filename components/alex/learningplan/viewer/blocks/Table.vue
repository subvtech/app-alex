<template>
  <v-data-table
    :headers="headers"
    :items="items"
  />
</template>

<script>

export default {
  props: {
    tableBlock: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
    };
  },
  computed: {
    headers() {
      if (!this.tableBlock.content.length) {
        return [];
      }
      const header = this.tableBlock.content[0];

      return header.map((column, idx) => {
        return {
          text: column,
          value: column.toLowerCase().trim().split(' ').join('_') + idx
        };
      });
    },
    items() {
      if (!this.tableBlock.content.length || this.tableBlock.content.length < 2) {
        return [];
      }

      const header = this.tableBlock.content[0].map(
        (column, idx) => column.toLowerCase().trim().split(' ').join('_') + idx
      );

      const rows = this.tableBlock.content.slice(1);

      return rows.map((row, rowIdx) => {
        return row.reduce(
          (rowData, rowValue, index) => {
            rowData[header[index]] = rowValue;

            return rowData;
          },
          { key: rowIdx }
        );
      });
    },
  },
};
</script>

