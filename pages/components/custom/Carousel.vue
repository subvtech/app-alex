<template>
  <v-container
    class="page rounded-lg bg-white pa-8 d-flex flex-column align-start pb-15"
  >
    <h1 class="text-h2 text-gray-800">Carousel</h1>
    <p class="text-subtitle-2 text-gray-500">
      O
      <strong class="bg-accent pa-1 rounded">alex-custom-carousel</strong>
      é um componente para exibir uma lista de itens em formato de carrossel,
      ele suporta imagens e vídeos, seja através de um link ou de um arquivo, o
      usuário pode adicionar, remover e editar a ordem dos slides
    </p>
    <div class="d-flex align-center pa-4 container rounded-lg">
      <div>
        <p class="text-body-1 text-primary align-self-stretch">
          Esse componente utiliza a estrutura de outros componentes alex, como
          accordion, dialog, texfield,
          <a
            class="text-decoration-underline text-blue"
            href="https://antoniandre.github.io/vueper-slides/"
            target="_blank"
            >VueperSlides</a
          >
          e do
          <a
            class="text-decoration-underline text-blue"
            href="https://videojs.com"
            target="_blank"
            >VideoJs</a
          >
        </p>
      </div>
    </div>
    <h2 class="text-h3 text-gray-800">Uso do Componente</h2>
    <p class="text-subtitle-2 text-gray-500">
      O componente pode ser utilizado como apenas um carrossel de imagens fixas
      ou como um carousel totalmente editável, onde o usuário pode adicionar,
      remover e editar os slides, para o primeiro caso basta passar um array
      <strong>slides</strong> com as imagens em conjunto com a propriedade
      <strong>readonly</strong>, para o segundo caso deve-se utilizar um array
      vazio como v-model e atualizar o banco de dados conforme o v-model é
      atualizado
    </p>
    <div class="d-flex w-100 justify-space-evenly flex-column flex-sm-row">
      <div>
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
              <td>readonly</td>
              <td>Boolean</td>
              <td class="text-center">
                <v-icon icon="mdi-close-box" color="error" />
              </td>
            </tr>
            <tr>
              <td>slides</td>
              <td>Object</td>
              <td class="text-center">
                <v-icon icon="mdi-checkbox-marked" color="success" />
              </td>
            </tr>
            <tr>
              <td>slides.title</td>
              <td>String</td>
              <td class="text-center">
                <v-icon icon="mdi-close-box" color="error" />
              </td>
            </tr>
            <tr>
              <td>slides.image</td>
              <td>String</td>
              <td class="text-center">
                <v-icon icon="mdi-close-box" color="error" />
              </td>
            </tr>
            <tr>
              <td>slides.video</td>
              <td>String</td>
              <td class="text-center">
                <v-icon icon="mdi-close-box" color="error" />
              </td>
            </tr>
            <tr>
              <td>slides.type</td>
              <td>
                <v-tooltip
                  text="Image | Youtube | Vimeo | FileImage | FileVideo"
                >
                  <template #activator="{ props }">
                    <span v-bind="props">
                      String
                      <v-icon size="small" color="gray-=500"
                        >mdi-information-outline</v-icon
                      >
                    </span>
                  </template>
                </v-tooltip>
              </td>
              <td class="text-center">
                <v-icon icon="mdi-close-box" color="error" />
              </td>
            </tr>
          </tbody>
        </v-table>
      </div>
      <div>
        <p class="text-h5 text-center">Exemplo</p>
        <Prism class="bg-white" language="javascript">
          {{ exampleScripts[0] }}
        </Prism>
      </div>
    </div>
    <div class="w-100">
      <alex-custom-carousel v-model="slidesFirstExample" read-only />
    </div>
    <div class="w-100">
      <div
        class="d-flex align-center justify-space-between w-100 px-3 bg-gray-100 rounded-t"
      >
        <alex-custom-tabs
          v-model="examplesActivePages[0]"
          :tabs="exampleTabs"
          color="black"
        ></alex-custom-tabs>
        <v-icon icon=" mdi-code-tags" color="gray-600" />
      </div>
      <v-window v-model="examplesActivePages[0]" class="w-100">
        <v-window-item value="1">
          <div class="bg-grey-lighten-5 pa-3" style="position: relative">
            <prism class="bg-grey-lighten-5">
              {{ exampleTemplates[1] }}
            </prism>
            <v-btn
              class="copy-icon"
              variant="text"
              color="gray-400"
              @click="copyToClipboard(exampleTemplates[1], 'firstTemplate')"
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
        </v-window-item>
        <v-window-item value="2">
          <div class="bg-grey-lighten-5 pa-3" style="position: relative">
            <prism class="bg-grey-lighten-5">
              {{
                ` 
  &lt;script setup&gt;
  ${exampleScripts[1]}
  &lt;/script&gt;
              `
              }}
            </prism>
            <v-btn
              class="copy-icon"
              variant="text"
              color="gray-400"
              @click="copyToClipboard(exampleScripts[1], 'firstScript')"
            >
              <v-icon
                v-if="copiedValue == 'firstScript'"
                size="x-large"
                icon="mdi-clipboard-check-multiple-outline"
                color="green-lighten-1"
              />
              <v-icon v-else size="x-large" icon="mdi-content-copy" />
            </v-btn>
          </div>
        </v-window-item>
      </v-window>
    </div>
    <h2 class="text-h3 text-gray-800">Variante: Carousel Customizavel</h2>
    <p class="text-subtitle-2 text-gray-500">
      Caso deseje, utilizar do carousel customizável, vamos ter que salvar o
      array de slides no banco e ir atualizando o mesmo sempre que o v-model for
      atualizado alguma alteração nos slides
    </p>
    <div class="w-100">
      <alex-custom-carousel v-model="slidesSecondExample" />
    </div>
    <div class="w-100">
      <div
        class="d-flex align-center justify-space-between w-100 px-3 bg-gray-100 rounded-t"
      >
        <alex-custom-tabs
          v-model="examplesActivePages[1]"
          :tabs="exampleTabs"
          color="black"
        ></alex-custom-tabs>
        <v-icon icon=" mdi-code-tags" color="gray-600" />
      </div>
      <v-window v-model="examplesActivePages[1]" class="w-100">
        <v-window-item value="1">
          <div class="bg-grey-lighten-5 pa-3" style="position: relative">
            <prism class="bg-grey-lighten-5">
              {{ exampleTemplates[2] }}
            </prism>
            <v-btn
              class="copy-icon"
              variant="text"
              color="gray-400"
              @click="copyToClipboard(exampleTemplates[2], 'firstTemplate')"
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
        </v-window-item>
        <v-window-item value="2">
          <div class="bg-grey-lighten-5 pa-3" style="position: relative">
            <prism class="bg-grey-lighten-5">
              {{
                ` 
  &lt;script setup&gt;
  ${exampleScripts[2]}
  &lt;/script&gt;
              `
              }}
            </prism>
            <v-btn
              class="copy-icon"
              variant="text"
              color="gray-400"
              @click="copyToClipboard(exampleScripts[2], 'firstScript')"
            >
              <v-icon
                v-if="copiedValue == 'firstScript'"
                size="x-large"
                icon="mdi-clipboard-check-multiple-outline"
                color="green-lighten-1"
              />
              <v-icon v-else size="x-large" icon="mdi-content-copy" />
            </v-btn>
          </div>
        </v-window-item>
      </v-window>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import 'prismjs';
import 'prismjs/themes/prism.css';
import Prism from 'vue-prism-component';
definePageMeta({ layout: 'components' });
const slidesFirstExample = ref([
  {
    title: 'Slide 1',
    type: 'youtube',
    image: 'https://img.youtube.com/vi/AUci5aV2y0w/maxresdefault.jpg',
    video: 'https://www.youtube.com/watch?v=AUci5aV2y0w',
  },
  {
    title: 'Slide 2',
    type: 'image',
    image: 'https://picsum.photos/1000/525',
  },
  {
    title: 'Slide 3',
    type: 'image',
    image: 'https://picsum.photos/2000/1123',
  },
  {
    title: 'Slide 4',
    type: 'image',
    image: 'https://picsum.photos/1000/1324',
  },
  {
    title: 'Slide 5',
    type: 'image',
    image: 'https://picsum.photos/1500/1125',
  },
  {
    title: 'Slide 6',
    type: 'image',
    image: 'https://picsum.photos/2300/1125',
  },
  {
    title: 'Slide 7',
    type: 'image',
    image: 'https://picsum.photos/2000/785',
  },
  {
    title: 'Slide 8',
    type: 'image',
    image: 'https://picsum.photos/2000/2000',
  },
  {
    title: 'Slide 9',
    type: 'image',
    image: 'https://picsum.photos/1800/1234',
  },
]);

const slidesSecondExample = ref([]);

const copiedValue = ref('');
const examplesActivePages = ref(['1', '1']);

const exampleScripts = [
  `
import { ref } from 'vue';
const slides = ref([
{
    title: 'Slide 1',
    type: 'youtube',
    image: 'https://img.youtube.com/vi/AUci5aV2y0w/0.jpg',
    video: 'https://www.youtube.com/watch?v=AUci5aV2y0w',
  },
  {
    title: 'Slide 2',
    type: 'image',
    image: 'https://picsum.photos/1000/525',
  },
])
`,
  `
import { ref } from 'vue';
const slides = ref([
{
    title: 'Slide 1',
    type: 'youtube',
    image: 'https://img.youtube.com/vi/AUci5aV2y0w/0.jpg',
    video: 'https://www.youtube.com/watch?v=AUci5aV2y0w',
  },
  {
    title: 'Slide 2',
    type: 'image',
    image: 'https://picsum.photos/1000/525',
  },
  {
    title: 'Slide 3',
    type: 'FileImage',
    image: '/uploads/imagem.png',
  },
  {
    title: 'Slide 4',
    type: 'FileVideo',
    video: '/uploads/video.mp4',
    image: '/uploads/videoThumbnail.jpg',
  },
])
`,
  `
  import { ref } from 'vue';
  const slides = ref([]);
  `,
  `
`,
];

const exampleTemplates = [
  '',
  `
      <alex-custom-carousel read-only v-model="slides" />
  `,
  `
      <alex-custom-carousel v-model="slides" />
  `,
];

const exampleTabs = [
  {
    label: 'Template',
    value: '1',
  },
  {
    label: 'Script',
    value: '2',
  },
];

const copyToClipboard = async (message, item) => {
  await navigator.clipboard.writeText(message);
  copiedValue.value = item;
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
