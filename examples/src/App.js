import React, { Component } from 'react';
import './App.css';

import Blockcerts from '../../src/Blockcerts';
import BlockcertsPreview from '../../src/BlockcertsPreview';

import unsignedCertificateExample from './data/unsignedCertificateExample';
import signedCertificateExample from './data/signedCertificateExample';

import talaoCertificateImage from './data/talaoCertificateImage';

class App extends Component {
  render() {
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
              <h2>Signed certificate (Blockcerts component), BlockCerts v2.0, custom display, custom additional fields, valid, signed on Ethereum testnet, certificate provided as an URL prop to an online JSON</h2>
              <p>https://raw.githubusercontent.com/guix77/blockcerts-certificates/master/certificates/ropsten/talao/duveau-improve-certificates.json</p>
            </header>
            <Blockcerts
              url="https://raw.githubusercontent.com/guix77/blockcerts-certificates/master/certificates/ropsten/talao/duveau-improve-certificates.json"
            />
          </article>
          <article className="App-section">
            <header>
              <h2>Same but custom header image, text and background colors, and certificate provided as a JSON object prop</h2>
              <p>https://raw.githubusercontent.com/guix77/blockcerts-certificates/master/certificates/ropsten/talao/duveau-improve-certificates.json</p>
            </header>
            <Blockcerts
              json={signedCertificateExample.json}
              image={talaoCertificateImage}
              color='#282828'
              color_bg='#edecec'
            />
          </article>
          <article className="App-section">
            <header>
              <h2>Unsigned certificate (BlockcertsPreview component). Header with custom image and background color. Certificate provided as a JSON object prop.</h2>
            </header>
            <BlockcertsPreview
              json={unsignedCertificateExample.json}
              image={talaoCertificateImage}
              color='#282828'
              color_bg="#edecec"
            />
          </article>
        </div>
      </div>
    );
  }
}

export default App;
