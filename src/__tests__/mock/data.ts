import { BlogUser, Post } from './data-types';

export const blogUsers: BlogUser[] = [
  {
    id: 2,
    fullName: 'John Doe',
  },
  {
    id: 4,
    fullName: 'Jane Doe',
  },
  {
    id: 7,
    fullName: 'Barney Jane',
  },
  {
    id: 10,
    fullName: 'Patrick Stinson',
  },
];

export const posts: Post[] = [
  {
    id: 'je2sod39ifs',
    authorId: blogUsers[0].id,
    title: 'Post 1 Title',
    description: 'Post 1 Description',
    guestEditors: [],
  },
  {
    id: 'eowortuewoeijf',
    authorId: blogUsers[1].id,
    title: 'Post 2 Title',
    description: 'Post 2 Description',
    guestEditors: [blogUsers[0], blogUsers[2]],
  },
  {
    id: 'eowsldkghoweilsdkjf',
    authorId: blogUsers[1].id,
    title: 'Post 3 Title',
    description: 'Post 3 Description',
    guestEditors: [blogUsers[0], blogUsers[1], blogUsers[2]],
  },
];
