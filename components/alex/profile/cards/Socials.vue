<template>
  <alex-custom-card
    :title="$t('components.profile.socials.title')"
    no-icon="canEdit"
    :disable-save="disableSave"
    :is-editing="canEditAndIsEditing"
    full-width
    no-footer
    @click:cancel="cancel"
    @click:save="onSave"
    @toggle:is-editing="toggleIsEditing"
  >
    <template #content>
      <div class="d-flex flex-column justify-center w-100">
        <alex-custom-empty-placeholder
          v-if="sortedSocials.length === 0"
          empty-text-image="svg/EmptySocials.svg"
          :empty-text-message="$t('components.profile.socials.empty')"
        />

        <div
          v-else
          class="d-flex flex-column align-center w-100 rounded-lg gap-4"
        >
          <div v-if="isEditing" class="d-flex align-center max-w-min-content">
            <alex-custom-accordion
              v-model:data="sortedSocials"
              show-positions
              @deleted:item="updateDeleteArray"
            >
              <template #content="{ index, id }">
                <alex-profile-forms-edit-social
                  v-model:name="sortedSocials[index].contentData!.title"
                  v-model:url="sortedSocials[index].contentData!.url"
                  :social-id="id"
                  :show-name="sortedSocials[index].icon === '/svg/website.svg'"
                  :index="index"
                  @update:name="
                    (e) =>
                      updateItemName({
                        socialId: id,
                        index,
                        value: e,
                      })
                  "
                  @update:url="
                    (e) =>
                      updateItemUrl({
                        socialId: id,
                        index,
                        value: e,
                      })
                  "
                  @error="addError(index)"
                  @no:error="removeError(index)"
                />
              </template>
            </alex-custom-accordion>
          </div>
          <alex-profile-social-item
            v-for="(social, index) in sortedSocials"
            v-else
            :key="index"
            :icon="social.icon"
            :content-data="social.contentData"
            :title="social.title"
          />
        </div>

        <div
          v-if="canEditAndIsEditing"
          class="d-flex justify-center mt-6"
          data-testid="add-social"
        >
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
const i18n = useI18n();

const isEditing = ref(false);
const isAdding = ref(false);

const componentKey = ref(0);
export interface SocialsEmits {
  (e: 'update'): void;
}

export interface SocialsComponentType {
  socials: SocialItemType[];
  canEdit?: boolean;
  userId: number;
}

interface AccordionItemTitleRequiredType extends AccordionItemType {
  title: string;
}

interface SocialFormUpdateValuePayload {
  index: number;
  socialId?: number;
  value: string;
}

const errors = ref<number[]>([]);

const emit = defineEmits<SocialsEmits>();

const props = withDefaults(defineProps<SocialsComponentType>(), {
  canEdit: false,
});

const { userId, socials, canEdit } = toRefs(props);

const { create, update, delete: _delete } = useStrapi();
const { arraysAreEqual } = useArrays();
const supported = ['youtube', 'linkedin', 'instagram'];

const client = useStrapiClient();
const socialToAccordionItem = (social) => {
  const { name, url, id } = social;
  const lowerCaseName = name.toLocaleLowerCase();
  return {
    title: name.toUpperCase(),
    icon: supported.includes(lowerCaseName)
      ? `/svg/${lowerCaseName}.svg`
      : '/svg/website.svg',

    contentData: {
      title: name,
      url,
      id,
    },
    id,
  };
};

const sortedSocials = ref<AccordionItemTitleRequiredType[]>(
  socials.value.map(socialToAccordionItem) as AccordionItemTitleRequiredType[],
);
const initialState = ref<AccordionItemTitleRequiredType[]>(
  socials.value.map(socialToAccordionItem) as AccordionItemTitleRequiredType[],
);

const canEditAndIsEditing = computed(() => isEditing.value && canEdit.value);

onMounted(() => {
  resetArrays(false);
});

const toggleIsEditing = () => {
  isEditing.value = !isEditing.value;
};

const disableSave = computed(() => {
  return (
    arraysAreEqual(
      initialState.value.map((item) => ({ ...item.contentData })),
      sortedSocials.value.map((item) => ({ ...item.contentData })),
    ) || errors.value.length !== 0
  );
});

const addError = (index) => {
  if (!errors.value.includes(sortedSocials.value[index].contentData!.id))
    errors.value.push(sortedSocials.value[index].contentData!.id);
};

const removeError = (index) => {
  if (errors.value.length === 0) return;
  errors.value = errors.value.filter((item) => {
    return item !== sortedSocials.value[index].contentData!.id;
  });
};

const addSocial = ({ name, url, selectedSocial }) => {
  const selectedSocialLowerCase = selectedSocial.toLowerCase();
  const title = name === '' ? selectedSocialLowerCase : name;

  const addedSocial = socialToAccordionItem({
    name: title,
    url,
  });

  sortedSocials.value.push(addedSocial);

  isAdding.value = false;
  componentKey.value += 1;
};

const deleteArray = ref<number[]>([]);
const updateArray = ref<{ socialId?: number; url: string; name: string }[]>([]);

const updateDeleteArray = ({ contentData }: AccordionItemType) => {
  if (contentData) {
    deleteArray.value.push(contentData.id);
  }
};

const updateItemName = (props: SocialFormUpdateValuePayload) => {
  const { socialId, index, value: name } = props;

  const validIndex = socialId
    ? sortedSocials.value.findIndex((item) => item.contentData!.id === socialId)
    : index;

  sortedSocials.value[validIndex].title = name.toUpperCase();

  const updateArrayIndex = updateArray.value.findIndex(
    (item) => item.socialId === socialId,
  );
  if (updateArrayIndex !== -1) updateArray.value[updateArrayIndex].name = name;
  else {
    updateArray.value.push({
      url: sortedSocials.value[validIndex].contentData!.url,
      name,
      socialId,
    });
  }
};

const updateItemUrl = (props: SocialFormUpdateValuePayload) => {
  const { socialId, index, value: url } = props;

  const socialIdIndex = sortedSocials.value.findIndex(
    (item) => item.id === socialId,
  );
  const validIndex = socialIdIndex === -1 ? index : socialIdIndex;

  sortedSocials.value[validIndex].contentData!.url = url;
  const updateArrayIndex = updateArray.value.findIndex(
    (item) => item.socialId === socialId,
  );
  if (updateArrayIndex !== 1) updateArray.value[updateArrayIndex].url = url;
  else {
    updateArray.value.push({
      name: sortedSocials.value[validIndex].title!,
      socialId,
      url,
    });
  }
};

const resetArrays = (updateSocials = true) => {
  deleteArray.value = [];
  updateArray.value = [];

  if (updateSocials) sortedSocials.value = [...initialState.value];
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
          : { after: sortedSocials.value[index - 1].contentData!.id };

      if (item.contentData!.id) {
        if (!deleteArray.value.includes(item.contentData!.id)) {
          connectArray.push({
            id: item.contentData!.id,
            position,
          });
          promises.push(
            update('socials', item.contentData!.id, {
              name: item.contentData!.title,
              url: item.contentData!.url,
            }),
          );
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
  toggleIsEditing();
  await Promise.all(promises);

  initialState.value = [...sortedSocials.value];
  resetArrays(false);
  emit('update');
};

const cancel = () => {
  componentKey.value += 1;

  toggleIsEditing();
  resetArrays();
};
</script>

<style scoped lang="scss">
#Card {
  //border-bottom: 1px solid #eaeef1;
  flex-direction: column;
  box-sizing: border-box;
}

.max-w-min-content {
  max-width: min-content;
  min-width: 100%;
  max-width: 350px;
}

.min-w-0 {
  min-width: 0;
}

@media (max-width: 450px) {
  .max-w-min-content {
    max-width: 300px;
  }
}

@media (max-width: 350px) {
  .max-w-min-content {
    max-width: 250px;
  }
}
</style>
