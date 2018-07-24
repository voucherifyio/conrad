import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import Avatar from '@material-ui/core/Avatar';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import logoSrc from './img/logo.png'

const styles = {
  appTitle: {
    color: "white"
  },
  logInOutButton: {
    color: 'white'
  },
  aboutButton: {
    color: 'white'
  },
  aboutLink: {
    textDecoration: 'none'
  },
  userMenuIcon: {
    color: 'white',
  },
  avatar: {
    cursor: 'pointer'
  },
  userMenu: {
  },
  logoImg: {
    marginRight: 12
  }
};

class AppMainMenu extends Component {

  state = {
    menuAnchor: null,
  };

  handleMenuClick = event => {
    this.setState({ menuAnchor: event.currentTarget });
  };

  handleMenuClose = () => {
    this.setState({ menuAnchor: null });
  };

  handleLogout = () => {
    this.props.handleAuthClick()
    this.handleMenuClose()
  }

  handleAboutClick = () => {
    this.handleMenuClose()
    let win = window.open(process.env.REACT_APP_ABOUT_URL, '_blank');
    win.focus()
  }

  render() {
    const { classes } = this.props
    return (
      <AppBar position="static" color="default" style={{ backgroundColor: '#f4b435' }}>
        <Toolbar>
          <img className={classes.logoImg} src={logoSrc} alt="Conrad" />
          <Typography style={{ flex: 1 }} classes={{ root: classes.appTitle }} variant="title" color="inherit">
            Conrad
            </Typography>
          {this.props.userLogged ? (
            <React.Fragment>
              <Tooltip id="tooltip-icon" title={this.props.userName}>
                <Avatar onClick={this.handleMenuClick} alt={this.props.userName} src={this.props.userProfileImg} className={classes.avatar} />
              </Tooltip>
              <IconButton color="primary" onClick={this.handleMenuClick} className={classes.button} component="span">
                <MoreVertIcon  className={classes.userMenuIcon} />
              </IconButton>
              <Menu
                anchorEl={this.state.menuAnchor}
                open={Boolean(this.state.menuAnchor)}
                onClose={this.handleMenuClose}
                className={classes.userMenu}
              >
                <MenuItem onClick={this.handleAboutClick}>
                  About
                </MenuItem>
                <MenuItem onClick={this.handleLogout}>
                  Logout
                </MenuItem>
              </Menu>
            </React.Fragment>


          ) : null}

          {/* <Button className={classes.aboutButton} > About </Button></a> */}
          {!this.props.userLogged ? (
            <Button className={classes.logInOutButton} onClick={this.props.handleAuthClick}>Log in </Button>
          ) : null}

        </Toolbar>
      </AppBar>
    );
  }
}

AppMainMenu.propTypes = {
  classes: PropTypes.object.isRequired,
  userLogged: PropTypes.bool.isRequired,
  userProfileImg: PropTypes.string.isRequired,
  userName: PropTypes.string.isRequired,
  handleAuthClick: PropTypes.func.isRequired
};

export default withStyles(styles)(AppMainMenu);
