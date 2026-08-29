import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import { vuetify } from '../../../../plugins/vuetify';
import MediaUploadComponent from '../../../../components/TipTap/custom-plugins/media-upload/Component.vue';

const i18n = createI18n({
  locale: 'pt',
  legacy: false,
  missingWarn: false,
  globalInjection: true,
  messages: {
    pt: {},
  },
});

describe('TipTap media upload component', () => {
  it('opens fullscreen when clicking the image in read-only mode', async () => {
    const wrapper = mount(MediaUploadComponent, {
      props: {
        node: {
          attrs: {
            media: {
              src: 'https://example.com/image.png',
              title: 'sample-image',
              id: null,
              size: 100,
              align: 'center',
              uploadKey: null,
              uploading: false,
            },
            format: 'image',
          },
        },
        extension: {
          options: {
            readOnly: () => true,
            uploadMedia: async () => ({
              success: true,
              url: 'https://example.com/image.png',
              title: 'sample-image',
              id: 1,
            }),
            deleteMedia: () => {},
          },
        },
        updateAttributes: () => {},
      },
      global: {
        plugins: [vuetify, i18n],
        stubs: {
          'node-view-wrapper': true,
          'alex-custom-button': true,
          'v-expand-transition': true,
          'v-overlay': { template: '<div><slot /></div>', props: ['modelValue'] },
          'v-progress-circular': true,
          'video-player': true,
          UploadModal: true,
          ImageMenu: true,
          Popover: true,
          PopoverTrigger: true,
          PopoverContent: true,
          'alex-custom-viewer': true,
        },
      },
    });

    await wrapper.vm.handleImageClick();

    expect(wrapper.vm.showFullscreen).toBe(true);
  });
});
