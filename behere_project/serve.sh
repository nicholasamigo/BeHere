#!/bin/sh

pwd;
ng serve & cd src/server/main;
gin --port 4201 --path . --build . --i --all &

wait