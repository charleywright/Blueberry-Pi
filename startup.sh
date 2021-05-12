#!/bin/bash
sudo killall wpa_supplicant
sudo ifconfig wlan0 down
sudo ifconfig wlan0 hw ether B4:D5:bd:39:e6:e9
sudo ifconfig wlan0 up
sudo wpa_supplicant -c /etc/wpa_supplicant/wpa_supplicant.conf -i wlan0 -D wext &
sudo create_ap wlan1 wlan0 "Ayy Lmao" fmoy1638 &
