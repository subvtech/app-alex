export interface Message {
  id: number;
  user: {
    name: string;
    avatar?: string | null;
  };
  content?: {
    text?: string;
    audio?: string;
  };
  date: Date;
  current?: boolean;
  reference?: Message;
}
