<template>
  <v-row
    align="center"
    dense
    class="px-0"
    style="z-index: 2; position: relative"
  >
    <v-menu
      offset-y
      open-on-hover
      :z-index="2"
      style="z-index: 2; position: relative"
    >
      <template #activator="{ isActive, props }">
        <div v-bind="props" v-on="isActive">
          <v-badge
            :content="`+${coAuthors.length}`"
            :value="coAuthors.length"
            color="accent"
            bordered
            overlap
          >
            <app-user-avatar :user="author.attributes" />
          </v-badge>
        </div>
      </template>
      <v-container fluid color="white" style="z-index: 2">
        <v-row>
          <v-col cols="12">
            <app-user-avatar :user="author.attributes" />
            <span> {{ author.attributes.fullname }} </span>
          </v-col>
          <v-col
            v-for="(coauthor, i) in coAuthors"
            :key="`coauthor-avatar-${i}`"
            cols="12"
          >
            <app-user-avatar :user="coauthor.attributes" />
            <span> {{ coauthor.attributes.fullname }} </span>
          </v-col>
        </v-row>
      </v-container>
    </v-menu>
    <v-col cols="8" class="ml-1">
      <div class="avatar-info-section">
        <p>
          {{ author.attributes.fullname + coAuthorsText(coAuthors) }}
        </p>
        <div style="display: flex">
          <span>
            {{
              $t('components.learningPlan.authors.updatedAt', {
                date: new Date(
                  structure.attributes.updatedAt,
                ).toLocaleDateString('pt-BR'),
              })
            }}</span
          >
        </div>
      </div>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { Strapi4ResponseData } from '@nuxtjs/strapi/dist/runtime/types';
import { User } from '~/models/user.model';
import { Structure } from '~/models/structure.model';

const i18n = useI18n();

const props2 = defineProps({
  structure: {
    type: Object as PropType<Strapi4ResponseData<Structure>>,
    required: true,
  },
  author: {
    type: Object as PropType<Strapi4ResponseData<User>>,
    required: true,
  },
  coAuthors: {
    type: Array as PropType<Strapi4ResponseData<User>[]>,
    default: () => [],
  },
});

const coAuthorsText = (coAuthors) => {
  if (coAuthors.length < 1) {
    return '';
  } else if (coAuthors.length > 1) {
    return i18n.t('components.learningPlan.authors.coauthors', { length: coAuthors.length });
  } else {
    return i18n.t('components.learningPlan.authors.coauthor', { length: coAuthors.length });
  }
};
</script>
<style lang="scss" scoped>
.avatar-info-section {
  margin-left: 8px;

  p {
    font-size: 14px;
    font-weight: 500;
    margin: 0;
  }

  span {
    font-size: 13px;
  }
}
</style>
