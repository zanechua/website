const _ = require('lodash');

exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage } = actions;

  const blogPostTemplate = require.resolve('./src/templates/blog-post.js');
  const tagTemplate = require.resolve('./src/templates/tags.js');

  const result = await graphql(`
    {
      posts: allMarkdownRemark(sort: { order: DESC, fields: [frontmatter___date] }, limit: 2000) {
        edges {
          node {
            fields {
              urlPath
            }
            frontmatter {
              slug
              tags
            }
          }
        }
      }
      tagsGroup: allMarkdownRemark(limit: 2000) {
        group(field: frontmatter___tags) {
          fieldValue
        }
      }
    }
  `);

  // Handle errors
  if (result.errors) {
    reporter.panicOnBuild('Error while running GraphQL query.');
    return;
  }

  const posts = result.data.posts.edges;

  posts.forEach(({ node }) => {
    createPage({
      path: node.fields.urlPath,
      component: blogPostTemplate,
      context: {
        // additional data can be passed via context
        slug: node.frontmatter.slug
      }
    });
  });

  // Extract tag data from query
  const tags = result.data.tagsGroup.group;
  // Make tag pages
  tags.forEach(tag => {
    createPage({
      path: `/tags/${_.kebabCase(tag.fieldValue)}/`,
      component: tagTemplate,
      context: {
        tag: tag.fieldValue
      }
    });
  });
};

exports.onCreateNode = ({ node, actions }) => {
  const { createNodeField } = actions;
  if (node.internal.type === 'MarkdownRemark' && node.fileAbsolutePath.includes('posts')) {
    const slug = node.frontmatter.slug;

    createNodeField({
      node,
      name: 'urlPath',
      value: `/blog/${slug}` // Here we are, the path prefix
    });
  }
};
