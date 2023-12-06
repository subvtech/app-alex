<template>
  <alex-custom-card
    :title="$t('components.profile.general.title')"
    @toggle:isEditing="isEditing = !isEditing"
  >
    <template v-slot:content>
      <app-general-boxes
        :boxes="[
          {
            icon: 'mdi-bookmark-box-multiple-outline',
            number: learningPlans.length,
            label: 'courses',
          },
          {
            icon: 'mdi-newspaper-variant-multiple-outline',
            number: projects.length,
            label: 'projects',
          },
          {
            icon: 'mdi-check-decagram',
            number: 62,
            label: 'assignments',
          },
        ]"
      />
    </template>

    <template v-slot:footer>
      <div class="d-flex flex-column contacts pt-6">
        <div class="d-flex align-center contact">
          <v-icon color="#6E7A87">mdi-email-outline</v-icon>
          <div class="d-flex flex-column justify-center align-start field">
            <p>{{ $t('components.profile.general.email') }}</p>
            <span>{{ email }}</span>
          </div>
        </div>
        <div v-if="telephone" class="d-flex align-center contact">
          <v-icon color="#6E7A87">mdi-phone-outline</v-icon>
          <div class="d-flex flex-column justify-center align-start field">
            <p>{{ $t('components.profile.general.telephone') }}</p>
            <span>{{ mask.masked(telephone) }}</span>
          </div>
        </div>
      </div>
    </template>
  </alex-custom-card>
</template>

<script setup lang="ts">
import { Mask } from 'maska';

const props = defineProps({
  userId: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  telephone: {
    type: String,
  },
  learningPlans: {
    type: Array,
    default: () => [],
  },
  projects: {
    type: Array,
    default: () => [],
  },
  socials: {
    type: Array as PropType<any[]>,
    required: true,
  },
  canEdit: {
    type: Boolean,
    default: false,
  },
});

const { email, telephone } = toRefs(props);

const mask = new Mask({ mask: '(##) #####-####' });
const isEditing = ref(false);

onBeforeMount(() => {
  
})
</script>

<style scoped lang="scss">
#Card {
  min-width: 450px;

  .contacts {
    gap: 16px;
    //border-bottom: 1px solid #eaeef1;
    flex-direction: column;

    .contact {
      gap: 16px;

      .field {
        p {
          color: #a0a8b1;

          font-size: 14px;
          font-weight: 400;
          line-height: 135%; /* 18.9px */
          letter-spacing: 0.56px;
        }

        span {
          color: #6e7a87;

          font-size: 16px;
          font-weight: 400;
          line-height: 135%; /* 21.6px */
          letter-spacing: 0.64px;
          text-decoration: none;
        }
      }
    }
  }
  @media (max-width: 950px) {
    min-width: 380px;
  }

  @media (max-width: 450px) {
    min-width: 0px;
    .boxes {
      flex-direction: column;
      align-items: center;
      .box {
        flex-direction: row;
        width: 100%;
        max-width: none;
        padding-inline: 16px;
        padding-block: 0px;
        align-items: center;
        :last-child {
          flex-direction: row;
          align-items: center;
          gap: 8px;

          p {
            color: #0d4173;
            font-size: 14px;
            font-weight: 400;
          }

          span {
            color: #5d6872;
            font-size: 16px;
            font-weight: 700;
            line-height: 22px;
          }
        }
      }
    }
  }
}
</style>
