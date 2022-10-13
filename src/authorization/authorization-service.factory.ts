import { RelationshipResolver } from '../type/relationship-resolver';
import { RelationshipAuthorizationService } from './relationship-authorization.service';
import { RelationshipResolverContainer } from '../relationship-resolver/relationship-resolver.container';

/**
 * Factory method for creating authorization service based on provided
 * relationship resolvers.
 *
 * @param relationshipResolvers
 */
export async function getAuthorizationService(
  relationshipResolvers: RelationshipResolver<unknown, unknown, unknown>[],
): Promise<RelationshipAuthorizationService> {
  const relationshipResolverContainer = new RelationshipResolverContainer();
  for (const relationshipResolver of relationshipResolvers) {
    await relationshipResolverContainer.addRelationshipResolver(relationshipResolver);
  }

  return new RelationshipAuthorizationService(relationshipResolverContainer);
}
