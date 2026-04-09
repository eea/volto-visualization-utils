# syntax=docker/dockerfile:1
ARG VOLTO_VERSION
FROM plone/frontend-builder:${VOLTO_VERSION}

ARG ADDON_NAME
ARG ADDON_PATH

# Needed for cypress
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
    libgtk2.0-0 libgtk-3-0 libgbm-dev libnotify-dev libnss3 libxss1 libasound2 libxtst6 xauth xvfb chromium

# Add-on
COPY --chown=node:node ./ /app/src/addons/${ADDON_PATH}/

RUN /setupAddon

# Need for jest-junit
RUN yarn add --dev jest-junit

RUN yarn install

ENTRYPOINT ["yarn"]
CMD ["start"]
