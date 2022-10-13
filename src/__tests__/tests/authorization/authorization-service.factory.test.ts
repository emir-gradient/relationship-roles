import { RelationshipAuthorizationService } from '../../../authorization/relationship-authorization.service';
import { RelationshipResolverContainer } from '../../../relationship-resolver/relationship-resolver.container';
import {
  PostAuthorRelationshipResolver,
  PostGuestEditorRelationshipResolver,
  PostRelationshipResolver,
} from '../../mock/relationship-resolvers';
import { authorizationCases } from '../../test-cases/authorization-cases';
import { getAuthorizationService } from '../../../authorization/authorization-service.factory';

describe('RelationshipAuthorizationService', () => {
  it('should properly allow access when there are no required roles', async () => {
    const relationshipAuthorizationService: RelationshipAuthorizationService = await getAuthorizationService([]);

    await authorizationCases['should properly allow access when there are no required roles'](
      relationshipAuthorizationService,
    );
  });

  it('should allow access when user is in expected relation with post', async () => {
    const relationshipAuthorizationService: RelationshipAuthorizationService = await getAuthorizationService([
      new PostRelationshipResolver(),
    ]);

    await authorizationCases['should allow access when user is in expected relation with post'](
      relationshipAuthorizationService,
    );
  });

  it('should allow access when user is in at least one of the expected relations with post', async () => {
    const relationshipAuthorizationService: RelationshipAuthorizationService = await getAuthorizationService([
      new PostRelationshipResolver(),
    ]);

    await authorizationCases['should allow access when user is in at least one of the expected relations with post'](
      relationshipAuthorizationService,
    );
  });

  it('should allow access when user is in at least one relation with post - multiple resolvers', async () => {
    const relationshipAuthorizationService: RelationshipAuthorizationService = await getAuthorizationService([
      new PostAuthorRelationshipResolver(),
      new PostGuestEditorRelationshipResolver(),
    ]);

    await authorizationCases[
      'should allow access when user is in at least one relation with post - multiple resolvers'
    ](relationshipAuthorizationService);
  });

  it('should deny access when user is not in any relation with post', async () => {
    const relationshipAuthorizationService: RelationshipAuthorizationService = await getAuthorizationService([
      new PostRelationshipResolver(),
    ]);

    await authorizationCases['should deny access when user is not in any relation with post'](
      relationshipAuthorizationService,
    );
  });

  it('should deny access when user is in wrong relation with post', async () => {
    const relationshipAuthorizationService: RelationshipAuthorizationService = await getAuthorizationService([
      new PostRelationshipResolver(),
    ]);

    await authorizationCases['should deny access when user is in wrong relation with post'](
      relationshipAuthorizationService,
    );
  });

  it('should allow access when user has more relations than requested - but including requested one', async () => {
    const relationshipAuthorizationService: RelationshipAuthorizationService = await getAuthorizationService([
      new PostRelationshipResolver(),
    ]);

    await authorizationCases[
      'should allow access when user has more relations than requested - but including requested one'
    ](relationshipAuthorizationService);
  });

  it('should allow access when user has more relations and all are requested', async () => {
    const relationshipAuthorizationService: RelationshipAuthorizationService = await getAuthorizationService([
      new PostRelationshipResolver(),
    ]);

    await authorizationCases['should allow access when user has more relations and all are requested'](
      relationshipAuthorizationService,
    );
  });
});
