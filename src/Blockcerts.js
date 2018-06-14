import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Certificate, CertificateVerifier } from 'cert-verifier-js';
import styled from 'styled-components';

const Certificatewrapper = styled.div`
  margin: 0 auto;
  padding: 20px;
  max-width: 920px;
  border-radius: 2px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  transition: all 0.3s cubic-bezier(.25,.8,.25,1);
  &:hover {
    box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
  }
`

const Verifierwrapper = styled.div`
  margin: 0 auto;
  padding: 20px;
  max-width: 920px;
`

export default class Blockcerts extends Component {
  constructor (props) {
    super (props);
    this.state = {
      certificateJson: null,
      certificate: null,
      verifierStatus: null,
      verifierResult: null
    }
    this.verifyCertificate = this.verifyCertificate.bind(this);
    this.verifierStatusLogger = this.verifierStatusLogger.bind(this);
  }
  async componentDidMount() {
    // Fetch certificate.
    try {
      const response = await fetch(this.props.url);
      const certificateJson = await response.json();
      this.setState({
        certificateJson: certificateJson
      });
    }
    catch (error) {
      console.error(error);
    }
    let certificate = Certificate.parseJson(this.state.certificateJson);
    this.setState({
      certificate: certificate
    });
  }
  verifyCertificate() {
    if (this.state.certificateJson) {
      let verifier = new CertificateVerifier(
        JSON.stringify(this.state.certificateJson),
        this.verifierStatusLogger
      );
      verifier
      .verify()
      .then(result => this.setState({
        verifierResult: result
      }))
      .catch(e => console.error(e));
    }
  }
  verifierStatusLogger(status) {
    this.setState({
      verifierStatus: status
    });
  }
  render() {
    if (this.state.certificateJson && this.state.certificate) {
      if (this.state.certificateJson.displayHtml) {
        return (
          <div>
            <Verifierwrapper>
              <button
                onClick={this.verifyCertificate}
              >
                {this.state.verifierResult ? 'Verify again' : 'Verify'}
              </button>
              <p>{this.state.verifierStatus}</p>
            </Verifierwrapper>
            <Certificatewrapper className="Blockcerts">
              <div dangerouslySetInnerHTML={{__html: this.state.certificateJson.displayHtml.replace(/(<? *script)/gi, 'illegalscript')}} >
              </div>
            </Certificatewrapper>
          </div>
        );
      }
      return (
        <div>
          <Certificatewrapper className="Blockcerts">
            <img src={this.state.certificate.certificateImage} />
            <h1>{this.state.certificate.title}</h1>
            <h2>{this.state.certificate.subtitle}</h2>
            <p className="issuedOn">Awarded on {this.state.certificateJson.issuedOn.toString()}</p>
            <p className="name">{this.state.certificate.name}</p>
            <p className="description">{this.state.certificate.description}</p>
            <img src={this.state.certificate.signatureImage.image} />
            <p className="jobTitle">{this.state.certificate.signatureImage.jobTitle}</p>
          </Certificatewrapper>
        </div>
      );
    }
    else {
      return(null);
    }
  }
}

Blockcerts.propTypes = {
  url: PropTypes.string.isRequired
}
