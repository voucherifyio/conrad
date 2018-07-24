# Conrad - web application
## A writer-focused swipe file built by [voucherify.io](https://www.voucherify.io/)


## Setup

Create new project on [Google API Console](https://console.cloud.google.com/apis/)

Add to created project `Google Drive API` and `Google Sheets API` and then configure `OAuth 2.0 client`. Section with `Authorised JavaScript origins` require public URI so you should set in your hosts file test domain like http://app.example.com.


In root folder create configuration file `.env` file with contet like
```configuration
# from your OAuth2 client configured in Google API console
REACT_APP_GOOGLE_CLIENT_ID=xxx 
# from your OAuth2 client configured in Google API console
REACT_APP_GOOGLE_CLIENT_SECRET=xxx
# example domain configured in Authorised JavaScript origins section of Google API console
HOST=app.example.com
# about us page address
REACT_APP_ABOUT_URL=https://getconrad.xyz
```
install all dependencies

```bash 
npm install
```

run applciation in dev mode:

```bash
npm start
```

You can build chrome extension with this application using project [chrome-sidebar](https://github.com/segmentio/chrome-sidebar)




___

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

You can find the most recent version of Create React App guide [here](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md).

