<template>
  <node-view-wrapper class="member-card">
    <HoverCard>
      <HoverCardTrigger
        ><span class="mention">{{ username }}</span></HoverCardTrigger
      >
      <HoverCardContent
        class="d-flex align-center flex-wrap ga-3 py-2 px-3 text-gray-800 hover:tw-bg-gray-100 tw-cursor-pointer tw-transition bg-white"
      >
        <v-avatar
          :size="40"
          :image="avatarUrl"
          class="alex-avatar-group-border alex-avatar-group-margin"
          color="gray-100"
        >
          <template v-if="!''" #default>
            <p class="text-gray-300 text-body-2">
              {{ getInitials(fullname) }}
            </p>
          </template>
        </v-avatar>

        <div>
          <p class="text-body-4 text-gray-900 tw-truncate">
            {{ fullname }}
          </p>
          <p class="text-body-5 text-gray-500 tw-truncate">
            {{ username }}
          </p>
        </div>
      </HoverCardContent>
    </HoverCard>
  </node-view-wrapper>
</template>
<script setup lang="ts">
import { NodeViewWrapper } from '@tiptap/vue-3';

interface MemberCardProps {
  fullname?: string;
  username?: string;
  avatarUrl?: string;
}

const props = withDefaults(defineProps<MemberCardProps>(), {
  avatarUrl: '',
  fullname: 'Eliezir Teste',
  username: 'eliezir',
});

console.log(props);
</script>

<style scoped>
.mention {
  background-color: var(--purple-light);
  border-radius: 0.4rem;
  box-decoration-break: clone;
  color: var(--purple);
  padding: 0.1rem 0.3rem;
}
</style>
