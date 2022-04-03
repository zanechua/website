---
slug: 'appcenter-caching-vendor-libraries'
date: '2021-07-12'
featuredImage: '../assets/featured/appcenter-caching-vendor-libraries.png'
title: 'AppCenter caching for Vendor libraries'
tags: ['appcenter', 'mobile app', 'android', 'ios', 'azure', 'react-native', 'node', 'dev ops']
---

You are using AppCenter as your CI/CD tool for your mobile app, and it's great in terms of helping you to distribute the apps to users to test and submitting the application to the Play Store/App Store.

However, your build times are absymal and you are trying to figure out a way to cache your `node_modules`;`Pods`;`.gradle` data so that you don't have to spend `n` number of minutes waiting for the installation of data that is obviously not going to change every single update (For us react-native folks at least).

You look at the AppCenter docs and shockingly in 2021, there's no way to cache ANYTHING and you find this [issue](https://github.com/microsoft/appcenter/issues/473) which is 2 years old at this point and now you are wondering if they'll actually ever implement it or perhaps merge the service with GitHub?

# Journey

Trying to basically write your own cache provider for mobile apps is extremely painful, considering the time the apps take to build.. Lucky you, I've done this for you so you don't have to.

I started out with trying a self-hosted MinIO server on one of my servers and I got terrible speeds. I was getting 6-7 Mb/s down/up if I remember correctly. I did a bit of searching and you can actually figure out that AppCenter runs on Azure DevOps.

We know that AppCenter [only uses MacOS machines](https://docs.microsoft.com/en-us/appcenter/build/software) for both Android and iOS, so if we look at the [docs](https://docs.microsoft.com/en-us/azure/devops/pipelines/agents/hosted?view=azure-devops&tabs=yaml#hardware) for Azure DevOps with regards to Microsoft hosted agents, we see the following note.

> Agents that run macOS images are provisioned on Mac pros. These agents always run in the US irrespective of the location of your Azure DevOps organization. If data sovereignty is important to you and if your organization is not in the US, then you should not use macOS images.

So knowing that the CI runs predominantly in the US, I think it's safe to say that they run in Azure too (go figure). The best way to implement caching would be to use an Azure Blob Storage container located in the US.

Now we need a way to

1. Use cache if cache is present
2. Upload Cache if no cache is present
3. Update cache if `yarn.lock` or `Podfile.lock` has changed

# Solve

I'll only be going through caching of `node_modules` but the same concept applies for the other vendor folders.

Please create a storage container in the `US` region, I used `West US 2` and got speeds in the excess of 2000Mb/s for both downloading and uploading the cache. You will have to configure an application id with the appropriate access rights configured to access your storage container. Please follow the docs [here](https://docs.microsoft.com/en-us/azure/storage/common/storage-auth-aad-app)

Once you have created your storage container, you will need to define the following environment variables in AppCenter:

- AZCOPY_SPA_CLIENT_SECRET
- AZCOPY_APPLICATION_ID
- AZCOPY_TENANT_ID
- AZURE_STORAGE_ACCOUNT_NAME

I have tested that the fastest way to archive and extract is by using `pigz`, we'll also need `azcopy` to talk to our storage blob container but `azcopy` is already included in the build machines.

1. We're installing `pigz` via the brew command
2. Login to your blob storage account so you can copy the files
3. Run commands to copy the `node_modules` archive and the hash of `yarn.lock`
4. Check if a `node_modules` archive exist, if it does extract the archive to the source directory

```bash:title=appcenter-post-clone.sh
# Install Azure CLI
# AppCenter already has azcopy
brew install pigz
echo "Downloading node cache"

# Azure Cache
azcopy login --service-principal  --application-id=$AZCOPY_APPLICATION_ID --tenant-id=$AZCOPY_TENANT_ID || true
azcopy copy "https://$AZURE_STORAGE_ACCOUNT_NAME.blob.core.windows.net/appcenter-cache/$APPCENTER_BRANCH/cache.tar.gz" $APPCENTER_SOURCE_DIRECTORY/cache.tar.gz || true
azcopy copy "https://$AZURE_STORAGE_ACCOUNT_NAME.blob.core.windows.net/appcenter-cache/$APPCENTER_BRANCH/yarn.lock.sha256sum" $APPCENTER_SOURCE_DIRECTORY/yarn.lock.sha256sum || true

if [[ -f cache.tar.gz ]];
then
  echo "Extracting node cache"
  unpigz < cache.tar.gz | tar -xC $APPCENTER_SOURCE_DIRECTORY/ || true
else
  echo "Node cache unavailable"
fi
```

1. Check the hash of the `yarn.lock` file to the one we copied from cache to see if it's the same
2. If it's not the same, we'll be reuploading the cache.
3. Generate a new hash of the `yarn.lock` file
4. Create an archive of the `node_modules` folder
5. Upload cache only if it's bigger than 1 MB

```bash:title=appcenter-post-build.sh
# Check the hash of yarn.lock
if ! shasum -a 256 -c yarn.lock.sha256sum; then
  echo "Removing old node cache"
  rm -rf $APPCENTER_SOURCE_DIRECTORY/cache.tar.gz
  rm -rf $APPCENTER_SOURCE_DIRECTORY/yarn.lock.sha256sum
  echo "yarn.lock checksum does not match cache"
  shasum -a 256 yarn.lock > yarn.lock.sha256sum
  echo "Archiving node cache"
  tar cf - node_modules | pigz -1 -p 32 > cache.tar.gz
  NODE_ARCHIVE_SIZE=$(wc -c < cache.tar.gz)
  if [[ $NODE_ARCHIVE_SIZE -ge 1000000 ]]
  then
    echo "Uploading node cache"
    azcopy login --service-principal  --application-id=$AZCOPY_APPLICATION_ID --tenant-id=$AZCOPY_TENANT_ID || true
    azcopy copy $APPCENTER_SOURCE_DIRECTORY/cache.tar.gz "https://$AZURE_STORAGE_ACCOUNT_NAME.blob.core.windows.net/appcenter-cache/$APPCENTER_BRANCH/cache.tar.gz" || true
    azcopy copy $APPCENTER_SOURCE_DIRECTORY/yarn.lock.sha256sum "https://$AZURE_STORAGE_ACCOUNT_NAME.blob.core.windows.net/appcenter-cache/$APPCENTER_BRANCH/yarn.lock.sha256sum" || true
  else
    echo "Node cache archive is too small to be valid, not uploading"
  fi
else
  echo "yarn.lock hash is the same as cache, not updating cache"
fi
```

So now you know how to cache `node_modules` in AppCenter. I have seen `yarn install` go up to 5 minutes in AppCenter, compared to only about 5 to 7 seconds when you use the cache. It also takes only about 15-30seconds in total for the cache to extract/archive. So all in all, it's still faster than doing a `yarn install` each time.

Don't forget that you can do this for your other vendor folders too.
