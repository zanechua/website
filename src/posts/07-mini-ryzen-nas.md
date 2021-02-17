---
slug: "mini-ryzen-nas"
date: "2021-02-17"
featuredImage: "../images/featured/mini-ryzen-nas.png"
title: "Mini Ryzen NAS"
---

I had some spare 10TB drives due to a previous server build failing and not panning out. I looked at the current available pre-built solutions on the market like Synology and QNAP but was unsatisfied with the pricing especially when you factored in 10Gb connectivity. The available solutions were lacking in other areas too, such as memory; expandability as compared to something I could build and would be more modular for future potential.

List of objectives:
* Mini ITX Form Factor
* Not loud like rockets (My fan is louder than the server)

## Build

Hardware Specifications:
* OS: ESXi 6.7
* CSE: Fractal Design Node 304
* MOB: ASRock Rack X570D4I-2T
* CPU: AMD Ryzen 5800x + Noctua NH-U9S + 2 x NF-A9x14
* MEM: 2 x 32GB Kingston PC4-23466 DDR4-2933 ECC Memory (KSM29SED8/32ME)
* PSU: Seasonic X Series 750W Gold
* USB: Sandisk Ultra Fit 32GB
* SSD: Samsung 970 Evo Plus 2TB NVMe SSD
* SSD: 2 x Intel DC S3700 400GB SSD
* HDD: 6 x WD 10TB SATA SSD
* FAN: 1 x Noctua 140mm 12v 0.55A PWM (NF-A14 iPPC-3000 PWM)
* FAN: 2 x Noctua 40mm 12v 0.05A PWM (NF-A4x20 PWM)
* FAN: 2 x Nidec UltraFlo 80mm 12v 0.6A PWM (V80E12BHA5-57)
* ACC: M.2 2280 SSD Cooler with 5v Fan

## Services

Here's what I run on the server itself:
* TrueNAS
* Plex

## Build Process
I was initially deciding on getting a chassis like the Supermicro SC721TQ-250B but decided that I might want to add a GPU in the future for Plex Transcoding so I decided against it. I would rather have hot-swap drive bays but the mounting mechanism for the Node 304 wasn't that bad either so I decided to make a compromise and go with the Node 304.

### OS
Pretty straightforward OS install. Installed ESXi on the Sandisk Ultra Fit that was inserted into the rear.

### Case
The case itself was pretty challenging to work with. Most of the problems were clearance issues but almost all Mini-ITX builds have this. 

I wasn't able to mount 2 x Noctua NF-A9 fans that came with the NH-U9S. Had to switch to the NF-A9x14 which were slightly thinner in comparison and it barely fit. The NH-U9S does fit pretty snug in the case.

![NH-U9S Cooler Top View](../images/posts/mini-ryzen-nas/01.jpg)

![NH-U9S Cooler Right View](../images/posts/mini-ryzen-nas/02.jpg)

![NH-U9S Cooler Left View](../images/posts/mini-ryzen-nas/03.jpg)

I had to bend the PSU extension cable slightly upwards so that the cable would fit. This probably depends on the power supply you use too but for me, it was a little tight with the Seasonic. 

![PSU Extension Cable](../images/posts/mini-ryzen-nas/04.jpg)

The front fans just narrowly cleared with the 3.5" drives mounted.

![Front Fan Mounts](../images/posts/mini-ryzen-nas/05.jpg)

![Front Fan Clearance](../images/posts/mini-ryzen-nas/06.jpg)

The last issue was with the way the drives are mounted. Not sure if that was the intention but the drives are mounted such that you will have 2 rows of connector orientations. 3 of the drive connectors will be at the top whereas the other 3 will be at the bottom. Kinda weird since most power supply cables only come with 4 connectors and you'll have to end up running an extra SATA power cable for the 2.5" mount at the top. The alternative is you just hang the 2.5" SSD drives off both sides of the case which is what I did.

![Drive Connector Orientation](../images/posts/mini-ryzen-nas/07.jpg)

### Motherboard
The motherboard itself is pretty interesting. It's basically an AMD AM4 board with LGA1156 cooler mount. The backplate is glued to the board so the easiest way to mount a cooler is to thread some M3x20mm screws through them instead of risking the removal of the backplate. It has 2 x Intel  X550-AT2 10Gb LAN to boot. That's a lot of hardware to pack in such a small board. The folks over at [LevelOneTechs](https://forum.level1techs.com/t/asrock-x570d4i-2t/154306) found that the PCH and LAN chips were a little toasty and have added active cooling over the heatsinks. I have done the same with the Noctua A4x20, one of them zip tied and the other taped to the IO Plate with 3M VHB tape which you can see above in the Case section.

![ASRock Rack X570D4I-2T](../images/posts/mini-ryzen-nas/08.jpg)

![ASRock Rack X570D4I-2T Board](../images/posts/mini-ryzen-nas/09.jpg)

![ASRock Rack X570D4I-2T IO](../images/posts/mini-ryzen-nas/10.jpg)

The board utilizes a single 12v connector and comes with a ATX 24-Pin to 12v adapter. I think this is part of the new 12V0 standard for boards where they shift the voltage regulators onto the boards instead of having them on the PSU. This helps increase efficiency when converting from AC to DC. The board has the ability to supply power for up to 6 drives with the included cable. You can always just ignore that and use cables hooked up to your PSU which is what I did. 

![ASRock Rack X570D4I-2T Power Cables](../images/posts/mini-ryzen-nas/11.jpg)

Hooking up the drives for Data are done over the OcuLink connectors, but the board only came with a single OcuLink to 4 x SATA breakout. The cables aren't exactly easy to find either or are very expensive. I know that the Supermicro online store has them, but I did get a cheaper quote for 30SGD (22USD) for a single cable. I did however manage to find some OcuLink cables from Taobao at about 20-25SGD, and those work fine. There was even a sideband cable for one of the OcuLink cables, but I've not tested if the sideband works correctly when connected to something like a SATA backplane. You will have to go into the UEFI to change the mode of operation for the OcuLink connectors to SATA if you are utilizing them for SATA drives, otherwise they should be able to operate at PCIe mode too.

![OcuLink to 4 x SATA Cable that came with the board](../images/posts/mini-ryzen-nas/12.jpg)

![OcuLink to 4 x SATA Cable Part Number that came with the board](../images/posts/mini-ryzen-nas/13.jpg)

![OcuLink to 4 x SATA Cable from TaoBao](../images/posts/mini-ryzen-nas/14.jpg)

![OcuLink to 4 x SATA Cable from TaoBao](../images/posts/mini-ryzen-nas/15.jpg)

![ASRock Rack X570D4I-2T Close Up](../images/posts/mini-ryzen-nas/16.jpg)

The IPMI software on the board does leave a little more to be desired. It's modern but at the same time a little slow and buggy as compared to the Supermicro IPMI that I am used to. The IPMI software initially didn't have the ability to control the fan speeds but as of v1.18, they have added this feature. I do feel that the IPMI software still has ways to go but overall it is a very good board with a ton of features. You can check out the STH review [here](https://www.servethehome.com/asrock-rack-x570d4i-2t-amd-ryzen-server-in-mitx/)

![X570D4I-2T IPMI](../images/posts/mini-ryzen-nas/17.png)

### CPU
Not much to say about the Ryzen 5800x as I'm pretty satisfied with the performance. It's way overspecced compared to what you would get in a Synology or QNAP anyway.

### Memory
The only thing about memory would be the board doesn't really support ECC error logging. This is not so much a memory problem but more of a motherboard issue. Other than that, ECC memory will work accordingly.

### PSU 
It's a Seasonic 750W Gold PSU. It works.

### Network
Having 2 x Intel X550-AT2 10Gb NICs built into the board is great. They negotiate well with the HiFiber SFP+10GBASE-T transceivers that I'm using over at the switch side.

![HiFiber SFP+10GBASE-T](../images/posts/mini-ryzen-nas/18.jpg)

![HiFiber SFP+10GBASE-T Transceiver](../images/posts/mini-ryzen-nas/19.jpg)

### Fans
It would have been better if the board came with a few preset fan curves that can be utilized like the Supermicro boards but ASRock has given us the ability to design our own fan curves. I will have to explore that and see what fan curve would be the best to keep the server both cool and quiet.

![X570D4I-2T IPMI Fan Table](../images/posts/mini-ryzen-nas/20.png)

## Summary
The build went pretty straightforward except with the procurement of the CPU and memory. Ryzen 5000 series CPU are extremely hard to come by with everyone wanting to build one, so I'm glad I managed to get one for this build. The memory on the other hand was hard to get at a reasonable price. I wanted to max it out at 128GB but was unable to buy the additional 2 modules for a reasonable price, so I will leave it at 64GB for now. I have read that some people have trouble getting all 4 sticks recognized and running correctly but I am unable to verify this at the moment.

All in all, it's a neat little machine running quietly by the side of the table and I am satisfied with it 😊.

![Mini Ryzen NAS](../images/posts/mini-ryzen-nas/21.jpg)