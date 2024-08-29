export interface DocumentTemplate {
  id: number;
  title: string;
  content: object | string | null;
  image?: any;
  doc_name?: string;
  documents?: Document[];
}
