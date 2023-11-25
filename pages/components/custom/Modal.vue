<template>
  <v-container
    class="page rounded-lg bg-white pa-6 d-flex flex-column align-start pb-15"
  >
    <h1 class="text-h2 text-gray-800">Modal</h1>
    <p class="text-subtitle-2 text-gray-500">
      O
      <strong class="bg-accent pa-1 rounded">alex-custom-modal</strong>
      é uma janela emergente que aparece sobre o conteúdo principal de um site
      ou aplicativo para exibir informações adicionais, solicitar ações ou
      interações específicas do usuário, sem que ele deixe a tela atual.
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
          href="https://vuetifyjs.com/en/components/dialogs/"
          target="_blank"
          >vuetifyjs.com</a
        >
      </div>
    </div>
    <h2 class="text-h2 text-gray-800">Uso Básico</h2>
    <p class="text-subtitle-2 text-gray-500">
      Tem como propriedades o <strong>v-model</strong> que é obrigatório e o
      <strong>activator</strong>, <strong>title</strong>,
      <strong>nameMainButton</strong>, <strong>nameSecondButton</strong>, que
      são opcionais.
    </p>

    <div class="w-100 flex-column d-flex gap-4">
      <div class="d-flex" style="gap: 8px">
        <alex-custom-modal
          v-model="modal"
          activator="parent"
          title="Título Modal"
          name-main-button="Criar"
          name-second-button="Cancelar"
          @on-main-action="() => console.log('main')"
          @on-second-action="() => console.log('second')"
        >
          <template #activator="{ props }">
            <v-btn v-bind="props">Abrir Modal</v-btn>
          </template>
          tesLorem ipsum dolor sit amet, semper quis, sapien id natoque elit.
          Nostra urna at, magna at neque sed sed ante imperdiet, dolor mauris
          cursus velit, velit non, sem nec. Volutpat sem ridiculus placerat leo,
          augue in, duis erat proin condimentum in a eget, sed fermentum sed
          vestibulum varius ac, vestibulum volutpat orci ut elit eget tortor.
          Ultrices nascetur nulla gravida ante arcu. Pharetra rhoncus morbi
          ipsum, nunc tempor debitis, ipsum pellentesque, vitae id quam ut
          mauris dui tempor, aptent non. Quisque turpis. Phasellus quis lectus
          luctus orci eget rhoncus. Amet donec vestibulum mattis commodo, nulla
          aliquet, nibh praesent, elementum nulla. Sit lacus pharetra tempus
          magna neque pellentesque, nulla vel erat. Justo ex quisque nulla
          accusamus venenatis, sed quis. Nibh phasellus gravida metus in, fusce
          aenean ut erat commodo eros. Ut turpis, dui integer, nonummy pede
          placeat nec in sit leo. Faucibus porttitor illo taciti odio, amet
          viverra scelerisque quis quis et tortor, curabitur morbi a. Enim
          tempor at, rutrum elit condimentum, amet rutrum vitae tempor torquent
          nunc. Praesent vestibulum integer maxime felis. Neque aenean quia
          vitae nostra, tempus elit enim id dui, at egestas pulvinar. Integer
          libero vestibulum, quis blandit scelerisque mattis fermentum nulla,
          tortor donec vestibulum dolor amet eget, elit nullam. Aliquam leo
          phasellus aliquam curabitur metus a, nulla justo mattis duis interdum
          vel, mollis vitae et id, vestibulum erat ridiculus sit pulvinar justo
          sed. Vehicula convallis, et nulla wisi, amet vestibulum risus, quam ac
          egestas. Et vitae, nulla gravida erat scelerisque nullam nunc
          pellentesque, a dictumst cras augue, purus imperdiet non. Varius
          montes cursus varius vel tortor, nec leo a qui, magni cras, velit vel
          consectetuer lobortis vel. Nibh erat et wisi felis leo porttitor,
          sapien nibh sapien pede mi, sed eget porttitor, repellendus arcu ac
          quis. Luctus vulputate aut est sem magna, placerat accumsan nunc
          vestibulum ipsum ac auctor, maecenas lorem in ut nec mauris tortor,
          doloribus varius sem tortor vestibulum mollis, eleifend tortor felis
          tempus lacus eu eu. Eleifend vel eu, nullam maecenas mauris nec nunc
          euismod, tortor porta ridiculus potenti, massa tristique nam magna, et
          wisi placerat et erat ante. Eget pede erat in facilisis, fermentum
          venenatis sodales. Ac tortor sociis et non animi tristique, rhoncus
          malesuada, ut arcu volutpat scelerisque sollicitudin, elit curabitur
          dui pede purus dolor, integer aenean risus taciti nulla eleifend
          accumsan. At pulvinar diam parturient, interdum mi velit aliquet et a.
          Arcu at ac placerat eget justo semper, purus sociis curabitur mi ipsum
          consequat ut, mollis vestibulum, est ante ornare lacus sem. Neque
          magna mauris, commodo quisque, praesent semper suscipit lobortis nam.
          Justo malesuada cursus ac nunc litora nunc. Tellus ac, in lobortis
          nunc, montes lectus purus fermentum.teibus varius sem tortor
          vestibulum mollis, eleifend tortor felis tempus lacus eu eu. Eleifend
          vel eu, nullam maecenas mauris nec nunc euismod, tortor porta
          ridiculus potenti, massa tristique nam magna, et wisi placerat et erat
          ante. Eget pede erat in facilisis, fermentum venenatis sodales. Ac
          tortor sociis et non animi tristique, rhoncus malesuada, ut arcu
          volutpat scelerisque sollicitudin, elit curabitur dui pede purus
          dolor, integer aenean risus taciti nulla eleifend accumsan. At
          pulvinar diam parturient, interdum mi velit aliquet et a. Arcu at ac
          placerat eget justo semper, purus sociis curabitur mi ipsum consequat
          ut, mollis vestibulum, est ante ornare lacus sem. Neque magna mauris,
          commodo quisque, praesent semper suscipit lobortis nam. Justo
          malesuada cursus ac nunc litora nunc. Tellus ac, in lobortis nunc,
          montes lectus purus fermentum.teesuada, ut arcu volutpat scelerisque
          sollicitudin, elit curabitur dui pede purus dolor, integer aenean
          risus taciti nulla eleifend accumsan. At pulvinar diam parturient,
          interdum mi velit aliquet et a. Arcu at ac placerat eget justo semper,
          purus sociis curabitur mi ipsum consequat ut, mollis vestibulum, est
          ante ornare lacus sem. Neque magna mauris, commodo quisque, praesent
          semper suscipit lobortis nam. Justo malesuada cursus ac nunc litora
          nunc. Tellus ac, in lobortis nunc, montes lectus purus
          fermentum.teibus varius sem tortor vestibulum mollis, eleifend tortor
          felis tempus lacus eu eu. Eleifend vel eu, nullam maecenas mauris nec
          nunc euismod, tortor porta ridiculus potenti, massa tristique nam
          magna, et wisi placerat et erat ante. Eget pede erat in facilisis,
          fermentum venenatis sodales. Ac tortor sociis et non animi tristique,
          rhoncus malesuada, ut arcu volutpat scelerisque sollicitudin, elit
          curabitur dui pede purus dolor, integer aenean risus taciti nulla
          eleifend accumsan. At pulvinar diam parturient, interdum mi velit
          aliquet et a. Arcu at ac placerat eget justo semper, purus sociis
          curabitur mi ipsum consequat ut, mollis vestibulum, est ante ornare
          lacus sem. Neque magna mauris, commodo quisque, praesent semper
          suscipit lobortis nam. Justo malesuada cursus ac nunc litora nunc.
          Tellus ac, in lobortis nunc, montes lectus purus fermentum.te
        </alex-custom-modal>
      </div>
      <div class="a w-100" style="position: relative">
        <prism> {{ examples[0] }}</prism>
        <v-btn
          class="copy-icon"
          variant="text"
          color="gray-400"
          @click="copyToClipboard(0)"
        >
          <v-icon
            v-if="copiedIndex === 0"
            size="x-large"
            icon="mdi-clipboard-check-multiple-outline"
            color="green-lighten-1"
          />
          <v-icon v-else size="x-large" icon="mdi-content-copy" />
        </v-btn>
      </div>
    </div>

    <div class="d-flex w-100 justify-space-evenly flex-column">
      <div>
        <p class="text-h5 text-center">Props do componente</p>
        <v-table variant="outline" class="w-full">
          <thead>
            <tr>
              <th>Propriedade</th>
              <th>Tipo</th>
              <th>Obrigatório</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>modelValue</td>
              <td>boolean</td>
              <td class="text-center">
                <v-icon icon="mdi-checkbox-marked" color="success" />
              </td>
            </tr>
            <tr>
              <td>activator</td>
              <td>'parent'</td>
              <td class="text-center">
                <v-icon icon="mdi-close-box" color="error" />
              </td>
            </tr>
            <tr>
              <td>title</td>
              <td>string</td>
              <td class="text-center">
                <v-icon icon="mdi-close-box" color="error" />
              </td>
            </tr>
            <tr>
              <td>highlight</td>
              <td>string</td>
              <td class="text-center">
                <v-icon icon="mdi-close-box" color="error" />
              </td>
            </tr>
            <tr>
              <td>nameMainButton</td>
              <td>string</td>
              <td class="text-center">
                <v-icon icon="mdi-close-box" color="error" />
              </td>
            </tr>
            <tr>
              <td>nameSecondButton</td>
              <td>string</td>
              <td class="text-center">
                <v-icon icon="mdi-close-box" color="error" />
              </td>
            </tr>
          </tbody>
        </v-table>
      </div>
    </div>

    <div class="d-flex w-100 justify-space-evenly flex-column">
      <div>
        <p class="text-h5 text-center">Eventos do componente</p>
        <v-table variant="outline" class="w-full">
          <thead>
            <tr>
              <th>Nome da Evento</th>
              <th>Descrição</th>
              <th>Obrigatório</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong class="text-success-0">@on-main-action</strong></td>
              <td>Ação ao clicar no botão principal</td>
              <td class="text-center">
                <v-icon icon="mdi-close-box" color="error" />
              </td>
            </tr>
            <tr>
              <td><strong class="text-success-0">@on-second-action</strong></td>
              <td>Ação ao clicar no botão secundário</td>
              <td class="text-center">
                <v-icon icon="mdi-close-box" color="error" />
              </td>
            </tr>
          </tbody>
        </v-table>
      </div>
    </div>

    <h2 class="text-h2 text-gray-800">Variante com destaque</h2>
    <p class="text-subtitle-2 text-gray-500">
      Modo dentro de outros componentes possibilitando uma simplicidade maior na
      hora de usar.
    </p>

    <div class="w-100 flex-column d-flex gap-4">
      <div class="d-flex" style="gap: 8px">
        <v-btn>
          Abrir Modal highlight
          <alex-custom-modal
            v-model="modalHighlight"
            activator="parent"
            title="Modal uso dentro do botão"
            highlight="#132"
            @on-main-action="() => console.log('main')"
            @on-second-action="() => console.log('second')"
            >teste
          </alex-custom-modal>
        </v-btn>
      </div>
      <div class="a w-100" style="position: relative">
        <prism> {{ examples[1] }}</prism>
        <v-btn
          class="copy-icon"
          variant="text"
          color="gray-400"
          @click="copyToClipboard(1)"
        >
          <v-icon
            v-if="copiedIndex === 1"
            size="x-large"
            icon="mdi-clipboard-check-multiple-outline"
            color="green-lighten-1"
          />
          <v-icon v-else size="x-large" icon="mdi-content-copy" />
        </v-btn>
      </div>
    </div>

    <h2 class="text-h2 text-gray-800">Uso dentro de outros componentes</h2>
    <p class="text-subtitle-2 text-gray-500">
      Modo dentro de outros componentes possibilitando uma simplicidade maior na
      hora de usar.
    </p>

    <div class="w-100 flex-column d-flex gap-4">
      <div class="d-flex" style="gap: 8px">
        <v-btn>
          Abrir Modal
          <alex-custom-modal
            v-model="modalInsideUse"
            activator="parent"
            title="Modal uso dentro do botão"
            @on-main-action="() => console.log('main')"
            @on-second-action="() => console.log('second')"
            >teste
          </alex-custom-modal>
        </v-btn>
      </div>
      <div class="a w-100" style="position: relative">
        <prism> {{ examples[2] }}</prism>
        <v-btn
          class="copy-icon"
          variant="text"
          color="gray-400"
          @click="copyToClipboard(2)"
        >
          <v-icon
            v-if="copiedIndex === 2"
            size="x-large"
            icon="mdi-clipboard-check-multiple-outline"
            color="green-lighten-1"
          />
          <v-icon v-else size="x-large" icon="mdi-content-copy" />
        </v-btn>
      </div>
    </div>

    <h2 class="text-h2 text-gray-800">Customizações</h2>
    <p class="text-subtitle-2 text-gray-500">
      É possível customizar tanto o <strong>header</strong> quanto o
      <strong>footer</strong>.
    </p>

    <div class="w-100 flex-column d-flex gap-4">
      <div class="d-flex gap-2">
        <v-btn>
          Abrir Modal Customizado
          <alex-custom-modal
            v-model="modalCustomization"
            activator="parent"
            @on-main-action="() => console.log('main')"
            @on-second-action="() => console.log('second')"
            ><template #header>
              <alex-custom-modal-header title="Header customizado"
            /></template>
            teste
            <template #footer
              ><alex-custom-modal-footer no-main-button no-second-button />
            </template>
          </alex-custom-modal>
        </v-btn>
      </div>
      <div class="a w-100" style="position: relative">
        <prism> {{ examples[3] }}</prism>
        <v-btn
          class="copy-icon"
          variant="text"
          color="gray-400"
          @click="copyToClipboard(3)"
        >
          <v-icon
            v-if="copiedIndex === 3"
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

definePageMeta({
  layout: 'components',
  middleware: 'auth',
});

const modal = ref(false);
const modalInsideUse = ref(false);
const modalCustomization = ref(false);
const modalHighlight = ref(false);
const copiedValue = ref('');
const copiedIndex = ref(-1);
const examples = [
  `  <alex-custom-modal
          v-model="modal"
          activator="parent"
          title="Criar Algo"
          name-main-button="Criar"
          name-second-button="Cancelar"
          @on-main-action="() => console.log('main')"
          @on-second-action="() => console.log('second')"
        >
          <template #activator="{ props }">
            <v-btn v-bind="props">activator</v-btn>
          </template>
          teste
        </alex-custom-modal>`,
  `  <v-btn>
          Abrir Modal Highlight
          <alex-custom-modal
            v-model="modalHighlight"
            activator="parent"
            title="Modal uso dentro do botão"
            highlight="#132"
            @on-main-action="() => console.log('main')"
            @on-second-action="() => console.log('second')"
            >teste
          </alex-custom-modal>
        </v-btn>`,
  `  <v-btn>
          Abrir Modal
          <alex-custom-modal
            v-model="modalInsideUse"
            activator="parent"
            title=""
            @on-main-action="() => console.log('main')"
            @on-second-action="() => console.log('second')"
            >teste
          </alex-custom-modal>
        </v-btn>`,
  ` <v-btn>
          Abrir Modal Customizado
          <alex-custom-modal
            v-model="modalCustomization"
            activator="parent"
            @on-main-action="() => console.log('main')"
            @on-second-action="() => console.log('second')"
            ><template #header>
              <alex-custom-modal-header title="Header customizado"
            /></template>
            teste
            <template #footer
              ><alex-custom-modal-footer no-main-button no-second-button />
            </template>
          </alex-custom-modal>
        </v-btn>`,
];

const copyToClipboard = async (index) => {
  try {
    await navigator.clipboard.writeText(examples[index]);
    copiedValue.value = examples[index];
  } catch (err) {
    copiedValue.value = examples[index];
  }
  copiedIndex.value = index;
};
</script>

<style>
.language-markup {
  overflow-x: auto;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  &::-webkit-scrollbar {
    display: none;
  }
  border-radius: 8px;
}
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
  right: 10px;
  top: 10px;
  color: #a0a8b1;
}
</style>
