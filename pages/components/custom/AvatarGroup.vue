<template>
  <v-container
    class="page rounded-lg bg-white pa-6 d-flex flex-column align-start pb-15"
  >
    <h1 class="text-h2 text-gray-800">AvatarGroup</h1>
    <p class="text-subtitle-2 text-gray-500">
      O componente
      <strong class="bg-accent pa-1 rounded">alex-custom-pagination</strong>
      é usado para separar agrupar outro componente chamado Avatar
    </p>
    <div class="d-flex align-center pa-4 container rounded-lg">
      <img class="align-self-stretch" src="@/assets/svg/vuetify.svg" />
      <div>
        <p class="text-body-1 text-primary align-self-stretch">
          Esse componente utiliza a estrutura do Vuetify, acesse ele a partir
          desse link e veja mais informações.<br />
        </p>
        <a
          class="text-decoration-underline text-blue"
          href="https://vuetifyjs.com/en/components/avatars/"
          target="_blank"
          >vuetifyjs.com</a
        >
      </div>
    </div>
    <h2 class="text-h3 text-gray-800">Uso do Componente</h2>
    <p class="text-subtitle-2 text-gray-500">
      o componente tem basicamente quatro propriedades principais que são
      <strong>order</strong>, <strong>size</strong>, <strong>max</strong> e
      <strong>people</strong>.
    </p>
    <div class="d-flex w-100 justify-space-evenly flex-column flex-sm-row">
      <div class="w-100">
        <p class="text-h5 text-center">Props do componente</p>
        <v-table variant="outline">
          <thead>
            <tr>
              <th>Propriedade</th>
              <th>Tipo</th>
              <th>Obrigatório</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>people</td>
              <td>person[]</td>
              <td class="text-center">
                <v-icon icon="mdi-checkbox-marked" color="success" />
              </td>
            </tr>
            <tr>
              <td>order</td>
              <td>'FIRST_ON_TOP' | 'LAST_ON_TOP'</td>
              <td class="text-center">
                <v-icon icon="mdi-close-box" color="error" />
              </td>
            </tr>
            <tr>
              <td>size</td>
              <td>number</td>
              <td class="text-center">
                <v-icon icon="mdi-close-box" color="error" />
              </td>
            </tr>
            <tr>
              <td>max</td>
              <td>number</td>
              <td class="text-center">
                <v-icon icon="mdi-close-box" color="error" />
              </td>
            </tr>
          </tbody>
        </v-table>
      </div>
    </div>
    <div class="w-100">
      <p class="text-h5 text-center">Tipo Person</p>
      <v-table variant="outline">
        <thead>
          <tr>
            <th>Propriedade</th>
            <th>Tipo</th>
            <th>Obrigatório</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>name</td>
            <td>string</td>
            <td class="text-center">
              <v-icon icon="mdi-checkbox-marked" color="success" />
            </td>
          </tr>
          <tr>
            <td>image</td>
            <td>{ url: string; alt?: string; }</td>
            <td class="text-center">
              <v-icon icon="mdi-close-box" color="error" />
            </td>
          </tr>
        </tbody>
      </v-table>
    </div>
    <div class="d-flex w-100 gap-4 pa-4 rounded-lg flex-column align-center">
      <alex-custom-avatar-group
        :size="36"
        :people="[
          {
            name: 'Jorge Lima',
            image: {
              url: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Woman_at_Lover%27s_Bridge_Tanjung_Sepat_%28cropped%29.jpg',
            },
          },
          {
            name: 'Jorge Lima',
            image: {
              url: 'https://plus.unsplash.com/premium_photo-1675080431524-3e7c85323972?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bWFuJTIwZmFjZXxlbnwwfHwwfHx8MA%3D%3D',
            },
          },
          {
            name: 'Jorge Lima',
          },
          {
            name: 'Jorge Lima',
            image: {
              url: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Woman_at_Lover%27s_Bridge_Tanjung_Sepat_%28cropped%29.jpg',
            },
          },
          {
            name: 'Jorge Lima',
            image: {
              url: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Woman_at_Lover%27s_Bridge_Tanjung_Sepat_%28cropped%29.jpg',
            },
          },
          {
            name: 'Jorge Lima',
            image: {
              url: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Woman_at_Lover%27s_Bridge_Tanjung_Sepat_%28cropped%29.jpg',
            },
          },
        ]"
      />
      <alex-custom-avatar-group
        :size="36"
        :people="[
          {
            name: 'Jorge Lima',
            image: {
              url: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Woman_at_Lover%27s_Bridge_Tanjung_Sepat_%28cropped%29.jpg',
            },
          },
          {
            name: 'Jorge Lima',
            image: {
              url: 'https://plus.unsplash.com/premium_photo-1675080431524-3e7c85323972?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bWFuJTIwZmFjZXxlbnwwfHwwfHx8MA%3D%3D',
            },
          },
          {
            name: 'Jorge Lima',
          },
        ]"
      />
    </div>
    <div class="w-100">
      <div class="bg-grey-lighten-5 pa-3" style="position: relative">
        <prism class="bg-grey-lighten-5">
          {{ firstExampleTemplate }}
        </prism>
        <v-btn
          class="copy-icon"
          variant="text"
          color="gray-400"
          @click="copyToClipboard(firstExampleTemplate, 'firstTemplate')"
        >
          <v-icon
            v-if="copiedValue == 'firstTemplate'"
            size="x-large"
            icon="mdi-clipboard-check-multiple-outline"
            color="green-lighten-1"
          />
          <v-icon v-else size="x-large" icon="mdi-content-copy" />
        </v-btn>
      </div>
    </div>
    <h2 class="text-h3 text-gray-800">Ordem</h2>
    <p class="text-subtitle-2 text-gray-500">
      O componente pode ser ordenado de duas formas, ou com o primeiro avatar no
      topo ("FIRST_ON_TOP") e os outros embaixo dele. Ou o último avatar no topo
      ("LAST_ON_TOP") e os outros embaixo dele, esse último é o padrão do
      componente.
    </p>

    <div class="d-flex w-100 gap-4 pa-4 rounded-lg flex-column align-center">
      <alex-custom-avatar-group
        :size="36"
        order="FIRST_ON_TOP"
        :people="[
          {
            name: 'Jorge Lima',
            image: {
              url: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Woman_at_Lover%27s_Bridge_Tanjung_Sepat_%28cropped%29.jpg',
            },
          },
          {
            name: 'Jorge Lima',
            image: {
              url: 'https://plus.unsplash.com/premium_photo-1675080431524-3e7c85323972?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bWFuJTIwZmFjZXxlbnwwfHwwfHx8MA%3D%3D',
            },
          },
          {
            name: 'Jorge Lima',
          },
          {
            name: 'Jorge Lima',
            image: {
              url: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Woman_at_Lover%27s_Bridge_Tanjung_Sepat_%28cropped%29.jpg',
            },
          },
          {
            name: 'Jorge Lima',
            image: {
              url: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Woman_at_Lover%27s_Bridge_Tanjung_Sepat_%28cropped%29.jpg',
            },
          },
          {
            name: 'Jorge Lima',
            image: {
              url: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Woman_at_Lover%27s_Bridge_Tanjung_Sepat_%28cropped%29.jpg',
            },
          },
        ]"
      />
      <alex-custom-avatar-group
        :size="36"
        :people="[
          {
            name: 'Jorge Lima',
            image: {
              url: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Woman_at_Lover%27s_Bridge_Tanjung_Sepat_%28cropped%29.jpg',
            },
          },
          {
            name: 'Jorge Lima',
            image: {
              url: 'https://plus.unsplash.com/premium_photo-1675080431524-3e7c85323972?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bWFuJTIwZmFjZXxlbnwwfHwwfHx8MA%3D%3D',
            },
          },
          {
            name: 'Jorge Lima',
          },
          {
            name: 'Jorge Lima',
            image: {
              url: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Woman_at_Lover%27s_Bridge_Tanjung_Sepat_%28cropped%29.jpg',
            },
          },
          {
            name: 'Jorge Lima',
            image: {
              url: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Woman_at_Lover%27s_Bridge_Tanjung_Sepat_%28cropped%29.jpg',
            },
          },
          {
            name: 'Jorge Lima',
            image: {
              url: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Woman_at_Lover%27s_Bridge_Tanjung_Sepat_%28cropped%29.jpg',
            },
          },
        ]"
      />
    </div>
    <div class="w-100">
      <div class="bg-grey-lighten-5 pa-3" style="position: relative">
        <prism class="bg-grey-lighten-5">
          {{ secondExampleTemplate }}
        </prism>
        <v-btn
          class="copy-icon"
          variant="text"
          color="gray-400"
          @click="copyToClipboard(secondExampleTemplate, 'firstTemplate')"
        >
          <v-icon
            v-if="copiedValue == 'firstTemplate'"
            size="x-large"
            icon="mdi-clipboard-check-multiple-outline"
            color="green-lighten-1"
          />
          <v-icon v-else size="x-large" icon="mdi-content-copy" />
        </v-btn>
      </div>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import 'prismjs';
import 'prismjs/themes/prism.css';
import Prism from 'vue-prism-component';
const firstExampleTemplate = ref(` <alex-custom-avatar-group
        :size="36"
        :people="[
          {
            name: 'Jorge Lima',
            image: {
              url: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Woman_at_Lover%27s_Bridge_Tanjung_Sepat_%28cropped%29.jpg',
            },
          },
          {
            name: 'Jorge Lima',
            image: {
              url: 'https://plus.unsplash.com/premium_photo-1675080431524-3e7c85323972?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bWFuJTIwZmFjZXxlbnwwfHwwfHx8MA%3D%3D',
            },
          },
          {
            name: 'Jorge Lima',
          },
          {
            name: 'Jorge Lima',
            image: {
              url: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Woman_at_Lover%27s_Bridge_Tanjung_Sepat_%28cropped%29.jpg',
            },
          },
          {
            name: 'Jorge Lima',
            image: {
              url: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Woman_at_Lover%27s_Bridge_Tanjung_Sepat_%28cropped%29.jpg',
            },
          },
          {
            name: 'Jorge Lima',
            image: {
              url: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Woman_at_Lover%27s_Bridge_Tanjung_Sepat_%28cropped%29.jpg',
            },
          },
        ]"
      />
      <alex-custom-avatar-group
        :size="36"
        :people="[
          {
            name: 'Jorge Lima',
            image: {
              url: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Woman_at_Lover%27s_Bridge_Tanjung_Sepat_%28cropped%29.jpg',
            },
          },
          {
            name: 'Jorge Lima',
            image: {
              url: 'https://plus.unsplash.com/premium_photo-1675080431524-3e7c85323972?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bWFuJTIwZmFjZXxlbnwwfHwwfHx8MA%3D%3D',
            },
          },
          {
            name: 'Jorge Lima',
          },
        ]"
      />`);
const secondExampleTemplate = ref(` <alex-custom-avatar-group
        :size="36"
        order="FIRST_ON_TOP"
        :people="[
          {
            name: 'Jorge Lima',
            image: {
              url: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Woman_at_Lover%27s_Bridge_Tanjung_Sepat_%28cropped%29.jpg',
            },
          },
          {
            name: 'Jorge Lima',
            image: {
              url: 'https://plus.unsplash.com/premium_photo-1675080431524-3e7c85323972?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bWFuJTIwZmFjZXxlbnwwfHwwfHx8MA%3D%3D',
            },
          },
          {
            name: 'Jorge Lima',
          },
          {
            name: 'Jorge Lima',
            image: {
              url: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Woman_at_Lover%27s_Bridge_Tanjung_Sepat_%28cropped%29.jpg',
            },
          },
          {
            name: 'Jorge Lima',
            image: {
              url: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Woman_at_Lover%27s_Bridge_Tanjung_Sepat_%28cropped%29.jpg',
            },
          },
          {
            name: 'Jorge Lima',
            image: {
              url: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Woman_at_Lover%27s_Bridge_Tanjung_Sepat_%28cropped%29.jpg',
            },
          },
        ]"
      />
      <alex-custom-avatar-group
        :size="36"
        :people="[
          {
            name: 'Jorge Lima',
            image: {
              url: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Woman_at_Lover%27s_Bridge_Tanjung_Sepat_%28cropped%29.jpg',
            },
          },
          {
            name: 'Jorge Lima',
            image: {
              url: 'https://plus.unsplash.com/premium_photo-1675080431524-3e7c85323972?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bWFuJTIwZmFjZXxlbnwwfHwwfHx8MA%3D%3D',
            },
          },
          {
            name: 'Jorge Lima',
          },
          {
            name: 'Jorge Lima',
            image: {
              url: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Woman_at_Lover%27s_Bridge_Tanjung_Sepat_%28cropped%29.jpg',
            },
          },
          {
            name: 'Jorge Lima',
            image: {
              url: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Woman_at_Lover%27s_Bridge_Tanjung_Sepat_%28cropped%29.jpg',
            },
          },
          {
            name: 'Jorge Lima',
            image: {
              url: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Woman_at_Lover%27s_Bridge_Tanjung_Sepat_%28cropped%29.jpg',
            },
          },
        ]"
      />`);
const copiedValue = ref('');
const copyToClipboard = async (message, item) => {
  try {
    await navigator.clipboard.writeText(message);
    copiedValue.value = item;
  } catch (err) {
    copiedValue.value = item;
  }
};
</script>

<style>
.container {
  border: 1px solid #a0a8b1;
  gap: 16px;
  align-self: stretch;
}

.align-self-stretch {
  align-self: stretch;
}

.page {
  max-width: 1200px;
  gap: 40px;
}

.copy-icon {
  position: absolute;
  right: 24px;
  top: 24px;
  color: #a0a8b1;
}
</style>
