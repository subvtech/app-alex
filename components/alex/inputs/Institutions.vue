<template>
  <v-autocomplete :name="name" v-model="value" :search="search" @input="$emit('update:search', $event.target.value)"
    :loading="fetching" :items="institutions" item-text="text" item-value="id" item-title="socialName" :color="color"
    class="my-3" variant="outlined"  required :label="$t('pages.register.institution')"
    :error-messages="errorMessage" />
</template>

<script setup lang="ts">
import { useField } from 'vee-validate';

type InstitutionsType = {
  socialName: string;
  acronym: string;
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
      `institutions`, 
      {
        fields: ['id', 'acronym', 'socialName'],
        filters: { $or: [{ socialName: { $containsi: institution } }, { acronym: { $containsi: institution } }] },
        pagination: {start: 0, limit: 10}
      }
    );

    const resultArr = (res.data.length > 0 ? res.data : [])
      .map((r: any) => {
        return {
          id: r.id,
          acronym: r.attributes.acronym,
          socialName: r.attributes?.socialName,
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

// watchEffect(() => {
//   emit('update:value', (value.value as number) - 1);
// });
</script>

<style scoped></style>
