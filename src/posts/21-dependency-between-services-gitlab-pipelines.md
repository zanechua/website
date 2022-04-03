---
slug: 'dependency-between-services-gitlab-pipelines'
date: '2021-11-07'
featuredImage: '../assets/featured/dependency-between-services-gitlab-pipelines.png'
title: 'Dependency between Services in GitLab Pipelines'
tags: ['gitlab', 'dev ops', 'ci cd', 'testing']
---

# Journey

In almost any project, you'll want to have some form of testing to ensure that the appliance is working correctly. For this case, we're testing that the built api container can start, connect to the database and redis endpoints and execute functions without fail.

Let's assume that we have a pipeline with the following stages.

- build
- test
- deploy

The build stage is responsible for building the container.

The test stage is responsible for testing the container.

The deploy stage is responsible for deploying the container.

We want to test the container as an artifact, therefore we want to actually boot the container, supply it with similar environment values as you would in a production environment then expect it to be able to complete all api requests according to your snapshots or expected responses.

GitLab allows you to boot services in a job however these services are not interlinked until you turn on a particular [feature flag](https://gitlab.com/gitlab-org/gitlab-runner/-/issues/1042#note_144420147). Ideally you would want to wait for these services to boot before you start up your container. GitLab does not have a simple way to do that at the moment but I'm going to show you how to achieve this.

# Solve

We're adding some feature flags as well as some additional configuration options for the pipeline to speed it up. The key feature flag here that enables the communication between the services to work is the `FF_NETWORK_PER_BUILD`. Basically this allows the services to be provisioned within the same virtual network on the runner and be able to talk to each other.

```yaml:title=gitlab-ci.yml
variables:
  FF_USE_FASTZIP: "true" # enable fastzip - a faster zip implementation that also supports level configuration.
  ARTIFACT_COMPRESSION_LEVEL: fastest # can also be set to fastest, fast, slow and slowest. If just enabling fastzip is not enough try setting this to fastest or fast.
  CACHE_COMPRESSION_LEVEL: fastest # same as above, but for caches
  TRANSFER_METER_FREQUENCY: 5s # will display transfer progress every 5 seconds for artifacts and remote caches.
  FF_NETWORK_PER_BUILD: "true" # enable shared network per build among services
```

The idea over here is a bit of a mash-up between a few solutions I found while scavenging GitLab tickets. Particularly these two issues:

- https://gitlab.com/gitlab-org/gitlab-runner/-/issues/1042#note_144420147
- https://gitlab.com/gitlab-org/gitlab-runner/-/issues/3210#note_380999884

We have the following 3 services:

- apiserver
- mariadb
- redis

Based on the two issues, and understanding of how the GitLab runners operate. You're actually able to write files back to the `$CI_PROJECT_DIR`. Kinda using it as a state directory that is accessible to all 3 services.

We have some code that on completion of initialization will write a file to the `$CI_PROJECT_DIR` which indicates that the service is ready.

The `apiserver` service waits until the project has checked out before proceeding and creates an initialization file.

When mariadb is booted, we start to run the migrations and seeders to set up the test environment.

The `apiserver` service waits again until it finds both initialization files for mariadb and redis. Only then does it hand off the control to the actual entrypoint inside the container. Once handed-off, the container will initialize it as you would if you ran `docker run` using the container as the image.

```yaml:title=gitlab-ci.yml
test_stage:
  stage: test
  services:
    - name: $CI_REGISTRY/$CI_PROJECT_ROOT_NAMESPACE/backend:latest
      alias: apiserver
      command: ["node", "-r", "dotenv/config", "index.js"]
      entrypoint:
        - '/bin/sh'
        - '-c'
        - |
          # wait for project clone/checkout
          # i'm relying on git index to indicate the clone/checkout is done
          until [ -f "$CI_PROJECT_DIR/.git/index" ]; do sleep 1; done;
          echo 'Project is checked out'
          # especially after the lock file has been removed
          while [ -f "$CI_PROJECT_DIR/.git/index.lock" ]; do sleep 1; done;
          echo 'Project lock removed'
          HAS_CONTAINER_INITIALIZED="/srv/http/www/backend/init.touch"
          # Check for container init file
          if [ ! -e "$HAS_CONTAINER_INITIALIZED" ] ; then
            touch "$HAS_CONTAINER_INITIALIZED"
            echo "Setting container up for first run"
            until [ -f "$CI_PROJECT_DIR/mysql.init.touch" ]; do sleep 1; done;
            echo "SQL container initialized"
            # wait 10 second to ensure mysqlserver is up
            sleep 10
            echo "Running migrations"
            yarn migrate
            echo "Seeding database"
            yarn seed
            until [ -f "$CI_PROJECT_DIR/redis.init.touch" ]; do sleep 1; done;
            echo "Redis container initialized"
            # wait 10 second to ensure redis is up
            sleep 10
            echo "Bootstrapping done"
          else
            echo "Container has been initialized before"
          fi
          # pass control to the default image entrypoint
          exec /usr/local/bin/docker-entrypoint.sh "$@"
        # arg $0 should be explicitly passed when using 'sh -c' entrypoints
        - '/bin/sh'
    - name: mariadb:10.6.3
      alias: database
      command: [ "mysqld", "--default-authentication-plugin=mysql_native_password" ]
      entrypoint:
        - '/bin/bash'
        - '-c'
        - |
          # wait for project clone/checkout
          # i'm relying on git index to indicate the clone/checkout is done
          until [ -f "$CI_PROJECT_DIR/.git/index" ]; do sleep 1; done;
          echo 'Project is checked out';
          # especially after the lock file has been removed
          while [ -f "$CI_PROJECT_DIR/.git/index.lock" ]; do sleep 1; done;
          echo 'Project lock removed';
          # copy/setup database init scripts as you need
          cp -R "$CI_PROJECT_DIR/docker/init/." /docker-entrypoint-initdb.d/
          # let backend container know that mysql has booted
          touch $CI_PROJECT_DIR/mysql.init.touch
          echo 'Scripts copied';
          # pass control to the default image entrypoint
          exec /usr/local/bin/docker-entrypoint.sh "$@"
        # arg $0 should be explicitly passed when using 'bash -c' entrypoints
        - '/bin/bash'
    - name: redis:6.2.4-alpine
      alias: redis
      command: [ "redis-server"]
      entrypoint:
        - '/bin/sh'
        - '-c'
        - |
          # wait for project clone/checkout
          # i'm relying on git index to indicate the clone/checkout is done
          until [ -f "$CI_PROJECT_DIR/.git/index" ]; do sleep 1; done;
          echo 'Project is checked out';
          # especially after the lock file has been removed
          while [ -f "$CI_PROJECT_DIR/.git/index.lock" ]; do sleep 1; done;
          echo 'Project lock removed';
          # let backend container know that redis has booted
          touch $CI_PROJECT_DIR/redis.init.touch
          # pass control to the default image entrypoint
          exec /usr/local/bin/docker-entrypoint.sh "$@"
        # arg $0 should be explicitly passed when using 'bash -c' entrypoints
        - '/bin/sh'
```

Hopefully this gives you an idea of how to test your container in an as close to production environment as possible.
