---
layout: post
title:  "DNS劫持造成的Samba服务访问问题"
date: 2016-04-27 21:19:00 +0800
categories: blog
---
最近在书房的电脑上装了Fedora23系统，设置了Samba文件共享服务分享电影、照片等资源给客厅的小米盒子使用。

Samba服务器的NetBIOS Name 是 erima-fedora, IP地址是 192.168.1.4 . 运行如下命令尝试浏览此Samba服务器上的共享资源信息

   >  #smbclient -N -L erima-fedora  
   >  结果要么返回 protocol negotiation failed: NT_STATUS_CONNECTION_RESET  
   >  要么就是长时间没有任何返回，shell处于挂起状态

会是防火墙问题吗？检查了防火墙设置，没有任何问题。

如果用ip地址替换NetBIOS Name, 运行如下命令

>   # smbclient -N -L 192.168.1.4  
>   可以正常返回Samba服务器的共享信息。

既然通过ip能访问，而通过NetBIOS Name不能访问，那应该是Name Resolution出现了问题。

检查samba服务器上提供NetBIOS名字解析的nmb service

>   #sudo systemctl status nmb.service  
>   显示此服务已经正常启动，没有错误。

尝试使用 nmblookup 命令对 erima-fedora 名字进行解析

>   # nmblookup erima-fedora  
>   输出正常结果  192.168.1.4 erima-fedora<00>

nmblookup可以解析到IP地址, 说明nmb service确实已经正常工作。那问题在哪里呢？

手头没装wireshark,不方便网络抓包诊断问题。那么能让smbclient输出更详细点的诊断信息吗？

原来可以添加 -d 参数，设置debug log级别来诊断问题

>   # smbclient -d 3 -N -L erima-fedora  
>   输出信息截取关键部分如下  
>   resolve_lmhosts: Attempting lmhosts lookup for name erima-fedora<0x20>  
>   resolve_lmhosts: Attempting lmhosts lookup for name erima-fedora<0x20>  
>   resolve_wins: WINS server resolution selected and no WINS servers listed.  
>   resolve_hosts: Attempting host lookup for name erima-fedora<0x20>  
>   Connecting to 180.168.41.175 at port 445  
>   protocol negotiation failed: NT_STATUS_CONNECTION_RESET

可见 smbclient 依次尝试 lmhost, wins, host 进行 name resolution, 最终通过 hosts (DNS)完成了名字解析。但是域名服务器竟然把 erima-fedora 解析到了一个公网地址，而不是内部局域网地址 192.168.1.4.

运行 nslookup 进行域名解析，可以得到一样的结果

>   #nslookup erima-fedora  
>   Non-authoritative answer:  
>   Name: erima-fedora  
>   Address: 180.168.41.175

如果用浏览器打开180.168.41.175， 会被导航到一个广告网站。对无法解析的域名，电信服务器无耻的返回了广告网站的地址！！

man smbclient 查看说明，可见 smbclient 默认会依次使用 "lmhosts", "host", “wins”, “bcast" 进行域名解析，可以设置smb.conf 修改 name resolution order, 把 bcast (NetBIOS broadcast) 优先级提高。修改设置如下

>   name resolve order = lmhosts bcast wins host


再次运行命令

>   smbclient -N -L erima-fedora

终于见到了期待已久的输出。

当然立即修改主机的DNS服务器地址，避免再次被电信DNS服务器进行可耻的域名劫持，是更好的解决办法。
