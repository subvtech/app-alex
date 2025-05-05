<script setup lang="ts">
import { useMutation } from '@tanstack/vue-query';
import { useI18n } from 'vue-i18n';
import Let from '~/components/Let.vue';
import Button from '~/components/ui/button/Button.vue';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';
import { useUserPermissions } from '~/composables/useUserPermissions';
import InstitutionsWidgetDialog from './InstitutionsWidgetDialog.vue';
import { id } from 'ethers';

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
const { $toast } = useNuxtApp();
const strapiClient = useStrapiClient();
const userPermissions = useUserPermissions();
const route = useRoute();
const userStore = useStrapiUser();
const learningPlanStore = useLearningPlanStore();

const users = ref<StrapiUser[]>([]);
const removedInstitution = ref<Institution | null>(null);
const selectedInstitution = ref<Institution | null>(null);

const canCreateInstitution = computed(() => {
  const member = learningPlanStore.learningPlan?.members?.find(
    (member) => member?.user?.id === userStore?.value?.id && userStore?.value,
  );

  if (userPermissions.value.includes('api::learningplan.learningplan:createInstitution')) {
    return true;
  }

  return ['student_leader', 'facilitator'].includes(member?.role ?? '');
});

const canUpdateInstitution = computed(() => {
  const member = learningPlanStore.learningPlan?.members?.find(
    (member) => member?.user?.id === userStore?.value?.id && userStore?.value,
  );

  if (userPermissions.value.includes('api::learningplan.learningplan:updateInstitution')) {
    return true;
  }

  return ['student_leader', 'facilitator'].includes(member?.role ?? '');
});

const canRemoveInstitution = computed(() => {
  const member = learningPlanStore.learningPlan?.members?.find(
    (member) => member?.user?.id === userStore?.value?.id && userStore?.value,
  );

  if (userPermissions.value.includes('api::learningplan.learningplan:removeInstitution')) {
    return true;
  }

  return ['student_leader', 'facilitator'].includes(member?.role ?? '');
});

const removeInstitution = useMutation({
  async mutationFn(institution: Institution) {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await strapiClient(`learningplans/${+route.params?.id}/institutions/${institution.id}`, { method: 'DELETE' });
  },
  onMutate(institution) {
    removedInstitution.value = institution;
  },
  onError(err) {
    $toast.error(err.message || t('pages.projects.errors.unknown'), { class: '[&_[data-icon]]:tw-text-red-500' });
  },
  onSuccess() {
    const options = { class: '[&_[data-icon]]:tw-text-green-500' };
    $toast.success(t('pages.projects.overview.institution_remove_success'), options);
    emit('remove', removedInstitution.value!);
  },
  onSettled() {
    removedInstitution.value = null;
  },
});

const fetchUsers = async () => {
  try {
    const res = await strapiClient<StrapiUser[]>('users?populate=avatar');
    if (!res) throw new Error(t('pages.projects.overview.institution_dialog.errors.fetch_users'));
    users.value = res;
  } catch (err) {
    $toast.error((err as Error).message || t('pages.projects.errors.unknown'), {
      class: '[&_[data-icon]]:tw-text-red-500',
    });
  }
};

const getRepresentative = (institution: Institution) => {
  return institution.institution_users.find((v) => v.role === 'representative')!.user;
};

const handleInstitutionClick = (institution: Institution) => {
  if (canUpdateInstitution && removedInstitution.value !== institution) {
    selectedInstitution.value = institution;
  }
};

onMounted(() => {
  if (!learningPlanStore.learningPlan) {
    learningPlanStore.loadLearningPlan(+route.params.id);
  }
});

watchEffect(() => {
  try {
    if ((canCreateInstitution.value || canUpdateInstitution.value) && !users.value.length) {
      fetchUsers();
    }
  } catch (err) {
    $toast.error((err as Error).message || t('pages.projects.errors.unknown'), {
      class: '[&_[data-icon]]:tw-text-red-500',
    });
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
          class="tw-bg-white tw-flex tw-items-center tw-rounded-sm tw-p-1"
          :class="canUpdateInstitution && 'tw-cursor-pointer hover:tw-bg-slate-50'"
          @click="handleInstitutionClick(institution)"
        >
          <div class="tw-flex tw-flex-1 tw-items-center tw-gap-3 tw-overflow-hidden">
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
          <Popover v-if="canRemoveInstitution">
            <PopoverTrigger as-child>
              <Button
                variant="ghost"
                class="!tw-p-1 !tw-h-auto !tw-w-[25px]"
                :class="!removeInstitution.isPending.value && 'hover:tw-bg-slate-200'"
                :disabled="removeInstitution.isPending.value"
                @click.stop
              >
                <v-icon
                  v-if="removeInstitution.isPending.value && removedInstitution === institution"
                  class="tw-animate-spin"
                  :class="removeInstitution.isPending.value ? 'tw-text-slate-300' : 'tw-text-slate-500'"
                  icon="mdi-loading"
                  size="small"
                />
                <v-icon
                  v-else
                  :class="removeInstitution.isPending.value ? 'tw-text-slate-300' : 'tw-text-slate-500'"
                  icon="mdi-trash-can-outline"
                  size="small"
                />
              </Button>
            </PopoverTrigger>
            <PopoverContent class="tw-flex tw-flex-col tw-w-[400px]">
              <h3>{{ $t('pages.projects.overview.institution_remove_title') }}</h3>
              <div class="tw-mb-2">
                {{ $t('pages.projects.overview.institution_remove_message', [institution.name]) }}
              </div>
              <div class="tw-flex tw-justify-end">
                <Button
                  variant="destructive"
                  :class="removeInstitution.isPending.value && 'tw-opacity-60'"
                  :disabled="removeInstitution.isPending.value"
                  @click.stop="removeInstitution.mutate(institution)"
                >
                  <v-icon
                    v-if="removeInstitution.isPending.value && removedInstitution === institution"
                    class="tw-animate-spin"
                    icon="mdi-loading"
                    size="x-small"
                  />
                  <v-icon v-else icon="mdi-trash-can-outline" size="x-small" />
                  <span class="tw-ml-2">{{ $t('pages.projects.overview.remove') }}</span>
                </Button>
              </div>
            </PopoverContent>
          </Popover>
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
