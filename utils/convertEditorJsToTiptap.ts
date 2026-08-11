/**
 * Converte blocos no formato Editor.js para o formato Tiptap/ProseMirror JSON.
 *
 * Uso:
 *   import { convertEditorJsBlocksToTiptap, isEditorJsFormat } from '~/utils/convertEditorJsToTiptap';
 *
 *   if (isEditorJsFormat(blocks)) {
 *     const doc = convertEditorJsBlocksToTiptap(blocks, extensions);
 *     editor.setContent(doc);
 *   }
 */
import { generateJSON } from '@tiptap/core';
import type { Extensions } from '@tiptap/core';

// ---------------------------------------------------------------------------
// Tipos auxiliares
// ---------------------------------------------------------------------------

interface EditorJsBlock {
  type: string;
  data: any;
  id?: string;
  tunes?: Record<string, any>;
  order?: number | null;
}

interface ProseMirrorNode {
  type: string;
  attrs?: Record<string, any>;
  content?: ProseMirrorNode[];
  marks?: Array<{ type: string; attrs?: Record<string, any> }>;
  text?: string;
}

interface ProseMirrorDoc {
  type: 'doc';
  content: ProseMirrorNode[];
}

// ---------------------------------------------------------------------------
// Heurística de detecção: formato Editor.js vs Tiptap/ProseMirror
// ---------------------------------------------------------------------------

/**
 * Retorna `true` se `blocks` é um array de objetos com `type` e `data`
 * (padrão Editor.js). Dados já salvos pelo Tiptap têm `{ type: "doc", ... }`.
 */
export function isEditorJsFormat(blocks: any): blocks is EditorJsBlock[] {
  return (
    Array.isArray(blocks) &&
    blocks.length > 0 &&
    typeof blocks[0] === 'object' &&
    blocks[0] !== null &&
    blocks[0].type !== undefined &&
    blocks[0].data !== undefined
  );
}

// ---------------------------------------------------------------------------
// Conversão principal
// ---------------------------------------------------------------------------

/**
 * Converte um array de blocos Editor.js em um documento ProseMirror JSON.
 *
 * @param blocks  – array de blocos `{ type, data, tunes?, id? }`
 * @param extensions – (opcional) extensões registradas no editor Tiptap, usadas
 *                     por `generateJSON()` para parsear HTML inline em marks.
 *                     Quando omitidas, faz fallback para texto puro (sem marks).
 */
export function convertEditorJsBlocksToTiptap(
  blocks: EditorJsBlock[],
  extensions?: Extensions,
): ProseMirrorDoc {
  const content: ProseMirrorNode[] = [];

  for (const block of blocks) {
    try {
      const node = convertBlock(block, extensions);
      if (node) {
        content.push(node);
      }
    } catch (err) {
      // Fallback seguro: nunca quebra o carregamento
      console.warn(`[convertEditorJsToTiptap] Erro ao converter bloco tipo "${block.type}":`, err);
      content.push(makeFallbackParagraph(block.type));
    }
  }

  return { type: 'doc', content };
}

// ---------------------------------------------------------------------------
// Router de tipos
// ---------------------------------------------------------------------------

function convertBlock(block: EditorJsBlock, extensions?: Extensions): ProseMirrorNode | null {
  const { type, data } = block;

  switch (type) {
    case 'header':
      return convertHeader(data, extensions);
    case 'paragraph':
      return convertParagraph(data, extensions);
    case 'image':
      return convertImage(data);
    case 'list':
      return convertList(data, extensions);
    case 'code':
      return convertCode(data);
    case 'embed':
      return convertEmbed(data);
    case 'fileSet':
      return convertFileSet(data);
    case 'alert':
      return convertAlert(data, extensions);
    case 'warning':
      return convertWarning(data, extensions);
    case 'quote':
      return convertQuote(data, extensions);
    case 'delimiter':
      return convertDelimiter();
    default:
      console.warn(`[convertEditorJsToTiptap] Tipo desconhecido: "${type}"`);
      return makeFallbackParagraph(type);
  }
}

// ---------------------------------------------------------------------------
// Conversores individuais
// ---------------------------------------------------------------------------

/**
 * header → heading
 * { text: "1. Introdução", level: 1 }
 * → { type: "heading", attrs: { level: 1 }, content: [...] }
 */
function convertHeader(
  data: { text?: string; level?: number },
  extensions?: Extensions,
): ProseMirrorNode {
  const level = data.level ?? 2;
  return {
    type: 'heading',
    attrs: { level },
    content: parseInlineContent(data.text ?? '', extensions),
  };
}

/**
 * paragraph → paragraph
 * data.text pode conter HTML inline (<b>, <a>, etc.)
 */
function convertParagraph(
  data: { text?: string },
  extensions?: Extensions,
): ProseMirrorNode {
  const text = data.text ?? '';
  if (!text) {
    return { type: 'paragraph' };
  }
  return {
    type: 'paragraph',
    content: parseInlineContent(text, extensions),
  };
}

/**
 * image → mediaUpload (node customizado do projeto)
 * { file: { url }, caption, stretched, withBorder, withBackground }
 * → { type: "mediaUpload", attrs: { media: { src, title, id, size, align }, format: "image" } }
 */
function convertImage(data: {
  file?: { url?: string };
  caption?: string;
  stretched?: boolean;
  withBorder?: boolean;
  withBackground?: boolean;
}): ProseMirrorNode {
  return {
    type: 'mediaUpload',
    attrs: {
      media: {
        src: data.file?.url ?? '',
        title: data.caption || '',
        id: null,
        size: 100,
        align: 'center',
      },
      format: 'image',
    },
  };
}

/**
 * list → bulletList | orderedList
 * data.style: "ordered" | "unordered" (ou ausente → bulletList)
 * data.items: [{ content, items: [...] }]
 */
function convertList(
  data: { items?: any[]; style?: string },
  extensions?: Extensions,
): ProseMirrorNode {
  const isOrdered = data.style === 'ordered';
  const listType = isOrdered ? 'orderedList' : 'bulletList';

  return {
    type: listType,
    content: convertListItems(data.items ?? [], extensions),
  };
}

function convertListItems(
  items: any[],
  extensions?: Extensions,
): ProseMirrorNode[] {
  return items.map((item) => {
    const listItem: ProseMirrorNode = {
      type: 'listItem',
      content: [],
    };

    // O conteúdo pode ser uma string simples (formato antigo) ou { content, items }
    const text = typeof item === 'string' ? item : item.content ?? '';
    const children: ProseMirrorNode[] = [];

    if (text) {
      children.push({
        type: 'paragraph',
        content: parseInlineContent(text, extensions),
      });
    }

    // Itens aninhados → sublista recursiva
    const nestedItems = typeof item === 'object' && Array.isArray(item.items) ? item.items : [];
    if (nestedItems.length > 0) {
      children.push({
        type: 'bulletList',
        content: convertListItems(nestedItems, extensions),
      });
    }

    listItem.content = children;
    return listItem;
  });
}

/**
 * code → codeBlock
 * { code: "..." }
 */
function convertCode(data: { code?: string }): ProseMirrorNode {
  return {
    type: 'codeBlock',
    content: data.code ? [{ type: 'text', text: data.code }] : [],
  };
}

/**
 * embed → mediaUpload com format "video"
 * { embed: "https://youtube.com/embed/...", source, caption, service, width, height }
 */
function convertEmbed(data: {
  embed?: string;
  source?: string;
  caption?: string;
  service?: string;
}): ProseMirrorNode {
  // Prefere a URL de embed (já no formato embeddable), fallback para source
  const src = data.embed || data.source || '';
  return {
    type: 'mediaUpload',
    attrs: {
      media: {
        src,
        title: data.caption || data.service || 'Video',
        id: null,
        size: 100,
        align: 'center',
      },
      format: 'video',
    },
  };
}

/**
 * fileSet → fileSet (node customizado do projeto)
 * data é um ARRAY de arquivos, não um objeto:
 * [{ id, url, size, title, extension }]
 * → { type: "fileSet", attrs: { files: [{ title, extension, size, id, url }] } }
 */
function convertFileSet(data: any): ProseMirrorNode {
  // data pode ser o array diretamente (formato confirmado no briefing)
  const filesArray = Array.isArray(data) ? data : [];

  return {
    type: 'fileSet',
    attrs: {
      files: filesArray.map((f: any) => ({
        title: f.title ?? 'Sem título',
        extension: f.extension ?? 'file',
        size: f.size ?? 0,
        id: f.id ?? null,
        url: f.url ?? '',
      })),
    },
  };
}

/**
 * alert → blockquote
 * { message: "...", text: "...", type: "info" }
 * → { type: "blockquote", content: [{ type: "paragraph", content: [...] }] }
 */
function convertAlert(
  data: { message?: string; text?: string; type?: string },
  extensions?: Extensions,
): ProseMirrorNode {
  const text = data.message || data.text || '';
  return {
    type: 'blockquote',
    content: [
      {
        type: 'paragraph',
        content: parseInlineContent(text, extensions),
      },
    ],
  };
}

/**
 * warning → blockquote
 * { title: "...", message: "..." }
 */
function convertWarning(
  data: { title?: string; message?: string; text?: string },
  extensions?: Extensions,
): ProseMirrorNode {
  const titleText = data.title ? `<b>${data.title}</b><br>` : '';
  const messageText = data.message || data.text || '';
  return {
    type: 'blockquote',
    content: [
      {
        type: 'paragraph',
        content: parseInlineContent(`${titleText}${messageText}`, extensions),
      },
    ],
  };
}

/**
 * quote → blockquote
 * { text: "...", caption: "..." }
 */
function convertQuote(
  data: { text?: string; caption?: string },
  extensions?: Extensions,
): ProseMirrorNode {
  const text = data.text || '';
  const caption = data.caption ? `<br><em>— ${data.caption}</em>` : '';
  return {
    type: 'blockquote',
    content: [
      {
        type: 'paragraph',
        content: parseInlineContent(`${text}${caption}`, extensions),
      },
    ],
  };
}

/**
 * delimiter → horizontalRule
 */
function convertDelimiter(): ProseMirrorNode {
  return {
    type: 'horizontalRule',
  };
}

// ---------------------------------------------------------------------------
// Parser de conteúdo inline (HTML → ProseMirror nodes com marks)
// ---------------------------------------------------------------------------

/**
 * Converte texto que pode conter tags HTML inline (<b>, <a>, <em>, etc.)
 * em um array de nós ProseMirror com marks.
 *
 * Usa `generateJSON()` do @tiptap/core quando extensions estão disponíveis,
 * para parsing robusto que lida com aninhamento e todas as extensions do editor.
 * Caso contrário, retorna texto puro.
 */
function parseInlineContent(html: string, extensions?: Extensions): ProseMirrorNode[] {
  if (!html) return [];

  // Se não tem tags HTML, retorna texto puro direto (otimização)
  if (!/<[^>]+>/.test(html)) {
    return [{ type: 'text', text: html }];
  }

  // Usa generateJSON do Tiptap se extensions disponíveis
  if (extensions) {
    try {
      // generateJSON espera um fragmento HTML completo;
      // envolve em <p> para garantir que é parseado como inline content
      const wrappedHtml = html.startsWith('<p>') ? html : `<p>${html}</p>`;
      const doc = generateJSON(wrappedHtml, extensions);

      // doc.content[0] é o parágrafo, queremos o conteúdo inline dele
      if (doc?.content?.[0]?.content) {
        return doc.content[0].content;
      }
    } catch (err) {
      console.warn('[convertEditorJsToTiptap] generateJSON falhou, usando texto puro:', err);
    }
  }

  // Fallback: strip de tags e texto puro
  const plainText = html.replace(/<[^>]+>/g, '');
  return plainText ? [{ type: 'text', text: plainText }] : [];
}

// ---------------------------------------------------------------------------
// Fallback
// ---------------------------------------------------------------------------

function makeFallbackParagraph(blockType: string): ProseMirrorNode {
  return {
    type: 'paragraph',
    content: [{ type: 'text', text: `[bloco não convertido: tipo ${blockType}]` }],
  };
}
