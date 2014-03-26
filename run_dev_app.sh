#!/bin/bash
#
# uruchamian apliakcje w konsoli
#
nodemon -w ./ -w ./server/lib/ -w ./server/middleware/ -w ./server/rpc/ -w ./server/schema/ -w ./server/model/ app.js
#
# EOF
#