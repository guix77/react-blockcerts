import React, { Component } from 'react';
import './App.css';
import Blockcerts from '../../src/Blockcerts';

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
              <h2>BlockCerts v2.0, standard display, valid, signed on Ethereum testnet</h2>
              <p>https://raw.githubusercontent.com/guix77/blockcerts-certificates/master/certificates/ropsten/talao/guillaumeduveau-react-blockcerts.json</p>
            </header>
            <Blockcerts
              url="https://raw.githubusercontent.com/guix77/blockcerts-certificates/master/certificates/ropsten/talao/guillaumeduveau-react-blockcerts.json"
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
        </div>
      </div>
    );
  }
}

export default App;
