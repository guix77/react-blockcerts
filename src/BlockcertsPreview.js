import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Button, Paper, Typography} from '@material-ui/core';
import Timestamp from 'react-timestamp';
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
  paper: {
  },
  header: {
    color: 'white',
    paddingTop: 20,
    paddingBottom: 20,
  },
  image: {
    maxWidth: '100%',
    height: 'auto',
    marginBottom: 20,
  },
};

class BlockcertsPreview extends Component {
  render() {
    return (
      <div className={this.props.classes.wrapper}>
        <div
          className={this.props.classes.header}
          style={{backgroundColor : this.props.color_bg}}
        >
          <img src={this.props.image} />
        </div>
        {this.props.json.displayHtml && <div className={this.props.classes.tab}>
          <div dangerouslySetInnerHTML={{__html: this.props.json.displayHtml.replace(/(<? *script)/gi, 'illegalscript')}} ></div>
        </div>}
        {!this.props.json.displayHtml && <div>
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
        </div>}
      </div>
    );
  }
}

BlockcertsPreview.defaultProps = {
  color_bg: '#02112a',
  image: blockcertsLogo
 };

BlockcertsPreview.propTypes = {
  json: PropTypes.object.isRequired,
  image: PropTypes.string,
  color_bg: PropTypes.string
}

export default withStyles(styles)(BlockcertsPreview);
