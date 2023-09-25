<template>
  <profile-card
    class="mt-6"
    :title="$t('components.projects.title')"
    :full-width="true"
  >
    <template v-slot:content>
      <div class="d-flex mb-6">
        <div class="d-flex flex-wrap align-center py-2 px-3 search">
          <v-icon color="#5D6872">mdi-magnify</v-icon>
          <input type="text" :placeholder="$t('components.projects.search')" />
        </div>
        <div class="d-flex align-center py-2 px-3 justify-space-between filter">
          <p>{{ $t('components.projects.ongoing') }}</p>
          <v-icon color="#5D6872">mdi-chevron-down</v-icon>
        </div>
      </div>

      <div class="d-flex flex-wrap items">
        <div
          class="d-flex flex-column align-start item"
          v-for="item in [
            {
              title: 'Gerenciamento de projetos de redes de computadores',
              description:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent ultricies ligula quis tincidunt consectetur. Fusce sodales tortor nisi, et fermentum orci tincidunt vel. Sed molestie massa ipsum, sed fermentum libero iaculis malesuada. Duis tincidunt venenatis dictum. Pellentesque pulvinar arcu et turpis rhoncus lobortis. Ut congue purus at nisl tincidunt vulputate. Nullam vitae varius dui. Cras ultrices efficitur ante quis volutpat. In cursus, elit ac eleifend blandit, enim magna gravida tellus, ac malesuada augue libero et leo. Nulla vehicula nunc sed luctus vehicula. Ut posuere fermentum faucibus. Duis nibh elit, ornare ac est nec, tincidunt ultricies est. Fusce non interdum nulla, eleifend ornare orci. Curabitur felis sem, egestas ut tortor at, aliquet tincidunt odio. Praesent rutrum mi elit, at iaculis urna auctor eget. Pellentesque rhoncus metus felis, id pharetra magna tristique quis. Mauris in egestas nulla. Mauris justo sem, sodales id nunc vel, varius semper enim. Curabitur egestas nisi vel lacus facilisis, eu consequat eros luctus.Cras vehicula, dolor eget ullamcorper mollis, augue lectus feugiat nisl, et malesuada neque arcu eu arcu. Quisque vel felis quis orci blandit euismod. Nunc auctor nisl neque, et faucibus elit tempor eget. Vivamus consequat mollis molestie. Suspendisse facilisis, turpis nec sodales bibendum, turpis dolor feugiat arcu, vel gravida turpis ligula eget erat. Suspendisse sapien massa, dignissim aliquet ullamcorper id, accumsan ac lacus. Suspendisse a faucibus tortor. Curabitur tristique convallis varius. Cras a massa sollicitudin, commodo nulla vitae, ullamcorper erat.',
              tags: ['Liderança', 'Liderança', 'Liderança', 'Liderança'],
              trails: 4,
              username: 'Carlos de Andrade',
            },
            {
              title: 'Gerenciamento de projetos de redes de computadores',
              description:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent ultricies ligula quis tincidunt consectetur. Fusce sodales tortor nisi, et fermentum orci tincidunt vel. Sed molestie massa ipsum, sed fermentum libero iaculis malesuada. Duis tincidunt venenatis dictum. Pellentesque pulvinar arcu et turpis rhoncus lobortis. Ut congue purus at nisl tincidunt vulputate. Nullam vitae varius dui. Cras ultrices efficitur ante quis volutpat. In cursus, elit ac eleifend blandit, enim magna gravida tellus, ac malesuada augue libero et leo. Nulla vehicula nunc sed luctus vehicula. Ut posuere fermentum faucibus. Duis nibh elit, ornare ac est nec, tincidunt ultricies est. Fusce non interdum nulla, eleifend ornare orci. Curabitur felis sem, egestas ut tortor at, aliquet tincidunt odio. Praesent rutrum mi elit, at iaculis urna auctor eget. Pellentesque rhoncus metus felis, id pharetra magna tristique quis. Mauris in egestas nulla. Mauris justo sem, sodales id nunc vel, varius semper enim. Curabitur egestas nisi vel lacus facilisis, eu consequat eros luctus.Cras vehicula, dolor eget ullamcorper mollis, augue lectus feugiat nisl, et malesuada neque arcu eu arcu. Quisque vel felis quis orci blandit euismod. Nunc auctor nisl neque, et faucibus elit tempor eget. Vivamus consequat mollis molestie. Suspendisse facilisis, turpis nec sodales bibendum, turpis dolor feugiat arcu, vel gravida turpis ligula eget erat. Suspendisse sapien massa, dignissim aliquet ullamcorper id, accumsan ac lacus. Suspendisse a faucibus tortor. Curabitur tristique convallis varius. Cras a massa sollicitudin, commodo nulla vitae, ullamcorper erat.',
              tags: ['Liderança', 'Liderança', 'Liderança', 'Liderança'],
              trails: 4,
              username: 'Carlos de Andrade',
            },
          ]"
        >
          <img
            class="w-100"
            src="https://picsum.photos/900/900"
            :alt="item.title"
          />
          <div class="d-flex w-100 h-100 flex-column pa-4">
            <div class="tags d-flex flex-row flex-wrap justify-center">
              <span
                class="d-flex justify-center align-center px-4"
                v-for="tag in item.tags"
                >{{ tag }}</span
              >
            </div>
            <div class="d-flex flex-column w-100 pt-4 text-block">
              <span>{{ item.title }}</span>
              <p class="pt-2">
                {{ item.description.replace(/[\r\n]/gm, '') }}
              </p>
            </div>
            <div class="footer d-flex pt-6">
              <div class="block d-flex align-center">
                <div class="icon d-flex justify-center align-center pa-2">
                  <v-icon size="x-small" color="#ABB2B9"
                    >mdi-account-multiple-outline</v-icon
                  >
                </div>
                <div class="d-flex flex-column">
                  <span>{{ $t('components.projects.facilitator') }}</span>
                  <p>{{ item.username }}</p>
                </div>
              </div>

              <div class="block d-flex align-center">
                <div class="icon d-flex justify-center align-center pa-2">
                  <v-icon size="x-small" color="#ABB2B9"
                    >mdi-chart-timeline-variant</v-icon
                  >
                </div>

                <div class="d-flex flex-column">
                  <span>{{ $t('components.projects.trails') }}</span>
                  <p>{{ item.trails }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </profile-card>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.search {
  border: 1px solid #abb2b9;
  border-radius: 8px;

  width: 400px;
  input {
    margin-left: 8px;
    color: #abb2b9;
    font-size: 14px;
    font-weight: 400;
  }
}

.filter {
  border: 1px solid #abb2b9;
  border-radius: 8px;
  margin-left: 16px;
  width: 180px;
  cursor: pointer;

  p {
    color: #5d6872;
    font-size: 14px;
    font-weight: 400;
  }
}
.items {
  gap: 32px;
  .item {
    border-radius: 8px;
    border: 1px solid #eaeef1;
    background: #fff;

    min-width: 350px;
    max-width: 400px;

    .tags {
      gap: 8px;
      span {
        color: #5d6872;
        font-family: Montserrat;
        font-size: 10px;
        font-weight: 500;

        height: 20px;
        padding-block: 10px;
        gap: 4px;
        border-radius: 99px;
        border: 1px solid #abb2b9;
      }
    }

    img {
      height: 280px;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
    }
    .text-block {
      white-space: pre-line;
      word-wrap: break-word;

      span {
        overflow: hidden;
        color: #001529;
        text-overflow: ellipsis;

        font-size: 18px;
        font-weight: 700;
        line-height: 24px; /* 133.333% */
      }

      p {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;

        overflow: hidden;
        text-overflow: ellipsis;

        color: #5d6872;
        font-size: 14px;
        font-weight: 400;
        line-height: 20px; /* 142.857% */
      }
    }

    .footer {
      gap: 32px;
      .block {
        gap: 8px;
        .icon {
          border-radius: 8px;
          border: 1px solid #9da4aa;
        }

        span {
          color: #5d6872;
          font-size: 14px;
          font-weight: 700;
        }

        p {
          color: #abb2b9;
          font-size: 14px;
          font-weight: 400;
        }
      }
    }
  }
}
</style>
