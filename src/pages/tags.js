import React from "react"
import PropTypes from "prop-types"

// Components
import { graphql } from "gatsby"
import TagLink from '../components/tag-link';
import Layout from '../components/layout';
import SEO from '../components/seo';

const TagsPage = ({
                    data: {
                      allMarkdownRemark: { group },
                      site: {
                        siteMetadata: { title },
                      },
                    },
                  }) => {

  return (
  <Layout>
    <SEO
      keywords={[`zanechua`, `homelab`, `zane j chua`, `tech geek`]}
      title={title}
      path={location.pathname}
    />

    <section className="flex-1">
      <h1 className="mb-4 text-2xl font-bold">
        Tags
      </h1>
      <div className="flex flex-row">
        <div className="flex-1">
          {group.map(tag => {
            return (<TagLink key={`${tag.fieldValue}-tags-page`} tag={tag.fieldValue} count={tag.totalCount} showCount={true} />
            )}
          )}
        </div>
      </div>
    </section>
  </Layout>
)}

export const pageQuery = graphql`
    query {
        site {
            siteMetadata {
                title
            }
        }
        allMarkdownRemark(limit: 2000) {
            group(field: frontmatter___tags) {
                fieldValue
                totalCount
            }
        }
    }
`

TagsPage.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      group: PropTypes.arrayOf(
        PropTypes.shape({
          fieldValue: PropTypes.string.isRequired,
          totalCount: PropTypes.number.isRequired,
        }).isRequired
      )
    }),
    site: PropTypes.shape({
      siteMetadata: PropTypes.shape({
        title: PropTypes.string.isRequired,
      })
    })
  })
}

export default TagsPage;