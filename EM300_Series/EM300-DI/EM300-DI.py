import binascii


def decodeBytes(bytes):
    print("bytes:", bytes.hex())
    decoded = {}

    i = 0
    while i < len(bytes):
        channel_id = bytes[i]
        channel_type = bytes[i+1]
        i += 2

        # BATTERY
        if channel_id == 0x01 and channel_type == 0x75:
            decoded['battery'] = bytes[i]
            i += 1
        # TEMPERATURE
        elif channel_id == 0x03 and channel_type == 0x67:
            # ℃
            decoded['temperature'] = int.from_bytes(bytes[i: i + 2], 'little', signed=True) / 10
            i += 2

            # ℉
            # decoded['temperature'] = int.from_bytes(bytes[i: i + 2], 'little', signed=True) / 10 * 1.8 + 32
            # i +=2
        # HUMIDITY
        elif channel_id == 0x04 and channel_type == 0x68:
            decoded['humidity'] = bytes[i] / 2
            i += 1
       # GPIO
        elif channel_id == 0x05 and channel_type == 0x00:
            decoded['gpio'] = bytes[i]
            i += 1
       # PULSE COUNTER
        elif channel_id == 0x05 and channel_type == 0xc8:
            decoded['pulse'] = int.from_bytes(bytes[i: i + 4], 'False', signed=False)
            i += 4
       # HISTROY
        elif channel_id == 0x20 and channel_type == 0xce:
            # maybe not historical raw data
            if len(bytes[i:]) < 12:
                break

            point = {}
            point['timestamp'] = int.from_bytes(bytes[i: i + 4], 'little', signed=False)
            point['temperature'] = int.from_bytes(bytes[i + 4: i + 6], 'little', signed=True) / 10
            point['humidity'] = bytes[i + 6] / 2

            # GPIO or Pulse
            mode = bytes[i + 7]
            if mode == 1:
                point['gpio'] = bytes[i + 8]
            elif mode == 2:
                point['pulse'] = int.from_bytes(bytes[i + 9: i + 13], 'little', signed=False)

            if decoded.get('history') is None:
                decoded['history'] = []

            decoded['history'].append(point)

            i += 13
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
    decodePayload("AXVcA2c0AQRoZQ==", "base64")
    decodePayload("01755C0367340104686520CE9E74466310015D020000010000", "hex")
