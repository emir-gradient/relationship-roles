import { RelationshipResolverContainer } from '../relationship-resolver/relationship-resolver.container';

/**
 * Authorization service that performs authorization based on relationship
 * between User and Related entity.
 */
export class RelationshipAuthorizationService {
  /**
   * Dependency Injection.
   */
  constructor(private relationshipResolverContainer: RelationshipResolverContainer) {}

  /**
   * Authorizes if provided user has any of the required roles for provided
   * related object.
   *
   * @param user
   * @param relatedObject
   * @param requiredRoles
   */
  async authorize<User, RelatedObject, RelationshipRole>(
    user: User,
    relatedObject: RelatedObject,
    requiredRoles: RelationshipRole[],
  ): Promise<boolean> {
    if (!requiredRoles.length) {
      return true;
    }

    const collectedRoles: RelationshipRole[] = [];

    const relationshipResolvers = await this.relationshipResolverContainer.findRelationshipResolvers(requiredRoles);
    for (const relationshipResolver of relationshipResolvers) {
      const relations = await relationshipResolver.getRelations(user, relatedObject);
      collectedRoles.push(...relations);
    }

    const matches = collectedRoles.filter((sr) => {
      return !!requiredRoles.find((rr) => rr === sr);
    });

    return !!matches.length;
  }
}
