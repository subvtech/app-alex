<template>
  <v-container
    class="page rounded-lg bg-white pa-6 gap-6 d-flex flex-column align-start pb-15"
  >
    <alex-documentation-header title="Tooltip" description="undefined" vuetify-link="https://dev.vuetifyjs.com/en/components/v-tooltip/#usage" />
    <alex-documentation-accordions-props-list
      :data="myProps"
      :show-positions="propsCount"
    />
    <alex-documentation-accordions-props-list
      v-if="myEmits.length > 0"
      :data="myEmits"
      :show-positions="emitsCount"
      list-emits
    />
   
    <alex-documentation-playground :data="myProps">
      <template #component="{ props }">
        <alex-documentation-buttons-tooltip :tooltipLocation="props.tooltipLocation" :tooltipText="props.tooltipText" :variant="props.variant" :icon="props.icon" :color="props.color" :iconSize="props.iconSize" :rounded="props.rounded" :disabled="props.disabled" 
        />
      </template>
    </alex-documentation-playground>
  </v-container>
</template>
<script setup lang="ts">

definePageMeta({
  layout: 'components',
  middleware: 'auth',
});

const myProps = [{name : `tooltipLocation`,required : false,description : `There's no description.`,type : `'start' | 'bottom' | 'end' | 'top'`,initialValue : 'top',default : `top`},{name : `tooltipText`,required : false,description : `There's no description.`,type : `string`,},{name : `variant`,required : true,description : `There's no description.`,type : `'primary' | 'secondary' | 'tertiary' | 'text' | 'error' | 'success' | 'warning' | 'info'`,initialValue : 'success',default : `success`},{name : `icon`,required : false,description : `There's no description.`,type : `string`,initialValue : 'mdi-content-copy',default : `mdi-content-copy`},{name : `color`,required : false,description : `There's no description.`,type : `AlexColors`,},{name : `iconSize`,required : false,description : `There's no description.`,type : `'default' | 'small' | 'large'`,initialValue : 'large',default : `large`},{name : `rounded`,required : false,description : `There's no description.`,type : `boolean`,initialValue : 'false',default : `false`},{name : `disabled`,required : false,description : `There's no description.`,type : `boolean`,initialValue : 'false',default : `false`},];
const myEmits = [{name : `click:button`,description : `There's no description`,type : `() => void`},];
const emitsCount = false;
const propsCount = true;

</script>
