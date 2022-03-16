---
slug: 'improve-gitlab-pipelines-node'
date: '2021-08-02'
featuredImage: '..//assets/featured/improve-gitlab-pipelines-node.png'
title: 'Improving GitLab Pipeline Speeds for NodeJS'
tags: ['gitlab', 'node', 'dev ops', 'ci cd']
---

Running test stages for `react-native` repos or NodeJS repos can be really painful if `yarn install` is taking too long to complete. Even though GitLab suggests you to use a cache configuration to cache the vendor folder so you won't have to wait for `yarn install` to complete everytime, there seems to be an [issue](https://gitlab.com/gitlab-org/gitlab-runner/-/issues/1797) with how long the caching actually takes to complete.

# Journey

I've hit into this issue in the [KopiRun](https://kopirun.com) pipelines and I set out to solve this. We're a small team and we don't particularly add or update packages that often, most of the time I'm the only one doing so. We don't want our machines to always be uploading caches if the cache is still relevant.

GitLab only has a pull-push, pull, push policy for the cache. They are missing a `push if outdated` as mentioned [here](https://gitlab.com/gitlab-org/gitlab-runner/-/issues/3523).

Someone found out that if you remove the folders to be cached, the runners won't update the cache and therefore won't waste anytime to push the cache files. They provided a sample `.gitlab-ci.yml` configuration but that didn't really fit my needs so this led to me writing my own cache stage to not push if the cache is still relevant (Based off a hash of the `yarn.lock` file).

# Solve

The following configuration has helped us save about 5 to 15 minutes depending on the project due to how it was previously configured.

```yaml:title=gitlab-ci.yml
stages:
  - cache
  - test

cache_stage:
  stage: cache
  tags:
    - docker
  cache:
    key:
      files:
        - yarn.lock
    paths:
      - node_modules/
      - .yarn/
      - yarn.lock.sha256sum
  script:
    - yarn install --frozen-lockfile --prefer-offline --cache-folder .yarn
    -  # do whatever
    - |
      YARN_LOCK_SHA256_HASH=$( sha256sum yarn.lock | awk '{ print $1 }')
      echo "Current sha256 hash is $YARN_LOCK_SHA256_HASH"
      echo "Checking sha256 hash of yarn.lock"

      if ! sha256sum -c yarn.lock.sha256sum; then
        echo "yarn.lock checksum does not match cache"
        sha256sum yarn.lock > yarn.lock.sha256sum
      else
        echo "Cache is the same as before, removing cache files to prevent cache from updating"
        rm -rf node_modules
        rm -rf .yarn
        rm -rf yarn.lock.sha256sum
      fi

test_stage:
  stage: test
  tags:
    - docker
  cache:
    - key:
        files:
          - yarn.lock
      paths:
        - node_modules/
        - .yarn/
      policy: pull
  script:
    - echo "Test Stage"
```
