import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Certificate } from 'cert-verifier-js'
import Timestamp from 'react-timestamp'
import {
  Button,
  CircularProgress,
  Stepper, Step, StepLabel, StepContent,
  Tabs, Tab,
  Typography,
  withStyles
} from '@material-ui/core'

import blockcertsLogo from '../assets/images/blockcertsLogo'

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
  tabs: {
    marginTop: 10
  },
  tab: {
    padding: 20
  },
  image: {
    maxWidth: '100%',
    height: 'auto',
    marginBottom: 20
  },
  stepper: {
    textAlign: 'left'
  },
  verificationResult: {
    textAlign: 'center'
  },
  button: {
    margin: 20
  }
}

class Blockcerts extends Component {
  constructor (props) {
    super(props)
    this.state = {
      src: null,
      error: null,
      certificate: null,
      verificationStep: 0,
      verificationSteps: [],
      verificationResult: null,
      tab: 0
    }
  }

  handleTabChange (event, tab) {
    this.setState({ tab })
  }

  async handleVerifyCertificate () {
    const { certificate, verificationSteps } = this.state
    try {
      const verificationResult = await certificate.verify(({ code, label, status, errorMessage }) => {
        if (status !== 'starting') {
          verificationSteps.push({ code, label, status, errorMessage })
          const verificationStep = verificationSteps.length - 1
          this.setState({
            verificationStep,
            verificationSteps
          })
        }
      })
      this.setState({
        verificationResult
      })
    } catch (e) {
      console.error(e)
    }
  }

  isValid () {
    const { verificationSteps } = this.state
    return verificationSteps.every(step => step.status === 'success')
  }

  async componentDidMount () {
    let { src } = this.props
    if (typeof src === 'string') {
      try {
        const response = await window.fetch(src)
        src = await response.json()
      } catch (e) {
        this.setState({
          error: e.message
        })
      }
    }
    if (typeof src === 'object') {
      try {
        const certificate = new Certificate(src)
        this.setState({
          src,
          certificate
        })
      } catch (e) {
        this.setState({
          error: e.message
        })
      }
    }
  }

  render () {
    const { classes, color, backgroundColor, image } = this.props
    const { src, error, certificate, verificationStep, verificationSteps, verificationResult, tab } = this.state

    if (error) {
      return (
        <Typography color='error'>
          {error}
        </Typography>
      )
    }

    if (!src) {
      return <CircularProgress />
    }

    return (
      <div className={classes.wrapper}>
        <div
          className={classes.header}
          style={{
            color: color,
            backgroundColor: backgroundColor
          }}
        >
          <img src={image} />
          <Tabs
            className={classes.tabs}
            value={tab}
            onChange={(event, value) => this.handleTabChange(event, value)}
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
        {
          tab === 0 && (
            <div style={{ padding: 8 * 3 }}>
              <div className={classes.tab}>
                {src.displayHtml && <div dangerouslySetInnerHTML={{ __html: src.displayHtml.replace(/(<? *script)/gi, 'illegalscript') }} />}
                {!src.displayHtml && (
                  <div>
                    <img src={certificate.certificateImage} className={classes.image} />
                    <Typography paragraph variant='h1'>
                      {certificate.title}
                    </Typography>
                    <Typography paragraph variant='subheading'>
                      {certificate.subtitle}
                    </Typography>
                    <Typography paragraph variant='caption'>
                      Awarded on <Timestamp time={src.issuedOn.toString()} format='full' /> to
                    </Typography>
                    <Typography paragraph variant='title'>
                      {certificate.name}
                    </Typography>
                    <Typography paragraph>
                      {certificate.description}
                    </Typography>
                    <Typography paragraph variant='caption'>
                      Issued by
                    </Typography>
                    <img src={certificate.sealImage} className={classes.image} />
                    <Typography paragraph variant='title'>
                      {certificate.issuer.name}
                    </Typography>
                    <Typography paragraph>
                      {certificate.issuer.description}
                    </Typography>
                    <Typography paragraph>
                      {certificate.issuer.email}
                    </Typography>
                  </div>
                )}
              </div>
            </div>
          )
        }
        {
          tab === 1 && (
            <div style={{ padding: 8 * 3 }}>
              {
                verificationResult && (
                  <div className={classes.verificationResult}>
                    <>
                      <Typography variant='h3'>
                        {verificationResult === 'success' ? 'Valid certificate' : 'Invalid certificate'}
                      </Typography>
                      <Button className={classes.button} variant='contained' color='primary' href={certificate.transactionLink}>
                        See blockchain transaction
                      </Button>
                    </>
                  </div>
                )
              }
              <Stepper activeStep={verificationStep} orientation='vertical'>
                {
                  verificationSteps.map((step, index) => {
                    return (
                      <Step key={index}>
                        <StepLabel error={step.status === 'failure'}>
                          {step.label}
                        </StepLabel>
                        {
                          step.status === 'failure' && step.errorMessage !== '' && (
                            <StepContent>
                              <Typography color='error'>
                                {step.errorMessage}
                              </Typography>
                            </StepContent>
                          )
                        }
                      </Step>
                    )
                  })
                }
              </Stepper>
            </div>
          )
        }
      </div>
    )
  }
}

Blockcerts.defaultProps = {
  color: 'white',
  backgroundColor: '#02112a',
  image: blockcertsLogo
}

Blockcerts.propTypes = {
  src: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ]).isRequired,
  image: PropTypes.string,
  color: PropTypes.string,
  backgroundColor: PropTypes.string
}

export default withStyles(styles)(Blockcerts)
