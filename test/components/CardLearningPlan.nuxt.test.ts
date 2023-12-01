import { describe, it, expect } from 'vitest';
import { renderSuspended } from 'nuxt-vitest/utils';
import { fireEvent, screen } from '@testing-library/vue';
import Card from '../../components/alex/learningplan/Card/index.vue';

describe('Card of Project and Courses', () => {
  const props = {
    title:
      'Gerenciamento de sistemas operacionais e projeto de redes utilizando o packet tracer',
    description:
      'Fala pessoal, tudo bem? Sejam bem vindos ao Plano de Aprendizagem sobre Gerenciamento de Projetos e aprendizagem',
    facilitator: {
      name: 'Carlos Andrade',
      imageURL: '',
    },
    trailsCount: 40,
    image: {
      url: 'https://miro.medium.com/v2/resize:fit:1058/1*ci1A2ErPJuUdYUqfa45r0Q.png',
    },
  };

  it('Card should be defined', async () => {
    const { unmount } = await renderSuspended(Card, {
      props,
    });
    const cardComponent = screen.queryByTestId('alex-learningplan-card');
    expect(cardComponent).not.toBeNull();
    unmount();
  });

  it('Card should be show buttons when hover', async () => {
    const { unmount } = await renderSuspended(Card, {
      props,
    });
    const hoverComponent = screen.getByTestId(
      'alex-learningplan-card-hover-area',
    );
    await fireEvent.mouseOver(hoverComponent);
    const hasHoverClass = hoverComponent.classList.contains('hover');
    expect(hasHoverClass).toBeTruthy();
    unmount();
  });

  it('Card should be render chip of status when props type is course_project', async () => {
    const { unmount } = await renderSuspended(Card, {
      props: {
        ...props,
        type: 'course_project',
      },
    });
    const cardComponent = screen.queryByTestId(
      'alex-learningplan-card-status-chip',
    );
    expect(cardComponent).not.toBeNull();
    unmount();
  });

  it('Card should be render chip of status when props type is project', async () => {
    const { unmount } = await renderSuspended(Card, {
      props: {
        ...props,
        type: 'project',
      },
    });
    const cardComponent = screen.queryByTestId(
      'alex-learningplan-card-status-chip',
    );
    expect(cardComponent).not.toBeNull();
    unmount();
  });

  it('Card should not be render chip of status when props type is course', async () => {
    const { unmount } = await renderSuspended(Card, {
      props: {
        ...props,
        type: 'course',
      },
    });
    const cardComponent = screen.queryByTestId(
      'alex-learningplan-card-status-chip',
    );
    expect(cardComponent).toBeNull();
    unmount();
  });
});
