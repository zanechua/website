import PropTypes from "prop-types";
import React from "react";

import Header from "./header";
import Footer from './footer';

function Layout(props) {
  const { children, className } = props;
  return (
    <div className={`flex flex-col min-h-screen font-firacode text-gray-900 ${className || ''}`}>
      <Header />
      <main className="flex flex-1 w-full max-w-4xl px-4 py-8 mx-auto md:px-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}

Layout.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default Layout;
