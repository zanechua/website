import React from 'react';

import Layout from 'components/Layout';
import SEO from 'components/SEO';

const AboutPage = () => (
  <Layout>
    <section className="flex flex-1 items-center md:flex-row">
      <div className="md:w-2/3 md:mr-8">
        <p>Tech Geek, Home Labber, Software Engineer experienced in both web and mobile</p>
        <p>I love tinkering with stuff, taking things apart and putting them back. </p>
      </div>
    </section>
  </Layout>
);

export const Head = ({ location }) => <SEO title="About" path={location.pathname} />;

export default AboutPage;
