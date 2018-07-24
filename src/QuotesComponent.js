import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import copy from 'copy-to-clipboard';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import Divider from '@material-ui/core/Divider';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const styles = {
  card: {
    width: "100%",
    paddingBottom: 12

  },
  pos: {
    marginBottom: 12,
  },
  cardContainer: {
    overflowX: "hidden",
    overflowY: "scroll",
    height: 'calc(100vh - 128px)',
    padding: '0 12px'
  },
  cardContainerFlex: {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingTop: 25,
    alignItems: 'center',
  },
  searchContainer: {
    display: 'flex',
    justifyContent: 'center',
    color: "white",
    padding: '0 12px'
  },

  textField: {
    width: "100%"
  },
  pageContainer: {},
  tagsContainers: {
    flexGrow: 1,
    width: '100%',
    color: "gray",
    fontSize: 12,
    paddingTop: 10
  },
  expansionPanelSummary: {
    flexWrap: 'wrap'
  },
  note: {
    fontSize: 14,
  },
  expansionPanelDetailsRow: {
    display: 'flex',
    color: "gray",
    fontSize: 12,
    paddingTop: 10
  },
  expansionPanelDetailsRowLabel: {
    fontWeight: 700,
    width: 90,
  },
  quoteTite: {
    marginRight: 22,
    width: "100%"
  }

};

class QuotesComponent extends Component {

  constructor(props) {
    super(props)
    this.state = {
      inputSearch: '',
      searchResult: [],
      copyToClipboardConfirmationOpen: false,
      limit: 200,
      page: 0
    }
    this.handleSearchInputChange = this.handleSearchInputChange.bind(this)
    this.closeCopyConfirmation = this.closeCopyConfirmation.bind(this)
    this.openCopyConfirmation = this.openCopyConfirmation.bind(this)
    this.copyQueryToClipboard = this.copyQueryToClipboard.bind(this)
    this.nextPage = this.nextPage.bind(this)
    this.prevPage = this.prevPage.bind(this)
    this.searchRef = false
  }

  copyQueryToClipboard(queryText) {
    copy(queryText)
    this.openCopyConfirmation()
  }

  closeCopyConfirmation() {
    this.setState({
      copyToClipboardConfirmationOpen: false
    })
  }

  openCopyConfirmation() {
    this.setState({
      copyToClipboardConfirmationOpen: true
    })
  }

  handleSearchInputChange(event) {
    this.setState({
      inputSearch: event.target.value,
      searchResult: this.props.search(event.target.value)
    })
  }

  nextPage() {
    this.setState({
      page: this.state.page + 1
    })

    if (this.searchRef) {
      this.searchRef.scrollIntoView()
    }
  }

  prevPage() {
    if (this.state.page > 0) {
      this.setState({
        page: this.state.page - 1
      })
    }
    if (this.searchRef) {
      this.searchRef.scrollIntoView()
    }
  }


  render() {
    const { classes } = this.props

    let quotes = this.props.quotes.map(e => e)
    if (this.state.inputSearch.length > 0) {
      quotes = this.state.searchResult
    }

    quotes.reverse()
    let pageTotal = Math.ceil(quotes.length / this.state.limit)

    let quotesPage = quotes.slice(this.state.page * this.state.limit, this.state.page * this.state.limit + this.state.limit)


    return (
      <div className={classes.pageContainer}>

        <div ref={e => this.searchRef = e} className={classes.searchContainer}>
          <TextField
            id="searchInput"
            label="Search"
            className={classes.textField}
            value={this.state.inputSearch}
            onChange={this.handleSearchInputChange}
            margin="normal"

          />
        </div>


        {this.props.isLoading ? (
          <div className={classes.cardContainerFlex}>
            <CircularProgress className={classes.progress} />
          </div>
        ) : (
            <div className={classes.cardContainer}>
              <div className={classes.cardContainerFlex}>

                {this.state.page > 0 ? (<Button onClick={this.prevPage} size="small"> {this.state.page + 1}/{pageTotal} Previous results</Button>) : null}
                {quotesPage.map(q => (
                  <div key={'card-' + q.id} className={classes.card}>
                    <ExpansionPanel>
                      <ExpansionPanelSummary classes={{ content: classes.expansionPanelSummary }} expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="subheading" className={classes.quoteTite}>{q.quote}</Typography>
                        {q.tags && q.tags.length && q.tags.length > 0 ? (
                          <div className={classes.expansionPanelDetailsRow}>
                            <div className={classes.expansionPanelDetailsRowLabel}> tags: </div>
                            <div>{q.tags.join(', ')}</div>
                          </div>
                        ) : null}

                      </ExpansionPanelSummary>
                      <ExpansionPanelDetails>
                        <div >
                          {q.author ? (
                            <div className={classes.expansionPanelDetailsRow} >
                              <div className={classes.expansionPanelDetailsRowLabel}> author: </div>
                              <div>{q.author}</div>
                            </div>
                          ) : null}

                          {q.categories && q.categories.length && q.categories.length > 0 ? (
                            <div className={classes.expansionPanelDetailsRow} >
                              <div className={classes.expansionPanelDetailsRowLabel}>categories: </div>
                              <div>{q.categories ? q.categories.join(', ') : '-'}</div>
                            </div>
                          ) : null}

                          {q.note ? (
                            <div className={classes.expansionPanelDetailsRow} >
                              <div className={classes.expansionPanelDetailsRowLabel}>note: </div>
                              <div>{q.note}</div>
                            </div>
                          ) : null}

                        </div>


                      </ExpansionPanelDetails>
                      <Divider />
                      <ExpansionPanelActions>
                        {/* <Button size="small">Remove</Button> */}
                        <Button onClick={() => { this.props.editQuote(q) }} size="small">Edit</Button>
                        <Button onClick={() => { this.copyQueryToClipboard(q.quote) }} size="small" color="primary">Copy to clipboard</Button>
                      </ExpansionPanelActions>
                    </ExpansionPanel>
                  </div>
                ))}
                {(this.state.limit + this.state.page * this.state.limit) < quotes.length ? (
                  <Button onClick={this.nextPage} size="small"> {this.state.page + 1}/{pageTotal} Next results</Button>

                ) : null}
              </div>
            </div>
          )
        }



        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={this.state.copyToClipboardConfirmationOpen}
          autoHideDuration={6000}
          onClose={this.closeCopyConfirmation}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">Copied to clipboard</span>}
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              className={classes.close}
              onClick={this.closeCopyConfirmation}
            >
              <CloseIcon />
            </IconButton>,
          ]}
        />

      </div >
    );
  }
}

QuotesComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  quotes: PropTypes.array.isRequired
};

export default withStyles(styles)(QuotesComponent);
