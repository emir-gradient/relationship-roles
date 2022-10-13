export interface BlogUser {
  id: number;
  fullName: string;
}

export interface Post {
  id: string;
  authorId: number;
  guestEditors: BlogUser[];
  title: string;
  description: string;
}
