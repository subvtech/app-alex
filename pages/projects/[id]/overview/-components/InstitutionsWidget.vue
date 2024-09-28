<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useUserPermissions } from '~/composables/useUserPermissions';
import InstitutionsWidgetDialog from './InstitutionsWidgetDialog.vue';

type InstitutionWidgetEvents = (event: 'success', institution: Institution) => void;

export interface InstitutionsWidgetProps {
  institutions: Institution[];
}

defineEmits<InstitutionWidgetEvents>();

withDefaults(defineProps<InstitutionsWidgetProps>(), {
  institutions: () => [],
});

const { t } = useI18n();
const { setMessage } = useMessageStore();
const strapiClient = useStrapiClient();
const userPermissions = useUserPermissions();
const users = ref<StrapiUser[]>([]);

const selectedInstitution = ref<Institution | null>(null);

const canCreateInstitution = computed(() => {
  return userPermissions.value.includes('api::institution.institution:create');
});

const canUpdateInstitution = computed(() => {
  return userPermissions.value.includes('api::institution.institution:update');
});

const fetchUsers = async () => {
  try {
    const res = await strapiClient<StrapiUser[]>('users?populate=avatar');
    if (!res) throw new Error(t('pages.projects.overview.institution_dialog.errors.fetch_users'));
    users.value = res;
  } catch (err) {
    setMessage((err as Error).message, 'red');
  }
};

watchEffect(() => {
  try {
    if ((canCreateInstitution.value || canUpdateInstitution.value) && !users.value.length) {
      fetchUsers();
    }
  } catch (err) {
    setMessage((err as Error).message, 'red');
  }
});
</script>

<template>
  <div class="tw-bg-white tw-w-full tw-flex tw-flex-col tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-4 rounded-lg">
    <div class="tw-border-b tw-p-5 tw-flex tw-justify-between tw-items-center">
      <h3>{{ $t('pages.projects.overview.institutions') }}</h3>
      <InstitutionsWidgetDialog
        :can-create-institution="canCreateInstitution"
        :can-update-institution="canUpdateInstitution"
        :institution="selectedInstitution"
        :institutions="institutions"
        :users="users"
        @close="selectedInstitution = null"
        @success="$emit('success', $event)"
      />
    </div>
    <div class="tw-flex tw-flex-1 tw-flex-col tw-gap-4 tw-p-4">
      <template v-if="institutions.length">
        <alex-profile-institution-item
          v-for="institution in institutions"
          :id="institution.id"
          :key="institution.id"
          :acronym="institution.acronym"
          :class="canUpdateInstitution ? 'tw-cursor-pointer hover:tw-bg-slate-50' : ''"
          :fallback="getInitials(institution.name)"
          :name="institution.name"
          :sector="institution.sector"
          :url="institution.cover?.url"
          @click="canUpdateInstitution ? (selectedInstitution = institution) : null"
        />
      </template>
      <div v-else class="tw-m-auto">
        <alex-custom-empty-placeholder
          :empty-text-message="t('pages.projects.overview.empty_institutions')"
          empty-text-image="/svg/OverviewEmptyInstitution.svg"
          grayscale
        />
      </div>
    </div>
  </div>
</template>
