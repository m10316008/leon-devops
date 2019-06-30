cd /apps/redirect/
mkdir /apps/redirect/logs
chmod 777 /apps/redirect/logs

npm install --only=production --prefer-offline

mv /apps/redirect/notes/redirect.service /etc/systemd/system/


systemctl enable redirect
systemctl restart redirect
journalctl -f -u redirect






#### create cron job restart every 20 min
crontab -e

*/20 * * * * /bin/systemctl restart redirect

