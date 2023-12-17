<template>
  <div class="container d-flex flex-column">
    <div class="config config-title">
      <p>
        <span class="header-h4"> {{ $t('config.title') }}</span>
      </p>
    </div>
    <div class="config">
      <div class="content-area">
        <div class="card-title">
          <p>
            <span class="header-h4">Capa do curso</span>
          </p>
        </div>
        <div class="content-body">
          <div
            v-if="selectedFile"
            class="filePreview"
            :style="{
              backgroundImage: 'url(' + preview + ')',
              backgroundSize: 'cover',
            }"
          ></div>
          <div v-else class="empty-state mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="57"
              height="57"
              viewBox="0 0 57 57"
              fill="none"
            >
              <path
                d="M54.0571 9H47.9971V2.94C47.9971 1.32 46.6771 0 45.0571 0H44.9671C43.3171 0 41.9971 1.32 41.9971 2.94V9H35.9671C34.3471 9 33.0271 10.32 32.9971 11.94V12.03C32.9971 13.68 34.3171 15 35.9671 15H41.9971V21.03C41.9971 22.65 43.3171 24 44.9671 23.97H45.0571C46.6771 23.97 47.9971 22.65 47.9971 21.03V15H54.0571C55.6771 15 56.9971 13.68 56.9971 12.06V11.94C56.9971 10.32 55.6771 9 54.0571 9ZM38.9971 21.03V18H35.9671C34.3771 18 32.8771 17.37 31.7371 16.26C30.6271 15.12 29.9971 13.62 29.9971 11.94C29.9971 10.86 30.2971 9.87 30.8071 9H5.99707C2.69707 9 -0.00292969 11.7 -0.00292969 15V51C-0.00292969 54.3 2.69707 57 5.99707 57H41.9971C45.2971 57 47.9971 54.3 47.9971 51V26.16C47.0971 26.67 46.0771 27 44.9371 27C43.3614 26.9843 41.8551 26.3493 40.7437 25.2322C39.6323 24.1152 39.0049 22.6058 38.9971 21.03ZM38.8771 51H8.99707C8.7185 51 8.44544 50.9224 8.20847 50.776C7.97151 50.6295 7.78001 50.42 7.65543 50.1708C7.53085 49.9217 7.47811 49.6427 7.50313 49.3653C7.52815 49.0878 7.62993 48.8229 7.79707 48.6L13.7371 40.71C14.3671 39.87 15.5971 39.93 16.1971 40.77L20.9971 48L28.8271 37.56C29.4271 36.78 30.5971 36.75 31.1971 37.53L40.0471 48.57C40.8271 49.56 40.1371 51 38.8771 51Z"
                fill="#A0A8B1"
              />
            </svg>
            <p class="text-center">
              <span class="header-h5 text--secondary"
                >Adicione Vídeos ou Fotos</span
              >
              <br />
              <span class="subtitle text--secondary"
                >Formatos Suportados: .jpeg, .png, .wav, .mp4, .jpg;</span
              >
            </p>
          </div>
          <span class="action-content">
            <alex-custom-button
              class="button"
              text="Fazer upload"
              prepend-icon="mdi-cloud-upload-outline"
              variant="secondary"
              @click="$refs.fileInput.click()"
            />
            <input
              ref="fileInput"
              type="file"
              accept=".jpeg, .png, .wav, .mp4, .jpg"
              style="display: none"
              @change="handleFileUpload($event)"
            />
          </span>
        </div>
      </div>
      <div class="content-area">
        <div class="card-title">
          <p>
            <span class="header-h4">Informações gerais</span>
          </p>
        </div>
        <div class="content-body">
          <alex-inputs-text-field
            label="Nome do curso"
            name=""
            class="w-100"
            required
          />
          <div class="container-date">
            <div class="datePickers">
              <alex-inputs-date
                label="Início"
                :model-value="startValue"
                name=""
                required
                class="w-100"
                close-on-select
              />
              <alex-inputs-date
                label="Término"
                name=""
                :model-value="endValue"
                required
                class="w-100"
              />
            </div>
          </div>

          <alex-inputs-text-field
            label="Sigla da turma"
            name=""
            class="w-100"
            required
          />
        </div>
        <div class="footer-content">
          <span class="action-content-two">
            <alex-custom-button
              class="button"
              text="Cancelar"
              variant="secondary"
            />
            <alex-custom-button
              class="button"
              text="Salvar alterações"
              variant="primary"
            />
          </span>
        </div>
      </div>
      <div class="content-area">
        <div class="card-title">
          <p>
            <span class="header-h4">Encontros síncronos</span>
          </p>
        </div>
        <div class="content-body">
          <div class="no-encounters mb-4">
            <p>
              <span class="body-p1"
                >Parece que não há nenhum encontro síncrono</span
              >
            </p>
          </div>
          <span class="action-content">
            <alex-custom-button
              class="button"
              text="Criar encontro"
              prepend-icon="mdi-plus"
              variant="primary"
            />
          </span>
        </div>
      </div>
      <div class="d-flex content-area">
        <div class="card-title">
          <p>
            <span class="header-h4">Configurações de convite</span>
          </p>
        </div>
        <div class="d-flex content-body">
          <div class="container-invite border-bottom">
            <span class="header-h5 text-invite">Convite por link</span>
            <v-switch
              v-model:model-value="activeLink"
              label="Link de convite"
              color="accent"
            />

            <div v-if="activeLink" class="inviteLinks d-flex flex-row">
              <div class="w-1/4">
                <label for="select-1" class="body-p1 py-2"
                  >Duração do convite</label
                >
                <v-tooltip
                  location="bottom"
                  attach="#linkTooltip"
                  content-class="inviteTooltip"
                  max-width="300px"
                  text="Alterar a duração do convite não vai mudar o tempo restante
                  do endereço atual. Para aplicar a nova duração é necessário
                  gerar um novo convite."
                >
                  <template v-slot:activator="{ props }">
                    <v-icon
                      v-bind="props"
                      id="linkTooltip"
                      class="ml-2"
                      color="#6E7A87"
                      size="20"
                      >mdi-information-outline</v-icon
                    >
                  </template>
                </v-tooltip>
                <v-select
                  id="select-1"
                  class="py-2"
                  name=""
                  variant="outlined"
                  density="comfortable"
                  required
                  :items="[
                    '5 minutos',
                    '15 minutos',
                    '30 minutos',
                    '1 hora',
                    '2 horas',
                    '8 horas',
                    '24 horas',
                  ]"
                >
                </v-select>
              </div>
              <div class="w-3/4">
                <span class="body-p1 py-2"> Endereço do convite </span>
                <courses-invites
                  :enable-invites="course.invite_enabled"
                  :invitation-link="invitationLink"
                  href=""
                  no-header
                  class="mt-2 w-full"
                />
              </div>
            </div>
          </div>
          <div class="container-invite">
            <span class="header-h5 text-invite">Convite por e-mail</span>
            <alex-inputs-text-field
              name="Mensagem do convite"
              label="Mensagem do convite"
              hint="Mensagem que será enviada por e-mail para o convidado."
              persistent-hint
              append-inner-icon="mdi-cached"
              class="w-100"
              required
            />
          </div>
          <v-tooltip
            location="bottom"
            attach="append-inner-icon"
            content-class="inviteTooltip"
            max-width="300px"
            text="Restaurar mensagem padrão"
          ><template v-slot:activator="{ props }">
              <v-icon
                v-bind="props"
                class="ml-2"
                color="#6E7A87"
                size="20"
                >mdi-cached</v-icon
              >
            </template></v-tooltip>
        </div>
        <div class="footer-content">
          <span class="action-content-two">
            <alex-custom-button
              class="button"
              text="Cancelar"
              variant="secondary"
            />
            <alex-custom-button
              class="button"
              text="Salvar alterações"
              variant="primary"
            />
          </span>
        </div>
      </div>
      <div class="content-area">
        <div class="card-title">
          <p>
            <span class="header-h4">Visibilidade do curso</span>
          </p>
        </div>
        <div class="content-body">
          <div class="container-radio">
            <div class="radioButtons">
              <alex-inputs-radio-button
                v-model="activeButton"
                :buttons="firstButton"
              />
              <alex-inputs-radio-button
                v-model="activeButton"
                :buttons="secondButton"
              />
            </div>
          </div>
        </div>
        <div class="footer-content">
          <span class="action-content-two">
            <alex-custom-button
              class="button"
              text="Cancelar"
              variant="secondary"
            />
            <alex-custom-button
              class="button"
              text="Salvar alterações"
              variant="primary"
            />
          </span>
        </div>
      </div>
      <div class="content-area">
        <div class="card-title">
          <p>
            <span class="header-h4">Excluir curso</span>
          </p>
        </div>
        <div class="content-body">
          <p>
            Após a exclusão do curso, todas as trilhas, fotos, vídeos, arquivos,
            serão perdidos. Você não terá mais acesso a nenhum conteúdo deste
            curso. sendo assim tenha certeza antes de continuar.
          </p>
        </div>
        <div class="footer-content">
          <span class="action-content">
            <alex-custom-button
              class="button"
              prepend-icon="mdi-trash-can-outline"
              text="Excluir curso"
              variant="error"
              @click="openDialog = true"
            >
              Excluir curso
              <alex-custom-dialog
                :model-value="openDialog"
                title=""
                body-classes="criticalAttention"
                class="exclusionDialog"
              >
                <template #header>
                  <alex-custom-dialog-header title="" class="noShow"
                /></template>
                <div class="criticalAttention">
                  <div class="exclusionBody">
                    <span class="exclusionIMG">
                      <img
                        src="@/assets/svg/exclusionImage.svg"
                        alt="attention image"
                      />
                    </span>
                    <p>
                      <span class="header-h4"
                        >Realmente deseja excluir o curso?</span
                      >
                      <br />
                      <span class="body-p1"
                        >Ao excluir um curso todo o conteúdo criado dentro dele
                        também será excluído.</span
                      >
                    </p>
                    <alex-inputs-text-field
                      label="Digite a palavra:"
                      name=""
                      class="w-100"
                      required
                      placeholder="Digite a frase"
                    />
                  </div>
                  <div class="exclusionFooter">
                    <alex-custom-button
                      class="button"
                      text="Cancelar"
                      variant="secondary"
                      @click="openDialog = false"
                    />
                    <alex-custom-button
                      class="button"
                      text="Excluir"
                      variant="error"
                      @click="openDialog = false"
                    />
                  </div>
                </div>
                <template #footer>
                  <alex-custom-dialog-footer class="noShow"
                /></template>
              </alex-custom-dialog>
            </alex-custom-button>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const openDialog = ref(false);

const course = ref({
  invite_enabled: true,
});
const invitationLink = ref();

const selectedFile = ref(null);
const preview = ref(null);

const handleFileUpload = (event) => {
  selectedFile.value = event.target.files[0];
  const reader = new FileReader();
  reader.onload = (e) => {
    preview.value = e.target.result;
  };
  reader.readAsDataURL(selectedFile.value);
};

const startValue = ref(new Date());
const endValue = ref(new Date());
const activeLink = ref(false);
const firstButton = ref([
  {
    label: 'Mostrar (Público)',
    hint: 'Torna o curso público, permitindo que qualquer usuário possa encontra-lo através da busca',
    value: '1',
  },
]);

const secondButton = ref([
  {
    label: 'Ocultar (Privado)',
    hint: 'Torna o curso privado, garantindo que somente os integrantes possam ver o curso.',
    value: '2',
  },
]);

const activeButton = ref('1');
</script>
<style scoped lang="scss">
.container {
  display: flex;
}
.config {
  display: flex;
  padding: 24px;
  flex-direction: column;
  flex-wrap: wrap;
  align-content: center !important;
  align-self: stretch;
  width: 100%;
  background-color: #fff;
}

.config-title {
  height: 70px;
  width: 100%;
  flex-wrap: nowrap;
  align-items: flex-start;
  padding: 24px;
  align-self: stretch;
  border-bottom: 1px solid var(--cinza-cinza-100, #ebedef);
}

.content-area {
  display: flex;
  max-width: 850px;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
  border-radius: 8px !important;
  border: 1px solid var(--cinza-cinza-200, #d2d6da) !important;
  background: var(--principais-branco, #fff);
  margin-top: 24px;
}

.content-body {
  display: flex;
  padding: 24px;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
  align-self: stretch;
}
.card-title {
  display: flex;
  height: 72px;
  padding: 16px 18px 16px 24px;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;
  align-self: stretch;
  border-bottom: 1px solid var(--cinza-cinza-100, #ebedef);
}
.empty-state {
  display: flex;
  height: 250px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 4px;
  align-self: stretch;
  border-radius: 8px;
  border: 1px solid var(--cinza-cinza-100, #ebedef);
  background: var(--cinza-cinza-azulado, #f1f5f9);
}

.filePreview {
  display: flex;
  height: 250px;
  padding: 5.072px;
  align-items: center;
  gap: 5.072px;
  align-self: stretch;
  border-radius: 8px;
  border: 1px solid var(--cinza-cinza-100, #ebedef);
}

.action-content {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 24px;
  align-self: stretch;
}

.action-content-two {
  display: flex;
  height: 76px;
  justify-content: flex-end;
  align-items: center;
  gap: 16px;
  align-self: stretch;
}

p {
  color: var(--cinza-cinza-400, #a0a8b1);
  text-align: center;
  font-family: Sen;
}

.header-h4 {
  color: var(--cinza-cinza-800, #454d54);
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  letter-spacing: 0.2px;
}
.header-h5 {
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  letter-spacing: 0.36px;
}
.body-p3 {
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 135%;
  letter-spacing: 0.28px;
}

.footer-content {
  display: flex;
  padding: 16px 24px;
  justify-content: flex-end;
  align-items: center !important;
  gap: 16px;
  align-self: stretch;
  border-top: 1px solid var(--cinza-cinza-100, #ebedef);
}

.no-encounters {
  display: flex;
  padding: 24px 0px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  align-self: stretch;
  border-radius: 8px;
  border: 1px solid var(--cinza-cinza-100, #ebedef);
}

.body-p1 {
  font-size: 16px !important;
  font-style: normal !important;
  font-weight: 400 !important;
  line-height: 135%;
  letter-spacing: 0.32px;
  color: var(--cinza-cinza-800, #454d54) !important;
}
.button {
  text-transform: none;
}

.text-invite {
  color: var(--cinza-cinza-800, #454d54);
}
.radioButtons {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  flex: 1 0 0;
}

.container-radio {
  display: flex;
  padding: 24px;
  flex-direction: column;
  align-items: flex-end;
  gap: 24px;
  align-self: stretch;
}

.container-date {
  display: flex;
  align-items: center;
  gap: 24px;
  align-self: stretch;
}

.datePickers {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 8px;
  flex: 1 0 0;
}

.criticalAttention {
  display: flex;
  width: 520px;
  max-width: 520px;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  border-radius: 8px;
}

.noShow {
  display: none;
}
.exclusionBody {
  display: flex;
  padding: var(--40px, 40px) 24px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16px;
  align-self: stretch;
}

.exclusionFooter {
  display: flex;
  padding: 16px 24px;
  justify-content: center;
  align-items: center;
  gap: 16px;
  align-self: stretch;
  border-top: 1px solid var(--cinza-cinza-100, #ebedef);
}

.container-invite {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  align-self: stretch;
}

.border-bottom {
  border-bottom: 1px solid var(--cinza-cinza-100, #ebedef);
}
.inviteLinks {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  align-items: flex-start;
  gap: 24px;
  align-content: center;
  justify-content: flex-start;
}

.inviteTooltip {
  text-align: center !important;
  padding: 6.5px 16px;
  justify-content: center;
  align-items: center;
}
</style>
