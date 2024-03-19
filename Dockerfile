FROM node:18.19-alpine3.19

RUN apk update && \
  apk upgrade --no-cache && \
  apk add --no-cache \
  git \
  bash

ARG strapi_url
ARG components_page
ARG matomo_app_id
ARG matomo_url

WORKDIR /opt/app
RUN addgroup -S alex && adduser -S alex -G alex
RUN chown -R alex:alex /opt/app
USER alex

ADD --chown=alex:alex ./package.json ./yarn.lock ./

RUN yarn --ignore-scripts

ADD --chown=alex:alex . .

ENV STRAPI_URL=$strapi_url
ENV COMPONENTS_PAGE=$components_page
ENV MATOMO_APP_ID=$matomo_app_id
ENV MATOMO_URL=$matomo_url

RUN yarn build

ENV NODE_ENV=production

EXPOSE 3000

CMD node .output/server/index.mjs



