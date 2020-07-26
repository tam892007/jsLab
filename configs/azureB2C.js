import * as PolicyConfig from './policy'

/**
 * Config object to be passed to MSAL on creation.
 * For a full list of msal.js configuration parameters, 
 * visit https://azuread.github.io/microsoft-authentication-library-for-js/docs/msal/modules/_configuration_.html
 * */
export const msalConfig = {
  auth: {
    clientId: "b2be40e1-e13c-4a8a-a3f5-5781166beaa7",
    authority: PolicyConfig.b2cPolicies.authorities.signUpSignIn.authority,
    validateAuthority: false
  },
  cache: {
    cacheLocation: "localStorage", // This configures where your cache will be stored
    storeAuthStateInCookie: false // Set this to "true" to save cache in cookies to address trusted zones limitations in IE (see: https://github.com/AzureAD/microsoft-authentication-library-for-js/wiki/Known-issues-on-IE-and-Edge-Browser)
  }
};

/** 
 * Scopes you enter here will be consented once you authenticate. For a full list of available authentication parameters, 
 * visit https://azuread.github.io/microsoft-authentication-library-for-js/docs/msal/modules/_authenticationparameters_.html
 */
export const loginRequest = {
  scopes: ["openid", "profile"],
};

// Add here scopes for access token to be used at the API endpoints.
export const tokenRequest = {
  scopes: ["https://tamlai.onmicrosoft.com/backendapi/Call"],
};