exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage } = actions

  const blogPostTemplate = require.resolve(`./src/templates/blog-post.js`)

  const result = await graphql(`
    {
      posts: allMarkdownRemark(
        sort: { order: DESC, fields: [frontmatter___date] }
        limit: 1000
      ) {
        edges {
          node {
            fields {
              urlPath
            }
            frontmatter {
              slug
            }
          }
        }
      }
    }
  `)

  // Handle errors
  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`)
    return
  }

  result.data.posts.edges.forEach(({ node }) => {
    createPage({
      path: node.fields.urlPath,
      component: blogPostTemplate,
      context: {
        // additional data can be passed via context
        slug: node.frontmatter.slug,
      },
    })
  })
}

exports.onCreateNode = ({ node, actions }) => {
  const { createNodeField } = actions
  if (
    node.internal.type === `MarkdownRemark` &&
    node.fileAbsolutePath.includes("posts")
  ) {
    const slug = node.frontmatter.slug

    createNodeField({
      node,
      name: `urlPath`,
      value: `/blog/${slug}`, // Here we are, the path prefix
    })
  }
}