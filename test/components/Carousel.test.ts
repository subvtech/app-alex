import { describe, it, expect } from 'vitest';
import { renderSuspended } from 'nuxt-vitest/utils';
import { screen, within, fireEvent } from '@testing-library/vue';
import { vuetify } from '../../plugins/vuetify';

import CarouselComponent from '@/components/alex/custom/carousel/index.vue';

describe('Accordion component', () => {
  it('should render the carousel component', async () => {
    const slides = [
      {
        title: 'Slide 1',
        type: 'image',
        image: 'https://picsum.photos/100/100',
      },
      {
        title: 'Slide 2',
        type: 'image',
        image: 'https://picsum.photos/100/100',
      },
      {
        title: 'Slide 3',
        type: 'image',
        image: 'https://picsum.photos/100/100',
      },
    ];

    renderSuspended(CarouselComponent, {
      props: {
        slides,
      },
      global: {
        plugins: [vuetify],
      },
    });
    const Carousel = await screen.findByRole('slider', {
      name: 'Slideshow',
    });
    expect(Carousel).not.toBeNull();
  });
  it('should render the carousel component with 3 slides', async () => {
    const slides = [
      {
        title: 'Slide 1',
        type: 'image',
        image: 'https://picsum.photos/100/100',
      },
      {
        title: 'Slide 2',
        type: 'image',
        image: 'https://picsum.photos/100/100',
      },
      {
        title: 'Slide 3',
        type: 'image',
        image: 'https://picsum.photos/100/100',
      },
      {
        title: 'Slide 4',
        type: 'image',
        image: 'https://picsum.photos/100/100',
      },
    ];
    renderSuspended(CarouselComponent, {
      props: {
        slides,
      },
      global: {
        plugins: [vuetify],
      },
    });
    const Carousel = await screen.findByRole('slider', {
      name: 'Slideshow',
    });
    const slidesCount = await within(Carousel).findAllByRole('img');
    expect(slidesCount).toHaveLength(4);
  });
  it('should render the carousel with 3 slides after deleting one', async () => {
    const slides = [
      {
        title: 'Slide 1',
        type: 'image',
        image: 'https://picsum.photos/100/100',
      },
      {
        title: 'Slide 2',
        type: 'image',
        image: 'https://picsum.photos/100/100',
      },
      {
        title: 'Slide 3',
        type: 'image',
        image: 'https://picsum.photos/100/100',
      },
      {
        title: 'Slide 4',
        type: 'image',
        image: 'https://picsum.photos/100/100',
      },
    ];
    renderSuspended(CarouselComponent, {
      props: {
        slides,
      },
      global: {
        plugins: [vuetify],
      },
    });
    const Carousel = await screen.findByRole('slider', {
      name: 'Slideshow',
    });
    const slidesCount = await within(Carousel).findAllByRole('img');
    expect(slidesCount).toHaveLength(4);
    const deleteButton = await within(slidesCount[3]).findByRole('button', {
      name: 'delete',
    });
    await fireEvent.click(deleteButton);
    const slidesCountAfterDelete = await within(Carousel).findAllByRole('img');
    expect(slidesCountAfterDelete).toHaveLength(3);
  });
  it('should change the active slide when clicked', async () => {
    const slides = [
      {
        title: 'Slide 1',
        type: 'image',
        image: 'https://picsum.photos/100/100',
      },
      {
        title: 'Slide 2',
        type: 'image',
        image: 'https://picsum.photos/100/100',
      },
      {
        title: 'Slide 3',
        type: 'image',
        image: 'https://picsum.photos/100/100',
      },
      {
        title: 'Slide 4',
        type: 'image',
        image: 'https://picsum.photos/100/100',
      },
      {
        title: 'Slide 5',
        type: 'image',
        image: 'https://picsum.photos/100/100',
      },
      {
        title: 'Slide 6',
        type: 'image',
        image: 'https://picsum.photos/100/100',
      },
      {
        title: 'Slide 7',
        type: 'image',
        image: 'https://picsum.photos/100/100',
      },
    ];
    renderSuspended(CarouselComponent, {
      props: {
        slides,
      },
      global: {
        plugins: [vuetify],
      },
    });
    const Carousel = await screen.findByRole('slider', {
      name: 'Slideshow',
    });
    const nextButton = await within(Carousel).findByRole('button', {
      name: 'Next',
    });
    await fireEvent.click(nextButton);
    const activeSlide = await within(Carousel).findByRole('img', {
      name: 'Slide 2',
    });

    expect(activeSlide.getAttribute('class')).toContain('vueperslide-active');
  });
});
