<template>
  <v-alert
      :type="alertType"
      border="left"
    >
      <div v-html="alertBlock.message"></div>
    </v-alert>
</template>

<script>

export default {
  props: {
    alertBlock: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
    };
  },
  computed: {
    alertType() {
      if (['warning', 'success', 'info'].includes(this.alertBlock.type)) {
        return this.alertBlock.type;
      } else if (this.alertBlock.type === 'danger') {
        return 'error';
      } else {
        return 'info';
      }
    },

  },
};
</script>

