<template>
  <profile-card
    :title="$t('components.profile.general.title')"
    :isEditing="false"
    :showIcon="false"
    @toggle:isEditing="isEditing = !isEditing"
  >
    <template v-slot:content>
      <div class="boxes d-flex justify-center w-100 pb-6">
        <div
          class="box d-flex"
          v-for="box in [
            {
              icon: 'mdi-bookmark-box-multiple-outline',
              number: learningPlans.length,
              label: $t('components.profile.general.courses'),
            },
            {
              icon: 'mdi-newspaper-variant-multiple-outline',
              number: projects.length,
              label: $t('components.profile.general.projects'),
            },
            {
              icon: 'mdi-check-decagram',
              number: 62,
              label: $t('components.profile.general.assignments'),
            },
          ]"
        >
          <v-icon color="#00B8CC">{{ box.icon }}</v-icon>
          <div class="d-flex">
            <h6>{{ box.number }}</h6>
            <p>{{ box.label }}</p>
          </div>
        </div>
      </div>
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
  </profile-card>
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
</script>

<style scoped lang="scss">
#Card {
  min-width: 450px;

  .boxes {
    gap: 16px;
    border-bottom: 1px solid #eaeef1;
    .box {
      flex-direction: column;
      min-width: 90px;
      min-height: 90px;
      width: 33%;
      gap: 16px;
      padding-inline: 16px;
      padding-block: 16px;
      align-items: flex-start;
      border-radius: 8px;
      border: 1px solid #e1e4e7;
      background-color: #f1f5f9;

      :last-child {
        flex-direction: column;

        h6 {
          font-size: 24px;
          color: #0d4173;
        }

        p {
          color: #a0a8b1 !important;
          font-size: 16px !important;
          font-style: normal;
          font-weight: 400 !important;
          line-height: 135%; /* 21.6px */
          letter-spacing: 0.64px;
        }
      }
    }
  }
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
