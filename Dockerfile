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
ARG open_ai_key
ARG tiptap_app_id
ARG tiptap_key

WORKDIR /opt/app
RUN addgroup -S alex && adduser -S alex -G alex
RUN chown -R alex:alex /opt/app
USER alex

ADD --chown=alex:alex ./package.json ./yarn.lock ./

ENV STRAPI_URL=$strapi_url
ENV COMPONENTS_PAGE=$components_page
ENV MATOMO_APP_ID=$matomo_app_id
ENV MATOMO_URL=$matomo_url
ENV OPEN_AI_KEY=$open_ai_key
ENV TIPTAP_APP_ID=$tiptap_app_id
ENV TIPTAP_KEY=$tiptap_key

RUN npm config set "@tiptap-pro:registry" https://registry.tiptap.dev/
RUN npm config set //registry.tiptap.dev/:_authToken $tiptap_key

RUN yarn config set network-timeout 600000 -g \
 && yarn config set network-concurrency 1 -g \
 && yarn config set registry https://registry.npmjs.org -g

RUN yarn install --frozen-lockfile --non-interactive --ignore-scripts

ADD --chown=alex:alex . .

ENV NODE_OPTIONS="--max_old_space_size=4096"

RUN yarn build

ENV NODE_ENV=production

EXPOSE 3000

CMD node .output/server/index.mjs
