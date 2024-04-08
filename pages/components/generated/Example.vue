<template>
  <v-container
    class="page rounded-lg bg-white pa-6 gap-6 d-flex flex-column align-start pb-15"
  >
    <alex-documentation-header title="Example" description="undefined"  />
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
        <alex-documentation-example :snippets="props.snippets" :title="props.title" :description="props.description" :hasExample="props.hasExample" 
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

const myProps = [{name : `snippets`,required : true,description : `There's no description.`,type : `ExampleItemType[]`,},{name : `title`,required : false,description : `There's no description.`,type : `string`,},{name : `description`,required : false,description : `There's no description.`,type : `string`,},{name : `hasExample`,required : true,description : `There's no description.`,type : `boolean`,initialValue : 'false',default : `false`},];
const myEmits = [];
const emitsCount = false;
const propsCount = true;

</script>
