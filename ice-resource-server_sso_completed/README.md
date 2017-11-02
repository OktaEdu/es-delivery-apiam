# ice-resource-server

This Resource Server makes Ice customers happy.

![Ice Icon](img/IceIcon_120px.png)

## Run this App

### Option 1: Heroku

1. Click [![Deploy to Heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)
2. Login or create your Heroku account.
3. After deployment, go to settings.
4. Update the **ISSUER** with the OAuth Authorization Server that issues JWT token - for example, https://ice.oktapreview.com/oauth2/abcdef123456.
4. Update the **AUDIENCE** with the API that's the intended recipient of the JWT token. In heroku, this is your app url - for example, https://ice-rs-fredericohakamine.herokuapp.com".

### Option 2: In my house

1. Install `git` and `node` in your computer.
2. Clone this repo:
    `$ git clone git@github.com/fhakamine/ice-resource-server.git`

3. Install Node dependencies:
    `npm install --no-optional`

4. Run the Project:
    `node server.js --iss "https://ice.oktapreview.com/oauth2/abcdef123456" --aud "http://localhost:5000"`
