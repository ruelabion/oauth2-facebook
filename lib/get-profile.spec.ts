/// <reference path="../typings/tsd.d.ts" />
'use strict';

import sinon = require('sinon');
import chai = require('chai');
import fs = require('fs');
import path = require('path');
import FB = require('fb');

let should:any = chai.should();

let fixtureFacebookUserProfile:any = JSON.parse(fs.readFileSync(path.resolve(
    __dirname, '../test/fixtures/facebook-user-profile.json')).toString());

let logger:any = sinon.spy();

import getProfile = require('./get-profile');

describe('oauth2-facebook', () => {

    describe('get-profile', () => {

        afterEach(() => {
            if (FB.api.restore) {
                FB.api.restore();
            }
            logger.reset();
        });

        describe('success', () => {

            it('should return a user profile', (done:any) => {

                should.exist(getProfile);

                sinon.stub(FB, 'api', function (action:string, options:any, callback:any):any {
                    callback(fixtureFacebookUserProfile);
                });

                getProfile('abc123').then(function (res:any):any {
                    res.id.should.equal(fixtureFacebookUserProfile.id);
                })
                    .then(done, done);

            });

        });


    });

});