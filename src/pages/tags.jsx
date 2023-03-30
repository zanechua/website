import React from 'react';
// Components
import { graphql } from 'gatsby';
import PropTypes from 'prop-types';

import Layout from 'components/Layout';
import SEO from 'components/SEO';
import TagLink from 'components/TagLink';

const TagsPage = ({
  data: {
    allMarkdownRemark: { group }
  }
}) => (
  <Layout>
    <section className="flex-1">
      <h1 className="mb-4 text-2xl font-bold">Tags</h1>
      <div className="flex flex-row">
        <div className="flex-1">
          {group.map(tag => (
            <TagLink
              key={`${tag.fieldValue}-tags-page`}
              tag={tag.fieldValue}
              count={tag.totalCount}
              showCount
            />
          ))}
        </div>
      </div>
    </section>
  </Layout>
);

export const Head = ({ location, data }) => {
  const { site } = data; // data.posts holds your post data
  const {
    siteMetadata: { title }
  } = site;

  return <SEO title={title} path={location.pathname} />;
};

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(limit: 2000) {
      group(field: { frontmatter: { tags: SELECT } }) {
        fieldValue
        totalCount
      }
    }
  }
`;

TagsPage.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      group: PropTypes.arrayOf(
        PropTypes.shape({
          fieldValue: PropTypes.string.isRequired,
          totalCount: PropTypes.number.isRequired
        }).isRequired
      )
    }).isRequired,
    site: PropTypes.shape({
      siteMetadata: PropTypes.shape({
        title: PropTypes.string.isRequired
      })
    })
  }).isRequired
};

export default TagsPage;
