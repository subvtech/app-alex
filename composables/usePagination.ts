import { useI18n } from 'vue-i18n';

export const usePagination = (search, page, items, itemName = LearningPlanType.COURSE, entity = 'class') => {
  const i18n = useI18n();
  const entityNames = {
    class: i18n.t('pages.courses.classes'),
    group: i18n.t('pages.classes.groups'),
    member: i18n.t('pages.classes.participants'),
  };

  const entityName = entityNames[entity];

  const defaultItemName = itemName === LearningPlanType.COURSE ? i18n.t('pages.classes.tableHeaders.course') : itemName;
  const showingData = (groupedItems) => {
    const itemsPerPage = search.value === '' ? 12 : groupedItems.length;

    const from = (page.value - 1) * itemsPerPage + 1;
    const to = page.value * itemsPerPage > items.value.length ? items.value.length : page.value * itemsPerPage;
    const total = items.value.length;
    const message = i18n.t('pages.courses.showingData', {
      from,
      to,
      total,
      entity: entityName,
    });
    if (to === 0) {
      return i18n.t('pages.classes.noData', { object: defaultItemName });
    }
    return message;
  };

  return {
    showingData,
  };
};
