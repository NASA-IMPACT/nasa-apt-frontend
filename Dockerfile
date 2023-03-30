FROM node:14-slim

ENV DEBIAN_FRONTEND noninteractive

RUN mkdir /apt-frontend
WORKDIR /apt-frontend

COPY .prettierrc /apt-frontend/.prettierrc
COPY .npmrc /apt-frontend/.npmrc
COPY package.json /apt-frontend
COPY yarn.lock /apt-frontend
COPY gulpfile.js /apt-frontend
COPY posthtml.config.js /apt-frontend
COPY .parcelrc /apt-frontend
COPY gulp-help-pages.js /apt-frontend


COPY app /apt-frontend/app
COPY content /apt-frontend/content
COPY static /apt-frontend/static

RUN yarn install

CMD ["yarn", "serve"]