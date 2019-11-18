import React from 'react'

import Blockcerts from '../../src/components/organisms/Blockcerts'
import talaoCertificateImage from './assets/images/talaoCertificateImage'
import './App.css'

const App = () => {
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
        <Blockcerts
          url='https://raw.githubusercontent.com/guix77/blockcerts-certificates/talao-0.0.1/certificates/ropsten/talao/duveau-blockcerts.json'
          image={talaoCertificateImage}
          color='#282828'
          color_bg='#edecec'
        />
      </div>
    </div>
  )
}

export default App
