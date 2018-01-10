const utils = require('./shared');
const mock = require('mock-require');
const btoa = require('btoa');
const EventEmitter = require('events').EventEmitter;
const IncomingMessage = require('http').IncomingMessage;

describe('Utils', () => {
  afterEach(() => {
    mock.stopAll();
  });

  describe('Utils.readConfig', () => {
    let config = {
      appSettings: {
        stache: {
          searchConfig: {
            allowSiteToBeSearched: true
          }
        }
      }
    };

    it('should return the value if the key in the config exists', () => {
      let result = utils.readConfig(config, 'allowSiteToBeSearched');
      expect(result).toBe(true);
    });

    it('should return undefined if no key exists', () => {
      let result = utils.readConfig(config, 'Nope');
      expect(result).toBe(undefined);
    });

    it('should return undefined if config does not exist', () => {
      let result = utils.readConfig(undefined);
      expect(result).toBe(undefined);
    });
  });

  describe('Utils.makeRequest', () => {
    let args;
    let body;
    let emitter;
    let makeRequest;

    beforeEach(() => {
      emitter = new EventEmitter();

      mock('../error-handler', function (error) {
        console.log(error);
      });

      mock('request', function (options) {
        console.log(options.headers.Authorization);
        console.log(options.body);
        console.log(options.uri);
        return emitter;
      });

      mock('./logger', {
        info: function (text) {
          console.log(text);
        }
      });

      args = {
        endpoint: "https://localhost:5000/publisher",
        audienceId: "Audience\\Id",
        clientUserName: "t01\\example",
        clientKey: "apassword"
      };

      body = JSON.stringify({
        test: 'test-body'
      });

      makeRequest = mock.reRequire('./shared').makeRequest;
    });

    it('should error if no body is provided', () => {
      spyOn(console, 'log');
      makeRequest(args, undefined);
      expect(console.log).toHaveBeenCalledWith(new Error('[ERROR]: A request body and config are required!'));
    });

    it('should error if no config is provided', () => {
      spyOn(console, 'log');
      makeRequest(undefined, body);
      expect(console.log).toHaveBeenCalledWith(new Error('[ERROR]: A request body and config are required!'));
    });

    it('should post the json file', () => {
      let authCredentials = btoa(`${args.clientUserName}:${args.clientKey}`);
      spyOn(console, 'log');
      makeRequest(args, body);
      emitter.emit('data', new Buffer(JSON.stringify({
        access_token: 'test'
      })));
      emitter.emit('end');
      emitter.emit('response', {
        statusCode: 200
      });
      expect(console.log).toHaveBeenCalledWith(args.endpoint);
      expect(console.log).toHaveBeenCalledWith(`https://service-authorization.sky.blackbaud.com/oauth2/token?grant_type=client_credentials&audience_id=${encodeURIComponent(args.audienceId)}`);
      expect(console.log).toHaveBeenCalledWith('Bearer test');
      expect(console.log).toHaveBeenCalledWith(`Basic ${authCredentials}`);
      expect(console.log).toHaveBeenCalledWith(JSON.stringify({ test: 'test-body' }));
      expect(console.log).toHaveBeenCalledWith('200: Search data successfully posted!');
    });

    it('should throw an error if the authentication post was unsuccessful', () => {
      spyOn(console, 'log');
      makeRequest(args, body);
      emitter.emit('error', new Error('Unable to authenticate'));
      expect(console.log).toHaveBeenCalledWith(new Error(`[ERROR]: Unable to retrieve SAS JWT! Unable to authenticate`));
    });

    it('should throw an error if the file post was unsuccessful', () => {
      spyOn(console, 'log');
      makeRequest(args, body);
      emitter.emit('data', new Buffer(JSON.stringify({
        access_token: 'test'
      })));
      emitter.emit('end');
      emitter.emit('error', new Error('Unable to post search'));
      expect(console.log).toHaveBeenCalledWith(new Error(`[ERROR]: Unable to post search data! Unable to post search`));
    });

    it('should throw an error if the status code on post !== 200', () => {
      spyOn(console, 'log');
      let response = new IncomingMessage(new EventEmitter())
      response.statusCode = 500;
      response.statusMessage = 'Error response';

      makeRequest(args, body);
      emitter.emit('data', new Buffer(JSON.stringify({
        access_token: 'test'
      })));
      emitter.emit('end');
      emitter.emit('response', response);
      response.emit('data', response.statusMessage);
      response.emit('end');

      expect(console.log).toHaveBeenCalledWith(new Error(`[ERROR]: Unable to post search data! 500 : Error response`));
    });

  });
});