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

    readBits(count = 8) {
        const result = [];
        const binary = this.buffer.readUInt8(this.getAndIncOffset(1));
        for (let idx = 0; idx < count; idx++) {
            result[idx] = (binary >> idx) & 1;
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
}

const REG_LABELS = ["REG_COIL", "REG_DISCRETE", "REG_INPUT", "REG_HOLD_INT16", "REG_HOLD_INT32", "REG_HOLD_FLOAT", "REG_INPUT_INT32", "REG_INPUT_FLOAT", "REG_INPUT_INT32_AB", "REG_INPUT_INT32_CD", "REG_HOLD_INT32_AB", "REG_HOLD_INT32_CD"];

const decodeSinValue = (reader) => (v, i) => {
    const length = reader.readUInt8();
    const timeStep = reader.readUInt32LE();
    const regType = REG_LABELS[reader.readUInt8()];
    const quantity = reader.readUInt8();
    const sign = reader.readUInt8();
    const decimal = reader.readUInt8();
    let times = quantity !== 0 ? length / quantity : 0;

    let values = [];
    switch (regType) {
        case "REG_COIL":
        case "REG_DISCRETE":
            values = array(times).map(() => array(quantity).map(() => reader.readUInt8()));
            break;
        case "REG_INPUT":
        case "REG_HOLD_INT16":
        case "REG_INPUT_INT32_AB":
        case "REG_INPUT_INT32_CD":
        case "REG_HOLD_INT32_AB":
        case "REG_HOLD_INT32_CD":
            times /= 2;
            values = array(times).map(() =>
                array(quantity).map(() => {
                    const val = sign ? reader.readInt16LE() : reader.readUInt16LE();
                    return moveDecimal(val, decimal);
                }),
            );
            break;
        case "REG_HOLD_INT32":
        case "REG_INPUT_INT32":
            times /= 4;
            values = array(times).map(() =>
                array(quantity).map(() => {
                    const val = sign ? reader.readInt32LE() : reader.readUInt32LE();
                    return moveDecimal(val, decimal);
                }),
            );
            break;
        case "REG_HOLD_FLOAT":
        case "REG_INPUT_FLOAT":
            times /= 4;
            values = array(times).map(() =>
                array(quantity).map(() => {
                    const val = reader.readFloatLE();
                    return moveDecimal(val, decimal);
                }),
            );
            break;
    }

    return {
        index: i + 1,
        length,
        timeStep,
        regType,
        quantity,
        sign,
        decimal,
        times,
        values,
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
        timestamp: reader.readUInt32LE(),
        mobileSignal: reader.readUInt8(),
        din: reader.readBits(1),
        dout: reader.readBits(1),
        sin: array(8).map(decodeSinValue(reader)),
        endFlag: reader.readUInt8(),
    };
}

const payload = `   7EF4 6D00 021C 8256 5D11 0000 0405 0000 
                    0003 0100 0009 0009 0004 0500 0000 0301 
                    0000 0A00 0A00 0405 0000 0003 0100 000B 
                    000B 0004 0500 0000 0301 0000 0C00 0C00 
                    0405 0000 0003 0100 000D 000D 0004 0500 
                    0000 0301 0000 0F00 0F00 0005 0000 0003 
                    0100 0000 0500 0000 0301 0000 7E`;

const result = decode_UART_F4(payload);
console.log(JSON.stringify(result, null, 2));
