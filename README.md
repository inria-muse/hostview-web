# Hostview Web 

Hostview Web is [Sails](http://sailsjs.org/) app that provides the web frontend (user data visualization) for Hostview study. In addition, it serves few REST API functions for the Hostview clients (software updates + public IP geolocation).


## Deployment

The dev and prod deployments are managed as [Docker](https://www.docker.com/) containers. NOTE: prod on muse.inria.fr is with pm2 (can't run Docker on 32-bit).

### Development

To (re)build the app image, use Docker Compose:

    docker-compose -f dev.yml build

To run the containers, use Docker Compose (will start required Redis + App containers):

    docker-compose -f dev.yml up
 
To get a shell access to the app container (will not start the app) with data mounted on the host, do:

    docker run --rm -it hostview/web /bin/bash


### Production

To run the app in production mode, use Docker Compose (will start Redis + App containers, connecting to the indicated Postgresql database):

    HOSTVIEW_DB=postgres://<user>:<password>@ucn.inria.fr/hostview2016 docker-compose -f prod.yml -d up


### Production: muse.inria.fr

The muse server is 32-bit, hence no Docker. The app is installed to /home/nodeapp/apps/hostviewweb. The app is managed with [PM2](https://github.com/Unitech/pm2) that takes care of running a cluster of instances + load balancing. To start, run:

    sudo -u nodeapp pm2 start processes.json

To see more information about running apps + logs, do

    sudo -u nodeapp pm2 list
    sudo -u nodeapp pm2 logs

The pm2 app logs are rotated by the logrotate daemon (see, /etc/logrotate.d/pm2-nodeapp).
