<template>
  <v-row justify="center">
    <v-img
      class="rounded elevation-1"
      :src="imageUrl"
      width="75px"
      height="75px"
      max-height="75px"
      max-width="75px"
    />
    <v-file-input
      ref="uploader"
      v-model="image"
      accept="image/png, image/jpeg"
      style="display: none"
      :clearable="false"
      @change="emit('input', image)"
    />
    <v-col cols="12" class="text-center text-caption pb-0">
      Somente imagens do tipo JPG, JPEG ou PNG são permitidos.
    </v-col>
    <v-col cols="12" class="pt-0">
      <v-btn
        class="rounded-xl"
        color="accent"
        width="100%"
        @click="clickUploadBtn"
      >
        Alterar capa
      </v-btn>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
const props = defineProps(['value']);
const { value } = toRefs(props);

const emit = defineEmits(['input']);

const image = ref();
const uploader = ref();

const imageUrl = computed(() => {
  return image.value
    ? URL.createObjectURL(image.value)
    : '/images/not-found.png';
});

onMounted(() => {
  if (value) image.value = value.value;
});

watch(
  () => value,
  () => {
    if (value) image.value = value.value;
  },
);

const clickUploadBtn = () => {
  uploader.value.input.click();
};
</script>
<style scoped lang="scss"></style>
