<template>
  <v-container
    class="page rounded-lg bg-white pa-6 gap-6 d-flex flex-column align-start pb-15"
  >
    <alex-documentation-header title="PropsList" description="undefined" vuetify-link="https://dev.vuetifyjs.com/en/components/v-data-table/#usage" />
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
        <alex-documentation-accordions-props-list :title="props.title" :data="props.data" :showPositions="props.showPositions" :listEmits="props.listEmits" 
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

const myProps = [{name : `title`,required : true,description : `There's no description.`,type : `string`,initialValue : 'Component Props',default : `Component Props`},{name : `data`,required : true,description : `There's no description.`,type : `PropItemType[]`,},{name : `showPositions`,required : false,description : `There's no description.`,type : `boolean`,initialValue : 'false',default : `false`},{name : `listEmits`,required : false,description : `There's no description.`,type : `boolean`,initialValue : 'false',default : `false`},];
const myEmits = [];
const emitsCount = false;
const propsCount = true;

</script>
