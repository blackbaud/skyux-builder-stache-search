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
      'publish-search': {
        cmd: 'publish-search',
        lib: 'publish-search'
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

  afterAll(() => {
    mock.stopAll();
  });
});
