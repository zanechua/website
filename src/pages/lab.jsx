import React from 'react';
import { Link } from 'gatsby';

import Layout from 'components/Layout';
import SEO from 'components/SEO';

const LabPage = () => (
  <Layout>
    <div className="flex-col w-full">
      <section className="flex-1">
        <h1 className="pb-4">Lab 1 (West)</h1>
        <div className="flex flex-row">
          <div className="border-l-4 border-r-0 border-t-4 border-b-4 border-dashed dark:border-white light:border-black p-1 text-vertical text-center">
            <span>0U - APC AP8959EU3</span>
          </div>
          <ul className="flex-1 text-center">
            <li className="border-l-4 border-r-4 border-t-2 border-b-2 border-dashed dark:border-white light:border-black p-1">
              1U - Linkway 24-Port Patch Panel
            </li>
            <li className="border-l-4 border-r-4 border-t-2 border-b-2 border-dashed dark:border-white light:border-black p-1">
              1U - Brocade ICX7450-48P-STK-E
            </li>
            <li className="border-l-4 border-r-4 border-t-2 border-b-2 border-dashed dark:border-white light:border-black p-1">
              1U - Ruckus ZoneDirector 1200
            </li>
            <li className="border-l-4 border-r-4 border-t-4 border-b-2 border-dashed dark:border-white light:border-black p-1">
              1U - Blank/Empty
            </li>
            <li className="border-l-4 border-r-4 border-t-4 border-b-2 border-dashed dark:border-white light:border-black p-1">
              1U - Blank/Empty
            </li>
            <li className="border-l-4 border-r-4 border-t-4 border-b-2 border-dashed dark:border-white light:border-black p-1">
              1U - Blank/Empty
            </li>
            <li className="border-l-4 border-r-4 border-t-4 border-b-2 border-dashed dark:border-white light:border-black p-1">
              1U - Blank/Empty
            </li>
            <li className="border-l-4 border-r-4 border-t-2 border-b-2 border-dashed dark:border-white light:border-black p-1">
              1U - Modem Chassis
            </li>
            <li className="border-l-4 border-r-4 border-t-2 border-b-2 border-dashed dark:border-white light:border-black p-1">
              1U - Blank/Empty
            </li>
            <li className="border-l-4 border-r-4 border-t-2 border-b-2 border-dashed dark:border-white light:border-black p-1">
              1U - Blank/Empty
            </li>
            <li className="border-l-4 border-r-4 border-t-2 border-b-2 border-dashed dark:border-white light:border-black p-2">
              2U - 3-Pin Type G (UK) PDU
            </li>
            <li className="border-l-4 border-r-4 border-t-2 border-b-2 border-dashed dark:border-white light:border-black p-1">
              1U - Blank/Empty
            </li>
            <li className="border-l-4 border-r-4 border-t-2 border-b-2 border-dashed dark:border-white light:border-black p-1">
              1U - Blank/Empty
            </li>
            <li className="border-l-4 border-r-4 border-t-2 border-b-2 border-dashed dark:border-white light:border-black p-1">
              1U - Blank/Empty
            </li>
            <li className="border-l-4 border-r-4 border-t-2 border-b-2 border-dashed dark:border-white light:border-black p-2">
              2U - Slide-Out Tray
            </li>
            <li className="border-l-4 border-r-4 border-t-2 border-b-2 border-dashed dark:border-white light:border-black p-1">
              1U - Belkin F1DC100P 15&#34; LCD Console
            </li>
            <li className="border-l-4 border-r-4 border-t-2 border-b-2 border-dashed dark:border-white light:border-black p-1">
              1U - Aten CS-1758 KVM Switch
            </li>
            <li className="border-l-4 border-r-4 border-t-2 border-b-2 border-dashed dark:border-white light:border-black p-2">
              2U - APC 7922 PDU
            </li>
            <li className="border-l-4 border-r-4 border-t-2 border-b-2 border-dashed dark:border-white light:border-black p-1">
              1U - Blank/Empty
            </li>
            <li className="border-l-4 border-r-4 border-t-2 border-b-2 border-dashed dark:border-white light:border-black p-1">
              1U - Blank/Empty
            </li>
            <li className="border-l-4 border-r-4 border-t-2 border-b-2 border-dashed dark:border-white light:border-black p-1">
              1U - Blank/Empty
            </li>
            <li className="border-l-4 border-r-4 border-t-2 border-b-2 border-dashed dark:border-white light:border-black p-1">
              1U - Blank/Empty
            </li>
            <li className="border-l-4 border-r-4 border-t-2 border-b-2 border-dashed dark:border-white light:border-black p-4">
              4U - Epyc 7502 server
            </li>
            <li className="border-l-4 border-r-4 border-t-2 border-b-2 border-dashed dark:border-white light:border-black p-3">
              3U - Supermicro SC836
            </li>
            <li className="border-l-4 border-r-4 border-t-2 border-b-2 border-dashed dark:border-white light:border-black p-4">
              4U - Supermicro SC846
            </li>
            <li className="border-l-4 border-r-4 border-t-2 border-b-2 border-dashed dark:border-white light:border-black p-2">
              2U - APC SMT3000RMI2U
            </li>
            <li className="border-l-4 border-r-4 border-t-2 border-b-2 border-dashed dark:border-white light:border-black p-2">
              2U - APC SUA3000RMI2U
            </li>
            <li className="border-l-4 border-r-4 border-t-2 border-b-4 border-dashed dark:border-white light:border-black p-2">
              2U - APC SUA3000RMI2U
            </li>
          </ul>
          <div className="border-l-0 border-r-4 border-t-4 border-b-4 border-dashed dark:border-white light:border-black p-1 text-vertical text-center">
            <span>0U - APC AP8653</span>
          </div>
        </div>
      </section>
      <section className="flex-1 pt-8">
        <h1 className="pb-4">Lab 2 (East)</h1>
        <div className="flex flex-row">
          <div className="border-l-4 border-r-0 border-t-4 border-b-4 border-dashed dark:border-white light:border-black p-1 text-vertical text-center">
            <span>0U - APC AP8653</span>
          </div>
          <ul className="flex-1 text-center">
            <li className="border-l-4 border-r-4 border-t-2 border-b-2 border-dashed dark:border-white light:border-black p-1">
              1U - Linkway 24-Port Patch Panel
            </li>
            <li className="border-l-4 border-r-4 border-t-2 border-b-2 border-dashed dark:border-white light:border-black p-1">
              1U - Brocade ICX7450-48P-STK-E
            </li>
            <li className="border-l-4 border-r-4 border-t-2 border-b-2 border-dashed dark:border-white light:border-black p-0.5">
              0.5U - Blank/Empty
            </li>
            <li className="border-l-4 border-r-4 border-t-2 border-b-2 border-dashed dark:border-white light:border-black p-1">
              1U - Modem Chassis
            </li>
            <li className="border-l-4 border-r-4 border-t-2 border-b-2 border-dashed dark:border-white light:border-black p-0.5">
              0.5U - Blank/Empty
            </li>
            <li className="border-l-4 border-r-4 border-t-2 border-b-2 border-dashed dark:border-white light:border-black p-1">
              1U - Blank Panel
            </li>
            <li className="border-l-4 border-r-4 border-t-2 border-b-2 border-dashed dark:border-white light:border-black p-2">
              2U - Blank Panel
            </li>
            <li className="border-l-4 border-r-4 border-t-2 border-b-2 border-dashed dark:border-white light:border-black p-1">
              1U - Blank Panel
            </li>
            <li className="border-l-4 border-r-4 border-t-2 border-b-2 border-dashed dark:border-white light:border-black p-1">
              1U - Blank Panel
            </li>
            <li className="border-l-4 border-r-4 border-t-2 border-b-2 border-dashed dark:border-white light:border-black p-1">
              1U - Blank Panel
            </li>
            <li className="border-l-4 border-r-4 border-t-2 border-b-2 border-dashed dark:border-white light:border-black p-1">
              1U - Blank Panel
            </li>
            <li className="border-l-4 border-r-4 border-t-2 border-b-2 border-dashed dark:border-white light:border-black p-1">
              1U - Blank Panel
            </li>
            <li className="border-l-4 border-r-4 border-t-2 border-b-2 border-dashed dark:border-white light:border-black p-2">
              2U - Blank Panel
            </li>
            <li className="border-l-4 border-r-4 border-t-2 border-b-2 border-dashed dark:border-white light:border-black p-1">
              1U - Blank Panel
            </li>
            <li className="border-l-4 border-r-4 border-t-2 border-b-2 border-dashed dark:border-white light:border-black p-2">
              2U - Blank Panel
            </li>
            <li className="border-l-4 border-r-4 border-t-2 border-b-2 border-dashed dark:border-white light:border-black p-1">
              1U - Blank/Empty
            </li>
            <li className="border-l-4 border-r-4 border-t-2 border-b-2 border-dashed dark:border-white light:border-black p-1">
              1U - Blank/Empty
            </li>
            <li className="border-l-4 border-r-4 border-t-2 border-b-2 border-dashed dark:border-white light:border-black p-1">
              1U - Blank/Empty
            </li>
            <li className="border-l-4 border-r-4 border-t-2 border-b-2 border-dashed dark:border-white light:border-black p-1">
              1U - Blank/Empty
            </li>
            <li className="border-l-4 border-r-4 border-t-2 border-b-2 border-dashed dark:border-white light:border-black p-1">
              1U - Blank/Empty
            </li>
            <li className="border-l-4 border-r-4 border-t-2 border-b-2 border-dashed dark:border-white light:border-black p-1">
              1U - Dell KVM Console
            </li>
            <li className="border-l-4 border-r-4 border-t-2 border-b-2 border-dashed dark:border-white light:border-black p-1">
              1U - Blank/Empty
            </li>
            <li className="border-l-4 border-r-4 border-t-2 border-b-2 border-dashed dark:border-white light:border-black p-4">
              4U - Epyc 7502 Server
            </li>
            <li className="border-l-4 border-r-4 border-t-2 border-b-2 border-dashed dark:border-white light:border-black p-4">
              4U - Supermicro SC846
            </li>
            <li className="border-l-4 border-r-4 border-t-2 border-b-2 border-dashed dark:border-white light:border-black p-1">
              1U - Blank/Empty
            </li>
            <li className="border-l-4 border-r-4 border-t-2 border-b-2 border-dashed dark:border-white light:border-black p-1">
              1U - Blank/Empty
            </li>
            <li className="border-l-4 border-r-4 border-t-2 border-b-2 border-dashed dark:border-white light:border-black p-4">
              4U - APC SMX2200HV
            </li>
            <li className="border-l-4 border-r-4 border-t-2 border-b-4 border-dashed dark:border-white light:border-black p-4">
              4U - APC SMX120BP
            </li>
          </ul>
          <div className="border-l-0 border-r-4 border-t-4 border-b-4 border-dashed dark:border-white light:border-black p-1 text-vertical text-center">
            <span>0U - APC AP8653</span>
          </div>
        </div>
      </section>
      <section className="flex-1 pt-8">
        <h1 className="pb-4">References</h1>
        <ul className="list-disc pl-10">
          <li>
            <Link
              className="block mt-4 no-underline md:inline-block md:mt-0 md:ml-6"
              key="catalog"
              to="/lab/catalog">
              Catalog
            </Link>
          </li>
        </ul>
      </section>
    </div>
  </Layout>
);

export const Head = ({ location }) => <SEO title="Lab" path={location.pathname} />;

export default LabPage;
