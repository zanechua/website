import React from 'react';
import PropTypes from 'prop-types';

const Comment = ({ comment }) => {
  console.log(comment);
  const renderMessage = commentMessage => {
    const messages = commentMessage.split('\n');
    return messages.map(item => <p key={item}>{item}</p>);
  };

  return (
    <div className="comment py-3">
      <h3 className="font-bold pb-2">{comment.name}</h3>
      <h4 className="font-bold pb-6">{comment.date}</h4>
      {renderMessage(comment.message)}
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
  })
};

export default Comment;
