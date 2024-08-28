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

const REG_LABELS = ["REG_COIL", "REG_DISCRETE", "REG_INPUT", "REG_HOLD_INT16", "REG_HOLD_INT32", "REG_HOLD_FLOAT", "REG_INPUT_INT32", "REG_INPUT_FLOAT", "REG_INPUT_INT32_AB", "REG_INPUT_INT32_CD", "REG_HOLD_INT32_AB", "REG_HOLD_INT32_CD"];

const isCounterMode = (mode) => mode === 2 || mode === 3;

const decode = (reader) => {
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
              }
    );

    const sin = [];
    let i = 0;
    while (reader.getLeftSize() > 1) {
        const mode1 = reader.readUInt8();
        const mode2 = reader.readUInt8();
        const index = (mode1 & 0b11110000) >> 4;
        const regType = REG_LABELS[mode1 & 0b1111];
        const sign = (mode2 & 0b10000000) >> 7;
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

function decode_UART_F4(buffer) {
    if (typeof buffer === "string") {
        buffer = Buffer.from(buffer.replace(/\s/g, ""), "hex");
    }
    const reader = new BufferReader(buffer);

    return {
        startFlag: reader.readUInt8(),
        type: reader.readUInt8(),
        length: reader.readUInt16LE(),
        version: reader.readUInt8(),
        ...decode(reader),
        endFlag: reader.readUInt8(),
    };
}
