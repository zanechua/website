import React from 'react';
// Components
import { graphql, Link } from 'gatsby';
import PropTypes from 'prop-types';

import Layout from 'components/Layout';
import PostLink from 'components/PostLink';
import SEO from 'components/SEO';

const Tags = ({ pageContext, data, location }) => {
  const { tag } = pageContext;
  const { edges, totalCount } = data.allMarkdownRemark;
  const posts = edges
    .filter(edge => !!edge.node.frontmatter.date) // You can filter your posts based on some criteria
    .map(edge => <PostLink key={edge.node.id} post={edge.node} />);

  return (
    <Layout>
      <SEO
        keywords={['zanechua', 'homelab', 'zane j chua', 'tech geek']}
        title="Tags"
        path={location.pathname}
      />

      <section>
        <div className="flex flex-row justify-center items-center">
          <div className="flex-1">
            <h1 className="text-2xl font-bold">
              {totalCount} Post(s) with{' '}
              <span className="inline-flex items-center justify-center px-2 py-1 font-bold leading-none text-white bg-blue-500 rounded">
                {tag}
              </span>{' '}
              tag
            </h1>
          </div>
          <div className="flex-1 ml-auto text-right">
            <Link to="/tags" className="font-bold">
              All Tags
            </Link>
          </div>
        </div>
        <div className="items-center">{posts}</div>
      </section>
    </Layout>
  );
};

export const pageQuery = graphql`
  query ($tag: String) {
    allMarkdownRemark(
      limit: 2000
      sort: { frontmatter: { date: DESC } }
      filter: { frontmatter: { tags: { in: [$tag] } } }
    ) {
      totalCount
      edges {
        node {
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

Tags.propTypes = {
  pageContext: PropTypes.shape({
    tag: PropTypes.string.isRequired
  }).isRequired,
  location: PropTypes.object.isRequired,
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      totalCount: PropTypes.number.isRequired,
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          node: PropTypes.shape({
            frontmatter: PropTypes.shape({
              slug: PropTypes.string.isRequired,
              title: PropTypes.string.isRequired
            })
          })
        }).isRequired
      )
    })
  }).isRequired
};

export default Tags;
