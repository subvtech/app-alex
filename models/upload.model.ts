export interface Upload {
  id: number;
  url: string;
  name?: string;
  ext?: string;
  size?: number;
  formats?: {
    small: {
      url: string;
    };
  };
}
