import React from 'react';
import { Link } from 'gatsby';

const Footer = () => (
  <footer className="bg-gray-800">
    <nav className="flex justify-between max-w-4xl p-4 mx-auto text-sm md:p-8">
      <p className="text-white">
        <Link className="font-bold no-underline" key="zanechua-main" to="/">
          &#169; zanechua.com {new Date().getFullYear()}
        </Link>
      </p>
      <nav>
        {[
          {
            route: 'https://github.com/zanechua',
            title: 'GitHub'
          },
          {
            route: 'https://twitter.com/zanejchua',
            title: 'Twitter'
          },
          {
            route: 'https://www.linkedin.com/in/zanejchua/',
            title: 'LinkedIn'
          }
        ].map(link => (
          <a
            className="block mt-4 font-bold text-white no-underline md:inline-block md:mt-0 md:ml-6"
            key={link.title}
            href={link.route}
            target="_blank"
            rel="nofollow noopener noreferrer">
            {link.title}
          </a>
        ))}
      </nav>
    </nav>
  </footer>
);

export default Footer;
