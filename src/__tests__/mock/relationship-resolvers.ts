import { RelationshipResolver } from '../../type/relationship-resolver';
import { BlogUser, Post } from './data-types';
import { BlogRelationshipRole } from './roles';

export class PostRelationshipResolver implements RelationshipResolver<BlogUser, Post, BlogRelationshipRole> {
  getRelations(user: BlogUser, post: Post): Promise<BlogRelationshipRole[]> {
    const relationshipRoles: BlogRelationshipRole[] = [];

    if (post.authorId === user.id) {
      relationshipRoles.push(BlogRelationshipRole.POST_AUTHOR);
    }

    if (post.guestEditors.find((ge) => ge.id === user.id)) {
      relationshipRoles.push(BlogRelationshipRole.POST_GUEST_EDITOR);
    }

    return Promise.resolve(relationshipRoles);
  }

  getSupportedRelationships(): Promise<BlogRelationshipRole[]> {
    return Promise.resolve([BlogRelationshipRole.POST_AUTHOR, BlogRelationshipRole.POST_GUEST_EDITOR]);
  }
}

export class PostAuthorRelationshipResolver implements RelationshipResolver<BlogUser, Post, BlogRelationshipRole> {
  getRelations(user: BlogUser, relatedObject: Post): Promise<BlogRelationshipRole[]> {
    const supportedRoles: BlogRelationshipRole[] = [];

    if (relatedObject.authorId === user.id) {
      supportedRoles.push(BlogRelationshipRole.POST_AUTHOR);
    }

    return Promise.resolve(supportedRoles);
  }

  getSupportedRelationships(): Promise<BlogRelationshipRole[]> {
    return Promise.resolve([BlogRelationshipRole.POST_AUTHOR]);
  }
}

export class PostGuestEditorRelationshipResolver implements RelationshipResolver<BlogUser, Post, BlogRelationshipRole> {
  getRelations(user: BlogUser, relatedObject: Post): Promise<BlogRelationshipRole[]> {
    const supportedRoles: BlogRelationshipRole[] = [];

    if (relatedObject.guestEditors.find((ge) => ge.id === user.id)) {
      supportedRoles.push(BlogRelationshipRole.POST_GUEST_EDITOR);
    }

    return Promise.resolve(supportedRoles);
  }

  getSupportedRelationships(): Promise<BlogRelationshipRole[]> {
    return Promise.resolve([BlogRelationshipRole.POST_GUEST_EDITOR]);
  }
}
