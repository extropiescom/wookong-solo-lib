const { Promise } = require('bluebird');

const fs = require('fs');

const core = require('../lib');

const constants = core.constants;

let btcPath = [0, 0x8000002c, 0x80000000, 0x80000000, 0x00000000, 0x00000000];
let usdtPath = [0, 0x8000002c, 0x80000000, 0x80000000, 0x00000000, 0x00000000];
let ltcPath = [0, 0x8000002c, 0x80000002, 0x80000000, 0x00000000, 0x00000000];
let neoPath = [0, 0x8000002c, 0x80000378, 0x80000000, 0x00000000, 0x00000000];
let eosPath = [0, 0x8000002c, 0x800000c2, 0x80000000, 0x00000000, 0x00000000];
let ethPath = [0, 0x8000002c, 0x8000003c, 0x80000000, 0x00000000];
let etcPath = [0, 0x8000002c, 0x8000003d, 0x80000000, 0x00000000, 0x00000000];
let cybPath = [0, 0, 1, 0x80];
let xrpPath = [0, 0x8000002c, 0x80000090, 0x80000000, 0x00000000];

console.log('please confirm an UNCONFIGURED wookong solo is connected and unlocked, otherwise your digital assets may lost!');

beforeAll(async function() {
    // runs before all tests in this block
    jest.setTimeout(300000)
    let res = await core.getDeviceInfo();
    while (res.code !== constants.rets.SUCCESS || !(res.result) || res.result.ucPINState !== constants.devinfo.PIN_LOGIN) {
        if (res.code == constants.rets.DEV_COMMAND_INVALID) {
            break;
        }
        res = await core.getDeviceInfo();
    }
});

test("test GetDeviceCount ", async function() {
    const info = await core.getDeviceCount();
    expect(info.code).toEqual(constants.rets.SUCCESS);
    console.log('test GetDeviceCount, result:', info);
});

test("test GetDeviceInfo ", async function() {
    const info = await core.getDeviceInfo();
    expect(info.code).toEqual(constants.rets.SUCCESS);
    console.log('test GetDeviceInfo, DeviceInfo:', info);
});

test("test GetDeviceInfo ", async function() {
    const info = await core.getDeviceInfo();
    expect(info.code).toEqual(constants.rets.SUCCESS);
    console.log('test GetDeviceInfo, DeviceInfo:', info);
});

test("test GetLibraryVersion ", async function() {
    const info = await core.getLibraryVersion();
    expect(info.code).toEqual(constants.rets.SUCCESS);
    console.log('test GetLibraryVersion, LibraryVersion:', info);
});

test("test GenerateSeed ", async function() {
    const info = await core.generateSeed(32);
    expect(info.code).toEqual(constants.rets.SUCCESS);
});

test("test Format ------------- WARNING! It's a dangerous test!", async function testFormat() {
    let info = await core.format();
    expect(info.code).toEqual(constants.rets.SUCCESS);
});

test("test ImportSeed ", async function() {
    const info = await core.importSeed();
    expect(info.code).toEqual(constants.rets.SUCCESS);
});

test("test GetAddress show on screen", async function() {
    jest.setTimeout(300000)
    
    let pairs = [{ type: constants.coins.COIN_TYPE_BTC, path: btcPath },
        {type: constants.coins.COIN_TYPE_LTC, path: ltcPath },
        {type: constants.coins.COIN_TYPE_NEO, path: neoPath },
        {type: constants.coins.COIN_TYPE_EOS, path: eosPath },
        {type: constants.coins.COIN_TYPE_ETH, path: ethPath },
        {type: constants.coins.COIN_TYPE_ETC, path: etcPath },
        {type: constants.coins.COIN_TYPE_CYB, path: cybPath },
        {type: constants.coins.COIN_TYPE_XRP, path: xrpPath },
        {type: constants.coins.COIN_TYPE_USDT, path: usdtPath },
    ];
    for (const i of pairs) {
        let info = await core.getAddress(i.type, i.path, 1);
        expect(info.code).toEqual(constants.rets.SUCCESS);
        console.log(`test GetLibraryVersion, type: ${i.type}, addr:`, info);
    }
});

test("test ChangePIN ", async function () {
    jest.setTimeout(300000)
    let info = await core.changePIN();
    expect(info.code).toEqual(constants.rets.SUCCESS);
});

test("test SignEthereum ", async function testSignEthereum() {
    jest.setTimeout(300000)
    let txETH = 'ec098504a817c800825208943535353535353535353535353535353535353535880de0b6b3a764000080018080';
    let txETC = 'EC0C8504A817C8008301D4C094F2E6C2C9BDB2C2183B044E54E176C7D5DB7C70FE87038D7EA4C68000803D8080';
    let txERC20 = 'f8698084b2d05e008301d4c094859a9c0b44cb7066d956a958b0b82e54c9e44b4b80b844a9059cbb000000000000000000000000f03232ebb232786aff2dab33a6badc173a1656ab0000000000000000000000000000000000000000000000001d24b2dfac520000018080';
    let info = await core.signEthereum(ethPath, txETH, true, null);
    expect(info.code).toEqual(constants.rets.SUCCESS);
    console.log(`test SignEthereum in ETH, signResult:`, info);
    info = await core.signEthereum(etcPath, txETC, false, null);
    expect(info.code).toEqual(constants.rets.SUCCESS);
    console.log(`test SignEthereum in ETC, signResult:`, info);
    info = await core.signEthereum(ethPath, txERC20, true, { name: 'iETH', decimal: 18 });
    expect(info.code).toEqual(constants.rets.SUCCESS);
    console.log(`test SignEthereum in ERC20, signResult:`, info);
});

test("test SignCYB ", async function testSignCYB() {
    jest.setTimeout(300000)
    let tx = '26e9bf2206a1d15c7e5b0100e8030000000000000080af0280af020a00000000000000000001040a7a68616e6773793133330343594203435942050500';
    let info = await core.signCYB(cybPath, tx);
    expect(info.code).toEqual(constants.rets.SUCCESS);
    console.log(`test SignCYB, signResult:`, info);
});

test("test SignEOS ", async function testSignEOS() {
    let tx = '740970d9ff01b504632fede1adc3dfe55990415e4fde01e1b8f315f8136f476c14c2675b01245f705dd7000000000100a6823403ea3055000000572d3ccdcd012029c2ca557a735700000000a8ed3232212029c2ca557a735790558c8677954c3c102700000000000004454f530000000000000000000000000000000000000000000000000000000000000000000000000000';
    let info = await core.signEOS(eosPath, tx);
    expect(info.code).toEqual(constants.rets.SUCCESS);
    console.log(`test SignEOS, signResult:`, info);
});

test("test SignBTC ", async function testSignBTC() {
    let utxo1 = '0100000003e0b11a9515ee6d6b5408af881d6e4475ddbd4f4cabcffa7300fc95367fe53fd0010000006b483045022100d7e836519e2b085cae1ce9c4ee4566e14c31cf276ebc78d45b8655f84f763e5c02204fb483a7a4e5f100cbcdd223f3c21820d9e8c9f6a67f2b06bd52def46634bad901210395e0571b441e0f2fd932906a3fd68a57098a5552dd62e22387139b1f6078223dffffffffe0b11a9515ee6d6b5408af881d6e4475ddbd4f4cabcffa7300fc95367fe53fd0000000006a47304402205efa7719ce8db5454c55c21a97e89ecee20e167b848163225a30b630b2abb870022012a24df9f0c764843b8ee58a56632fc84bda23ccf7a74cade945e7c16796a42701210395e0571b441e0f2fd932906a3fd68a57098a5552dd62e22387139b1f6078223dffffffff09fb2cc0a873800b67fb143983f66d7a02a6fb7402356c64246720f31fb9eeaf010000006a473044022025dda0ab1822b2878496116b36db239aeb982760a86039fdd5c371341378763802206460f35b32a292d20473a867735068c1cff3f006eb27a15922d3b723ce92fb5401210395e0571b441e0f2fd932906a3fd68a57098a5552dd62e22387139b1f6078223dffffffff020046c323000000001976a914cd557a2e83fb75185073a301da772885183b580c88ac1139c005000000001976a914cd557a2e83fb75185073a301da772885183b580c88ac00000000';
    let utxo2 = '0100000001dee079359248299e3f24e7877c6b1c2f361b54741f00b8056fc5001cdc750794000000006a47304402200dbbca4874b83623ea6c31970df49efbc371c120a933ea7f5ad707f7a0bc57ab02207cd31405cbcb5520e635079f1b8a8bdec9e7ea6c5aa5997ea1ee659ee4efdd7701210395e0571b441e0f2fd932906a3fd68a57098a5552dd62e22387139b1f6078223dffffffff020046c323000000001976a914cd557a2e83fb75185073a301da772885183b580c88ac60b9eb0b000000001976a914cd557a2e83fb75185073a301da772885183b580c88ac00000000';
    let tx = '0100000002bf69089d98b93cd3e54fb2cc4575de550fa46b4901c8d3f59ca318fc63e002770000000000ffffffffcd6e85a4e533f56f658b80b19dee114f0bc4b0c780eb683b59221c6fe181d3570000000000ffffffff02bbb3eb0b000000001976a914cd557a2e83fb75185073a301da772885183b580c88ac00ca9a3b000000001976a914BD2CBCF0DD693F73568F7D44C8AC26C5DAD5210088ac0000000';
    let utxos = [utxo1, utxo2];
    let info = await core.signBTC(btcPath, tx, utxos);
    expect(info.code).toEqual(constants.rets.SUCCESS);
    console.log(`test SignBTC, signResult:`, info);
});

test("test SignUSDT ", async function testSignUSDT() {
    let utxo1 = '0100000003E0B11A9515EE6D6B5408AF881D6E4475DDBD4F4CABCFFA7300FC95367FE53FD0010000006B483045022100D7E836519E2B085CAE1CE9C4EE4566E14C31CF276EBC78D45B8655F84F763E5C02204FB483A7A4E5F100CBCDD223F3C21820D9E8C9F6A67F2B06BD52DEF46634BAD901210395E0571B441E0F2FD932906A3FD68A57098A5552DD62E22387139B1F6078223DFFFFFFFFE0B11A9515EE6D6B5408AF881D6E4475DDBD4F4CABCFFA7300FC95367FE53FD0000000006A47304402205EFA7719CE8DB5454C55C21A97E89ECEE20E167B848163225A30B630B2ABB870022012A24DF9F0C764843B8EE58A56632FC84BDA23CCF7A74CADE945E7C16796A42701210395E0571B441E0F2FD932906A3FD68A57098A5552DD62E22387139B1F6078223DFFFFFFFF09FB2CC0A873800B67FB143983F66D7A02A6FB7402356C64246720F31FB9EEAF010000006A473044022025DDA0AB1822B2878496116B36DB239AEB982760A86039FDD5C371341378763802206460F35B32A292D20473A867735068C1CFF3F006EB27A15922D3B723CE92FB5401210395E0571B441E0F2FD932906A3FD68A57098A5552DD62E22387139B1F6078223DFFFFFFFF020046C323000000001976A914CD557A2E83FB75185073A301DA772885183B580C88AC1139C005000000001976A914CD557A2E83FB75185073A301DA772885183B580C88AC0400000000';
    let utxo2 = '0100000001DEE079359248299E3F24E7877C6B1C2F361B54741F00B8056FC5001CDC750794000000006A47304402200DBBCA4874B83623EA6C31970DF49EFBC371C120A933EA7F5AD707F7A0BC57AB02207CD31405CBCB5520E635079F1B8A8BDEC9E7EA6C5AA5997EA1EE659EE4EFDD7701210395E0571B441E0F2FD932906A3FD68A57098A5552DD62E22387139B1F6078223DFFFFFFFF020046C323000000001976A914CD557A2E83FB75185073A301DA772885183B580C88AC60B9EB0B000000001976A914CD557A2E83FB75185073A301DA772885183B580C88AC0400000000';
    let tx = '0100000002BF69089D98B93CD3E54FB2CC4575DE550FA46B4901C8D3F59CA318FC63E002770000000000FFFFFFFFCD6E85A4E533F56F658B80B19DEE114F0BC4B0C780EB683B59221C6FE181D3570000000000FFFFFFFF030000000000000000166A146F6D6E69000000000000001F00000002E782228022020000000000001976A914844914D214A4115EED7D51048C701FA3CAE1288188AC3B0C7700000000001976A914BD2CBCF0DD693F73568F7D44C8AC26C5DAD5210088AC0400000000';
    let utxos = [utxo1, utxo2];
    let info = await core.signBTC(btcPath, tx, utxos);
    expect(info.code).toEqual(constants.rets.SUCCESS);
    console.log(`test SignUSDT, signResult:`, info);
});

test("test SignLTC ", async function testSignLTC() {
    let utxo1 = '0100000003e0b11a9515ee6d6b5408af881d6e4475ddbd4f4cabcffa7300fc95367fe53fd0010000006b483045022100d7e836519e2b085cae1ce9c4ee4566e14c31cf276ebc78d45b8655f84f763e5c02204fb483a7a4e5f100cbcdd223f3c21820d9e8c9f6a67f2b06bd52def46634bad901210395e0571b441e0f2fd932906a3fd68a57098a5552dd62e22387139b1f6078223dffffffffe0b11a9515ee6d6b5408af881d6e4475ddbd4f4cabcffa7300fc95367fe53fd0000000006a47304402205efa7719ce8db5454c55c21a97e89ecee20e167b848163225a30b630b2abb870022012a24df9f0c764843b8ee58a56632fc84bda23ccf7a74cade945e7c16796a42701210395e0571b441e0f2fd932906a3fd68a57098a5552dd62e22387139b1f6078223dffffffff09fb2cc0a873800b67fb143983f66d7a02a6fb7402356c64246720f31fb9eeaf010000006a473044022025dda0ab1822b2878496116b36db239aeb982760a86039fdd5c371341378763802206460f35b32a292d20473a867735068c1cff3f006eb27a15922d3b723ce92fb5401210395e0571b441e0f2fd932906a3fd68a57098a5552dd62e22387139b1f6078223dffffffff020046c323000000001976a914cd557a2e83fb75185073a301da772885183b580c88ac1139c005000000001976a914cd557a2e83fb75185073a301da772885183b580c88ac00000000';
    let utxo2 = '0100000001dee079359248299e3f24e7877c6b1c2f361b54741f00b8056fc5001cdc750794000000006a47304402200dbbca4874b83623ea6c31970df49efbc371c120a933ea7f5ad707f7a0bc57ab02207cd31405cbcb5520e635079f1b8a8bdec9e7ea6c5aa5997ea1ee659ee4efdd7701210395e0571b441e0f2fd932906a3fd68a57098a5552dd62e22387139b1f6078223dffffffff020046c323000000001976a914cd557a2e83fb75185073a301da772885183b580c88ac60b9eb0b000000001976a914cd557a2e83fb75185073a301da772885183b580c88ac00000000';
    let tx = '0100000002bf69089d98b93cd3e54fb2cc4575de550fa46b4901c8d3f59ca318fc63e002770000000000ffffffffcd6e85a4e533f56f658b80b19dee114f0bc4b0c780eb683b59221c6fe181d3570000000000ffffffff0200ca9a3b000000001976a914cd557a2e83fb75185073a301da772885183b580c88acbbb3eb0b000000001976a914cd557a2e83fb75185073a301da772885183b580c88ac00000000';
    let utxos = [utxo1, utxo2];
    let info = await core.signLTC(ltcPath, tx, utxos);
    expect(info.code).toEqual(constants.rets.SUCCESS);
    console.log(`test SignLTC, signResult:`, info);
});

test("test SignNEO ", async function testSignNEO() {
    let utxo1 = '02000d2fead2f701f9f0ab25b4dee36f1324ab6162f2364495b8784c14a0a9393b3a370100034c38b2fcfb1929a43adc82583be8a2f8f856818fa7abaff815872dc70f73fd0000880d5d6598b2ab804a4222fd9d974becea492383ca7109885a9e3a964950e90a01002dba1a5cedf7c26122e853bf00082bc5e6b423a31d2015af364abcee082c64400000f5ddf131fe6080a6f87577c22806938e6e710f3c9869b34ad2ec1681b9e2ec900000f5ddf131fe6080a6f87577c22806938e6e710f3c9869b34ad2ec1681b9e2ec9001007f26c00a5f4e50cd0565e15c3fa515f2ba7fa88dfe8136f25ac684b9e5a640880000d13fa613284b7aa24f554e0ddb4a1d722f16bc66828261fb0fe27e0cff22899a0000626bccd65346d60d48765674ffe31d9c07611222671d15cb51c2e0d5cd710fe300008332becc8796fe73831f7eedfdfdb75b5512c9181b4fe6821319dc789df55962000048fe7161091bb7773617cb34c2034fa0a1ccd18ba9605a8f34a156ac84a1a9ab000018dec74f4267d0afc9dc9ee22cdcfa37ca855247dd258a66a63d5d3b973dcd1e0000febf4e99371568cabe370910cc1b034c9529c007036776a1b98507869eef37990000000001e72d286979ee6cb1b7e65dfddfb2e384100b8d148e7758de42e4168b71792c609526000000000000c5c01ed71436525dc1a748697b3344cbd6b1a0f2014140984d589c9bd9a269182963cef0ac54cd1dbc630cb0edfc386f763ce9501e3b3f67b490228d982ae4e7576c954d51f1f76b715b6acaa141d3038e23233dd9797c2321037b0d309e6d5fa8ca2ba96b0668fbab39260d4c4e694700b93165dd54805530bbac';
    let utxo2 = '0200012ace9614cfcca2bf7d0fb680b4ed22e697f386465348f5e9356fd269f587e67c0000000001e72d286979ee6cb1b7e65dfddfb2e384100b8d148e7758de42e4168b71792c60d23f000000000000c5c01ed71436525dc1a748697b3344cbd6b1a0f20141403777129b9957f91e994540749045d1c07021b3e0c64e5fd71fc4399e82bb5a217c4f2f7840ee3e68602bf4dadfd357b81040de33cafcc2de31edc60300852f6c2321037b0d309e6d5fa8ca2ba96b0668fbab39260d4c4e694700b93165dd54805530bbac';
    let tx = '800000020baa65fcf385ec1adf90a7a3249e349ccb482642113ec22471982ac9f6e8cd04000085f7a226ad5ca0a5025983c73ed556058b814e8ae8e43901eddbcb6d4bf85ec6000002e72d286979ee6cb1b7e65dfddfb2e384100b8d148e7758de42e4168b71792c601027000000000000c5c01ed71436525dc1a748697b3344cbd6b1a0f2e72d286979ee6cb1b7e65dfddfb2e384100b8d148e7758de42e4168b71792c60573f000000000000c5c01ed71436525dc1a748697b3344cbd6b1a0f2';
    let utxos = [utxo1, utxo2];
    let info = await core.signNEO(neoPath, tx, utxos);
    expect(info.code).toEqual(constants.rets.SUCCESS);
    console.log(`test SignNEO, signResult:`, info);
});

test("test GetPubKey ", async function testGetPubKey() {
    let info = await core.getPubKey(xrpPath, constants.coins.COIN_TYPE_XRP);
    expect(info.code).toEqual(constants.rets.SUCCESS);
    console.log(`test GetPubKey XRP, PubKey:`, info);
});

test("test SignXRP ", async function testSignXRP() {
    let tx = '53545800120000228000000024000967036140000000000186A068400000000000000A732102AFCCB4B29A86D50EF367BE689BBC6DE679D35EE54BD05D963FBCF1156BCC7F858114EF531520EBC1BA8958559F77483318BA8501560C8314C64A6FB05B2A2CDBC6852E0EC3FAA437CFA3B76D';
    let info = await core.signXRP(xrpPath, tx);
    expect(info.code).toEqual(constants.rets.SUCCESS);
    console.log(`test SignXRP, signResult:`, info);
});

test("test ClearCOS ------------- WARNING! It's a dangerous test!", async function testClearCOS() {
    let info = await core.clearCOS();
    expect(info.code).toEqual(constants.rets.SUCCESS);
});

test("test UpdateCOS ", async function testUpdateCOS() {
    let path = '/var/temp/XXX.bin';
    const readFileAsync = Promise.promisify(fs.readFile);
    const [cosData] = await Promise.all([readFileAsync(path)]);
    const callback = (progress) => console.log('progress', progress);
    let info = await core.updateCOS(cosData, callback);
    expect(info.code).toEqual(constants.rets.SUCCESS);
});