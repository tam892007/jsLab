import * as Msal from 'msal'
import * as AuthConfig from '../configs/azureB2C'
import * as PolicyConfig from '../configs/policy'

export default class AuthManager {
    constructor(cb) {
        let msal = typeof window === 'undefined' ? null : new Msal.UserAgentApplication(AuthConfig.msalConfig);
        if (msal != null) msal.loginCallback = cb;
        msal?.handleRedirectCallback(this.authRedirectCallBack);
    }

    login() {
        msal.loginRedirect(AuthConfig.loginRequest);
    }

    logout() {
        // Removes all sessions, need to call AAD endpoint to do full logout
        msal.logout();
    }

    getAccessToken() {
        return this.getTokenRedirect(AuthConfig.tokenRequest);
    }

    authRedirectCallBack(error, response) {
        // Error handling
        if (error) {
            console.log(error);
    
            // Check for forgot password error
            // Learn more about AAD error codes at https://docs.microsoft.com/en-us/azure/active-directory/develop/reference-aadsts-error-codes
            if (error.errorMessage.indexOf("AADB2C90118") > -1) {
                try {
                    // Password reset policy/authority
                    msal.loginRedirect(PolicyConfig.b2cPolicies.authorities.forgotPassword);
                } catch (err) {
                    console.log(err);
                }
            }
        } else {
            console.log(response);
            // We need to reject id tokens that were not issued with the default sign-in policy.
            // "acr" claim in the token tells us what policy is used (NOTE: for new policies (v2.0), use "tfp" instead of "acr")
            // To learn more about b2c tokens, visit https://docs.microsoft.com/en-us/azure/active-directory-b2c/tokens-overview
            if (response.tokenType === "id_token" && response.idToken.claims['tfp'] !== PolicyConfig.b2cPolicies.names.signUpSignIn) {
                msal.logout();
                window.alert("Password has been reset successfully. \nPlease sign-in with your new password.");
            } else if (response.tokenType === "id_token" && response.idToken.claims['tfp'] === PolicyConfig.b2cPolicies.names.signUpSignIn) {
                console.log("id_token acquired at: " + new Date().toString());
    
                if (msal.getAccount()) {
                    msal.loginCallback?.call(null, msal.getAccount());
                    msal.acquireTokenSilent(AuthConfig.tokenRequest)
                        .then((response) => {
                            if (response.accessToken) {
                                let accessToken = response.accessToken;
                                console.log(accessToken);
                            }
                        }).catch(error => {
                            console.log("Silent token acquisition fails. Acquiring token using redirect");
                            console.log(error);
                            // fallback to interaction when silent call fails
                            return msal.acquireTokenRedirect(AuthConfig.tokenRequest);
                        });
                }
    
            } else if (response.tokenType === "access_token") {
                console.log("access_token acquired at: " + new Date().toString());
                let accessToken = response.accessToken;
                console.log(accessToken);
            } else {
                console.log("Token type is: " + response.tokenType);
            }
        }
    }

    // main method to get token with redirect flow
    getTokenRedirect(request) {
        return msal.acquireTokenSilent(request)
            .then((response) => {
                if (response.accessToken) {
                    accessToken = response.accessToken;
                    console.log(accessToken);
                }
            }).catch(error => {
                console.log("Silent token acquisition fails. Acquiring token using redirect");
                console.log(error);
                // fallback to interaction when silent call fails
                return msal.acquireTokenRedirect(request);
            });
    }
}