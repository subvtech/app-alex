import { describe, it, expect } from 'vitest';
import { renderSuspended } from 'nuxt-vitest/utils';
import { screen } from '@testing-library/vue';
import Dialog from '../../components/alex/custom/dialog/index.vue';
import Header from '../../components/alex/custom/dialog/Header.vue';
import Footer from '../../components/alex/custom/dialog/Footer.vue';

describe('Dialog', () => {
  it('Dialog should be defined', async () => {
    const { unmount } = await renderSuspended(Dialog, {
      attrs: {},
    });
    const bar = screen.queryByTestId('alex-dialog');
    expect(bar).not.toBeNull();
    unmount();
  });

  it('Title must be rendered', async () => {
    const title = 'Criar curso';
    const { unmount } = await renderSuspended(Dialog, {
      attrs: {
        title,
      },
    });
    const titleComponent = screen.getByText(title);
    expect(titleComponent).not.toBeNull();

    unmount();
  });
});

describe('Header Dialog', () => {
  it('Header should be defined', async () => {
    const { unmount } = await renderSuspended(Header, {
      attrs: {},
    });
    const header = screen.queryByTestId('alex-dialog-header');
    expect(header).not.toBeNull();
    unmount();
  });

  it('Title must be rendered', async () => {
    const title = 'Criar um projeto';
    const { unmount } = await renderSuspended(Header, {
      attrs: {
        title,
      },
    });
    const titleComponent = screen.getByText(title);
    expect(titleComponent).not.toBeNull();

    unmount();
  });

  it('Highlight must be rendered', async () => {
    const title = 'Criar curso com';
    const highlight = '#222';
    const { unmount } = await renderSuspended(Header, {
      attrs: {
        title,
        highlight,
      },
    });
    const highlightComponent = screen.getByText(highlight);
    expect(highlightComponent).not.toBeNull();

    unmount();
  });
});

describe('Footer Dialog', () => {
  it('Footer should be defined', async () => {
    const { unmount } = await renderSuspended(Footer, {
      attrs: {},
    });
    const bar = screen.queryByTestId('alex-dialog-footer');
    expect(bar).not.toBeNull();
    unmount();
  });
});
