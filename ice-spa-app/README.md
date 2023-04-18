# Okta Ice Single Page Application (SPA)

This is a sample application written with Okta's Vue SDK and AuthJS SDK.
There are two methods of Authentication modelled in this application that can be toggled in the `Login` component (`components/Login.vue`).

## Redirect Model of Authentication

This is the simplest model of Authentication as it calls on AuthJS to simply redirect to your Okta org for authentication asynchronously. Once authentication is complete, the user is redirected back to the application. Configure this in `components/Login.vue`.

## Embedded SDK Model of Authentication

This model is more complex because you have to handle the response from Okta and the SDK during the authentication process. This is done in the `Login` view (`views/Login.vue`), and configured for use in `components/Login.vue`. You can read more about the Embedded SDK Model of Authentication here: https://developer.okta.com/docs/guides/oie-embedded-sdk-use-case-basic-sign-in/nodejs/main/

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Lints and fixes files

```
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
