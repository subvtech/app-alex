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

export type ChatMessage = Omit<Message, 'content'> & {
  content: {
    text?: string;
    audio?: {
      src: string;
      duration?: number;
    };
  };
};
