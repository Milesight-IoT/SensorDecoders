/**
 * Payload Codec for Cellular
 *
 * Copyright 2024 Milesight IoT
 *
 * @product UC300
 */
function decodeUplink(buffer) {
    if (typeof buffer === "string") {
        buffer = Buffer.from(buffer.replace(/\s/g, ""), "hex");
    }
    const reader = new BufferReader(buffer);

    const startFlag = reader.readUInt8();
    const type = reader.readUInt8();
    const length = reader.readUInt16LE();

    const isOtaFrame = type === 0x15 || type === 0x95 || type === 0x96;
    if (isOtaFrame && startFlag !== 0x7e) {
        throw new Error(`Invalid start flag: ${startFlag}`);
    }
    if (isOtaFrame && length !== buffer.length) {
        throw new Error(`Invalid frame length: ${length}, expected ${buffer.length}`);
    }

    var decoded = {};
    switch (type) {
        case 0x15:
            decoded = decodeFirmwareUpgrade(reader, length);
            break;
        case 0x95:
            decoded = decodeUpgradeResp(reader, length);
            break;
        case 0x96:
            decoded = decodeUpgradeEvent(reader, length);
            break;
        case 0xf2:
            decoded = decodeChangeReport(reader);
            break;
        case 0xf3:
            decoded = decodeAttributeReport(reader);
            break;
        case 0xf4:
            decoded = decodePeriodReport(reader);
            break;
        default:
            throw new Error(`Unsupported type: ${type}`);
    }

    const endFlag = reader.readUInt8();
    if (isOtaFrame && endFlag !== 0x7e) {
        throw new Error(`Invalid end flag: ${endFlag}`);
    }

    return {
        startFlag,
        type,
        length,
        ...decoded,
        endFlag,
    };
}

const REG_LABELS = ["REG_COIL", "REG_DISCRETE", "REG_INPUT", "REG_HOLD_INT16", "REG_HOLD_INT32", "REG_HOLD_FLOAT", "REG_INPUT_INT32", "REG_INPUT_FLOAT", "REG_INPUT_INT32_AB", "REG_INPUT_INT32_CD", "REG_HOLD_INT32_AB", "REG_HOLD_INT32_CD"];

const isCounterMode = (mode) => mode === 2 || mode === 3;

const UPGRADE_RESP_LABELS = {
    0: "no error",
    1: "param error",
    2: "version check fail",
    3: "upgrade not supported",
    4: "start download fail",
    255: "internal error",
};

const UPGRADE_EVENT_LABELS = {
    0: "upgrade failed",
    1: "download started",
    2: "firmware verifying",
    3: "firmware migrating",
    4: "upgrade completed",
};

const UPGRADE_EVENT_CODE_LABELS = {
    0: "no error",
    1: "param error",
    2: "check fail",
    3: "file size error",
    4: "download fail",
    5: "flash write fail",
    6: "md5 check fail",
    7: "firmware crc check fail",
    8: "product id mismatch",
    255: "internal error",
};

const getUpgradeDataLength = (frameLength) => {
    if (frameLength < 5) {
        throw new Error(`Invalid frame length: ${frameLength}`);
    }
    return frameLength - 5;
};

const versionToString = (version) => `v${(version >>> 8) & 0xff}.${version & 0xff}`;

const decodeFirmwareUpgrade = (reader, frameLength) => {
    const dataLength = getUpgradeDataLength(frameLength);
    if (dataLength < 18) {
        throw new Error(`Invalid firmware_upgrade payload length: ${dataLength}`);
    }

    const version = reader.readUInt16BE();
    const md5 = reader.readHex(16);
    const url = reader.readString(dataLength - 18);

    return {
        cmd: "firmware_upgrade",
        ver: versionToString(version),
        md5,
        url,
    };
};

const decodeUpgradeResp = (reader, frameLength) => {
    const dataLength = getUpgradeDataLength(frameLength);
    if (dataLength !== 3) {
        throw new Error(`Invalid upgrade_resp payload length: ${dataLength}`);
    }

    const code = reader.readUInt8();
    const version = reader.readUInt16BE();

    return {
        cmd: "upgrade_resp",
        code,
        current_version: versionToString(version),
        msg: UPGRADE_RESP_LABELS[code] || "unknown",
    };
};

const decodeUpgradeEvent = (reader, frameLength) => {
    const dataLength = getUpgradeDataLength(frameLength);
    if (dataLength !== 4) {
        throw new Error(`Invalid upgrade_event payload length: ${dataLength}`);
    }

    const event = reader.readUInt8();
    const version = reader.readUInt16BE();
    const code = reader.readUInt8();

    return {
        cmd: "upgrade_event",
        event,
        event_name: UPGRADE_EVENT_LABELS[event] || "unknown",
        current_version: versionToString(version),
        code,
        msg: UPGRADE_EVENT_CODE_LABELS[code] || "unknown",
    };
};

const decodeChangeReport = (reader) => {
    const version = reader.readUInt8();
    const timestamp = reader.readUInt32LE();

    const diMode = reader.readBits(4);
    const hasDI = diMode.some((mode) => mode === 1);
    const hasCounter = diMode.some(isCounterMode);
    let din = [];
    let counter = [];
    if (hasDI) {
        din = reader.readBits(4);
    }
    if (hasCounter) {
        counter = diMode.map((mode) => (isCounterMode(mode) ? reader.readUInt32LE() : null));
    }

    const doutEnabled = reader.readBits(2);
    const hasDO = doutEnabled.some((mode) => mode);
    let dout = [];
    if (hasDO) {
        dout = reader.readBits(2);
    }
    return {
        version,
        timestamp,
        doutEnabled,
        dout,
        diMode,
        din,
        counter,
    };
};

const decodeAttributeReport = (reader) => {
    const version = reader.readUInt8();
    const ucpVersion = reader.readUInt8();
    const sn = reader.readASCII(16);
    const hardwareVersion = reader.readASCII(4);
    const firmwareVersion = reader.readString(4);
    const imei = reader.readASCII(15);
    const imsi = reader.readASCII(15);
    const iccid = reader.readASCII(20);

    return {
        version,
        ucpVersion,
        sn,
        hardwareVersion,
        firmwareVersion,
        imei,
        imsi,
        iccid,
    };
};

const decodePeriodReport = (reader) => {
    const version = reader.readUInt8();
    const timestamp = reader.readUInt32LE();
    const mobileSignal = reader.readUInt8();
    const doutEnabled = reader.readBits(2);
    const hasDO = doutEnabled.some((mode) => mode);
    let dout = [];
    if (hasDO) {
        dout = reader.readBits(2);
    }

    const diMode = reader.readBits(8, 2);
    const hasDI = diMode.some((mode) => mode === 1);
    const hasCounter = diMode.some(isCounterMode);
    let din = [];
    let counter = [];
    if (hasDI) {
        din = reader.readBits(4);
    }
    if (hasCounter) {
        counter = diMode.map((mode) => (isCounterMode(mode) ? reader.readUInt32LE() : null));
    }

    const ainMode = reader.readBits(16, 2);
    const ain = ainMode.map((mode, i) =>
        mode === 1
            ? {
                  index: i + 1,
                  count: 1,
                  timeStep: 0,
                  values: [{ ccy: reader.readFloatLE() }],
              }
            : {
                  index: i + 1,
                  count: 0,
                  timeStep: 0,
                  values: [],
              },
    );

    const sin = [];
    let i = 0;
    while (reader.getLeftSize() > 1) {
        const mode1 = reader.readUInt8();
        const mode2 = reader.readUInt8();

        // version: v1.0
        if (mode1 === 0x0a) {
            var index = mode1 >>> 4;
            var regType = REG_LABELS[mode1 & 0x0f];
        }
        // version: v1.1
        else {
            var index = mode1 >>> 3;
            var regType = REG_LABELS[mode1 & 0x07];
        }

        const sign = mode2 >>> 7;
        // const decimal = (mode2 & 0b1110000) >> 4;
        const decimal = 0;
        const collectSuccess = (mode2 & 0b1000) >> 3 === 1;
        const quantity = mode2 & 0b111;

        let value = [];
        switch (regType) {
            case "REG_COIL":
            case "REG_DISCRETE":
                value = array(quantity).map(() => reader.readUInt8());
                break;
            case "REG_INPUT":
            case "REG_HOLD_INT16":
                value = array(quantity).map(() => {
                    const val = sign ? reader.readInt16LE() : reader.readUInt16LE();
                    val.value = moveDecimal(val.value, decimal);
                    return val;
                });
                break;
            case "REG_HOLD_INT32":
            case "REG_INPUT_INT32":
            case "REG_INPUT_INT32_AB":
            case "REG_INPUT_INT32_CD":
            case "REG_HOLD_INT32_AB":
            case "REG_HOLD_INT32_CD":
                value = array(quantity).map(() => {
                    const val = sign ? reader.readInt32LE() : reader.readUInt32LE();
                    val.value = moveDecimal(val.value, decimal);
                    return val;
                });
                break;
            case "REG_HOLD_FLOAT":
            case "REG_INPUT_FLOAT":
                value = array(quantity).map(() => {
                    const val = reader.readFloatLE();
                    val.value = moveDecimal(val.value, decimal);
                    return val;
                });
                break;
        }

        sin.push({
            index: index + 1,
            length: 1,
            timeStep: 0,
            times: 1,
            collectSuccess,
            quantity,
            regType,
            sign,
            decimal,
            values: [value],
        });
        i++;
    }

    return {
        version,
        timestamp,
        mobileSignal,
        doutEnabled,
        dout,
        diMode,
        din,
        counter,
        ainMode,
        ain,
        sin,
    };
};

// Chirpstack v4
function encodeDownlink(input) {
    return { bytes: milesightDeviceEncode(input.data) };
}

// Chirpstack v3
function Encode(fPort, obj) {
    return milesightDeviceEncode(obj);
}

// The Things Network
function Encoder(obj, port) {
    return milesightDeviceEncode(obj);
}

function milesightDeviceEncode(payload) {
    if (payload && payload.cmd === "firmware_upgrade") {
        return encodeFirmwareUpgrade({
            version: payload.ver !== undefined ? payload.ver : payload.version,
            md5: payload.md5,
            url: payload.url,
        });
    }
    if (payload && payload.firmware_upgrade) {
        return encodeFirmwareUpgrade(payload.firmware_upgrade);
    }
    throw new Error("Unsupported command");
}

function encodeFirmwareUpgrade(upgrade) {
    if (!upgrade) {
        throw new Error("firmware_upgrade is required");
    }

    const version = parseVersion(upgrade.version !== undefined ? upgrade.version : upgrade.ver);
    const md5 = parseMd5(upgrade.md5);
    const url = encodeUtf8(upgrade.url || "");
    if (url.length === 0) {
        throw new Error("firmware_upgrade.url is required");
    }

    const dataLength = 2 + 16 + url.length;
    const frameLength = dataLength + 5;
    if (frameLength > 0xffff) {
        throw new Error("firmware_upgrade.url is too long");
    }

    let bytes = [0x7e, 0x15, frameLength & 0xff, (frameLength >>> 8) & 0xff, (version >>> 8) & 0xff, version & 0xff];
    bytes = bytes.concat(md5, url, [0x7e]);
    return bytes;
}

function parseVersion(value) {
    if (typeof value === "number") {
        if (!Number.isInteger(value) || value < 0 || value > 0xffff) {
            throw new Error("firmware_upgrade.version must be between 0 and 65535");
        }
        return value;
    }

    const match = /^v?(\d{1,3})\.(\d{1,3})$/.exec(String(value));
    if (!match) {
        throw new Error("firmware_upgrade.version must be in vMajor.minor format");
    }

    const major = parseInt(match[1], 10);
    const minor = parseInt(match[2], 10);
    if (major > 255 || minor > 255) {
        throw new Error("firmware_upgrade.version major and minor must be between 0 and 255");
    }
    return (major << 8) | minor;
}

function parseMd5(value) {
    if (typeof value !== "string" || !/^[0-9a-fA-F]{32}$/.test(value)) {
        throw new Error("firmware_upgrade.md5 must be a 32-character hex string");
    }

    const bytes = [];
    for (let i = 0; i < 32; i += 2) {
        bytes.push(parseInt(value.slice(i, i + 2), 16));
    }
    return bytes;
}

function encodeUtf8(str) {
    const bytes = [];
    for (let i = 0; i < str.length; i++) {
        let code = str.charCodeAt(i);
        if (code >= 0xd800 && code <= 0xdbff && i + 1 < str.length) {
            const next = str.charCodeAt(i + 1);
            if (next >= 0xdc00 && next <= 0xdfff) {
                code = 0x10000 + ((code - 0xd800) << 10) + (next - 0xdc00);
                i++;
            }
        }

        if (code < 0x80) {
            bytes.push(code);
        } else if (code < 0x800) {
            bytes.push(0xc0 | (code >> 6), 0x80 | (code & 0x3f));
        } else if (code < 0x10000) {
            bytes.push(0xe0 | (code >> 12), 0x80 | ((code >> 6) & 0x3f), 0x80 | (code & 0x3f));
        } else {
            bytes.push(0xf0 | (code >> 18), 0x80 | ((code >> 12) & 0x3f), 0x80 | ((code >> 6) & 0x3f), 0x80 | (code & 0x3f));
        }
    }
    return bytes;
}

function decode_UART_F4(buffer) {
    if (typeof buffer === "string") {
        buffer = Buffer.from(buffer.replace(/\s/g, ""), "hex");
    }
    const reader = new BufferReader(buffer);

    return {
        startFlag: reader.readUInt8(),
        type: reader.readUInt8(),
        length: reader.readUInt16LE(),
        ...decode(reader),
        endFlag: reader.readUInt8(),
    };
}

function array(length) {
    return new Array(length).fill(null);
}

function moveDecimal(value, decimal) {
    return decimal ? value / Math.pow(10, decimal) : value;
}

class BufferReader {
    constructor(buffer) {
        this.buffer = buffer;
        this.offset = 0;
    }

    hasNextByte() {
        return this.buffer.length > this.offset;
    }

    readBits(bits = 8, step = 1) {
        const result = [];
        const bytes = Math.ceil(bits / 8);
        for (let it = 0; it < bytes; it++) {
            const binary = this.buffer.readUInt8(this.getAndIncOffset(1));
            let mask = 0b1;
            for (let i = 0; i < step; i++) {
                mask = mask | (mask << i);
            }
            for (let idx = 0, i = 0; i < Math.min(bits, 8); i += step, idx++) {
                result[idx + Math.floor((it * 8) / step)] = (binary >> i) & mask;
            }
        }
        return result;
    }

    readInt8() {
        return this.buffer.readInt8(this.getAndIncOffset(1));
    }

    readUInt8() {
        return this.buffer.readUInt8(this.getAndIncOffset(1));
    }

    readInt16LE() {
        return this.buffer.readInt16LE(this.getAndIncOffset(2));
    }

    readUInt16LE() {
        return this.buffer.readUInt16LE(this.getAndIncOffset(2));
    }

    readUInt16BE() {
        return this.buffer.readUInt16BE(this.getAndIncOffset(2));
    }

    readInt32LE() {
        return this.buffer.readInt32LE(this.getAndIncOffset(4));
    }

    readUInt32LE() {
        return this.buffer.readUInt32LE(this.getAndIncOffset(4));
    }

    readFloatLE() {
        return this.buffer.readFloatLE(this.getAndIncOffset(4));
    }

    readString(length) {
        return this.buffer.toString(undefined, this.getAndIncOffset(length), this.offset).replace(/\0/g, "");
    }

    readASCII(length) {
        return this.buffer.toString("ascii", this.getAndIncOffset(length), this.offset);
    }

    readHex(length) {
        return this.buffer.toString("hex", this.getAndIncOffset(length), this.offset);
    }

    readBuffer(length) {
        return this.buffer.slice(this.getAndIncOffset(length), this.offset);
    }

    getAndIncOffset(inc = 1) {
        this.offset += inc;
        if (this.offset > this.buffer.length) {
            throw new Error("Index Out Of Bounds!");
        }
        return this.offset - inc;
    }

    getLeftSize() {
        return this.buffer.length - this.offset;
    }
}
