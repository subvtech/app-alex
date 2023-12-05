<template>
  <v-autocomplete :name="name" v-model="value" :search="search" @input="$emit('update:search', $event.target.value)"
    :loading="fetching" :items="institutions" item-text="text" item-value="id" item-title="socialName" :color="color"
    class="my-3" variant="outlined" hide-no-data required :label="$t('pages.register.institution')"
    :error-messages="errorMessage" />
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

  filterIds: {
    type: Array as PropType<Number[]>,
    default: [],
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
      `institutions?tipo=matriz&_limit=10`, {
        fields: ['id', 'acronym', 'socialName'],
      filters: { $or: [{ socialName: { $contains: institution } }, { acronym: { $contains: institution } }] }
    }
    ); // olha aqui: https://docs.strapi.io/dev-docs/api/entity-service/filter#contains

    const resultArr = (res.data.length > 0 ? res.data : [])
      //.filter((r: any) => !props.filterIds.includes(r.id))
      .map((r: any) => {
        return {
          id: r.id,
          acronym: r.attributes.acronym,
          socialName: r.attributes?.socialName,
          // type: r.attributes.type?.attributes,
          // cover: r.attributes.cover?.data?.attributes,
          // cnpj: r.attributes.cnpj,
          // sector: r.attributes?.sector?.attributes,
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
  emit('update:value', (value.value as number) - 1);
});
</script>

<style scoped></style>
