<template>
  <alex-inputs-autocomplete
    v-model="value"
    :label="$t('pages.register.institution')"
    :name="name"
    :search="search"
    :loading="fetching"
    :items="institutions"
    :item-title="getItemTitle"
    :color="color"
    :error-messages="errorMessage"
    show
    item-value="id"
    class="my-3"
    variant="outlined"
    :no-data-text="noDataText"
    autofocus
    spellcheck="false"
    v-bind="$attrs"
    @input="$emit('update:search', $event.target.value)"
  />
</template>

<script setup lang="ts">
import { useField } from 'vee-validate';

export type InstitutionProps = {
  search: string;
  institutions: InstitutionsType[];
  filterIds?: number[];
  name?: string;
  color?: string;
};
const props = withDefaults(defineProps<InstitutionProps>(), {
  name: 'institution',
  color: 'white',
  filterIds: () => [],
});

const emit = defineEmits([
  'update:institutions',
  'update:value',
  'update:search',
]);

const { value, errorMessage, setErrors } = useField(
  () => props.name || 'institution',
  undefined,
);

const { t } = useI18n();
const isTyping = ref(false);
const fetching = ref(false);
const noDataText = ref(t('components.institutions.searchForIntitutions'));
const { find } = useStrapiUtils();
const i18n = useI18n();

const fetchInstitutions = async (institution: string) => {
  fetching.value = true;
  noDataText.value = t('components.institutions.noInstitutionsFound');
  try {
    const result = await find(`institutions`, {
      filters: {
        $or: [
          { acronym: { $containsi: institution } },
          { name: { $containsi: institution } },
          { socialName: { $containsi: institution } },
        ],
      },
      populate: ['cover'],
      pagination: { start: 0, limit: 10 }, // limit per page
    });
    if (result.data.length > 0) {
      const dataInstitutions: InstitutionsType[] = result.data.map(
        (institution: any) => {
          return {
            ...institution,
          };
        },
      );
      emit('update:institutions', dataInstitutions);
    }
  } catch (error) {
    setErrors(i18n.t('pages.login.searchError'));
  } finally {
    fetching.value = false;
  }
};

watchEffect((onInvalidate) => {
  if (props.search.length > 0) {
    isTyping.value = true;

    const getData = setTimeout(async () => {
      isTyping.value = false;
      await fetchInstitutions(props.search);
    }, 700);

    onInvalidate(() => {
      clearInterval(getData);
    });
  }
});

const getItemTitle = (item: InstitutionsType) => {
  return `${item.acronym} - ${item.name}`;
};
</script>
