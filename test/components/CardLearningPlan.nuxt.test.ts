import { describe, it, expect } from 'vitest';
import { renderSuspended } from 'nuxt-vitest/utils';
import { screen } from '@testing-library/vue';
import Card from '../../components/alex/learningplan/Card/index.vue';

describe('Card of Project and Courses', () => {
  it('Card should be defined', async () => {
    await renderSuspended(Card, {
      props: {
        name: 'Gerenciamento de sistemas operacionais e projeto de redes utilizando o packet tracer',
        description:
          'Fala pessoal, tudo bem? Sejam bem vindos ao Plano de Aprendizagem sobre Gerenciamento de Projetos e aprendizagem',
        facilitator: {
          name: 'Carlos Andrade',
          imageURL: '',
        },
        trailsNumber: 40,
        image: {
          url: 'https://miro.medium.com/v2/resize:fit:1058/1*ci1A2ErPJuUdYUqfa45r0Q.png',
        },
      },
    });
    const cardComponent = screen.queryByTestId('alex-learningplan-card');
    expect(cardComponent).not.toBeNull();
  });
});
