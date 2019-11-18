import React from 'react'

import Blockcerts from '../../src/Blockcerts'
import './App.css'
import talaoCertificateImage from './assets/images/talaoCertificateImage'

class App extends React.Component {
  render () {
    return (
      <div className='App'>
        <header className='App-header'>
          <h1 className='App-title'>react-blockcerts example</h1>
          <ul>
            <li><a href='https://github.com/guix77/react-blockcerts'>GitHub</a></li>
            <li><a href='https://www.blockcerts.org/' target='_blank' rel='noopener noreferrer'>BlockCerts.org</a></li>
            <li>Sponsored by <a href='https://ico.talao.io/' target='_blank' rel='noopener noreferrer'>Talao.io</a></li>
          </ul>
        </header>
        <div className='App-content'>
          <article className='App-section'>
            <header>
              <h2>Signed certificate (Blockcerts component), BlockCerts v2.0, custom display, custom additional fields, valid, signed on Ethereum testnet, certificate provided as an URL prop to an online JSON</h2>
              <p>https://raw.githubusercontent.com/guix77/blockcerts-certificates/master/ethereum/ropsten/certificates/talao/duveau-improve-talao-certificates.json</p>
            </header>
            <Blockcerts
              url='https://raw.githubusercontent.com/guix77/blockcerts-certificates/master/ethereum/ropsten/certificates/talao/duveau-improve-talao-certificates.json'
              image={talaoCertificateImage}
              color='#282828'
              color_bg='#edecec'
            />
          </article>
        </div>
      </div>
    )
  }
}

export default App
