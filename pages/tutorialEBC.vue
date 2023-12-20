<template>
  <div>
    <alex-tutorial-stepper
      :currentStep="currentStep"
      @onStepChange="handleStepChange"
      :tutorialStepsData="stepsList"
    >
    </alex-tutorial-stepper>
  </div>
</template>

<script setup>
import { ref } from 'vue';

let stepsList = [
  {
    step: 1,
    title: 'Introdução',
    subtitle: 'EBC',
    content: `
      <p>Bem-vindo ao tutorial sobre Educação Baseada em Competências. </p>
      <p><strong>Competência</strong> é a capacidade de uma pessoa aplicar o conhecimento que adquiriu ao longo do tempo. Embora não seja facilmente mensurável, podemos avaliar a competência comparando as habilidades e conhecimentos de diferentes indivíduos com base em seu desempenho em tarefas específicas ou testes.
        Ter competências significa não apenas possuir conhecimento teórico, mas também ter habilidades práticas para resolver problemas reais.</p>
      <p> A <strong>aprendizagem baseada em competências</strong> é um método de ensino em que os alunos demonstram os resultados de aprendizagem desejados. Em vez de receber passivamente informações, os alunos aprendem praticando e focam no domínio de conhecimentos e habilidades valiosas.
        Essa abordagem garante que os alunos retenham o conhecimento e progridam à medida que demonstram competência em um determinado assunto. Ela é amplamente usada em todos os níveis de ensino e muitas instituições de ensino superior também a adotam, pois oferece benefícios práticos significativos.
      </p>
      <p> No vídeo abaixo você pode ver uma breve introdução à Educação Baseada em Competências.</p>
      </br>      
      <iframe width="560" height="315" src="https://www.youtube.com/embed/es31Q3Bxn0o?si=RwxK8ystyyyXaRjL" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
    `,
    completed: false,
  },
  {
    step: 2,
    title: 'Competências Chave',
    subtitle: 'EBC',
    content: `
        </br>
        <p>Nesta segunda etapa, vamos discutir competências chave necessárias para a Educação Baseada em Competências.</p>
        </br>
        <p>Competências e alguns autores relevantes:</p>
        </br>
        <p><strong>Ênfase nas Habilidades Práticas</strong>: A Educação Baseada em Competências destaca a importância do desenvolvimento de habilidades práticas e aplicáveis que os alunos podem usar na vida real. Isso inclui habilidades técnicas, profissionais e sociais.</p>
        </br>
        <p><strong>Avaliação Autêntica</strong>: A avaliação na Educação Baseada em Competências se concentra em medir as habilidades reais e a capacidade dos alunos de aplicar o que aprenderam em situações autênticas. Isso pode incluir projetos práticos, simulações e tarefas do mundo real.</p>
        </br>
        <p><strong>Aprendizado Centrado no Aluno</strong>: Nesse modelo, o aluno desempenha um papel ativo em seu próprio aprendizado. Os alunos são incentivados a definir metas de aprendizado, trabalhar de forma independente e colaborar com outros colegas.</p>
        </br>
        <p><strong>Currículo Flexível</strong>: A Educação Baseada em Competências muitas vezes adota um currículo flexível, permitindo que os alunos progridam em seu próprio ritmo. Isso significa que os alunos avançam quando demonstram competência em vez de avançar apenas com base no tempo.</p>
        </br>
        <p><strong>Desenvolvimento de Competências Essenciais</strong>: Além das habilidades acadêmicas, a Educação Baseada em Competências enfatiza o desenvolvimento de competências essenciais, como resolução de problemas, comunicação, pensamento crítico e colaboração.</p>
        </p>
        </br>
        <p>Alguns autores e teóricos importantes na Educação Baseada em Competências incluem:</p>
        </br>
        <p>Benjamin S. Bloom: Ele é conhecido por sua taxonomia de objetivos educacionais, que inclui habilidades cognitivas, afetivas e psicomotoras, que são relevantes para a Educação Baseada em Competências.</p>
        </br>
        <p>David Kolb: Kolb desenvolveu a teoria da aprendizagem experiencial, que enfatiza a importância da experiência prática e da reflexão na aprendizagem de competências.</p>
        </br>
        <p>Howard Gardner: Gardner é conhecido por sua teoria das inteligências múltiplas, que reconhece diferentes tipos de habilidades e competências que os indivíduos podem possuir, incluindo habilidades linguísticas, lógico-matemáticas, interpessoais, intrapessoais, entre outras.</p>
        </br>
        <p>Robert J. Marzano: Marzano é autor de várias obras sobre avaliação e aprendizado baseado em competências, incluindo estratégias de ensino eficazes que apoiam a Educação Baseada em Competências.</p>
        </br>
        <p>Tony Wagner: Ele é conhecido por seu livro "The Global Achievement Gap", que argumenta que as escolas precisam ensinar habilidades essenciais, como pensamento crítico, criatividade, comunicação e colaboração, em vez de apenas conteúdo acadêmico.</p>
        </br>
        <p>Esses autores e teóricos contribuíram para o desenvolvimento e a compreensão da Educação Baseada em Competências, cada um com suas perspectivas e abordagens únicas. A abordagem pode variar em diferentes contextos educacionais, mas o foco na aplicação prática e no desenvolvimento de habilidades essenciais é uma característica central desse modelo.</p>
        </br>
        <p>Na próxima etapa, vamos examinar exemplos reais de como a Educação Baseada em Competências é implementada em escolas e instituições educacionais.</p>
        `,
    completed: false,
  },
  {
    step: 3,
    title: 'Ciclos',
    subtitle: 'EBC',
    content: `
        </br>
        <p>
          Vamos examinar como funciona o Ciclo de Aprendizagem:
        </p>
        <img src="https://www.aikinews.com.br/images/artigos/Ciclo-da-Aprendizagem.jpg" width="600" alt="Exemplos de Implementação" />
        </br>
        <p>
          O Ciclo de Aprendizagem é um modelo de aprendizagem que enfatiza a importância da experiência prática e da reflexão na aprendizagem de competências. Ele é baseado na teoria da aprendizagem experiencial de David Kolb, que afirma que a aprendizagem ocorre em quatro etapas:
        </p>
        </br>
        <p>
          <strong>1. Experiência Concreta</strong>: O aluno tem uma experiência prática, como uma tarefa ou projeto.
        </p>
        </br>
        <p>
          <strong>2. Observação Reflexiva</strong>: O aluno reflete sobre a experiência e considera o que aprendeu com ela.
        </p>
        </br>
        <p>
          <strong>3. Conceituação Abstrata</strong>: O aluno desenvolve conceitos e teorias com base em sua experiência.
        </p>
        </br>
        <p>
          <strong>4. Experimentação Ativa</strong>: O aluno aplica o que aprendeu em novas situações.
        </p>
        </br>
        <p>
          O Ciclo de Aprendizagem é um modelo útil para a Educação Baseada em Competências, pois enfatiza a importância da experiência prática e da reflexão na aprendizagem de competências. Ele também pode ser usado para projetar atividades de aprendizagem que ajudam os alunos a desenvolver habilidades práticas e aplicáveis.
        </p>
        </br>
        <p>
          No vídeo abaixo você pode ver mais sobre a teoria de Kolb. O vídeo está em inglês, mas é só ativar as legendas.
        </p>
        </br>        
        <iframe width="560" height="315" src="https://www.youtube.com/embed/vNeJSEUsHHo?si=r22X5ukmrlkrwAe4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen>
          Seu navegador não suporta a reprodução de vídeos.
        </iframe>
        `,
    completed: false,
  },
  {
    step: 4,
    title: 'Conclusão',
    subtitle: 'EBC',
    content: `
        </br>
        <p>Parabéns, você concluiu o tutorial sobre Educação Baseada em Competências. Esperamos que você tenha aprendido muito!</p>
        <img src="https://img.freepik.com/vetores-premium/conclua-a-realizacao-da-tarefa-ou-o-projeto-concluido-a-lista-de-verificacao-de-sucesso-ou-a-caixa-de-selecao-da-realizacao-trabalho-concluido_566886-1254.jpg?w=740" alt="Conclusão" />`,
    completed: false,
  },
];

const currentStep = ref(1);

const handleStepChange = (step) => {
  currentStep.value = step;
};
</script>
