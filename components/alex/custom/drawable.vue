<template>
  <v-navigation-drawer
    v-model="value"
    color="primary"
    fixed
    :rail="clipped"
    app
    data-testid="drawable"
    class="d-flex flex-column pb-2 px-2"
    :class="[
      notFixed ? 'not-fixed' : '',
      disappear && !modelValue ? 'disappear' : '',
    ]"
  >
    <slot name="header" />

    <div v-for="(block, i) in blocks" :key="`menu-${i}`">
      <v-list :key="`menu-${i}-list`" class="pa-0">
        <v-list-subheader
          :key="`menu-${i}`"
          class="accent-text pb-2"
          :class="
            clipped
              ? 'no-padding d-flex justify-center text-center align-center'
              : 'pl-4 pr-2 '
          "
          density="compact"
          nav
        >
          {{ clipped ? '...' : block.title }}
        </v-list-subheader>
        <v-list-item
          v-for="(item, j) in block.items"
          :key="`menu-${i}-item-${j}`"
          :to="item.to"
          class="rounded-lg"
          :class="clipped ? '' : 'px-4'"
          router
          density="compact"
          nav
          role="list-item"
        >
          <div class="d-flex align-center" style="gap: 16px">
            <v-list-item-action>
              <v-icon color="#d2d6da" role="icon">{{ item.icon }}</v-icon>
            </v-list-item-action>

            <v-list-item-title class="item-name font-weight-medium">{{
              item.title
            }}</v-list-item-title>
          </div>
        </v-list-item>
      </v-list>
    </div>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
const emit = defineEmits(['update:modelValue']);
type DrawableProps = {
  blocks: {
    title: string;
    items: { icon: string; title: string; to: string }[];
  }[];
  modelValue: boolean;
  notFixed?: boolean;
  disappear?: boolean;
  clipped?: boolean;
};
const props = withDefaults(defineProps<DrawableProps>(), {
  notFixed: false,
  clipped: false,
  disappear: false,
});

const value = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  },
});
</script>

<style lang="scss">
.not-fixed {
  position: static !important;
  translate: none !important;
}
.disappear {
  z-index: -50 !important;
  visibility: hidden !important;
  transition: visibility 0.5s ease-in;
  transition: translate 0.5s ease-in;
}

html,
body {
  .v-application {
    font-family: Sen !important;

    .v-navigation-drawer__content {
      -ms-overflow-style: none; /* IE and Edge */
      scrollbar-width: none; /* Firefox */
      gap: 24px;
      display: flex;
      flex-direction: column;
      &::-webkit-scrollbar {
        display: none;
      }

      .v-list-subheader {
        color: #00b7cc;
        min-height: unset !important;

        /* Body/P6 */
        font-size: 12px;
        font-weight: 700;
        line-height: 135%; /* 16.2px */
        letter-spacing: 0.48px;
      }

      .no-padding {
        padding-inline: 0px !important;
      }
    }

    .item-name {
      color: #d2d6da;

      font-size: 14px;
      font-style: normal;
      font-weight: 700;
      line-height: 135%; /* 18.9px */
      letter-spacing: 0.56px;
    }

    @media (max-width: 550px) {
      .v-toolbar__content {
        .user-block {
          .fullname {
            display: none;
          }
        }
      }
    }
  }

  @media (max-height: 700px) {
    .v-application {
      .v-navigation-drawer__content {
        gap: 17px;
      }

      .v-list-item {
        height: 46px !important;
        min-height: unset;
      }
    }
  }
}
</style>
