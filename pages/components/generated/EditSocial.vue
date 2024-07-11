<template>
  <v-container
    class="page rounded-lg bg-white pa-6 gap-6 d-flex flex-column align-start pb-15"
  >
    <alex-documentation-header title="EditSocial" description="undefined"  />
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
        <alex-profile-forms-edit-social :name="props.name" :url="props.url" :index="props.index" :socialId="props.socialId" :showName="props.showName" 
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

const myProps = [{name : `name`,required : true,description : `There's no description.`,type : `string`,},{name : `url`,required : true,description : `There's no description.`,type : `string`,},{name : `index`,required : true,description : `There's no description.`,type : `number`,},{name : `socialId`,required : false,description : `There's no description.`,type : `number`,},{name : `showName`,required : false,description : `There's no description.`,type : `boolean`,initialValue : 'false',default : `false`},];
const myEmits = [{name : `error`,description : `There's no description`,type : `() => void`},{name : `no:error`,description : `There's no description`,type : `() => void`},{name : `update:name`,description : `There's no description`,type : `(value: string) => void`},{name : `update:url`,description : `There's no description`,type : `(value: string) => void`},];
const emitsCount = true;
const propsCount = true;

</script>
