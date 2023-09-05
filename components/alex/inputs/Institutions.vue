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
    color="white"
    class="my-3 text-secondary"
    variant="outlined"
    required
    :label="$t('pages.register.institution')"
    :error-messages="errorMessage"
  />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useField } from 'vee-validate';

type InstitutionsType = {
  id: String;
  value: String;
  sigla: String;
  text: String;
  tipo: String;
};

const props = defineProps({
  search: {
    type: String,
    required: true,
  },
  institutions: {
    type: Object as PropType<InstitutionsType[]>,
    required: true,
  },
  name: {
    type: String,
    required: false,
  },
});
const emit = defineEmits(['update:institutions', 'update:search']);

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
        value: r.attributes.nome,
        sigla: r.attributes.sigla,
        text: r.attributes.nome,
        tipo: r.attributes.tipo,
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
</script>

<style scoped></style>
