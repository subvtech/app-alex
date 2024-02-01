<template>
  <alex-custom-card
    :title="$t('components.profile.socials.title')"
    :cancel="cancel"
    :save="onSave"
    :disable-save="disableSave"
    :show-icon="canEdit"
    :is-editing="canEditAndIsEditing"
    full-width
    @toggle:is-editing="isEditing = !isEditing"
  >
    <template #content>
      <div class="d-flex flex-column w-100 justify-center">
        <alex-custom-empty-placeholder
          v-if="sortedSocials.length === 0"
          empty-text-image="/svg/EmptySocials.svg"
          :empty-text-message="$t('components.profile.socials.empty')"
        />

        <div v-else class="w-100">
          <div class="d-flex flex-column rounded-lg gap-4">
            <alex-custom-accordion
              v-if="isEditing"
              :key="componentKey"
              v-model:data="sortedSocials"
              show-positions
              @deleted:item="updateDeleteArray"
            >
              <template #content="{ title, url, index }">
                <alex-profile-forms-social
                  :name="title"
                  :url="url"
                  :index="index"
                  :social-id="sortedSocials[index]?.contentData?.id"
                  @error="disableSave = true"
                  @no:error="disableSave = false"
                  @update:url="updateUrl"
                  @update:name="updateItemName"
                />
              </template>
            </alex-custom-accordion>
            <alex-profile-social-item
              v-for="(social, index) in sortedSocials"
              v-else
              :key="index"
              :icon="social.icon"
              :content-data="social.contentData"
              :title="social.title"
            />
          </div>
        </div>
        <div v-if="canEditAndIsEditing" class="d-flex justify-center mt-6">
          <alex-profile-dialogs-add-social
            :socials="updatedMissingSocials"
            @save:social="addSocial"
          />
        </div>
      </div>
    </template>
  </alex-custom-card>
</template>

<script setup lang="ts">
import { SocialItemType } from '~/models/social.model';
import { AccordionItemType } from '~/components/alex/custom/Accordion.vue';
import {
  SocialFormUpdateNamePayload,
  SocialFormUpdateUrlPayload,
} from '@/components/alex/profile/forms/Social.vue';
const i18n = useI18n();

const isEditing = ref(false);
const isAdding = ref(false);
const isChanged = ref(false);
const disableSave = ref(false);
const componentKey = ref(0);
export interface SocialsEmits {
  (e: 'update'): void;
}

export interface SocialsComponentType {
  socials: SocialItemType[];
  canEdit?: boolean;
  userId: number;
}

const emit = defineEmits<SocialsEmits>();

const props = withDefaults(defineProps<SocialsComponentType>(), {
  canEdit: false,
});

const { userId, socials, canEdit } = toRefs(props);

const { create, delete: _delete } = useStrapi();

const supported = ['youtube', 'linkedin', 'instagram'];

const client = useStrapiClient();

const sortedSocials = ref<AccordionItemType[]>([]);

const canEditAndIsEditing = computed(() => isEditing.value && canEdit.value);

onMounted(() => {
  resetArrays();
});

const addSocial = ({ name, url, selectedSocial }) => {
  const selectedSocialLowerCase = selectedSocial.toLowerCase();
  const title = name === '' ? selectedSocialLowerCase : name;
  const includesTitle = supported.includes(title);

  const icon = includesTitle ? `/svg/${title}.svg` : '/svg/website.svg';
  const addedSocial = {
    title: title.toUpperCase(),
    icon,
    contentData: {
      title: includesTitle ? undefined : title,
      url,
    },
    id: sortedSocials.value.length + 1,
  };

  sortedSocials.value.push(addedSocial);

  isAdding.value = false;
  isChanged.value = true;
  componentKey.value += 1;
};
const deleteArray = ref<number[]>([]);
const updateArray = ref<{ socialId?: number; url: string; name: string }[]>([]);

const updateDeleteArray = ({ contentData }: AccordionItemType) => {
  if (contentData) {
    sortedSocials.value = sortedSocials.value
      .filter((item) => {
        return item.contentData?.id !== contentData.id;
      })
      .map((item, index) => ({ ...item, id: index + 1 }));
    deleteArray.value.push(contentData.id);
  }
  isChanged.value = true;
};

const updateItemName = ({
  name,
  index,
  socialId,
}: SocialFormUpdateNamePayload) => {
  const socialIdIndex = sortedSocials.value.findIndex(
    (item) => item.id === socialId,
  );

  const validIndex = socialIdIndex === -1 ? index : socialIdIndex;
  sortedSocials.value[validIndex] = {
    ...sortedSocials.value[validIndex],
    title: name,
  };

  if (updateArray.value.find((item) => item.socialId === socialId))
    updateArray.value[validIndex].name = name;
  else {
    updateArray.value.push({
      url: sortedSocials.value[validIndex].contentData!.url,
      name,
      socialId,
    });
  }
};

const updateUrl = ({ url, index, socialId }: SocialFormUpdateUrlPayload) => {
  const socialIdIndex = sortedSocials.value.findIndex(
    (item) => item.id === socialId,
  );
  const validIndex = socialIdIndex === -1 ? index : socialIdIndex;

  sortedSocials.value[validIndex] = {
    ...sortedSocials.value[validIndex],
    contentData: { url },
  };
  if (updateArray.value.find((item) => item.socialId === socialId))
    updateArray.value[validIndex].url = url;
  else {
    updateArray.value.push({
      name: sortedSocials.value[validIndex].title!,
      socialId,
      url,
    });
  }
};

const fillSortedSocialsArray = () => {
  sortedSocials.value = socials.value.map(({ id, name, url }) => ({
    title: name.toUpperCase(),
    icon: supported.includes(name.toLocaleLowerCase())
      ? `/svg/${name}.svg`
      : '/svg/website.svg',
    contentData: {
      url,
      id,
    },
  })) as AccordionItemType[];
};

const resetArrays = (updateSocials = true) => {
  deleteArray.value = [];
  updateArray.value = [];
  if (updateSocials) fillSortedSocialsArray();
  isChanged.value = false;
};

const updatedMissingSocials = computed(() => {
  const missingSocials: string[] = [];
  if (
    !sortedSocials.value.find(
      (element) => element.title?.toLowerCase() === supported[2],
    )
  )
    missingSocials.push(supported[2]);
  if (
    !sortedSocials.value.find(
      (element) => element.title?.toLowerCase() === supported[0],
    )
  )
    missingSocials.push(supported[0]);
  if (
    !sortedSocials.value.find(
      (element) => element.title?.toLowerCase() === supported[1],
    )
  )
    missingSocials.push(supported[1]);
  missingSocials.push(i18n.t('components.profile.socials.otherSocial'));
  return [...missingSocials];
});

const onSave = async () => {
  const promises: Promise<any>[] = [];

  const connectArray: {
    id: number;
    position: {
      end?: boolean;
      start?: boolean;
      before?: number;
      after?: number;
    };
  }[] = [];

  if (sortedSocials.value.length !== 0) {
    sortedSocials.value.forEach((item, index) => {
      const position =
        index === 0
          ? { start: true }
          : index === sortedSocials.value.length - 1
          ? { end: true }
          : { after: sortedSocials.value[index - 1].contentData?.id };
      if (item.contentData?.id) {
        if (!deleteArray.value.includes(item.contentData.id)) {
          connectArray.push({
            id: item.contentData.id,
            position,
          });
        }
      } else {
        promises.push(
          create('socials', {
            name: item.title,
            url: item.contentData!.url,
            users_permissions_user: props.userId,
          }).then((result) => {
            sortedSocials.value[index].contentData!.id = result.data.id;
            connectArray.push({
              id: result.data.id,
              position,
            });
          }),
        );
      }
    });
  }

  if (deleteArray.value.length !== 0) {
    deleteArray.value.forEach((item) => {
      promises.push(_delete(`/socials/${item}`));
    });
  }
  if (connectArray.length !== 0)
    promises.push(
      client(`/users/${userId.value}`, {
        method: 'PUT',
        body: {
          socials: {
            connect: connectArray,
            deleteArray: deleteArray.value,
          },
        },
      }),
    );

  if (promises.length === 0) {
    resetArrays();
    return;
  }
  await Promise.all(promises);

  resetArrays(false);
  emit('update');
};

const cancel = () => {
  componentKey.value = componentKey.value + 1;
  isChanged.value = false;
  resetArrays();
};

watch(
  socials,
  () => {
    fillSortedSocialsArray();
  },
  { deep: true },
);
</script>

<style scoped lang="scss">
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
#Card {
  //border-bottom: 1px solid #eaeef1;
  flex-direction: column;

  .empty {
    span {
      color: #6e7a87;
      text-align: center;
      /* Body/P1 */

      font-size: 16px;
      font-weight: 400;
      line-height: 135%; /* 21.6px */
      letter-spacing: 0.32px;
    }
  }

  .add-social {
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
    top: 0px;
    left: 0px;
    background: rgba(0, 0, 0, 0.5);
    z-index: 2000;
  }
}

.btn {
  text-transform: none;
  color: #6e7a87 !important;
  border-width: 0;
  background-color: #f1f5f9;
  font-weight: 700;
  line-height: 135%; /* 18.9px */
  letter-spacing: 0.28px;
}

@media (max-width: 400px) {
  #Card {
    .btn {
      width: 100%;
    }
  }
}
</style>
