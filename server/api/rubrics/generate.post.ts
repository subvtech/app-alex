import Anthropic from '@anthropic-ai/sdk';

const MODEL = 'claude-opus-5';

const RUBRIC_SCHEMA = {
  type: 'object',
  properties: {
    title: {
      type: 'string',
      description: 'Nome curto da rubrica, referente ao que ela avalia.',
    },
    rows: {
      type: 'array',
      description: 'Uma linha por critério de avaliação.',
      items: {
        type: 'object',
        properties: {
          criterion: {
            type: 'string',
            description: 'Nome curto do critério (2 a 5 palavras).',
          },
          excellent: { type: 'string', description: 'Descritor para nota 10.' },
          good: { type: 'string', description: 'Descritor para nota 7,5.' },
          reasonable: { type: 'string', description: 'Descritor para nota 5.' },
          bad: { type: 'string', description: 'Descritor para nota 2,5.' },
        },
        required: ['criterion', 'excellent', 'good', 'reasonable', 'bad'],
        additionalProperties: false,
      },
    },
  },
  required: ['title', 'rows'],
  additionalProperties: false,
} as const;

const SYSTEM_PROMPT = `Você elabora rubricas de avaliação para professores do ensino superior brasileiro.

A rubrica é uma matriz: cada linha é um critério e cada coluna é um nível de desempenho (10, 7,5, 5 e 2,5).

Regras para os critérios:
- Cada critério avalia UMA dimensão observável do trabalho do estudante.
- Critérios não se sobrepõem entre si.
- Nomeie-os de forma curta e concreta ("Fundamentação teórica", não "Qualidade geral").
- Cubra o que a tarefa realmente pede; não invente exigências que não estão no enunciado.

Regras para os descritores de cada nível:
- Descreva o que o trabalho APRESENTA naquele nível, de forma observável — algo que dois avaliadores diferentes classificariam da mesma maneira.
- A progressão entre 2,5 → 5 → 7,5 → 10 deve variar na mesma dimensão (profundidade, precisão, completude), e não trocar de assunto.
- Escreva para o estudante ler e entender o que se espera dele.
- Uma ou duas frases por descritor. Sem rótulos de valor vazios como "excelente" ou "ruim" — descreva o desempenho.
- Nunca deixe um descritor vazio.

Escreva em português do Brasil.`;

interface GenerateRubricBody {
  taskTitle?: string;
  taskDescription?: string;
  learningGoals?: string[];
  criteriaCount?: number;
  extraInstructions?: string;
}

export default defineEventHandler(async (event) => {
  const anthropicApiKey = useRuntimeConfig(event).anthropicApiKey || process.env.ANTHROPIC_API_KEY;

  if (!anthropicApiKey) {
    throw createError({
      statusCode: 500,
      message: 'ANTHROPIC_API_KEY não configurada no servidor.',
    });
  }

  const body = await readBody<GenerateRubricBody>(event);
  const taskTitle = body?.taskTitle?.trim();

  if (!taskTitle) {
    throw createError({
      statusCode: 400,
      message: 'Informe ao menos o título da tarefa.',
    });
  }

  const criteriaCount = Math.min(Math.max(Number(body?.criteriaCount) || 5, 3), 8);
  const learningGoals = (body?.learningGoals ?? []).filter((goal) => goal?.trim());

  const contextParts = [`Título da tarefa: ${taskTitle}`];

  if (body?.taskDescription?.trim()) {
    contextParts.push(`Enunciado da tarefa:\n${body.taskDescription.trim()}`);
  }

  if (learningGoals.length) {
    contextParts.push(`Objetivos de aprendizagem:\n${learningGoals.map((goal) => `- ${goal}`).join('\n')}`);
  }

  if (body?.extraInstructions?.trim()) {
    contextParts.push(`Orientações do professor:\n${body.extraInstructions.trim()}`);
  }

  contextParts.push(
    `Gere EXATAMENTE ${criteriaCount} critérios — o array "rows" deve conter ${criteriaCount} itens, nem mais nem menos.`,
  );

  const client = new Anthropic({ apiKey: anthropicApiKey });

  try {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 16000,
      system: SYSTEM_PROMPT,
      output_config: {
        format: { type: 'json_schema', schema: RUBRIC_SCHEMA },
      },
      messages: [{ role: 'user', content: contextParts.join('\n\n') }],
    });

    if (response.stop_reason === 'refusal') {
      throw createError({
        statusCode: 422,
        message: 'O modelo recusou gerar a rubrica para este conteúdo.',
      });
    }

    const textBlock = response.content.find((block) => block.type === 'text');

    if (!textBlock || textBlock.type !== 'text') {
      throw createError({
        statusCode: 502,
        message: 'Resposta do modelo veio sem conteúdo.',
      });
    }

    const rubric = JSON.parse(textBlock.text) as {
      title: string;
      rows: Array<Record<string, string>>;
    };

    return {
      title: rubric.title,
      data: rubric.rows.map((row) => ({
        criterion: row.criterion,
        '10': row.excellent,
        '7.5': row.good,
        '5': row.reasonable,
        '2.5': row.bad,
      })),
      usage: {
        input_tokens: response.usage.input_tokens,
        output_tokens: response.usage.output_tokens,
      },
    };
  } catch (error: any) {
    if (error?.statusCode) {
      throw error;
    }

    console.error('[rubrics/generate]', error);

    throw createError({
      statusCode: error?.status ?? 502,
      message: error?.message ?? 'Falha ao gerar a rubrica.',
    });
  }
});
