<script setup lang="ts"></script>

<template>
  <div>
    <v-row>
      <v-col cols="4">
        <v-card>
          <v-card-text>
            <h3>Total de tarefas</h3>
            <h2 class="text-h2">02</h2>
            <p>50% Finalizadas</p>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="4">
        <v-card>
          <v-card-text>
            <h3>Total de objetivos</h3>
            <h2 class="text-h2">03</h2>
            <p>33% Finalizados</p>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="4">
        <v-card>
          <v-card-text>
            <h3>Total de contribuições</h3>
            <h2 class="text-h2">21</h2>
            <p>10% Destacados</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="8">
        <v-card>
          <v-card-title>Meu progresso</v-card-title>
          <v-card-text> teste </v-card-text>
          <v-card-text>
            <p>50% das tarefas foram terminadas</p>
            <p>Última atualização: 15 de setembro de 2024</p>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="4">
        <v-card>
          <v-card-title>Desempenho</v-card-title>
          <v-card-text>teste</v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-card>
      <v-card-title>Objetivos</v-card-title>
      <v-card-text>
        <v-list>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>OA1</v-list-item-title>
              <v-list-item-subtitle
                >Consertar o Header e Sidebar do ALEX</v-list-item-subtitle
              >
              <v-list-item-subtitle
                >Término: 2 de janeiro de 2024</v-list-item-subtitle
              >
            </v-list-item-content>
            <v-list-item-action>
              <v-chip color="green">Concluído</v-chip>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </div>
</template>
