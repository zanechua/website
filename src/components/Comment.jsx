import React from 'react';
import fnv1a from '@sindresorhus/fnv1a';
import PropTypes from 'prop-types';

const Comment = ({ comment }) => {
  const renderMessage = commentMessage => {
    const messages = commentMessage.split('\n');
    return messages.map((item, index) => (
      <p
        key={`${fnv1a(`comment-content-${comment.id}-${index}`, { size: 32 })}`}
        className="whitespace-pre-wrap">
        {item}
      </p>
    ));
  };

  return (
    <div className="comment py-3">
      <h3 className="font-bold pb-2">{comment.name}</h3>
      <h4 className="font-bold pb-6">{comment.date}</h4>
      <div className="pb-2">{renderMessage(comment.message)}</div>
      <hr />
    </div>
  );
};

Comment.propTypes = {
  comment: PropTypes.shape({
    id: PropTypes.string,
    slug: PropTypes.string,
    name: PropTypes.string,
    date: PropTypes.string,
    message: PropTypes.string
  }).isRequired
};

export default Comment;
