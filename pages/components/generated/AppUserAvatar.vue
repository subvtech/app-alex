<template>
  <v-container
    class="page rounded-lg bg-white pa-6 gap-6 d-flex flex-column align-start pb-15"
  >
    <alex-documentation-header title="AppUserAvatar" description="This is a description" vuetify-link="https://dev.vuetifyjs.com/en/components/v-avatar/#usage" />
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
        <app-user-avatar :userId="props.userId" :placeholder="props.placeholder" :avatarStyle="props.avatarStyle" :showBorder="props.showBorder" :canEdit="props.canEdit" :trackCurrentUser="props.trackCurrentUser" :canDelete="props.canDelete" :size="props.size" :profilePicture="props.profilePicture" 
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

const myProps = [{name : `userId`,required : false,description : `user id`,type : `number `,},{name : `placeholder`,required : false,description : `There's no description.`,type : `string`,},{name : `avatarStyle`,required : false,description : `There's no description.`,type : `string`,},{name : `showBorder`,required : false,description : `There's no description.`,type : `boolean`,initialValue : 'false',default : `false`},{name : `canEdit`,required : false,description : `There's no description.`,type : `boolean`,initialValue : 'false',default : `false`},{name : `trackCurrentUser`,required : false,description : `There's no description.`,type : `boolean`,},{name : `canDelete`,required : false,description : `There's no description.`,type : `boolean`,initialValue : 'false',default : `false`},{name : `size`,required : false,description : `There's no description.`,type : `number`,initialValue : '30',default : `30`},{name : `profilePicture`,required : false,description : `There's no description.`,type : `ProfilePictureItemType | null`,initialValue : 'null',default : `null`},];
const myEmits = [];
const emitsCount = false;
const propsCount = true;

</script>
