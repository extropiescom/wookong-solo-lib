const path = require('path');
const fastcall = require('fastcall');

const configs = require('./configs');

const Library = fastcall.Library;
const { platform } = process;

const dllNames = {
  darwin: 'libsolo.dylib',
  win32: 'solo.dll',
};

function initLib() {
  switch (platform) {
    case 'win32': { // call WinAPI SetDllDirectoryA to set DLL directory
      const kernel32 = new Library('kernel32.dll').function('bool SetDllDirectoryA(string)');
      kernel32.interface.SetDllDirectoryA(path.resolve(__dirname, 'dll'));
      break;
    }

    default:
      break;
  }

  const lib = new Library(path.resolve(__dirname, 'dll', dllNames[platform]));

  // define types, functions, callbacks via configs
  const methods = Object.keys(configs);
  methods.forEach((method) => {
    configs[method].forEach((defineStr) => {
      lib[method](defineStr);
    });
  });

  return lib;
}

module.exports = { initLib, constants: require('./constants'), };
