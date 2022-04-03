---
slug: 'speed-up-react-native-appcenter-builds'
date: '2021-07-26'
featuredImage: '../assets/featured/speed-up-react-native-appcenter-builds.png'
title: 'Speed Up React Native builds in AppCenter'
tags: ['appcenter', 'mobile app', 'ios', 'android', 'react-native', 'dev ops']
---

This is more of a tip to speed up your builds in AppCenter. Have you noticed that your builds are a little slow? The build machines are basically Mac Pro's but we're only getting 3 cores worth of processing power. We can validate this by running the `system_profiler SPHardwareDataType` in a script for our builds and the output should be the following

```bash:title=terminal
system_profiler SPHardwareDataType
Hardware:

    Hardware Overview:

      Model Name: Apple device
      Model Identifier: VMware7,1
      Processor Speed: 3.33 GHz
      Number of Processors: 1
      Total Number of Cores: 3
      L2 Cache (per Core): 256 KB
      L3 Cache: 12 MB
      Memory: 14 GB
      Boot ROM Version: VMW71.00V.13989454.B64.1906190538
      Apple ROM Info: [MS_VM_CERT/SHA1/27d66596a61c48dd3dc7216fd715126e33f59ae7]Welcome to the Virtual Machine
      SMC Version (system): 2.8f0
      Serial Number (system): VMKvRWaCPfZ+
      Hardware UUID: 4203018E-580F-C1B5-9525-B745CECA79EB
```

Did you notice something odd here? We have only 3 measely cores but we have a ton of memory. 14 GB to be exact. That got me thinking about using a ram disk to store `node_modules`, `Pods`, `.gradle`, and other various folders that are used for outputting the build.

Since AppCenter uses the Mac Pro's for both Android and iOS builds, we can use the same commands to mount a ram disk. I am going to be showing you how to do it for `node_modules` and you can apply the same logic to the rest of the folders that you want to create a ram disk for.

A ram disk is basically an bunch of allocated space in memory. It's ephemeral and we're only doing it because we don't care if we lose the data after every build.

# Solve

The following code snippet is placed in my `appcenter-post-clone.sh` script.

1. Create a ramdisk without mounting and assign it to the `NODE_MODULE_RAMDISK` variable
2. Format the ramdisk as a HFS+ volume with the label `NodeModules`
3. Make all directories recursively for the provided path
4. Mount the ramdisk at the node_modules folder

```bash:title=appcenter-post-clone.sh
NODE_MODULE_RAMDISK=$(hdid -nomount ram://4194304) #2GB
newfs_hfs -v NodeModules $NODE_MODULE_RAMDISK
mkdir -p $APPCENTER_SOURCE_DIRECTORY/node_modules || true
diskutil mount -mountPoint $APPCENTER_SOURCE_DIRECTORY/node_modules $NODE_MODULE_RAMDISK
```

You can use the above snippet in combination with my post on [AppCenter caching for Vendor libraries](/blog/appcenter-caching-vendor-libraries)
