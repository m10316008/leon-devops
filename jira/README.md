##############################################
出處：
git clone https://github.com/idoall/docker.git
##############################################
# hack hack hack

# Build images
cd /root/jira/ubuntu16.04-jira-software/7.12.3/
docker build -t idoall/ubuntu16.04-jira-software:7.12.3 .
cd /root/jira/ubuntu16.04-jira-crowd/3.3.2/ 
docker build -t idoall/ubuntu16.04-jira-crowd:3.3.2 .
cd /root/jira/ubuntu16.04-jdk10-confluence/6.12.2/
docker build -t idoall/ubuntu16.04-jdk10-confluence:6.12.2 .


# Run rm (測試)
docker run -it --name=jira_software --rm -p 80:8080 idoall/ubuntu16.04-jira-software:7.12.3

# After running, wait for 1 minutes.
# Open http://localhost/ in your browser
# 正式
docker run -d --name=jira_software -p 80:8080 idoall/ubuntu16.04-jira-software:7.12.3

# access the contain
docker exec -it jira_software /bin/bash
```
# Using docker stack deploy service to create APP



When deploying, pay attention to modifying the  `my.ini` in the `docker-compose.yml` file content.



## deploy service

```bash
docker stack deploy -c docker-compose.yml jira_all
```

## remove deploy

```bash
docker stack rm jira_all
```

## view service list

```bash
# 所有服务列表
docker service ls

# 指定应用的列表
docker stack services jira_all
```

## View service status

```bash
watch docker service ps jira_all
```
