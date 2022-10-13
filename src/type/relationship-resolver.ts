/**
 * User - Type of user
 * RelatedObject - Type of related object (object user is related to)
 * RelationshipRole - Type of relationship role
 */
export interface RelationshipResolver<User, RelatedObject, RelationshipRole> {
  /**
   * Return Relationship Roles that this resolver is responsible to recognize.
   */
  getSupportedRelationships(): Promise<RelationshipRole[]>;

  /**
   * Determine and provide relationship between user and related object.
   */
  getRelations(user: User, relatedObject: RelatedObject): Promise<RelationshipRole[]>;
}
