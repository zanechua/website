---
slug: "reduce-react-native-xcode-build-time"
date: "2021-07-19"
featuredImage: "../images/featured/reduce-react-native-xcode-build-time.png"
title: "Reduce React Native XCode build time"
---

This was a tough cookie to crack for me. I've been annoyed with how the iOS builds of the [KopiRun](https://kopirun.com) app take like 45minutes to build in AppCenter and was trying to figure out a way to cache the `DerivedData` that gets compiled when you build the app.

For most cases, it's not really an issue since you can get incremental builds if you're building it locally and compile times are pretty spiffy from my experience at least. However that is very different from trying to archive the project and in a `Release` configuration. XCode will **clean** your project and remove any cached data so everytime you try to archive your app, it'll compile everything from scratch. Compiling locally on the M1 Mac isn't the issue but I had to find a way to reduce the build time for iOS.

# Journey

I spent a lot of time searching and trying out different methods of optimisation, from setting the project's `Optimization Level`, `Compilation Mode`, [ccache](https://ccache.dev), [xcode-archive-cache](https://github.com/sweatco/xcode-archive-cache), [cocoapods-binary-cache](https://github.com/grab/cocoapods-binary-cache) but none of it worked well enough or some were just totally irrelevant and only for pure XCode Projects which is not the case. There was a post by someone else about using FastLane to do it but unfortunately we don't use FastLane for [KopiRun](https://kopirun.com) at the moment.

Searching even more landed me on the project [**buildcache-action**](https://github.com/mikehardy/buildcache-action), which is a GitHub action for react-native projects, created by one of the core team members of the `react-native-firebase` project. It uses [**buildcache**](https://github.com/mbitsnbites/buildcache) and he saw a 40-50% reduction in the amount of time it took to build the app and I am seeing such improvements too.

On the first run, it will take the same amount of time as your normal builds but subsequent runs will definitely be 40-50% faster.

# Solve

You'll have to download the latest release from [here](https://github.com/mbitsnbites/buildcache/releases) and extract that to a directory that's in your path.

The instructions below are for MacOS:

1. Download v0.27.1 of `buildcache`
2. Extract `buildcache`
3. Move `buildcache` to `/usr/local/bin`
4. Make `buildcache` executable
5. Verify the `buildcache` command works by invoking the version argument.

```bash
curl -L -O https://github.com/mbitsnbites/buildcache/releases/download/v0.27.1/buildcache-macos.zip
unzip buildcache-macos.zip
mv buildcache/bin/buildcache /usr/local/bin/buildcache
chmod +x /usr/local/bin/buildcache
buildcache -V

BuildCache version 0.27.1
Copyright (c) 2018-2021 Marcus Geelnard

Supported back ends:
  local - Local file system based cache (level 1)
  Redis - Remote in-memory cache (level 2)
  HTTP  - Remote webdav cache (level 2)
  S3    - Remote object storage based cache (level 2)

Third party components:
  cJSON 1.7.13
  cpp-base64 2.rc.04
  hiredis 1.0.1
  HTTPRequest
  lua 5.3.4
  lz4 1.9.2
  xxhash 0.8.0
  zstd 1.4.5
```

So now that you've installed `buildcache`, it's really easy to setup. We'll need to make our `clang` and `clang++` commands appear before the original commands as we need to wrap these commands with the `buildcache` command.

We can do so by checking the path variable that's configured on your system.
```bash
echo $PATH
/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin
```

`clang` and `clang++` are located in `/usr/bin` but we need our commands to come before so that it takes priority when we invoke the commands which allows us to not have to modify the project extensively and it's basically a drop in replacement.

You can either add a path e.g.`~/bin` to your `$PATH` variable and do the symlink there or just symlink `buildcache` into `/usr/local/bin` like I am going to do:

1. Create symlinks for both `clang` and `clang++`
2. Use the `which` command to determine the location of the command we're invoking

```bash
ln -s /usr/local/bin/buildcache /usr/local/bin/clang
ln -s /usr/local/bin/buildcache /usr/local/bin/clang++
which clang
#/usr/local/bin/clang
which clang++
#/usr/local/bin/clang++
```

Once you have the above set-up, you just need to make a small modification to your `Podfile`. This change does not affect other users who do not have `buildcache` installed in their systems and they can compile the app as per normal albeit a bit slower on subsequent runs.

```ruby
post_install do |installer|
react_native_post_install(installer)

installer.pods_project.targets.each do |target|
  target.build_configurations.each do |config|
    config.build_settings["CC"] = "clang"
    config.build_settings["LD"] = "clang"
    config.build_settings["CXX"] = "clang++"
    config.build_settings["LDPLUSPLUS"] = "clang++"
  end
end
end
```

That's it! You can verify the the time it takes to build by appending the `time` command infront of the `xcodebuild` command. Run it twice and compare the difference!

```bash
time xcodebuild -workspace ios/kopirun.xcworkspace -scheme kopirun -sdk iphoneos -configuration Release archive -archivePath $PWD/ios/build/kopirun.xcarchive
```

