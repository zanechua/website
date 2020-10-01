import React from "react"
import PropTypes from 'prop-types';
import { graphql } from "gatsby"
import Layout from '../components/layout';
import SEO from '../components/seo';
import Img from "gatsby-image"

// the data prop will be injected by the GraphQL query below.
const Template = ({ data }) => {
  const { posts } = data // data.posts holds your post data
  const { frontmatter, html } = posts;

  let featuredImgFluid = frontmatter.featuredImage.childImageSharp.fluid
  return (
    <Layout className="blog-post-container">
      <SEO
        keywords={[`zanechua`, `homelab`, `zane j chua`, `tech geek`]}
        title={frontmatter.title}
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
    </Layout>
  )
};

export const pageQuery = graphql`
    query($slug: String!) {
        posts: markdownRemark(frontmatter: { slug: { eq: $slug } }) {
            html
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
    }
`

Template.propTypes = {
  data: PropTypes.shape({
    posts: PropTypes.shape({
      html: PropTypes.string,
      frontmatter: PropTypes.shape({
        title: PropTypes.string,
        date: PropTypes.string,
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
