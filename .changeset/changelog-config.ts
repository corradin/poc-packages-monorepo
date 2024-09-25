import {
  ChangelogFunctions,
  ModCompWithPackage,
  NewChangesetWithCommit,
  VersionType,
} from '@changesets/types';

type ChangelogOpts = Record<'repo', string> | null;

const getReleaseLine = async (
  changeset: NewChangesetWithCommit,
  _type: VersionType,
  changelogOpts: ChangelogOpts
) => {
  const [firstLine, ...futureLines] = changeset.summary
    .split('\n')
    .map((line) => line.trimRight());
  let returnVal = `- ${changeset.commit ? `[${changeset.commit.slice(0, 7)}](https://github.com/${changelogOpts?.repo}/commit/${changeset.commit}): ` : ''}${firstLine}`;

  if (futureLines.length > 0) {
    returnVal += `\n${futureLines.map((line) => `  ${line}`).join('\n')}`;
  }

  return returnVal;
};

const getDependencyReleaseLine = async (
  changesets: NewChangesetWithCommit[],
  dependenciesUpdated: ModCompWithPackage[],
  changelogOpts: ChangelogOpts
) => {
  if (dependenciesUpdated.length === 0) return '';
  const changesetLinks = changesets.map(
    (changeset) =>
      `- Updated dependencies${changeset.commit ? ` [${changeset.commit.slice(0, 7)}](https://github.com/${changelogOpts?.repo}/commit/${changeset.commit})` : ''}`
  );
  const updatedDependenciesList = dependenciesUpdated.map(
    (dependency) => `  - ${dependency.name}@${dependency.newVersion}`
  );
  return [...changesetLinks, ...updatedDependenciesList].join('\n');
};

const defaultChangelogFunctions: ChangelogFunctions = {
  getReleaseLine,
  getDependencyReleaseLine,
};

export default defaultChangelogFunctions;
