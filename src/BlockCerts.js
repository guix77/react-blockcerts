import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Certificate, Verifier } from 'cert-verifier-js';
import styled from 'styled-components';

const Wrapper = styled.div`
  margin: 0 auto;
  max-width: 920px;
`

export default class BlockCerts extends Component {
  constructor (props) {
    super (props);
    this.state = {
      certificateJson: null,
      certificate: null,
      verifierStatus: null,
      verifierResult: null
    }
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
  verifierStatusLogger(status) {
    this.setState({
      verifierStatus: status
    });
  }
  render() {
    if (this.state.certificateJson && this.state.certificate) {
      if (this.state.certificateJson.displayHtml) {
        return (
          <Wrapper className="BlockCerts">
            <div dangerouslySetInnerHTML={{__html: this.state.certificateJson.displayHtml.replace(/(<? *script)/gi, 'illegalscript')}} >
            </div>
          </Wrapper>
        );
      }
      return (
        <Wrapper className="BlockCerts">
          <img src={this.state.certificate.certificateImage} />
          <h1>{this.state.certificate.title}</h1>
          <h2>{this.state.certificate.subtitle}</h2>
          <p className="issuedOn">Awarded on {this.state.certificateJson.issuedOn.toString()}</p>
          <p className="name">{this.state.certificate.name}</p>
          <p className="description">{this.state.certificate.description}</p>
          <img src={this.state.certificate.signatureImage.image} />
          <p className="jobTitle">{this.state.certificate.signatureImage.jobTitle}</p>
        </Wrapper>
      );
    }
    else {
      return(null);
    }
  }
}

BlockCerts.propTypes = {
  url: PropTypes.string.isRequired
}
