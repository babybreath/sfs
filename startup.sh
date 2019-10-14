#!/bin/sh

echo 'pm2 delete ...'
pm2 delete pm2.json
echo 'pm2 start ...'
pm2 start pm2.json
sleep 2
pm2 list
