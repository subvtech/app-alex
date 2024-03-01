<template>
  <v-container
    class="page rounded-lg bg-white pa-6 gap-6 d-flex flex-column align-start pb-15"
  >
    <alex-documentation-header title="Competences" description="undefined"  />
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
        <alex-profile-cards-competences :selectedTags="props.selectedTags" :title="props.title" :emptyMessage="props.emptyMessage" :placeholder="props.placeholder" :relationId="props.relationId" :isGeneral="props.isGeneral" :canEdit="props.canEdit" 
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

const myProps = [{name : `selectedTags`,required : true,description : `There's no description.`,type : `Tag[]`,},{name : `title`,required : true,description : `There's no description.`,type : `string`,},{name : `emptyMessage`,required : true,description : `There's no description.`,type : `string`,},{name : `placeholder`,required : true,description : `There's no description.`,type : `string`,},{name : `relationId`,required : true,description : `There's no description.`,type : `number`,},{name : `isGeneral`,required : false,description : `There's no description.`,type : `boolean`,initialValue : 'false',default : `false`},{name : `canEdit`,required : false,description : `There's no description.`,type : `boolean`,initialValue : 'false',default : `false`},];
const myEmits = [{name : `update`,description : `There's no description`,type : `() => void`},];
const emitsCount = false;
const propsCount = true;

</script>
