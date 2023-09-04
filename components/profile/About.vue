<template>
  <profile-card class="mb-6" title="Sobre" :full-width="true">
    <template v-slot:content>
      <text-area>
        Professor e Pesquisador do Instituto Federal de Alagoas (IFAL), sendo
        membro da Coordenação de Informática (CINFO) do Campus Maceió e fundador
        do Núcleo de EXperiências em Aprendizagem (NEXA). Criador do projeto
        ALEX, uma plataforma aprendizagem ativa e de educação híbrida que visa a
        inclusão digital, renovação pedagógica e a promoção de processos de
        ensino-aprendizagem até a última milha Doutorando em Engenharia
        Industrial pela Universidade Federal da Bahia (UFBA), pesquisando sobre
        métodos ativos de ensino-aprendizagem e educação híbrida em Engenharia e
        Tecnologia. Desenvolve atividades de pesquisa com a comunidade ao redor
        do IFAL, incluindo empresas e organizações sem fins de lucro. Fomenta a
        integração da academia e o mercado de TI, através de abordagens ativas
        de ensino-aprendizagem, centradas no estudante, procurando aproximar
        estes dois mundos. Anteriormente, fez mestrado em Ciência da Computação
        pelo Centro de Informática (CIn) da Universidade Federal de Pernambuco
        (UFPE) em 2009, na área de Redes de Computadores (Redes Ad Hoc Móveis e
        Mesh), e graduação em Sistemas de Informação pela Estácio-FAL.
      </text-area>
    </template>

    <template v-slot:footer>
      <div class="footer d-flex flex-row pt-6">
        <div
          class="competence d-flex flex-column align-start pa-4"
          v-for="block in [
            {
              title: 'Competências Gerais',
              items: [
                'Liderança',
                'Liderança',
                'Liderança',
                'Liderança',
                'Liderança',
                'Liderança',
              ],
            },
            {
              title: 'Competências Técnicas',
              items: [
                'Inglês',
                'Inglês',
                'Inglês',
                'Inglês',
                'Inglês',
                'Inglês',
              ],
            },
          ]"
        >
          <span class="title">{{ block.title }}</span>
          <div class="d-flex flex-wrap justify-center">
            <span
              class="item d-flex justify-center align-center px-4"
              v-for="item in block.items"
              >{{ item }}</span
            >
          </div>
        </div>
      </div>
    </template>
  </profile-card>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
text-area {
  text-align: justify;
  text-justify: inter-word;
  align-self: stretch;
  color: #5d6872;
  font-size: 16px;
  font-weight: 400;
  line-height: 22px;
}
.footer {
  gap: 24px;

  .competence {
    gap: 16px;
    border-radius: 8px;
    border: 1px solid #eaeef1;

    .title {
      color: #5d6872;
      font-size: 16px;
      font-weight: bold;
      line-height: 22px;
    }

    div {
      gap: 8px;
      .item {
        padding-block: 10px;
        gap: 4px;
        border-radius: 99px;
        border: 1px solid #5d6872;
      }
    }
  }
}
</style>
