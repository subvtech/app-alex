<template>
  <v-container
    class="page rounded-lg bg-white pa-6 gap-6 d-flex flex-column align-start pb-15"
  >
    <alex-documentation-header title="AppAbout" description="undefined"  />
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
        <app-about :title="props.title" :text="props.text" :userId="props.userId" :canEdit="props.canEdit" :loading="props.loading" :emptyTextMessage="props.emptyTextMessage" :textPlaceholder="props.textPlaceholder" :emptyTextImage="props.emptyTextImage" :images="props.images" :showMedia="props.showMedia" :isOptional="props.isOptional" 
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

const myProps = [{name : `title`,required : false,description : `There's no description.`,type : `string`,},{name : `text`,required : true,description : `There's no description.`,type : `string`,},{name : `userId`,required : true,description : `There's no description.`,type : `number`,},{name : `canEdit`,required : false,description : `There's no description.`,type : `boolean`,initialValue : 'false',default : `false`},{name : `loading`,required : false,description : `There's no description.`,type : `boolean`,initialValue : 'false',default : `false`},{name : `emptyTextMessage`,required : false,description : `There's no description.`,type : `string`,},{name : `textPlaceholder`,required : false,description : `There's no description.`,type : `string`,},{name : `emptyTextImage`,required : false,description : `There's no description.`,type : `string`,},{name : `images`,required : false,description : `There's no description.`,type : `any[]`,initialValue : [],default : `[]`},{name : `showMedia`,required : false,description : `There's no description.`,type : `boolean`,},{name : `isOptional`,required : false,description : `There's no description.`,type : `boolean`,},];
const myEmits = [];
const emitsCount = false;
const propsCount = true;

</script>
