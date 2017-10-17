'use strict';

const mock = require('mock-require');

describe('Index', () => {
  let index;

  beforeAll(() => {
    mock('path', {
      join: function () {
        return './src/fixtures/mock-config.json';
      }
    });
  });

  beforeEach(() => {
    index = mock.reRequire('../index');
  });

  it('should export a runCommand', () => {
    expect(index.runCommand).toBeDefined();
    expect(typeof index.runCommand).toBe('function');
  });

  it('should handle known commands', () => {
    const cmds = {
      'stache-add-search-spec': {
        cmd: 'stache-add-search-spec',
        lib: 'add-search-spec'
      },
      'stache-add-e2e-config': {
        cmd: 'stache-add-e2e-config',
        lib: 'add-e2e-config'
      },
      'stache-publish-search': {
        cmd: 'stache-publish-search',
        lib: 'publish-search'
      },
      'stache-release-search': {
        cmd: 'stache-release-search',
        lib: 'release-search'
      },
      'stache-remove-e2e-config': {
        cmd: 'stache-remove-e2e-config',
        lib: 'remove-e2e-config'
      },
      'stache-remove-search-json': {
        cmd: 'stache-remove-search-json',
        lib: 'remove-search-json'
      },
      'stache-remove-search-spec': {
        cmd: 'stache-remove-search-spec',
        lib: 'remove-search-spec'
      }
    };

    Object.keys(cmds).forEach((key) => {
      mock('./' + cmds[key].lib, () => {
        cmds[key].called = true;
      });
      index.runCommand(cmds[key].cmd, {});
        expect(cmds[key].called).toEqual(true);
    });
  });

  it('should return false for unknown command', () => {
    const cmd = 'junk-command-that-does-not-exist';
    const lib = require('../index');
    expect(lib.runCommand(cmd, {})).toBe(false);
  });

  it('should return true for known command', () => {
    const cmd = 'stache-publish-search';
    const lib = require('../index');
    expect(lib.runCommand(cmd, {})).toBe(true);
  });

  afterAll(() => {
    mock.stopAll();
  });
});
