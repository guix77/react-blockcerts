import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Certificate, CertificateVerifier } from 'cert-verifier-js';
import Timestamp from 'react-timestamp';
import ReactJson from 'react-json-view';

import { withStyles } from '@material-ui/core/styles';
import { Button, Paper, Stepper, Step, StepLabel, StepContent, Tabs, Tab, Typography } from '@material-ui/core';

import BlockcertsLogo from './BlockcertsLogo';

const styles = {
  wrapper: {
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 'auto',
    marginRight: 'auto',
    maxWidth: 992,
  },
  header: {
    color: 'white',
    paddingTop: 20,
    backgroundColor: '#02112a',
    textAlign: 'center',
  },
  certificateImg: {
    marginTop: 20
  },
  tab: {
    padding: 20,
  },
  image: {
    maxWidth: '100%',
    height: 'auto',
    marginBottom: 20,
  },
  stepper: {
    textAlign: 'left',
  },
  stepButtons: {
    marginTop: 20,
  },
  stepButton: {
    marginRight: 20,
  },
  verifierResult: {
    textAlign: 'center',
  },
  verifierButton: {
    margin: 20,
  },
  jsonContainer: {
    textAlign: 'left',
    fontSize: '10px',
    overflow: 'hidden',
  },
};

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

const verifierSteps = [
  {
    status: 'computingLocalHash',
    name: 'Computing local hash',
    description: 'Compute locally the hash of this certificate.',
  },
  {
    status: 'fetchingRemoteHash',
    name: 'Fetching remote hash',
    description: 'Get the certificate hash stored in the blockchain transaction.',
  },
  {
    status: 'parsingIssuerKeys',
    name: 'Parsing issuer keys',
    description: 'Get the issuer blockchain public keys (actual and revoked).',
  },
  {
    status: 'comparingHashes',
    name: 'Comparing hashes',
    description: 'Compare the locally computed hash of this certificate VS the hash stored in the blockchain.',
  },
  {
    status: 'checkingMerkleRoot',
    name: 'Checking Merkle root',
    description: 'Validate the Merkle proof stored inside of the certificate.',
  },
  {
    status: 'checkingReceipt',
    name: 'Checking receipt',
    description: 'Compare the Merkle root value in the certificate with the value in the blockchain transaction.',
  },
  {
    status: 'checkingRevokedStatus',
    name: 'Checking revoked status',
    description: 'Check that this certificate has not been revoked by the issuer.',
  },
  {
    status: 'checkingAuthenticity',
    name: 'Checking authenticity',
    description: 'Check that the certificate was authored by the issuer.',
  },
  {
    status: 'checkingExpiresDate',
    name: 'Checking expires date',
    description: 'Check that the certificate is not expired.',
  },
  {
    status: 'success',
    name: 'Valid certificate',
    description: 'Success: this certificate is valid!',
  },
];

class Blockcerts extends Component {
  constructor (props) {
    super (props);
    this.state = {
      tab: 0,
      certificateJson: null,
      certificate: null,
      verifierStep: 0,
      verifierFailureStep: null,
      verifierResult: null,
      viewJson: false
    }
    this.tabChange = this.tabChange.bind(this);
    this.verifyCertificate = this.verifyCertificate.bind(this);
    this.verifierStepper = this.verifierStepper.bind(this);
    this.verifierNext = this.verifierNext.bind(this);
    this.verifierBack = this.verifierBack.bind(this);
  }
  async componentDidMount() {
    // Fetch certificate.
    try {
      const response = await fetch(this.props.url);
      const certificateJson = await response.json();
      this.setState({certificateJson: certificateJson});
    }
    catch (error) {
      console.error(error);
    }
    let certificate = Certificate.parseJson(this.state.certificateJson);
    this.setState({certificate: certificate});
    this.verifyCertificate();
  }
  tabChange(event, value) {
    this.setState({tab: value});
  }
  verifyCertificate() {
    if (this.state.certificateJson) {
      let verifier = new CertificateVerifier(
        JSON.stringify(this.state.certificateJson),
        this.verifierStepper
      );
      verifier
      .verify()
      .then(result => this.setState({verifierResult: result}))
      .catch(e => console.error(e));
    }
  }
  verifierStepper(status) {
    if (status !== 'failure') {
      let step = Object.keys(verifierSteps).find(key => verifierSteps[key].status === status);
      this.setState({verifierStep: step});
    }
    else {
      this.setState({
        verifierFailureStep: this.state.verifierStep,
        verifierResult: 'failure'
      });
    }
  }
  verifierNext() {
    this.setState({verifierStep: this.state.verifierStep + 1});
  }
  verifierBack() {
    this.setState({verifierStep: this.state.verifierStep - 1});
  }
  toggleDebug() {
    if (this.state.viewJson) {
      this.setState({viewJson: false});
    }
    else {
      this.setState({viewJson: true});
      console.log(this.state.certificateJson);
    }
  }
  render() {
    if (this.state.certificateJson && this.state.certificate) {
      const { tab } = this.state;
      const { verifierStep } = this.state;
      const { verifierFailureStep } = this.state;
      return (
        <div className={this.props.classes.wrapper}>
          <Paper elevation={4}>
            <div className={this.props.classes.header} style={{backgroundColor : this.props.color_bg}}>
              <BlockcertsLogo />
              <Tabs
                className={this.props.classes.tabs}
                value={tab}
                onChange={this.tabChange}
                indicatorColor='primary'
                centered
              >
                <Tab label='View' />
                <Tab label='Verify' />
              </Tabs>
            </div>
            <img src={this.props.image} className={this.props.classes.certificateImg} />
            {tab === 0 && <TabContainer>
              <div className={this.props.classes.tab}>
                {this.state.certificateJson.displayHtml && <div dangerouslySetInnerHTML={{__html: this.state.certificateJson.displayHtml.replace(/(<? *script)/gi, 'illegalscript')}} >
                </div>}
                {!this.state.certificateJson.displayHtml && <div>
                  <img src={this.state.certificate.certificateImage} className={this.props.classes.image} />
                  <Typography paragraph variant="headline" component="h1">
                    {this.state.certificate.title}
                  </Typography>
                  <Typography paragraph variant="subheading" component="h2">
                    {this.state.certificate.subtitle}
                  </Typography>
                  <Typography paragraph variant="caption" component="p">
                    Awarded on <Timestamp time={this.state.certificateJson.issuedOn.toString()} format="full" /> to
                  </Typography>
                  <Typography paragraph variant="title" component="h2">
                    {this.state.certificate.name}
                  </Typography>
                  <Typography paragraph component="p">
                    {this.state.certificate.description}
                  </Typography>
                  <Typography paragraph variant="caption" component="p">
                    Issued by
                  </Typography>
                  <img src={this.state.certificate.sealImage} className={this.props.classes.image} />
                  <Typography paragraph variant="title" component="h2">
                    {this.state.certificate.issuer.name}
                  </Typography>
                  <Typography paragraph component="p">
                    {this.state.certificate.issuer.description}
                  </Typography>
                  <Typography paragraph component="p">
                    {this.state.certificate.issuer.email}
                  </Typography>
                </div>}
              </div>
            </TabContainer>}
            {tab === 1 && <TabContainer>
              <div className={this.props.classes.verifierResult}>
                <Typography variant="headline" component="h3">
                  {this.state.verifierResult === 'success' ? 'Valid certificate': 'Invalid certificate'}
                </Typography>
                <Typography component="p">
                  {this.state.verifierResult === 'success' ? 'All the verification steps succedded. This certificate is valid!': 'Some verification steps did not succeed. This certificate is NOT valid.'}
                </Typography>
                <Button className={this.props.classes.verifierButton} variant="contained" color="primary" onClick={this.verifyCertificate}>
                  Verify
                </Button>
                <Button className={this.props.classes.verifierButton} variant="contained" color="primary" href={this.state.certificate.transactionLink}>
                  See blockchain transaction
                </Button>
                <Button
                  className={this.props.classes.verifierButton}
                  variant="contained"
                  onClick={this.toggleDebug.bind(this)}>
                  Raw data
                </Button>
              </div>
              {this.state.viewJson && <div className={this.props.classes.jsonContainer}>
                <Typography paragraph component="p">
                  Data is logged in the browser console, too.
                </Typography>
                <ReactJson
                  src={this.state.certificateJson}
                  collapsed={true}
                />
              </div>}
              <div className={this.props.classes.stepper}>
                <Stepper
                  activeStep={parseInt(verifierStep)}
                  orientation="vertical">
                  {verifierSteps.map((step, index) => {
                    return (
                      <Step key={index}>
                        <StepLabel>{step.name}</StepLabel>
                        <StepContent>
                          <Typography>{step.description}</Typography>
                          <div className={this.props.classes.stepButtons}>
                            {verifierStep > 0 && <Button
                              size="small"
                              color="secondary"
                              className={this.props.classes.stepButton}
                              onClick={this.verifierBack}
                            >
                              Back
                            </Button>}
                            {(verifierStep < verifierSteps.length - 1 && (!verifierFailureStep || verifierStep < verifierFailureStep)) && <Button
                              size="small"
                              color="secondary"
                              className={this.props.classes.stepButton}
                              onClick={this.verifierNext}
                            >
                              Next
                            </Button>}
                          </div>
                        </StepContent>
                      </Step>
                    );
                  })}
                </Stepper>
              </div>
            </TabContainer>}
        </Paper>
        </div>
      );
    }
    else {
      return(null);
    }
  }
}

Blockcerts.propTypes = {
  url: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired
}

export default withStyles(styles)(Blockcerts);
