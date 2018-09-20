# react-blockcerts

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

If there is some displayHtml in the certificate, the View tab will display it. Otherwise it will display a standard output of the fields defined in the BlockCerts 2.0 standard.

There's also a preview component for unsigned certificates and injected data with a JSON object:

    import React, { Component } from 'react';
    import { BlockcertsPreview } from 'react-blockcerts';
    export defaut MyComponent extends Component {
      render() {
        return(
          <BlockcertsPreview
            json={}
          />
        );
      }
    }

Look at examples/src/data/unsignedCertificateExample for a JSON example, basically it's what Cert-issuer generates, with additional custom fields and displayHtml.

## Development

*You do not need this if you are just using react-blockcerts.*

Watch files and run a development server on http://localhost:3000/

    yarn start

Publish NPM package:

    npm publish

Publish demo:

    yarn publish-demo
