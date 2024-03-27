import { describe, it, expect, beforeEach } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/vue';
import { vuetify } from '@/plugins/vuetify';
import InstitutionItem from '@/components/alex/profile/InstitutionItem.vue';
// Test suite for InstitutionItem

describe('InstitutionItem', () => {
  const institutionItemProps = {
    url: 'https://picsum.photos/400/600',
    name: 'name',
    acronym: 'acronym',
    sector: 'sector',
    canEdit: true,
    isDeleted: false,
    backgroundColor: 'bg-gray-600',
    institutionId: 0,
  };

  let rerenderBind: (props: object) => Promise<void>;
  let component: Element;
  let emittedBind: {
    <T = unknown>(): Record<string, T[]>;
    <T = unknown>(name?: string | undefined): T[];
  };
  beforeEach(() => {
    const { rerender, emitted, container } = render(InstitutionItem, {
      props: { ...institutionItemProps },
      global: {
        plugins: [vuetify, i18n],
      },
    });
    rerenderBind = rerender;
    component = container;
    emittedBind = emitted;
  });

  it('renders the component with the proper sector', async () => {
    const sectorComponent = await screen.queryByText(
      institutionItemProps.sector,
    );
    expect(sectorComponent).not.toBeNull();
  });

  it('hides the component when isDeleted is true', async () => {
    await rerenderBind({
      ...institutionItemProps,
      isDeleted: true,
    });
    const institutionComponent = await component.querySelector('.d-none');
    expect(institutionComponent).not.toBeNull();

    const classArray = institutionComponent?.classList.value.split(' ');
    expect(classArray).toContain('d-none');
    expect(classArray).toContain(institutionItemProps.backgroundColor);
  });

  it('renders the component with the default backgroundColor', async () => {
    await rerenderBind({
      ...institutionItemProps,
      backgroundColor: undefined,
    });
    const institutionComponent = await component.querySelector('.bg-white');
    expect(institutionComponent).not.toBeNull();
    expect(institutionComponent?.classList.value.split(' ')).toContain(
      'bg-white',
    );
  });

  it('renders the component with the selected backgroundColor', async () => {
    await rerenderBind({
      ...institutionItemProps,
    });
    const institutionComponent = await component.querySelector(
      '.' + institutionItemProps.backgroundColor,
    );

    expect(institutionComponent).not.toBeNull();
    expect(institutionComponent?.classList.value.split(' ')).toContain(
      institutionItemProps.backgroundColor,
    );
  });

  it('renders the component with the proper acronym and name', async () => {
    const acronymComponent = await screen.queryByText(
      institutionItemProps.acronym + ' - ' + institutionItemProps.name,
    );
    expect(acronymComponent).not.toBeNull();
  });

  it('does not render the button when can-edit is false', async () => {
    await rerenderBind({
      ...institutionItemProps,
      canEdit: false,
    });
    const btnComponent = await component.querySelector('.remove');
    expect(btnComponent).toBeNull();
  });

  it('emits "delete:institution" when button is clicked and can-edit is true', async () => {
    const btnComponent = await component.querySelector('.remove');
    expect(btnComponent).not.toBeNull();
    expect(btnComponent?.classList.value.split(' ')).toContain('remove');

    // Simulate button click
    await fireEvent.click(btnComponent!);

    // Check if "update:wallet" event has been emitted
    expect(emittedBind()).toHaveProperty('delete:institution');
    expect(emittedBind()['delete:institution'][0]).toEqual([
      institutionItemProps.institutionId,
    ]); // Check the emitted value
  });

  it('renders the component with updated the proper acronym and name', async () => {
    await rerenderBind({
      ...institutionItemProps,
      acronym: 'dsa',
      name: 'sda',
    });
    const acronymComponent = await screen.queryByText('dsa - sda');
    expect(acronymComponent).not.toBeNull();
  });
});
