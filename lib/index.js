"use strict";function _interopDefault(e){return e&&"object"==typeof e&&"default"in e?e.default:e}var path=_interopDefault(require("path")),fastcall=_interopDefault(require("fastcall")),usb=_interopDefault(require("usb")),bluebird=_interopDefault(require("bluebird")),mutexify=_interopDefault(require("mutexify")),configs={array:["uchar[] UCharArray","uint64[] UInt64Array","uint8[] UInt8Array","uint32[] UInt32Array","UInt8Array[] StringArray"],struct:["struct DevInfo\n    {\n      uint8 ucPINState;\n      uint8 ucCOSType;\n      uint8 ucChainType;\n      UCharArray[32] pbSerialNumber;\n      UCharArray[4] pbCOSVersion;\n      uint8 ucLifeCycle;\n      size_t nLcdState;\n      UCharArray[4] pbSessKeyHash;\n      uint8 nN;\n      uint8 nT;\n      UCharArray[4] pbBLEVersion;\n    }".split("\n").join("")],callback:["int (*tFunc_Progress_Callback)(void*, size_t)","int (*tFunc_PutState_Callback)(void*, int)"],asyncFunction:["int PAEW_InitContext(void** ppPAEWContext, size_t* pnDevCount)","int PAEW_GetDevInfo(void* pPAEWContext, size_t nDevIndex, uint32 nDevInfoType, DevInfo* pDevInfo)","int PAEW_GetLibraryVersion(uint8* pbVersion, size_t* pnVersionLen)","int PAEW_GenerateSeed(void* pPAEWContext, size_t nDevIndex, uint8 nSeedLen, uint8 nN, uint8 nT)","int PAEW_ImportSeed(void* pPAEWContext, size_t nDevIndex, uint8*  pbMneWord, size_t nMneWordLen)","int PAEW_DeriveTradeAddress(void* pPAEWContext, size_t nDevIndex, uint8 nCoinType, uint32* puiDerivePath, size_t nDerivePathLen)","int PAEW_GetTradeAddress(void* pPAEWContext, size_t nDevIndex, uint8 nCoinType, uint8 nShowOnScreen, uint8* pbTradeAddress, size_t* pnTradeAddressLen)","int PAEW_GetPublicKey(void* pPAEWContext, size_t nDevIndex, uint8 nCoinType, uint8* pbPublicKey, size_t* pnPublicKeyLen)","int PAEW_BTC_TXSign(void* pPAEWContext, size_t nDevIndex, size_t nUTXOCount, uint8** ppbUTXO, size_t* pnUTXOLen, uint8* pbCurrentTX, size_t nCurrentTXLen, uint8** ppbTXSig, size_t* pnTXSigLen)","int PAEW_LTC_TXSign(void* pPAEWContext, size_t nDevIndex, size_t nUTXOCount, uint8** ppbUTXO, size_t* pnUTXOLen, uint8* pbCurrentTX, size_t nCurrentTXLen, uint8** ppbTXSig, size_t* pnTXSigLen)","int PAEW_NEO_TXSign(void* pPAEWContext, size_t nDevIndex, size_t nUTXOCount, uint8** ppbUTXO, size_t* pnUTXOLen, uint8* pbCurrentTX, size_t nCurrentTXLen, uint8** ppbTXSig, size_t* pnTXSigLen)","int PAEW_ETH_TXSign(void* pPAEWContext, size_t nDevIndex, uint8* pbCurrentTX, size_t nCurrentTXLen, uint8* pbTXSig, size_t* pnTXSigLen)","int PAEW_ETC_TXSign(void* pPAEWContext, size_t nDevIndex, uint8* pbCurrentTX, size_t nCurrentTXLen, uint8* pbTXSig, size_t* pnTXSigLen)","int PAEW_CYB_TXSign(void* pPAEWContext, size_t nDevIndex, uint8* pbCurrentTX, size_t nCurrentTXLen, uint8* pbTXSig, size_t* pnTXSigLen)","int PAEW_EOS_TXSign(void* pPAEWContext, size_t nDevIndex, uint8* pbCurrentTX, size_t nCurrentTXLen, uint8* pbTXSig, size_t* pnTXSigLen)","int PAEW_XRP_TXSign(void* pPAEWContext, size_t nDevIndex, uint8* pbCurrentTX, size_t nCurrentTXLen, uint8* pbTXSig, size_t* pnTXSigLen)","int PAEW_ChangePIN(void* pPAEWContext, size_t nDevIndex)","int PAEW_Format(void * pPAEWContext, size_t nDevIndex)","int PAEW_SetERC20Info(void* pPAEWContext, size_t nDevIndex, uint8 nCoinType, char* szTokenName, uint8 nPrecision)","int PAEW_GetDeviceCheckCode(void* pPAEWContext, size_t nDevIndex, uint8* pbCheckCode, size_t* pnCheckCodeLen)","int PAEW_VerifyFileECCSignature(char* szFileFullPath, uint8* pbSignature, size_t nSignatureLen)","int PAEW_ClearCOS(void* pPAEWContext, size_t nDevIndex)","int PAEW_UpdateCOS(void* pPAEWContext, size_t nDevIndex, uint8* pbUserCOSData, size_t nUserCOSDataLen)","int PAEW_UpdateCOS_Ex(void* pPAEWContext, size_t nDevIndex, uint8 bRestart, uint8* pbUserCOSData, size_t nUserCOSDataLen, tFunc_Progress_Callback pProgressCallback, void* pCallbackContext)","int PAEW_FreeContext(void* pPAEWContext)"]},configs_1=configs.array,configs_2=configs.struct,configs_3=configs.callback,configs_4=configs.asyncFunction,configs$1=Object.freeze({default:configs,__moduleExports:configs,array:configs_1,struct:configs_2,callback:configs_3,asyncFunction:configs_4});const rets={SUCCESS:0,UNKNOWN_FAIL:2147483649,ARGUMENTBAD:2147483650,HOST_MEMORY:2147483651,DEV_ENUM_FAIL:2147483652,DEV_OPEN_FAIL:2147483653,DEV_COMMUNICATE_FAIL:2147483654,DEV_NEED_PIN:2147483655,DEV_OP_CANCEL:2147483656,DEV_KEY_NOT_RESTORED:2147483657,DEV_KEY_ALREADY_RESTORED:2147483658,DEV_COUNT_BAD:2147483659,DEV_RETDATA_INVALID:2147483660,DEV_AUTH_FAIL:2147483661,DEV_STATE_INVALID:2147483662,DEV_WAITING:2147483663,DEV_COMMAND_INVALID:2147483664,DEV_RUN_COMMAND_FAIL:2147483665,DEV_HANDLE_INVALID:2147483666,COS_TYPE_INVALID:2147483667,COS_TYPE_NOT_MATCH:2147483668,DEV_BAD_SHAMIR_SPLIT:2147483669,DEV_NOT_ONE_GROUP:2147483670,BUFFER_TOO_SAMLL:2147483671,TX_PARSE_FAIL:2147483672,TX_UTXO_NEQ:2147483673,TX_INPUT_TOO_MANY:2147483674,MUTEX_ERROR:2147483675,COIN_TYPE_INVALID:2147483676,COIN_TYPE_NOT_MATCH:2147483677,DERIVE_PATH_INVALID:2147483678,NOT_SUPPORTED:2147483679,INTERNAL_ERROR:2147483680,BAD_N_T:2147483681,TARGET_DEV_INVALID:2147483682,CRYPTO_ERROR:2147483683,DEV_TIMEOUT:2147483684,DEV_PIN_LOCKED:2147483685,DEV_PIN_CONFIRM_FAIL:2147483686,DEV_PIN_VERIFY_FAIL:2147483687,DEV_CHECKDATA_FAIL:2147483688,DEV_DEV_OPERATING:2147483689,DEV_PIN_UNINIT:2147483690,DEV_BUSY:2147483691,DEV_ALREADY_AVAILABLE:2147483692,DEV_DATA_NOT_FOUND:2147483693,DEV_SENSOR_ERROR:2147483694,DEV_STORAGE_ERROR:2147483695,DEV_STORAGE_FULL:2147483696,DEV_FP_COMMON_ERROR:2147483697,DEV_FP_REDUNDANT:2147483698,DEV_FP_GOOG_FINGER:2147483699,DEV_FP_NO_FINGER:2147483700,DEV_FP_NOT_FULL_FINGER:2147483701,DEV_FP_BAD_IMAGE:2147483702,DEV_LOW_POWER:2147483703,DEV_TYPE_INVALID:2147483704,NO_VERIFY_COUNT:2147483705,AUTH_CANCEL:2147483706,PIN_LEN_ERROR:2147483707,AUTH_TYPE_INVALID:2147483708,DEV_FUNC_INVALID:2147483709};Object.keys(rets).forEach(e=>{rets[e]>2147483648&&(rets[e]=rets[e]-1-4294967295)});const coins={COIN_TYPE_BTC:0,COIN_TYPE_ETH:1,COIN_TYPE_CYB:2,COIN_TYPE_EOS:3,COIN_TYPE_LTC:4,COIN_TYPE_NEO:5,COIN_TYPE_ETC:6,COIN_TYPE_XRP:9,COIN_TYPE_USDT:10},lengths={MAX_LEN_BTC_SIG:112,MAX_LEN_LTC_SIG:112,MAX_LEN_NEO_SIG:112,MAX_LEN_CYB_SIG:65,MAX_LEN_ETH_SIG:69,MAX_LEN_XRP_SIG:112,MAX_LEN_EOS_SIG:256};lengths.MAX_LEN_SIG=lengths.MAX_LEN_EOS_SIG,lengths.MAX_LEN_PUBKEY=96,lengths.PROCMSG=256,lengths.MAX_LEN_ADDR=128,lengths.DEVICE_CHECK_CODE_LEN=80;const devinfo={TYPE_PIN_STATE:1,TYPE_COS_TYPE:2,TYPE_CHAIN_TYPE:4,TYPE_SN:8,TYPE_COS_VERSION:16,TYPE_LIFECYCLE:32,TYPE_SESSKEY_HASH:64,TYPE_N_T:128,TYPE_LCD_STATE:256,TYPE_BLE_VERSION:512,PIN_INVALID_STATE:255,PIN_LOGOUT:0,PIN_LOGIN:1,PIN_LOCKED:2,PIN_UNSET:3,CHAIN_TYPE_FORMAL:1,CHAIN_TYPE_TEST:2,SN_LEN:32,COS_VERSION_LEN:4,BLE_VERSION_LEN:4,COS_TYPE_INDEX:1,COS_TYPE_INVALID:255,COS_TYPE_DRAGONBALL:0,COS_TYPE_PERSONAL:1,COS_TYPE_BIO:2,LIFECYCLE_INVALID:255,LIFECYCLE_AGREE:1,LIFECYCLE_USER:2,LIFECYCLE_PRODUCE:4,SESSKEY_HASH_LEN:4,N_T_INVALID:255,LCD_NULL:0,LCD_SHOWLOGO:1,LCD_WAITTING:2,LCD_SHOWOK:4,LCD_SHOWCANCEL:8,LCD_SHOWSKEYHASH:16,LCD_SHOWADDRESS:32,LCD_SHOWBTCSIGN:64,LCD_SHOWETHSIGN:128,LCD_SETNEWPIN:256,LCD_CHANGEPIN:512,LCD_VERIFYPIN:1024,LCD_PINLOCKED:2048,LCD_FORMAT:4096,LCD_REBOOT:8192,LCD_SHOWBIP39:16384,LCD_CHECKBIP39:32768,LCD_SHOWBTSSIGN:65536,LCD_PINERROR:131072,LCD_SELECT_MNENUM:262144,LCD_SHOWM:524288,LCD_SHOWTIMEOUT:1048576,LCD_SHOWEOSSIGN:2097152,LCD_SHOWFAIL:4194304,LCD_SHOWNEOSIGN:8388608,LCD_WAITING_TIMEOUT:16777216,LCD_GET_MNENUM:33554432,LCD_GETMNE_BYDEV:67108864};var constants={rets:rets,coins:coins,lengths:lengths,devinfo:devinfo},constants_1=constants.rets,constants_2=constants.coins,constants_3=constants.lengths,constants_4=constants.devinfo,constants$1=Object.freeze({default:constants,__moduleExports:constants,rets:constants_1,coins:constants_2,lengths:constants_3,devinfo:constants_4}),configs$2=configs$1&&configs||configs$1,require$$0=constants$1&&constants||constants$1;const Library=fastcall.Library,{platform:platform}=process,dllNames={darwin:"libsolo.dylib",win32:"solo.dll"};function initLib(){switch(platform){case"win32":new Library("kernel32.dll").function("bool SetDllDirectoryA(string)").interface.SetDllDirectoryA(path.resolve(__dirname,"dll"));break}const e=new Library(path.resolve(__dirname,"dll",dllNames[platform]));return Object.keys(configs$2).forEach(n=>{configs$2[n].forEach(t=>{e[n](t)})}),e}var define={initLib:initLib,constants:require$$0},define_1=define.initLib,define_2=define.constants,define$1=Object.freeze({default:define,__moduleExports:define,initLib:define_1,constants:define_2}),require$$0$1=define$1&&define||define$1,_extends=Object.assign||function(e){for(var n=1;n<arguments.length;n++){var t=arguments[n];for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r])}return e};let getDeviceInfo=(()=>{var e=_asyncToGenerator(function*(e){let n=new(0,lib.structs.DevInfo.type),t=!0;const r=constants$2.devinfo.TYPE_PIN_STATE+constants$2.devinfo.TYPE_COS_TYPE+constants$2.devinfo.TYPE_CHAIN_TYPE+constants$2.devinfo.TYPE_SN+constants$2.devinfo.TYPE_COS_VERSION+constants$2.devinfo.TYPE_LIFECYCLE+constants$2.devinfo.TYPE_LCD_STATE;let i=yield lib.interface.PAEW_GetDevInfo(e,0,r,n.ref());if(i===constants$2.rets.NOT_SUPPORTED&&(t=!1,i=yield lib.interface.PAEW_GetDevInfo(e,0,r-constants$2.devinfo.TYPE_LCD_STATE,n.ref())),i)return{code:i};n=n.toJSON();const o=_extends({},n,{pbSerialNumber:arrayToStr(n.pbSerialNumber.toJSON())});return{code:0,result:t?o:_extends({},o,{nLcdState:0})}});return function(n){return e.apply(this,arguments)}})(),changePIN=(()=>{var e=_asyncToGenerator(function*(e){return{code:yield lib.interface.PAEW_ChangePIN(e,0)}});return function(n){return e.apply(this,arguments)}})(),getAddress=(()=>{var e=_asyncToGenerator(function*(e,n,t,r){const i=new UInt32Array(t),o=new UInt8Array(constants$2.lengths.MAX_LEN_ADDR),s=ref.alloc("size_t",constants$2.lengths.MAX_LEN_ADDR);let _=0,c={};try{const a=n===constants$2.coins.COIN_TYPE_USDT?constants$2.coins.COIN_TYPE_BTC:n;if(_=yield lib.interface.PAEW_DeriveTradeAddress(e,0,a,i.buffer,t.length))return c={code:_};if(_=yield lib.interface.PAEW_GetTradeAddress(e,0,n,r,o.buffer,s))return c={code:_};let u="";if(n===constants$2.coins.COIN_TYPE_EOS){let n="",t="";const r=o.slice(0,s.deref()),i=r.buffer.indexOf(0);u=o.slice(0,i).buffer.readCString(),r.buffer.forEach(function(e,r){r<=i?n+=e.toString(16).padStart(2,"0"):r>i&&(t+=e.toString(16).padStart(2,"0"))});const a=new UInt8Array(constants$2.lengths.DEVICE_CHECK_CODE_LEN),E=ref.alloc("size_t",constants$2.lengths.DEVICE_CHECK_CODE_LEN);if(_=yield lib.interface.PAEW_GetDeviceCheckCode(e,0,a.buffer,E))return c={code:_};const f=a.slice(0,16),l=a.slice(16);let d="",T="";f.buffer.forEach(function(e){d+=e.toString(16).padStart(2,"0")}),l.buffer.forEach(function(e){T+=e.toString(16).padStart(2,"0")}),c={code:_,result:{address:u,EOSKEYHEX:n,EOSKEYSIG:t,EOSSN:d,EOSCODE:T}}}else n===constants$2.coins.COIN_TYPE_BTC||n===constants$2.coins.COIN_TYPE_LTC||n===constants$2.coins.COIN_TYPE_NEO||n===constants$2.coins.COIN_TYPE_XRP||n===constants$2.coins.COIN_TYPE_CYB||n===constants$2.coins.COIN_TYPE_USDT?u=o.slice(0,s.deref()-1).buffer.readCString():n!==constants$2.coins.COIN_TYPE_ETH&&n!==constants$2.coins.COIN_TYPE_ETC||(u=`0x${o.slice(0,s.deref()).buffer.readCString()}`),c={code:_,result:{address:u}};return c}catch(e){return console.error(`get address error, coin type:${n}, derivePath: ${t}`,e),{code:constants$2.rets.UNKNOWN_FAIL}}});return function(n,t,r,i){return e.apply(this,arguments)}})(),signBTC=(()=>{var e=_asyncToGenerator(function*(e,n,t,r){const i=new UInt32Array(n),o=n.length,s=r.length,_=[],c=[],a=[],u=[],E=new UInt8Array(stringToBytes(t));r.forEach(function(e){const n=new UInt8Array(stringToBytes(e));u.push(n),_.push(n.length);const t=new UInt8Array(constants$2.lengths.MAX_LEN_BTC_SIG);c.push(t),a.push(constants$2.lengths.MAX_LEN_BTC_SIG)});const f=new StringArray(u),l=new UInt64Array(_),d=new StringArray(c),T=new UInt64Array(a);let C=yield lib.interface.PAEW_DeriveTradeAddress(e,0,constants$2.COIN_TYPE_BTC,i.buffer,o);if(C)return{code:C};if(C=yield lib.interface.PAEW_BTC_TXSign(e,0,s,f.buffer,l.buffer,E.buffer,E.length,d.buffer,T.buffer))return{code:C};const A=[];for(let e=0;e<s;e+=1){const n=bytesToString(d.get(e),T.get(e));A.push(n)}return{code:C,result:{strSigns:A}}});return function(n,t,r,i){return e.apply(this,arguments)}})(),signLTC=(()=>{var e=_asyncToGenerator(function*(e,n,t,r){const i=new UInt32Array(n),o=n.length,s=r.length,_=[],c=[],a=[],u=[],E=new UInt8Array(stringToBytes(t));r.forEach(function(e){const n=new UInt8Array(stringToBytes(e));u.push(n),_.push(n.length);const t=new UInt8Array(constants$2.lengths.MAX_LEN_LTC_SIG);c.push(t),a.push(constants$2.lengths.MAX_LEN_LTC_SIG)});const f=new StringArray(u),l=new UInt64Array(_),d=new StringArray(c),T=new UInt64Array(a);let C=yield lib.interface.PAEW_DeriveTradeAddress(e,0,constants$2.coins.COIN_TYPE_LTC,i.buffer,o);if(C)return{code:C};if(C=yield lib.interface.PAEW_LTC_TXSign(e,0,s,f.buffer,l.buffer,E.buffer,E.length,d.buffer,T.buffer))return{code:C};const A=[];for(let e=0;e<s;e+=1){const n=bytesToString(d.get(e),T.get(e));A.push(n)}return{code:C,result:{strSigns:A}}});return function(n,t,r,i){return e.apply(this,arguments)}})(),signNEO=(()=>{var e=_asyncToGenerator(function*(e,n,t,r){const i=new UInt32Array(n),o=n.length,s=r.length,_=[],c=[],a=new UInt8Array(constants$2.lengths.MAX_LEN_NEO_SIG),u=ref.alloc("size_t",constants$2.lengths.MAX_LEN_NEO_SIG),E=new UInt8Array(stringToBytes(t));r.forEach(function(e){const n=new UInt8Array(stringToBytes(e));c.push(n),_.push(n.length)});const f=new StringArray(c),l=new UInt64Array(_);let d=yield lib.interface.PAEW_DeriveTradeAddress(e,0,constants$2.coins.COIN_TYPE_NEO,i.buffer,o);if(d)return{code:d};if(d=yield lib.interface.PAEW_NEO_TXSign(e,0,s,f.buffer,l.buffer,E.buffer,E.length,a.buffer,u))return{code:d};const T=a.get(0);return{code:d,result:{signs:{invocation:bytesToString(a,T+1),verification:`${bytesToString(a,a.get(T+2)+1,T+2)}ac`}}}});return function(n,t,r,i){return e.apply(this,arguments)}})(),signEthereum=(()=>{var e=_asyncToGenerator(function*(e,n,t,r,i){const o={},s=new UInt32Array(n),_=n.length,c=new UInt8Array(constants$2.lengths.MAX_LEN_ETH_SIG),a=ref.alloc("size_t",120),u=new UInt8Array(stringToBytes(t)),E=r?constants$2.coins.COIN_TYPE_ETH:constants$2.coins.COIN_TYPE_ETC;let f=yield lib.interface.PAEW_DeriveTradeAddress(e,0,E,s.buffer,_);if(f)return{code:f};if(void 0!==i&&null!==i&&void 0!==i.name&&null!==i.name&&""!==i.name&&void 0!==i.decimal&&null!==i.decimal&&(f=yield lib.interface.PAEW_SetERC20Info(e,0,E,fastcall.makeStringBuffer(i.name),i.decimal)))return{code:f};if(f=r?yield lib.interface.PAEW_ETH_TXSign(e,0,u.buffer,u.length,c.buffer,a):yield lib.interface.PAEW_ETC_TXSign(e,0,u.buffer,u.length,c.buffer,a))return{code:f};const l=bytesToString(c,a.deref());return o.raw=l,o.r=`0x${l.slice(0,64)}`,o.s=`0x${l.slice(64,128)}`,o.v=`0x${l.slice(128)}`,{code:f,result:{sign:o}}});return function(n,t,r,i,o){return e.apply(this,arguments)}})(),signCYB=(()=>{var e=_asyncToGenerator(function*(e,n,t){const r=new UInt32Array(n),i=n.length,o=new UInt8Array(constants$2.lengths.MAX_LEN_CYB_SIG),s=ref.alloc("size_t",constants$2.lengths.MAX_LEN_CYB_SIG),_=new UInt8Array(stringToBytes(t));let c=yield lib.interface.PAEW_DeriveTradeAddress(e,0,constants$2.coins.COIN_TYPE_CYB,r.buffer,i);if(c)return{code:c};if(c=yield lib.interface.PAEW_CYB_TXSign(e,0,_.buffer,_.length,o.buffer,s))return{code:c};return{code:c,result:{signature:`${(o.get(64)+31).toString(16)}${bytesToString(o,64)}`}}});return function(n,t,r){return e.apply(this,arguments)}})(),signEOS=(()=>{var e=_asyncToGenerator(function*(e,n,t){const r=new UInt32Array(n),i=n.length,o=new UInt8Array(constants$2.lengths.MAX_LEN_EOS_SIG),s=ref.alloc("size_t",constants$2.lengths.MAX_LEN_EOS_SIG),_=new UInt8Array(stringToBytes(t));let c=yield lib.interface.PAEW_DeriveTradeAddress(e,0,constants$2.coins.COIN_TYPE_EOS,r.buffer,i);if(c)return{code:c};if(c=yield lib.interface.PAEW_EOS_TXSign(e,0,_.buffer,_.length,o.buffer,s))return{code:c};return{code:c,result:{signature:o.slice(0,s.deref()-1).buffer.readCString()}}});return function(n,t,r){return e.apply(this,arguments)}})(),signXRP=(()=>{var e=_asyncToGenerator(function*(e,n,t){const r=new UInt32Array(n),i=n.length,o=new UInt8Array(constants$2.lengths.MAX_LEN_XRP_SIG),s=ref.alloc("size_t",constants$2.lengths.MAX_LEN_XRP_SIG),_=new UInt8Array(stringToBytes(t));let c=yield lib.interface.PAEW_DeriveTradeAddress(e,0,constants$2.coins.COIN_TYPE_XRP,r.buffer,i);if(c)return{code:c};if(c=yield lib.interface.PAEW_XRP_TXSign(e,0,_.buffer,_.length,o.buffer,s))return{code:c};return{code:c,result:{sign:bytesToString(o,s.deref())}}});return function(n,t,r){return e.apply(this,arguments)}})(),getPubKey=(()=>{var e=_asyncToGenerator(function*(e,n,t){const r=new UInt32Array(n),i=n.length,o=new UInt8Array(constants$2.lengths.MAX_LEN_PUBKEY),s=ref.alloc("size_t",constants$2.lengths.MAX_LEN_PUBKEY);let _=yield lib.interface.PAEW_DeriveTradeAddress(e,0,t,r.buffer,i);if(_)return{code:_};if(_=yield lib.interface.PAEW_GetPublicKey(e,0,t,o.buffer,s))return{code:_};return{code:_,result:{pubKey:bytesToString(o,s.deref())}}});return function(n,t,r){return e.apply(this,arguments)}})(),format=(()=>{var e=_asyncToGenerator(function*(e){return{code:yield lib.interface.PAEW_Format(e,0)}});return function(n){return e.apply(this,arguments)}})(),generateSeed=(()=>{var e=_asyncToGenerator(function*(e,n){return{code:yield lib.interface.PAEW_GenerateSeed(e,0,n,null,0)}});return function(n,t){return e.apply(this,arguments)}})(),importSeed=(()=>{var e=_asyncToGenerator(function*(e){const n=fastcall.makeStringBuffer("fake");return{code:yield lib.interface.PAEW_ImportSeed(e,0,n,0)}});return function(n){return e.apply(this,arguments)}})(),getLibraryVersion=(()=>{var e=_asyncToGenerator(function*(){const e=new UInt8Array(4),n=ref.alloc("size_t",4),t=yield lib.interface.PAEW_GetLibraryVersion(e.buffer,n);if(t)return{code:t};let r="";for(let n=0;n<4;n+=1)r+=3===n?e.get(n).toString():`${e.get(n).toString()}.`;return{code:t,result:r}});return function(){return e.apply(this,arguments)}})(),clearCOS=(()=>{var e=_asyncToGenerator(function*(e){const n=yield getDeviceInfo(e);switch(n.code){case 0:break;case constants$2.rets.DEV_COMMAND_INVALID:return{code:0};default:return{code:n.code}}const{result:{pbSerialNumber:t}}=n;let r=yield lib.interface.PAEW_ClearCOS(e,0);if(context)try{yield freeContext()}catch(e){return console.error(e),{code:constants$2.rets.DEV_HANDLE_INVALID}}return{code:r,pbSerialNumber:t}});return function(n){return e.apply(this,arguments)}})(),updateCOS=(()=>{var e=_asyncToGenerator(function*(e,n,t){const r=lib.interface.tFunc_Progress_Callback(function(e,n){return t&&t(n)}),i=yield lib.interface.PAEW_UpdateCOS_Ex(e,0,1,n,n.length,r,null);if(context)try{yield freeContext()}catch(e){return console.error(e),{result:constants$2.rets.DEV_HANDLE_INVALID}}return{code:i}});return function(n,t,r){return e.apply(this,arguments)}})(),verifyFileSignature=(()=>{var e=_asyncToGenerator(function*(e,n){const t=new UInt8Array(stringToBytes(n)),r=fastcall.makeStringBuffer(e);return{code:yield lib.interface.PAEW_VerifyFileECCSignature(r,t.buffer,t.length)}});return function(n,t){return e.apply(this,arguments)}})(),getDeviceCount=(()=>{var e=_asyncToGenerator(function*(){return{code:0,result:deviceCount}});return function(){return e.apply(this,arguments)}})();function _asyncToGenerator(e){return function(){var n=e.apply(this,arguments);return new bluebird(function(e,t){return function r(i,o){try{var s=n[i](o),_=s.value}catch(e){return void t(e)}if(!s.done)return bluebird.resolve(_).then(function(e){r("next",e)},function(e){r("throw",e)});e(_)}("next")})}}const{initLib:initLib$1,constants:constants$2}=require$$0$1,ref=fastcall.ref;let lib=initLib$1();const UInt64Array=lib.arrays.UInt64Array.type,UInt8Array=lib.arrays.UInt8Array.type,UInt32Array=lib.arrays.UInt32Array.type,StringArray=lib.arrays.StringArray.type;let context=null,deviceCount=0;const contextLock=mutexify(),timeout=5e3;function arrayToStr(e){let n="";for(let t=0;t<e.length;t+=1){const r=e[t];if(!(r>=48))break;n+=String.fromCharCode(r)}return n}function stringToBytes(e){const n=[];for(let t=0;t<e.length/2;t+=1)n.push(parseInt(e.slice(2*t,2*t+2),16));return n}function bytesToString(e,n,t){let r="";const i=n||e.length,o=t||0;for(let n=o;n<o+i;n+=1){const t=e.get(n).toString(16);r+=1===t.length?`0${t}`:t}return r}function initContext(){const e=ref.alloc(ref.refType(ref.refType(ref.types.void))),n=ref.alloc("int");return new bluebird((t,r)=>{lib.interface.PAEW_InitContext(e,n).then(i=>{deviceCount=n.deref(),i?r(i):t(e.deref())}).catch(e=>{console.error(e),deviceCount=0,r(e)})}).timeout(timeout)}function freeContext(){const e=new bluebird((e,n)=>{lib.interface.PAEW_FreeContext(context).then(()=>{deviceCount=0,e()}).catch(e=>{console.error(e),deviceCount=0,n(e)})}).timeout(timeout);return context=null,e}function init(){var e,n;usb.on("attach",n=>{257===n.deviceDescriptor.idProduct&&12042===n.deviceDescriptor.idVendor&&contextLock((e=_asyncToGenerator(function*(e){try{context||(context=yield initContext())}catch(e){console.error(e)}finally{e()}}),function(n){return e.apply(this,arguments)}))}),usb.on("detach",e=>{257===e.deviceDescriptor.idProduct&&12042===e.deviceDescriptor.idVendor&&contextLock((n=_asyncToGenerator(function*(e){try{context&&(yield freeContext())}catch(e){console.error(e)}finally{e()}}),function(e){return n.apply(this,arguments)}))})}function wrapper(e){return function(){var n,t=arguments;return new bluebird((r,i)=>{contextLock((n=_asyncToGenerator(function*(n){try{context||(context=yield initContext());const i=[context,...[...t].slice()],o=yield e(...i);r(o)}catch(e){console.error(e),context&&(yield freeContext().catch(console.error));let n=-1;e instanceof bluebird.TimeoutError?n=constants$2.rets.DEV_HANDLE_INVALID:"number"==typeof e&&(n=e),lib.release(),lib=initLib$1(),r({code:n,error:e})}finally{n()}}),function(e){return n.apply(this,arguments)}))})}}var core={init:init,getDeviceInfo:wrapper(getDeviceInfo),getDeviceCount:wrapper(getDeviceCount),changePIN:wrapper(changePIN),format:wrapper(format),getAddress:wrapper(getAddress),generateSeed:wrapper(generateSeed),importSeed:wrapper(importSeed),getLibraryVersion:getLibraryVersion,signBTC:wrapper(signBTC),signLTC:wrapper(signLTC),signNEO:wrapper(signNEO),signEthereum:wrapper(signEthereum),signCYB:wrapper(signCYB),signEOS:wrapper(signEOS),signXRP:wrapper(signXRP),getPubKey:wrapper(getPubKey),clearCOS:wrapper(clearCOS),updateCOS:wrapper(updateCOS),verifyFileSignature:verifyFileSignature,constants:constants$2},core_1=core.init,core_2=core.getDeviceInfo,core_3=core.getDeviceCount,core_4=core.changePIN,core_5=core.format,core_6=core.getAddress,core_7=core.generateSeed,core_8=core.importSeed,core_9=core.getLibraryVersion,core_10=core.signBTC,core_11=core.signLTC,core_12=core.signNEO,core_13=core.signEthereum,core_14=core.signCYB,core_15=core.signEOS,core_16=core.signXRP,core_17=core.getPubKey,core_18=core.clearCOS,core_19=core.updateCOS,core_20=core.verifyFileSignature,core_21=core.constants,core$1=Object.freeze({default:core,__moduleExports:core,init:core_1,getDeviceInfo:core_2,getDeviceCount:core_3,changePIN:core_4,format:core_5,getAddress:core_6,generateSeed:core_7,importSeed:core_8,getLibraryVersion:core_9,signBTC:core_10,signLTC:core_11,signNEO:core_12,signEthereum:core_13,signCYB:core_14,signEOS:core_15,signXRP:core_16,getPubKey:core_17,clearCOS:core_18,updateCOS:core_19,verifyFileSignature:core_20,constants:core_21}),core$2=core$1&&core||core$1,src=core$2;module.exports=src;
