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
        # ANGLE
        elif channel_id == 0x03 and channel_type == 0xD4:
            decoded['angle_x'] = (int.from_bytes(bytes[i: i + 2], 'little', signed=True) >> 1) / 100
            decoded['angle_y'] = (int.from_bytes(bytes[i + 2: i + 4], 'little', signed=True) >> 1) / 100
            decoded['angle_z'] = (int.from_bytes(bytes[i + 4: i + 6], 'little', signed=True) >> 1) / 100
            decoded['threshold_x'] = "trigger" if (bytes[i] & 0x01) == 0x01 else "normal"
            decoded['threshold_y'] = "trigger" if (bytes[i + 2] & 0x01) == 0x01 else "normal"
            decoded['threshold_z'] = "trigger" if (bytes[i + 4] & 0x01) == 0x01 else "normal"
            i += 6
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
    decodePayload("AXVkA9QAAAEAUEY=", "base64")
    decodePayload("c", "hex")
