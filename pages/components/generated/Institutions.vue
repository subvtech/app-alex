<template>
  <v-container
    class="page rounded-lg bg-white pa-6 gap-6 d-flex flex-column align-start pb-15"
  >
    <alex-documentation-header title="Institutions" description="undefined"  />
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
        <alex-profile-cards-institutions :institutions="props.institutions" :userId="props.userId" :canEdit="props.canEdit" 
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

const myProps = [{name : `institutions`,required : true,description : `There's no description.`,type : `InstitutionComponentType[]`,},{name : `userId`,required : true,description : `There's no description.`,type : `number`,},{name : `canEdit`,required : true,description : `There's no description.`,type : `boolean`,initialValue : 'false',default : `false`},];
const myEmits = [{name : `update`,description : `There's no description`,type : `() => void`},];
const emitsCount = false;
const propsCount = false;

</script>
