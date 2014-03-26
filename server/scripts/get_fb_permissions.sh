#!/bin/bash
#
# Zapisuje wiadomośc na tablicy Fredzia
#
#
ACCESS_TOKEN="CAACEdEose0cBAJDbiRPCcb0XLDFRP6L4rMZCvNBsdnKhe1qTk3X8GT9QVKq0CAQ3wbN3wlObpQCniliSmO933VezZCmZBbxjjbMDmZBj4NYzK9oDcE84SFcPZB7Xvs6LChoP5P23a1WdU7y5ppVw8gOdbCIJPRHsZD"
ACCESS_TOKEN="CAACEdEose0cBAM9P8ZAPXhm7ATUz1Xf75CmpImd98F7azvZAQ1NyesopdAeZAPW7OBbMPDSiyAcSmS0YIY2vsq58A4tLGU6KcdV1BhglAMh1c2TZAuiHcfM9paZBiJy6ut5gAzyuHQBeCk7rVEFbwNHOybxc8ZBZA8ZD"

ACCESS_TOKEN="CAAHFWJu1ZAP4BANFFziWZBZBQZCx1ZCbfAQmYZCRQTsElqr7yZBM8oh1a36FIhfoQYh2nzxgzjQzYgc7cPcC1fAfCKrulA8g5TlJTTF1G57ZAgZC7PHKqtZCLw2mtSaCmpZAb7GdlYMCUtUd9Ml1tpI6vlI"
ACCESS_TOKEN="CAAHFWJu1ZAP4BAJzeX6oEGQZCZAHFFZCLn92dYP20M4xrwMnxsb2ycYGo21lvxHPmJWGxzZBMNNH82ek5jl6J9zFtHEZBwgZAjytCenjzX6vODkvmr3QfSPqyugi4bTEi2nrVdhnRX7rZCcjUWmgcyeK"


DT=`date +"%Y%m%d %H:%M:%S"`
#curl -F 'access_token=CAACEdEose0cBAM9P8ZAPXhm7ATUz1Xf75CmpImd98F7azvZAQ1NyesopdAeZAPW7OBbMPDSiyAcSmS0YIY2vsq58A4tLGU6KcdV1BhglAMh1c2TZAuiHcfM9paZBiJy6ut5gAzyuHQBeCk7rVEFbwNHOybxc8ZBZA8ZD' -F "message=Hello at $DT pzdr.RF" https://graph.facebook.com/me/feed
#curl -F "access_token=$ACCESS_TOKEN" -F "message=Hello at $DT pzdr.RF" -F "link=http://rnc.rodzicenaczasie.pl" -F "name=RodziceNaCzasie" https://graph.facebook.com/me/feed
#curl -F "access_token=$ACCESS_TOKEN" -F "message=Dołączyłem do serwisu RodziceNaCzasie.pl, skupiającego rodziców dzieci w wieku przedszkolnym i szkolnym. Przyłącz się do mnie." -F "link=http://rnc.rodzicenaczasie.pl" -F "name=RodziceNaCzasie" -F "caption=Przyłącz się do RodziceNaCzasie.pl" https://graph.facebook.com/me/feed

wget https://graph.facebook.com/me/permissions?$ACCESS_TOKEN

#
# EOF
#