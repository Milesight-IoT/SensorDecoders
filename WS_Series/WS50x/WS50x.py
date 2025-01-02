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
        if channel_id == 0xff and channel_type == 0x29:
            # payload (0 0 0 0 0 0 0 0)
            #  Switch    3 2 1   3 2 1
            #          ------- -------
            # bit mask  change   state
            decoded['switch_1'] = "open" if (bytes[i] & 1) == 1 else "close";
            decoded['switch_1_change'] = "open" if ((bytes[i] >> 4) & 1) == 1 else "no";

            decoded['switch_2'] = "open" if ((bytes[i] >> 1) & 1) == 1 else "close";
            decoded['switch_2_change'] = "open" if ((bytes[i] >> 5) & 1) == 1 else "no";

            decoded['switch_3'] = "open" if ((bytes[i] >> 2) & 1) == 1 else "close";
            decoded['switch_3_change'] = "open" if ((bytes[i] >> 6) & 1) == 1 else "no";
            i += 1;
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
