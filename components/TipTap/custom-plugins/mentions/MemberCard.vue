<template>
  <node-view-wrapper
    class="member-card tw-inline-block"
    :style="`max-width: ${props.node.attrs.username.length + 3}ch;`"
  >
    <HoverCard>
      <HoverCardTrigger class="text-center">
        <a
          class="text-secondary-0 tw-text-nowrap pa-1"
          :href="`/users/${props.node.attrs.username}`"
          >@{{ props.node.attrs.username }}</a
        >
      </HoverCardTrigger>
      <HoverCardContent
        class="w-auto d-flex align-center justify-center flex-wrap ga-3 py-2 px-3 text-gray-800 hover:tw-bg-gray-100 tw-transition bg-white"
      >
        <v-avatar
          :size="40"
          :image="props.node.attrs.avatarUrl"
          class="alex-avatar-group-border alex-avatar-group-margin"
          color="gray-100"
        >
          <template v-if="!''" #default>
            <p class="text-gray-300 text-body-2">
              {{ getInitials(props.node.attrs.fullname) }}
            </p>
          </template>
        </v-avatar>

        <div>
          <p class="text-body-4 text-gray-900 tw-truncate">
            {{ props.node.attrs.fullname }}
          </p>
          <p class="text-body-5 text-gray-500 tw-truncate">
            {{ props.node.attrs.username }}
          </p>
        </div>
      </HoverCardContent>
    </HoverCard>
  </node-view-wrapper>
</template>
<script setup lang="ts">
import { NodeViewProps, NodeViewWrapper } from '@tiptap/vue-3';

const props = defineProps({
  node: {
    type: Object as PropType<NodeViewProps['node']>,
    required: true,
  },
  extension: {
    type: Object as PropType<NodeViewProps['extension']>,
    required: true,
  },
  updateAttributes: {
    type: Function as PropType<NodeViewProps['updateAttributes']>,
    default: () => {},
  },
});
</script>

<style scoped>
.w-auto {
  width: auto !important;
}
</style>
