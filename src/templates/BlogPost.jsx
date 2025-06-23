import React, { useEffect } from 'react';
import { useWindowSize } from '@react-hook/window-size';
import { format } from 'date-fns';
import { graphql } from 'gatsby';
import { GatsbyImage, getImage, getSrc } from 'gatsby-plugin-image';
import { resizeElements } from 'lib/prism-multiline-numbers';
import { last } from 'lodash';
import PropTypes from 'prop-types';

import CommentForm from 'components/CommentForm';
import CommentSection from 'components/CommentSection';
import Layout from 'components/Layout';
import SEO from 'components/SEO';
import TagLink from 'components/TagLink';

// the data prop will be injected by the GraphQL query below.
const BlogPostTemplate = ({ data }) => {
  const [width, height] = useWindowSize();
  const { posts, comments } = data; // data.posts holds your post data
  const { timeToRead, frontmatter, html, headings } = posts;
  const { tags } = frontmatter;
  const updatedAtArray = frontmatter?.updatedAt;
  const lastUpdatedAt = Array.isArray(updatedAtArray)
    ? format(new Date(last(updatedAtArray)), 'dd MMMM, yyyy')
    : null;

  const featuredImg = getImage(frontmatter.featuredImage);

  useEffect(() => {
    resizeElements(Array.prototype.slice.call(document.querySelectorAll('pre.line-numbers')));
  }, [width, height]);

  useEffect(() => {
    // create an Observer instance
    const resizeObserver = new ResizeObserver(() => {
      resizeElements(Array.prototype.slice.call(document.querySelectorAll('pre.line-numbers')));
    });

    resizeObserver.disconnect();
    const contentElement = document.getElementById('post-content');
    // start observing a DOM node
    resizeObserver.observe(contentElement);
  }, []);

  return (
    <Layout className="blog-post-container">
      <nav className="blog-post-fast-nav fixed transform right-0 mr-4 space-y-2 hidden border-solid border-l-2 pl-2 border-white xl:flex xl:flex-col">
        {headings.map(heading => (
          <a href={`#${heading.id}`} key={heading.id} className="hover:underline">
            {heading.value}
          </a>
        ))}
      </nav>
      <section className="blog-post flex-1">
        <div className="blog-post-meta mb-4">
          <h1 className="text-2xl font-bold">{frontmatter.title}</h1>
          <div className="my-1">
            {tags !== null && tags.map(tag => <TagLink key={tag} tag={tag} />)}
          </div>
          <h2 className="text-sm font-bold">{`${frontmatter.date} ${
            lastUpdatedAt ? `• Last Updated at ${lastUpdatedAt}` : ''
          } • ${timeToRead} min read`}</h2>
        </div>
        <div className="blog-post-featured-image pb-4">
          <GatsbyImage image={featuredImg} alt={frontmatter.title} />
        </div>
        <div
          id="post-content"
          className="blog-post-content markdown"
          /* eslint-disable-next-line react/no-danger */
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </section>

      {comments.edges.length >= 1 && (
        <CommentSection className="comment-section flex-1 pt-8" comments={comments} />
      )}
      <CommentForm className="comment-form-section flex-1 pt-8" slug={frontmatter.slug} />
    </Layout>
  );
};

export const Head = ({ location, data }) => {
  const { site, posts } = data; // data.posts holds your post data
  const { frontmatter, excerpt } = posts;
  const { tags } = frontmatter;
  const imageLink = getSrc(frontmatter.featuredImage);
  const {
    siteMetadata: { siteUrl }
  } = site;

  return (
    <SEO keywords={tags} title={frontmatter.title} description={excerpt} path={location.pathname}>
      <meta name="image" content={`${siteUrl}${imageLink}`} />
      <meta name="og:image" content={`${siteUrl}${imageLink}`} />
      <meta name="og:image:alt" content={frontmatter.title} />
      <meta name="twitter:image" content={`${siteUrl}${imageLink}`} />
    </SEO>
  );
};

export const pageQuery = graphql`
  query ($slug: String!) {
    site: site {
      siteMetadata {
        siteUrl
      }
    }
    posts: markdownRemark(frontmatter: { slug: { eq: $slug } }) {
      html
      headings(depth: h1) {
        id
        value
        depth
      }
      excerpt(pruneLength: 250)
      timeToRead
      frontmatter {
        date(formatString: "DD MMMM, YYYY")
        updatedAt
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
    comments: allCommentsYaml(
      filter: { slug: { eq: $slug }, name: { ne: "root" } }
      sort: { date: ASC }
    ) {
      edges {
        node {
          id
          slug
          name
          date(formatString: "DD MMMM, YYYY [at] h:MM A")
          message
        }
      }
    }
  }
`;

BlogPostTemplate.propTypes = {
  data: PropTypes.shape({
    site: PropTypes.shape({
      siteMetadata: PropTypes.shape({
        siteUrl: PropTypes.string
      })
    }),
    comments: PropTypes.shape({
      edges: PropTypes.array
    }),
    posts: PropTypes.shape({
      html: PropTypes.string,
      excerpt: PropTypes.string,
      timeToRead: PropTypes.number,
      frontmatter: PropTypes.shape({
        slug: PropTypes.string,
        title: PropTypes.string,
        tags: PropTypes.arrayOf(PropTypes.string),
        date: PropTypes.string,
        featuredImage: PropTypes.shape({
          childImageSharp: PropTypes.shape({
            gatsbyImageData: PropTypes.any
          })
        })
      })
    })
  }).isRequired
};

export default BlogPostTemplate;
