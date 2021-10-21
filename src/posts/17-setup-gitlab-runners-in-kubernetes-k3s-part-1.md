---
slug: 'setup-gitlab-runners-in-kubernetes-k3s-part-1'
date: '2021-10-03'
featuredImage: '../images/featured/setup-gitlab-runners-in-kubernetes-k3s.png'
title: 'Setting up GitLab Runners in Kubernetes (K3S) - Part 1'
tags: ['homelab', 'infrastructure', 'kubernetes', 'dev ops', 'gitlab', 'ci cd', 'esxi']
---

This has been on my todo list for a while now for [KopiRun](https://kopirun.com). I had been using Azure VMs as GitLab runners, but we were trying to keep them under a certain cost, and unfortunately it was not feasible for us to keep the runners on Azure at the kind of performance we were getting. While I on the other hand had spare capacity within 3 sites and decided to run k3s on my ESXi nodes. The 3 sites are on their individual power grid + internet connection so in some sense there's already High Availability in separate availability zones involved (Not that I put any work into it) 😂.

# Journey

I had done a bit of kubernetes before when I was trying out some QwikLabs last year and even provisioning an AKS (Azure Kubernetes Service) resource in Azure just to check it out. Other than that, my experience with kubernetes has pretty much been zilch.

When I first started with provisioning a K3S cluster, I followed the tutorials in k3s docs on setting up the main node and then the worker nodes. I applied the requisite GitLab manifests to be able to connect the node to GitLab, but I hit a snag. No matter what I did, GitLab was unable to talk to my cluster. I tried dabbling with it until I unfortunately had more pressing things to do and dropped it.

I resumed another day and verified the manifest configuration in the namespaces of the cluster. Turns out in my first foray into kubernetes, I had deleted a configuration value from the k3s cluster. The other problem was the nginx reverse proxy that I had placed in front of it and GitLab was having none of it.

I tore down the existing cluster, and it's nodes and started from scratch. Once I rechecked my configurations and manifests, I was able to add my cluster to GitLab. Then I installed the GitLab Runner helm chart into the cluster. I configured the yaml with the relevant values set and tagged my jobs with k3s. Was so excited to see the runners get auto initialized only to have them fail right after.

The runners were complaining that they could not resolve any external domains. It took a bit of debugging and the problem was that the alpine image has a bug in how it resolves dns entries. The `ndots` value is defaulted to 5 in kubernetes clusters. This means that it'll resolve domains that have less than 5 dots in your local search domains. Only once those return nothing, it should do an absolute query. But alpine does not do the absolute query and therefore just fails.

A `pre_clone_script` needed to be added to remove the search domains so that external domains would resolve correctly. This [bug](https://github.com/gliderlabs/docker-alpine/issues/255) has been known since 2017,and it's still not fixed.

Once I got past that, the rest was pretty smooth sailing. Setting up the cache in azure for the runners. The pipeline runs for [KopiRun](https://kopirun.com) are now at least 2 x faster. Can't complain about that.

All in all, still much to learn about kubernetes but was pretty fun in solving a real world problem for the team.

# Solve

There are different nodes that you need to run the commands on. I've labelled these snippets with `main` or `worker`.

- `main` represents the control-plane node
- `worker` represents the worker nodes

## Node Setup

I installed an instance of Ubuntu Server on each of the 3 ESXi hosts.

Node Configuration:

- CPU: 16 Core
- MEM: 16 GB
- HDD: 32 GB
- HDD: 128 GB

Edit your `/etc/hosts` file with the hostnames + FQDN of the other nodes.

1. Expand root disk to consume full size.
2. Enable IP Forwarding
3. Reboot
4. List all block devices
5. Login as root user
6. Use disk /dev/sdb and prepare for partitioning
7. Format /dev/sdb1 as ext4 with 8192 bytes per inode
8. Make directory at /mnt/k3s-store
9. Mount /dev/sdb1 to /mnt/k3s-store
10. List block device information
11. Edit /etc/fstab

> Before running the commands, please note that 128 GB disk may be on a different mount point than `/dev/sdb`. Please verify with `lsblk` that the device is mounted otherwise please modify the command as needed.

```bash:title=main/worker
# Use all available disk space
lvextend -l +100%FREE /dev/mapper/ubuntu--vg-ubuntu--lv
# Enable IP Forwarding
sudo sed -i 's~#net.ipv4.ip_forward=1~net.ipv4.ip_forward=1~g' /etc/sysctl.conf
sudo reboot
lsblk
sudo -i
fdisk /dev/sdb # new -> primary -> _enter_ -> write
mkfs -t ext4 -i 8192  /dev/sdb1
mkdir -p /mnt/k3s-store
mount /dev/sdb1 /mnt/k3s-store
blkid
nano /etc/fstab
```

Copy the UUID from the `blkid` command for `/dev/sdb1`

```text:title=/etc/fstab
UUID=81cb55b0-c012-4308-9e58-d6b9460887ff /mnt/k3s-store ext4 defaults,discard 0 1
```

Save the file with `Ctrl + O` then _Enter_ followed by `Ctrl + X` to exit.

### Setting up the main node

I chose to go with the Calico CNI (Container Network Interface) instead of the default Flannel CNI since Calico is more prevalent in kubernetes clusters.

```bash:title=main
# Install K3S Server without flannel which is the default CNI
curl -sfL https://get.k3s.io | INSTALL_K3S_EXEC="--flannel-backend=none --disable-network-policy --cluster-cidr=10.42.0.0/16 --data-dir=/mnt/k3s-store" sh -
wget https://docs.projectcalico.org/manifests/calico.yaml
```

Add the following snippet to `calico.yaml` to the `calico` type above the `policy` key.

```yaml:title=main
"container_settings": {
    "allow_ip_forwarding": true
},
```

Run the following to complete the setup for the main node of the cluster.

Add your WAN IP to the FQDN's zone provider.

```bash:title=main
kubectl config view --raw > ~/.kube/config
chmod 600 ~/.kube/config
kubectl apply -f calico.yaml
```

### Adding worker nodes

To add more nodes to the cluster. Run the following command to get the server token to use in the command that you run on the worker nodes.

```bash:title=main
cat /mnt/k3s-store/server/node-token
```

```bash:title=worker
# K3S Nodes
curl -sfL https://get.k3s.io | K3S_URL=https://k3s.example.com:6443 K3S_TOKEN=TOKEN INSTALL_K3S_EXEC="--data-dir=/mnt/k3s-store" sh -
```

Now that the cluster is set up, follow part 2 [here](/blog/setup-gitlab-runners-in-kubernetes-k3s-part-2) to complete the runner setup.
