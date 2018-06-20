# react-blockcerts

This is working but still work in progress!

## Demo

https://guix77.github.io/react-blockcerts/

## How to use

    yarn add react-blockcerts

or

    npm add react-blockcerts

Then

    import React, { Component } from 'react';
    import { Blockcerts } from 'react-blockcerts';
    export defaut MyComponent extends Component {
      render() {
        return(
          <Blockcerts
            url="https://raw.githubusercontent.com/blockchain-certificates/cert-verifier-js/master/tests/data/sample-cert-mainnet-valid-2.0.json"
          />
        );
      }
    }

### Props

#### url

The url of a certificate JSON.

## Development

*You do not need this if you are just using react-blockcerts.*

Watch files and run a development server on http://localhost:3000/

    yarn start

Publish NPM package:

    npm publish

Publish demo:

    yarn publish-demo
