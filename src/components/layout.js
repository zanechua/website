import React from 'react';
import PropTypes from 'prop-types';

import Footer from './footer';
import Header from './header';
import { ServiceWorkerUpdate } from './service-worker-update';

function Layout(props) {
  const { children, className } = props;
  return (
    <div className={`flex flex-col min-h-screen font-firacode ${className || ''}`}>
      <ServiceWorkerUpdate />
      <Header />
      <main className="flex flex-col flex-1 w-full max-w-4xl px-4 py-8 mx-auto md:px-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}

Layout.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired
};

export default Layout;
