cd /d D:\PROJECTS\npm\ngrepo\openresty_radar\

del conf\proxy_bind_random.conf
copy conf\proxy_bind_random_win.conf conf\proxy_bind_random.conf

echo --------------------- %date% %time% ------------------------
nginx.exe -t -c conf\nginx.conf

call nginx.exe -c conf/nginx.conf -s quit
timeout /t 3 /nobreak
taskkill /IM nginx.exe /F

start nginx.exe -c conf\nginx.conf
echo --------------------- %date% %time% ------------------------
timeout /t 3 /nobreak