import React from 'react';
import PropTypes from 'prop-types';

import Comment from 'components/Comment';

const CommentSection = ({ comments: { edges }, className }) => {
  const Comments = edges.map(edge => <Comment key={edge.node.id} comment={edge.node} />);

  return (
    <section className={className}>
      <h1 className="text-2xl font-bold pb-4">Comments</h1>
      <div className="comment-container bg-gray-800 p-6">{Comments}</div>
    </section>
  );
};

CommentSection.propTypes = {
  className: PropTypes.string,
  comments: PropTypes.shape({
    edges: PropTypes.array
  }).isRequired
};

CommentSection.defaultProps = {
  className: ''
};

export default CommentSection;
