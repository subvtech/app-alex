<template>
  <v-card
    class="container-grid pt-8 pb-6 px-4"
    :width="300"
    height="227px"
    elevation="0"
    rounded="lg"
    variant="outlined"
    color="gray-100"
  >
    <alex-custom-skeleton color="gray-100" class="w-100 height-20 banner" />
    <div class="content">
      <alex-custom-skeleton
        color="gray-200"
        class="width-20 height-20 absolute"
        rounded="pill"
      />
      <alex-custom-skeleton
        color="gray-200"
        class="width-20 height-4 absolute"
        rounded="sm"
      />
      <alex-custom-skeleton
        color="gray-200"
        class="width-40 height-8 absolute"
        rounded="lg"
      />
    </div>
  </v-card>
</template>
<style lang="scss" scoped>
.banner {
  position: absolute;
  top: 0;
  left: 0;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
}
</style>
