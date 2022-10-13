import { RelationshipResolverContainer } from '../../../relationship-resolver/relationship-resolver.container';
import { BlogRelationshipRole } from '../../mock/roles';
import {
  PostAuthorRelationshipResolver,
  PostGuestEditorRelationshipResolver,
  PostRelationshipResolver,
} from '../../mock/relationship-resolvers';
import { SupportedRelationshipsOverlapException } from '../../../exception/supported-relationships-overlap.exception';

describe('RelationshipResolverContainer', function () {
  let relationshipResolverContainer: RelationshipResolverContainer;

  beforeEach(() => {
    relationshipResolverContainer = new RelationshipResolverContainer();
  });

  it('should properly register and find resolver per provided roles', async () => {
    const postRelationshipResolver: PostRelationshipResolver = new PostRelationshipResolver();

    await relationshipResolverContainer.addRelationshipResolver(postRelationshipResolver);

    expect(
      await relationshipResolverContainer.findRelationshipResolvers([
        BlogRelationshipRole.POST_AUTHOR,
        BlogRelationshipRole.POST_GUEST_EDITOR,
      ]),
    ).toStrictEqual([postRelationshipResolver]);
  });

  it('should properly register and find resolver by at least one of roles - case: 1st role', async () => {
    const postRelationshipResolver: PostRelationshipResolver = new PostRelationshipResolver();

    await relationshipResolverContainer.addRelationshipResolver(postRelationshipResolver);

    expect(
      await relationshipResolverContainer.findRelationshipResolvers([BlogRelationshipRole.POST_AUTHOR]),
    ).toStrictEqual([postRelationshipResolver]);
  });

  it('should properly register and find resolver by at least one of roles - case: 2nd role', async () => {
    const postRelationshipResolver: PostRelationshipResolver = new PostRelationshipResolver();

    await relationshipResolverContainer.addRelationshipResolver(postRelationshipResolver);

    expect(
      await relationshipResolverContainer.findRelationshipResolvers([BlogRelationshipRole.POST_GUEST_EDITOR]),
    ).toStrictEqual([postRelationshipResolver]);
  });

  it('should fail when resolvers have overlap in supported roles', async () => {
    const postRelationshipResolver: PostRelationshipResolver = new PostRelationshipResolver();
    const postAuthorRelationshipResolver: PostAuthorRelationshipResolver = new PostAuthorRelationshipResolver();

    await relationshipResolverContainer.addRelationshipResolver(postRelationshipResolver);

    await expect(relationshipResolverContainer.addRelationshipResolver(postAuthorRelationshipResolver)).rejects.toThrow(
      SupportedRelationshipsOverlapException,
    );
  });

  it('should find resolver among multiple registered resolvers per proper role', async () => {
    const postAuthorRelationshipResolver: PostAuthorRelationshipResolver = new PostAuthorRelationshipResolver();
    const postGuestEditorRelationshipResolver: PostGuestEditorRelationshipResolver =
      new PostGuestEditorRelationshipResolver();

    await relationshipResolverContainer.addRelationshipResolver(postAuthorRelationshipResolver);
    await relationshipResolverContainer.addRelationshipResolver(postGuestEditorRelationshipResolver);

    expect(
      await relationshipResolverContainer.findRelationshipResolvers([BlogRelationshipRole.POST_GUEST_EDITOR]),
    ).toStrictEqual([postGuestEditorRelationshipResolver]);
    expect(
      await relationshipResolverContainer.findRelationshipResolvers([BlogRelationshipRole.POST_AUTHOR]),
    ).toStrictEqual([postAuthorRelationshipResolver]);
  });

  it('should properly return empty array of resolvers when there is no matching one', async () => {
    const postAuthorRelationshipResolver: PostAuthorRelationshipResolver = new PostAuthorRelationshipResolver();
    await relationshipResolverContainer.addRelationshipResolver(postAuthorRelationshipResolver);

    expect(
      await relationshipResolverContainer.findRelationshipResolvers([BlogRelationshipRole.POST_GUEST_EDITOR]),
    ).toStrictEqual([]);
  });

  it('should properly find all resolvers for provided roles', async () => {
    const postAuthorRelationshipResolver: PostAuthorRelationshipResolver = new PostAuthorRelationshipResolver();
    const postGuestEditorRelationshipResolver: PostGuestEditorRelationshipResolver =
      new PostGuestEditorRelationshipResolver();

    await relationshipResolverContainer.addRelationshipResolver(postAuthorRelationshipResolver);
    await relationshipResolverContainer.addRelationshipResolver(postGuestEditorRelationshipResolver);

    const resolvers = await relationshipResolverContainer.findRelationshipResolvers([
      BlogRelationshipRole.POST_GUEST_EDITOR,
      BlogRelationshipRole.POST_AUTHOR,
    ]);

    expect(resolvers).toContain(postGuestEditorRelationshipResolver);
    expect(resolvers).toContain(postAuthorRelationshipResolver);
  });
});
