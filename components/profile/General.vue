<template>
  <profile-card :title="$t('components.profile.general.title')">
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
              number: 20,
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
            <span>{{ box.label }}</span>
          </div>
        </div>
      </div>
    </template>

    <template v-slot:footer>
      <div class="d-flex flex-column contacts py-6">
        <div class="d-flex align-center contact">
          <v-icon color="#5D6872">mdi-email-outline</v-icon>
          <div class="d-flex flex-column justify-center align-start field">
            <p>{{ $t('components.profile.general.email') }}</p>
            <span>{{ email }}</span>
          </div>
        </div>
        <div v-if="telephone" class="d-flex align-center contact">
          <v-icon color="#5D6872">mdi-phone-outline</v-icon>
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

const { updateImage } = useUploadedImage();

const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  telephone: {
    type: String,
    required: true,
  },
  learningPlans: {
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

const { email, telephone, socials } = toRefs(props);

const newIcon = ref<string | null>(null);
const mask = new Mask({ mask: '(##) #####-####' });
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
      max-width: 123px;
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
          color: #001529;
        }

        span {
          font-size: 16px;
          font-weight: 400;
          line-height: 135%; /* 21.6px */
          letter-spacing: 0.32px;
          color: #a0a8b1;
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
          color: #6e7a87;
          font-size: 14px;
          font-weight: 400;
        }

        span {
          color: #6e7a87;
          font-size: 16px;
          font-weight: 400;
          line-height: 22px;
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
        padding-inline: 0px;
        padding-block: 0px;
        justify-content: center;
        align-items: center;
        :last-child {
          flex-direction: column-reverse;

          p {
            color: #abb2b9;
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
