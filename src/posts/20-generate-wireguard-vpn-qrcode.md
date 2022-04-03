---
slug: 'generate-wireguard-vpn-qrcode'
date: '2021-10-30'
featuredImage: '../assets/featured/generate-wireguard-vpn-qrcode.png'
title: 'Generate a WireGuard QR code deployment package for easy onboarding'
tags: ['homelab', 'infrastructure', 'vpn', 'wireguard', 'sys ops']
---

I needed our dev and testers at [KopiRun](https://kopirun.com)'s to access certain resources securely without having to expose those resources publicly. I think the default choice for organisations would be to use VPNs and wireguard is a very popular choice these days due to it's benefits over OpenVPN.

I was finding it a chore to have to generate credentials for each user so I wrote up a simple script that will generate a public and private keypair; wire guard configuration; QR Code into a folder so that you can easily zip the folder up and send it over to the recipient as their VPN deployment package. Alternatively, they can just scan the QR Code in the folder and that would be sufficient too.

> The generated QR Code contains the private key that is generated, please treat these QR Codes the same as you would passwords.

# Solve

```bash:title=terminal
sudo apt install wireguard qrencode #assuming debian/ubuntu
```

1. Create directory from supplied value
2. Generate public and private key pair and print public key out
3. Look for the text `privatekeytoreplace` and replace it with private key generated in step 2.
4. Generate a QR Code based off the client configuration and save as png

```bash:title=genclient.sh
#!/bin/sh
IP_RANGE=192.168.100.0
CURRENT_IP=$(cat state)
CN="${CURRENT_IP##*.}"
NEW_IP=192.168.100.$(($CN + 1))

mkdir $1
wg genkey | tee ./$1/client.key |  wg pubkey | tee ./$1/client.key.pub | awk '/^/{print "Public Key: "$1}'
cp client.conf ./$1/client.conf
sed -i 's~privatekeytoreplace~'$(cat ./$1/client.key)'~g' ./$1/client.conf
sed -i 's~'"$IP_RANGE"'~'"$NEW_IP"'~g' ./$1/client.conf
qrencode -o ./$1/client.png < ./$1/client.conf
echo $NEW_IP > state
```

```systemd:title=client.conf
[Interface]
PrivateKey = privatekeytoreplace
Address = 192.168.100.0/24
DNS = 1.1.1.1

[Peer]
PublicKey = publickeytofill
AllowedIPs = 192.168.200.8/32
Endpoint = wireguard.example.com:51820
```

Place both files into the same directory, update the public key, ip configuration and endpoint if you would like. Leave the private key field alone. Once done, you can run:

```bash:title=terminal
./genclient.sh *usernamehere*
```

That will create a folder with `*usernamehere*` and the following files:

- client.conf (wireguard configuration)
- client.key (private key)
- client.key.pub (public key)
- client.png (qr code)
