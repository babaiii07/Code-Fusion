export interface Auth {
  preferred_username: string;
  picture: string;
  name: string;
  isLocalUse?: boolean;
}

export interface HtmlHistory {
  html: string;
  createdAt: Date;
  prompt: string;
}
