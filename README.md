## deployment

```
$ ssh -i ~/Downloads/ssh.key ubuntu@150.136.53.248
$ git pull
$ nohup npm run start &
```

## allow 3000 through firewall

```
$ sudo su -
$ ufw status
$ sudo ufw allow 3000/tcp
$ sudo reboot
$ sudo ss -tuln | grep 3000
```

## start server

```
$ git pull
$ npm run dev/start
```
