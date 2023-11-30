import { describe, it, expect } from 'vitest';
import { renderSuspended } from 'nuxt-vitest/utils';
import { createI18n } from 'vue-i18n';
import { screen } from '@testing-library/vue';
import Card from '../../components/alex/learningplan/trails/Card.vue';
import ptRules from '@/assets/locales/pt/rules.json';
import ptLogin from '@/assets/locales/pt/pages/login.json';
import enRules from '@/assets/locales/en/rules.json';
import enLogin from '@/assets/locales/en/pages/login.json';

describe('Card of trails', () => {
  const i18n = createI18n({
    messages: {
      pt: { ptRules, ptLogin },
      en: { enRules, enLogin },
    },
    locale: 'pt',
    legacy: false,
    missingWarn: false,
    globalInjection: true,
  });

  it('Card should be defined', async () => {
    const { unmount } = await renderSuspended(Card, {
      props: {
        name: 'Gerenciamento de sistemas operacionais e projeto de redes utilizando o packet tracer',
        description:
          'Fala pessoal, tudo bem? Sejam bem vindos ao Plano de Aprendizagem sobre Gerenciamento de Projetos e aprendizagem',
        image: {
          url: 'https://segwitz.com/wp-content/uploads/2021/06/vuejs-development-malaysia.jpeg',
        },
      },
      global: {
        plugins: [i18n],
      },
    });
    const cardComponent = screen.queryByTestId('alex-learningplan-trails-card');
    expect(cardComponent).not.toBeNull();
    unmount();
  });
  it('Card should show button when hover card', async () => {
    const { unmount } = await renderSuspended(Card, {
      props: {
        name: 'Gerenciamento de sistemas operacionais e projeto de redes utilizando o packet tracer',
        description:
          'Fala pessoal, tudo bem? Sejam bem vindos ao Plano de Aprendizagem sobre Gerenciamento de Projetos e aprendizagem',
        image: {
          url: 'https://segwitz.com/wp-content/uploads/2021/06/vuejs-development-malaysia.jpeg',
        },
      },
      global: {
        plugins: [i18n],
      },
    });
    const cardComponent = screen.queryByTestId('alex-learningplan-trails-card');
    expect(
      cardComponent?.getElementsByClassName(
        'alex-learningplan-trails-card-hover',
      )[0].children.length,
    ).equals(1);
    unmount();
  });

  it('Card should be horizonta when props direction was "HORIZONTAL"', async () => {
    const { unmount } = await renderSuspended(Card, {
      props: {
        name: 'Gerenciamento de sistemas operacionais e projeto de redes utilizando o packet tracer',
        description:
          'Fala pessoal, tudo bem? Sejam bem vindos ao Plano de Aprendizagem sobre Gerenciamento de Projetos e aprendizagem',
        image: {
          url: 'https://segwitz.com/wp-content/uploads/2021/06/vuejs-development-malaysia.jpeg',
        },
        direction: 'HORIZONTAL',
      },
      global: {
        plugins: [i18n],
      },
    });
    const cardComponent = screen.queryByTestId('alex-learningplan-trails-card');
    expect(cardComponent?.classList.contains('horizontal-grid')).toBeTruthy();
    unmount();
  });
});
