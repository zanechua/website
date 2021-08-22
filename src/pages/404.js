import React from 'react';
import PropTypes from 'prop-types';

import Layout from '../components/layout';
import SEO from '../components/seo';

function NotFoundPage({ location }) {
  return (
    <Layout>
      <SEO title="404: Not found" path={location.pathname} />
      <div>
        <h2 className="text-2xl font-bold inline-block my-8 p-3">
          Poowf! This page does not exist, it must have disappeared into thin air like magic ...
        </h2>
      </div>
    </Layout>
  );
}

NotFoundPage.propTypes = {
  location: PropTypes.object
};

export default NotFoundPage;
