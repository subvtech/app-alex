import { describe, it, expect, beforeEach } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/vue';
import { createI18n } from 'vue-i18n';
import { vuetify } from '@/plugins/vuetify';

import ExampleComponent from '@/components/alex/documentation/Example.vue';

// Test suite for ExampleComponent
describe('ExampleComponent', () => {
  const exampleProps = {
    snippets: [
      {
        template: `<alex-documentation-example
        v-for="item in examples"
        :snippets="item.snippets"
        :title="item.title"
        :description="item.description"
        :has-example="item.hasExample"
      >
        <template v-slot:component>
          <alex-profile-institution-item
            :url="institutionProps.url"
            :acronym="institutionProps.acronym"
            :sector="institutionProps.sector"
            :name="institutionProps.name"
            :can-edit="institutionProps.canEdit"
            :is-deleted="institutionProps.isDeleted"
            :institution-id="institutionProps.institutionId"
            :background-color="institutionProps.backgroundColor"
          />
        </template>
      </alex-documentation-example>`,
        label: 'Template',
      },
      {
        template: `const institutionProps: InstitutionComponentType = {
      url: 'https://picsum.photos/400/600',
      name: 'name',
      acronym: 'acronym',
      sector: 'sector',
      backgroundColor: 'bg-white',
      canEdit: true,
      isDeleted: false,
      institutionId: 1,
    };
    
   `,
        label: 'Script',
      },
    ],
    hasExample: true,
    title: 'Basic Usage',
    description: 'description',
  };

  const i18n = createI18n({
    messages: {
      pt: {},
      en: {},
    },
    locale: 'pt',
    legacy: false,
    missingWarn: false,
    globalInjection: true,
  });

  let rerenderBind: (props: object) => Promise<void>;
  beforeEach(() => {
    const { rerender } = render(ExampleComponent, {
      props: { ...exampleProps },
      global: {
        plugins: [vuetify, i18n],
      },
    });
    rerenderBind = rerender;
  });

  it('renders the component with description and no title', async () => {
    await rerenderBind({ ...exampleProps, title: undefined });

    const titleComponent = await screen.queryByText(exampleProps.title);
    const descriptionComponent = await screen.queryByText(
      exampleProps.description,
    );

    expect(titleComponent).toBeNull();
    expect(descriptionComponent).not.toBeNull();
  });

  it('renders the component with title and but not description ', async () => {
    await rerenderBind({ ...exampleProps, description: undefined });

    const titleComponent = await screen.queryByText(exampleProps.title);

    const descriptionComponent = await screen.queryByText(
      exampleProps.description,
    );
    expect(titleComponent).not.toBeNull();
    expect(descriptionComponent).toBeNull();
  });

  it('renders the component with template', async () => {
    await rerenderBind(exampleProps);

    const highlighterComponent = await screen.findByRole('code');

    const labelComponent = await screen.queryByText(
      exampleProps.snippets[0].label,
    );

    //if (labelComponent) await fireEvent.click(labelComponent);

    const Tabs = await screen.findByRole('tablist');
    const tabs = await within(Tabs).findAllByRole('tab');
    await fireEvent.click(tabs[0]);

    const templateComponent = await screen.queryAllByTestId('template');

    highlighterComponent.childNodes.forEach((item) => {
      console.log({ item: item.textContent });
    });

    expect(labelComponent).not.toBeNull();
    expect(templateComponent).not.toBeNull();
  });
  /*
  it('renders the component with script', async () => {
    const component = await renderSuspended(ExampleComponent, {
      props: { ...exampleProps },
      global: {
        plugins: [vuetify, i18n],
      },
    });

    const templateComponent = await component.findByText(
      exampleProps.snippets[1].template,
    );

    const labelComponent = await component.findByText(
      exampleProps.snippets[1].label,
    );

    expect(templateComponent).not.toBeNull();
    expect(labelComponent).not.toBeNull();
  });

  // Test case: Renders the Vuetify link when vuetifyLink prop is provided
  it('renders the Component with the example slot', async () => {
    const component = await renderSuspended(ExampleComponent, {
      props: { ...exampleProps },
      global: {
        plugins: [vuetify, i18n],
      },
    });

    const exampleComponent = (await component.getByRole(
      'example',
    )) as HTMLAnchorElement;

    expect(exampleComponent).not.toBeNull();
  });

  // Test case: Does not render the Vuetify link when vuetifyLink prop is not provided
  it('does not render the Component with the example slot', async () => {
    const component = await renderSuspended(ExampleComponent, {
      props: { ...exampleProps, hasExample: false },
      global: {
        plugins: [vuetify, i18n],
      },
    });

    const exampleComponent = (await component.queryByRole(
      'example',
    )) as HTMLAnchorElement;

    expect(exampleComponent).toBeNull();
  });*/
});
