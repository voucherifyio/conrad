import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppMainMenu from './AppMainMenu'
import QuotesComponent from './QuotesComponent'
import GoogleAuth from './GoogleAuth'
import GoogleSpreadsheet from './GoogleSpreadsheet'
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import AddEditQuoteForm from './AddEditQuoteForm'
import Icon from '@material-ui/core/Icon';
import googleSignInSrc from './img/btn_google_signin_dark_normal_web.png'
import googleSignInPressedSrc from './img/btn_google_signin_dark_pressed_web.png'

const styles = {
  app: {
    height: "100vh"
  },
  pageContainer: {
    height: 'calc(100vh - 56px)'
  },
  centerFlexColumnContainer: {
    display: "flex",
    height: '100%',
    justifyContent: "center",
    alignItems: 'center',
    flexDirection: 'column'
  },
  addButton: {
    position: 'fixed',
    right: 35,
    bottom: 35
  },
  googleSignInBtn: {
    cursor: 'pointer',
    width: 191,
    height:46,
    backgroundImage: `url(${googleSignInSrc})`,
    "&:hover": {
      backgroundImage: `url(${googleSignInPressedSrc})`,
    }
  }
};

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showAddEditDialog: false,
      quoteToEdit: false
    }
    this.addButtonClick = this.addButtonClick.bind(this)
    this.closeAddQuoteDialog = this.closeAddQuoteDialog.bind(this)
    this.editQuote = this.editQuote.bind(this)
  }

  addButtonClick() {
    this.setState({ showAddEditDialog: true })
  }

  editQuote(quote){
    this.setState({ 
      showAddEditDialog: true,
      quoteToEdit: quote
     })
  }

  closeAddQuoteDialog() {
    this.setState({ 
      showAddEditDialog: false,
      quoteToEdit: false
    })
  }

  render() {
    const { classes } = this.props

    return (
      <GoogleAuth render={googleAuthProps => (
        <div className={classes.app}>
          <AppMainMenu
            userLogged={googleAuthProps.userLogged}
            userProfileImg={googleAuthProps.userProfileImg}
            userName={googleAuthProps.userName}
            handleAuthClick={googleAuthProps.handleAuthClick}
          />

          {googleAuthProps.initGoogleApiLoading ? (
            <div className={classes.pageContainer}>
              <div className={classes.centerFlexColumnContainer} >
                <h2>Loading...</h2>
                <LinearProgress style={{ width: '80%' }} />
              </div>
            </div>
          ) : (
              <div className={classes.pageContainer}>
                {googleAuthProps.userLogged ? (
                  <GoogleSpreadsheet render={(spreadsheetProps) => (
                    <React.Fragment>
                      <QuotesComponent
                        quotes={spreadsheetProps.quotes}
                        isLoading={spreadsheetProps.initGoogleSpreadsheetDocPending}
                        search={spreadsheetProps.search}
                        editQuote={this.editQuote}
                      />
                      <AddEditQuoteForm
                        key={'addeditform-for-quote-'+this.state.quoteToEdit? this.state.quoteToEdit.id:'new-one'}
                        open={this.state.showAddEditDialog}
                        onClose={this.closeAddQuoteDialog}
                        quote={this.state.quoteToEdit}
                        onAddSubmit={spreadsheetProps.add}
                        onEditSubmit={spreadsheetProps.edit}
                      />
                      <Button variant="fab" color="secondary" aria-label="edit" className={classes.addButton} onClick={this.addButtonClick}>
                        <Icon>add_icon</Icon>
                      </Button>
                    </React.Fragment>
                  )} />
                ) : (
                    <div className={classes.centerFlexColumnContainer} >
                       <div className={classes.googleSignInBtn} onClick={googleAuthProps.handleAuthClick}></div>
                    </div>
                  )}
              </div>
            )}
        </div>
      )} />
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);
