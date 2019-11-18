# react-blockcerts

## Demo

https://guix77.github.io/react-blockcerts/

## How to use

    yarn add react-blockcerts

### Blockcerts component for signed certificates

    import React from 'react'
    import Blockcerts from 'react-blockcerts'

    const App = () => {
      return (
        <Blockcerts
          url="https://raw.githubusercontent.com/blockchain-certificates/cert-verifier-js/master/tests/data/sample-cert-mainnet-valid-2.0.json"
        />
      )
    }

**Props**

Either an url, OR a json prop **must** be used.

- url (string): url of the JSON of the signed certificate
- json (object): the signed certificate as a JSON object
- color (string): hex code for the header color text (facultative, fallbacks to white)
- color_bg (string): hex code for the header background color (facultative, fallbacks to marine blue)
- image (string): header image in base 64, like data:image/png;base64,... (facultative, fallbacks to BlockCerts logo)

## Development

*You do not need this if you are just using react-blockcerts.*

Run a development server on http://localhost:3000/ and watch files:

    yarn start

Lint:

    yarn test

Publish NPM package:

    npm publish

Publish demo:

    yarn publish-demo

## Sponsors

+ [Talao](https://talao.io)
