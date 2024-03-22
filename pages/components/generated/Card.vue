<template>
  <v-container
    class="page rounded-lg bg-white pa-6 gap-6 d-flex flex-column align-start pb-15"
  >
    <alex-documentation-header title="Card" description="undefined"  />
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
        <alex-custom-card :title="props.title" :fullWidth="props.fullWidth" :isEditing="props.isEditing" :hideDividers="props.hideDividers" :noHeader="props.noHeader" :noFooter="props.noFooter" :outline="props.outline" :showFooterDivider="props.showFooterDivider" :controlsLoading="props.controlsLoading" :sizingClass="props.sizingClass" :tooltipExtraClass="props.tooltipExtraClass" :alignContent="props.alignContent" :href="props.href" :showIcon="props.showIcon" :showTooltip="props.showTooltip" :smallButtons="props.smallButtons" :tooltip="props.tooltip" :isNested="props.isNested" :disableSave="props.disableSave" 
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

const myProps = [{name : `title`,required : true,description : `There's no description.`,type : `string`,},{name : `fullWidth`,required : false,description : `There's no description.`,type : `boolean`,initialValue : 'false',default : `false`},{name : `isEditing`,required : false,description : `There's no description.`,type : `boolean`,initialValue : 'false',default : `false`},{name : `hideDividers`,required : false,description : `There's no description.`,type : `boolean`,initialValue : 'false',default : `false`},{name : `noHeader`,required : false,description : `There's no description.`,type : `boolean`,initialValue : 'false',default : `false`},{name : `noFooter`,required : false,description : `There's no description.`,type : `boolean`,initialValue : 'false',default : `false`},{name : `outline`,required : false,description : `There's no description.`,type : `boolean`,initialValue : 'false',default : `false`},{name : `showFooterDivider`,required : false,description : `There's no description.`,type : `boolean`,initialValue : 'false',default : `false`},{name : `controlsLoading`,required : false,description : `There's no description.`,type : `boolean`,initialValue : 'false',default : `false`},{name : `sizingClass`,required : false,description : `There's no description.`,type : `string`,},{name : `tooltipExtraClass`,required : false,description : `There's no description.`,type : `string`,},{name : `alignContent`,required : false,description : `There's no description.`,type : `'align-center' | 'align-start' | 'align-end'`,initialValue : 'align-start',default : `align-start`},{name : `href`,required : false,description : `There's no description.`,type : `string`,},{name : `showIcon`,required : false,description : `There's no description.`,type : `boolean`,initialValue : 'true',default : `true`},{name : `showTooltip`,required : false,description : `There's no description.`,type : `boolean`,initialValue : 'false',default : `false`},{name : `smallButtons`,required : false,description : `There's no description.`,type : `boolean`,initialValue : 'false',default : `false`},{name : `tooltip`,required : false,description : `There's no description.`,type : `string`,},{name : `isNested`,required : false,description : `There's no description.`,type : `boolean`,initialValue : 'false',default : `false`},{name : `disableSave`,required : false,description : `There's no description.`,type : `boolean`,initialValue : 'false',default : `false`},];
const myEmits = [];
const emitsCount = false;
const propsCount = true;

</script>
