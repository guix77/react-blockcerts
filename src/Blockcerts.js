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
  tab: {
    padding: 20,
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
  verifierReset:{
    marginTop: 20,
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

function getSteps() {
  return [
    'Parsing issuer keys',
    'Comparing hashes',
    'Checking Merkle root',
    'Checking receipt',
    'Checking revoked status',
    'Checking authenticity',
    'Checking expiration date',
    'Success'
  ];
}

function getStepContent(step) {
  switch (step) {
    case 0:
      return 'TODO: explain that step.';
    case 1:
      return 'TODO: explain that step.';
    case 2:
      return 'TODO: explain that step.';
    case 3:
      return 'TODO: explain that step.';
    case 4:
      return 'TODO: explain that step.';
    case 5:
      return 'TODO: explain that step.';
    case 6:
      return 'TODO: explain that step.';
    case 7:
      return 'TODO: explain that step.';
  }
}

function setStep(status) {
  switch (status) {
    case 'parsingIssuerKeys':
      return 0;
    case 'comparingHashes':
      return 1;
    case 'checkingMerkleRoot':
      return 2;
    case 'checkingReceipt':
      return 3;
    case 'checkingRevokedStatus':
      return 4;
    case 'checkingAuthenticity':
      return 5;
    case 'checkingExpiresDate':
      return 6;
    case 'success':
      return 7;
  }
}

class Blockcerts extends Component {
  constructor (props) {
    super (props);
    this.state = {
      tab: 0,
      certificateJson: null,
      certificate: null,
      verifierStep: 0,
      verifierStatus: null,
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
    let step = setStep(status);
    this.setState({
      verifierStep: step,
      verifierStatus: status
    });
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
      const steps = getSteps();
      const { verifierStep } = this.state;
      return (
        <div className={this.props.classes.wrapper}>
          <Paper className={this.props.classes.paper} elevation={4}>
            <div className={this.props.classes.header}>
              <BlockcertsLogo />
              <Tabs
                value={tab}
                onChange={this.tabChange}
                indicatorColor='primary'
                centered
              >
                <Tab
                  label="Custom display"
                  icon={<SchoolIcon />}
                />
                <Tab
                  label="Standard display"
                  icon={<SchoolIcon />}
                />
                <Tab
                  label={'Certificate verification'}
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
              <img src={this.state.certificate.certificateImage} />
              <Typography variant="title" component="h1">{this.state.certificate.title}</Typography>
              <Typography variant="subheading" component="h2">{this.state.certificate.subtitle}</Typography>
              <Typography component="p">Awarded on {this.state.certificateJson.issuedOn.toString()} to:</Typography>
              <Typography variant="title" component="h2">{this.state.certificate.name}</Typography>
              <Typography component="p">{this.state.certificate.description}</Typography>
              <img src={this.state.certificate.signatureImage.image} />
              <Typography component="p">{this.state.certificate.signatureImage.jobTitle}</Typography>
            </TabContainer>}
            {tab === 2 && <TabContainer>
              <div className={this.props.classes.stepper}>
                <Stepper
                  activeStep={verifierStep}
                  orientation="vertical">
                  {steps.map((label, index) => {
                    return (
                      <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                        <StepContent>
                          <Typography>{getStepContent(index)}</Typography>
                          <div className={this.props.classes.stepButtons}>
                            {verifierStep > 0 && <Button
                              size="small"
                              color="secondary"
                              className={this.props.classes.stepButton}
                              onClick={this.verifierBack}
                            >
                              Back
                            </Button>}
                            {verifierStep < steps.length - 1 && <Button
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
              <div className={this.props.classes.verifierResult}>
                <Typography variant="headline" component="h3">
                  {this.state.verifierResult === 'success' ? 'Valid certificate': 'Invalid certificate'}
                </Typography>
                <Typography component="p">
                  {this.state.verifierResult === 'success' ? 'All the verification steps succedded. This certificate is valid!': 'Some verification steps did not succeed. This certificate is NOT valid.'}
                </Typography>
                <Button
                  className={this.props.classes.verifierReset}
                  variant="contained"
                  color="primary"
                  onClick={this.verifyCertificate}
                >
                  Verify again
                </Button>
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
