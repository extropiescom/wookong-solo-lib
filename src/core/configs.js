module.exports = {
  array: [
    'uchar[] UCharArray',
    'uint64[] UInt64Array',
    'uint8[] UInt8Array',
    'uint32[] UInt32Array',
    'UInt8Array[] StringArray',
  ],
  struct: [
    `struct DevInfo
    {
      uint8 ucPINState;
      uint8 ucCOSType;
      uint8 ucChainType;
      UCharArray[32] pbSerialNumber;
      UCharArray[4] pbCOSVersion;
      uint8 ucLifeCycle;
      size_t nLcdState;
      UCharArray[4] pbSessKeyHash;
      uint8 nN;
      uint8 nT;
      UCharArray[4] pbBLEVersion;
    }`.split('\n').join(''),
  ],
  callback: [
    'int (*tFunc_Progress_Callback)(void*, size_t)',
    'int (*tFunc_PutState_Callback)(void*, int)',
  ],
  asyncFunction: [
    'int PAEW_InitContext(void** ppPAEWContext, size_t* pnDevCount)',
    'int PAEW_GetDevInfo(void* pPAEWContext, size_t nDevIndex, uint32 nDevInfoType, DevInfo* pDevInfo)',
    'int PAEW_GetLibraryVersion(uint8* pbVersion, size_t* pnVersionLen)',
    'int PAEW_GenerateSeed(void* pPAEWContext, size_t nDevIndex, uint8 nSeedLen, uint8 nN, uint8 nT)',
    'int PAEW_ImportSeed(void* pPAEWContext, size_t nDevIndex, uint8*  pbMneWord, size_t nMneWordLen)',
    'int PAEW_DeriveTradeAddress(void* pPAEWContext, size_t nDevIndex, uint8 nCoinType, uint32* puiDerivePath, size_t nDerivePathLen)',
    'int PAEW_GetTradeAddress(void* pPAEWContext, size_t nDevIndex, uint8 nCoinType, uint8 nShowOnScreen, uint8* pbTradeAddress, size_t* pnTradeAddressLen)',
    'int PAEW_GetPublicKey(void* pPAEWContext, size_t nDevIndex, uint8 nCoinType, uint8* pbPublicKey, size_t* pnPublicKeyLen)',
    'int PAEW_BTC_TXSign(void* pPAEWContext, size_t nDevIndex, size_t nUTXOCount, uint8** ppbUTXO, size_t* pnUTXOLen, uint8* pbCurrentTX, size_t nCurrentTXLen, uint8** ppbTXSig, size_t* pnTXSigLen)',
    'int PAEW_LTC_TXSign(void* pPAEWContext, size_t nDevIndex, size_t nUTXOCount, uint8** ppbUTXO, size_t* pnUTXOLen, uint8* pbCurrentTX, size_t nCurrentTXLen, uint8** ppbTXSig, size_t* pnTXSigLen)',
    'int PAEW_NEO_TXSign(void* pPAEWContext, size_t nDevIndex, size_t nUTXOCount, uint8** ppbUTXO, size_t* pnUTXOLen, uint8* pbCurrentTX, size_t nCurrentTXLen, uint8** ppbTXSig, size_t* pnTXSigLen)',  
    'int PAEW_ETH_TXSign(void* pPAEWContext, size_t nDevIndex, uint8* pbCurrentTX, size_t nCurrentTXLen, uint8* pbTXSig, size_t* pnTXSigLen)',
    'int PAEW_ETC_TXSign(void* pPAEWContext, size_t nDevIndex, uint8* pbCurrentTX, size_t nCurrentTXLen, uint8* pbTXSig, size_t* pnTXSigLen)',
    'int PAEW_CYB_TXSign(void* pPAEWContext, size_t nDevIndex, uint8* pbCurrentTX, size_t nCurrentTXLen, uint8* pbTXSig, size_t* pnTXSigLen)',
    'int PAEW_EOS_TXSign(void* pPAEWContext, size_t nDevIndex, uint8* pbCurrentTX, size_t nCurrentTXLen, uint8* pbTXSig, size_t* pnTXSigLen)',
    'int PAEW_XRP_TXSign(void* pPAEWContext, size_t nDevIndex, uint8* pbCurrentTX, size_t nCurrentTXLen, uint8* pbTXSig, size_t* pnTXSigLen)',
    'int PAEW_ChangePIN(void* pPAEWContext, size_t nDevIndex)',
    'int PAEW_Format(void * pPAEWContext, size_t nDevIndex)',
    'int PAEW_SetERC20Info(void* pPAEWContext, size_t nDevIndex, uint8 nCoinType, char* szTokenName, uint8 nPrecision)',
    'int PAEW_GetDeviceCheckCode(void* pPAEWContext, size_t nDevIndex, uint8* pbCheckCode, size_t* pnCheckCodeLen)',
    'int PAEW_VerifyFileECCSignature(char* szFileFullPath, uint8* pbSignature, size_t nSignatureLen)',
    'int PAEW_ClearCOS(void* pPAEWContext, size_t nDevIndex)',
    'int PAEW_UpdateCOS(void* pPAEWContext, size_t nDevIndex, uint8* pbUserCOSData, size_t nUserCOSDataLen)',
    'int PAEW_UpdateCOS_Ex(void* pPAEWContext, size_t nDevIndex, uint8 bRestart, uint8* pbUserCOSData, size_t nUserCOSDataLen, tFunc_Progress_Callback pProgressCallback, void* pCallbackContext)',
    'int PAEW_FreeContext(void* pPAEWContext)',
  ],
};
