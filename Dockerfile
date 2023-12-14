FROM node:16.20-alpine3.17

RUN apk update && \
  apk upgrade --no-cache && \
  apk add --no-cache \
  git \
  bash

ARG strapi_url
ARG components_page

WORKDIR /opt/app
RUN addgroup -S alex && adduser -S alex -G alex
RUN chown -R alex:alex /opt/app
USER alex

ADD --chown=alex:alex ./package.json ./yarn.lock ./

RUN yarn --ignore-scripts

ADD --chown=alex:alex . .

ENV STRAPI_URL=$strapi_url
ENV COMPONENTS_PAGE=$components_page

RUN yarn build

ENV NODE_ENV=production

EXPOSE 3000

CMD node .output/server/index.mjs



