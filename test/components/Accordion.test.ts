import { describe, it, expect } from 'vitest';
import { renderSuspended } from 'nuxt-vitest/utils';
import { screen, within, fireEvent } from '@testing-library/vue';
import { vuetify } from '../../plugins/vuetify';

import AccordionComponent from '../../components/alex/custom/Accordion.vue';

describe('Accordion component', () => {
  it('should render the Accordion component', async () => {
    renderSuspended(AccordionComponent, {
      props: {
        data: [
          {
            keyWord: 'Melhorar',
            text: 'o aprendizado do aluno por meio de metodologias funcionais',
            contentData: {
              title: 'Titulo',
              text: 'Texto',
            },
          },
          {
            keyWord: 'Pesquisar',
            text: 'o aprendizado do aluno por meio de metodologias funcionais.',
            contentData: {
              title: 'Titulo 2',
              text: 'Texto 2',
            },
          },
          {
            keyWord: 'Criar',
            text: 'o aprendizado do aluno por meio de metodologias funcionais. ',
            contentData: {
              title: 'Titulo 3',
              text: 'Texto 3',
            },
          },
          {
            text: 'Image',
            icon: 'mdi-image',
            contentData: {
              title: 'Titulo 4',
              text: 'Texto 4',
            },
          },
          {
            text: 'Video',
            icon: 'mdi-video',
            contentData: {
              title: 'Titulo 5',
              text: 'Texto 5',
            },
          },
        ],
      },
      global: {
        plugins: [vuetify],
      },
    });
    const Accordion = await screen.findByRole('list');
    expect(Accordion).toBeDefined();
  });

  it('should have 5 accordions', async () => {
    const Accordion = await screen.findByRole('list');
    const accordions = await within(Accordion).findAllByRole('listItem');
    expect(accordions).toHaveLength(5);
  });

  it('should change the item status when clicked', async () => {
    const Accordion = await screen.findByRole('list');
    const accordions = await within(Accordion).findAllByRole('listItem');
    const pannelButton = await within(accordions[1]).findAllByRole('button');
    await fireEvent.click(pannelButton[0]);
    expect(accordions[1].getAttribute('class')).toContain(
      'v-expansion-panel--active',
    );
    await fireEvent.click(pannelButton[0]);
    expect(accordions[1].getAttribute('class')).not.toContain(
      'v-expansion-panel--active',
    );
  });

  it('should change the item positions with drag and drop', async () => {
    const Accordion = await screen.findByRole('list');
    const accordions = await within(Accordion).findAllByRole('listItem');
    const dragIndex = 1;
    const dropIndex = 3;
    const dragButton = await within(accordions[dragIndex]).findByTestId(
      'dragItem',
    );
    const dataTransfer = {
      setData: function () {},
      setDragImage: function () {},
      effectAllowed: null,
    };

    const originalAcordion = accordions[dragIndex];
    await fireEvent.dragStart(dragButton, { dataTransfer });
    await fireEvent.dragOver(accordions[dropIndex], { dataTransfer });
    await fireEvent.dragEnd(accordions[dragIndex], { dataTransfer });
    const newAccordion = await screen.findByRole('list');
    const newAccordions = await within(newAccordion).findAllByRole('listItem');
    expect(newAccordions[dropIndex]).toBe(originalAcordion);
  });

  it('should delete them item when clicked on the trash button', async () => {
    const Accordion = await screen.findByRole('list');
    let accordions = await within(Accordion).findAllByRole('listItem');
    const AccordionToBeDeleted = accordions[1];
    const pannelButton =
      await within(AccordionToBeDeleted).findAllByRole('button');
    await fireEvent.click(pannelButton[1]);
    accordions = await within(Accordion).findAllByRole('listItem');
    expect(accordions).toHaveLength(4);
    expect(accordions).not.toContain(AccordionToBeDeleted);
  });
});
