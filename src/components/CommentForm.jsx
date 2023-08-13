import React, { useState } from 'react';
import PropTypes from 'prop-types';

import CatLoader from 'components/CatLoader';

const CommentForm = ({ slug, className }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [confirmationMessage, setConfirmationMessage] = useState('');

  const resetInputData = () => {
    setName('');
    setEmail('');
    setMessage('');
  };

  const handleSubmission = async () => {
    setIsLoading(true);
    setConfirmationMessage('');
    const formData = new URLSearchParams();
    formData.append('fields[slug]', slug);
    formData.append('fields[name]', name);
    formData.append('fields[email]', email);
    formData.append('fields[message]', message);

    if (name === '' || email === '' || message === '') {
      setIsLoading(false);
      setConfirmationMessage('Uh oh. Did you miss something?');
    } else {
      fetch('https://staticman.zanechua.com/v2/entry/zanechua/website/master/comments', {
        method: 'POST',
        data: formData,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      })
        .then(response => {
          if (response.status === 200) {
            resetInputData();
            setConfirmationMessage(
              'Thanks! Your comment will be published after it has been reviewed.'
            );
          } else {
            setConfirmationMessage('Something went wrong.');
          }
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
          setConfirmationMessage('An error occurred when posting your comment');
        });
    }
  };

  if (isLoading) {
    return (
      <section className={className}>
        <div className="comment-form-container bg-gray-800 p-6">
          <h3 className="font-bold text-center pb-2">Processing your comment!</h3>
          <CatLoader />
        </div>
      </section>
    );
  }

  return (
    <section className={className}>
      <h1 className="text-2xl font-bold pb-4">Leave a comment</h1>
      <div className="comment-form-container bg-gray-800 p-6">
        <form className="rounded mb-4">
          <input id="fields[slug]" type="hidden" value={slug} />
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2" htmlFor="fields[name]">
              Name *
            </label>
            <input
              className="shadow appearance-none border rounded w-full text-black py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
              id="fields[name]"
              type="text"
              placeholder="Name"
              onChange={({ target: { value } }) => {
                setName(value);
              }}
              value={name}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2" htmlFor="fields[email]">
              Email *
            </label>
            <input
              className="shadow appearance-none border rounded w-full text-black py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
              id="fields[email]"
              type="text"
              placeholder="Email"
              onChange={({ target: { value } }) => {
                setEmail(value);
              }}
              value={email}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2" htmlFor="fields[message]">
              Message *
            </label>
            <div
              data-replicated-value={message}
              className="grid after:whitespace-pre-wrap after:invisible after:content-[attr(data-replicated-value)] after:[grid-area:1/1/2/2]">
              <textarea
                className="shadow appearance-none border rounded w-full text-black py-2 px-3 leading-tight resize-none overflow-hidden [grid-area:1/1/2/2] focus:outline-none focus:shadow-outline"
                id="fields[message]"
                placeholder="Message"
                rows={6}
                onInput={({ target: { value } }) => {
                  setMessage(value);
                }}
                value={message}
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <button
              className="flex-1 text-white font-bold rainbow-button p-1"
              type="button"
              onClick={handleSubmission}>
              <div className="bg-gray-800 p-2">Post Comment</div>
            </button>
          </div>
        </form>
        <h3>{confirmationMessage}</h3>
      </div>
    </section>
  );
};

CommentForm.propTypes = {
  className: PropTypes.string,
  slug: PropTypes.string.isRequired
};

CommentForm.defaultProps = {
  className: ''
};

export default CommentForm;
