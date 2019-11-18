import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Certificate } from 'cert-verifier-js'
import Timestamp from 'react-timestamp'
import ReactJson from 'react-json-view'
import {
  Button,
  Stepper, Step, StepLabel, StepIcon,
  Tabs, Tab,
  Typography,
  withStyles
} from '@material-ui/core'

import blockcertsLogo from './data/blockcertsLogo'

const styles = {
  wrapper: {
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 'auto',
    marginRight: 'auto',
    maxWidth: 992,
    backgroundColor: 'white'
  },
  header: {
    paddingTop: 20,
    textAlign: 'center'
  },
  tab: {
    padding: 20
  },
  tabs: {
    marginTop: 10
  },
  image: {
    maxWidth: '100%',
    height: 'auto',
    marginBottom: 20
  },
  stepper: {
    textAlign: 'left'
  },
  stepButtons: {
    marginTop: 20
  },
  stepButton: {
    marginRight: 20
  },
  verifierResult: {
    textAlign: 'center'
  },
  verifierButton: {
    margin: 20
  },
  jsonContainer: {
    textAlign: 'left',
    fontSize: '10px',
    overflow: 'hidden'
  }
}

function TabContainer (props) {
  return (
    <Typography component='div' style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  )
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired
}

class Blockcerts extends Component {
  constructor (props) {
    super(props)
    this.state = {
      tab: 0,
      certificateJson: null,
      certificate: null,
      verificationStep: 0,
      verificationSteps: [],
      verifierExecuted: false,
      verifierStep: 0,
      verifierFailureStep: null,
      verifierResult: null,
      viewJson: false
    }
    this.handleTabChange = this.handleTabChange.bind(this)
  }

  handleTabChange (event, value) {
    this.setState({ tab: value })
  }

  async handleVerifyCertificate () {
    const { certificateJson, verificationSteps } = this.state
    const certificate = new Certificate(certificateJson)
    this.setState({
      verificationStep: 0,
      verificationSteps: []
    })
    try {
      await certificate.verify(({ code, label, status, errorMessage }) => {
        console.log({ code, label, status, errorMessage })
        if (status !== 'starting') {
          verificationSteps.push({ code, label, status, errorMessage })
          const verificationStep = verificationSteps.length - 1
          this.setState({
            verificationStep,
            verificationSteps
          })
        }
      })
    } catch (e) {
      console.error(e)
    }
  }

  isValid () {
    const { verificationSteps } = this.state
    return verificationSteps.every(step => step.status === 'success')
  }

  toggleDebug () {
    if (this.state.viewJson) {
      this.setState({ viewJson: false })
    } else {
      this.setState({ viewJson: true })
      console.log(this.state.certificateJson)
    }
  }

  async componentDidMount () {
    // Fetch certificate.
    try {
      if (this.props.url) {
        const response = await window.fetch(this.props.url)
        const certificateJson = await response.json()
        this.setState({ certificateJson: certificateJson })
      } else {
        await this.setState({ certificateJson: this.props.json })
      }
    } catch (error) {
      console.error(error)
    }
    const certificate = new Certificate(this.state.certificateJson)
    this.setState({ certificate: certificate })
  }

  render () {
    if (this.state.certificateJson && this.state.certificate) {
      const { classes } = this.props
      const { tab, verifierExecuted, verificationStep, verificationSteps } = this.state
      return (
        <div className={classes.wrapper}>
          <div
            className={classes.header}
            style={{
              color: this.props.color,
              backgroundColor: this.props.color_bg
            }}
          >
            <img src={this.props.image} />
            <Tabs
              className={classes.tabs}
              value={tab}
              onChange={this.handleTabChange}
              indicatorColor='primary'
              centered
            >
              <Tab label='View' />
              <Tab
                onClick={() => this.handleVerifyCertificate()}
                label='Verify'
              />
            </Tabs>
          </div>
          {tab === 0 && (
            <TabContainer>
              <div className={classes.tab}>
                {this.state.certificateJson.displayHtml && <div dangerouslySetInnerHTML={{ __html: this.state.certificateJson.displayHtml.replace(/(<? *script)/gi, 'illegalscript') }} />}
                {!this.state.certificateJson.displayHtml && (
                  <div>
                    <img src={this.state.certificate.certificateImage} className={classes.image} />
                    <Typography paragraph variant='h1' component='h1'>
                      {this.state.certificate.title}
                    </Typography>
                    <Typography paragraph variant='subheading' component='h2'>
                      {this.state.certificate.subtitle}
                    </Typography>
                    <Typography paragraph variant='caption' component='p'>
                    Awarded on <Timestamp time={this.state.certificateJson.issuedOn.toString()} format='full' /> to
                    </Typography>
                    <Typography paragraph variant='title' component='h2'>
                      {this.state.certificate.name}
                    </Typography>
                    <Typography paragraph component='p'>
                      {this.state.certificate.description}
                    </Typography>
                    <Typography paragraph variant='caption' component='p'>
                    Issued by
                    </Typography>
                    <img src={this.state.certificate.sealImage} className={classes.image} />
                    <Typography paragraph variant='title' component='h2'>
                      {this.state.certificate.issuer.name}
                    </Typography>
                    <Typography paragraph component='p'>
                      {this.state.certificate.issuer.description}
                    </Typography>
                    <Typography paragraph component='p'>
                      {this.state.certificate.issuer.email}
                    </Typography>
                  </div>
                )}
              </div>
            </TabContainer>)}
          {tab === 1 && (
            <TabContainer>
              <div className={classes.verifierResult}>
                {
                  verifierExecuted && (
                    <>
                      <Typography variant='h3' component='h3'>
                        {this.state.verifierResult === 'success' ? 'Valid certificate' : 'Invalid certificate'}
                      </Typography>
                      <Typography component='p'>
                        {this.state.verifierResult === 'success' ? 'All the verification steps succedded. This certificate is valid!' : 'Some verification steps did not succeed. This certificate is NOT valid.'}
                      </Typography>

                      <Button className={classes.verifierButton} variant='contained' color='primary' href={this.state.certificate.transactionLink}>
                        See blockchain transaction
                      </Button>
                      <Button
                        className={classes.verifierButton}
                        variant='contained'
                        onClick={this.toggleDebug.bind(this)}
                      >
                        Raw data
                      </Button>
                    </>
                  )
                }
              </div>
              {this.state.viewJson && (
                <div className={classes.jsonContainer}>
                  <Typography paragraph component='p'>
                Data is logged in the browser console, too.
                  </Typography>
                  <ReactJson
                    src={this.state.certificateJson}
                    collapsed
                  />
                </div>
              )}
              <div className={classes.stepper}>
                <Stepper activeStep={verificationStep} orientation='vertical'>
                  {
                    verificationSteps.map((step, index) => {
                      return (
                        <Step key={index}>
                          <StepLabel error={step.status === 'failure'}>
                            {step.label}
                          </StepLabel>
                        </Step>
                      )
                    })
                  }
                </Stepper>
              </div>
            </TabContainer>
          )}
        </div>
      )
    } else {
      return (null)
    }
  }
}

Blockcerts.defaultProps = {
  color: 'white',
  color_bg: '#02112a',
  image: blockcertsLogo
}

Blockcerts.propTypes = {
  url: PropTypes.string,
  json: PropTypes.object,
  image: PropTypes.string,
  color: PropTypes.string,
  color_bg: PropTypes.string
}

export default withStyles(styles)(Blockcerts)
