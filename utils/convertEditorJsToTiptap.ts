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
    case 'warning':
      return convertAlert(data, extensions);
    case 'linkTool':
    case 'link':
      return convertLink(data, extensions);
    case 'table':
      return convertTable(data, extensions);
    case 'carousel':
      return convertCarousel(data);
    case 'delimiter':
      return convertDelimiter();
    case 'quote':
      return convertQuote(data, extensions);
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

  // Se não tem tags HTML, decodifica entidades e retorna texto puro (otimização)
  if (!/\<[^>]+\>/.test(html)) {
    const decoded = decodeHtmlEntities(html);
    return [{ type: 'text', text: decoded }];
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
  const decoded = decodeHtmlEntities(plainText);
  return decoded ? [{ type: 'text', text: decoded }] : [];
}

/**
 * Decodifica entidades HTML comuns (&nbsp;, &amp;, &lt;, &gt;, &quot;, &#39;, etc.)
 */
function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&#x27;/gi, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code, 10)));
}

// ---------------------------------------------------------------------------
// alert / warning → blockquote
// { message: "Atenção: ...", type?: "info" | "warning" | ... }
// ---------------------------------------------------------------------------

function convertAlert(
  data: { message?: string; text?: string },
  extensions?: Extensions,
): ProseMirrorNode {
  const text = data.message || data.text || '';
  if (!text) {
    return { type: 'blockquote', content: [{ type: 'paragraph' }] };
  }
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

// ---------------------------------------------------------------------------
// link / linkTool → paragraph com texto linkado
// { link: "https://...", meta: { title, description, image: { url } } }
// ---------------------------------------------------------------------------

function convertLink(
  data: { link?: string; meta?: { title?: string; description?: string; image?: { url?: string } } },
  extensions?: Extensions,
): ProseMirrorNode {
  const url = data.link || '';
  const title = data.meta?.title || url;
  const description = data.meta?.description || '';

  const content: ProseMirrorNode[] = [
    {
      type: 'text',
      text: title,
      marks: url ? [{ type: 'link', attrs: { href: url, target: '_blank' } }] : [],
    },
  ];

  // Se tem descrição, adiciona como segundo parágrafo
  if (description) {
    return {
      type: 'blockquote',
      content: [
        { type: 'paragraph', content },
        {
          type: 'paragraph',
          content: parseInlineContent(description, extensions),
        },
      ],
    };
  }

  return { type: 'paragraph', content };
}

// ---------------------------------------------------------------------------
// table → table > tableRow > tableCell
// { content: [["col1","col2"],["a","b"]], withHeadings?: boolean }
// ---------------------------------------------------------------------------

function convertTable(
  data: { content?: string[][]; withHeadings?: boolean },
  extensions?: Extensions,
): ProseMirrorNode {
  const rows = data.content || [];
  if (!rows.length) {
    return { type: 'paragraph' };
  }

  return {
    type: 'table',
    content: rows.map((row, rowIndex) => ({
      type: 'tableRow',
      content: row.map((cellHtml) => ({
        type: data.withHeadings && rowIndex === 0 ? 'tableHeader' : 'tableCell',
        content: [
          {
            type: 'paragraph',
            content: cellHtml ? parseInlineContent(cellHtml, extensions) : [],
          },
        ],
      })),
    })),
  };
}

// ---------------------------------------------------------------------------
// carousel → sequência de mediaUpload (imagens)
// data é array: [{ title, image, type, video, url }]
// ---------------------------------------------------------------------------

function convertCarousel(data: any): ProseMirrorNode {
  // data do carousel é o array de slides diretamente
  const slides = Array.isArray(data) ? data : [];

  if (!slides.length) {
    return { type: 'paragraph', content: [{ type: 'text', text: '[carousel vazio]' }] };
  }

  // Cada slide vira um mediaUpload de imagem ou vídeo
  // Retorna um wrapper doc-level: como convertBlock retorna um único nó,
  // usamos um blockquote para agrupar os slides
  return {
    type: 'blockquote',
    content: slides.map((slide: any) => {
      const src = slide.image || slide.video || slide.url || '';
      const isVideo = !!(slide.video || slide.type === 'video');
      return {
        type: 'mediaUpload',
        attrs: {
          media: {
            src,
            title: slide.title || '',
            id: slide.imgId || slide.videoId || null,
            size: 100,
            align: 'center',
          },
          format: isVideo ? 'video' : 'image',
        },
      };
    }),
  };
}

// ---------------------------------------------------------------------------
// delimiter → horizontalRule
// ---------------------------------------------------------------------------

function convertDelimiter(): ProseMirrorNode {
  return { type: 'horizontalRule' };
}

// ---------------------------------------------------------------------------
// quote → blockquote
// { text: "...", caption: "...", alignment: "left" }
// ---------------------------------------------------------------------------

function convertQuote(
  data: { text?: string; caption?: string; alignment?: string },
  extensions?: Extensions,
): ProseMirrorNode {
  const content: ProseMirrorNode[] = [];

  if (data.text) {
    content.push({
      type: 'paragraph',
      content: parseInlineContent(data.text, extensions),
    });
  }

  if (data.caption) {
    content.push({
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: `— ${data.caption}`,
          marks: [{ type: 'italic' }],
        },
      ],
    });
  }

  if (!content.length) {
    content.push({ type: 'paragraph' });
  }

  return { type: 'blockquote', content };
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
