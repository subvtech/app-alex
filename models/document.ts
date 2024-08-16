import { DocumentCategory } from './documentCategory';
import { DocumentTemplate } from './documentTemplate';
import { DocumentFolder } from './documentFolder';

export interface Document {
  id: number;
  title: string;
  content?: object | string | null;
  doc_name?: string;
  document_folder?: DocumentFolder;
  document_templte?: DocumentTemplate;
  document_category?: DocumentCategory;
}
