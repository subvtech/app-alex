type Format = {
  ext: string;
  url: string;
  hash: string;
  mime: string;
  name: string;
  path: string | null;
  size: number;
  width: number;
  height: number;
};

export interface Upload {
  alternativeText?: string | null;
  caption?: string | null;
  createdAt?: string;
  ext?: string;
  formats?: {
    medium: Format;
    small: Format;
    thumbnail: Format;
  };
  hash?: string;
  height?: number;
  id?: number;
  mime?: string;
  name?: string;
  previewUrl?: string | null;
  provider_metadata?: string | null;
  provider?: string;
  size?: number;
  updatedAt?: string;
  url: string;
  width?: number;
}
