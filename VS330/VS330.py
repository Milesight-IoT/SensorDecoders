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
        # DISTANCE
        elif channel_id == 0x02 and channel_type == 0x82:
            decoded['distance'] = int.from_bytes(bytes[i: i + 2], 'little', signed=False)
            i += 2
        # OCCUPANCY
        elif channel_id == 0x03 and channel_type == 0X8E:
            decoded['occupancy'] = 'vacant' if (bytes[i] == 0)  else 'occupied'
            i += 1
        # CALIBRATION
        elif channel_id == 0x04 and channel_type == 0X8E:
            decoded['calibration'] = 'success' if (bytes[i] == 1)  else 'failed'
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
    decodePayload("AXViAoIPAAOOAQSOAQ==", "base64")
    decodePayload("01756202820F00038E01048E01", "hex")
