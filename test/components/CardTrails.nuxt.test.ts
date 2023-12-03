import { describe, it, expect } from 'vitest';
import { renderSuspended } from 'nuxt-vitest/utils';
import { createI18n } from 'vue-i18n';
import { fireEvent, screen } from '@testing-library/vue';
import Card from '@/components/alex/learningplan/trails/Card.vue';
import ptRules from '@/assets/locales/pt/components/learningplan/cardTrails.json';
import enRules from '@/assets/locales/en/components/learningplan/cardTrails.json';

describe('Card of trails', () => {
  const i18n = createI18n({
    messages: {
      pt: { ptRules },
      en: { enRules },
    },
    locale: 'pt',
    legacy: false,
    missingWarn: false,
    globalInjection: true,
  });

  const props = {
    name: 'Gerenciamento de sistemas operacionais e projeto de redes utilizando o packet tracer',
    description:
      'Fala pessoal, tudo bem? Sejam bem vindos ao Plano de Aprendizagem sobre Gerenciamento de Projetos e aprendizagem',
    image: {
      url: 'https://segwitz.com/wp-content/uploads/2021/06/vuejs-development-malaysia.jpeg',
    },
  };

  const global = {
    plugins: [i18n],
  };

  it('Card should be defined', async () => {
    const { unmount } = await renderSuspended(Card, {
      props,
      global,
    });
    const cardComponent = screen.queryByTestId('trails-card');
    expect(cardComponent).not.toBeNull();
    unmount();
  });

  it('Card should be show buttons when hover', async () => {
    const { unmount } = await renderSuspended(Card, {
      props,
      global,
    });
    const hoverComponent = screen.getByTestId('trails-card-hover-area');
    await fireEvent.mouseOver(hoverComponent);
    const hasHoverClass = hoverComponent.classList.contains('hover');
    expect(hasHoverClass).toBeTruthy();
    unmount();
  });
});
