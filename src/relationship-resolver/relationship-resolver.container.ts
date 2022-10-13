import { RelationshipResolver } from '../type/relationship-resolver';
import { SupportedRelationshipsOverlapException } from '../exception/supported-relationships-overlap.exception';

/**
 * Container that holds all registered relationship resolvers.
 */
export class RelationshipResolverContainer {
  /**
   * Relationship resolver instances.
   *
   * @private
   */
  private relationshipResolvers: RelationshipResolver<unknown, unknown, unknown>[] = [];

  /**
   * Registered supported roles (to be able to check for overlaps between resolvers).
   *
   * @private
   */
  private registeredRoles: Set<unknown> = new Set<unknown>();

  /**
   * Finds all relationship resolvers that are capable of resolving at least one
   * of required relations.
   *
   * @param requiredRelations
   */
  async findRelationshipResolvers<R>(requiredRelations: R[]): Promise<RelationshipResolver<unknown, unknown, R>[]> {
    const result = [];

    for (const relationshipResolver of this.relationshipResolvers as RelationshipResolver<unknown, unknown, R>[]) {
      const supportedRelations = await relationshipResolver.getSupportedRelationships();

      const matches = supportedRelations.find((sr) => {
        return !!requiredRelations.find((rr) => rr === sr);
      });

      if (matches) {
        result.push(relationshipResolver);
      }
    }

    return result;
  }

  /**
   * Adds Relationship Resolver to the container.
   *
   * @param relationshipResolver
   */
  async addRelationshipResolver<T, U, V>(relationshipResolver: RelationshipResolver<T, U, V>): Promise<void> {
    const supportedRoles = new Set(await relationshipResolver.getSupportedRelationships());

    for (const supportedRole of supportedRoles) {
      if (this.registeredRoles.has(supportedRole)) {
        throw new SupportedRelationshipsOverlapException(
          `Multiple Relationship Resolvers handle the role ${supportedRole}!`,
        );
      }

      this.registeredRoles.add(supportedRole);
    }

    this.relationshipResolvers.push(relationshipResolver);
  }
}
