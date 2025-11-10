<template>
  <div class="bg-white rounded w-100 tw-h-full tw-flex tw-flex-col tw-items-stretch">
    <!-- Header -->
    <div class="pa-6 d-flex tw-items-center sm:tw-justify-between tw-justify-center tw-flex-wrap ga-6">
      <alex-inputs-text-field
        v-model="search"
        class="rubric-textfield tw-max-w-[320px] tw-flex-[1_1_150px]"
        :placeholder="$t(`${i18Dir}.search`)"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        name="search"
        size="default"
        density="comfortable"
      />

      <div class="d-flex ga-4 items-center">
        <input ref="fileInputRef" type="file" accept=".csv" class="tw-hidden" @change="onCsvFileChange" />
        <alex-custom-button
          text="Importar"
          prepend-icon="mdi-upload"
          variant="secondary"
          size="large"
          @click="handleImportClick"
        />
        <alex-custom-button :text="$t(`${i18Dir}.new`)" size="large" @click="() => (createModal = true)" />
      </div>
    </div>

    <!-- Content -->
    <v-data-table
      class="create-rubrics-table px-6 pb-6 tw-flex-1"
      :headers="headers"
      :items="filteredItems"
      :items-per-page="itemsPerPage"
    >
      <template #headers="{ columns, getSortIcon, toggleSort }"
        ><tr>
          <template v-for="column in columns" :key="column.key">
            <td>
              <div class="tw-cursor-pointer d-flex align-center" @click="() => toggleSort(column)">
                <span class="text-body-2 text-gray-600 mr-2 tw-leading-none">{{ column.title }}</span>

                <!-- Sort icons -->
                <v-icon v-if="column.sortable" :icon="getSortIcon(column)" color="#ABB2B9"></v-icon>
              </div>
            </td>
          </template></tr
      ></template>

      <!-- Content -->
      <template #item.name="{ value }">
        <p class="text-body-4 text-gray-900">{{ value }}</p>
      </template>

      <template #item.criteria="{ value: criterias }">
        <div class="d-flex align-center tw-overflow-x-auto" style="gap: 10px">
          <alex-custom-chip
            v-for="criteria in criterias"
            :key="criteria"
            :text="criteria"
            status="secondary"
            size="small"
          />
        </div>
      </template>

      <template #item.options="{ value }">
        <div class="d-flex align-center tw-justify-end">
          <alex-custom-dropdown
            :items="[
              {
                text: $t('pages.evaluations.rubrics.edit'),
                onClick: () => editRubric(value),
              },
              {
                text: $t('pages.evaluations.rubrics.delete'),
                warning: true,
                onClick: () => deleteRubric(value),
              },
            ]"
          >
            <template #activator="{ props }">
              <v-icon v-bind="props" class="tw-ml-auto" color="gray-600">mdi-dots-vertical</v-icon>
            </template>
          </alex-custom-dropdown>
        </div></template
      >

      <template #no-data><Empty :empty-message="$t('pages.evaluations.rubrics.empty')" /></template>

      <!-- Pagination -->
      <template #bottom
        ><div
          v-if="filteredItems.length"
          class="d-flex tw-justify-between md:tw-flex-row tw-flex-col align-center tw-flex-wrap py-6 tw-gap-[8px] tw-text-center md:tw-text-start"
        >
          <p
            class="tw-flex-1 tw-min-w-[250px] text-body-3 text-gray-600 !tw-leading-none"
            :class="paginationLength === 1 && 'text-center'"
          >
            {{ paginationText }}
          </p>
          <alex-custom-pagination
            v-if="paginationLength > 1"
            v-model="activePage"
            :length="paginationLength"
            total-visible="5"
          /></div
      ></template>
    </v-data-table>

    <CreateModal v-model="createModal" :edit-content="editContent" @update="refresh" />
  </div>
</template>
<script setup lang="ts">
import Empty from './-components/EmptyState.vue';
import CreateModal from './-components/rubrics/Create.vue';

const itemsPerPage = 10;
const i18Dir = 'pages.evaluations.rubrics';

const { t } = useI18n();
const user = useStrapiUser();
const { setMessage } = useMessageStore();
const { getUserEvaluationGroupsByType, deleteUserEvaluationGroupMutation } = useTaskEvaluation(0, 0, user);

const { data: items, refetch: refresh } = getUserEvaluationGroupsByType({ value: 'rubric' });
const { mutateAsync: deleteUserEvaluationGroup } = deleteUserEvaluationGroupMutation();

const headers = [
  { title: t(`${i18Dir}.name`), key: 'name' },
  { title: t(`${i18Dir}.criteria`), key: 'criteria' },
  { key: 'options', sortable: false },
];

const search = ref<string>('');
const activePage = ref<number>(1);
const createModal = ref<boolean>(false);
const editContent = ref<null | any>(null);
const fileInputRef = ref<HTMLInputElement | null>(null);

// const items = ref([]);

const filteredItems = computed(() => {
  const filtered =
    items.value?.filter((rubric) => {
      if (rubric.name.toLowerCase().includes(search.value.toLocaleLowerCase())) {
        return true;
      }

      if (rubric.evaluation_criterias.some(({ name }) => name.toLowerCase().includes(search.value.toLowerCase()))) {
        return true;
      }

      return false;
    }) ?? [];

  const sliced = filtered.slice(
    (activePage.value - 1) * itemsPerPage,
    Math.min(activePage.value * itemsPerPage, filtered.length),
  );

  return (
    sliced.map((rubric) => ({
      name: rubric.name,
      criteria: rubric.evaluation_criterias.map(({ name }) => name),
      options: rubric,
    })) ?? []
  );
});

const totalItems = computed<number>(() => items.value?.length ?? 0);

const paginationLength = computed<number>(() => {
  const add = totalItems.value % itemsPerPage ? 1 : 0;
  return Math.floor(totalItems.value / itemsPerPage + add) || 1;
});

const paginationText = computed<string>(() => {
  const from = (activePage.value - 1) * itemsPerPage + 1;
  const to = Math.min(activePage.value * itemsPerPage, filteredItems.value.length);
  const total = totalItems.value;

  return t(`${i18Dir}.pagination`, {
    from,
    to,
    total,
  });
});

const editRubric = (rubric) => {
  editContent.value = rubric;
  createModal.value = true;
};

const deleteRubric = async (rubric) => {
  if (rubric.task_submission_evaluations.length) {
    setMessage(t(`${i18Dir}.associated`), 'error', true);
    return;
  }

  try {
    await deleteUserEvaluationGroup(rubric.id);
    await refresh();
    setMessage(t(`${i18Dir}.deleteSuccess`), 'success', true);
  } catch (e) {
    console.error(e);
    setMessage(t(`${i18Dir}.deleteFail`), 'error', true);
  }
};

// Importar rubrica por CSV
type RubricRow = {
  criterion: string;
  '2.5': string;
  '5': string;
  '7.5': string;
  '10': string;
};

type RubricPayload = {
  title: string;
  data: RubricRow[];
};

type RubricGradeKey = '2.5' | '5' | '7.5' | '10';

type ImportedEvaluationCriterion = {
  id: number | null;
  name: string;
};

type ImportedGradeLevelCriteria = {
  justification: string;
  evaluation_criterion: ImportedEvaluationCriterion;
};

type ImportedRubricGradeLevel = {
  grade: number;
  grade_level_criterias: ImportedGradeLevelCriteria[];
};

type ImportedEditContent = {
  name: string;
  rubric_grade_levels: ImportedRubricGradeLevel[];
  task_submission_evaluations: unknown[];
  source_file_name?: string;
};

const gradeKeyMap: Array<{ key: RubricGradeKey; grade: number }> = [
  { key: '2.5', grade: 2.5 },
  { key: '5', grade: 5 },
  { key: '7.5', grade: 7.5 },
  { key: '10', grade: 10 },
];

const stripBom = (value: string): string => {
  if (!value.length) {
    return value;
  }

  return value.charCodeAt(0) === 0xfeff ? value.slice(1) : value;
};

const detectDelimiter = (text: string): string => {
  const firstLine = text.split(/\r?\n/).find((line) => line.trim().length > 0) ?? '';
  return firstLine.includes(';') ? ';' : ',';
};

const parseCsvRows = (text: string, delimiter: string): string[][] => {
  const rows: string[][] = [];
  let row: string[] = [];
  let current = '';
  let insideQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];

    if (char === '"') {
      if (insideQuotes && text[index + 1] === '"') {
        current += '"';
        index += 1;
      } else {
        insideQuotes = !insideQuotes;
      }

      continue;
    }

    if (!insideQuotes && char === delimiter) {
      row.push(current.trim());
      current = '';
      continue;
    }

    if (!insideQuotes && (char === '\n' || char === '\r')) {
      if (char === '\r' && text[index + 1] === '\n') {
        index += 1;
      }

      row.push(current.trim());
      rows.push(row);
      row = [];
      current = '';
      continue;
    }

    current += char;
  }

  if (current.length || row.length) {
    row.push(current.trim());
    rows.push(row);
  }

  return rows;
};

const extractLeadingNumber = (value: string): number | null => {
  const match = value.match(/^\s*([\d]+(?:[.,]\d+)?)/);

  if (!match) {
    return null;
  }

  const numericValue = Number(match[1].replace(',', '.'));
  return Number.isNaN(numericValue) ? null : numericValue;
};

const buildRubricPayloadFromCsv = (csvText: string, file: File): RubricPayload => {
  const cleanedText = stripBom(csvText);
  const delimiter = detectDelimiter(cleanedText);
  const parsedRows = parseCsvRows(cleanedText, delimiter)
    .map((row) => row.map((cell) => cell.trim()))
    .filter((row) => row.some((cell) => cell.length));

  if (!parsedRows.length) {
    throw new Error('CSV sem conteudo.');
  }

  const [header, ...dataRows] = parsedRows;

  if (!header || header.length < 2) {
    throw new Error('CSV sem cabecalho valido.');
  }

  const findScoreColumnIndex = (score: number): number =>
    header.findIndex((cell) => extractLeadingNumber(cell) === score);

  const scoreColumns = {
    twoFive: findScoreColumnIndex(2.5),
    five: findScoreColumnIndex(5),
    sevenFive: findScoreColumnIndex(7.5),
    ten: findScoreColumnIndex(10),
  };

  if (Object.values(scoreColumns).some((index) => index < 0)) {
    throw new Error('CSV nao possui colunas esperadas.');
  }

  const rubricRows: RubricRow[] = dataRows
    .map((row) => {
      const criterion = (row[0] ?? '').trim();

      if (!criterion.length) {
        return null;
      }

      const getCell = (columnIndex: number): string =>
        columnIndex >= 0 && columnIndex < row.length ? (row[columnIndex] ?? '').trim() : '';

      return {
        criterion,
        '2.5': getCell(scoreColumns.twoFive),
        '5': getCell(scoreColumns.five),
        '7.5': getCell(scoreColumns.sevenFive),
        '10': getCell(scoreColumns.ten),
      };
    })
    .filter((row): row is RubricRow => Boolean(row));

  if (!rubricRows.length) {
    throw new Error('CSV nao possui linhas de rubrica.');
  }

  return {
    title: file.name.replaceAll('_', ' ').replaceAll('-', ' ').replace('.csv', '').trim(),
    data: rubricRows,
  };
};

const sanitizeTitle = (title: string): string => {
  const withoutExtension = title.replace(/\.[^/.]+$/, '').trim();
  return withoutExtension.length ? withoutExtension : title;
};

const rubricPayloadToEditContent = (payload: RubricPayload, file: File): ImportedEditContent => {
  const rubricName = sanitizeTitle(payload.title);

  const rubric_grade_levels = gradeKeyMap.map(({ key, grade }) => ({
    grade,
    grade_level_criterias: payload.data.map((row) => ({
      justification: row[key] ?? '',
      evaluation_criterion: {
        id: null,
        name: row.criterion ?? '',
      },
    })),
  }));

  return {
    name: rubricName,
    rubric_grade_levels,
    task_submission_evaluations: [],
    source_file_name: file.name,
    create: true,
  };
};

const handleImportClick = () => {
  fileInputRef.value?.click();
};

const resetFileInput = () => {
  if (fileInputRef.value) {
    fileInputRef.value.value = '';
  }
};

const onCsvFileChange = async (event: Event) => {
  const input = event.target as HTMLInputElement | null;
  const file = input?.files?.[0];

  if (!file) {
    resetFileInput();
    return;
  }

  if (!file.name.toLowerCase().endsWith('.csv')) {
    setMessage('Selecione um arquivo .csv valido.', 'error', true);
    resetFileInput();
    return;
  }

  let csvText = '';

  try {
    csvText = await file.text();
  } catch (error) {
    console.error(error);
    setMessage('Nao foi possivel ler o arquivo selecionado.', 'error', true);
    resetFileInput();
    return;
  }

  try {
    const importedContent = handleCsvImport(csvText, file);
    console.info('Rubric payload pronto para uso.', importedContent);
    setMessage('CSV importado com sucesso.', 'success', true);
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : 'Nao foi possivel processar o csv.';
    setMessage(message, 'error', true);
  } finally {
    resetFileInput();
  }
};

const handleCsvImport = (csvText: string, file: File): ImportedEditContent => {
  const payload = buildRubricPayloadFromCsv(csvText, file);
  const converted = rubricPayloadToEditContent(payload, file);
  editContent.value = converted;
  createModal.value = true;
  return converted;
};

watch(createModal, (open) => {
  if (!open) {
    editContent.value = null;
  }
});
</script>
<style>
.rubric-textfield .v-input__details {
  display: none;
}

.create-rubrics-table thead tr:first-child,
.create-rubrics-table tbody tr:last-child {
  border-bottom: 1px #ebedef solid !important;
}

.create-rubrics-table .v-data-table__wrapper > table {
  border-spacing: 0 16px !important;
}
</style>
