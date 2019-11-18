import React from 'react'
import {
  AppBar,
  Button,
  Grid,
  Toolbar,
  Typography,
  withStyles
} from '@material-ui/core'

import Blockcerts from '../../src/components/Blockcerts'
import talaoCertificateImage from './assets/images/talaoCertificateImage'

const styles = {
  title: {
    flex: 1
  }
}

const App = ({ classes }) => {
  return (
    <>
      <AppBar position='sticky'>
        <Toolbar>
          <Typography variant='h6' classes={{ root: classes.title }}>
            Examples for react-blockcerts
          </Typography>
          <Button
            href='https://github.com/guix77/react-blockcerts'
            target='_blank'
            rel='noopener noreferrer'
            color='inherit'
          >
            GitHub
          </Button>
        </Toolbar>
      </AppBar>
      <Grid container>
        <Grid item xs={12}>
          <Blockcerts
            src='https://raw.githubusercontent.com/guix77/blockcerts-certificates/master/ethereum/ropsten/certificates/talao/duveau-improve-talao-certificates.json'
            image={talaoCertificateImage}
            color='#282828'
            backgroundColor='#edecec'
          />
        </Grid>
      </Grid>
    </>
  )
}

export default withStyles(styles)(App)
