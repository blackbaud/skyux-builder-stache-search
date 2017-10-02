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
      'add-search-spec': {
        cmd: 'add-search-spec',
        lib: 'add-search-spec'
      },
      'add-e2e-config': {
        cmd: 'add-e2e-config',
        lib: 'add-e2e-config'
      },
      'publish-search': {
        cmd: 'publish-search',
        lib: 'publish-search'
      },
      'remove-e2e-config': {
        cmd: 'remove-e2e-config',
        lib: 'remove-e2e-config'
      },
      'remove-search-json': {
        cmd: 'remove-search-json',
        lib: 'remove-search-json'
      },
      'remove-search-spec': {
        cmd: 'remove-search-spec',
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
    const cmd = 'publish-search';
    const lib = require('../index');
    expect(lib.runCommand(cmd, {})).toBe(true);
  });

  afterAll(() => {
    mock.stopAll();
  });
});
