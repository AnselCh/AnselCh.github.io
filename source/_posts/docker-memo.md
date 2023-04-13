---
title: "[Docker] 練習筆記"
categories:
  - tutorial
date: 2023-04-12 17:22:40
tags: [WSL2 , Docker]
---



# CLI 登入

先用網頁登入docker hub,到Security 新增Tocken
__要先記錄下密碼__
用取得的指令登入 ex: docker login -u anselchen

若失敗

```
service docker stop
rm ~/.docker/config.json
service docker start
```
Try again!

<!--more-->

# 建立Image

寫好Dockerfile

```
# 建立img
docker build -t mem_api .
# 啟動 前面是container name 後面是要啟動的image
docker run -p 8000:8000 --name memberapi mem_api
```

# Push 到 Hub

1. 先建立一個 repository
2. 製作Tag
```
# docker images 查id, <tag>輸入備註
docker tag <image_id> <docker_hub_username>/<repository_name>:<tag>
```
3.
```
docker push <docker_hub_username>/<repository_name>:<tag>
```

4.
```
docker pull <docker_hub_username>/<repository_name>:<tag>

```

ref
1. https://ithelp.ithome.com.tw/articles/10191727#:~:text=%E5%A6%82%E6%9E%9C%E8%A6%81%E9%80%B2%E5%85%A5%20container%20%E7%9C%8B%E6%9C%89%E5%93%AA%E4%BA%9B%E8%B3%87%E6%96%99%E5%A4%BE%E3%80%81%E6%AA%94%E6%A1%88%E6%88%96%E6%98%AF%E8%A6%81%E4%BF%AE%E6%94%B9%E6%AA%94%E6%A1%88%E5%8F%AF%E4%BB%A5%E4%BD%BF%E7%94%A8%E4%BB%A5%E4%B8%8B%E7%9A%84%E6%8C%87%E4%BB%A4%EF%BC%9A%20%24%20docker%20exec%20-it,nginx%20%2Fbin%2Fbash%20nginx%20%E7%82%BA%20Container%20Name%EF%BC%8C%E4%B9%9F%E5%8F%AF%E4%BB%A5%E4%BD%BF%E7%94%A8%20Container%20ID

2. https://blog.gtwang.org/linux/docker-commands-and-container-management-tutorial/

3. https://www.runoob.com/docker/docker-command-manual.html

# WSL2 Docker 安裝

官網: https://learn.microsoft.com/zh-tw/windows/wsl/install-manual
1. 系統管理員 模式中開啟 PowerShell
```
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
wsl --install
```

2. 手動下載 [WSL2 Linux 核心更新套件 (適用於 x64 電腦)](https://wslstorestorage.blob.core.windows.net/wslblob/wsl_update_x64.msi),後安裝

3. 將 WSL 2 設定為預設版本

```
wsl --set-default-version 2
```

4. 手動安裝想要的linux版本 請至[官網](https://learn.microsoft.com/zh-tw/windows/wsl/install-manual),下半部選擇

或是

```
Invoke-WebRequest -Uri https://aka.ms/wslubuntu2004 -OutFile Ubuntu.appx -UseBasicParsing

Add-AppxPackage .\app_name.appx
```

5. 裝好WSL2後，打開WSL2
```
wsl.exe -l -v #查linux版本
wsl.exe --set-version Ubuntu-20.04 2 #切換至V2
wsl.exe --set-default-version 2
wsl --set-default Ubuntu-20.04
```
docker後台也要設定WSL2

6. 在WSL terminal
```
wsl
code . #會打開VScode 左下角可以確認是否為WSL環境
```
<img src="./vscode_wsl2.jpg" alt="ubuntu2004" style="display:block; margin:auto;"/>

7. 更換Systemd(看個人習慣)
```
git clone https://github.com/DamionGans/ubuntu-wsl2-systemd-script.git
cd ubuntu-wsl2-systemd-script
bash ubuntu-wsl2-systemd-script.sh
```
重啟WSL

```
ps aux #查看是否成功讀取
```

ref: https://ithelp.ithome.com.tw/articles/10255920
