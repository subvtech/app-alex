import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { createI18n } from 'vue-i18n';
import { Mask } from 'maska';
import { vuetify } from '@/plugins/vuetify';
import OverviewComponent from '@/components/alex/profile/cards/Overview.vue';
import ptGeneralRules from '@/assets/locales/pt/components/profile/general.json';
import enGeneralRules from '@/assets/locales/en/components/profile/general.json';
import ptBoxesRules from '@/assets/locales/pt/components/appGeneralBoxes.json';
import enBoxesRules from '@/assets/locales/en/components/appGeneralBoxes.json';
// Test suite for OverviewComponent

describe('OverviewComponent', () => {
  // Test case: Renders the component with title and description
  const i18n = createI18n({
    messages: {
      pt: {
        components: {
          appGeneralBoxes: ptBoxesRules,
          profile: {
            general: ptGeneralRules,
          },
        },
      },
      en: {
        components: {
          appGeneralBoxes: enBoxesRules,
          profile: {
            general: enGeneralRules,
          },
        },
      },
    },
    locale: 'pt',
    legacy: false,
    missingWarn: false,
    globalInjection: true,
  });

  const mask = new Mask({ mask: '(##) #####-####' });
  const overviewProps = {
    email: 'email@gmail.com',
    telephone: '83981130647',
    learningPlans: 3,
    assignments: 1,
    projects: 2,
  };
  let rerenderBind: (props: object) => Promise<void>;

  beforeEach(() => {
    const { rerender } = render(OverviewComponent, {
      props: { ...overviewProps },
      global: {
        plugins: [vuetify, i18n],
      },
    });
    rerenderBind = rerender;
  });

  it('renders the component with the proper title', async () => {
    const titleComponent = await screen.getByText(ptGeneralRules.title);
    expect(titleComponent).not.toBeNull();
  });

  it('renders the component with the email and its proper label', async () => {
    const emailComponent = await screen.queryByText(overviewProps.email);

    const labelComponent = await screen.queryByText(ptGeneralRules.email);

    expect(emailComponent).not.toBeNull();

    expect(labelComponent).not.toBeNull();
  });

  it('does not render the component with the email and its label', async () => {
    await rerenderBind({ ...overviewProps, email: undefined });

    const emailComponent = await screen.queryByText(overviewProps.email);

    const labelComponent = await screen.queryByText(ptGeneralRules.email);

    expect(emailComponent).toBeNull();

    expect(labelComponent).toBeNull();
  });

  it('renders the component with the telephone and its proper label', async () => {
    const telephoneComponent = await screen.queryByText(
      mask.masked(overviewProps.telephone),
    );

    const labelComponent = await screen.queryByText(ptGeneralRules.telephone);
    expect(telephoneComponent).not.toBeNull();

    expect(labelComponent).not.toBeNull();
  });

  it('does not render the component with the telephone and its label', async () => {
    await rerenderBind({ ...overviewProps, telephone: undefined });

    const telephoneComponent = await screen.queryByText(
      overviewProps.telephone,
    );

    const labelComponent = await screen.queryByText(ptGeneralRules.telephone);

    expect(telephoneComponent).toBeNull();

    expect(labelComponent).toBeNull();
  });

  it('renders the component with the proper learningPlans count', async () => {
    const learningPlansCounter = await screen.queryByText(
      overviewProps.learningPlans,
    );

    expect(learningPlansCounter).not.toBeNull();
  });

  it("renders the component with the default learningPlans count '0'", async () => {
    await rerenderBind({ ...overviewProps, learningPlans: undefined });

    const learningPlansCounter = await screen.queryByText('0');

    expect(learningPlansCounter).not.toBeNull();
  });
  it('renders the component with the proper assignments count', async () => {
    const assignmentsCounter = await screen.queryByText(
      overviewProps.assignments,
    );

    expect(assignmentsCounter).not.toBeNull();
  });

  it("renders the component with the default assignments count '0'", async () => {
    await rerenderBind({ ...overviewProps, assignments: undefined });

    const assignmentsCounter = await screen.queryByText('0');

    expect(assignmentsCounter).not.toBeNull();
  });
  it('renders the component with the proper projects count', async () => {
    const projectsCounter = await screen.queryByText(overviewProps.projects);

    expect(projectsCounter).not.toBeNull();
  });

  it("renders the component with the default projects count '0'", async () => {
    await rerenderBind({ ...overviewProps, projects: undefined });

    const projectsCounter = await screen.queryByText('0');

    expect(projectsCounter).not.toBeNull();
  });
});
