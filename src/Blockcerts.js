import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Certificate, CertificateVerifier } from 'cert-verifier-js';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';

const styles = {
  wrapper: {
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 'auto',
    marginRight: 'auto',
    maxWidth: 992,
  },
  certificate: {
    padding: 20,
  },
};

class Blockcerts extends Component {
  constructor (props) {
    super (props);
    this.state = {
      certificateJson: null,
      certificate: null,
      verifierStatus: null,
      verifierResult: null
    }
    this.verifyCertificate = this.verifyCertificate.bind(this);
    this.verifierLogger = this.verifierLogger.bind(this);
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
        this.verifierLogger
      );
      verifier
      .verify()
      .then(result => this.setState({
        verifierResult: result
      }))
      .catch(e => console.error(e));
    }
  }
  verifierLogger(status) {
    this.setState({
      verifierStatus: status
    });
  }
  render() {
    if (this.state.certificateJson && this.state.certificate) {
      if (this.state.certificateJson.displayHtml) {
        return (
          <div className={this.props.classes.wrapper}>
            <Paper className={this.props.classes.certificate} elevation={4}>
              <button
                onClick={this.verifyCertificate}
              >
                {this.state.verifierResult ? 'Verify again' : 'Verify now'}
              </button>
              <p>{this.state.verifierStatus}</p>
              <Divider />
              <div dangerouslySetInnerHTML={{__html: this.state.certificateJson.displayHtml.replace(/(<? *script)/gi, 'illegalscript')}} >
              </div>
          </Paper>
          </div>
        );
      }
      else {
        return (
          <div className={this.props.classes.wrapper}>
            <button
              onClick={this.verifyCertificate}
            >
              {this.state.verifierResult ? 'Verify again' : 'Verify now'}
            </button>
            <p>{this.state.verifierStatus}</p>
            <Paper className={this.props.classes.certificate} elevation={4}>
              <img src={this.state.certificate.certificateImage} />
              <h1>{this.state.certificate.title}</h1>
              <h2>{this.state.certificate.subtitle}</h2>
              <p className="issuedOn">Awarded on {this.state.certificateJson.issuedOn.toString()}</p>
              <p className="name">{this.state.certificate.name}</p>
              <p className="description">{this.state.certificate.description}</p>
              <img src={this.state.certificate.signatureImage.image} />
              <p className="jobTitle">{this.state.certificate.signatureImage.jobTitle}</p>
          </Paper>
          </div>
        );
      }
    }
    else {
      return(null);
    }
  }
}

Blockcerts.propTypes = {
  url: PropTypes.string.isRequired
}

export default withStyles(styles)(Blockcerts);
