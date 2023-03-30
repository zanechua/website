import React from 'react';
import { graphql } from 'gatsby';
import PropTypes from 'prop-types';

import Layout from 'components/Layout';
import PostLink from 'components/PostLink';
import SEO from 'components/SEO';

const IndexPage = ({
  data: {
    allMarkdownRemark: { edges }
  }
}) => {
  const Posts = edges
    .filter(edge => !!edge.node.frontmatter.date) // You can filter your posts based on some criteria
    .map(edge => <PostLink key={edge.node.id} post={edge.node} />);

  return (
    <Layout>
      <section className="flex-1">
        <h2 className="text-2xl font-bold">Posts</h2>

        <div className="flex-1 items-center">{Posts}</div>
      </section>
    </Layout>
  );
};

export const Head = ({ location }) => <SEO title="Home" path={location.pathname} />;

export const pageQuery = graphql`
  query {
    allMarkdownRemark(sort: { frontmatter: { date: DESC } }) {
      edges {
        node {
          id
          excerpt(pruneLength: 250)
          fields {
            urlPath
          }
          frontmatter {
            date(formatString: "DD MMMM, YYYY")
            slug
            title
            tags
            featuredImage {
              childImageSharp {
                gatsbyImageData
              }
            }
          }
        }
      }
    }
  }
`;

IndexPage.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      edges: PropTypes.array
    })
  }).isRequired
};

export default IndexPage;
