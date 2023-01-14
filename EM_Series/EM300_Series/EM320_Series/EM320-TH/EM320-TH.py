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
        # TEMPERATURE & HUMIDITY HISTROY
        elif channel_id == 0x20 and channel_type == 0XCE:
            point = {}
            point['timestamp'] = int.from_bytes(bytes[i: i + 4], 'little', signed=False)
            point['temperature'] = int.from_bytes(bytes[i + 4:i + 6], 'little', signed=True) / 10
            point['humidity'] = bytes[i + 6] / 2

            if decoded.get('history') is None:
                decoded['history'] = []

            decoded['history'].append(point)
            i += 7
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
    decodePayload("01755C0367340104686520ce9e74466310015d", "hex")
