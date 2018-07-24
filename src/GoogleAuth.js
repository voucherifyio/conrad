import React from 'react'
import load from 'load-script'

class GoogleAuth extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            userLogged: false,
            userName: '',
            userProfileImg: '',
            initGoogleApiLoading: true,
          }
        this.initGoogleApi()
        this.initGoogleApi = this.initGoogleApi.bind(this)
        this.handleAuthClick = this.handleAuthClick.bind(this)
        this.GoogleAuth = false
    }


    handleAuthClick() {
        if (this.GoogleAuth.isSignedIn.get()) {
            this.GoogleAuth.signOut();
        } else {
            this.GoogleAuth.signIn();
        }
    }

    initGoogleApi() {
        
        load('https://apis.google.com/js/api.js', () => {
            window.gapi.load('client:auth2', () => {
                window.gapi.client.init({
                    'apiKey': '',
                    'clientId': process.env.REACT_APP_GOOGLE_CLIENT_ID,
                    'scope': 'https://www.googleapis.com/auth/drive.file',
                    'discoveryDocs': [
                        'https://sheets.googleapis.com/$discovery/rest?version=v4',
                        "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"
                    ]
                }).then(() => {

                    this.GoogleAuth = window.gapi.auth2.getAuthInstance();
                    this.GoogleAuth.isSignedIn.listen(updateSigninStatus);
                    initSigninStatus()
                });
            });


            let updateSigninStatus = (isSignedIn, userName, userProfileImg) => {
                let newStatus = {
                    userLogged: isSignedIn,
                    userName: '',
                    userProfileImg: '',
                    initGoogleApiLoading: false
                }

                if (isSignedIn) {
                    var user = this.GoogleAuth.currentUser.get();
                    let userProfile = user.getBasicProfile()
                    newStatus.userName = userProfile.getName()
                    newStatus.userProfileImg = userProfile.getImageUrl()
                }
                this.setState(newStatus)
            }

            let initSigninStatus = () => {

                if (this.GoogleAuth.isSignedIn.get()) {
                    // var isAuthorized = user.hasGrantedScopes(SCOPE);
                    // updateSigninStatus(isAuthorized)
                    updateSigninStatus(true)
                } else {
                    updateSigninStatus(false)
                }
            }
        })
    }
    render() {
        return this.props.render({...this.state, handleAuthClick: this.handleAuthClick})
    }

}


export default GoogleAuth