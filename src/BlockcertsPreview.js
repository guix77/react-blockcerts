import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Certificate } from 'cert-verifier-js';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import BlockcertsLogo from './BlockcertsLogo';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import SchoolIcon from '@material-ui/icons/School';
import Timestamp from 'react-timestamp';
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

class BlockcertsPreview extends Component {
  constructor (props) {
    super (props);
    let certificate = Certificate.parseJson(this.props.json);
    this.state = {
      certificate: certificate,
      tab: certificate.displayHtml ? 0 : 1
    }
    this.tabChange = this.tabChange.bind(this);
  }
  tabChange(event, value) {
    this.setState({tab: value});
  }
  render() {
    const { tab } = this.state;
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
      </Paper>
      </div>
    );
  }
}

BlockcertsPreview.propTypes = {
  json: PropTypes.object.isRequired,
}

export default withStyles(styles)(BlockcertsPreview);
