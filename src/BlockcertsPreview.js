import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
    this.state = {
      tab: this.props.displayHtml ? 0 : 1
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
              {this.props.json.displayHtml && <div dangerouslySetInnerHTML={{__html: this.props.json.displayHtml.replace(/(<? *script)/gi, 'illegalscript')}} >
              </div>}
              {!this.props.json.displayHtml && <div>
                The certificate has no custom display, please view the standard display.
              </div>}
            </div>
          </TabContainer>}
          {tab === 1 && <TabContainer>
            <img src={this.props.json.badge.image} className={this.props.classes.image} />
            <Typography paragraph variant="headline" component="h1">
              {this.props.json.title}
            </Typography>
            <Typography paragraph variant="subheading" component="h2">
              {this.props.json.badge.name}
            </Typography>
            <Typography paragraph variant="caption" component="p">
              Awarded on <Timestamp time={this.props.json.issuedOn.toString()} format="full" /> to
            </Typography>
            <Typography paragraph variant="title" component="h2">
              {this.props.json.recipientProfile.name}
            </Typography>
            {/* <Typography paragraph component="p">
              {this.props.json.description}
            </Typography> */}
            <Typography paragraph variant="caption" component="p">
              Issued by
            </Typography>
            <img src={this.props.json.badge.issuer.image} className={this.props.classes.image} />
            <Typography paragraph variant="title" component="h2">
              {this.props.json.badge.issuer.name}
            </Typography>
            <Typography paragraph component="p">
              {this.props.json.badge.issuer.email}
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
