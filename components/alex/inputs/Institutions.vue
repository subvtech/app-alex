<template>
  <v-autocomplete
    :name="name"
    v-model="value"
    :search="search"
    @input="$emit('update:search', $event.target.value)"
    :loading="fetching"
    :items="institutions"
    item-text="text"
    item-value="id"
    item-title="text"
    :color="color"
    class="my-3"
    variant="outlined"
    required
    :label="$t('pages.register.institution')"
    :error-messages="errorMessage"
  />
</template>

<script setup lang="ts">

import { useField } from 'vee-validate';

type InstitutionsType = {
  name: string;
  acronym: string;
  sector: string;
  id: number;
  cover: any;
};

const props = defineProps({
  search: {
    type: String,
    required: true,
  },
  institutions: {
    type: Array as PropType<InstitutionsType[]>,
    required: true,
  },
  name: {
    type: String,
    required: false,
  },
  color: {
    type: String,
    default: 'white',
  },
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
    const res = await find(
      `institutions?nome_contains=${institution}&tipo=matriz&_limit=10`,
    );

    const resultArr = (res.data.length > 0 ? res.data : []).map((r: any) => {
      return {
        id: r.id,
        acronym: r.attributes.acronym,
        text: r.attributes.name,
        type: r.attributes.type,
      };
    });
    emit('update:institutions', resultArr);
  } catch (error) {
    setMessage(i18n.t('pages.login.searchError'), 'red', true);
  } finally {
    fetching.value = false;
  }
};

watchEffect(async (onInvalidate) => {
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

watchEffect(() => {
  emit('update:value', value.value as number - 1);
});
</script>

<style scoped></style>
