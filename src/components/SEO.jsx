import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import PropTypes from 'prop-types';

const SEO = ({ description, children, keywords, title, path }) => {
  const { site } = useStaticQuery(graphql`
    query DefaultSEOQuery {
      site {
        siteMetadata {
          title
          description
          author
          siteUrl
        }
      }
    }
  `);

  const { siteUrl } = site.siteMetadata;

  const seo = {
    title: title === 'Home' ? site.siteMetadata.title : `${title} | ${site.siteMetadata.title}`,
    description: description || site.siteMetadata.description,
    url: `${siteUrl}${path || ''}`,
    keywords: keywords || []
  };

  return (
    <>
      <html lang="en" />
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <meta name="url" content={seo.url} />
      <meta name="og:title" content={seo.title} />
      <meta name="og:description" content={seo.description} />
      <meta name="og:type" content="website" />
      <meta name="og:url" content={seo.url} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:creator" content={site.siteMetadata.author} />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:url" content={seo.url} />
      <meta name="twitter:description" content={seo.description} />
      <meta
        name="keywords"
        content={
          ['zanechua', 'homelab', 'zane j chua', 'tech geek'].join(', ') + seo.keywords.join(', ')
        }
      />
      {children}
    </>
  );
};

SEO.defaultProps = {
  description: 'zanechua.com',
  keywords: [],
  path: '/'
};

SEO.propTypes = {
  description: PropTypes.string,
  keywords: PropTypes.arrayOf(PropTypes.string),
  title: PropTypes.string.isRequired,
  path: PropTypes.string
};

export default SEO;
