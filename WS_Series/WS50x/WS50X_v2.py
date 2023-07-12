import binascii


def decodeBytes(bytes):
    print("bytes:", bytes.hex())
    decoded = {}

    i = 0
    while i < len(bytes):
        channel_id = bytes[i]
        channel_type = bytes[i+1]
        i += 2

        # SWITCH STATE
        if channel_id == 0x08 and channel_type == 0x29:
            # payload (0 0 0 0 0 0 0 0)
            #  Switch    3 2 1   3 2 1
            #          ------- -------
            # bit mask  change   state
            decoded['switch_1'] = "off" if (bytes[i] & 1) == 0 else "on"
            decoded['switch_1_change'] = "no" if ((bytes[i] >> 4) & 1) == 0 else "yes"

            decoded['switch_2'] = "off" if ((bytes[i] >> 1) & 1) == 0 else "on"
            decoded['switch_2_change'] = "no" if ((bytes[i] >> 5) & 1) == 0 else "yes"

            decoded['switch_3'] = "off" if ((bytes[i] >> 2) & 1) == 0 else "on"
            decoded['switch_3_change'] = "no" if ((bytes[i] >> 6) & 1) == 0 else "yes"
            i += 1
        # VOLTAGE
        elif channel_id == 0x03 and channel_type == 0x74:
            decoded['voltage'] = int.from_bytes(bytes[i:i + 2], 'little', signed=False) / 10
            i += 2
        # ACTIVE POWER
        elif channel_id == 0x04 and channel_type == 0x80:
            decoded['power'] = int.from_bytes(bytes[i:i + 4], 'little', signed=False)
            i += 4
        # POWER FACTOR
        elif channel_id == 0x05 and channel_type == 0x81:
            decoded['factor'] = bytes[i]
            i += 1
        # POWER CONSUMPTION
        elif channel_id == 0x06 and channel_type == 0x83:
            decoded['power_sum'] = int.from_bytes(bytes[i:i + 4], 'little', signed=False)
            i += 4
        # CURRENT
        elif channel_id == 0x07 and channel_type == 0xc9:
            decoded['current'] = int.from_bytes(bytes[i:i + 2], 'little', signed=False)
            i += 2
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
    decodePayload(
        "A2fuAARofAUAAQbLAgd9qAMIfSUACXNmJwp9BAALfSAADH0wAA==", "base64")
    decodePayload(
        "0367ee0004687c05000106cb02077da803087d2500097366270a7d04000b7d20000c7d3000", "hex")
