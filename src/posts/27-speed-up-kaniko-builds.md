---
slug: 'speed-up-kaniko-builds'
date: '2023-05-03'
featuredImage: '../assets/featured/speed-up-kaniko-builds.png'
title: 'Speed up Kaniko builds'
tags: ['gitlab', 'node', 'dev ops', 'ci cd', 'automation', 'javascript', 'container']
---

Kaniko is a pretty popular tool for building container images today as it does not require any kind of privilege or root permission to build containers unlike Docker-in-Docker. Having the ability to build container images without privilege while reducing the container build time is especially important when you have subsequent pipeline stages that require the usage of the container. e.g. Running the container as a service and running integration tests on it.

The problem with Kaniko today is that the build times are really slow due to the way it works and optimizing the arguments does not seem to always help.

# Journey

Optimizing Kaniko build duration has been a tricky problem that I have been trying to solve. This is my fifth attempt at trying to improve the container build duration and I have finally seen significant improvements in the build duration as well as it being very consistently fast.

This time I stumbled upon this [issue](https://github.com/GoogleContainerTools/kaniko/issues/2021) in the Kaniko repository. Basically the crux of the issue is that Kaniko mounts the `--context` argument as a volume in the `Dockerfile` when you're building the container and the `WORKDIR` is set to the same directory. This does not happen in typical Docker-in-Docker builds however this got me thinking if we can take advantage of this behvaiour.

I have written before about how you can [Improving GitLab Pipeline Speeds for NodeJS](/blog/improve-gitlab-pipelines-node) by using a `cache_job`. If you combine this with [Lint and Format Code in NodeJS with GitLab Pipelines](/blog/lint-and-format-code-node-gitlab-pipelines), you essentially only need one job to run at the start of every CI run that basically bootstraps the cache and project for you.

Once that cache has been bootstrapped, you set the Kaniko `--context` argument and the `WORKDIR` in the `Dockerfile` as the same directory. This way the CI will pass the cached libraries into the container build which allows you to use the cached libraries instead of having to spend time reinstalling the libraries again. There are a few caveats though.

1. You must use the same architecture for your cache as well as your Dockerfile. E.g. You cannot use an `aarch64` cache and then try to build the container for `x86_64`. The cache will be invalid due to the differences in architecture.
2. You must have fast IO for your cache restore, otherwise its pointless as it will even be slower without cache

This improvement is not limited to any particular language or DevSecOps Platform and can be used for any other language or platform as long as you have a way to utilize a caching strategy that contains your library dependencies.

I am unsure if the linked issue above is an actual bug with Kaniko and will be fixed in a future version, or it is working as intended. Either way, we can take advantage of the way Kaniko works today to improve the build times.

I have seen improvements of around 300%, the build time for the container was around 6-minutes before utilizing the cache. After leveraging this technique, it basically dropped to a 2-minute build.

The Kaniko build cache is also utilized more than it was previously.

# Solve

I will be providing an example using GitLab as that is what I am most familiar with but this should work the same for any other DevSecOps platform.

I am utilizing the same `cache_job` job from the post about [Improving GitLab Pipeline Speeds for NodeJS](/blog/improve-gitlab-pipelines-node), we will be using it as a dependency for the `container_build_job`. The job is very similar to the example that is provided in the GitLab docs with a few notable changes:

- No `--cache-copy-layers` argument is present as I use multi-stage container builds
- Added cache key to pull the library caches
- Bash replacement to replace slashes with dashes due to Kaniko not accepting slashes
- Additional build arguments that are passed through to the `Dockerfile`

```yaml:title=gitlab-ci.yml
container_build_job:
  stage: build
  image:
    name: gcr.io/kaniko-project/executor:v1.9.2-debug
    entrypoint: [""]
  cache:
    - key:
        files:
          - yarn.lock
      paths:
        - node_modules/
        - .yarn/
      policy: pull
  variables:
    IMAGE_LABELS: >
      --label vcs-url=$CI_PROJECT_URL
      --label com.gitlab.ci.email=$GITLAB_USER_EMAIL
      --label com.gitlab.ci.tagorbranch=$CI_COMMIT_REF_NAME
      --label com.gitlab.ci.pipelineurl=$CI_PIPELINE_URL
      --label com.gitlab.ci.commiturl=$CI_PROJECT_URL/commit/$CI_COMMIT_SHA
      --label com.gitlab.ci.cijoburl=$CI_JOB_URL
      --label com.gitlab.ci.mrurl=$CI_PROJECT_URL/-/merge_requests/$CI_MERGE_REQUEST_ID
  script:
    - echo "Container Build Job"
    - |
      echo "Building and shipping image to $CI_REGISTRY_IMAGE"
      if [[ "$CI_COMMIT_BRANCH" == "master" ]]; then
        ADD_LATEST_TAG="--destination $CI_REGISTRY_IMAGE:latest";
      fi
    - |
      if [[ -n "$ADDITIONAL_TAG_LIST" ]]; then
        for TAG in $ADDITIONAL_TAG_LIST; do
          FORMATTED_TAG_LIST="${FORMATTED_TAG_LIST} --destination $CI_REGISTRY_IMAGE:$TAG ";
        done;
      fi
    - |
      echo "{\"auths\":{\"$CI_REGISTRY\":{\"auth\":\"$(echo -n $CI_REGISTRY_USER:$CI_REGISTRY_PASSWORD | base64)\"}}}" > /kaniko/.docker/config.json
      echo /kaniko/executor --cache=true --snapshot-mode=redo --use-new-run --context $CI_PROJECT_DIR --dockerfile $CI_PROJECT_DIR/Dockerfile --destination $CI_REGISTRY_IMAGE:${CI_COMMIT_REF_NAME//\//-} --destination $CI_REGISTRY_IMAGE:$CI_COMMIT_SHORT_SHA $ADD_LATEST_TAG $ADD_VERSION_TAG $FORMATTED_TAG_LIST $IMAGE_LABELS --label build-date=`date -Iseconds` --build-arg CI_PROJECT_DIR=$CI_PROJECT_DIR --build-arg CI_COMMIT_SHORT_SHA=$CI_COMMIT_SHORT_SHA --build-arg CI_COMMIT_TAG=$CI_COMMIT_TAG --build-arg CI_COMMIT_TIMESTAMP=$CI_COMMIT_TIMESTAMP
      if [[ "$CI_COMMIT_TAG" == "" ]]; then CI_COMMIT_TAG="untagged"; fi
      /kaniko/executor \
        --cache=true \
        --use-new-run \
        --snapshot-mode=redo \
        --context $CI_PROJECT_DIR \
        --dockerfile $CI_PROJECT_DIR/Dockerfile \
        --destination $CI_REGISTRY_IMAGE:${CI_COMMIT_REF_NAME//\//-} \
        --destination $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA \
        --destination $CI_REGISTRY_IMAGE:$CI_COMMIT_SHORT_SHA $ADD_LATEST_TAG $ADD_VERSION_TAG $FORMATTED_TAG_LIST $IMAGE_LABELS \
        --label build-date=`date -Iseconds` \
        --build-arg CI_PROJECT_DIR=$CI_PROJECT_DIR \
        --build-arg CI_COMMIT_SHORT_SHA=$CI_COMMIT_SHORT_SHA \
        --build-arg CI_COMMIT_TAG=$CI_COMMIT_TAG \
        --build-arg CI_COMMIT_TIMESTAMP=$CI_COMMIT_TIMESTAMP
  retry: 2
  needs:
    - job: cache_job
      artifacts: true
```

Here's my multi-stage `Dockerfile` which has 3 stages

1. `dependencies` stage
2. `builder` stage
3. `production` stage

The `dependencies` stage basically just utilizes the cached library dependencies and tries to install the dependencies. In the event that no cache is present, the stage will succeed but if cache is present, it will complete in a few seconds.

The `builder` stage basically sets-up your code and runs your build commands, e.g. babel or simply copying over the javascript files that are meant to be in the production container. It first starts out with the development library dependencies, but we run a `yarn install` with the `--production` flag so that we only get the necessary modules in production, reducing the bloat on the final container image.

The last stage, the unnamed stage essentially but let's call it the `production` stage as it will be the stage that determine what files make it into the final container image. In this stage, we are setting up some default arguments like `UID` and `GID` that represent `User ID` and `Group ID` respectively. We are also setting the default `user` and `group `. We add the `shadow` and `sudo` packages to bootstrap the `user` and the `group` based on the `UID` and `GID`. Once that is done, we copy over the entrypoint, the built files, as well as the production dependencies, and change the owner of the copied files to `user` and `group`. We run `yarn install` again to make sure that the integrity of the `node_modules` we copied over is validated and should finish in a few seconds. We finish by setting up the health check, entrypoint and command for the container.

> This is a rootless container, and therefore you will be unable to use privileged ports e.g. 80 or 443. That's why this container is using 8080

```docker:title=Dockerfile
# Install dependencies only when needed
FROM node:18.16.0-alpine as dependencies
# Use the CI_PROJECT_DIR as the WORKDIR as it is the context argument for kaniko and is mounted by default
# Unsure if bug or intended behaviour: https://github.com/GoogleContainerTools/kaniko/issues/2021
ARG CI_PROJECT_DIR
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
#RUN apk add --no-cache libc6-compat
# Take advantage of the context of kaniko being mounted and therefore being able to use the cached build dependencies from GitLab
# The only caveat is the cached build dependencies have to be for the same architecture, otherwise it will likely not work
WORKDIR $CI_PROJECT_DIR
RUN yarn install --frozen-lockfile --prefer-offline --cache-folder .yarn

FROM node:18.16.0-alpine as builder
ARG CI_PROJECT_DIR
WORKDIR /builder
# Use node_modules and .yarn cache
COPY --from=dependencies $CI_PROJECT_DIR/node_modules ./node_modules
COPY --from=dependencies $CI_PROJECT_DIR/.yarn ./.yarn
# Copy relevant files/sources so we can run a build
# Install package versions based on lock file
RUN yarn install --frozen-lockfile --prefer-offline --cache-folder .yarn
# Build code
RUN yarn build
# Use production library dependencies
RUN yarn install --frozen-lockfile --production --prefer-offline --cache-folder .yarn

FROM node:18.16.0-alpine
ARG UID=12345
ARG GID=23456
ENV UID=${UID}
ENV GID=${GID}
ENV USER=docker
ENV GROUP=docker
ENV WORKDIR=/srv/http/www/backend
USER root
#https://github.com/mhart/alpine-node/issues/48#issuecomment-430902787
RUN apk add --no-cache shadow sudo && \
    if [ -z "`getent group $GID`" ]; then \
      addgroup -S -g $GID $GROUP; \
    else \
      groupmod -n $GROUP `getent group $GID | cut -d: -f1`; \
    fi && \
    if [ -z "`getent passwd $UID`" ]; then \
      adduser -S -u $UID -G $GROUP -s /bin/sh $USER; \
    else \
      usermod -l $USER -g $GID -d /home/$USER -m `getent passwd $UID | cut -d: -f1`; \
    fi
COPY --from=builder /builder/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh
WORKDIR $WORKDIR
RUN chown -R $USER:$GROUP $WORKDIR
# Tell docker that all future commands should run as the docker user
USER $USER
COPY --chown=$USER:$GROUP --from=builder /builder/node_modules ./node_modules
COPY --chown=$USER:$GROUP --from=builder /builder/build .
RUN yarn install --frozen-lockfile --production --prefer-offline
HEALTHCHECK CMD wget --no-verbose --tries=1 --spider http://localhost:8080/probe || exit 1
EXPOSE 8080
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["yarn", "start:server"]
```

So in summary, you are now able to get faster builds by leveraging the pipeline cache and the volume mounting behaviour of Kaniko today.

Hope that helped you, please feel free to leave a comment to let me know if this worked or did not work for you.

> Disclaimer: This post was written when I was employed at GitLab. The content written above was done in my individual capacity.
