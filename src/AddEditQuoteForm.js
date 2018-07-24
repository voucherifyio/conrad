import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const styles = {
  textField: {
    marginTop: 12,
    marginBottom: 12
  },

  addButton: {
  }
};

class AddEditQuoteForm extends Component {

  constructor(props) {
    super(props)
    this.state = {
      id: props.quote? props.quote.id:false,
      quote: props.quote? props.quote.quote:'',
      author: props.quote && props.quote.author? props.quote.author:'',
      note: props.quote && props.quote.note? props.quote.note:'',
      tags: props.quote && props.quote.tags? props.quote.tags:'',
      categories: props.quote && props.quote.categories? props.quote.categories:'',
    }
    this.handleQuoteChange = this.handleQuoteChange.bind(this)
    this.handleAuthorChange = this.handleAuthorChange.bind(this)
    this.handleNoteChange = this.handleNoteChange.bind(this)
    this.handleTagsChange = this.handleTagsChange.bind(this)
    this.handleCategoriesChange = this.handleCategoriesChange.bind(this)
    this.submitForm = this.submitForm.bind(this)
  }

  handleQuoteChange(event) {
    this.setState({ quote: event.target.value })
  }

  handleAuthorChange(event) {
    this.setState({ author: event.target.value })
  }

  handleNoteChange(event) {
    this.setState({ note: event.target.value })
  }

  handleTagsChange(event) {
    this.setState({ tags: event.target.value })
  }

  handleCategoriesChange(event) {
    this.setState({ categories: event.target.value })
  }

  submitForm(e){
    e.preventDefault()

    if(this.state.id){
      this.props.onEditSubmit({...this.state})
    }else{
      this.props.onAddSubmit({...this.state})
    }
    this.props.onClose()
    this.setState({
      quote: '',
      author: '',
      note: '',
      tags: '',
      categories:'',
    })
  }

  render() {
    const { classes, quote } = this.props
    return (

      <Dialog
        open={this.props.open}
        onClose={this.props.onClose}
        aria-labelledby="form-dialog-title"
      >
        <form action="" onSubmit={this.submitForm}>
          <DialogTitle id="form-dialog-title"> {quote? "Edit": "Add new"} quote</DialogTitle>
          <DialogContent>
            <DialogContentText>
              We will save this quote in Google Spreadsheet located in main folder of your Google Drive.
            </DialogContentText>

            <TextField
              autoFocus
              id="quote"
              label="Quote"
              type="text"
              fullWidth
              required
              onChange={this.handleQuoteChange}
              value={this.state.quote}
              className={classes.textField} 
            />

            <TextField
              id="note"
              label="Note"
              type="text"
              fullWidth
              value={this.state.note}
              onChange={this.handleNoteChange}
              className={classes.textField}
            />
            <TextField
              id="author"
              label="Author"
              type="text"
              fullWidth
              value={this.state.author}
              onChange={this.handleAuthorChange}
              className={classes.textField}

            />
            <TextField
              id="categories"
              label="Categories"
              type="text"
              fullWidth
              value={this.state.categories}
              onChange={this.handleCategoriesChange}
              className={classes.textField}
            />
            <TextField
              id="tags"
              label="Tags"
              type="text"
              fullWidth
              value={this.state.tags}
              onChange={this.handleTagsChange}
              className={classes.textField}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.props.onClose} color="primary">
              Cancel
            </Button>
            <Button type='submit' color="secondary">
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    );
  }
}

AddEditQuoteForm.propTypes = {
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onAddSubmit: PropTypes.func.isRequired,
  onEditSubmit: PropTypes.func.isRequired,
};

export default withStyles(styles)(AddEditQuoteForm);
