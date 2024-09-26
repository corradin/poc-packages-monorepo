import {
  ChangelogOpts,
  getReleaseLine,
  getDependencyReleaseLine,
} from '../changelog-config';
import {
  ModCompWithPackage,
  NewChangesetWithCommit,
  VersionType,
} from '@changesets/types';

describe('changelog-config', () => {
  describe('getReleaseLine', () => {
    const versionTypeMinor: VersionType = 'minor';
    let changeset: NewChangesetWithCommit;
    const changelogOpts: ChangelogOpts = { repo: 'test/repo' };

    beforeEach(() => {
      changeset = {
        id: 'test-id',
        summary: 'This is a test summary',
        releases: [{ name: 'test-package', type: versionTypeMinor }],
      };
    });

    it('should format the release line with commit hash and summary', async () => {
      changeset.commit = 'abcdef1234567890';

      const result = await getReleaseLine(
        changeset,
        versionTypeMinor,
        changelogOpts
      );

      expect(result).toBe(
        '- [abcdef1](https://github.com/test/repo/commit/abcdef1234567890): This is a test summary'
      );
    });

    it('should format the release line without a commit hash', async () => {
      const result = await getReleaseLine(
        changeset,
        versionTypeMinor,
        changelogOpts
      );

      expect(result).toBe('- This is a test summary');
    });

    it('should handle multiline summaries', async () => {
      changeset.summary =
        'This is a test summary\nwith multiple lines\nand more content';

      const result = await getReleaseLine(
        changeset,
        versionTypeMinor,
        changelogOpts
      );

      expect(result).toBe(
        `- This is a test summary\n  with multiple lines\n  and more content`
      );
    });

    it('should trim right spaces from each line in the summary', async () => {
      changeset.summary =
        'This is a test summary   \nwith multiple lines   \nand more content   ';

      const result = await getReleaseLine(
        changeset,
        versionTypeMinor,
        changelogOpts
      );

      expect(result).toBe(
        `- This is a test summary\n  with multiple lines\n  and more content`
      );
    });
  });

  describe('getDependencyReleaseLine', () => {
    const changelogOpts: ChangelogOpts = { repo: 'test/repo' };
    let changesets: NewChangesetWithCommit[];
    let dependenciesUpdated: ModCompWithPackage[];

    beforeEach(() => {
      changesets = [
        {
          id: 'test-id-1',
          summary: 'This is a test summary 1',
          releases: [{ name: 'test-package-1', type: 'minor' }],
          commit: 'abcdef1234567890',
        },
        {
          id: 'test-id-2',
          summary: 'This is a test summary 2',
          releases: [{ name: 'test-package-2', type: 'patch' }],
          commit: '1234567890abcdef',
        },
      ];

      dependenciesUpdated = [
        {
          name: 'dep-package-1',
          type: 'minor',
          changesets: [],
          oldVersion: '1.0.1',
          newVersion: '1.1.0',
          dir: '',
          packageJson: { name: '', version: '' },
        },
        {
          name: 'dep-package-2',
          type: 'patch',
          changesets: [],
          oldVersion: '2.3.3',
          newVersion: '2.3.4',
          dir: '',
          packageJson: { name: '', version: '' },
        },
      ];
    });

    it('should format the dependency release line with commit hashes', async () => {
      const result = await getDependencyReleaseLine(
        changesets,
        dependenciesUpdated,
        changelogOpts
      );

      expect(result).toBe(
        `- Updated dependencies [abcdef1](https://github.com/test/repo/commit/abcdef1234567890)\n` +
          `- Updated dependencies [1234567](https://github.com/test/repo/commit/1234567890abcdef)\n` +
          `  - dep-package-1@1.1.0\n` +
          `  - dep-package-2@2.3.4`
      );
    });

    it('should format the dependency release line without commit hashes', async () => {
      changesets.forEach((changeset) => delete changeset.commit);

      const result = await getDependencyReleaseLine(
        changesets,
        dependenciesUpdated,
        changelogOpts
      );

      expect(result).toBe(
        `- Updated dependencies\n` +
          `- Updated dependencies\n` +
          `  - dep-package-1@1.1.0\n` +
          `  - dep-package-2@2.3.4`
      );
    });

    it('should return an empty string if no dependencies are updated', async () => {
      dependenciesUpdated = [];

      const result = await getDependencyReleaseLine(
        changesets,
        dependenciesUpdated,
        changelogOpts
      );

      expect(result).toBe('');
    });
  });
});
