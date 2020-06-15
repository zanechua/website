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
      <div className="w-full lg:flex py-4">
        <div
          className="h-56 lg:h-auto lg:w-64 flex-none bg-cover rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden"
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
