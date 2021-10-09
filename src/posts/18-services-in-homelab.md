---
slug: 'services-in-homelab'
date: '2021-10-10'
featuredImage: '../images/featured/services-in-homelab.png'
title: 'Services in my HomeLab'
tags: ['homelab', 'infrastructure', 'virtualization', 'esxi', 'applications']
---

I was looking back at my [Universal Server post](/blog/universal-server-build) and realised I mentioned I would talk more about the services that I run in my HomeLab but never did.

I pretty much FORGOT. Well, here it is now.

# Services

- OPNsense
- PowerChute Network Shutdown (PCNS)
- TrueNAS
- VMware vCenter Server
- Plex
- FreePBX
- Development Ubuntu Machine
- Container Ubuntu Machine

## OPNsense

Well, OPNsense basically serves as the router/firewall for the network. I've not used a traditional consumer router in a while now and gotten used to the additional functionality provided by OPNsense. I use custom Unbound rules and configure DNSSEC and DoT (DNS over TLS).

## PowerChute Network Shutdown

This controls the APC UPSes that I have to know when to tell the ESXi host to safely shutdown the machines in the event of a power outage. This works pretty well for the most part

## TrueNAS

TrueNAS (Originally FreeNAS) basically serves as the storage backends for a bunch of services and content within the network.

## VMware vCenter

I am operating 3 sites at the moment in a "hobbyist" capacity and almost all my servers are backed by ESXi. VMware vCenter acts as the main control plane for all of them to make sure the individual nodes are kept updated.

Would love to explore more into the other features of vCenter but at this point it's mainly a glorified update manager.

## Plex

Ah Plex. One of my favourite software applications, this thing is a beast. Throw your content at it and it basically does all the processing. It's like running your own Netflix. There's a hybrid approach taken here in terms of storage where part of it sits in a SMB share from TrueNAS and part of it sits in the cloud.

That is then merged into a single mount point via mergerfs.

## FreePBX

It's the service for my SIP trunk which I use to connect VoIP phones across the 3 sites. Now each site has their own extension and single outgoing number. Probably overkill for a home but hey. It's fun setting up IVR and extensions.

## Development Ubuntu Machine

Basically this machine is my play area. I throw whatever package in it, and it is my development environment. I work in both Windows and MacOS, but if I do work on Windows, I don't usually do development directly on Windows as it's not my deployment environment. So I usually have an SMB mount point with an SSH session open to do development.

All my script ideas and testing is usually done in this machine too.

## Container Ubuntu Machine

Initially I was intending to use something like PhotonOS but realised that in a lab environment, you might as well go with Ubuntu as I'm most familiar with it. This machine runs all the containers for a staging environment and certain environments for [KopiRun](https://kopirun.com). They aren't publicly accessible and you are required to VPN in to be able to connect to these containers.
