---
slug: 'javascript-method-chaining'
date: '2021-08-16'
featuredImage: '..//assets/featured/javascript-method-chaining.png'
title: 'Another way to do Javascript Method Chaining'
tags: ['node', 'javascript', 'software engineering']
---

Most ways of how people demonstrate javascript method chaining, is by showing you a class with methods that return the object in itself `this`.

You can then subsequently call other methods and continuing chaining.

However, that got me thinking. What if my class isn't actually an object and perhaps a Facade? It would not make sense to return `this` as I am not trying to reference the object.

# Solve

Since I have been spending a lot of time in the javascript space, I figured out that you can write and return the functions directly.

This way, it's easy to chain and make it really readable in the code for other engineers in your team to implement.

Below is a sample of a `GateKeeper` class that manages roles and permissions.

```javascript:title=GateKeeper.js
class GateKeeper {
  static allow(role) {
    const to = async ability => {
      // Insert Permission Object into database
    };
    return {
      to
    };
  }

  static assign(role) {
    const to = async user => {
      // Insert Record into database for which role is assigned to a user
    };
    return {
      to
    };
  }

  static role() {
    const create = async roleData => {
      // Insert Record into database to create a role
    };
    return {
      create
    };
  }
}

export default GateKeeper;
```

### Usage

```javascript
const role = await GateKeeper.role().create(role);
const permission = await GateKeeper.allow(role).to(ability);
const assignedRole = await GateKeeper.assign(role).to(user);
```
