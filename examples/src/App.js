import React, { Component } from 'react';
import './App.css';
import Blockcerts from '../../src/Blockcerts';
import BlockcertsPreview from '../../src/BlockcertsPreview';

class App extends Component {
  render() {
    const json = {
      "@context": [
        "https://w3id.org/openbadges/v2",
        "https://w3id.org/blockcerts/v2",
        "https://raw.githubusercontent.com/guix77/blockcerts-certificates/master/schema/1.0-alpha1/context.json",
        {
          "displayHtml": {
            "@id": "schema:description"
          }
        }
      ],
      "type": "Assertion",
      "id": "urn:uuid:b0de1180-a0a6-48d7-9d3a-622254a9d16a",
      "issuedOn": "2018-06-29T16:18:09.044668+00:00",
      "displayHtml": "<h1>Certificate of freelance work through Talao</h1><p>This BlockCerts certificate was issued by the Client for freelance work done by the Talent, through Talao.</p>",
      "verification": {
        "type": [
          "MerkleProofVerification2017",
          "Extension"
        ],
        "publicKey": "ecdsa-koblitz-pubkey:0x010223f25C101C2e66175E83C990D42292364575"
      },
      "recipient": {
        "type": "email",
        "hashed": false,
        "identity": "guillaume.duveau@example.com"
      },
      "recipientProfile": {
        "type": [
          "RecipientProfile",
          "Extension"
        ],
        "publicKey": "ecdsa-koblitz-pubkey:0xa447b114FA15698a8f564A80F2D63C199133618a",
        "name": "Guillaume Duveau"
      },
      "badge": {
        "name": "Certificate of freelance work through Talao",
        "signatureLines": [
          {
            "name": "Antoine Keriven",
            "jobTitle": "Product manager at Talao",
            "type": [
              "SignatureLine",
              "Extension"
            ],
            "image": "data:image/png;base64,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"
          }
        ],
        "description": "This BlockCerts certificate was issued by the Client for freelance work done by the Talent, through Talao.",
        "id": "urn:uuid:82a4c9f2-3588-457b-80ea-da695571b8fc",
        "type": "BadgeClass",
        "image": "data:image/png;base64,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",
        "criteria": {
          "narrative": "This BlockCerts certificate was issued by the Client for freelance work done by the Talent, through Talao."
        },
        "issuer": {
          "email": "certificates@talao.io",
          "url": "https://talao.io/",
          "revocationList": "https://raw.githubusercontent.com/guix77/blockcerts-certificates/master/issuers/ropsten/revocation-list/talao.json",
          "type": "Profile",
          "id": "https://raw.githubusercontent.com/guix77/blockcerts-certificates/master/issuers/ropsten/talao.json",
          "name": "Talao",
          "image": "data:image/png;base64,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"
        }
      }
    }
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">react-blockcerts examples</h1>
          <ul>
            <li><a href="https://github.com/guix77/react-blockcerts">GitHub</a></li>
            <li><a href="https://www.blockcerts.org/" target="_blank" rel="noopener noreferrer">BlockCerts.org</a></li>
            <li>Sponsored by <a href="https://ico.talao.io/" target="_blank" rel="noopener noreferrer">Talao.io</a></li>
          </ul>
        </header>
        <div className="App-content">
          <article className="App-section">
            <header>
              <h2>BlockCerts v2.0, standard display, valid, signed on Ethereum testnet</h2>
              <p>https://raw.githubusercontent.com/guix77/blockcerts-certificates/master/certificates/ropsten/talao/test4.json</p>
            </header>
            <Blockcerts
              url="https://raw.githubusercontent.com/guix77/blockcerts-certificates/master/certificates/ropsten/talao/test4.json"
            />
          </article>
          <article className="App-section">
            <header>
              <h2>BlockCerts v2.0, standard display, valid, signed on Bitcoin testnet</h2>
              <p>https://raw.githubusercontent.com/blockchain-certificates/cert-verifier-js/master/tests/data/sample_cert-valid-2.0.json</p>
            </header>
            <Blockcerts
              url="https://raw.githubusercontent.com/blockchain-certificates/cert-verifier-js/master/tests/data/sample_cert-valid-2.0.json"
            />
          </article>
          <article className="App-section">
            <header>
              <h2>BlockCerts v2.0, custom display, valid, signed on Bitcoin mainnet</h2>
              <p>https://raw.githubusercontent.com/blockchain-certificates/cert-verifier-js/master/tests/data/sample-cert-mainnet-valid-2.0.json</p>
            </header>
            <Blockcerts
              url="https://raw.githubusercontent.com/blockchain-certificates/cert-verifier-js/master/tests/data/sample-cert-mainnet-valid-2.0.json"
            />
          </article>
          <article className="App-section">
            <header>
              <h2>BlockCerts v2.0, standard display, invalid (wrong issuer keys), signed on Bitcoin testnet</h2>
              <p>https://raw.githubusercontent.com/blockchain-certificates/cert-verifier-js/master/tests/data/sample_cert-expired-2.0.json</p>
            </header>
            <Blockcerts
              url="https://raw.githubusercontent.com/blockchain-certificates/cert-verifier-js/master/tests/data/sample_cert-expired-2.0.json"
            />
          </article>
          <article className="App-section">
            <header>
              <h2>Certificate preview, BlockCerts v2.0, standard display</h2>
              <p>Data injected as a JSON object instead of fetching from an online JSON</p>
            </header>
            <BlockcertsPreview
              json={json}
            />
          </article>
        </div>
      </div>
    );
  }
}

export default App;
