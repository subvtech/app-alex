import { useI18n } from 'vue-i18n';

export const usePagination = (search, page, items, itemName = 'course') => {
  const i18n = useI18n();
  const defaultItemName =
    itemName === 'course'
      ? i18n.t('pages.classes.tableHeaders.course')
      : itemName;
  const showingData = (groupedItems) => {
    const itemsPerPage = search.value === '' ? 12 : groupedItems.length;

    const from = (page.value - 1) * itemsPerPage + 1;
    const to =
      page.value * itemsPerPage > items.value.length
        ? items.value.length
        : page.value * itemsPerPage;
    const total = items.value.length;
    const message = i18n.t('pages.classes.showingData', {
      from,
      to,
      total,
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
