---
slug: 'reduce-react-native-xcode-build-time-encore'
date: '2021-09-06'
featuredImage: '..//assets/featured/reduce-react-native-xcode-build-time.png'
title: 'Reduce React Native XCode build time Encore'
tags: ['xcode', 'mobile app', 'ios', 'react-native', 'dev ops']
---

The first post about reducing build times for xcode was written at [Reduce React Native XCode build time](/blog/reduce-react-native-xcode-build-time).

Since then, the author who made `xcode-archive-cache` has updated the tool and added support for XCFrameworks.

This allows it to work with `react-native` and any XCode project that uses CocoaPods.

# Journey

I initially tried this tool but was facing issues when compiling the project. I opened an [issue](https://github.com/sweatco/xcode-archive-cache/issues/28) on GitHub with the relevant information to see if it could be fixed.

The author came back smashing with an [update](https://github.com/sweatco/xcode-archive-cache/pull/29) that allowed exactly that to happen.

As compared with [**buildcache**](https://github.com/mbitsnbites/buildcache), [**xcode-archive-cache**](https://github.com/sweatco/xcode-archive-cache) works even better.

Here are the timings I was getting with the [KopiRun](https://kopirun.com) project on the M1 Macbook Pro.

- Clean Project: 10minutes
- buildcache: 7 minutes
- xcode-archive-cache: 5 minutes

# Solve

Create a file called `Cachefile` in the `ios` folder of your project.

Here's a sample that uses a Notification Service Extension with XCode Schemes.

```ruby:title=Cachefile
workspace "kopirun" do
  configuration "release" do
    build_configuration "Release"
  end

  configuration "dev" do
    build_configuration "Dev.Release"
  end

  derived_data_path "build"

  target "kopirun" do
    cache "libPods-kopirun.a"
  end

  target "notification-service-extension" do
    cache "libPods-notification-service-extension.a"
  end
end
```

Create a file called `Gemfile` in the `ios` folder of your project.

```ruby:title=Gemfile
# Gemfile
source "https://rubygems.org"

gem "cocoapods", "1.10.1"
gem "xcode-archive-cache", "0.0.11"
```

Run the following commands to set it up in your project.

1. Change to the `ios` directory
2. Install `cocoapods` and `xcode-archive-cache` based on the `Gemfile`
3. Install Pods for the iOS project

```bash:title=terminal
cd ios
bundle install
bundle exec pod install
```

That's it for the configuration. Commit the modifications into your source control repository.

Before you build and archive the app, you can run the following to build the Pods and inject the built artifacts before you archive the app.

```bash:title=terminal
bundle exec xcode-archive-cache inject --configuration=release --storage="$HOME/build_cache"
```

> One thing to note is that you do not need to commit the changed project files after you inject the build artifacts. You are supposed to discard the changes.
> This works very well especially when you need to reduce the time taken for repetitive builds for QA/Regression testing.

You can verify the the time it takes to build by appending the `time` command infront of the `xcodebuild` command.

```bash:title=terminal
time xcodebuild -workspace ios/kopirun.xcworkspace -scheme kopirun -sdk iphoneos -configuration Release archive -archivePath $PWD/ios/build/kopirun.xcarchive
```

You can use the above configuration in combination with my post on [AppCenter caching for Vendor libraries](/blog/appcenter-caching-vendor-libraries) and [Speed Up React Native builds in AppCenter](/blog/speed-up-react-native-appcenter-builds)
