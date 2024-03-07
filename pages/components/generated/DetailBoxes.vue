<template>
  <v-container
    class="page rounded-lg bg-white pa-6 gap-6 d-flex flex-column align-start pb-15"
  >
    <alex-documentation-header title="DetailBoxes" description="undefined"  />
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
        <alex-profile-detail-boxes :boxes="props.boxes" :hideDivider="props.hideDivider" :loading="props.loading" 
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

const myProps = [{name : `boxes`,required : true,description : `There's no description.`,type : `BoxItemType[]`,},{name : `hideDivider`,required : false,description : `There's no description.`,type : `boolean`,initialValue : 'false',default : `false`},{name : `loading`,required : false,description : `There's no description.`,type : `boolean`,initialValue : 'false',default : `false`},];
const myEmits = [];
const emitsCount = false;
const propsCount = false;

</script>
