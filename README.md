# react-blockcerts

This is working but still work in progress!

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

## Props

### url

The url of a certificate JSON.
