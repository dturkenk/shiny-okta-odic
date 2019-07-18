# OpenID Connect + Okta + Shiny proxy
This server proxies a shiny instance protecting it with Passport and Okta / Oauth2

# Running the proxy
In order to run this proxy you need to have npm and nodejs installed.

You also need to set the ClientSecret, ClientId and Domain for your OKTA app as environment variables with the following names respectively: `OKTA_CLIENT_SECRET`, `OKTA_CLIENT_ID` and `OKTA_DOMAIN`.

For that, if you just create a file named `.env` in the directory and set the values like the following, the app will just work:

````bash
# .env file
OKTA_CLIENT_SECRET=myCoolSecret
OKTA_CLIENT_ID=myCoolClientId
OKTA_DOMAIN=myCoolDomain
OKTA_CALLBACK_URL=https://my.url.com/
COOKIE_SECRET=somethingRandomHerePlease
SHINY_HOST=localhost
SHINY_PORT=3838
PORT=3000
````

Once you've set those 3 environment variables, just run `npm start` and try calling [http://localhost:3000/](http://localhost:3000/)


For further customization you can add the following variables to your `.env` file

```bash
# Auto login if the session exists on Okta Server
CHECK_SESSION=true
```
