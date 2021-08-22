import React from 'react';
import PropTypes from 'prop-types';

import Layout from '../components/layout';
import SEO from '../components/seo';

function AboutPage({ location }) {
  return (
    <Layout>
      <SEO
        keywords={['zanechua', 'homelab', 'zane j chua', 'tech geek']}
        title="About"
        path={location.pathname}
      />

      <section className="flex flex-1 items-center md:flex-row">
        <div className="md:w-2/3 md:mr-8">
          <p>Tech Geek, Home Labber, Software Engineer experienced in both web and mobile</p>
          <p>I love tinkering with stuff, taking things apart and putting them back. </p>
        </div>
      </section>
    </Layout>
  );
}

AboutPage.propTypes = {
  location: PropTypes.object
};

export default AboutPage;
