/**
 * Created by austin on 9/22/14.
 */

var util = require('./util')
    , authenticator = require('./authenticator')
    , request = require('request')
    , querystring = require('querystring');

var oauth = {};

oauth.getRequestAccessURL = function(args) {

    var url = 'https://www.strava.com/oauth/authorize?'
        , oauthArgs = {
            client_id: authenticator.getClientId()
            , redirect_uri: authenticator.getRedirectUri()
            , response_type: 'code'
        };

    if(args.scope)
        oauthArgs.scope = args.scope;
    if(args.state)
        oauthArgs.state = args.state;
    if(args.approval_prompt)
        oauthArgs.approval_prompt = args.approval_prompt;

    var qs = querystring.stringify(oauthArgs);

    url += qs;
    return url;
};

oauth.getToken = function(code,done) {

    var endpoint = 'oauth/token'
        , args = {}
        , form = {
            code: code
            , grant_type: "authorization_code"
            , client_secret: authenticator.getClientSecret()
            , client_id: authenticator.getClientId()
        };

    args.form = form;
    util.postEndpoint(endpoint,args,done);
};

oauth.refreshToken = function(args) {
    return new Promise(function(resolve) {
        var endpoint = 'oauth/token'
            , requestArgs = {}
            , form = {
                grant_type: "refresh_token"
                , refresh_token: args.refresh_token
                , client_secret: authenticator.getClientSecret()
                , client_id: authenticator.getClientId()
            }, done = function(response) {
                resolve(response);
            };

        requestArgs.form = form;
        util.postEndpoint(endpoint, requestArgs, done);
    });
};

oauth.deauthorize = function(args,done) {

    var endpoint = 'https://www.strava.com/oauth/deauthorize';

    var url = endpoint
        , options = {
            url: url
            , method: 'POST'
            , json: true
            , headers: {
                Authorization: 'Bearer ' + args.access_token
            }
        };

    request(options, function (err, response, payload) {

        if (!err) {
            //console.log(payload);
        }
        else {
            console.log('api call error');
            console.log(err);
        }

        done(err, payload);
    });
};

module.exports = oauth;
