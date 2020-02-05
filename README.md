# react-blockcerts

## Introduction

This component for React allows to view and verify certificates compliant with the Blockcerts standard.

This is not the official Blockcerts.org viewer, but it implements the same verification process and uses some of its code ([cert-verifier-js](https://github.com/blockchain-certificates/cert-verifier-js)).

For official information about Blockcerts, please check https://www.blockcerts.org/about.html

## Demo

https://guix77.github.io/react-blockcerts

## How to use

    yarn add react-blockcerts

Then in your React app:

    import React from 'react'
    import Blockcerts from 'react-blockcerts'

    const App = () => {
      return (
        <Blockcerts
          src="https://raw.githubusercontent.com/blockchain-certificates/cert-verifier-js/master/tests/data/sample-cert-mainnet-valid-2.0.json"
        />
      )
    }

### Props

- src (string or object): url of the certificate JSON, or certificate JSON

## Author

Guillaume Duveau, blockchain and web developer (https://guillaumeduveau.com)

## Sponsors

+ [Talao](https://talao.io)

## Development

Publish NPM package:

    npm publish

Publish demo:

    yarn publish-demo
