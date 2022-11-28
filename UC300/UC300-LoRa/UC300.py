import binascii

gpio_in_chns = [0x03, 0x04, 0x05, 0x06]
gpio_out_chns = [0x07, 0x08]
pt100_chns = [0x09, 0x0a]
ai_chns = [0x0b, 0x0c]
av_chns = [0x0d, 0x0e]


def decodeBytes(bytes):
    print("bytes:", bytes.hex())
    decoded = {}

    i = 0
    while i < len(bytes):
        channel_id = bytes[i]
        channel_type = bytes[i+1]
        i += 2

        # GPIO Input
        if channel_id in gpio_in_chns and channel_type == 0x00:
            id = channel_id - gpio_in_chns[0] + 1
            channel_name = 'gpio_in_%d' % id
            decoded[channel_name] = "off" if bytes[i] == 0 else "on"
            i += 1
        # GPIO Output
        elif channel_id in gpio_out_chns and channel_type == 0x01:
            id = channel_id - gpio_out_chns[0] + 1
            channel_name = 'gpio_out_%d' % id
            decoded[channel_name] = "off" if bytes[i] == 0 else "on"
            i += 1
        # GPIO AS counter
        elif channel_id in gpio_in_chns and channel_type == 0xc8:
            id = channel_id - gpio_in_chns[0] + 1
            channel_name = 'counter_%d' % id
            decoded[channel_name] = int.from_bytes(bytes[i: i + 4], 'little', signed=False)
            i += 4
        # PT100
        elif channel_id in pt100_chns and channel_type == 0x67:
            id = channel_id - pt100_chns[0] + 1
            channel_name = 'pt100_%d' % id
            decoded[channel_name] = int.from_bytes(bytes[i: i + 2], 'little', signed=True) / 10
            i += 2
        # ADC CHANNEL
        elif channel_id in ai_chns and channel_type == 0x02:
            id = channel_id - ai_chns[0] + 1
            channel_name = 'adc_%d' % id
            decoded[channel_name] = int.from_bytes(bytes[i: i + 2], 'little', signed=False) / 100
            i += 4
            continue
        # ADC CHANNEL for voltage
        elif channel_id in av_chns and channel_type == 0x02:
            id = channel_id - av_chns[0] + 1
            channel_name = 'adv_%d' % id
            decoded[channel_name] = int.from_bytes(bytes[i: i + 2], 'little', signed=False) / 100
            i += 4
            continue
        # MODBUS
        elif channel_id == 0xff and channel_type == 0x19:
            modbus_chn_id = bytes[i] + 1
            data_length = bytes[i+1]
            data_type = bytes[i+2]
            i += 3
            chn = "chn%d" % modbus_chn_id
            if data_type == 0:
                decoded[chn] = "off" if bytes[i] == 0 else "off"
                i += 1
            elif data_type == 1:
                decoded[chn] = bytes[i]
                i += 1
            elif data_type == 2 or data_type == 3:
                decoded[chn] = int.from_bytes(bytes[i: i + 2], 'little', signed=False)
                i += 2
            elif data_type in (4, 6, 8, 9, 10, 11):
                decoded[chn] = int.from_bytes(bytes[i: i + 4], 'little', signed=False)
                i += 4
            elif data_type in (5, 7):
                decoded[chn] = float.from_bytes(bytes[i: i + 4], 'little', signed=False)
                i += 4
            else:
                break
        # MODBUS READ ERROR
        elif channel_id == 0xff and channel_type == 0x15:
            modbus_chn_id = bytes[i] + 1
            channel_name = "channel_%d_error" % modbus_chn_id
            decoded[channel_name] = True
            i += 1
        else:
            break

    print(decoded)
    return decoded


def decodePayload(payload, encoded="base64"):
    if encoded == "base64":
        bytes = binascii.a2b_base64(payload)
    elif encoded == "hex":
        bytes = binascii.a2b_hex(payload)
    else:
        print("unsupport encode type")

    return decodeBytes(bytes)


if __name__ == '__main__':
    decodePayload("AwAABAAABQAABgAABwEACAEB", "base64")
    decodePayload("/xkABASYYAAA/xkBBAStHAAA/xkCAgPlA/8ZAwQEwhwAAP8ZBAQEMwIAAP8ZBQQEYcMAAP8ZBgQE+qEAAP8ZBwQENKMAAP8ZCAQE96IAAP8ZCQQEqh8AAP8ZCgQEbikAAP8ZCwQEQDQAAA==", "base64")
    decodePayload("ff1500", "hex")
