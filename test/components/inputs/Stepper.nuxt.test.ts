import { describe, it, expect, beforeEach } from 'vitest';
import { screen, fireEvent, render, within } from '@testing-library/vue';
import { vuetify } from '../../../plugins/vuetify';
import StepperComponent from '@/components/alex/inputs/stepper/index.vue';

describe('Stepper component', () => {
  beforeEach(() => {
    render(StepperComponent, {
      global: {
        plugins: [vuetify],
      },
      slots: {
        step1: () => 'step1',
        step2: () => 'step2',
        step3: () => 'step3',
      },
    });
  });

  it('should render the stepper component', async () => {
    const stepper = await screen.findByRole('stepper');
    expect(stepper).not.toBeNull();
  });

  it('should have render slot 1', async () => {
    const step1 = await screen.findByText('step1');
    expect(step1).not.toBeNull();
  });

  it('should have render correct header', async () => {
    const titles = await screen.findAllByText('Title');
    const subtitles = await screen.findAllByText('Subtitle');
    expect(titles).toHaveLength(3);
    expect(subtitles).toHaveLength(3);
  });

  it('should have render slot 2 when click on next button', async () => {
    const stepper = await screen.findByRole('stepper');
    const nextButton = await within(stepper).findByText('Avançar');
    await fireEvent.click(nextButton);
    const step2 = await within(stepper).findByText('step2');
    const previousButton = await within(stepper).findByText('Voltar');
    expect(step2.innerText).toBe('step2');
    expect(step2.innerText).not.toBe('step1');
    expect(previousButton).not.toBeNull();
  });

  it('should have go back to slot 1 when click on previous button', async () => {
    const stepper = await screen.findByRole('stepper');
    const nextButton = await within(stepper).findByText('Avançar');
    await fireEvent.click(nextButton);
    const previousButton = await within(stepper).findByText('Voltar');
    expect(previousButton).not.toBeNull();
    await fireEvent.click(previousButton);
    const step1 = await within(stepper).findByText('step1');
    expect(step1.innerText).toBe('step1');
    expect(step1.innerText).not.toBe('step2');
  });
});
