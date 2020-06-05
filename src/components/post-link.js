import React from "react"
import { Link } from "gatsby"
import PropTypes from 'prop-types';

const PostLink = ({ post }) => {
  const featuredImgFluid = post.frontmatter.featuredImage.childImageSharp.fluid
  const featuredSrc = featuredImgFluid.src;
  // const featuredSrcSet = featuredImgFluid.srcSet;
  // const imageLink = featuredSrcSet.substring(0, featuredSrcSet.indexOf(' 200w'));

  return (
    <Link to={post.frontmatter.slug}>
      <div className="w-full lg:flex">
        <div
          className="h-56 lg:h-auto lg:w-48 flex-none bg-cover rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden"
          style={{backgroundImage: `url(${featuredSrc})`, backgroundPosition: 'center center' }} title={post.frontmatter.title}>
        </div>
        <div
          className="flex-1 border-r border-b border-l border-gray-800 lg:border-l-0 lg:border-t lg:border-gray-700 rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal bg-gray-800">
          <div className="mb-8">
            <div className="text-white font-bold text-xl mb-2 text-left">{post.frontmatter.title}</div>
            <p className="text-white text-base text-left">{post.excerpt}</p>
          </div>
          <div className="flex flex-col">
            <div className="text-sm">
              <p className="text-white">{post.frontmatter.date}</p>
            </div>
            <div>
              <p className="text-sm text-white flex items-center">
                <svg className="fill-current text-gray-500 w-3 h-3 mr-2" xmlns="http://www.w3.org/2000/svg"
                     viewBox="0 0 20 20">
                  <path
                    d="M4 8V6a6 6 0 1 1 12 0v2h1a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-8c0-1.1.9-2 2-2h1zm5 6.73V17h2v-2.27a2 2 0 1 0-2 0zM7 6v2h6V6a3 3 0 0 0-6 0z"/>
                </svg>
                Members only
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

PostLink.propTypes = {
  post: PropTypes.shape({
    excerpt: PropTypes.string,
    frontmatter: PropTypes.shape({
      slug: PropTypes.string,
      title: PropTypes.string,
      date: PropTypes.string,
      featuredImage: PropTypes.shape({
        childImageSharp: PropTypes.shape({
          fluid: PropTypes.any
        })
      })
    })
  })
};

export default PostLink
