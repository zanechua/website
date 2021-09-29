const resolveConfig = require('tailwindcss/resolveConfig');
const tailwindConfig = require('./tailwind.config.js');

const fullConfig = resolveConfig(tailwindConfig);

const siteUrl = 'https://zanechua.com';

module.exports = {
  siteMetadata: {
    title: 'Zane Chua',
    description: 'Website where Zane Chua writes about tech, homelab and more',
    author: '@zanejchua',
    siteUrl: siteUrl
  },
  plugins: [
    {
      resolve: 'gatsby-plugin-google-tagmanager',
      options: {
        id: 'GTM-KCCLDWG',

        // Include GTM in development.
        //
        // Defaults to false meaning GTM will only be loaded in production.
        includeInDevelopment: false,

        // datalayer to be set before GTM is loaded
        // should be an object or a function that is executed in the browser
        //
        // Defaults to null
        defaultDataLayer: { platform: 'gatsby' }
      }
    },
    {
      resolve: 'gatsby-plugin-sitemap',
      options: {
        query: `
          {
            allSitePage {
              nodes {
                path
              }
            }
            allMarkdownRemark(sort: { order: DESC, fields: [frontmatter___date] }) {
              edges {
                node {
                  fields {
                    urlPath
                  }
                  frontmatter {
                    date
                  }
                }
              }
            }
          }
        `,
        resolveSiteUrl: () => siteUrl,
        resolvePages: ({
          allSitePage: { nodes: allPages },
          allMarkdownRemark: { edges: allRemarkEdges }
        }) => {
          const remarkEdgeMap = allRemarkEdges.reduce((acc, edge) => {
            const { urlPath: uri } = edge.node.fields;
            acc[uri] = edge;

            return acc;
          }, {});

          return allPages.map(page => {
            return { ...page, ...remarkEdgeMap[page.path] };
          });
        },
        serialize: pageData => {
          const { path } = pageData;
          const modifiedGmt = pageData?.node?.frontmatter?.date;
          // Not all pages have dates
          return {
            url: path,
            lastmod: modifiedGmt
          };
        }
      }
    },
    'gatsby-plugin-eslint',
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-netlify',
    {
      resolve: 'gatsby-plugin-nprogress',
      options: {
        // Setting a color is optional.
        color: '#3b82f6',
        // Disable the loading spinner.
        showSpinner: false
      }
    },
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'zanechua.com',
        short_name: 'ZaneChua',
        start_url: '/',
        background_color: fullConfig.theme.colors.white,
        theme_color: fullConfig.theme.colors.teal,
        display: 'minimal-ui',
        icon: 'static/icon.png'
      }
    },
    {
      resolve: 'gatsby-plugin-postcss',
      options: {
        postCssPlugins: [
          require('tailwindcss')(tailwindConfig),
          require('autoprefixer'),
          ...(process.env.NODE_ENV === 'production' ? [require('cssnano')] : [])
        ]
      }
    },
    {
      resolve: 'gatsby-plugin-purgecss',
      options: {
        printRejected: true, // Print removed selectors and processed file names
        develop: true, // Enable while using `gatsby develop`
        tailwind: true, // Enable tailwindcss support
        // whitelist: ['whitelist'], // Don't remove this selector
        ignore: [
          'node_modules/prismjs/',
          'node_modules/prism-themes/',
          'src/css/markdown.css',
          'src/css/prism.css',
          'src/css/prism-vsc-dark-plus.css',
          'src/css/prism-language-tabs.css'
        ] // Ignore files/folders
        // purgeOnly : ['components/', '/main.css', 'bootstrap/'], // Purge only these files/folders
      }
    },
    {
      resolve: 'gatsby-plugin-offline',
      options: {
        precachePages: ['/', '/lab', '/about', '/blog/*']
      }
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'markdown-posts',
        path: `${__dirname}/src/posts`
      }
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'markdown-featured-images',
        path: `${__dirname}/src/images/featured`
      }
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'markdown-posts-images',
        path: `${__dirname}/src/images/posts`
      }
    },
    'gatsby-transformer-yaml',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'comments',
        path: `${__dirname}/src/comments`
      }
    },
    'gatsby-plugin-image',
    {
      resolve: 'gatsby-plugin-sharp',
      options: {
        defaults: {
          formats: ['auto', 'webp'],
          placeholder: 'blurred',
          quality: 50,
          breakpoints: [800, 1080, 1366, 1920],
          backgroundColor: 'transparent'
        }
      }
    },
    'gatsby-transformer-sharp',
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          {
            resolve: 'gatsby-remark-code-titles',
            options: {
              className: 'gatsby-remark-code-title'
            }
          }, // IMPORTANT: this must be ahead of other plugins that use code blocks
          'gatsby-remark-reading-time',
          {
            resolve: 'gatsby-remark-autolink-headers',
            options: {
              offsetY: '100',
              icon: '<svg id="header-anchor-icon" aria-hidden="true" height="20" version="1.1" viewBox="0 0 16 16" width="20"><path d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg>',
              className: 'remark-header-anchor',
              maintainCase: true,
              removeAccents: true,
              isIconAfterHeader: true
            }
          },
          {
            resolve: 'gatsby-remark-images',
            options: {
              maxWidth: 800,
              wrapperStyle: 'margin: 0.7rem 0; margin-left: 0!important; margin-right: 0!important;'
            }
          },
          {
            resolve: 'gatsby-remark-external-links',
            options: {
              target: '_blank',
              rel: 'nofollow noopener noreferrer'
            }
          },
          {
            resolve: 'gatsby-remark-prismjs',
            options: {
              // Class prefix for <pre> tags containing syntax highlighting;
              // defaults to 'language-' (e.g. <pre class="language-js">).
              // If your site loads Prism into the browser at runtime,
              // (e.g. for use with libraries like react-live),
              // you may use this to prevent Prism from re-processing syntax.
              // This is an uncommon use-case though;
              // If you're unsure, it's best to use the default value.
              classPrefix: 'language-',
              // This is used to allow setting a language for inline code
              // (i.e. single backticks) by creating a separator.
              // This separator is a string and will do no white-space
              // stripping.
              // A suggested value for English speakers is the non-ascii
              // character '›'.
              inlineCodeMarker: '±',
              // This lets you set up language aliases.  For example,
              // setting this to '{ sh: "bash" }' will let you use
              // the language "sh" which will highlight using the
              // bash highlighter.
              aliases: {},
              // This toggles the display of line numbers globally alongside the code.
              // To use it, add the following line in gatsby-browser.js
              // right after importing the prism color scheme:
              //  require("prismjs/plugins/line-numbers/prism-line-numbers.css")
              // Defaults to false.
              // If you wish to only show line numbers on certain code blocks,
              // leave false and use the {numberLines: true} syntax below
              showLineNumbers: true,
              // If setting this to true, the parser won't handle and highlight inline
              // code used in markdown i.e. single backtick code like `this`.
              noInlineHighlight: false,
              // This adds a new language definition to Prism or extend an already
              // existing language definition. More details on this option can be
              // found under the header "Add new language definition or extend an
              // existing language" below.
              languageExtensions: [
                {
                  language: 'superscript',
                  extend: 'javascript',
                  definition: {
                    superscript_types: /(SuperType)/
                  },
                  insertBefore: {
                    function: {
                      superscript_keywords: /(superif|superelse)/
                    }
                  }
                }
              ],
              // Customize the prompt used in shell output
              // Values below are default
              prompt: {
                user: 'root',
                host: 'localhost',
                global: false
              },
              // By default the HTML entities <>&'" are escaped.
              // Add additional HTML escapes by providing a mapping
              // of HTML entities and their escape value IE: { '}': '&#123;' }
              escapeEntities: {}
            }
          }
        ]
      }
    },
    {
      resolve: 'gatsby-plugin-google-fonts',
      options: {
        fonts: [
          'fira code:400,700' // you can also specify font weights and styles
        ],
        display: 'swap'
      }
    }
  ]
};
