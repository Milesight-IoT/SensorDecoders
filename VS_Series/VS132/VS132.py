import binascii


def decodeBytes(bytes):
    print("bytes:", bytes.hex())
    decoded = {}

    i = 0
    while i < len(bytes):
        channel_id = bytes[i]
        channel_type = bytes[i+1]
        i += 2

        # PROTOCOL VESION
        if channel_id == 0xFF and channel_type == 0x01:
            decoded['protocol_version'] = bytes[i]
            i += 1
        # SERIAL NUMBER
        elif channel_id == 0xFF and channel_type == 0x16:
            decoded['sn'] = bytes[i:i+8].hex()
            i += 8
        # HARDWARE VERSION
        elif channel_id == 0xFF and channel_type == 0x09:
            decoded['hardware_version'] = "{0}.{1}".format(bytes[i], bytes[i+1])
            i += 2
        # FIRMWARE VERSION
        elif channel_id == 0xFF and channel_type == 0x1F:
            decoded['firmware_version'] = "{0}.{1}.{2}.{3}".format(bytes[i], bytes[i+1], bytes[i+2], bytes[i+3])
            i += 4
        # TOTAL COUNTER IN
        elif channel_id == 0x03 and channel_type == 0xD2:
            decoded['total_counter_in'] = int.from_bytes(bytes[i:i+4], 'little', signed=False)
            i += 4
        # TOTAL COUNTER OUT
        elif channel_id == 0x04 and channel_type == 0xD2:
            decoded['total_counter_out'] = int.from_bytes(bytes[i:i+4], 'little', signed=False)
            i += 4
        # PERIODIC COUNTER
        elif channel_id == 0x05 and channel_type == 0xCC:
            decoded['periodic_counter_in'] = int.from_bytes(bytes[i:i+2], 'little', signed=False)
            decoded['periodic_counter_out'] = int.from_bytes(bytes[i+2:i+4], 'little', signed=False)
            i += 4
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
    decodePayload("/wEB/xZmFMOWlIcAAP8JAQL/H4QBAAED0r4AAAAE0jEBAAAFzAAAAAA=", "base64")
    decodePayload("FF0101FF166614C39694870000FF090102FF1F8401000103D2BE00000004D23101000005CC00000000", "hex")
