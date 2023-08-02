<template>
  <v-text-field
    v-model="inputValue"
    :rules="rules"
    :label="label"
    :color="color"
    :outlined="outlined"
    :required="required"
    @input="$emit('input', inputValue)"
  >
  </v-text-field>
</template>

<script>
export default {
  name: "AlexTextFieldPrimaryBackground",
  props: {
    value: {
      type: String,
    },
    rules: {
      type: Array,
      default:() => []
    },
    label: {
      type: String,
      required: true,
    },
    color: {
      type: String,
    },
    outlined: {
      type: Boolean,
      default: false,
    },
    required: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      inputValue: null,
    };
  },
  watch: {
    value(v) {
      this.inputValue = v;
    }
  },
};
</script>

<style scoped lang="scss">

::v-deep .theme--light.v-label,
::v-deep .theme--light.v-input input,
::v-deep .theme--light.v-input textarea,
::v-deep .theme--light.v-icon {
  color: rgba(255, 255, 255, 1);
}

::v-deep .v-input .v-label {
  left: 0 !important;
  top: -25px !important;
}

::v-deep .v-text-field .v-label--active {
  transform: none !important;
}

::v-deep .v-text-field--outlined fieldset {
  border-collapse: collapse;
  border-color: white;
  border-style: solid;
  border-width: 2px;
}

</style>
