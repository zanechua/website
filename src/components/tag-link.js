import React from 'react';
import { Link } from 'gatsby';
import { kebabCase } from 'lodash';
import PropTypes from 'prop-types';

const TagLink = ({ tag, showCount, count }) => {
  return (
    <Link to={`/tags/${kebabCase(tag)}/`} className="px-0.5">
      <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-blue-500 rounded">
        {showCount ? `${tag} (${count})` : tag}
      </span>
    </Link>
  );
};

TagLink.propTypes = {
  tag: PropTypes.string,
  showCount: PropTypes.bool,
  count: PropTypes.number
};

export default TagLink;
