<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import Let from '~/components/Let.vue';
import { useUserPermissions } from '~/composables/useUserPermissions';
import InstitutionsWidgetDialog from './InstitutionsWidgetDialog.vue';

type InstitutionWidgetEvents = {
  (event: 'remove', institution: Institution): void;
  (event: 'update', institution: Institution): void;
};

export interface InstitutionsWidgetProps {
  institutions: Institution[];
}

const emit = defineEmits<InstitutionWidgetEvents>();

withDefaults(defineProps<InstitutionsWidgetProps>(), {
  institutions: () => [],
});

const { t } = useI18n();
const { setMessage } = useMessageStore();
const strapiClient = useStrapiClient();
const userPermissions = useUserPermissions();
const route = useRoute();

const users = ref<StrapiUser[]>([]);
const selectedInstitution = ref<Institution | null>(null);

const canCreateInstitution = computed(() => {
  return userPermissions.value.includes('api::learningplan.learningplan:createInstitution');
});

const canUpdateInstitution = computed(() => {
  return userPermissions.value.includes('api::learningplan.learningplan:updateInstitution');
});

const canRemoveInstitution = computed(() => {
  return userPermissions.value.includes('api::learningplan.learningplan:removeInstitution');
});

const fetchUsers = async () => {
  try {
    const res = await strapiClient<StrapiUser[]>('users?populate=avatar');
    if (!res) throw new Error(t('pages.projects.overview.institution_dialog.errors.fetch_users'));
    users.value = res;
  } catch (err) {
    // TODO: Checar porque não funciona
    setMessage((err as Error).message, 'red');
  }
};

const getRepresentative = (institution: Institution) => {
  return institution.institution_users.find((v) => v.role === 'representative')!.user;
};

const handleRemoveInstitution = async (institution: Institution) => {
  // TODO: Checar porque não funciona
  setMessage(`Removing ${institution.name}...`, 'info');

  try {
    await strapiClient(`learningplans/${+route.params?.id}/institutions/${institution.id}`, { method: 'DELETE' });
    emit('remove', institution);
  } catch (err) {
    // TODO: Checar porque não funciona
    setMessage((err as Error).message, 'red');
  }
};

watchEffect(() => {
  try {
    if ((canCreateInstitution.value || canUpdateInstitution.value) && !users.value.length) {
      fetchUsers();
    }
  } catch (err) {
    // TODO: Checar porque não funciona
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
        @update="$emit('update', $event)"
      />
    </div>
    <div class="tw-flex tw-flex-1 tw-flex-col tw-gap-4 tw-p-4 tw-pr-2 tw-max-h-[420px] tw-overflow-auto">
      <template v-if="institutions.length">
        <div
          v-for="institution in institutions"
          :key="institution.id"
          class="tw-bg-white tw-flex tw-items-center tw-p-1"
          :class="canUpdateInstitution && 'tw-cursor-pointer hover:tw-bg-slate-50'"
          @click="canUpdateInstitution ? (selectedInstitution = institution) : null"
        >
          <div class="tw-flex tw-flex-1 tw-items-center tw-gap-3">
            <NuxtImg
              v-if="institution.cover?.url"
              class="tw-rounded-sm tw-size-[80px]"
              provider="strapi"
              :src="institution.cover?.url"
              :placeholder="[80, 80]"
            />
            <div
              v-else
              class="tw-bg-slate-200 tw-rounded-sm tw-flex tw-flex-col tw-items-center tw-justify-center tw-min-w-[80px] tw-size-[80px]"
            >
              {{ getInitials(institution.name) }}
            </div>
            <Let
              v-slot="{ title, user }"
              :value="{
                title: institution.acronym ? `${institution.acronym} - ${institution.name}` : institution.name,
                user: getRepresentative(institution),
              }"
            >
              <div class="tw-flex tw-flex-col tw-flex-1 tw-gap-3 tw-overflow-hidden">
                <div class="tw-flex tw-flex-col tw-leading-none tw-gap-1">
                  <div class="tw-text-ellipsis tw-line-clamp-2 tw-font-[500]" :title="title">
                    {{ title }}
                  </div>
                  <div v-if="institution.email" class="tw-text-slate-500 tw-truncate" :title="institution.email">
                    {{ institution.email }}
                  </div>
                </div>
                <div class="tw-flex tw-items-center tw-gap-2">
                  <NuxtImg
                    v-if="user.avatar?.url"
                    class="tw-rounded-sm tw-size-[24px]"
                    provider="strapi"
                    :src="user.avatar.url"
                    :placeholder="[24, 24]"
                  />
                  <div
                    v-else
                    class="tw-bg-slate-200 tw-rounded-sm tw-flex tw-flex-col tw-items-center tw-justify-center tw-min-w-[24px] tw-size-[24px]"
                  >
                    {{ getInitials(user.fullname) }}
                  </div>
                  <span class="tw-text-slate-400 tw-text-sm tw-trucante" :title="user.fullname">
                    {{ user.fullname }}
                  </span>
                </div>
              </div>
            </Let>
          </div>
          <!-- TODO: Exibir popup de confirmação -->
          <alex-custom-button
            v-if="canRemoveInstitution"
            color="gray-500"
            icon="mdi-trash-can-outline"
            size="small"
            variant="icon"
            @click.stop="handleRemoveInstitution(institution)"
          />
        </div>
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
