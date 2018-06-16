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
            <li><a href="https://github.com/guix77/react-blockcerts" target="_blank" rel="noopener noreferrer">GitHub</a></li>
            <li><a href="https://www.blockcerts.org/" target="_blank" rel="noopener noreferrer">BlockCerts.org</a></li>
            <li>Sponsored by <a href="https://ico.talao.io/" target="_blank" rel="noopener noreferrer">Talao.io</a></li>
          </ul>
        </header>
        <div className="App-content">
          <article className="App-section">
            <header>
              <h2>2.0, Bitcoin Mainnet, Valid, with displayHtml certificate property</h2>
              <p>https://raw.githubusercontent.com/blockchain-certificates/cert-verifier-js/master/tests/data/sample-cert-mainnet-valid-2.0.json</p>
            </header>
            <Blockcerts
              url="https://raw.githubusercontent.com/blockchain-certificates/cert-verifier-js/master/tests/data/sample-cert-mainnet-valid-2.0.json"
            />
          </article>
          <article className="App-section">
            <header>
              <h2>2.0, Ethereum Mainnet, Valid, with displayHtml certificate property</h2>
              <p>https://raw.githubusercontent.com/blockchain-certificates/cert-verifier-js/master/tests/data/sample_ethereum_cert-mainnet-valid-2.0.json</p>
            </header>
            <Blockcerts
              url="https://raw.githubusercontent.com/blockchain-certificates/cert-verifier-js/master/tests/data/sample_ethereum_cert-mainnet-valid-2.0.json"
            />
            <p><em>I swear I have nothing to do with this image!</em></p>
          </article>
          <article className="App-section">
            <header>
              <h2>2.0, Bitcoin, Valid, without displayHtml: content computed from multiple certificate properties</h2>
              <p>https://raw.githubusercontent.com/blockchain-certificates/cert-verifier-js/master/tests/data/sample_cert-valid-2.0.json</p>
            </header>
            <Blockcerts
              url="https://raw.githubusercontent.com/blockchain-certificates/cert-verifier-js/master/tests/data/sample_cert-valid-2.0.json"
            />
          </article>
          <article className="App-section">
            <header>
              <h2>2.0, Bitcoin, Expired, without displayHtml: content computed from multiple certificate properties</h2>
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
