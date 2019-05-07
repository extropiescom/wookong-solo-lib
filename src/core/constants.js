const rets = {};
// return values
rets.SUCCESS = 0x00000000; // success
rets.UNKNOWN_FAIL = 0x80000001; // unknown failure
rets.ARGUMENTBAD = 0x80000002; // argument bad
rets.HOST_MEMORY = 0x80000003; // malloc memory failed
rets.DEV_ENUM_FAIL = 0x80000004; // enum device failed
rets.DEV_OPEN_FAIL = 0x80000005; // open device failed
rets.DEV_COMMUNICATE_FAIL = 0x80000006; // communicate failed
rets.DEV_NEED_PIN = 0x80000007; // device need user input pin to "unlock"
rets.DEV_OP_CANCEL = 0x80000008; // operation canceled
rets.DEV_KEY_NOT_RESTORED = 0x80000009; // operation need seed restored while current state is not restored
rets.DEV_KEY_ALREADY_RESTORED = 0x8000000a; // seed already restored
rets.DEV_COUNT_BAD = 0x8000000b; // errors such as no device, or device count must equal to N when init, device count must >=T and <=N when restore or sign
rets.DEV_RETDATA_INVALID = 0x8000000c; // received data length less than 2 or ret data structure invalid
rets.DEV_AUTH_FAIL = 0x8000000d; // device authentication failed
rets.DEV_STATE_INVALID = 0x8000000e; // life cycle or other device state not matched to current operation
rets.DEV_WAITING = 0x8000000f; // device waiting
rets.DEV_COMMAND_INVALID = 0x80000010; // command can not recognized by device
rets.DEV_RUN_COMMAND_FAIL = 0x80000011; // received data not 9000
rets.DEV_HANDLE_INVALID = 0x80000012; // device handle invalid
rets.COS_TYPE_INVALID = 0x80000013; // device cos type value must be DEV_INFO_COS_TYPE_XXX
rets.COS_TYPE_NOT_MATCH = 0x80000014; // device cos type not matched to current operation, such as dragon ball spec function calls personal e-wallet, or passed argument implies specific cos type while current cos type not match, or current insert devices' types are not the same
rets.DEV_BAD_SHAMIR_SPLIT = 0x80000015; // bad shamir split
rets.DEV_NOT_ONE_GROUP = 0x80000016; // dragon ball device is not belong to one group
rets.BUFFER_TOO_SAMLL = 0x80000017; // size of input buffer not enough to store return data
rets.TX_PARSE_FAIL = 0x80000018; // input transaction parse failed
rets.TX_UTXO_NEQ = 0x80000019; // count of input and UTXO is not equal
rets.TX_INPUT_TOO_MANY = 0x8000001a; // input count shouldn't larger than 100
rets.MUTEX_ERROR = 0x8000001b; // mutex error, such as create/free/lock/unlock
rets.COIN_TYPE_INVALID = 0x8000001c; // value of coin type must be COIN_TYPE_XXX
rets.COIN_TYPE_NOT_MATCH = 0x8000001d; // value of coin type must be equal to the value passed to DeriveTradeAddress
rets.DERIVE_PATH_INVALID = 0x8000001e; // derive path must start by 0x00000000, indicates m
rets.NOT_SUPPORTED = 0x8000001f; // call not supported
rets.INTERNAL_ERROR = 0x80000020; // library internal errors, such as internal structure definition mistake
rets.BAD_N_T = 0x80000021; // value of N or T is invalid
rets.TARGET_DEV_INVALID = 0x80000022; // when getting address or signing, dragon ball must select a target device by calling DeriveTradeAddress successfully first
rets.CRYPTO_ERROR = 0x80000023; // crypto error
rets.DEV_TIMEOUT = 0x80000024; // operation time out
rets.DEV_PIN_LOCKED = 0x80000025; // PIN locked
rets.DEV_PIN_CONFIRM_FAIL = 0x80000026; // set new pin error when confirm
rets.DEV_PIN_VERIFY_FAIL = 0x80000027; // input pin error when change pin or do other operation
rets.DEV_CHECKDATA_FAIL = 0x80000028; // input data check failed in device, usually caused by invalid CRC check
rets.DEV_DEV_OPERATING = 0x80000029; // user is operating device, please wait
rets.DEV_PIN_UNINIT = 0x8000002a; // PIN not initialized
rets.DEV_BUSY = 0x8000002b; // device is busy, such as when enroll or verify finger print, previous operation is not finished yet
rets.DEV_ALREADY_AVAILABLE = 0x8000002c; // device is available, not need to abort again
rets.DEV_DATA_NOT_FOUND = 0x8000002d; // required data is not found
rets.DEV_SENSOR_ERROR = 0x8000002e; // sensor (such as finger print sensor) error
rets.DEV_STORAGE_ERROR = 0x8000002f; // device storage error
rets.DEV_STORAGE_FULL = 0x80000030; // device storage full
rets.DEV_FP_COMMON_ERROR = 0x80000031; // finger print common error (such as finger print verify or enroll error)
rets.DEV_FP_REDUNDANT = 0x80000032; // finger print redundant error
rets.DEV_FP_GOOG_FINGER = 0x80000033; // finger print enroll step success
rets.DEV_FP_NO_FINGER = 0x80000034; // sensor haven't got any finger print
rets.DEV_FP_NOT_FULL_FINGER = 0x80000035; // sensor haven't got full finger print image
rets.DEV_FP_BAD_IMAGE = 0x80000036; // sensor haven't got valid image
rets.DEV_LOW_POWER = 0x80000037; // device power is too low
rets.DEV_TYPE_INVALID = 0x80000038; // invalid device type
rets.NO_VERIFY_COUNT = 0x80000039; // count of verification run out when doing signature
rets.AUTH_CANCEL = 0x8000003a; // not used yet
rets.PIN_LEN_ERROR = 0x8000003b; // PIN length error
rets.AUTH_TYPE_INVALID = 0x8000003c; // authenticate type invalid
rets.DEV_FUNC_INVALID = 0x8000003d; // user-defined device function invalid

Object.keys(rets).forEach((key) => {
  if (rets[key] > 0x80000000) {
    rets[key] = rets[key] - 1 - 0xffffffff;
  }
});

const coins = {};
coins.COIN_TYPE_BTC = 0x00;
coins.COIN_TYPE_ETH = 0x01;
coins.COIN_TYPE_CYB = 0x02;
coins.COIN_TYPE_EOS = 0x03;
coins.COIN_TYPE_LTC = 0x04;
coins.COIN_TYPE_NEO = 0x05;
coins.COIN_TYPE_ETC = 0x06;
coins.COIN_TYPE_XRP = 0x09;
coins.COIN_TYPE_USDT = 0x0A;

const lengths = {};

lengths.MAX_LEN_BTC_SIG = 112;
lengths.MAX_LEN_LTC_SIG = 112;
lengths.MAX_LEN_NEO_SIG = 112;
lengths.MAX_LEN_CYB_SIG = 65;
lengths.MAX_LEN_ETH_SIG = 69;
lengths.MAX_LEN_XRP_SIG = 112;
lengths.MAX_LEN_EOS_SIG = 256;

lengths.MAX_LEN_SIG = lengths.MAX_LEN_EOS_SIG;

lengths.MAX_LEN_PUBKEY = 96;

lengths.PROCMSG = 256;


lengths.MAX_LEN_ADDR = 0x80;

lengths.DEVICE_CHECK_CODE_LEN = 0x50;

const devinfo = {};
devinfo.TYPE_PIN_STATE = 0x00000001;
devinfo.TYPE_COS_TYPE = 0x00000002;
devinfo.TYPE_CHAIN_TYPE = 0x00000004;
devinfo.TYPE_SN = 0x00000008;
devinfo.TYPE_COS_VERSION = 0x00000010;
devinfo.TYPE_LIFECYCLE = 0x00000020;
devinfo.TYPE_SESSKEY_HASH = 0x00000040;
devinfo.TYPE_N_T = 0x00000080;
devinfo.TYPE_LCD_STATE = 0x00000100;
devinfo.TYPE_BLE_VERSION = 0x00000200;

devinfo.PIN_INVALID_STATE = 0xFF;
devinfo.PIN_LOGOUT = 0x00;
devinfo.PIN_LOGIN = 0x01;
devinfo.PIN_LOCKED = 0x02;
devinfo.PIN_UNSET = 0x03;

devinfo.CHAIN_TYPE_FORMAL = 0x01;
devinfo.CHAIN_TYPE_TEST = 0x02;

devinfo.SN_LEN = 0x20;

devinfo.COS_VERSION_LEN = 0x04;

devinfo.BLE_VERSION_LEN = 0x04;

devinfo.COS_TYPE_INDEX = 0x01;
devinfo.COS_TYPE_INVALID = 0xFF;
devinfo.COS_TYPE_DRAGONBALL = 0x00;
devinfo.COS_TYPE_PERSONAL = 0x01;
devinfo.COS_TYPE_BIO = 0x02;

devinfo.LIFECYCLE_INVALID = 0xFF;
devinfo.LIFECYCLE_AGREE = 0x01;
devinfo.LIFECYCLE_USER = 0x02;
devinfo.LIFECYCLE_PRODUCE = 0x04;

devinfo.SESSKEY_HASH_LEN = 0x04;
devinfo.N_T_INVALID = 0xFF;

devinfo.LCD_NULL = 0x00000000;
devinfo.LCD_SHOWLOGO = 0x00000001;
devinfo.LCD_WAITTING = 0x00000002;
devinfo.LCD_SHOWOK = 0x00000004;
devinfo.LCD_SHOWCANCEL = 0x00000008;
devinfo.LCD_SHOWSKEYHASH = 0x00000010;
devinfo.LCD_SHOWADDRESS = 0x00000020;
devinfo.LCD_SHOWBTCSIGN = 0x00000040;
devinfo.LCD_SHOWETHSIGN = 0x00000080;
devinfo.LCD_SETNEWPIN = 0x00000100;
devinfo.LCD_CHANGEPIN = 0x00000200;
devinfo.LCD_VERIFYPIN = 0x00000400;
devinfo.LCD_PINLOCKED = 0x00000800;
devinfo.LCD_FORMAT = 0x00001000;
devinfo.LCD_REBOOT = 0x00002000;
devinfo.LCD_SHOWBIP39 = 0x00004000;
devinfo.LCD_CHECKBIP39 = 0x00008000;
devinfo.LCD_SHOWBTSSIGN = 0x00010000;
devinfo.LCD_PINERROR  = 0x00020000;
devinfo.LCD_SELECT_MNENUM = 0x00040000;
devinfo.LCD_SHOWM = 0x00080000;
devinfo.LCD_SHOWTIMEOUT = 0x00100000;
devinfo.LCD_SHOWEOSSIGN = 0x00200000;
devinfo.LCD_SHOWFAIL = 0x00400000;
devinfo.LCD_SHOWNEOSIGN = 0x00800000;
devinfo.LCD_WAITING_TIMEOUT = 0x01000000;
devinfo.LCD_GET_MNENUM = 0x02000000;
devinfo.LCD_GETMNE_BYDEV = 0x04000000;

module.exports = {
  rets,
  coins,
  lengths,
  devinfo,
};
