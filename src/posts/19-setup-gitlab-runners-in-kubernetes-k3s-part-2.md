---
slug: 'setup-gitlab-runners-in-kubernetes-k3s-part-2'
date: '2021-10-22'
updatedAt: ['2022-09-08', '2023-08-04']
featuredImage: '../assets/featured/setup-gitlab-runners-in-kubernetes-k3s.png'
title: 'Setting up GitLab Runners in Kubernetes (K3S) - Part 2'
tags: ['homelab', 'infrastructure', 'kubernetes', 'dev ops', 'gitlab', 'ci cd', 'esxi']
---

Continuing from [part 1](/blog/setup-gitlab-runners-in-kubernetes-k3s-part-1) of the setup.

# Solve

## GitLab Runner Setup

### Install Helm

```bash:title=main
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
```

### Prepare the cluster to connect

> The following cluster certificate connection type is deprecated and disabled by default in GitLab 15.0.
> Connecting the cluster to GitLab is not necessary for connecting the runners, so you can skip this section
> if you do not need to monitor the instance or using it for e.g. review apps.
> I'm leaving this section here but hidden as it's not really required.

<details>
<summary>
  <span class="summary-title">Show/Hide</span>
  <div class="summary-chevron-up">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-down"><polyline points="6 9 12 15 18 9"></polyline></svg>
  </div>
</summary>
<div class="summary-content">

Applying the following manifest:

```yaml:title=gitlab-admin-service-account.yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: gitlab
  namespace: kube-system
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: gitlab-admin
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: cluster-admin
subjects:
  - kind: ServiceAccount
    name: gitlab
    namespace: kube-system
```

```bash:title=main
kubectl apply -f gitlab-admin-service-account.yaml
```

Get the cluster certificate

```bash:title=main
kubectl config view --raw \
-o=jsonpath='{.clusters[0].cluster.certificate-authority-data}' \
| base64 --decode
```

Get the service token

```bash:title=main
kubectl -n kube-system describe secret $(kubectl -n kube-system get secret | grep gitlab | awk '{print $1}')
```

Once you have the above, use the `Connect cluster with certificate` option in GitLab and choose to `Connect existing cluster`. You'll be given a form to fill up the information that we've gathered above. The `API URL` would be the FQDN that you've assigned to your cluster.

> Remember to add an allow rule to your firewall (NAT Port Forwarding) for the cluster. I'm assuming that you know how to do this, if there is any clarification needed around this, leave a comment.

</div>
<div class="summary-chevron-down">
		<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-up"><polyline points="18 15 12 9 6 15"></polyline></svg>
</div>
</details>

### Preparing the Runner Manifest

Go to `Settings -> CI/CD -> Runners` and note down the runner registration token

Prepare the manifest for the runner setup and fill in the `runnerRegistrationToken`.

The `pre_clone_script` was obtained from [here](https://gitlab.com/gitlab-org/gitlab-foss/-/issues/47283#note_164716469).

<details>
<summary>
  <span class="summary-title">Manifest file</span>
  <div class="summary-chevron-up">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-down"><polyline points="6 9 12 15 18 9"></polyline></svg>
  </div>
</summary>
<div class="summary-content">

```yaml:title=gitlab-runner.yaml
## GitLab Runner Image
##
## By default it's using gitlab/gitlab-runner:alpine-v{VERSION}
## where {VERSION} is taken from Chart.yaml from appVersion field
##
## ref: https://hub.docker.com/r/gitlab/gitlab-runner/tags/
##
## Note: If you change the image to the ubuntu release
##       don't forget to change the securityContext;
##       these images run on different user IDs.
##
# image: gitlab/gitlab-runner:alpine-v11.6.0

## Specify a imagePullPolicy for the main runner deployment
## 'Always' if imageTag is 'latest', else set to 'IfNotPresent'
##
## Note: it does not apply to job containers launched by this executor.
## Use `pull_policy` in [runners.kubernetes] to change it.
##
## ref: https://kubernetes.io/docs/concepts/containers/assets/#pre-pulled-images
##
imagePullPolicy: IfNotPresent

## Specifying ImagePullSecrets on a Pod
## Kubernetes supports specifying container image registry keys on a Pod.
## ref: https://kubernetes.io/docs/concepts/containers/assets/#specifying-imagepullsecrets-on-a-pod
##
# imagePullSecrets:
#   - name: "image-pull-secret"

## How many runner pods to launch.
# replicas: 1

## How many old ReplicaSets for this Deployment you want to retain
# revisionHistoryLimit: 10

## The GitLab Server URL (with protocol) that want to register the runner against
## ref: https://docs.gitlab.com/runner/commands/README.html#gitlab-runner-register
##
gitlabUrl: https://gitlab.com/

## The Registration Token for adding new Runners to the GitLab Server. This must
## be retrieved from your GitLab Instance.
## ref: https://docs.gitlab.com/ce/ci/runners/README.html
##
runnerRegistrationToken: ""

## The Runner Token for adding new Runners to the GitLab Server. This must
## be retrieved from your GitLab Instance. It is token of already registered runner.
## ref: (we don't yet have docs for that, but we want to use existing token)
##
# runnerToken: ""
#
## Unregister all runners before termination
##
## Updating the runner's chart version or configuration will cause the runner container
## to be terminated and created again. This may cause your Gitlab instance to reference
## non-existant runners. Un-registering the runner before termination mitigates this issue.
## ref: https://docs.gitlab.com/runner/commands/README.html#gitlab-runner-unregister
##
# unregisterRunners: true

## When stopping the runner, give it time to wait for its jobs to terminate.
##
## Updating the runner's chart version or configuration will cause the runner container
## to be terminated with a graceful stop request. terminationGracePeriodSeconds
## instructs Kubernetes to wait long enough for the runner pod to terminate gracefully.
## ref: https://docs.gitlab.com/runner/commands/#signals
terminationGracePeriodSeconds: 3600

## Set the certsSecretName in order to pass custom certficates for GitLab Runner to use
## Provide resource name for a Kubernetes Secret Object in the same namespace,
## this is used to populate the /home/gitlab-runner/.gitlab-runner/certs/ directory
## ref: https://docs.gitlab.com/runner/configuration/tls-self-signed.html#supported-options-for-self-signed-certificates
##
# certsSecretName:

## Configure the maximum number of concurrent jobs
## ref: https://docs.gitlab.com/runner/configuration/advanced-configuration.html#the-global-section
##
concurrent: 10

## Defines in seconds how often to check GitLab for a new builds
## ref: https://docs.gitlab.com/runner/configuration/advanced-configuration.html#the-global-section
##
checkInterval: 30

## Configure GitLab Runner's logging level. Available values are: debug, info, warn, error, fatal, panic
## ref: https://docs.gitlab.com/runner/configuration/advanced-configuration.html#the-global-section
##
# logLevel:

## Configure GitLab Runner's logging format. Available values are: runner, text, json
## ref: https://docs.gitlab.com/runner/configuration/advanced-configuration.html#the-global-section
##
# logFormat:

## Configure GitLab Runner's Sentry DSN.
## ref https://docs.gitlab.com/runner/configuration/advanced-configuration.html#the-global-section
##
# sentryDsn:

## A custom bash script that will be executed prior to the invocation
## gitlab-runner process
#
#preEntrypointScript: |
#  echo "hello"

## For RBAC support:
rbac:
  create: true

  ## Define specific rbac permissions.
  ## DEPRECATED: see .Values.rbac.rules
  # resources: ["pods", "pods/exec", "secrets"]
  # verbs: ["get", "list", "watch", "create", "patch", "delete"]

  ## Define list of rules to be added to the rbac role permissions.
  ## Each rule supports the keys:
  ## - apiGroups: default "" (indicates the core API group) if missing or empty.
  ## - resources: default "*" if missing or empty.
  ## - verbs: default "*" if missing or empty.
  rules: []
  # - resources: ["pods", "secrets"]
  #   verbs: ["get", "list", "watch", "create", "patch", "delete"]
  # - apiGroups: [""]
  #   resources: ["pods/exec"]
  #   verbs: ["create", "patch", "delete"]

  ## Run the gitlab-bastion container with the ability to deploy/manage containers of jobs
  ## cluster-wide or only within namespace
  clusterWideAccess: false

  ## Use the following Kubernetes Service Account name if RBAC is disabled in this Helm chart (see rbac.create)
  ##
  # serviceAccountName: default

  ## Specify annotations for Service Accounts, useful for annotations such as eks.amazonaws.com/role-arn
  ##
  ## ref: https://docs.aws.amazon.com/eks/latest/userguide/specify-service-account-role.html
  ##
  # serviceAccountAnnotations: {}

  ## Use podSecurity Policy
  ## ref: https://kubernetes.io/docs/concepts/policy/pod-security-policy/
  podSecurityPolicy:
    enabled: false
    resourceNames:
    - gitlab-runner

  ## Specify one or more imagePullSecrets used for pulling the runner image
  ##
  ## ref: https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/#add-imagepullsecrets-to-a-service-account
  ##
  # imagePullSecrets: []

## Configure integrated Prometheus metrics exporter
## ref: https://docs.gitlab.com/runner/monitoring/#configuration-of-the-metrics-http-server
metrics:
  enabled: true

## Configuration for the Pods that the runner launches for each new job
##
runners:
  # runner configuration, where the multi line strings is evaluated as
  # template so you can specify helm values inside of it.
  #
  # tpl: https://helm.sh/docs/howto/charts_tips_and_tricks/#using-the-tpl-function
  # runner configuration: https://docs.gitlab.com/runner/configuration/advanced-configuration.html
  config: |
    [[runners]]
      pre_clone_script = 'cat /etc/resolv.conf | sed -r "s/^(search.*|options.*)/#\1/" > /tmp/resolv && cat /tmp/resolv > /etc/resolv.conf'
      [runners.kubernetes]
        namespace = "{{.Release.Namespace}}"
        image = "alpine:latest"
        ## privileged = true

  ## Which executor should be used
  ##
  # executor: kubernetes

  ## Default container image to use for builds when none is specified
  ##
  ## DEPRECATED: See https://docs.gitlab.com/runner/install/kubernetes.html#additional-configuration
  # image: ubuntu:16.04

  ## Specify one or more imagePullSecrets
  ##
  ## ref: https://kubernetes.io/docs/tasks/configure-pod-container/pull-image-private-registry/
  ##
  ## DEPRECATED: See https://docs.gitlab.com/runner/install/kubernetes.html#additional-configuration
  # imagePullSecrets: []

  ## Specify the image pull policy: never, if-not-present, always. The cluster default will be used if not set.
  ##
  ## DEPRECATED: See https://docs.gitlab.com/runner/install/kubernetes.html#additional-configuration
  # imagePullPolicy: ""

  ## Defines number of concurrent requests for new job from GitLab
  ## ref: https://docs.gitlab.com/runner/configuration/advanced-configuration.html#the-runners-section
  ##
  ## DEPRECATED: See https://docs.gitlab.com/runner/install/kubernetes.html#additional-configuration
  # requestConcurrency: 1

  ## Specify whether the runner should be locked to a specific project: true, false. Defaults to true.
  ##
  # locked: true

  ## Specify the tags associated with the runner. Comma-separated list of tags.
  ##
  ## ref: https://docs.gitlab.com/ce/ci/runners/#use-tags-to-limit-the-number-of-jobs-using-the-runner
  ##
  tags: "k3s,container"

  ## Specify the name for the runner.
  ##
  name: "k3snetes"

  ## Specify if jobs without tags should be run.
  ## If not specified, Runner will default to true if no tags were specified. In other case it will
  ## default to false.
  ##
  ## ref: https://docs.gitlab.com/ce/ci/runners/#runner-is-allowed-to-run-untagged-jobs
  ##
  # runUntagged: true

  ## Specify whether the runner should only run protected branches.
  ## Defaults to False.
  ##
  ## ref: https://docs.gitlab.com/ee/ci/runners/#prevent-runners-from-revealing-sensitive-information
  ##
  # protected: true

  ## Run all containers with the privileged flag enabled
  ## This will allow the docker:dind image to run if you need to run Docker
  ## commands. Please read the docs before turning this on:
  ## ref: https://docs.gitlab.com/runner/executors/kubernetes.html#using-dockerdind
  ##
  ## DEPRECATED: See https://docs.gitlab.com/runner/install/kubernetes.html#additional-configuration
  # privileged: false

  ## The name of the secret containing runner-token and runner-registration-token
  # secret: gitlab-runner

  ## Namespace to run Kubernetes jobs in (defaults to the same namespace of this release)
  ##
  ## DEPRECATED: See https://docs.gitlab.com/runner/install/kubernetes.html#additional-configuration
  # namespace:

  ## The amount of time, in seconds, that needs to pass before the runner will
  ## timeout attempting to connect to the container it has just created.
  ## ref: https://docs.gitlab.com/runner/executors/kubernetes.html
  ## DEPRECATED: See https://docs.gitlab.com/runner/install/kubernetes.html#additional-configuration
  # pollTimeout: 180

  ## Set maximum build log size in kilobytes, by default set to 4096 (4MB)
  ## ref: https://docs.gitlab.com/runner/configuration/advanced-configuration.html#the-runners-section
  ## DEPRECATED: See https://docs.gitlab.com/runner/install/kubernetes.html#additional-configuration
  # outputLimit: 4096

  ## Distributed runners caching
  ## ref: https://docs.gitlab.com/runner/configuration/autoscale.html#distributed-runners-caching
  ##
  ## If you want to use s3 based distributing caching:
  ## First of all you need to uncomment General settings and S3 settings sections.
  ##
  ## Create a secret 's3access' containing 'accesskey' & 'secretkey'
  ## ref: https://aws.amazon.com/blogs/security/wheres-my-secret-access-key/
  ##
  ## $ kubectl create secret generic s3access \
  ##   --from-literal=accesskey="YourAccessKey" \
  ##   --from-literal=secretkey="YourSecretKey"
  ## ref: https://kubernetes.io/docs/concepts/configuration/secret/
  ##
  ## If you want to use gcs based distributing caching:
  ## First of all you need to uncomment General settings and GCS settings sections.
  ##
  ## Access using credentials file:
  ## Create a secret 'google-application-credentials' containing your application credentials file.
  ## ref: https://docs.gitlab.com/runner/configuration/advanced-configuration.html#the-runnerscachegcs-section
  ## You could configure
  ## $ kubectl create secret generic google-application-credentials \
  ##   --from-file=gcs-application-credentials-file=./path-to-your-google-application-credentials-file.json
  ## ref: https://kubernetes.io/docs/concepts/configuration/secret/
  ##
  ## Access using access-id and private-key:
  ## Create a secret 'gcsaccess' containing 'gcs-access-id' & 'gcs-private-key'.
  ## ref: https://docs.gitlab.com/runner/configuration/advanced-configuration.html#the-runnerscachegcs-section
  ## You could configure
  ## $ kubectl create secret generic gcsaccess \
  ##   --from-literal=gcs-access-id="YourAccessID" \
  ##   --from-literal=gcs-private-key="YourPrivateKey"
  ## ref: https://kubernetes.io/docs/concepts/configuration/secret/
  ##
  ## If you want to use Azure-based distributed caching:
  ## First, uncomment General settings.
  ##
  ## Create a secret 'azureaccess' containing 'azure-account-name' & 'azure-account-key'
  ## ref: https://docs.microsoft.com/en-us/azure/storage/blobs/storage-blobs-introduction
  ##
  ## $ kubectl create secret generic azureaccess \
  ##   --from-literal=azure-account-name="YourAccountName" \
  ##   --from-literal=azure-account-key="YourAccountKey"
  ## ref: https://kubernetes.io/docs/concepts/configuration/secret/

  cache:
    ## General settings
    ## DEPRECATED: See https://docs.gitlab.com/runner/install/kubernetes.html#additional-configuration and https://docs.gitlab.com/runner/install/kubernetes.html#using-cache-with-configuration-template
    # cacheType: s3
    # cachePath: "gitlab_runner"
    # cacheShared: true

    ## S3 settings
    ## DEPRECATED: See https://docs.gitlab.com/runner/install/kubernetes.html#additional-configuration and https://docs.gitlab.com/runner/install/kubernetes.html#using-cache-with-configuration-template
    # s3ServerAddress: s3.amazonaws.com
    # s3BucketName:
    # s3BucketLocation:
    # s3CacheInsecure: false

    ## GCS settings
    ## DEPRECATED: See https://docs.gitlab.com/runner/install/kubernetes.html#additional-configuration and https://docs.gitlab.com/runner/install/kubernetes.html#using-cache-with-configuration-template
    # gcsBucketName:

    ## S3 the name of the secret.
    # secretName: s3access
    ## Use this line for access using gcs-access-id and gcs-private-key
    # secretName: gcsaccess
    ## Use this line for access using google-application-credentials file
    # secretName: google-application-credentials
    ## Use this line for access using Azure with azure-account-name and azure-account-key
    # secretName: azureaccess


  ## Build Container specific configuration
  ##
  ## DEPRECATED: See https://docs.gitlab.com/runner/install/kubernetes.html#additional-configuration
  builds: {}
    # cpuLimit: 200m
    # cpuLimitOverwriteMaxAllowed: 400m
    # memoryLimit: 256Mi
    # memoryLimitOverwriteMaxAllowed: 512Mi
    # cpuRequests: 100m
    # cpuRequestsOverwriteMaxAllowed: 200m
    # memoryRequests: 128Mi
    # memoryRequestsOverwriteMaxAllowed: 256Mi

  ## Service Container specific configuration
  ##
  ## DEPRECATED: See https://docs.gitlab.com/runner/install/kubernetes.html#additional-configuration
  services: {}
    # cpuLimit: 200m
    # memoryLimit: 256Mi
    # cpuRequests: 100m
    # memoryRequests: 128Mi

  ## Helper Container specific configuration
  ##
  ## DEPRECATED: See https://docs.gitlab.com/runner/install/kubernetes.html#additional-configuration
  helpers: {}
    # cpuLimit: 200m
    # memoryLimit: 256Mi
    # cpuRequests: 100m
    # memoryRequests: 128Mi
    # image: "gitlab/gitlab-runner-helper:x86_64-${CI_RUNNER_REVISION}"

  ## Helper container security context configuration
  ## Refer to https://docs.gitlab.com/runner/executors/kubernetes.html#using-security-context
  ## DEPRECATED: See https://docs.gitlab.com/runner/install/kubernetes.html#additional-configuration
  # pod_security_context:
  #   run_as_non_root: true
  #   run_as_user: 100
  #   run_as_group: 100
  #   fs_group: 65533
  #   supplemental_groups: [101, 102]

  ## Service Account to be used for runners
  ##
  # serviceAccountName:

  ## If Gitlab is not reachable through $CI_SERVER_URL
  ##
  ## DEPRECATED: See https://docs.gitlab.com/runner/install/kubernetes.html#additional-configuration
  # cloneUrl:

  ## Specify node labels for CI job pods assignment
  ## ref: https://kubernetes.io/docs/concepts/configuration/assign-pod-node/
  ##
  ## DEPRECATED: See https://docs.gitlab.com/runner/install/kubernetes.html#additional-configuration
  # nodeSelector: {}

  ## Specify node tolerations for CI job pods assignment
  ## ref: https://kubernetes.io/docs/concepts/configuration/taint-and-toleration/
  ##
  ## DEPRECATED: See https://docs.gitlab.com/runner/install/kubernetes.html#additional-configuration
  # nodeTolerations: {}

  ## Specify pod labels for CI job pods
  ##
  ## DEPRECATED: See https://docs.gitlab.com/runner/install/kubernetes.html#additional-configuration
  # podLabels: {}

  ## Specify annotations for job pods, useful for annotations such as iam.amazonaws.com/role
  ## DEPRECATED: See https://docs.gitlab.com/runner/install/kubernetes.html#additional-configuration
  # podAnnotations: {}

  ## Configure environment variables that will be injected to the pods that are created while
  ## the build is running. These variables are passed as parameters, i.e. `--env "NAME=VALUE"`,
  ## to `gitlab-runner register` command.
  ##
  ## Note that `envVars` (see below) are only present in the runner pod, not the pods that are
  ## created for each build.
  ##
  ## ref: https://docs.gitlab.com/runner/commands/#gitlab-runner-register
  ##
  ## DEPRECATED: See https://docs.gitlab.com/runner/install/kubernetes.html#additional-configuration
  # env:
  #   NAME: VALUE


## Specify the name of the scheduler which used to schedule runner pods.
## Kubernetes supports multiple scheduler configurations.
## ref: https://kubernetes.io/docs/reference/scheduling
# schedulerName: "my-custom-scheduler"

## Configure securitycontext
## ref: http://kubernetes.io/docs/user-guide/security-context/
##
podSecurityContext:
  runAsUser: 100
  # runAsGroup: 65533
  fsGroup: 65533
  # supplementalGroups: [65533]

  ## Note: values for the ubuntu image:
  # runAsUser: 999
  # fsGroup: 999

## Configure resource requests and limits
## ref: http://kubernetes.io/docs/user-guide/compute-resources/
##
resources: {}
  # limits:
  #   memory: 256Mi
  #   cpu: 200m
  # requests:
  #   memory: 128Mi
  #   cpu: 100m

## Affinity for pod assignment
## Ref: https://kubernetes.io/docs/concepts/configuration/assign-pod-node/#affinity-and-anti-affinity
##
affinity: {}

## Node labels for pod assignment
## Ref: https://kubernetes.io/docs/user-guide/node-selection/
##
nodeSelector: {}
  # Example: The gitlab runner manager should not run on spot instances so you can assign
  # them to the regular worker nodes only.
  # node-role.kubernetes.io/worker: "true"

## List of node taints to tolerate (requires Kubernetes >= 1.6)
## Ref: https://kubernetes.io/docs/concepts/configuration/taint-and-toleration/
##
tolerations: []
  # Example: Regular worker nodes may have a taint, thus you need to tolerate the taint
  # when you assign the gitlab runner manager with nodeSelector or affinity to the nodes.
  # - key: "node-role.kubernetes.io/worker"
  #   operator: "Exists"

## Configure environment variables that will be present when the registration command runs
## This provides further control over the registration process and the config.toml file
## ref: `gitlab-runner register --help`
## ref: https://docs.gitlab.com/runner/configuration/advanced-configuration.html
##
# envVars:
#   - name: RUNNER_EXECUTOR
#     value: kubernetes

## list of hosts and IPs that will be injected into the pod's hosts file
hostAliases: []
  # Example:
  # - ip: "127.0.0.1"
  #   hostnames:
  #   - "foo.local"
  #   - "bar.local"
  # - ip: "10.1.2.3"
  #   hostnames:
  #   - "foo.remote"
  #   - "bar.remote"

## Annotations to be added to manager pod
##
podAnnotations: {}
  # Example:
  # iam.amazonaws.com/role: <my_role_arn>

## Labels to be added to manager pod
##
podLabels: {}
  # Example:
  # owner.team: <my_cool_team>

## HPA support for custom metrics:
## This section enables runners to autoscale based on defined custom metrics.
## In order to use this functionality, Need to enable a custom metrics API server by
## implementing "custom.metrics.k8s.io" using supported third party adapter
## Example: https://github.com/directxman12/k8s-prometheus-adapter
##
#hpa: {}
  # minReplicas: 1
  # maxReplicas: 10
  # metrics:
  # - type: Pods
  #   pods:
  #     metricName: gitlab_runner_jobs
  #     targetAverageValue: 400m

## Secrets to be additionally mounted to the containers.
## All secrets are mounted through init-runner-secrets volume
## and placed as readonly at /init-secrets in the init container
## and finally copied to an in-memory volume runner-secrets that is
## mounted at /secrets.
secrets: []
  # Example:
  # - name: my-secret
  # - name: myOtherSecret
  #   items:
  #     - key: key_one
  #       path: path_one

## Additional config files to mount in the containers in `/configmaps`.
##
## Please note that a number of keys are reserved by the runner.
## See https://gitlab.com/gitlab-org/charts/gitlab-runner/-/blob/main/templates/configmap.yaml
## for a current list.
configMaps: {}
```

</div>
<div class="summary-chevron-down">
		<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-up"><polyline points="18 15 12 9 6 15"></polyline></svg>
</div>
</details>

### Installing the Runner

Run the following commands to install the gitlab-runner helm chart.

1. Create `gitlab-runner` namespace
2. Add the gitlab helm chart repo
3. Install the `gitlab-runner` chart to `gitlab-runner` namespace

```bash:title=main
kubectl create ns gitlab-runner
helm repo add gitlab https://charts.gitlab.io
helm install --namespace gitlab-runner gitlab-runner -f gitlab-runner.yaml gitlab/gitlab-runner
```

> If you run the `helm install` command and get the error of `Error: INSTALLATION FAILED: Kubernetes cluster unreachable: the server has asked for the client to provide credentials`
> You can try exporting the credentials again `kubectl config view --raw > ~/.kube/config` to see if that helps

That should install smoothly and auto-provision runners as and when they are needed.

If you want to uninstall the chart you can run:

```bash:title=main
helm uninstall --namespace gitlab-runner gitlab-runner
```

## Change Log

- `2023-08-04` - Added a note about potentially encountering an error running the helm command with regards to `credentials`
- `2022-09-08` - Updated runner manifest to use the new `podSecurityContext` instead of `securityContext` and hide cluster certificate connection
