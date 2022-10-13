import { blogUsers, posts } from '../mock/data';
import { RelationshipAuthorizationService } from '../../authorization/relationship-authorization.service';
import { BlogRelationshipRole } from '../mock/roles';

export const authorizationCases = {
  'should properly allow access when there are no required roles': async (
    relationshipAuthorizationService: RelationshipAuthorizationService,
  ) => {
    const allowed = await relationshipAuthorizationService.authorize(blogUsers[3], posts[1], []);

    expect(allowed).toBe(true);
  },
  'should allow access when user is in expected relation with post': async (
    relationshipAuthorizationService: RelationshipAuthorizationService,
  ) => {
    const allowed = await relationshipAuthorizationService.authorize(blogUsers[0], posts[0], [
      BlogRelationshipRole.POST_AUTHOR,
    ]);

    expect(allowed).toBe(true);
  },
  'should allow access when user is in at least one of the expected relations with post': async (
    relationshipAuthorizationService: RelationshipAuthorizationService,
  ) => {
    const allowed = await relationshipAuthorizationService.authorize(blogUsers[0], posts[1], [
      BlogRelationshipRole.POST_AUTHOR,
      BlogRelationshipRole.POST_GUEST_EDITOR,
    ]);

    expect(allowed).toBe(true);
  },
  'should allow access when user is in at least one relation with post - multiple resolvers': async (
    relationshipAuthorizationService: RelationshipAuthorizationService,
  ) => {
    const allowed = await relationshipAuthorizationService.authorize(blogUsers[0], posts[1], [
      BlogRelationshipRole.POST_GUEST_EDITOR,
    ]);

    expect(allowed).toBe(true);
  },
  'should deny access when user is not in any relation with post': async (
    relationshipAuthorizationService: RelationshipAuthorizationService,
  ) => {
    const allowed = await relationshipAuthorizationService.authorize(blogUsers[3], posts[1], [
      BlogRelationshipRole.POST_AUTHOR,
      BlogRelationshipRole.POST_GUEST_EDITOR,
    ]);

    expect(allowed).toBe(false);
  },
  'should deny access when user is in wrong relation with post': async (
    relationshipAuthorizationService: RelationshipAuthorizationService,
  ) => {
    const allowed = await relationshipAuthorizationService.authorize(blogUsers[1], posts[1], [
      BlogRelationshipRole.POST_GUEST_EDITOR,
    ]);

    expect(allowed).toBe(false);
  },
  'should allow access when user has more relations than requested - but including requested one': async (
    relationshipAuthorizationService: RelationshipAuthorizationService,
  ) => {
    const allowed = await relationshipAuthorizationService.authorize(blogUsers[1], posts[2], [
      BlogRelationshipRole.POST_GUEST_EDITOR,
    ]);

    expect(allowed).toBe(true);
  },
  'should allow access when user has more relations and all are requested': async (
    relationshipAuthorizationService: RelationshipAuthorizationService,
  ) => {
    const allowed = await relationshipAuthorizationService.authorize(blogUsers[1], posts[2], [
      BlogRelationshipRole.POST_GUEST_EDITOR,
      BlogRelationshipRole.POST_AUTHOR,
    ]);

    expect(allowed).toBe(true);
  },
};
