/// <reference path="../typings/tsd.d.ts" />
'use strict';

import assert = require('assert');
import Q = require('q');
import FB = require('fb');

interface RedirectUrl {
    protocol: string;
    host: string;
    uri: string;
}

interface GetAccessTokenConfig {
    appId: string;
    appSecret: string;
    redirectUrl: RedirectUrl;
}

function getAccessToken(config:GetAccessTokenConfig, code:string):any {

    assert.equal(typeof config, 'object', 'required argument config must be an object');
    assert.equal(typeof code, 'string', 'required argument code must be a string');

    let deferred:any = Q.defer();

    const redirectUrl:string = `${config.redirectUrl.protocol}${config.redirectUrl.host}${config.redirectUrl.uri}`;

    FB.api('oauth/access_token', {
        client_id: config.appId,
        client_secret: config.appSecret,
        redirect_uri: redirectUrl,
        code: code
    }, function (res:any):void {
        if (!res || res.error) {
            deferred.reject(!res ? 'oauth/access_token error occurred.' : res.error);
        }
        else if (!res.access_token || !res.expires) {
            deferred.reject('oauth/access_token error occurred.');
        }
        else {
            deferred.resolve({
                accessToken: res.access_token,
                expires: res.expires
            });
        }
    });

    return deferred.promise;

}

export = getAccessToken;
