export const oktaConfig = {
    clientId : '0oacorkbhcNpM15GA5d7',
    issuer: 'https://dev-59451238.okta.com/oauth2/default',
    redirectUri: 'http://localhost/login/callback',
    scopes: ['openid', 'profile', 'email'],
    pkce: true,
    disableHttpsCheck: true,
}