---
slug: 'labs-page-populated'
date: '2020-06-16'
featuredImage: '../assets/featured/labs-page-populated.png'
title: 'Labs Page Populated'
tags: ['homelab', 'hardware']
---

So I finally had some time and decided to quickly populate the lab page with the equipment that I currently have in my server rack. You'll notice that Lab 2 is still empty, and it will be so until I can head down to the location to record the equipment that's there. But ideally it'll get populated some time soon.

The page is designed in such a way that there are a total of 42 rows due to my rack being an APC Netshelter SX 42U. On mobile, the height of the rows may get skewed a bit due to the text overflowing but on desktop you should be able to see the rows have equal heights according to the units that they take up in the server rack. The columns for the 0U mounts have also been added at the sides.

A newly added catalog page can be found at the bottom of the Labs page in hopes that I will start cataloging all the equipment/accessories that are related to my homelab to mitigate me buying duplicates if I already have them. The list is small at the moment but will get longer when I start cataloging and populating it in my free time.

I just recently added 40Gb networking to Lab 1 and wonder if I should write an individual post about 40Gb networking. I might have to do some research about it to elaborate more on the topic as I don't think there's a huge amount of people who have dabbled with fibre at home except of course for the homelabbers.

I'm currently working on VFIO and have managed to run both Windows and MacOS on my Xeon Air 540 workstation. Proxmox worked well with the previous RX 590 that was in my system, but it's been replaced with an RX 5700. I am intending to try to install OpenCore as the bootloader and try to run it on ESXi as ESXi has guest support for MacOS. Hoping to write a separate post about this endeavour!
