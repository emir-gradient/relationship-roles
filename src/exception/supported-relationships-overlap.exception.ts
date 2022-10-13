/**
 * Exception that informs about misconfiguration in the Relationship Resolvers.
 *
 * In this scenario 2 or more Relationship Resolvers are supporting
 * same relation.
 */
export class SupportedRelationshipsOverlapException extends Error {}
