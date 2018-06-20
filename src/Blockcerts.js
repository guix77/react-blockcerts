import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Certificate, CertificateVerifier } from 'cert-verifier-js';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import BlockcertsLogo from './BlockcertsLogo';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import SchoolIcon from '@material-ui/icons/School';
import Timestamp from 'react-timestamp';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';

const styles = {
  wrapper: {
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 'auto',
    marginRight: 'auto',
    maxWidth: 992,
  },
  paper: {
  },
  header: {
    color: 'white',
    paddingTop: 20,
    backgroundColor: '#02112a',
  },
  tabs: {
    marginTop: 20,
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
    description: 'TODO: explain that step',
  },
  {
    status: 'fetchingRemoteHash',
    name: 'Fetching remote hash',
    description: 'TODO: explain that step',
  },
  {
    status: 'gettingIssuerProfile',
    name: 'Getting issuer profile',
    description: 'TODO: explain that step',
  },
  {
    status: 'parsingIssuerKeys',
    name: 'Parsing issuer keys',
    description: 'TODO: explain that step',
  },
  {
    status: 'comparingHashes',
    name: 'Comparing hashes',
    description: 'TODO: explain that step',
  },
  {
    status: 'checkingMerkleRoot',
    name: 'Checking Merkle root',
    description: 'TODO: explain that step',
  },
  {
    status: 'checkingReceipt',
    name: 'Checking receipt',
    description: 'TODO: explain that step',
  },
  {
    status: 'checkingIssuerSignature',
    name: 'Checking issuer signature',
    description: 'TODO: explain that step',
  },
  {
    status: 'checkingAuthenticity',
    name: 'Checking authenticity',
    description: 'TODO: explain that step',
  },
  {
    status: 'checkingRevokedStatus',
    name: 'Checking revoked status',
    description: 'TODO: explain that step',
  },
  {
    status: 'checkingExpiresDate',
    name: 'Checking expires date',
    description: 'TODO: explain that step',
  },
  {
    status: 'success',
    name: 'Success: this certificate is valid',
    description: 'TODO: explain that step',
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
      verifierResult: null
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
    if (!this.state.certificateJson.displayHtml && this.state.tab == 0) {
      this.setState({tab: 1});
    }
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
  render() {
    if (this.state.certificateJson && this.state.certificate) {
      const { tab } = this.state;
      const { verifierStep } = this.state;
      const { verifierFailureStep } = this.state;
      return (
        <div className={this.props.classes.wrapper}>
          <Paper className={this.props.classes.paper} elevation={4}>
            <div className={this.props.classes.header}>
              <BlockcertsLogo />
              <Tabs
                className={this.props.classes.tabs}
                value={tab}
                onChange={this.tabChange}
                indicatorColor='primary'
                centered
              >
                <Tab
                  label="Custom"
                  icon={<SchoolIcon />}
                />
                <Tab
                  label="Standard"
                  icon={<SchoolIcon />}
                />
                <Tab
                  label={'Verification'}
                  icon={this.state.verifierResult == 'success' ? <CheckCircleIcon /> : <HighlightOffIcon />}
                />
              </Tabs>
            </div>
            {tab === 0 && <TabContainer>
              <div className={this.props.classes.tab}>
                {this.state.certificateJson.displayHtml && <div dangerouslySetInnerHTML={{__html: this.state.certificateJson.displayHtml.replace(/(<? *script)/gi, 'illegalscript')}} >
                </div>}
                {!this.state.certificateJson.displayHtml && <div>
                  The certificate has no custom display, please view the standard display.
                </div>}
              </div>
            </TabContainer>}
            {tab === 1 && <TabContainer>
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
            </TabContainer>}
            {tab === 2 && <TabContainer>
              <div className={this.props.classes.verifierResult}>
                <Typography variant="headline" component="h3">
                  {this.state.verifierResult === 'success' ? 'Valid certificate': 'Invalid certificate'}
                </Typography>
                <Typography component="p">
                  {this.state.verifierResult === 'success' ? 'All the verification steps succedded. This certificate is valid!': 'Some verification steps did not succeed. This certificate is NOT valid.'}
                </Typography>
                <Button className={this.props.classes.verifierButton} variant="contained" color="primary" href={this.state.certificate.transactionLink}>
                  See blockchain transaction
                </Button>
                <Button className={this.props.classes.verifierButton} variant="contained" color="primary" onClick={this.verifyCertificate}>
                  Verify again
                </Button>
              </div>
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
  url: PropTypes.string.isRequired
}

export default withStyles(styles)(Blockcerts);
