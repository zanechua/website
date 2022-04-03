---
slug: 'macos-windows-proxmox-update'
date: '2021-08-31'
featuredImage: '../assets/featured/macos-windows-proxmox.png'
title: 'MacOS and Windows running on Proxmox Update'
tags: ['homelab', 'hardware', 'virtualization', 'macos', 'windows', 'proxmox']
---

So after using this setup for a good year or so, I have some updates in terms of both hardware and solutions to some of the problems that I was facing with the initial build.

## Changes

### Original hardware

- KEB: Tecware Phantom Elite + Gateron Greens
- VID: GoPro Hero 5 Black
- AUD: 3 x Behringer UMC202HD
- MIC: Audio-Technica AT2035
- ACC: EyeGrab GoPro Hero 5 Case
- ACC: Orico A3H7 7-Port USB 3.0 Hub

### Current hardware

- KEB: Tecware Phantom Elite + Kailh BOX Whites
- VID: Sony A6300
- AUD: 2 x Behringer UMC202HD
- AUD: 1 x MOTU M2
- MIC: Rode PodMic
- ACC: UURig C-A6400
- ACC: Acasis HS-70MG 7-Port USB 3.0 Hub
- BIO: HP IR Camera for Windows Hello
- NET: 2 x ASUS USB-BT400 (Bluetooth 4.0)

### Audio Output

In the previous post, I mentioned that there was audio stuttering issues caused by high cpu usage. However I was mistaken about that and based on research, even users on legitimate MacOS devices face it too.

When the audio drops out you'll get sound assertion errors in the kernel logs such as:

```bash:title=terminal
HALS_IOA1Engine::EndWriting: got an error from the kernel trap, Error: 0xE00002D7
```

Unfortunately I was not able to find a fix, and I took a chance with a new audio interface which was the Motu M2 and that resolved the issue of having to live with audio stuttering or cutting out issues.

### Audio Input

I replaced the Audio Technica AT-2035 with a Rode PodMic as the place I am sitting in is quite noisy with server fans running in the background.

The AT-2035 is a condenser mic and basically captures everything whereas the PodMic is a dynamic microphone. I'm not particularly an expert in microphones but this does seem to have helped with regards to the audio quality.

### Webcam/Video

In the previous post, I mentioned that the GoPro would suddenly change resolution and I suspected it was the battery. That was not the case either and I could not figure out a fix for the resolution changing on it's own. I suspect that the GoPro may just be faulty and the warranty period is long over so there's not much of a point to send it for RMA.

I decided to splurge a little and went for a second-hand Sony A6300. The troubles faced with this camera is that if it overheats (especially if you set the output to 4k), it'll turn off. The UURig cage has helped serve as a heatsink and as long as I provide adequate airflow in the rear of the camera + lift the screen off the camera body, it can last more than 2 hours.

There's an issue with the A6300 is that it needs to be power-cycled for god knows what reason. It'll just refuse to start unless you pull the battery. But in this case it's a USB powered dummy battery. I replaced the USB Hub from the Orico to the Acasis as that has buttons that allow you to switch on/off the individual ports. Much easier than having to reach behind to replug the camera everytime as the hub is mounted to the back of my monitor arm.

### Bluetooth

The ASUS BT-400 works in MacOS. Nothing much to say here.

As for Windows, the Orico BTA-508 (RTL8761B chipset) would work when I first plugged it in but on subsequent reboots, it would not work and you would have to unplug/replug for it to start working.

I tried to get it to work properly but I think it's just my hardware configuration that has a reset issue and I can't be bothered to figure out how to fix it.

tl;dr Just use the ASUS BT-400 for both MacOS and Windows

### Biometrics

Decided to introduce Windows Hello into my Windows VM and initially I tried it with a Lenovo 500 FHD camera and even though it worked, I found that it was really inconsistent and took much longer to unlock. What's the point of Windows Hello if it takes longer than you take to type your password.

Instead I went with this [Custom Made Windows Hello Camera](https://item.taobao.com/item.htm?spm=a1z09.2.0.0.48822e8dvwHcLs&id=636857842321) from Taobao.

It's a funky little device which is branded HP but is made by Realtek.

You'll need to install HP drivers along with it. It took me awhile to locate the correct drivers but you can use the drivers provided [here](https://www.station-drivers.com/index.php/ko/forum/usb/240-latest-whql-driver-for-realtek-usb-camera?start=48)

## Conclusion

No other updates so far. The MacOS VM updates to Big Sur just fine but I got myself a M1 MacBook so I probably might not use it as often though it was definitely a very fun experiment.

I might write up a short review/comparison for the two Biometric cameras as there doesn't seem to be much information on them outside of Taobao.
