---
slug: 'stack-traces-sentry-apollo-graphql'
date: '2021-08-23'
featuredImage: '..//assets/featured/stack-traces-sentry-apollo-graphql.png'
title: 'Stacktraces in Sentry for GraphQL on ApolloServer'
tags: ['node', 'javascript', 'dev ops', 'monitoring', 'sentry']
---

This is not a new problem that I faced but rather it's one that I solved quite awhile back. I haven't see any articles on the topic and I'm here assuming that everyone can get it working properly?

But when I tried to get stack traces to function properly with Sentry and ApolloServer, they just did not want to work together properly in production. So here's what I did to get it working.

# Solve

We are creating a new object based off the original object and appending the stack trace at the root level because Sentry expects the stack trace to be available at the root of the error object.
Apollo went ahead and decided on their own custom format instead of following the traditional conventions so we're forced to do this.

We can use the `Object.create` method as it creates a new object for us to modify and also copies the prototype of the original object to the new object. Sentry's `captureException` method expects an `Error` prototype to be provided to it so this solves both of the requirements.

You will also have to turn debug on for stack traces to appear in the error object for `ApolloServer`, you can easily strip the stacktrace before returning the object or just return a `string` in place.

```javascript
const server = new ApolloServer({
  schema,
  formatError: (error) => {
    app.log.error(error);
    const errorType = error.constructor.name;

    const apolloErrorObject = Object.create(error);
    apolloErrorObject.stack = error.extensions.exception.stacktrace.join('\n');
    Sentry.captureException(apolloErrorObject);

    return stripStacktrace(error);
  },
  debug: true,
  ...
});

const stripStacktrace = (error) => {
  delete error.extensions.exception;
  return error;
};
```
