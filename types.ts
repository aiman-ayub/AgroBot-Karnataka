export enum Sender {
  User = 'user',
  Bot = 'bot',
}

export interface Message {
  id: string;
  text: string;
  sender: Sender;
  imageUrl?: string; // For displaying user-uploaded images
}

export enum Language {
  EN = 'en-US',
  KN = 'kn-IN',
}