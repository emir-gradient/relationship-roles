# Node.js Relationship Roles

Node.js library for authorization based on relationship roles.

## Documentation

Read more at [https://emir-gradient.github.io/relationship-roles/](https://emir-gradient.github.io/relationship-roles/).

## Install

```
npm install relationship-roles
```

## Usage

1. Define type for required relationship roles (enum, string, interface, etc.)
2. Create needed relationship resolvers by implementing `RelationshipResolver<User, RelatedObject, RelationshipRole>`
interface:

```ts
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
```

3. Instantiate and use authorization service:

```ts
const authorizationService = await getAuthorizationService([
  ...resolvers // Resolvers created in step 2
]);

 // Authorize 'user' related to 'relatedObject' based on 'requiredRoles'
 const result = await authorizationService.authorize(user, relatedObject, [...requiredRoles]);

 result; // true | false
```

## Example

Suppose that business requirement is to handle authorization for online store.
Authorization should be executed based on next relationships:
- Store Owner (the User owns the Store)
- Store Team Member (the User is member of the Store team)
- Product Seller (the User sold the Product)
- Product Buyer (the User bought the Product)

Relevant entities that describe these scenarios are:
```ts 
interface StoreEntity {
  id: number;
  name: string;
  owner: UserEntity;
  team: UserEntity[];
  products: ProductEntity[];
}

interface ProductEntity {
  id: string;
  seller: UserEntity;
  title: string;
  price: number;
  currency: string;
  buyers: UserEntity[];
}

interface UserEntity {
  id: number;
  fullName: string;
  email: string;
}
```

### Implementation Steps

#### 1. Define relationship roles needed for your project:
```ts
enum StoreRole {
  "PRODUCT_SELLER" = "PRODUCT_SELLER",
  "PRODUCT_BUYER" = "PRODUCT_BUYER",
  "STORE_OWNER" = "STORE_OWNER",
  "STORE_TEAM_MEMBER" = "STORE_TEAM_MEMBER"
}
```

#### 2. Implement StoreRelationshipResolver:

```ts
class StoreRelationshipResolver implements RelationshipResolver<UserEntity, StoreEntity, StoreRole> {
  async getRelations(user: UserEntity, store: StoreEntity): Promise<StoreRole[]> {
    const relations: StoreRole[] = [];

    if (store.owner.id === user.id) {
      relations.push(StoreRole.STORE_OWNER);
    }

    if (store.team.find(t => t.id === user.id)) {
      relations.push(StoreRole.STORE_TEAM_MEMBER);
    }

    return relations;
  }

  async getSupportedRelationships(): Promise<StoreRole[]> {
    return [StoreRole.STORE_OWNER, StoreRole.STORE_TEAM_MEMBER];
  }
}
```

#### 3. Implement ProductRelationshipResolver:

```ts 
class ProductRelationshipResolver implements RelationshipResolver<UserEntity, ProductEntity, StoreRole> {

  async getRelations(user: UserEntity, product: ProductEntity): Promise<StoreRole[]> {
    const relations: StoreRole[] = [];

    if (product.seller.id === user.id) {
      relations.push(StoreRole.PRODUCT_SELLER);
    } else if (product.buyers.find(pb => pb.id === user.id)) {
      relations.push(StoreRole.PRODUCT_BUYER);
    }

    return relations;
  }

  async getSupportedRelationships(): Promise<StoreRole[]> {
    return [StoreRole.PRODUCT_BUYER, StoreRole.PRODUCT_SELLER];
  }
}
```

#### 4. Authorize:

```ts
 const authorizationService = await getAuthorizationService([
   new ProductRelationshipResolver(),
   new StoreRelationshipResolver()
 ]);

 await authorizationService.authorize(user, store, [
   StoreRole.STORE_OWNER,
   StoreRole.STORE_TEAM_MEMBER
 ]); // true | false

 await authorizationService.authorize(user, product, [
   StoreRole.PRODUCT_BUYER
 ]); // true | false

 await authorizationService.authorize(user, product, [
   StoreRole.PRODUCT_SELLER
 ]); // true | false
```

## Tests

```
npm run test
```

## Build

```
npm run build
```

## Credits

Gradient Software Development [https://gradient.ba](https://gradient.ba)

info@gradient.ba
