import { RelationshipAuthorizationService } from '../../../authorization/relationship-authorization.service';
import { RelationshipResolverContainer } from '../../../relationship-resolver/relationship-resolver.container';
import {
  PostAuthorRelationshipResolver,
  PostGuestEditorRelationshipResolver,
  PostRelationshipResolver,
} from '../../mock/relationship-resolvers';
import { authorizationCases } from '../../test-cases/authorization-cases';

describe('RelationshipAuthorizationService', () => {
  let relationshipAuthorizationService: RelationshipAuthorizationService;
  let relationshipResolverContainer: RelationshipResolverContainer;

  beforeEach(() => {
    relationshipResolverContainer = new RelationshipResolverContainer();
    relationshipAuthorizationService = new RelationshipAuthorizationService(relationshipResolverContainer);
  });

  it('should properly allow access when there are no required roles', async () => {
    await authorizationCases['should properly allow access when there are no required roles'](
      relationshipAuthorizationService,
    );
  });

  it('should allow access when user is in expected relation with post', async () => {
    await relationshipResolverContainer.addRelationshipResolver(new PostRelationshipResolver());

    await authorizationCases['should allow access when user is in expected relation with post'](
      relationshipAuthorizationService,
    );
  });

  it('should allow access when user is in at least one of the expected relations with post', async () => {
    await relationshipResolverContainer.addRelationshipResolver(new PostRelationshipResolver());

    await authorizationCases['should allow access when user is in at least one of the expected relations with post'](
      relationshipAuthorizationService,
    );
  });

  it('should allow access when user is in at least one relation with post - multiple resolvers', async () => {
    await relationshipResolverContainer.addRelationshipResolver(new PostAuthorRelationshipResolver());
    await relationshipResolverContainer.addRelationshipResolver(new PostGuestEditorRelationshipResolver());

    await authorizationCases[
      'should allow access when user is in at least one relation with post - multiple resolvers'
    ](relationshipAuthorizationService);
  });

  it('should deny access when user is not in any relation with post', async () => {
    await relationshipResolverContainer.addRelationshipResolver(new PostRelationshipResolver());

    await authorizationCases['should deny access when user is not in any relation with post'](
      relationshipAuthorizationService,
    );
  });

  it('should deny access when user is in wrong relation with post', async () => {
    await relationshipResolverContainer.addRelationshipResolver(new PostRelationshipResolver());

    await authorizationCases['should deny access when user is in wrong relation with post'](
      relationshipAuthorizationService,
    );
  });

  it('should allow access when user has more relations than requested - but including requested one', async () => {
    await relationshipResolverContainer.addRelationshipResolver(new PostRelationshipResolver());

    await authorizationCases[
      'should allow access when user has more relations than requested - but including requested one'
    ](relationshipAuthorizationService);
  });

  it('should allow access when user has more relations and all are requested', async () => {
    await relationshipResolverContainer.addRelationshipResolver(new PostRelationshipResolver());

    await authorizationCases['should allow access when user has more relations and all are requested'](
      relationshipAuthorizationService,
    );
  });
});
