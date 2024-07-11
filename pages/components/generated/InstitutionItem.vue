<template>
  <v-container
    class="page rounded-lg bg-white pa-6 gap-6 d-flex flex-column align-start pb-15"
  >
    <alex-documentation-header title="InstitutionItem" description="undefined"  />
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
        <alex-profile-institution-item :url="props.url" :name="props.name" :acronym="props.acronym" :sector="props.sector" :canEdit="props.canEdit" :isDeleted="props.isDeleted" :backgroundColor="props.backgroundColor" :id="props.id" 
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

const myProps = [{name : `url`,required : false,description : `There's no description.`,type : `string`,},{name : `name`,required : true,description : `There's no description.`,type : `string`,},{name : `acronym`,required : true,description : `There's no description.`,type : `string`,},{name : `sector`,required : true,description : `There's no description.`,type : `string`,},{name : `canEdit`,required : true,description : `There's no description.`,type : `boolean`,initialValue : 'false',default : `false`},{name : `isDeleted`,required : true,description : `There's no description.`,type : `boolean`,initialValue : 'false',default : `false`},{name : `backgroundColor`,required : false,description : `There's no description.`,type : `string`,initialValue : 'bg-white',default : `bg-white`},{name : `id`,required : true,description : `There's no description.`,type : `number`,},];
const myEmits = [{name : `delete:institution`,description : `triggers when the user clicks on the delete button`,type : `(value: number) => void`},];
const emitsCount = false;
const propsCount = true;

</script>
