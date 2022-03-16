---
slug: 'deep-links-ios-android-netlify'
date: '2020-10-09'
featuredImage: '..//assets/featured/deep-links-ios-android-netlify.png'
title: 'Deep Links for iOS and Android on Netlify'
tags: ['netlify', 'mobile app', 'android', 'ios', 'deep link']
---

I was playing around with Netlify to see how it compared to GitHub pages or GitLab pages, and I must say that I'm geuninely impressed with their free offering. They provide a lot of value for hosting static websites. I might even decide to move this site over to Netlify to take advantage of the features that Netlify offers since this is on GitHub pages right now.

I had the need to migrate [KopiRun](https://kopirun.com)'s website to somewhere and decided, why not try out Netlify? Migration took me literally 5 minutes, but I was stuck with having to implement Apple's Universal Links and Android's App Links verification for the domain. We're using CloudFlare as our DNS provider and, you can use CloudFlare workers to supply the information for the `apple-app-site-association` and `assetlinks.json` route. However, CloudFlare doesn't really play nice with Netlify and SSL certification renewal, so you'll most likely end up turning off the proxying for that particular domain which turns off the ability to use CloudFlare workers for anything under that domain.

You can actually configure the verification files directly in your website's repo. Add your `apple-app-site-association.json` and `assetlinks.json` file to the `.well-known` folder in your publish directory.

Add the following snippet to your `netlify.toml` configuration and, you should be golden.

```toml:title=netlify.toml
[[headers]]
  for = "/apple-app-site-association"
  [headers.values]
  Cache-Control = '''
      public,
      max-age=0'''
  Content-Type = "application/json"
  X-Content-Type-Options = "nosniff"

[[headers]]
  for = "/.well-known/apple-app-site-association"
  [headers.values]
  Cache-Control = '''
      public,
      max-age=0'''
  Content-Type = "application/json"
  X-Content-Type-Options = "nosniff"

[[headers]]
  for = "/.well-known/assetlinks.json"
  [headers.values]
  Cache-Control = '''
      public,
      max-age=0'''
  Content-Type = "application/json"
  X-Content-Type-Options = "nosniff"

[[redirects]]
  from = "/apple-app-site-association"
  to = "/.well-known/apple-app-site-association.json"
  status = 200
  force = true

[[redirects]]
  from = "/.well-known/apple-app-site-association"
  to = "/.well-known/apple-app-site-association.json"
  status = 200
  force = true
```
