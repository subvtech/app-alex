<template>
  <v-container
    class="page rounded-lg bg-white pa-6 gap-6 d-flex flex-column align-start pb-15"
  >
    <alex-documentation-header title="Playground" description="This component is meant to test other components;
This is a multiliner comment." vuetify-link="https://dev.vuetifyjs.com/en/components/v-checkbox/#usage" />
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
        <alex-documentation-playground :title="props.title" :data="props.data" 
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

const myProps = [{name : `title`,required : false,description : `playground title`,type : `string `,initialValue : 'Component Playground',default : `Component Playground`},{name : `data`,required : false,description : `component props`,type : `PlaygroundItemType[] `,initialValue : [],default : `[]`},];
const myEmits = [];
const emitsCount = false;
const propsCount = false;

</script>
