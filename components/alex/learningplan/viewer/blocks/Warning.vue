<template>
  <v-alert
    border="bottom"
    colored-border
    type="warning"
    elevation="2"
  >
    <div class="text-h5">
      {{ warningBlock.title }}
    </div>
    {{ warningBlock.message }}
  </v-alert>
</template>

<script>

export default {
  props: {
    warningBlock: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
    };
  },
};
</script>

