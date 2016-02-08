'use strict';

require('./ng')
.factory('ghSearch', ($http, ghkey) => {
  // Tad bit of a misnomer, turns out we only search for users/orgs

  // Also loads:
  // Repos (by user)
  // Commits (by repo)
  // Commit detials

  let makeAPIRequest = (details) => $http({
    method: 'GET',
    url: `https://api.github.com/${details.path}`,
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `token ${ghkey}`
    },
    params: details.params
  });

  let ghSearch = {
    current: {
      user: null,
      repo: null,
      commit: null
    },
    searchUsers: (query, type) => {
      ghSearch.current.user = null;
      ghSearch.current.repo = null;
      ghSearch.current.commit = null;

      return makeAPIRequest({
        path: 'search/users',
        params: {
          q: type ? `${query} type:${type.toLowerCase()}` : query
        }
      })
      .then(resp => resp.data.items);
    },
    selectUser: (user) => {
      ghSearch.current.user = user;
      ghSearch.current.repo = null;
      ghSearch.current.commit = null;
      let path;
      if (user.type === 'User') {
        path = `users/${user.login}/repos`;
      } else {
        path = `orgs/${user.login}/repos`;
      }
      return makeAPIRequest({
        path: path
      })
      .then(resp => {
        let repos = resp.data;
        ghSearch.current.user.repos = repos;
      });
    },
    selectRepo: (repo) => {
      ghSearch.current.repo = repo;
      ghSearch.current.commit = null;
      return makeAPIRequest({
        path: `repos/${ghSearch.current.user.login}/${repo.name}/commits`
      })
      .then(resp => {
        let commits = resp.data;
        ghSearch.current.repo.commits = commits;
      });
    },
    selectCommit: (commit) => {
      ghSearch.current.commit = commit;

      return makeAPIRequest({
        path: `repos/${ghSearch.current.user.login}/${ghSearch.current.repo.name}/commits/${commit.sha}`
      })
      .then(resp => {
        ghSearch.current.commit.details = resp.data;
      });
    },
    clearData: () => {
      ghSearch.current.user = null;
      ghSearch.current.repo = null;
      ghSearch.current.commit = null;
    }
  };

  return ghSearch;
});