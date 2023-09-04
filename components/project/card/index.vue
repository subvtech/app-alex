<template>
  <v-hover v-slot="{ props, isHovering }">
    <v-card
      max-width="350"
      width="350"
      rounded="lg"
      flat
      style="gap: 16px; cursor: pointer; outline: 1px solid #0005"
      v-bind="props"
      @click="onClick"
    >
      <v-img
        src="https://media.istockphoto.com/id/1299692886/vector/project-management-word-concept-banner.jpg?s=170667a&w=0&k=20&c=hJZ9a8HFee2s6aBubEkMeEy8NeoPPlvlOnme18eBJCc="
        height="200px"
        class="rounded-lg"
        cover
        :class="`${isHovering && 'img-hovered'}`"
      />

      <v-menu v-bind="props">
        <template #activator="{ props, isActive }">
          <v-btn
            v-bind="props"
            icon="mdi-cog"
            rounded="lg"
            color="gray-blue"
            flat
            :class="`menu-settings ${!isHovering && !isActive && 'hidden'}`"
          />
        </template>
        <v-list>
          <v-list-item title="Ocultar" class="mx-0">
            <template #prepend>
              <v-icon
                size="small"
                variant="text"
                icon="mdi-eye"
                class="mr-4"
              ></v-icon>
            </template>
          </v-list-item>
          <v-list-item title="Editar" :to="`/projects/${id}`" class="mx-0">
            <template #prepend>
              <v-icon
                size="small"
                variant="text"
                icon="mdi-pencil"
                class="mr-4"
              ></v-icon>
            </template>
          </v-list-item>
        </v-list>
      </v-menu>

      <div class="px-5 pb-8 pt-5 d-flex flex-column" style="gap: 16px">
        <v-chip-group class="py-0">
          <v-chip
            v-for="chip in keyWords"
            :key="chip"
            :text="chip"
            color="secondary"
            size="small"
            variant="outlined"
            :ripple="false"
          />
        </v-chip-group>
        <v-card-item class="pa-0">
          <v-card-title
            class="text-h6 font-weight-bold pa-0 v-card-title pb-2"
            style="white-space: normal"
            title="teste"
          >
            {{ title }}
          </v-card-title>

          <v-card-subtitle class="mutipleLines pa-0">
            {{ subtitle }}
          </v-card-subtitle>
        </v-card-item>

        <v-container class="pa-0">
          <v-row>
            <v-col>
              <ProjectCardIcon
                title="Trilhas"
                :subtitle="trailsCount"
                icon="alex:trail"
              /> </v-col
            ><v-col>
              <ProjectCardIcon
                title="Facilitador"
                subtitle="Glevson"
                icon="mdi-chevron-right"
              />
            </v-col>
          </v-row>
        </v-container>
      </div>
    </v-card>
  </v-hover>
</template>

<script setup lang="ts">
const { push } = useRouter();
const props = defineProps<{
  id: string | number;
  title: string;
  subtitle: string;
  keyWords: string[];
  facilitator: string;
  trailsCount: number;
}>();

const onClick = () => {
  // @ts-ignore
  push(`/projects/${props.id}`);
};
</script>

<style scoped>
.mutipleLines {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
}

.v-card-title {
  font-size: 18px !important;
  line-height: 24px;
}

.gap-2 {
  gap: 8px;
}

.gap-4 {
  gap: 16px;
}

.menu-settings {
  position: absolute;
  top: 16px;
  right: 16px;
}

.hidden {
  opacity: 0;
  pointer-events: none;
  user-select: none;
}

.img-hovered {
  filter: brightness(80%);
}
</style>
