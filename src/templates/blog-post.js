import React from "react"
import PropTypes from 'prop-types';
import { graphql } from "gatsby"
import Layout from '../components/layout';
import SEO from '../components/seo';
import { GatsbyImage, getImage, getSrc } from "gatsby-plugin-image";
import CommentSection from '../components/comment-section';
import CommentForm from '../components/comment-form';
import { Helmet } from 'react-helmet';
import TagLink from '../components/tag-link';

// the data prop will be injected by the GraphQL query below.
const Template = ({ data, location }) => {
  const { site, posts, comments } = data // data.posts holds your post data
  const { frontmatter, excerpt, html } = posts;
  const tags = frontmatter.tags;

  const featuredImg = getImage(frontmatter.featuredImage);
  const imageLink = getSrc(frontmatter.featuredImage);
  const { siteMetadata: { siteUrl }} = site;

  return (
    <Layout className="blog-post-container">
      <SEO
        keywords={[`zanechua`, `homelab`, `zane j chua`, `tech geek`].concat(tags)}
        title={frontmatter.title}
        description={excerpt}
        path={location.pathname}
      />
      <Helmet
        meta={[
          {
            name: `image`,
            content: `${siteUrl}${imageLink}`,
          },
          {
            name: `og:image`,
            content: `${siteUrl}${imageLink}`,
          },
          {
            name: `og:image:alt`,
            content: frontmatter.title,
          },
          {
            name: `twitter:image`,
            content: `${siteUrl}${imageLink}`,
          },
        ]}
      />

      <section className="blog-post flex-1">
        <div className="blog-post-meta mb-4">
          <h1 className="text-2xl font-bold">
            {frontmatter.title}
          </h1>
          <div className="my-1">
            {tags !== null && tags.map(tag => (
              <TagLink key={tag} tag={tag} />
            ))}
          </div>
          <h2 className="text-sm font-bold">
            {frontmatter.date}
          </h2>
        </div>
        <div className="blog-post-featured-image pb-4">
          <GatsbyImage image={featuredImg} alt={frontmatter.title} />
        </div>
        <div
          className="blog-post-content markdown"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </section>

      {comments.edges.length >= 1 && <CommentSection className="comment-section flex-1 pt-8" comments={comments} />}
      <CommentForm className="comment-form-section flex-1 pt-8" slug={frontmatter.slug}/>
    </Layout>
  )
};

export const pageQuery = graphql`
    query($slug: String!) {
        site: site {
            siteMetadata {
                siteUrl
            }
        }
        posts: markdownRemark(frontmatter: { slug: { eq: $slug } }) {
            html
            excerpt(pruneLength: 250)
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
        comments: allCommentsYaml(filter: { slug: { eq: $slug } }) {
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
`

Template.propTypes = {
  location: PropTypes.object,
  data: PropTypes.shape({
    site: PropTypes.shape({
      siteMetadata: PropTypes.PropTypes.shape({
        siteUrl: PropTypes.string,
      })
    }),
    comments: PropTypes.shape({
      edges: PropTypes.array
    }),
    posts: PropTypes.shape({
      html: PropTypes.string,
      excerpt: PropTypes.string,
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
  })
};

export default Template;
