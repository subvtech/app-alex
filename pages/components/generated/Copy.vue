<template>
  <v-container
    class="page rounded-lg bg-white pa-6 gap-6 d-flex flex-column align-start pb-15"
  >
    <alex-documentation-header title="Copy" description="undefined"  />
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
        <alex-documentation-buttons-copy :text="props.text" :tooltipText="props.tooltipText" :copyIcon="props.copyIcon" :copiedIcon="props.copiedIcon" 
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

const myProps = [{name : `text`,required : true,description : `There's no description.`,type : `string`,},{name : `tooltipText`,required : false,description : `There's no description.`,type : `string`,},{name : `copyIcon`,required : false,description : `There's no description.`,type : `string`,initialValue : 'mdi-content-copy',default : `mdi-content-copy`},{name : `copiedIcon`,required : false,description : `There's no description.`,type : `string`,initialValue : 'mdi-clipboard-check-multiple-outline',default : `mdi-clipboard-check-multiple-outline`},];
const myEmits = [];
const emitsCount = false;
const propsCount = true;

</script>
