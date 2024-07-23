<template>
  <v-container
    class="page rounded-lg bg-white pa-6 gap-6 d-flex flex-column align-start pb-15"
  >
    <alex-documentation-header title="Accordion" description="undefined" vuetify-link="https://dev.vuetifyjs.com/en/components/v-expansion-panels/#usage" />
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
        <alex-custom-accordion :data="props.data" :showPositions="props.showPositions" :icon="props.icon" :iconColor="props.iconColor" 
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

const myProps = [{name : `data`,required : false,description : `There's no description.`,type : `AccordionItemType[]`,initialValue : [],default : `[]`},{name : `showPositions`,required : false,description : `There's no description.`,type : `boolean`,initialValue : 'false',default : `false`},{name : `icon`,required : false,description : `There's no description.`,type : `string`,initialValue : 'mdi-trash-can-outline',default : `mdi-trash-can-outline`},{name : `iconColor`,required : false,description : `There's no description.`,type : `string`,initialValue : 'tag-red-light',default : `tag-red-light`},];
const myEmits = [];
const emitsCount = false;
const propsCount = true;

</script>
