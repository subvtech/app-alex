import { describe, it, expect } from 'vitest';
import { renderSuspended, mockNuxtImport } from 'nuxt-vitest/utils';
import { screen } from '@testing-library/vue';
import Card from '../../components/alex/learningplan/trails/Card.vue';

describe('Card of trails', () => {
  it('Card should be defined', async () => {
    mockNuxtImport('useI18n', () => 'msg');
    const { unmount } = await renderSuspended(Card, {
      props: {
        name: 'Gerenciamento de sistemas operacionais e projeto de redes utilizando o packet tracer',
        description:
          'Fala pessoal, tudo bem? Sejam bem vindos ao Plano de Aprendizagem sobre Gerenciamento de Projetos e aprendizagem',
        image: {
          url: 'https://segwitz.com/wp-content/uploads/2021/06/vuejs-development-malaysia.jpeg',
        },
      },
    });
    const cardComponent = screen.queryByTestId('alex-learningplan-trails-card');
    expect(cardComponent).not.toBeNull();
    unmount();
  });
});
