# current stable LTS on top of debian image
FROM node:4.5.0-wheezy

# create non-root user account
RUN groupadd -r nodeuser && useradd -r -g nodeuser nodeuser

# add global node stuff
RUN npm install -g sails@0.12.3
RUN npm install pg
RUN npm install --save buffer-alloc
#RUN npm i -S sails-hook-cb-async-controller

# install node modules to tmp to create a layer with dependencies installed
ADD app/package.json /tmp/package.json
RUN cd /tmp && npm install

# create and populate the main app folder
RUN mkdir /app && cp -a /tmp/node_modules /app
COPY app /app
RUN chown -R nodeuser:nodeuser /app

ENV NODE_ENV production

WORKDIR /app

USER nodeuser

EXPOSE 1337

CMD ["/app/run.sh"]
