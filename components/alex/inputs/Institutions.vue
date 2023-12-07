<template>
  <v-autocomplete
    v-model="value"
    :label="$t('pages.register.institution')"
    :name="name"
    :search="search"
    :loading="fetching"
    :items="institutions"
    :item-title="getItemTitle"
    :color="color"
    :error-messages="errorMessage"
    :hide-selected="true"
    show
    item-value="id"
    class="my-3"
    variant="outlined"
    required
    no-data-text="Instituição não encontrada"
    autofocus
    spellcheck="false"
    @input="$emit('update:search', $event.target.value)"
  />
</template>

<script setup lang="ts">
import { useField } from 'vee-validate';

type InstitutionsType = {
  socialName: string;
  acronym: string;
};

type InstitutionProps = {
  search: string;
  institutions: InstitutionsType[];
  filterIds: number[];
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

const { value, errorMessage } = useField(
  () => props.name || 'institution',
  undefined,
);

const isTyping = ref(false);
const fetching = ref(false);
const { find } = useStrapi();
const { setMessage } = useMessageStore();
const i18n = useI18n();

const fetchInstitutions = async (institution: string) => {
  fetching.value = true;
  try {
    const result = await find(`institutions`, {
      fields: ['id', 'acronym', 'socialName'], // campos a serem buscados
      filters: {
        $or: [
          { acronym: { $containsi: institution } },
          { socialName: { $containsi: institution } },
        ],
      },
      pagination: { start: 0, limit: 10 }, // limite de instituições
    });
    const dataInstitutions = (result.data.length > 0 ? result.data : []).map(
      (r: any) => {
        return {
          id: r.id,
          acronym: r.attributes?.acronym,
          socialName: r.attributes?.socialName,
        };
      },
    );
    emit('update:institutions', dataInstitutions);
  } catch (error) {
    setMessage(i18n.t('pages.login.searchError'), 'red', true);
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
    }, 500);

    onInvalidate(() => {
      clearInterval(getData);
    });
  }
});

const getItemTitle = (item: InstitutionsType) => {
  return `${item.acronym} - ${item.socialName}`;
};
</script>

<style scoped></style>
