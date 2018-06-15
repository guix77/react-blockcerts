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
import LocalLibraryIcon from '@material-ui/icons/LocalLibrary';

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

class Blockcerts extends Component {
  constructor (props) {
    super (props);
    this.state = {
      tab: 0,
      certificateJson: null,
      certificate: null,
      verifierStatus: null,
      verifierResult: null
    }
    this.tabChange = this.tabChange.bind(this);
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
    this.verifyCertificate();
  }
  tabChange(event, value) {
    this.setState({tab: value});
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
      if (!this.state.certificateJson.displayHtml) {
        this.setState({tab: 1});
      }
    }
  }
  verifierLogger(status) {
    this.setState({
      verifierStatus: status
    });
  }
  render() {
    if (this.state.certificateJson && this.state.certificate) {
      const { tab } = this.state;
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
                  label="Certificate's own display"
                  icon={<LocalLibraryIcon />}
                />
                <Tab
                  label="Certificate standard display"
                  icon={<LocalLibraryIcon />}
                />
                <Tab
                  label={'Certificate verification'}
                  href="#basic-tabs"
                  icon={this.state.verifierResult == 'success' ? <CheckCircleIcon /> : <HighlightOffIcon />}
                />
              </Tabs>
            </div>
            {tab === 0 && <TabContainer>
              <div className={this.props.classes.tab}>
                {this.state.certificateJson.displayHtml && <div dangerouslySetInnerHTML={{__html: this.state.certificateJson.displayHtml.replace(/(<? *script)/gi, 'illegalscript')}} >
                </div>}
                {!this.state.certificateJson.displayHtml && <div>
                  The certificate has no own display, please view the standard display.
                </div>}
              </div>
            </TabContainer>}
            {tab === 1 && <TabContainer>
              <img src={this.state.certificate.certificateImage} />
              <h1>{this.state.certificate.title}</h1>
              <h2>{this.state.certificate.subtitle}</h2>
              <p className="issuedOn">Awarded on {this.state.certificateJson.issuedOn.toString()}</p>
              <p className="name">{this.state.certificate.name}</p>
              <p className="description">{this.state.certificate.description}</p>
              <img src={this.state.certificate.signatureImage.image} />
              <p className="jobTitle">{this.state.certificate.signatureImage.jobTitle}</p>
            </TabContainer>}
            {tab === 2 && <TabContainer>
              <button onClick={this.verifyCertificate}>
                {this.state.verifierResult ? 'Verify again' : 'Verify now'}
              </button>
              <p>{this.state.verifierStatus}</p>
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
