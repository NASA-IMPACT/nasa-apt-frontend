import React from 'react';
import T from 'prop-types';
import { Helmet } from 'react-helmet';

import config from '../../config';
const { baseUrl, appTitle } = config;

import defaultMeta from '../../../graphics/meta/default-meta-image.png';

function MetaTags({ title, description, children }) {
  return (
    <Helmet>
      <title>{title}</title>
      {description ? <meta name='description' content={description} /> : null}
      <meta name='theme-color' content='' />

      {/* Twitter */}
      <meta name='twitter:card' content='summary' />
      <meta name='twitter:creator' content='author' />
      <meta name='twitter:title' content={title} />
      {description ? (
        <meta name='twitter:description' content={description} />
      ) : null}
      <meta name='twitter:image' content={defaultMeta} />

      {/* Open Graph */}
      <meta property='og:type' content='website' />
      <meta property='og:url' content={baseUrl} />
      <meta property='og:site_name' content={appTitle} />
      <meta property='og:title' content={title} />
      <meta property='og:image' content={defaultMeta} />
      {description ? (
        <meta property='og:description' content={description} />
      ) : null}

      {/* Additional children */}
      {children}
    </Helmet>
  );
}

MetaTags.propTypes = {
  title: T.string,
  description: T.string,
  children: T.node
};

export default MetaTags;
