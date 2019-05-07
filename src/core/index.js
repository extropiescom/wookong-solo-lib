const fastcall = require('fastcall');
const usb = require('usb');
const Promise = require('bluebird');

const { initLib, constants } = require('./define');

const ref = fastcall.ref;

let lib = initLib();

const UInt64Array = lib.arrays.UInt64Array.type;
const UInt8Array = lib.arrays.UInt8Array.type;
const UInt32Array = lib.arrays.UInt32Array.type;
const StringArray = lib.arrays.StringArray.type;

let context = null;
let deviceCount = 0;

const contextLock = require('mutexify')();

const timeout = 5000;

function arrayToStr(array) {
  let str = '';

  for (let index = 0; index < array.length; index += 1) {
    const item = array[index];
    if (item >= 0x30) {
      str += String.fromCharCode(item);
    } else {
      break;
    };
  }

  return str;
}

function stringToBytes(str) {
  const array = [];
  for (let i = 0; i < str.length / 2; i += 1) {
    array.push(parseInt(str.slice(2 * i, (2 * i) + 2), 16));
  }
  return array;
}

function bytesToString(arr, length, offset) {
  let str = '';
  const len = length || arr.length;
  const off = offset || 0;
  for (let i = off; i < off + len; i += 1) {
    const tmp = arr.get(i).toString(16);
    str += (tmp.length === 1 ? `0${tmp}` : tmp);
  }
  return str;
}

function initContext() {
  const ppPAEWContext = ref.alloc(ref.refType(ref.refType(ref.types.void)));
  const devCounter = ref.alloc('int');

  const promise = new Promise((resolve, reject) => {
    lib.interface.PAEW_InitContext(ppPAEWContext, devCounter)
      .then((code) => {
        deviceCount = devCounter.deref();
        if (code) {
          reject(code);
        } else {
          resolve(ppPAEWContext.deref());
        }

      })
      .catch((error) => {
        console.error(error);
        deviceCount = 0;
        reject(error);
      });
  }).timeout(timeout);

  return promise;
}

function freeContext() {
  const promise = new Promise((resolve, reject) => {
    lib.interface.PAEW_FreeContext(context)
      .then(() => {
        deviceCount = 0;
        resolve();
      })
      .catch((error) => {
        console.error(error);
        deviceCount = 0;
        reject(error);
      });
  }).timeout(timeout);

  context = null;

  return promise;
}

async function getDeviceInfo(ctx) {
  const DevInfo = lib.structs.DevInfo.type;
  let devInfo = new DevInfo();
  let supportLcdState = true;

  const mask = constants.devinfo.TYPE_PIN_STATE + constants.devinfo.TYPE_COS_TYPE
  + constants.devinfo.TYPE_CHAIN_TYPE + constants.devinfo.TYPE_SN
  + constants.devinfo.TYPE_COS_VERSION + constants.devinfo.TYPE_LIFECYCLE
  + constants.devinfo.TYPE_LCD_STATE;
  let code = await lib.interface.PAEW_GetDevInfo(ctx, 0, mask, devInfo.ref());
  if (code === constants.rets.NOT_SUPPORTED) {
    supportLcdState = false;
    code = await lib.interface.PAEW_GetDevInfo(ctx, 0, mask - constants.devinfo.TYPE_LCD_STATE, devInfo.ref());
  }
  if (code) {
    return { code };
  }

  devInfo = devInfo.toJSON();

  const result = {
    ...devInfo,
    pbSerialNumber: arrayToStr(devInfo.pbSerialNumber.toJSON()),
    // pbCOSVersion: [...devInfo.pbCOSVersion.toJSON()].join('.'),
  };

  return { code: 0, result: supportLcdState ? result : { ...result, nLcdState: 0 } };
}

async function changePIN(ctx) {
  const code = await lib.interface.PAEW_ChangePIN(ctx, 0);
  return { code };
}

async function getAddress(ctx, coinType, derivePath, showOnScreen) {
  const path = new UInt32Array(derivePath);
  const addressData = new UInt8Array(constants.lengths.MAX_LEN_ADDR);
  const addressLen = ref.alloc('size_t', constants.lengths.MAX_LEN_ADDR);
  let code = 0;
  let rtn = {};
  try {
    const deriveType = (coinType === constants.coins.COIN_TYPE_USDT) ? constants.coins.COIN_TYPE_BTC : coinType;
    code = await lib.interface.PAEW_DeriveTradeAddress(ctx, 0, deriveType, path.buffer, derivePath.length);
    if (code) {
      rtn = { code };
      return rtn;
    }

    code = await lib.interface.PAEW_GetTradeAddress(ctx, 0, coinType, showOnScreen, addressData.buffer, addressLen);
    if (code) {
      rtn = { code };
      return rtn;
    }
    let address = '';
    if (coinType === constants.coins.COIN_TYPE_EOS) {
      let EOSKEYHEX = '';
      let EOSKEYSIG = '';
      const rePEOSAddress = addressData.slice(0, addressLen.deref());
      const dividerIndex = rePEOSAddress.buffer.indexOf(0x00);
      address = addressData.slice(0, dividerIndex).buffer.readCString();// String.fromCharCode.apply(null, );
      rePEOSAddress.buffer.forEach((item, index) => {
        if (index <= dividerIndex) {
          EOSKEYHEX += item.toString(16).padStart(2, '0');
        } else if (index > dividerIndex) {
          EOSKEYSIG += item.toString(16).padStart(2, '0');
        }
      });
      const devCheckCodeData = new UInt8Array(constants.lengths.DEVICE_CHECK_CODE_LEN);
      const devCheckCodeLen = ref.alloc('size_t', constants.lengths.DEVICE_CHECK_CODE_LEN);
      code = await lib.interface.PAEW_GetDeviceCheckCode(ctx, 0, devCheckCodeData.buffer, devCheckCodeLen);
      if (code) {
        rtn = { code };
        return rtn;
      }
      const eosSNData = devCheckCodeData.slice(0, 0x10);
      const eosCode = devCheckCodeData.slice(0x10);
      let EOSSN = '';
      let EOSCODE = '';
      eosSNData.buffer.forEach((item) => {
        EOSSN += item.toString(16).padStart(2, '0');
      });
      eosCode.buffer.forEach((item) => {
        EOSCODE += item.toString(16).padStart(2, '0');
      });
      rtn = {
        code,
        result: {
          address, EOSKEYHEX, EOSKEYSIG, EOSSN, EOSCODE,
        },
      };
    } else {
      if (coinType === constants.coins.COIN_TYPE_BTC || coinType === constants.coins.COIN_TYPE_LTC ||
        coinType === constants.coins.COIN_TYPE_NEO || coinType === constants.coins.COIN_TYPE_XRP ||
        coinType === constants.coins.COIN_TYPE_CYB || coinType === constants.coins.COIN_TYPE_USDT ) {
        address = addressData.slice(0, addressLen.deref() - 1).buffer.readCString();
      } else if (coinType === constants.coins.COIN_TYPE_ETH || coinType === constants.coins.COIN_TYPE_ETC) {
        address = `0x${addressData.slice(0, addressLen.deref()).buffer.readCString()}`;
      }
      rtn = { code, result: { address } };
    }
    return rtn;
  } catch (e) {
    console.error(`get address error, coin type:${coinType}, derivePath: ${derivePath}`, e);
    return { code: constants.rets.UNKNOWN_FAIL };
  }
}

async function signBTC(ctx, derivePath, currentTX, utxos) {
  const path = new UInt32Array(derivePath);
  const pathLen = derivePath.length;
  const utxoCount = utxos.length;
  const utxoLengths = [];
  const txSigArray = [];
  const txSigLenArray = [];
  const utxosArr = [];
  const txArr = new UInt8Array(stringToBytes(currentTX));
  utxos.forEach((value) => {
    const utxo = new UInt8Array(stringToBytes(value));
    utxosArr.push(utxo);
    utxoLengths.push(utxo.length);
    const txSig = new UInt8Array(constants.lengths.MAX_LEN_BTC_SIG);
    txSigArray.push(txSig);
    txSigLenArray.push(constants.lengths.MAX_LEN_BTC_SIG);
  });
  const utxosData = new StringArray(utxosArr);
  const utxoDataLens = new UInt64Array(utxoLengths);
  const txSigs = new StringArray(txSigArray);
  const txSigLens = new UInt64Array(txSigLenArray);
  let code = await lib.interface.PAEW_DeriveTradeAddress(ctx, 0, constants.COIN_TYPE_BTC, path.buffer, pathLen);
  if (code) {
    return { code };
  }
  code = await lib.interface.PAEW_BTC_TXSign(ctx, 0, utxoCount, utxosData.buffer, utxoDataLens.buffer, txArr.buffer, txArr.length, txSigs.buffer, txSigLens.buffer);
  if (code) {
    return { code };
  }
  const strSigns = [];
  for (let i = 0; i < utxoCount; i += 1) {
    const strSign =  bytesToString(txSigs.get(i), txSigLens.get(i));
    strSigns.push(strSign);
  }
  return { code, result: { strSigns } };
}

async function signLTC(ctx, derivePath, currentTX, utxos) {
  const path = new UInt32Array(derivePath);
  const pathLen = derivePath.length;
  const utxoCount = utxos.length;
  const utxoLengths = [];
  const txSigArray = [];
  const txSigLenArray = [];
  const utxosArr = [];
  const txArr = new UInt8Array(stringToBytes(currentTX));
  utxos.forEach((value) => {
    const utxo = new UInt8Array(stringToBytes(value));
    utxosArr.push(utxo);
    utxoLengths.push(utxo.length);
    const txSig = new UInt8Array(constants.lengths.MAX_LEN_LTC_SIG);
    txSigArray.push(txSig);
    txSigLenArray.push(constants.lengths.MAX_LEN_LTC_SIG);
  });
  const utxosData = new StringArray(utxosArr);
  const utxoDataLens = new UInt64Array(utxoLengths);
  const txSigs = new StringArray(txSigArray);
  const txSigLens = new UInt64Array(txSigLenArray);
  let code = await lib.interface.PAEW_DeriveTradeAddress(ctx, 0, constants.coins.COIN_TYPE_LTC, path.buffer, pathLen);
  if (code) {
    return { code };
  }
  code = await lib.interface.PAEW_LTC_TXSign(ctx, 0, utxoCount, utxosData.buffer, utxoDataLens.buffer, txArr.buffer, txArr.length, txSigs.buffer, txSigLens.buffer);
  if (code) {
    return { code };
  }
  const strSigns = [];
  for (let i = 0; i < utxoCount; i += 1) {
    const strSign =  bytesToString(txSigs.get(i), txSigLens.get(i));
    strSigns.push(strSign);
  }
  return { code, result: { strSigns } };
}

async function signNEO(ctx, derivePath, currentTX, utxos) {
  const path = new UInt32Array(derivePath);
  const pathLen = derivePath.length;
  const utxoCount = utxos.length;
  const utxoLengths = [];
  const utxosArr = [];
  const txSig = new UInt8Array(constants.lengths.MAX_LEN_NEO_SIG);
  const txSigLen = ref.alloc('size_t', constants.lengths.MAX_LEN_NEO_SIG);
  const txArr = new UInt8Array(stringToBytes(currentTX));
  utxos.forEach((value) => {
    const utxo = new UInt8Array(stringToBytes(value));
    utxosArr.push(utxo);
    utxoLengths.push(utxo.length);
  });
  const utxosData = new StringArray(utxosArr);
  const utxoDataLens = new UInt64Array(utxoLengths);
  let code = await lib.interface.PAEW_DeriveTradeAddress(ctx, 0, constants.coins.COIN_TYPE_NEO, path.buffer, pathLen);
  if (code) {
    return { code };
  }
  code = await lib.interface.PAEW_NEO_TXSign(ctx, 0, utxoCount, utxosData.buffer, utxoDataLens.buffer, txArr.buffer, txArr.length, txSig.buffer, txSigLen);
  if (code) {
    return { code };
  }
  const invocationlen = txSig.get(0);
  const invocation = bytesToString(txSig, invocationlen + 1);
  const verificationlen = txSig.get(invocationlen + 2);
  const verification = `${bytesToString(txSig, verificationlen + 1, invocationlen + 2)}ac`;
  const signs = { invocation, verification };
  return { code, result: { signs } };
}

async function signEthereum(ctx, derivePath, currentTX, isETH, erc20Info) {
  const sign = {};
  const path = new UInt32Array(derivePath);
  const pathLen = derivePath.length;
  const txSig = new UInt8Array(constants.lengths.MAX_LEN_ETH_SIG);
  const txSigLen = ref.alloc('size_t', 120);
  const txArr = new UInt8Array(stringToBytes(currentTX));
  const type = isETH ? constants.coins.COIN_TYPE_ETH : constants.coins.COIN_TYPE_ETC;
  let code = await lib.interface.PAEW_DeriveTradeAddress(ctx, 0, type, path.buffer, pathLen);
  if (code) {
    return { code };
  }
  if (erc20Info !== undefined && erc20Info !== null
    && erc20Info.name !== undefined && erc20Info.name !== null  && erc20Info.name !== ''
    && erc20Info.decimal !== undefined && erc20Info.decimal !== null) {
    code = await lib.interface.PAEW_SetERC20Info(ctx, 0, type, fastcall.makeStringBuffer(erc20Info.name), erc20Info.decimal);
    if (code) {
      return { code };
    }
  }

  if (isETH) {
    code = await lib.interface.PAEW_ETH_TXSign(ctx, 0, txArr.buffer, txArr.length, txSig.buffer, txSigLen);
  } else {
    code = await lib.interface.PAEW_ETC_TXSign(ctx, 0, txArr.buffer, txArr.length, txSig.buffer, txSigLen);
  }
  if (code) {
    return { code };
  }
  const strSign = bytesToString(txSig, txSigLen.deref());
  sign['raw'] = strSign;
  sign['r'] = `0x${strSign.slice(0, 64)}`;
  sign['s'] = `0x${strSign.slice(64, 128)}`;
  sign['v'] = `0x${strSign.slice(128)}`;
  return { code, result: { sign } };
}

async function signCYB(ctx, derivePath, currentTX) {
  const path = new UInt32Array(derivePath);
  const pathLen = derivePath.length;
  const txSig = new UInt8Array(constants.lengths.MAX_LEN_CYB_SIG);
  const txSigLen = ref.alloc('size_t', constants.lengths.MAX_LEN_CYB_SIG);
  const txArr = new UInt8Array(stringToBytes(currentTX));
  let code = await lib.interface.PAEW_DeriveTradeAddress(ctx, 0, constants.coins.COIN_TYPE_CYB, path.buffer, pathLen);
  if (code) {
    return { code };
  }
  code = await lib.interface.PAEW_CYB_TXSign(ctx, 0, txArr.buffer, txArr.length, txSig.buffer, txSigLen);
  if (code) {
    return { code };
  }
  const signature = `${(txSig.get(64) + 31).toString(16)}${bytesToString(txSig, 64)}`;
  return { code, result: { signature } };
}

async function signEOS(ctx, derivePath, currentTX) {
  const path = new UInt32Array(derivePath);
  const pathLen = derivePath.length;
  const txSig = new UInt8Array(constants.lengths.MAX_LEN_EOS_SIG);
  const txSigLen = ref.alloc('size_t', constants.lengths.MAX_LEN_EOS_SIG);
  const txArr = new UInt8Array(stringToBytes(currentTX));
  let code = await lib.interface.PAEW_DeriveTradeAddress(ctx, 0, constants.coins.COIN_TYPE_EOS, path.buffer, pathLen);
  if (code) {
    return { code };
  }
  code = await lib.interface.PAEW_EOS_TXSign(ctx, 0, txArr.buffer, txArr.length, txSig.buffer, txSigLen);
  if (code) {
    return { code };
  }
  const signature = txSig.slice(0, txSigLen.deref() - 1).buffer.readCString();
  return { code, result: { signature } };
}

async function signXRP(ctx, derivePath, currentTX) {
  const path = new UInt32Array(derivePath);
  const pathLen = derivePath.length;
  const txSig = new UInt8Array(constants.lengths.MAX_LEN_XRP_SIG);
  const txSigLen = ref.alloc('size_t', constants.lengths.MAX_LEN_XRP_SIG);
  const txArr = new UInt8Array(stringToBytes(currentTX));
  let code = await lib.interface.PAEW_DeriveTradeAddress(ctx, 0, constants.coins.COIN_TYPE_XRP, path.buffer, pathLen);
  if (code) {
    return { code };
  }
  code = await lib.interface.PAEW_XRP_TXSign(ctx, 0, txArr.buffer, txArr.length, txSig.buffer, txSigLen);
  if (code) {
    return { code };
  }
  const sign = bytesToString(txSig, txSigLen.deref());
  return { code, result: { sign } };
}

async function getPubKey(ctx, derivePath, coinType) {
  const path = new UInt32Array(derivePath);
  const pathLen = derivePath.length;
  const pubKeyData = new UInt8Array(constants.lengths.MAX_LEN_PUBKEY);
  const pubKeyLen = ref.alloc('size_t', constants.lengths.MAX_LEN_PUBKEY);
  let code = await lib.interface.PAEW_DeriveTradeAddress(ctx, 0, coinType, path.buffer, pathLen);
  if (code) {
    return { code };
  }
  code = await lib.interface.PAEW_GetPublicKey(ctx, 0, coinType, pubKeyData.buffer, pubKeyLen);
  if (code) {
    return { code };
  }
  const pubKey = bytesToString(pubKeyData, pubKeyLen.deref());
  return { code, result: { pubKey } };
}

async function format(ctx) {
  const code = await lib.interface.PAEW_Format(ctx, 0);
  return { code };
}

async function generateSeed(ctx, seedLen) {
  const code = await lib.interface.PAEW_GenerateSeed(ctx, 0, seedLen, null, 0);
  return { code };
}

async function importSeed(ctx) {
  const fake = fastcall.makeStringBuffer("fake");
  const code = await lib.interface.PAEW_ImportSeed(ctx, 0, fake, 0);
  return { code };
}

async function getLibraryVersion() {
  const libVer = new UInt8Array(4);
  const libVerLen = ref.alloc('size_t', 4);
  const code = await lib.interface.PAEW_GetLibraryVersion(libVer.buffer, libVerLen);
  if (code) {
    return { code };
  }
  let version = '';
  for (let i = 0; i < 4; i += 1) {
    version += (i === 3 ? libVer.get(i).toString() : `${libVer.get(i).toString()}.`);
  }
  return { code, result: version };
}


async function clearCOS(ctx) {
  const devInfo = await getDeviceInfo(ctx);

  switch (devInfo.code) {
    case 0:
      break;

    case constants.rets.DEV_COMMAND_INVALID: // 0x80000010: cos has been cleared
      return { code: 0 };

    default:
      return { code: devInfo.code };
  }

  const { result: { pbSerialNumber } } = devInfo;

  let code = await lib.interface.PAEW_ClearCOS(ctx, 0);

  if (context) { // cos -> loader, require context freed
    try {
      await freeContext();
    } catch (error) {
      console.error(error);
      return { code: constants.rets.DEV_HANDLE_INVALID }; // 0x80000012 communication may be failed after cos cleared
    }
  }

  return { code, pbSerialNumber };
}

async function updateCOS(ctx, cosData, progressCallback) {
  const callback = lib.interface.tFunc_Progress_Callback((__, progress) => progressCallback && progressCallback(progress));
  const code = await lib.interface.PAEW_UpdateCOS_Ex(ctx, 0, 1, cosData, cosData.length, callback, null);

  if (context) { // loader -> cos, require context freed
    try {
      await freeContext();
    } catch (error) {
      console.error(error);
      return { result: constants.rets.DEV_HANDLE_INVALID }; // 0x80000005 communication may be failed after cos updated
    }
  }

  return { code };
}

async function verifyFileSignature(filePath, signature) {
  const bytes = new UInt8Array(stringToBytes(signature));
  const path = fastcall.makeStringBuffer(filePath);
  const code = await lib.interface.PAEW_VerifyFileECCSignature(path, bytes.buffer, bytes.length);
  return { code };
}

function init() {
  usb.on('attach', (device) => {
    if (
      device.deviceDescriptor.idProduct === 0x0101 &&
      device.deviceDescriptor.idVendor === 0x2f0a
    ) {
      contextLock(async (release) => {
        try {
          if (!context) {
            context = await initContext();
          }
        } catch (error) {
          console.error(error);
        } finally {
          release();
        }
      });
    }
  });

  usb.on('detach', (device) => {
    if (
      device.deviceDescriptor.idProduct === 0x0101 &&
      device.deviceDescriptor.idVendor === 0x2f0a
    ) {
      contextLock(async (release) => {
        try {
          if (context) {
            await freeContext();
          }
        } catch (error) {
          console.error(error);
        } finally {
          release();
        }
      });
    }
  });
}

function wrapper(func) {
  const wrappedFunc = function() {
    return new Promise((resolve, reject) => {
      contextLock(async (release) => {
        try {
          if (!context) {
            context = await initContext();
          }

          const args = [context, ...([...arguments].slice())];

          const result = await func(...args);
          resolve(result);
        } catch (error) {
          console.error(error);

          if (context) {
            await freeContext().catch(console.error);
          }

          let code = -1;
          if (error instanceof Promise.TimeoutError) {
            code = constants.rets.DEV_HANDLE_INVALID;
          } else if (typeof (error) === 'number') {
            code = error;
          }

          lib.release();
          lib = initLib();

          resolve({ code, error });
        } finally {
          release();
        }
      });
    });
  };

  return wrappedFunc;
}

async function getDeviceCount() {
  return { code: 0, result: deviceCount };
}

module.exports = {
  init,
  getDeviceInfo: wrapper(getDeviceInfo),
  getDeviceCount: wrapper(getDeviceCount),
  changePIN: wrapper(changePIN),
  format: wrapper(format),
  getAddress: wrapper(getAddress),
  generateSeed: wrapper(generateSeed),
  importSeed: wrapper(importSeed),
  getLibraryVersion,
  signBTC: wrapper(signBTC),
  signLTC: wrapper(signLTC),
  signNEO: wrapper(signNEO),
  signEthereum: wrapper(signEthereum),
  signCYB: wrapper(signCYB),
  signEOS: wrapper(signEOS),
  signXRP: wrapper(signXRP),
  getPubKey: wrapper(getPubKey),
  clearCOS: wrapper(clearCOS),
  updateCOS: wrapper(updateCOS),
  verifyFileSignature,
  constants,
};
