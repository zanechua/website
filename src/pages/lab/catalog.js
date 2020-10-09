import React from "react";

import Layout from "../../components/layout";
import SEO from "../../components/seo";

function LabPage() {
  return (
    <Layout>
      <SEO
        keywords={[`zanechua`, `homelab`, `zane j chua`, `tech geek`]}
        title="Lab"
        path={location.pathname}
      />
      <div className="flex-col">
        <section className="flex-1">
          <h2 className="font-bold text-teal-400 pb-4">Workstations</h2>
          <h4 className="py-2">Xeon Air 540</h4>
          <ul className="list-disc pl-10">
            <li>2 * Intel Xeon E-2670 v1</li>
            <li>2 * Noctua NH-U9DX-I4</li>
            <li>1 * Supermicro X9DRi-F</li>
            <li>1 * Thermaltake iRGB Plus 1250W</li>
            <li>1 * Intel Optane SSD 900P 480GB</li>
            <li>1 * Zotac GTX-1060 6GB Mini</li>
            <li>1 * Sapphire RX-5700 8GB Reference</li>
            <li>1 * Mellanox ConnectX-3 CX354A-QCBT (Flashed to FCBT) Dual 40Gb QSFP</li>
            <li>16 * Samsung 8GB 1600MHz DDR3 ECC Memory</li>
          </ul>
        </section>
        <section className="flex-1 pt-12">
          <h2 className="font-bold text-teal-400 pb-4">Servers</h2>
          <h4 className="py-2">2U - Xeon 8160 Server</h4>
          <ul className="list-disc pl-10">
            <li>1 * Intel Xeon Platinum 8160 QL1K ES CPU</li>
            <li>1 * Supermicro X11-SPM-TPF</li>
            <li>1 * FSP Twins 500W</li>
            <li>1 * Intel Optane SSD 900P 480GB</li>
            <li>6 * Samsung 32GB 2133MHz DDR4 ECC Memory (M386A4G40DM0-CPB)</li>
            <li>12 * WD Blue 1TB SATA SSD</li>
          </ul>
          <h4 className="py-4">1U - Supermicro SYS-6018R-MT</h4>
          <ul className="list-disc pl-10">
            <li>2 * Intel Xeon E-2620 v3</li>
            <li>1 * Supermicro X10DRL-i</li>
            <li>4 * Kingston 32GB 2133MHz DDR4 ECC Memory (KVR21R15D4/32)</li>
          </ul>
          <h4 className="py-4">3U - Supermicro SC836</h4>
          <ul className="list-disc pl-10">
            <li>2 * Intel Xeon E-2670 v1</li>
            <li>1 * Supermicro X9DRi-LN4F+</li>
            <li>16 * Hynix 8GB 1600MHz DDR3 ECC Memory</li>
          </ul>
          <h4 className="py-4">4U - Supermicro SC846</h4>
          <ul className="list-disc pl-10">
            <li>2 * Intel Xeon E-2670 v1</li>
            <li>1 * Supermicro X9DR3-LN4F+</li>
            <li>24 * Samsung 8GB 1600MHz DDR3 ECC Memory</li>
          </ul>
        </section>
        <section className="flex-1 pt-12">
          <h2 className="font-bold text-teal-400 pb-4">Networking</h2>
          <h4 className="py-2">Switches</h4>
          <ul className="list-disc pl-10">
            <li>2 * Brocade ICX7450-48P-STK-E</li>
            <li>12 * Finisar FTL410QE2C-G1 QSFP 40Gb Transceivers</li>
          </ul>
          <h4 className="py-4">Access Points</h4>
          <ul className="list-disc pl-10">
            <li>3 * Ruckus R710</li>
            <li>1 * Ruckus R720</li>
          </ul>
          <h4 className="py-4">Network Cards</h4>
          <ul className="list-disc pl-10">
            <li>1 * Mellanox ConnectX-3 CX354A-QCBT (Flashed to FCBT) Dual 40Gb QSFP (LP Bracket)</li>
          </ul>
          <h4 className="py-2">Transceivers</h4>
          <ul className="list-disc pl-10">
            <li>4 * Mellanox MAM1Q00A-QSA QSFP+ to SFP+ Adapters</li>
            <li>12 * Finisar FTL410QE2C-G1 QSFP 40Gb Transceivers</li>
          </ul>
          <h4 className="py-4">Cables</h4>
          <ul className="list-disc pl-10">
            <li>1 * 1m Brocade 4x10GbE QSFP Cable</li>
            <li>2 * 0.5m NetApp Amphenol X6559-R6 QSFP Cable</li>
            <li>2 * 1m NetApp Amphenol X6559-R6 QSFP Cable</li>
            <li>2 * 5m NetApp Amphenol X6559-R6 QSFP Cable</li>
            <li>4 * 10m TE MPO-MPO 8FIBER MM50 OFNR</li>
          </ul>
          <h4 className="py-2">Other</h4>
          <ul className="list-disc pl-10">
            <li>6 * Brocade ICX7400-4x10GF SFP+ Module</li>
            <li>4 * Brocade ICX7400-1x40GQ QSFP Module</li>
            <li>12 * Finisar FTL410QE2C-G1 QSFP 40Gb Transceivers</li>
          </ul>
        </section>
        <section className="flex-1 pt-12">
          <h2 className="font-bold text-teal-400 pb-4">Power</h2>
          <h4 className="py-2">UPSes</h4>
          <ul className="list-disc pl-10">
            <li>2 * APC SUA3000RMI2U</li>
          </ul>
          <h4 className="py-4">PDUs</h4>
          <ul className="list-disc pl-10">
            <li>1 * APC 7922</li>
            <li>1 * APC AP8653</li>
            <li>1 * APC AP8959EU3</li>
            <li>1 * Generic 3-Pin Type G (UK) PDU</li>
          </ul>
        </section>
      </div>
    </Layout>
  );
}

export default LabPage;
