---
slug: 'building-secret-free-nextjs-containers'
date: '2021-11-18'
featuredImage: '../images/featured/building-secret-free-nextjs-containers.png'
title: 'Building secret free NextJS containers'
tags: ['containers', 'dev ops', 'nextjs', 'javascript', 'react']
---

# Journey

I was working on some projects in NextJS and wanted to containerise these projects so that they are easily transportable but hit into this snag where the `.env` values would be directly compiled into the javascript bundle and stored in the container.

That got me thinking about how do I build the container without said `.env` values. I understand that at the end of the day the end user is still going to be able to view these values if they open up their browser and view the bundles themselves, but ideally I don't want to store any values in the container until I boot them up.

# Solve

Add the package to your NextJS project

```bash:title=terminal
yarn add @beam-australia/react-env
```

Prepare the following files:

```bash:title=entrypoint.sh
#!/bin/sh
set -e

# Generate env for runtime use
yarn react-env --env APP_ENV
# Execute any subsequent command
exec "$@"
```

```dockerfile:title=Dockerfile
FROM node:alpine
WORKDIR /app

(...) truncated, all the other build tasks

# You can choose to put the entrypoint with yarn react-env here
# but I've chosen to use an entrypoint script instead
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh
ENTRYPOINT ["entrypoint.sh"]

CMD ["yarn", "start"]
```

```jsx:title=__document.js
<Head>
  <script type="text/javascript" src="/__ENV.js" />
</Head>
```

```dotenv:title=.env.staging
REACT_APP_SECRET=sekret
```

```jsx:title=page.js
import env from '@beam-australia/react-env';
<p>{env('SECRET')}</p>
```

### Build

```bash:title=terminal
docker build -t next-app -f Dockerfile .
```

## Usage

At this point we have an image with no environment values in the built image.

Assuming we're deploying for the staging environment, running the following will allow us to:

- Map the host's port 8080 to the container's 3000
- Define `APP_ENV` environment variable to be `staging` for the container
- Bind the volume `.env.staging` from the host to the container

```bash:title=terminal
docker run -p 8080:3000 --env APP_ENV=staging -v $(pwd)/.env.staging:/app/.env.staging next-app
```

After running the command, the `__ENV.js` will be generated in the `/app/public` in the container. You can verify by going to the directory after the container has booted.
