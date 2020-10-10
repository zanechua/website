import React from "react"
import PropTypes from 'prop-types';
import { graphql } from "gatsby"
import Layout from '../components/layout';
import SEO from '../components/seo';
import Img from "gatsby-image"
import CommentSection from '../components/comment-section';
import CommentForm from '../components/comment-form';

// the data prop will be injected by the GraphQL query below.
const Template = ({ data, location }) => {
  const { posts, comments } = data // data.posts holds your post data
  const { frontmatter, excerpt, html } = posts;

  const featuredImgFluid = frontmatter.featuredImage.childImageSharp.fluid
  return (
    <Layout className="blog-post-container">
      <SEO
        keywords={[`zanechua`, `homelab`, `zane j chua`, `tech geek`]}
        title={frontmatter.title}
        description={excerpt}
        path={location.pathname}
      />

      <section className="blog-post flex-1">
        <div className="blog-post-meta mb-4">
          <h1 className="text-2xl font-bold">
            {frontmatter.title}
          </h1>
          <h2 className="text-sm font-bold">
            {frontmatter.date}
          </h2>
        </div>
        <div className="blog-post-featured-image pb-4">
          <Img fluid={featuredImgFluid} />
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
        posts: markdownRemark(frontmatter: { slug: { eq: $slug } }) {
            html
            excerpt(pruneLength: 250)
            frontmatter {
                date(formatString: "DD MMMM, YYYY")
                slug
                title
                featuredImage {
                    childImageSharp {
                        fluid(maxWidth: 800) {
                            ...GatsbyImageSharpFluid
                        }
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
  data: PropTypes.shape({
    comments: PropTypes.shape({
      edges: PropTypes.array
    }),
    posts: PropTypes.shape({
      html: PropTypes.string,
      excerpt: PropTypes.string,
      frontmatter: PropTypes.shape({
        title: PropTypes.string,
        date: PropTypes.string,
        slug: PropTypes.string,
        featuredImage: PropTypes.shape({
          childImageSharp: PropTypes.shape({
            fluid: PropTypes.any
          })
        })
      })
    })
  })
};

export default Template;
