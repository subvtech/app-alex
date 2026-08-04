export type RubricGradeKey = '2.5' | '5' | '7.5' | '10';

export type RubricRow = {
  criterion: string;
} & Record<RubricGradeKey, string>;

export interface RubricPayload {
  title: string;
  data: RubricRow[];
}

export interface RubricEditContent {
  name: string;
  rubric_grade_levels: Array<{
    grade: number;
    grade_level_criterias: Array<{
      justification: string;
      evaluation_criterion: { id: number | null; name: string };
    }>;
  }>;
  task_submission_evaluations: unknown[];
  source_file_name?: string;
  create: boolean;
}

export const rubricGradeKeyMap: Array<{ key: RubricGradeKey; grade: number }> = [
  { key: '2.5', grade: 2.5 },
  { key: '5', grade: 5 },
  { key: '7.5', grade: 7.5 },
  { key: '10', grade: 10 },
];

const sanitizeTitle = (title: string): string => {
  const withoutExtension = title.replace(/\.[^/.]+$/, '').trim();
  return withoutExtension.length ? withoutExtension : title;
};

export const rubricPayloadToEditContent = (payload: RubricPayload, sourceName?: string): RubricEditContent => ({
  name: sanitizeTitle(payload.title),
  rubric_grade_levels: rubricGradeKeyMap.map(({ key, grade }) => ({
    grade,
    grade_level_criterias: payload.data.map((row) => ({
      justification: row[key] ?? '',
      evaluation_criterion: {
        id: null,
        name: row.criterion ?? '',
      },
    })),
  })),
  task_submission_evaluations: [],
  ...(sourceName ? { source_file_name: sourceName } : {}),
  create: true,
});

interface TipTapNode {
  type?: string;
  text?: string;
  content?: TipTapNode[];
}

export const tiptapToPlainText = (doc: unknown): string => {
  if (!doc) {
    return '';
  }

  let parsed: unknown = doc;

  if (typeof doc === 'string') {
    const trimmed = doc.trim();

    if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) {
      return trimmed;
    }

    try {
      parsed = JSON.parse(trimmed);
    } catch {
      return trimmed;
    }
  }

  const lines: string[] = [];

  const walk = (node: TipTapNode | undefined, depth: number) => {
    if (!node) return;

    if (node.type === 'text' && node.text) {
      lines[lines.length - 1] = `${lines[lines.length - 1] ?? ''}${node.text}`;
      return;
    }

    const isBlock = node.type !== 'text' && depth > 0;

    if (isBlock) {
      lines.push('');
    }

    node.content?.forEach((child) => walk(child, depth + 1));
  };

  walk(parsed as TipTapNode, 0);

  return lines
    .map((line) => line.trim())
    .filter(Boolean)
    .join('\n');
};
