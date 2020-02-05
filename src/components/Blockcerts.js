import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Certificate } from 'cert-verifier-js'
import Timestamp from 'react-timestamp'
import {
  Button,
  CircularProgress,
  Dialog, DialogContent, DialogActions,
  ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails,
  Grid,
  Paper,
  Stepper, Step, StepLabel,
  Typography,
  withStyles
} from '@material-ui/core'
import { CheckCircle, ExpandMore, Link, Warning } from '@material-ui/icons'

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
  textCenter: {
    color: '#ffffff',
    textAlign: 'center'
  },
  verificationResult: {
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: theme.spacing(4)
  },
  verificationResultCaption: {
    color: '#ffffff',
    display: 'block',
    wordWrap: 'break-word'
  },
  buttons: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4)
  },
  buttonOutlined: {
    borderColor: '#ffffff',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)'
    },
    marginBottom: theme.spacing(2)
  },
  buttonIcon: {
    marginRight: theme.spacing(1)
  },
  dialogContentRoot: {
    textAlign: 'justify'
  },
  reactJson: {
    marginBottom: theme.spacing(1)
  },
  expansionPanelDetailsRoot: {
    display: 'block'
  },
  buttonMargin: {
    marginBottom: theme.spacing(2)
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
      this.handleVerifyCertificate()
    }
  }

  render () {
    const { classes } = this.props
    const { src, error, certificate, verificationSteps, verificationStep, verificationResult, dialogOpen } = this.state

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
                      <Typography variant='h6' classes={{ root: classes.textCenter }}>Issuer</Typography>
                      <Typography paragraph classes={{ root: classes.textCenter }}>{src.badge.issuer.name}</Typography>
                      <Typography variant='h6' classes={{ root: classes.textCenter }}>Recipient</Typography>
                      <Typography paragraph classes={{ root: classes.textCenter }}>{src.recipientProfile.name}</Typography>
                      <Typography variant='h6' classes={{ root: classes.textCenter }}>Date</Typography>
                      <Typography paragraph classes={{ root: classes.textCenter }}>{src.issuedOn}</Typography>
                      <div className={classes.buttons}>
                        <Button
                          onClick={() => this.handleDialog()}
                          color='inherit'
                          size='small'
                          variant='outlined'
                          classes={{
                            label: classes.text,
                            outlined: classes.buttonOutlined
                          }}
                        >
                          Is it really valid?
                        </Button>
                        <Button
                          href='https://github.com/guix77/react-blockcerts#react-blockcerts'
                          target='react-blockcerts'
                          rel='noopener noreferrer'
                          color='inherit'
                          size='small'
                          variant='outlined'
                          classes={{
                            label: classes.text,
                            outlined: classes.buttonOutlined
                          }}
                        >
                          About this viewer
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
                <Typography variant='h4' gutterBottom paragraph>Is this certificate really valid?</Typography>
                <Typography gutterBottom paragraph>{`You have to check that the following URL is really hosted on the official Issuer's website: ${certificate.issuer.id}`}</Typography>
                <Typography gutterBottom paragraph>{`You also have to decide if the current website can be trusted (it's not necessarly the same as the one above): ${window.location.origin}`}</Typography>
                <ExpansionPanel>
                  <ExpansionPanelSummary expandIcon={<ExpandMore />}>
                    <Typography>I want to know more!</Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails classes={{ root: classes.expansionPanelDetailsRoot }}>
                    <Typography variant='h4' gutterBottom paragraph>The verification process</Typography>
                    <Typography gutterBottom paragraph>Let's display again the verification steps:</Typography>
                    <Stepper
                      activeStep={-1}
                      orientation='vertical'
                    >
                      {
                        verificationSteps.map((step, index) => {
                          return (
                            <Step key={index}>
                              <StepLabel
                                error={step.status === 'failure'}
                              >
                                {step.label}
                              </StepLabel>
                            </Step>
                          )
                        })
                      }
                    </Stepper>
                    <Typography gutterBottom paragraph>Not so easy, right? Let's try to explain this easily.</Typography>
                    <Typography variant='h5' gutterBottom paragraph>The transaction</Typography>
                    <Typography gutterBottom paragraph>Any action on any blockchain is executed by submitting a transaction. In this case, the Issuer signed a transaction to certify this certificate and we need to check if this transaction exists to validate the certificate.</Typography>
                    <Typography variant='h5' gutterBottom paragraph>The identity problem on the blockchain</Typography>
                    <Typography gutterBottom paragraph>So the Issuer, a university for instance, could just have an account on the blockchain, and add certificates. The problem is in most blockchains, accounts are anonymous. We can only know that a certain "strange" address like 0xabcd... did something on the blockchain, but not know who it is. That's why all Issuers must declare their official blockchain address on their official website, so it can be later verified that the address that signed this transaction belongs to the university. This is what we call the "Issuer profile".</Typography>
                    <Typography gutterBottom paragraph>{`This certificate Issuer profile URL is ${src.badge.issuer.id}`}</Typography>
                    <Button
                      href={src.badge.issuer.id}
                      target='issuer'
                      rel='noopener noreferrer'
                      startIcon={<Link />}
                      color='primary'
                      className={classes.buttonMargin}
                    >
                      Click to open Issuer profile URL and see its content.
                    </Button>
                    <Typography gutterBottom paragraph>If you clicked, notice the "publicKey": it's the blockchain address of the Issuer!</Typography>
                    <Typography gutterBottom paragraph>Unfortunately, currently, there is a weakness in the Blockcerts 2.0 standard that can be exploited by a hacker to pretend to be an Issuer that she / he IS NOT, in hosting a fake Issuer profile on his own server. That's why we asked you to check that this URL is really on the official Issuer's website. There are very interesting projects currently trying to fix that issue in a near future, but so far it's not yet fixed.</Typography>
                    <Typography variant='h5' gutterBottom paragraph>The data problem on the blockchain</Typography>
                    <Typography gutterBottom paragraph>So now that the identity problem is solved, let's just add the certificate on the blockchain, right? Well, it's not that simple. Writing data on blockchain is extremely expensive, and on the Bitcoin blockchain, not even possible for complex data such as certificates. So instead of storing all the certificate data on the blockchain, we just store what we call their "hash" in computer science.</Typography>
                    <Typography gutterBottom paragraph>See the fridge in your kitchen? Instead of certifying all the infinite complex arrangement of atoms it is made of, we just certify its serial number.</Typography>
                    <Typography gutterBottom paragraph>Now it will be possible to check that the hash of this certificate was recorded in the blockchain transaction and therefore, verify the certificate.</Typography>
                    <Typography variant='h5' gutterBottom paragraph>Mass issuance of certificates</Typography>
                    <Typography gutterBottom paragraph>All right, we solved the data problem too, let's store a certificate hash on the blockchain! Well... we could. But what if want to issue a degree to 1000 students? Instead of repeating the process for each student, we would like to issue all those certificates at the same time. To do this, we use a cryptography concept called "Merle tree".</Typography>
                    <Typography gutterBottom paragraph>Picture yourself an oak tree. Instead of certifying each leaf, we can just certify the root of the oak tree. We can later proove that a given leaf belongs to this exact tree, and therefore that this leaf is certified.</Typography>
                    <Typography variant='h5' gutterBottom paragraph>The immutability "problem"</Typography>
                    <Typography gutterBottom paragraph>As if it wasn't complex enough, by blockchain design it is impossible to remove a transaction. So the Issuer can not "unsign" a certificate. Instead, we can use a revocation list and / or expiration dates.</Typography>
                  </ExpansionPanelDetails>
                </ExpansionPanel>
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
