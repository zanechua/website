---
slug: 'fastify-apollo-graphql-upload'
date: '2021-08-09'
featuredImage: '../images/featured/fastify-apollo-graphql-upload.png'
title: 'Fastify with Apollo Server and GraphQL Upload'
tags: ['graphql', 'node', 'fastify', 'apollo server', 'file upload']
---

Working with new frameworks and relatively "obscure" ones always have the trouble of needing to figure out everything yourself.

Recently I had to implement uploads via GraphQL on ApolloServer 3 with Fastify 3. There was no documentation on how to do so that was specific to Fastify, only the typical express way of implementing the `graphql-upload` package. Thus began the journey on finding out how to do it.

# Journey

Initially I was wrapping my head wrongly around how content parsers work in Fastify and I thought that I needed a plugin so I installed `fastify-multipart` to handle it. Turns out I was wrong about that and if you do install the multi-part plugin, you'll have to uninstall it.

You can only have 1 content parser per `Content-Type`, by registering the plugin you won't be able configure a content-type parser to process the request into the format that `graphql-upload` needs.

# Solve

I found a solution on how to implement `graphql-upload` but it turns out someone already beat me to it and with a more elegant method. You can see the original on GitHub [here](https://github.com/apollographql/apollo-server/issues/4975).

One caveat about the solution below is that I don't need to handle multi-part requests via a REST API at the moment so it doesn't bother me, but I might get around to it one day and I will write about it again if I do.

Just add the following snippet of code to your fastify project and you should be good.

```javascript
import { processRequest } from 'graphql-upload';

fastify.addContentTypeParser('multipart', (req, done) => {
  req.isMultipart = true;
  done();
});

fastify.addHook('preValidation', async function (request, reply) {
  if (!request.isMultipart) {
    return;
  }

  request.body = await processRequest(request.raw, reply.raw, {
    maxFileSize: 10000000, // 10 MB
    maxFiles: 20
  });
});
```

If you need to view a full example, you can find one in this [pull request](https://github.com/apollographql/apollo-server/issues/4975) and it'll be available in the file upload section of [apollo docs](https://www.apollographql.com/docs/apollo-server/data/file-uploads/) when it's merged.
