import binascii
import struct

gpio_in_chns = [0x03, 0x04, 0x05, 0x06]
gpio_out_chns = [0x07, 0x08]
pt100_chns = [0x09, 0x0A]
ai_chns = [0x0B, 0x0C]
av_chns = [0x0D, 0x0E]

def decodeBytes(bytes):
    print("bytes:", bytes.hex())
    decoded = {}

    i = 0
    while i < len(bytes):
        channel_id = bytes[i]
        channel_type = bytes[i + 1]
        i += 2

        # GPIO Input
        if channel_id in gpio_in_chns and channel_type == 0x00:
            id = channel_id - gpio_in_chns[0] + 1
            channel_name = "gpio_in_%d" % id
            decoded[channel_name] = "off" if bytes[i] == 0 else "on"
            i += 1
        # GPIO Output
        elif channel_id in gpio_out_chns and channel_type == 0x01:
            id = channel_id - gpio_out_chns[0] + 1
            channel_name = "gpio_out_%d" % id
            decoded[channel_name] = "off" if bytes[i] == 0 else "on"
            i += 1
        # GPIO AS counter
        elif channel_id in gpio_in_chns and channel_type == 0xC8:
            id = channel_id - gpio_in_chns[0] + 1
            channel_name = "counter_%d" % id
            decoded[channel_name] = int.from_bytes(bytes[i : i + 4], "little", signed=False)
            i += 4
        # PT100
        elif channel_id in pt100_chns and channel_type == 0x67:
            id = channel_id - pt100_chns[0] + 1
            channel_name = "pt100_%d" % id
            decoded[channel_name] = int.from_bytes(bytes[i : i + 4], "little", signed=True) / 10
            i += 2
        # ADC CHANNEL
        elif channel_id in ai_chns and channel_type == 0x02:
            id = channel_id - ai_chns[0] + 1
            channel_name = "adc_%d" % id
            decoded[channel_name] = int.from_bytes(bytes[i : i + 4], "little", signed=False) / 100
            i += 4
            continue
        # ADC CHANNEL FOR VOLTAGE
        elif channel_id in av_chns and channel_type == 0x02:
            id = channel_id - av_chns[0] + 1
            channel_name = "adv_%d" % id
            decoded[channel_name] = int.from_bytes(bytes[i : i + 4], "little", signed=False) / 100
            i += 4
            continue
        # MODBUS
        elif channel_id == 0xFF and channel_type == 0x19:
            modbus_chn_id = bytes[i] + 1
            data_length = bytes[i + 1]
            data_type = bytes[i + 2]
            sign = data_type >> 7
            i += 3
            chn = "chn%d" % modbus_chn_id
            if data_type == 0:
                decoded[chn] = "off" if bytes[i] == 0 else "off"
                i += 1
            elif data_type == 1:
                decoded[chn] = bytes[i]
                i += 1
            elif data_type == 2 or data_type == 3:
                decoded[chn] = int.from_bytes(bytes[i : i + 2], "little", signed=sign)
                i += 2
            elif data_type in (4, 6):
                decoded[chn] = int.from_bytes(bytes[i : i + 4], "little", signed=sign)
                i += 4
            elif data_type in (8, 10):
                decoded[chn] = int.from_bytes(bytes[i : i + 2], "little", signed=sign)
                i += 4
            elif data_type in (9, 11):
                decoded[chn] = int.from_bytes(bytes[i : i + 4], "little", signed=sign)
                i += 4
            elif data_type in (5, 7):
                decoded[chn] = float.from_bytes(bytes[i : i + 4], "little", signed=sign)
                i += 4
            else:
                break
        # MODBUS READ ERROR
        elif channel_id == 0xFF and channel_type == 0x15:
            modbus_chn_id = bytes[i] + 1
            channel_name = "channel_%d_error" % modbus_chn_id
            decoded[channel_name] = True
            i += 1
        # ADC (STATISTICS)
        elif channel_id in ai_chns and channel_type == 0xE2:
            id = channel_id - ai_chns[0] + 1
            channel_name = "adc_%d" % id
            decoded[channel_name] = struct.unpack("<e", bytes[i : i + 2])[0]
            decoded[channel_name + "_min"] = struct.unpack("<e", bytes[i + 2 : i + 4])[0]
            decoded[channel_name + "_max"] = struct.unpack("<e", bytes[i + 4 : i + 6])[0]
            decoded[channel_name + "_avg"] = struct.unpack("<e", bytes[i + 6 : i + 8])[0]
            i += 8
        # ADV (STATISTICS)
        elif channel_id in av_chns and channel_type == 0xE2:
            id = channel_id - av_chns[0] + 1
            channel_name = "adv_%d" % id
            decoded[channel_name] = struct.unpack("<e", bytes[i : i + 2])[0]
            decoded[channel_name + "_min"] = struct.unpack("<e", bytes[i + 2 : i + 4])[0]
            decoded[channel_name + "_max"] = struct.unpack("<e", bytes[i + 4 : i + 6])[0]
            decoded[channel_name + "_avg"] = struct.unpack("<e", bytes[i + 6 : i + 8])[0]
            i += 8
        # PT100 (STATISTICS)
        elif channel_id in pt100_chns and channel_type == 0xE2:
            id = channel_id - pt100_chns[0] + 1
            channel_name = "pt100_%d" % id
            decoded[channel_name] = struct.unpack("<e", bytes[i : i + 2])[0]
            decoded[channel_name + "_min"] = struct.unpack("<e", bytes[i + 2 : i + 4])[0]
            decoded[channel_name + "_max"] = struct.unpack("<e", bytes[i + 4 : i + 6])[0]
            decoded[channel_name + "_avg"] = struct.unpack("<e", bytes[i + 6 : i + 8])[0]
            i += 8
        # MODBUS HISTORY DATA
        elif channel_id == 0x20 and channel_type == 0xDC:
            timestamp = int.from_bytes(bytes[i : i + 4], "little", signed=False)
            # 2 bytes to bit mask
            channel_mask = [int(x) for x in bin(int.from_bytes(bytes[i + 4 : i + 6], "little", signed=False))[2:][::-1]]
            i += 6

            data = {"timestamp": timestamp}
            for j in range(len(channel_mask)):
                if channel_mask[j] != 1:
                    continue

                # GPIO INPUT
                if j < 4:
                    type = bytes[i]
                    # AS GPIO INPUT
                    if type == 0:
                        name = "gpio_in_" + str(j + 1)
                        data[name] = "on" if bytes[i + 1] else "off"
                        i += 2
                    # AS COUNTER
                    else:
                        name = "counter_" + str(j + 1)
                        data[name] = int.from_bytes(bytes[i + 1 : i + 5], "little", signed=False)
                        i += 5
                # GPIO OUTPUT
                elif j < 6:
                    name = "gpio_out_" + str(j - 4 + 1)
                    data[name] = "on" if bytes[i] else "off"
                    i += 1
                # PT100
                elif j < 8:
                    name = "pt100_" + str(j - 6 + 1)
                    data[name] = struct.unpack("<e", bytes[i : i + 2])[0]
                    i += 2
                # ADC
                elif j < 10:
                    name = "adc_" + str(j - 8 + 1)
                    data[name] = struct.unpack("<e", bytes[i : i + 2])[0]
                    data[name + "_max"] = struct.unpack("<e", bytes[i + 2 : i + 4])[0]
                    data[name + "_min"] = struct.unpack("<e", bytes[i + 4 : i + 6])[0]
                    data[name + "_avg"] = struct.unpack("<e", bytes[i + 6 : i + 8])[0]
                    i += 8
                # ADV
                elif j < 12:
                    name = "adv_" + str(j - 10 + 1)
                    data[name] = struct.unpack("<e", bytes[i : i + 2])[0]
                    data[name + "_max"] = struct.unpack("<e", bytes[i + 2 : i + 4])[0]
                    data[name + "_min"] = struct.unpack("<e", bytes[i + 4 : i + 6])[0]
                    data[name + "_avg"] = struct.unpack("<e", bytes[i + 6 : i + 8])[0]
                    i += 8

                if decoded.get("channel_history_data") is None:
                    decoded["channel_history_data"] = []

                decoded["channel_history_data"].append(data)

        # TEXT
        else:
            decoded["text"] = str(bytes[i - 2 :])
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
    decodePayload("AwAABAAABQAABgAABwEACAEB", "base64")
    decodePayload("/xkABASYYAAA/xkBBAStHAAA/xkCAgPlA/8ZAwQEwhwAAP8ZBAQEMwIAAP8ZBQQEYcMAAP8ZBgQE+qEAAP8ZBwQENKMAAP8ZCAQE96IAAP8ZCQQEqh8AAP8ZCgQEbikAAP8ZCwQEQDQAAA==", "base64")
    decodePayload("ff1500", "hex")
    decodePayload("61626364656667682c2c30313233343536372e2e414243444546474821213736353433323130", "hex")
