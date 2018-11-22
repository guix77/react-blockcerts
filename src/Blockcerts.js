import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Certificate, CertificateVerifier } from 'cert-verifier-js';
import Timestamp from 'react-timestamp';
import ReactJson from 'react-json-view';

import {
  Button,
  Paper,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Tabs,
  Tab,
  Typography,
  withStyles
} from '@material-ui/core';

import blockcertsLogo from './data/blockcertsLogo';

const styles = {
  wrapper: {
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 'auto',
    marginRight: 'auto',
    maxWidth: 992,
    backgroundColor: 'white',
  },
  header: {
    paddingTop: 20,
    textAlign: 'center',
  },
  tab: {
    padding: 20,
  },
  tabs: {
    marginTop: 10,
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
      verifierExecuted: false,
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

  tabChange(event, value) {
    this.setState({tab: value});
  }

  verifyCertificate() {
    const { certificateJson } = this.state;
    const verifier = new CertificateVerifier(
      JSON.stringify(certificateJson),
      this.verifierStepper
    );
    verifier.verify()
    .then(
      result => {
        this.setState({
          verifierExecuted: true,
          verifierResult: result
        });
      }
    )
    .catch(e => console.error(e));
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
  async componentDidMount() {
    // Fetch certificate.
    try {
      if (this.props.url) {
        const response = await fetch(this.props.url);
        const certificateJson = await response.json();
        this.setState({certificateJson: certificateJson});
      } else {
        await this.setState({certificateJson: this.props.json});
      }
    }
    catch (error) {
      console.error(error);
    }
    let certificate = Certificate.parseJson(this.state.certificateJson);
    this.setState({certificate: certificate});
  }
  render() {
    if (this.state.certificateJson && this.state.certificate) {
      const { classes } = this.props;
      const { tab, verifierExecuted, verifierStep, verifierFailureStep } = this.state;
      return (
        <div className={classes.wrapper}>
          <div
            className={classes.header}
            style={
              {
                color:this.props.color,
                backgroundColor:this.props.color_bg
              }
            }
          >
            <img src={this.props.image} />
            <Tabs
              className={classes.tabs}
              value={tab}
              onChange={this.tabChange}
              indicatorColor='primary'
              centered
            >
              <Tab label='View' />
              <Tab
                onClick={this.verifyCertificate}
                label='Verify'
              />
            </Tabs>
          </div>
          {tab === 0 && <TabContainer>
            <div className={classes.tab}>
              {this.state.certificateJson.displayHtml && <div dangerouslySetInnerHTML={{__html: this.state.certificateJson.displayHtml.replace(/(<? *script)/gi, 'illegalscript')}} >
              </div>}
              {!this.state.certificateJson.displayHtml && <div>
                <img src={this.state.certificate.certificateImage} className={classes.image} />
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
                <img src={this.state.certificate.sealImage} className={classes.image} />
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
            <div className={classes.verifierResult}>
              {
                verifierExecuted &&
                  <Fragment>
                    <Typography variant="headline" component="h3">
                      {this.state.verifierResult === 'success' ? 'Valid certificate': 'Invalid certificate'}
                    </Typography>
                    <Typography component="p">
                      {this.state.verifierResult === 'success' ? 'All the verification steps succedded. This certificate is valid!': 'Some verification steps did not succeed. This certificate is NOT valid.'}
                    </Typography>

                    <Button className={classes.verifierButton} variant="contained" color="primary" href={this.state.certificate.transactionLink}>
                      See blockchain transaction
                    </Button>
                    <Button
                      className={classes.verifierButton}
                      variant="contained"
                      onClick={this.toggleDebug.bind(this)}>
                      Raw data
                    </Button>
                  </Fragment>
              }
            </div>
            {this.state.viewJson && <div className={classes.jsonContainer}>
              <Typography paragraph component="p">
                Data is logged in the browser console, too.
              </Typography>
              <ReactJson
                src={this.state.certificateJson}
                collapsed={true}
              />
            </div>}
            <div className={classes.stepper}>
              <Stepper
                activeStep={parseInt(verifierStep)}
                orientation="vertical">
                {verifierSteps.map((step, index) => {
                  return (
                    <Step key={index}>
                      <StepLabel>{step.name}</StepLabel>
                      <StepContent>
                        <Typography>{step.description}</Typography>
                        <div className={classes.stepButtons}>
                          {verifierStep > 0 && <Button
                            size="small"
                            color="secondary"
                            className={classes.stepButton}
                            onClick={this.verifierBack}
                          >
                            Back
                          </Button>}
                          {(verifierStep < verifierSteps.length - 1 && (!verifierFailureStep || verifierStep < verifierFailureStep)) && <Button
                            size="small"
                            color="secondary"
                            className={classes.stepButton}
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
        </div>
      );
    }
    else {
      return(null);
    }
  }
}

Blockcerts.defaultProps = {
  color: 'white',
  color_bg: '#02112a',
  image: blockcertsLogo
 };

Blockcerts.propTypes = {
  url: PropTypes.string,
  json: PropTypes.object,
  image: PropTypes.string,
  color: PropTypes.string,
  color_bg: PropTypes.string
}

export default withStyles(styles)(Blockcerts);
