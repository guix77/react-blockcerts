import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Certificate } from 'cert-verifier-js'
import Timestamp from 'react-timestamp'
import ReactJson from 'react-json-view'
import {
  Button,
  CircularProgress,
  Dialog, DialogContent, DialogActions,
  Grid,
  Paper,
  Stepper, Step, StepLabel,
  Typography,
  withStyles
} from '@material-ui/core'
import {
  CheckCircle,
  Link,
  Warning
} from '@material-ui/icons'

import blockcertsLogo from '../assets/images/blockcertsLogo'

const styles = theme => ({
  root: {
    overflow: 'hidden',
    padding: theme.spacing(4),
    backgroundColor: '#02112a'
  },
  logo: {
    textAlign: 'center',
    marginBottom: theme.spacing(8)
  },
  stepperRoot: {
    paddingLeft: 0,
    paddingRight: 0,
    backgroundColor: '#02112a'
  },
  step: {
    color: '#ffffff !important'
  },
  text: {
    color: '#ffffff'
  },
  verificationResult: {
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: theme.spacing(4)
  },
  verificationResultCaption: {
    color: '#ffffff',
    textAlign: 'justify',
    display: 'block',
    marginBottom: theme.spacing(4)
  },
  buttons: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: theme.spacing(4)
  },
  buttonOutlined: {
    borderColor: '#ffffff',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)'
    },
    marginBottom: theme.spacing(4)
  },
  buttonIcon: {
    marginRight: theme.spacing(1)
  },
  dialogContentRoot: {
    textAlign: 'justify'
  },
  reactJson: {
    marginBottom: theme.spacing(1)
  }
})

class Blockcerts extends Component {
  constructor (props) {
    super(props)
    this.state = {
      src: null,
      error: null,
      certificate: null,
      verificationSteps: [],
      verificationStep: null,
      verificationResult: null,
      dialogOpen: false
    }
  }

  handleDialog () {
    let { dialogOpen } = this.state
    dialogOpen = !dialogOpen
    this.setState({ dialogOpen })
  }

  async handleVerifyCertificate () {
    console.log('verification')
    const { certificate, verificationSteps } = this.state
    try {
      const verificationResult = await certificate.verify(({ code, label, status, errorMessage }) => {
        if (status !== 'starting') {
          verificationSteps.push({ code, label, status, errorMessage })
          const verificationStep = verificationSteps.length - 1
          this.setState({
            verificationSteps,
            verificationStep
          })
        }
      })
      if (verificationResult.status === 'success') {
        this.setState({
          verificationStep: 999
        })
      }
      this.setState({
        verificationResult
      })
    } catch (e) {
      this.setState({
        error: e.message
      })
    }
  }

  async componentDidMount () {
    if (!this.state.certificate) {
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
        const certificate = await new Certificate(src)
        this.setState({
          src,
          certificate
        })
      }
    }
    if (this.state.certificate) {
      console.log('there is a cert')
      this.handleVerifyCertificate()
    }
  }

  render () {
    const { classes } = this.props
    const { src, error, certificate, verificationSteps, verificationStep, verificationResult, dialogOpen } = this.state
    console.log(src, certificate)

    if (error) {
      return (
        <Typography color='error'>
          {error}
        </Typography>
      )
    }

    if (!src || !certificate) {
      return <CircularProgress />
    }

    return (
      <div className={classes.root}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={9}>
            <Paper>
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
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <div className={classes.logo}>
              <a
                href='https://www.blockcerts.org/about.html'
                target='_blank'
                rel='noopener noreferrer'
                color='inherit'
              >
                <img src={blockcertsLogo} />
              </a>
            </div>
            {
              verificationResult
                ? verificationResult.status === 'success'
                  ? (
                    <>
                      <Typography variant='h4' classes={{ root: classes.verificationResult }}>
                        Valid <CheckCircle />
                      </Typography>
                      <Typography variant='caption' gutterBottom classes={{ root: classes.verificationResultCaption }}>
                        Due to current Blockcerts standard technical limitations, to be certain that this certificate is not a fake, please search for the official's issuer's website and look for a page that declares the following exact string as its "Blockcerts issuer profile": {certificate.issuer.id}
                      </Typography>
                      <div className={classes.buttons}>
                        <Button
                          href={certificate.transactionLink}
                          target='_blank'
                          rel='noopener noreferrer'
                          color='inherit'
                          variant='outlined'
                          classes={{
                            label: classes.text,
                            outlined: classes.buttonOutlined
                          }}
                        >
                          <Link classes={{ root: classes.buttonIcon }} />Transaction
                        </Button>
                        <Button
                          onClick={() => this.handleDialog()}
                          color='inherit'
                          variant='outlined'
                          classes={{
                            label: classes.text,
                            outlined: classes.buttonOutlined
                          }}
                        >
                          <Link classes={{ root: classes.buttonIcon }} />Explanation
                        </Button>
                        <Button
                          href='https://github.com/guix77/react-blockcerts'
                          target='_blank'
                          rel='noopener noreferrer'
                          color='inherit'
                          variant='outlined'
                          classes={{
                            label: classes.text,
                            outlined: classes.buttonOutlined
                          }}
                        >
                          <Link classes={{ root: classes.buttonIcon }} />Source code
                        </Button>
                      </div>
                    </>
                  )
                  : (
                    <Typography variant='h4' classes={{ root: classes.verificationResult }}>
                      Invalid <Warning />
                    </Typography>
                  )
                : (
                  <Typography variant='h4' classes={{ root: classes.verificationResult }}>
                    Verifying <CircularProgress size={22} classes={{ root: classes.text }} />
                  </Typography>
                )
            }
            {
              (!verificationResult || verificationResult.status !== 'success') && (
                <Stepper
                  activeStep={verificationStep}
                  orientation='vertical'
                  classes={{ root: classes.stepperRoot }}
                >
                  {
                    verificationSteps.map((step, index) => {
                      return (
                        <Step key={index}>
                          <StepLabel
                            error={step.status === 'failure'}
                            classes={{ label: classes.step }}
                            StepIconProps={{
                              classes: { root: classes.step }
                            }}
                          >
                            {step.label}
                          </StepLabel>
                        </Step>
                      )
                    })
                  }
                </Stepper>
              )
            }
          </Grid>
        </Grid>
        {
          verificationResult && verificationResult.status === 'success' && (
            <Dialog
              open={dialogOpen}
              onClose={() => this.handleDialog()}
              fullWidth
              maxWidth='md'
            >
              <DialogContent classes={{ root: classes.dialogContentRoot }}>
                <Typography variant='h5' gutterBottom>This certificate</Typography>
                <Typography gutterBottom>This certificate can either be on your device, attached in an email or hosted online. The place where it is does not matter : if this certificate is valid, it will be valid anywhere. And if someone tries to create a modified version, the fake content will be displayed, but the verification process will fail.</Typography>
                <Typography gutterBottom>Here you can explore this certificate data if you want:</Typography>
                <div className={classes.reactJson}>
                  <ReactJson src={src} collapsed />
                </div>
                <Typography variant='h5' gutterBottom>The identity problem on the blockchain</Typography>
                <Typography gutterBottom>A university, that we call "Issuer", could just have an account on the blockchain, and add certificates. The problem is that blockchain accounts are anonymous. We can only know that a certain address 0xabcd... did something on the blockchain, but not know who it is. That's why all Issuers must declare their official blockchain address on their official website. This is what we call the "Issuer profile".</Typography>
                <Typography variant='h5' gutterBottom>The data problem on the blockchain</Typography>
                <Typography gutterBottom>So now that the identity problem is solved, let's just add the certificate on the blockchain, right? Well, it's not that simple. Writing data on blockchain is extremely expensive, and on the Bitcoin blockchain, not even possible for complex data such as certificates. So instead of storing all the certificate data on the blockchain, we just store what we call their "hash" in computer science.</Typography>
                <Typography gutterBottom>See the fridge in your kitchen? Instead of certifying all the infinite complex arrangement of atoms it is made of, we just certify its serial number.</Typography>
                <Typography variant='h5' gutterBottom>Mass issuance of certificates</Typography>
                <Typography gutterBottom>All right, we solved the data problem too, let's store a certificate hash on the blockchain! Well... we could. But what if want to issue a degree to 1000 students? Instead of repeating the process for each student, we would like to issue all those certificates at the same time. To do this, we use a cryptography concept called "Merle tree".</Typography>
                <Typography gutterBottom>Picture yourself an oak tree. Instead of certifying each leaf, we can just certify the root of the oak tree. We can later proove that a given leaf belongs to this exact tree, and therefore that this leaf is certified.</Typography>
                <Typography variant='h5' gutterBottom>To know more</Typography>
                <Typography>To know more, you can check the official Blockcerts site, forums and GitHub repositories.</Typography>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => this.handleDialog()}
                >
                  Close
                </Button>
              </DialogActions>
            </Dialog>
          )
        }
      </div>
    )
  }
}

Blockcerts.propTypes = {
  src:
    PropTypes
      .oneOfType([
        PropTypes.string,
        PropTypes.object
      ])
      .isRequired
}

export default withStyles(styles)(Blockcerts)
