<template>
  <v-container
    class="page rounded-lg bg-white pa-6 gap-6 d-flex flex-column align-start pb-15"
  >
    <alex-documentation-header title="horizontalBar" description="This component is meant to be used on the main screen as a horizontal Menu,
it's also suitable for use inside smaller components." vuetify-link="https://dev.vuetifyjs.com/en/components/v-app-bar/#usage" />
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
        <alex-custom-horizontal-bar :avatar="props.avatar" :placeholder="props.placeholder" :notFixed="props.notFixed" :menuItems="props.menuItems" :isBellActive="props.isBellActive" :isChatActive="props.isChatActive" :reverse="props.reverse" :showPicture="props.showPicture" :pictureSize="props.pictureSize" :trackCurrentUser="props.trackCurrentUser" 
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

const myProps = [{name : `avatar`,required : false,description : `There's no description.`,type : `Upload`,},{name : `placeholder`,required : false,description : `There's no description.`,type : `string`,},{name : `notFixed`,required : false,description : `There's no description.`,type : `boolean`,initialValue : 'false',default : `false`},{name : `menuItems`,required : true,description : `There's no description.`,type : `HorizontalBarMenuItemType[]`,initialValue : [],default : `[]`},{name : `isBellActive`,required : false,description : `There's no description.`,type : `boolean`,initialValue : 'false',default : `false`},{name : `isChatActive`,required : false,description : `There's no description.`,type : `boolean`,initialValue : 'false',default : `false`},{name : `reverse`,required : false,description : `There's no description.`,type : `boolean`,initialValue : 'false',default : `false`},{name : `showPicture`,required : false,description : `There's no description.`,type : `boolean`,initialValue : 'false',default : `false`},{name : `pictureSize`,required : false,description : `There's no description.`,type : `number`,initialValue : '40',default : `40`},{name : `trackCurrentUser`,required : false,description : `There's no description.`,type : `boolean`,initialValue : 'false',default : `false`},];
const myEmits = [{name : `alert`,description : `click on the alert button`,type : `() => void`},{name : `chat`,description : `click on the chat button`,type : `() => void`},{name : `toggle:drawer`,description : `click on the main button to change the drawer state`,type : `() => void`},];
const emitsCount = false;
const propsCount = true;

</script>
