const dotenv = require("dotenv");

if (process.env.ENVIRONMENT !== "production") {
  dotenv.config();
}

const { spaceId, accessToken } = process.env;

module.exports = {
  siteMetadata: {
    title: `The Savage Dev`,
    description: `Personal Site and Blog`,
    author: `@json`,
    siteUrl: `https://thesavage.dev`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`
      }
    },
    {
      resolve: "gatsby-source-contentful",
      options: {
        spaceId,
        accessToken
      }
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-remark`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `The Savage Dev`,
        short_name: `Savage Dev`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#333`,
        icon: `src/images/fev_icon.png` // This path is relative to the root of the site.
      }
    },
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allContentfulBlogs } }) => {
              return allContentfulBlogs.edges.map(({ node }) => {
                return {
                  title: node.title,
                  url: `${site.siteMetadata.siteUrl}/${node.slug}`,
                  custom_elements: [
                    { 'content:encoded': node.description.childMarkdownRemark.rawMarkdownBody },
                    { cover_image: node.featureImage.fluid.src },
                    { date: node.date },
                  ],
                }
              })
            },
            query: `
              {
                allContentfulBlogs(sort: { fields: date, order: DESC }) {
                  edges {
                    node {
                      title
                      date
                      slug
                      featureImage {
                        fluid(maxWidth: 1500) {
                          src
                        }
                      }
                      description {
                        childMarkdownRemark {
                          rawMarkdownBody
                        }
                      }
                    }
                  }
                }
              }
            `,
            output: `/rss.xml`,
            title: `The Savage Dev`,
          },
        ]
      }
    },
  ]
};
