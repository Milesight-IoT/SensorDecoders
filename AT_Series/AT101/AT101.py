import binascii


def decodeBytes(bytes):
    print("bytes:", bytes.hex())
    decoded = {}

    i = 0
    while i < len(bytes):
        channel_id = bytes[i]
        channel_type = bytes[i + 1]
        i += 2

        # BATTERY
        if channel_id == 0x01 and channel_type == 0x75:
            decoded["battery"] = bytes[i]
            i += 1
        # TEMPERATURE
        elif channel_id == 0x03 and channel_type == 0x67:
            decoded["temperature"] = int.from_bytes(bytes[i : i + 2], "little", signed=False) / 10
            i += 2
        # LOCATION
        elif (channel_id == 0x04 or channel_id == 0x84) and channel_type == 0x88:
            decoded["latitude"] = int.from_bytes(bytes[i : i + 4], "little", signed=True) / 1000000
            decoded["longitude"] = int.from_bytes(bytes[i + 4 : i + 8], "little", signed=True) / 1000000
            status = bytes[i + 8]
            decoded["motion_status"] = ["unknown", "start", "moving", "stop"][status & 0x0F]
            decoded["geofence_status"] = ["inside", "outside", "unset", "unknown"][status >> 4]
            i += 9
        # POSITION
        elif channel_id == 0x05 and channel_type == 0x00:
            decoded["longitude"] = "normal" if bytes[i] == 0 else "tilt"
            i += 1
        # Wi-Fi SCAN RESULT
        elif channel_id == 0x06 and channel_type == 0xD9:
            wifi = {}
            wifi["frame"] = bytes[i]
            wifi["mac"] = ":".join([hex(x)[2:].zfill(2) for x in bytes[i + 1 : i + 7]])
            wifi["rssi"] = (bytes[i + 7] ^ 128) - 128
            i += 8

            if decoded.get("wifi") is None:
                decoded["wifi"] = []
            decoded["wifi"].append(wifi)
        # TAMPER STATUS
        elif channel_id == 0x07 and channel_type == 0x00:
            decoded["tamper_status"] = "install" if bytes[i] == 0 else "uninstall"
            i += 1
        # TEMPERATURE WITH ABNORMAL
        elif channel_id == 0x83 and channel_type == 0x67:
            decoded["temperature"] = int.from_bytes(bytes[i : i + 2], "little", signed=False) / 10
            decoded["temperature_abnormal"] = "normal" if bytes[i + 2] == 0 else "abnormal"
            i += 3
        # HISTORICAL LOCATION
        elif channel_id == 0x20 and channel_type == 0xCE:
            data = {}
            data["timestamp"] = int.from_bytes(bytes[i : i + 4], "little", signed=False)
            data["longitude"] = int.from_bytes(bytes[i + 4 : i + 8], "little", signed=True) / 1000000
            data["latitude"] = int.from_bytes(bytes[i + 8 : i + 12], "little", signed=True) / 1000000
            i += 12

            if decoded.get("history") is None:
                decoded["history"] = []
            decoded["history"].append(data)
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


if __name__ == "__main__":
    decodePayload("AXUBA2cGAQUAAQSIJrgDGQISAAAA", "base64")
    decodePayload("01756403671b01050000048836bf7701f000090722", "hex")
