---
slug: 'forced-updates-react-native'
date: '2023-07-10'
featuredImage: '../assets/featured/forced-updates-react-native.png'
title: 'Forced updates with React Native app'
tags: ['node', 'dev ops', 'ci cd', 'automation', 'react native', 'javascript']
---

How do you ensure your mobile application does not crash and burn when you need to make breaking changes to your backend code, which may including updating the graphql schema or even REST API endpoints or more?

It is easy to achieve on a web application as you can control the deployments for both the web application and the backend service. However, when it comes to mobile applications, the release schedule is not controlled by you as it is controlled by the respective application store owners, Apple for the App Store and Google for the Google Play Store.

# Journey

Research is always the first step to discover any solution to the problem you are having, this was no different. Research landed me on Feature Flags which could potentially be used to solve the problem as you could add a feature flag which only allowed the "new" code or the existing code to be run if the feature flag was enabled or not.

However, using feature flags to solve the problem is cumbersome when you want to make changes in multiple places or when a user hasn't updated their mobile application and their version is so backward that the mobile application is sure to crash resulting in a bad user experience.

We were already using semantic versioning on both the mobile application and the backend service, so it would be easy for us to sync both versions and have them depend on semantic versioning to determine if an upgrade was required.

I designed a simple `JSON` format to store information such as the service, the environments, the version of the application and when they were last updated at.

This allowed me to write some pretty simple code to ping an endpoint to get the `JSON` payload and determine if that has been a major version change or not.

# Solve

The following file is a sample of the kind of data that we are using to determine if a forced update is necessary. The file is updated in multiple ways:

- A scheduled job in GitLab will run every hour to determine the current state of the mobile application in both the iOS and Android application stores
- An upstream pipeline that conducts a deployment will trigger the downstream pipeline to run and update the state.

You have to host the file at an endpoint e.g. `version.example.com`. You can simply use any of the static website providers like Netlify or GitHub/GitLab pages.

```json:title=versioning-state.json
{
  "app": {
    "production": {
      "ios": {
        "version": "6.1.0",
        "releasedAt": "2022-08-17T04:05:03.000Z",
        "notes": "We’re about to take group buying to the next level. This release is in preparation for our store and payments integration. Soon, you’ll be able to host group buys for KopiRun supported stores. You and your group will enjoy free delivery, non-jacked up menu prices and discounts on top of that!\nSneak peek of the latest features: - Direct store integration with supported businesses - Place orders for products - Payments integration with PayNow (Only in Singapore)",
        "url": "https://apps.apple.com/us/app/kopirun/id1512434287?uo=4",
        "updatedAt": "2022-08-17T17:06:17.682Z"
      },
      "android": {
        "version": "6.1.0",
        "releasedAt": "2022-08-16T13:44:43.000Z",
        "notes": "We’re about to take group buying to the next level. This release is in preparation for our store and payments integration. Soon, you’ll be able to host group buys for KopiRun supported stores. You and your group will enjoy free delivery, non-jacked up menu prices and discounts on top of that!\nSneak peek of the latest features: - Direct store integration with supported businesses - Place orders for products - Payments integration with PayNow (Only in Singapore) ",
        "url": "https://play.google.com/store/apps/details?id=com.kopirun.app&hl=en&gl=us",
        "updatedAt": "2022-08-17T17:06:17.847Z"
      }
    },
    "development": {
      "version": "1.0.0",
      "updatedAt": "2021-10-22T16:37:44.168Z"
    },
    "review": {
      "version": "1.0.0",
      "updatedAt": "2021-10-22T16:37:44.168Z"
    },
    "regression": {
      "version": "1.0.0",
      "updatedAt": "2021-10-22T16:37:44.168Z"
    }
  },
  "backend": {
    "production": {
      "version": "6.8.3",
      "updatedAt": "2022-09-07T16:25:31.504Z"
    },
    "development": {
      "version": "6.8.2",
      "updatedAt": "2022-08-30T17:15:04.565Z"
    },
    "review": {
      "version": "6.8.2",
      "updatedAt": "2022-08-30T17:18:04.810Z"
    },
    "regression": {
      "version": "6.8.2",
      "updatedAt": "2022-08-30T17:15:33.727Z"
    }
  },
}
```

We used the following code to basically call the endpoint for the `JSON` state and determine if an application needs to be upgraded as long as the major versions differ in the backend and the mobile application.

```javascript:title=updateChecker.js
import { Platform } from 'react-native';
import { version } from 'root/package.json';
import semver from 'semver';

const updateAvailable = async () => {
  try {
    const response = await fetch('https://version.example.com');
    const updateData = await response.json();
    let versionData;

    if (semver.valid(version)) {
      if (Platform.OS === 'ios') {
        versionData = updateData?.app?.production?.ios;
      }

      if (Platform.OS === 'android') {
        versionData = updateData?.app?.production?.android;
      }

      const versionToCheck = versionData?.version;

      // Force update for major versions
      if (semver.valid(versionToCheck)) {
        const majorVersion = semver.major(versionToCheck);
        return !semver.satisfies(version, `>=${majorVersion}.0.0`);
      }
    }
  } catch (error) {
    console.log(error);
  }

  return false;
};

export default updateAvailable;
export { updateAvailable };
```

Here's the application screen that we show to users who require an update of the mobile application.

```javascript:title=screens/UpdateAppScreen.js
import React from 'react';
import { Linking, Platform, StyleSheet, Text, View } from 'react-native';
import Logo from 'assets/logo.svg';
import { Colors, Layouts, Palette } from 'styles';

import PrimaryButton from 'components/buttons/PrimaryButton';

const UpdateAppScreen = props => {
  const appStoreUrl = 'appstore app url';
  const playStoreUrl = 'playstore app url';
  return (
    <View style={[Layouts.centeredSectionWithPadding, { backgroundColor: Colors.white }]}>
      <Logo fill={Colors.black} height={150} width={150} />
      <Text style={[Palette.heading, Layouts.marginTop.md]}>
        We've got a newer, better version of App.
      </Text>
      <Text style={[Palette.boldtext, Layouts.marginTop.md]}>
        Your app needs to be updated to get the latest features.
      </Text>
      <PrimaryButton
        color={Colors.coral}
        style={styles.button}
        text="Update App"
        onPress={() =>
          Platform.OS === 'ios' ? Linking.openURL(appStoreUrl) : Linking.openURL(playStoreUrl)
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.coral,
    marginTop: Layouts.margin.md,
    paddingHorizontal: Layouts.padding.lg
  }
});

export default UpdateAppScreen;
```

We used the `@react-navigation` package to handle navigation within the mobile application and thus this is the place where we want to force users to go into the update screen as it is one of the very early points of entry into the mobile application.

Basically there's a `useEffect` that runs the moment the `navigator` is instantiated, and it returns a `boolean` which is then set to a state variable to determine if the mobile application needs to be updated or not.

If it does, it will show the update screen and only the update screen, otherwise it will show the normal navigation components.

```javascript:title=navigator.js
import { updateAvailable } from 'utilities/updateChecker';
import UpdateAppScreen from 'screens/UpdateAppScreen';

const Navigator = () => {
  const [shouldUpdate, setShouldUpdate] = useState(false);

  useEffect(() => {
    async function checkIfUpdateAvailable() {
      setShouldUpdate(await updateAvailable());
    }
    checkIfUpdateAvailable();
  }, []);

  return shouldUpdate ? (
  <NavigationContainer>
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      <RootStack.Screen component={UpdateAppScreen} name="UpdateApp" />
    </RootStack.Navigator>
  </NavigationContainer>
  ) : (
  <NavigationContainer>
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      ...
    </RootStack.Navigator>
  </NavigationContainer>
  )
}
```
