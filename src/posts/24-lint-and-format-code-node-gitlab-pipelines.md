---
slug: 'lint-and-format-code-node-gitlab-pipelines'
date: '2022-09-10'
featuredImage: '../assets/featured/lint-and-format-code-node-gitlab-pipelines.png'
title: 'Lint and Format Code in NodeJS with GitLab Pipelines'
series: 'dev-ops-series'
tags: ['gitlab', 'node', 'dev ops', 'ci cd', 'automation']
---

Ensuring code standards in your code repositories can be tricky, there are a few solutions that you can employ such as using `husky` hooks together with a tool like `lint-staged`. However, there may be situations where the hooks are not enabled on the engineer's machine which will result in unformatted code being committed. Another possibility is when the committer commits the code by using the `--no-verify` flag. This will allow the checks to be bypassed.

Adding a job onto the GitLab CI is a great way to ensure that bad code does not make it into the repository, and it will fail the pipeline if the code cannot be fixed automatically by `eslint` or `prettier`.

# Solve

This job works on the assumption that the project should have the following scripts in `package.json` and that you have both `eslint` and `prettier` configured.

The configuration below ignores all files that are in the `.gitignore` and only picks up the following file extensions.

| extension | eslint | prettier |
| --------- | ------ | -------- |
| .js       | ✅     | ✅       |
| .jsx      | ✅     | ✅       |
| .ts       | ✅     | ✅       |
| .tsx      | ✅     | ✅       |
| .gql      | ✅     | ❌       |
| .graphql  | ✅     | ❌       |

```json:title=package.json
"scripts": {
    "lint": "eslint --ignore-path .gitignore . --ext .js --ext .jsx --ext .ts --ext .tsx --ext .gql --ext .graphql",
    "format": "prettier --ignore-path .gitignore \"./**/*.+(ts|js|tsx|jsx)\" --write"
}
```

There is some configuration involved on GitLab that you'll have to do at a group or project level. There is a need to create a bot user account, [set up](https://docs.gitlab.com/ee/user/ssh.html) the bot account with ssh keys and add the SSH private key to the variable named `CI_SSH_PRIVATE_KEY` at a group or project level.

If you're using the following job on SaaS (gitlab.com) and have GitLab Premium, you should be able to use [group access tokens](https://docs.gitlab.com/ee/user/group/settings/group_access_tokens.html) or [project access tokens](https://docs.gitlab.com/ee/user/project/settings/project_access_tokens.html) in place of having to create a separate user account.

If the job is used on a self-managed instance, the free tier should have access to group and project access tokens regardless in the event that you prefer to do that.

The options in the job that you may want to configure are lines `12`, `52`, and `53`.

- `Line 12` is the commit message that you would like to use for the job
- `Line 52` is the email that you want to use for the commit author
- `Line 53` is the name that you want to use for the commit author

The `script` section does the following:

1. Configures the default job exit code
2. Configures the remote and pulls the code for the branch that the pipeline is running on
3. Checks if the current commit is the same as the automated lint job, exits the job if it is
4. Install `node_modules`
5. Lint and Format Code
6. Checks if there are any changes to commit, exit if there is nothing
7. If there are changes to be committed, create a commit and push it to the repository
8. Assign `SKIP_FUTURE_STAGES` to `true` and a random exit code to `CI_JOB_SKIP_EXIT_CODE` so we can use the values in future stages to determine if we can end the job earlier

```yaml:title=gitlab-ci.yml
stages:
  - clean
  - build

lint_job:
  image: node:16.17.0-alpine
  stage: clean
  tags:
    - docker
  rules:
    - if: $CI_COMMIT_BRANCH
  variables:
    LINT_COMMIT_MESSAGE: "style: lint code by bot"
  before_script:
    ##
    ## Install ssh-agent if not already installed, it is required by Docker.
    ## (change apt-get to yum if you use an RPM-based image)
    ##
    - 'which ssh-agent || ( apk --update add git openssh-client )'

    ##
    ## Run ssh-agent (inside the build environment)
    ##
    - eval "$(ssh-agent -s)"

    ##
    ## Add the SSH key stored in SSH_PRIVATE_KEY variable to the agent store
    ## We're using tr to fix line endings which makes ed25519 keys work
    ## without extra base64 encoding.
    ## https://gitlab.com/gitlab-examples/ssh-private-key/issues/1#note_48526556
    ##
    - echo "$CI_SSH_PRIVATE_KEY" | tr -d '\r' | ssh-add -

    ##
    ## Create the SSH directory and give it the right permissions
    ##
    - mkdir -p ~/.ssh
    - chmod 700 ~/.ssh

    ##
    ## Alternatively, use ssh-keyscan to scan the keys of your private server.
    ## Replace example.com with your private server's domain name. Repeat that
    ## command if you have more than one server to connect to.
    ##
    - touch ~/.ssh/known_hosts
    - ssh-keyscan $CI_SERVER_HOST >> ~/.ssh/known_hosts
    - chmod 644 ~/.ssh/known_hosts

    ##
    ## Optionally, if you will be using any Git commands, set the user name and
    ## and email.
    ##
    - git config --global user.email "botuser@example.com"
    - git config --global user.name "Example CI Bot"
  script:
    - CI_JOB_SKIP_EXIT_CODE=0
    - git remote set-url origin git@$CI_SERVER_HOST:$CI_PROJECT_PATH.git
    - git fetch
    - git checkout -B $CI_COMMIT_REF_NAME
    - |
      if [ "$CI_COMMIT_MESSAGE" == "$LINT_COMMIT_MESSAGE" ] ; then
          echo "Linting code is not required. Skipping this job!"
          echo "SKIP_FUTURE_STAGES=false" > build.env
          exit ${CI_JOB_SKIP_EXIT_CODE:-0}
      fi
    - yarn install --frozen-lockfile --prefer-offline --cache-folder .yarn
    - echo "Linting Code"
    - yarn lint --fix || true
    - echo "Formatting Code"
    - yarn format || true
    - |
      if GIT_CHANGES=$(git status --porcelain) && [ -z "$GIT_CHANGES" ]; then
          echo "Nothing to lint. Skipping this job!"
          echo "SKIP_FUTURE_STAGES=false" > build.env
          exit ${CI_JOB_SKIP_EXIT_CODE:-0}
      fi
    - git add .
    - git commit -m "$LINT_COMMIT_MESSAGE" -n
    - git push -u origin $CI_COMMIT_REF_NAME
    - echo "SKIP_FUTURE_STAGES=true" > build.env # Setting variable for stages so that we can skip them in the next stage
    - echo "CI_JOB_SKIP_EXIT_CODE=20" >> build.env # Arbitrary exit code so that future jobs fail and don't waste runner resources
    - exit $CI_JOB_SKIP_EXIT_CODE
  artifacts:
    expire_in: 1 hour
    reports:
      dotenv: build.env

build_job:
  stage: build
  script:
    - echo "Build Job"
    - |
      if [ "$SKIP_FUTURE_STAGES" == "true" ] ; then
          echo "Skipping job due to variable"
          exit ${CI_JOB_SKIP_EXIT_CODE:-0}
      fi
  needs:
    - job: lint_job
      artifacts: true
```

> Disclaimer: This post was written when I was employed at GitLab. The content written above was done in my individual capacity.
