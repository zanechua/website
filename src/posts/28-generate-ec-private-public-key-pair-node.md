---
slug: 'generate-ec-private-public-key-pair-node'
date: '2023-06-05'
featuredImage: '../assets/featured/generate-ec-private-public-key-pair-node.png'
title: 'Generate EC Private/Public Key Pair Natively in NodeJS'
tags: ['node', 'javascript', 'pki', 'jwt', 'security']
---

Some of my projects are leveraging the [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) package to issue JWTs as access tokens to our users. The package itself requires private and public key pairs to be generated and accepts a few types of keys. One of them is an EC key pair with the `secp521r1` curve. This can be easily generated in openssl with the following commands

```bash:title=terminal
openssl ecparam -genkey -name secp521r1 -noout -out ./ecdsa-p521-private.pem
openssl ec -in ./ecdsa-p521-private.pem -pubout -out ./ecdsa-p521-public.pem
```

However, this required me to install a dependency in my GitLab pipeline for the scaffolding I needed for my test environment. I set out to figure out if I could generate these keys with the NodeJS `crypto` module itself.

# Journey

So after some basic googling, I landed on the following two articles:

- https://stackoverflow.com/questions/74942424/how-to-convert-ecdh-keys-to-pem-format-with-nodejs-crypto-module
- https://stackoverflow.com/questions/66382638/how-to-generate-private-ec-private-public-key-pair-in-der-format-using-node-js/

The first article essentially pointed me to the `generateKeyPairSync` function of the `crypto` module in node.

I successfully built the first implementation that allowed me to achieve my original objective of generating an EC key pair with the `secp521r1` curve removing the need to install the `openssl` dependency on any of my docker containers or pipelines to generate the key pair.

I then looked at the second article which wanted the public keys to be generated in a compressed format. The original poster had already found a solution for themselves by utilizing the `asn1.js` library and defining the schemas for it. I wanted to do it natively without having the need to install anything else.

This brings me back to the last section of the answer in the first article where `Topaco` actually states that you can do so by essentially constructing the keys with the raw private and public keys along with the hardcoded metadata to form a valid EC key. The metadata is not consistent for all curves, it changes as long as the curve is different, whether it's a private or public key, whether the public key is compressed or not.

I had posted an answer on the second article with my first implementation of thinking that that would be an alternative to the original poster's answer, but I missed out the requirement for the public key to be compressed.

I could not figure out how to build the keys manually at the point of time with the first implementation, but I have since updated my answer to include a new implementation that allows you to generate compressed public keys with node, leveraging the `crypto` module without any external dependencies.

# Solve

Here's the first implementation of my code which allows you to generate an EC key in PEM format depending on the curve you specify in the `curve` variable. Use this implementation if you do not care about compressed public keys.

```javascript:title=generateECKeys.js
const crypto = require('crypto');
const fs = require('fs');

if (process.argv.length < 3) {
  console.log('Usage:\r\n\r\n' + 'node generateECKeys.js folder');
  process.exit(1);
}

const relativeDirectory = process.argv[2];

const regex = /.{64}/g;
// Generate the private and public key
const curve = 'secp521r1';
const { publicKey, privateKey } = crypto.generateKeyPairSync('ec', { namedCurve: curve });

// Export the private key
const privateKeyDer = privateKey.export({ type: 'sec1', format: 'der' }).toString('base64');
const formattedPrivateKey = privateKeyDer.replace(regex, '$&\n');

// Save the private key to a file
fs.writeFileSync(
  `${relativeDirectory}/ecdsa-p521-private.pem`,
  `-----BEGIN EC PRIVATE KEY-----\n${formattedPrivateKey}\n-----END EC PRIVATE KEY-----\n`
);

// Export the public key
const publicKeyDer = publicKey.export({ type: 'spki', format: 'der' }).toString('base64');
const formattedPublicKey = publicKeyDer.replace(regex, '$&\n');

// Save the public key to a file
fs.writeFileSync(
  `${relativeDirectory}/ecdsa-p521-public.pem`,
  `-----BEGIN PUBLIC KEY-----\n${formattedPublicKey}\n-----END PUBLIC KEY-----\n`
);
```

This was the updated answer that I had posted to the second stackoverflow article which generates out an EC key pair with a compressed public key using the `secp256k1` curve

You can save the private key into a pem file, feed it into `openssl` with the following command to validate if the associated public key is generated correctly in both a compressed or non-compressed format.

```bash:title=terminal
# Non Compressed Public Key
openssl pkey -pubout -in privatekey.pem

# Compressed Public Key
openssl pkey -pubout -ec_conv_form compressed -in privatekey.pem
```

```javascript:title=generateECKeys.secp256k1.js
// secp256k1

const crypto = require('node:crypto');
const ecdh = crypto.createECDH('secp256k1');
ecdh.generateKeys();

const rawPrivate = ecdh.getPrivateKey('hex');
const rawPublic = ecdh.getPublicKey('hex', 'uncompressed');

const privKey = Buffer.from(rawPrivate, 'hex');
const pubKey = Buffer.from(rawPublic, 'hex'); // uncompressed

// Build the private key
const privA = Buffer.from('30740201010420', 'hex');
const privB = Buffer.from('A00706052B8104000AA144034200', 'hex');
const privateKeyDer = Buffer.concat([privA, privKey, privB, pubKey]);
console.log('Private Key ::');
console.log(privateKeyDer.toString('base64'));
// Private Key ::
// MHQCAQEEICG7oP2vJzOrh3k7Q7PjZ5Yy91Kh0l5LldL2sHD57GwBoAcGBSuBBAAKoUQDQgAEgIjM+1h4s2JROafAyiiGlNooHwTBoKzDRVYAOwTNlpCudExqi5MxHXY3hwTuJOPN5rGJyMSZR/epTxQmmvWHCA==

// Build the public key
const pubA = Buffer.from('3056301006072A8648CE3D020106052B8104000A034200', 'hex');
const publicKeyDer = Buffer.concat([pubA, pubKey]);

const rawCompressedPublic = ecdh.getPublicKey('hex', 'compressed');
const compressedPubKey = Buffer.from(rawCompressedPublic, 'hex'); // compressed
const compressedPubA = Buffer.from('3036301006072A8648CE3D020106052B8104000A032200', 'hex');
const compressedPublicKeyDer = Buffer.concat([compressedPubA, compressedPubKey]);
console.log('Public Key ::');
console.log(publicKeyDer.toString('base64'));

console.log('Compressed Public Key ::');
console.log(compressedPublicKeyDer.toString('base64'));
// openssl pkey -pubout -in privatekey.pem
// Public Key ::
// MFYwEAYHKoZIzj0CAQYFK4EEAAoDQgAEgIjM+1h4s2JROafAyiiGlNooHwTBoKzDRVYAOwTNlpCudExqi5MxHXY3hwTuJOPN5rGJyMSZR/epTxQmmvWHCA==

// openssl pkey -pubout -ec_conv_form compressed -in privatekey.pem
// Compressed Public Key ::
// MDYwEAYHKoZIzj0CAQYFK4EEAAoDIgACgIjM+1h4s2JROafAyiiGlNooHwTBoKzDRVYAOwTNlpA=
```

I wanted to implement one which generates out an EC key pair with a compressed public key using the `secp521r1` curve and I did notice there was a difference in behaviour of the `rawPrivate` key when converted to a hex string. It would sometimes be missing a `01` from the hex string which would render the generated private key invalid.

I added a simple test to add the `01` string if it was not present.

```javascript:title=generateECKeys.secp521r1.js
// secp521r1

const crypto = require('node:crypto');
const ecdh = crypto.createECDH('secp521r1');
ecdh.generateKeys();

const rawPrivate = ecdh.getPrivateKey('hex');
const rawPublic = ecdh.getPublicKey('hex', 'uncompressed');

const privKey = Buffer.from(rawPrivate, 'hex');
const pubKey = Buffer.from(rawPublic, 'hex'); // uncompressed
const privKeyHex = privKey.toString('hex');

// Build the private key
const privA = Buffer.from(`3081DC0201010442${privKeyHex.startsWith('01') ? '' : '01'}`, 'hex');
const privB = Buffer.from('A00706052B81040023A1818903818600', 'hex');
const privateKeyDer = Buffer.concat([privA, privKey, privB, pubKey]);
console.log('Private Key ::');
console.log(privateKeyDer.toString('base64'));
// Private Key ::
// MIHcAgEBBEIBS++rLWx0TEghDwF+WM6t+16+t0dOXFwGiRR5D+ZFIFlTM4R92Y7isJEkh+sxgwsr6i9WfgKnhD9AyexaQQglkBygBwYFK4EEACOhgYkDgYYABAAXnp7e7jcLzVlf99dgcFECPOy09RriQtftEQZ+zKySsaKkQJzA2p7AEYessWluZ3jqvc2iOd23wbtAiz5Aac97/AE1BoNyj+ZOfMlnk1HN7TIAJfsViP75RSUOfnIXLMxh+6vmcOxsFg/2BrcSL9eVPEDRqPxX4cl9UmYQl3pz1CrTEw==

// Build the public key
const pubA = Buffer.from('30819B301006072A8648CE3D020106052B8104002303818600', 'hex');
const publicKeyDer = Buffer.concat([pubA, pubKey]);

const rawCompressedPublic = ecdh.getPublicKey('hex', 'compressed');
const compressedPubKey = Buffer.from(rawCompressedPublic, 'hex'); // compressed
const compressedPubA = Buffer.from('3058301006072A8648CE3D020106052B81040023034400', 'hex');
const compressedPublicKeyDer = Buffer.concat([compressedPubA, compressedPubKey]);
console.log('Public Key ::');
console.log(publicKeyDer.toString('base64'));

console.log('Compressed Public Key ::');
console.log(compressedPublicKeyDer.toString('base64'));
// openssl pkey -pubout -in privatekey.pem
// Public Key ::
// MIGbMBAGByqGSM49AgEGBSuBBAAjA4GGAAQAF56e3u43C81ZX/fXYHBRAjzstPUa4kLX7REGfsyskrGipECcwNqewBGHrLFpbmd46r3Nojndt8G7QIs+QGnPe/wBNQaDco/mTnzJZ5NRze0yACX7FYj++UUlDn5yFyzMYfur5nDsbBYP9ga3Ei/XlTxA0aj8V+HJfVJmEJd6c9Qq0xM=

// openssl pkey -pubout -ec_conv_form compressed -in privatekey.pem
// Compressed Public Key ::
// MFgwEAYHKoZIzj0CAQYFK4EEACMDRAADABeent7uNwvNWV/312BwUQI87LT1GuJC1+0RBn7MrJKxoqRAnMDansARh6yxaW5neOq9zaI53bfBu0CLPkBpz3v8
```

You can use [https://lapo.it/asn1js/](https://lapo.it/asn1js/) to validate that the generated keys are valid EC key pairs with the appropriate curves.
