// import {
//   ChangelogFunctions,
//   ModCompWithPackage,
//   NewChangesetWithCommit,
//   VersionType,
// } from '@changesets/types';

const getReleaseLine = async (changeset, _type, options) => {
  const [firstLine, ...futureLines] = changeset.summary
    .split('\n')
    .map((l) => l.trimRight());
  let returnVal = `- ${changeset.commit ? `[${changeset.commit.slice(0, 7)}](https://github.com/${options.repo}/commit/${changeset.commit}): ` : ''}${firstLine}`;

  if (futureLines.length > 0) {
    returnVal += `\n${futureLines.map((l) => `  ${l}`).join('\n')}`;
  }

  return returnVal;
};

const getDependencyReleaseLine = async (
  changesets,
  dependenciesUpdated,
  options
) => {
  if (dependenciesUpdated.length === 0) return '';
  const changesetLinks = changesets.map(
    (changeset) =>
      `- Updated dependencies${changeset.commit ? ` [${changeset.commit.slice(0, 7)}](https://github.com/${options.repo}/commit/${changeset.commit})` : ''}`
  );
  const updatedDependenciesList = dependenciesUpdated.map(
    (dependency) => `  - ${dependency.name}@${dependency.newVersion}`
  );
  return [...changesetLinks, ...updatedDependenciesList].join('\n');
};

// const defaultChangelogFunctions = {
//   getReleaseLine,
//   getDependencyReleaseLine,
// };

// export default defaultChangelogFunctions;

module.exports = {
  getReleaseLine,
  getDependencyReleaseLine,
};
