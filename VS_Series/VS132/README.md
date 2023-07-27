# 3D ToF People Counting Sensor - Milesight IoT

The payload decoder function is applicable to VS132.

For more detailed information, please visit [milesight official website](https://www.milesight-iot.com).

![VS132](VS132.png)

## Payload Definition

```
--------------------- Payload Definition ---------------------

                        [channel_id]  [channel_type] [channel_value]
FF: protocol_version  -> 0xFF           0x01          [1byte  ] Unit:
FF: serial_number     -> 0xFF           0x16          [8bytes ] Unit:
FF: hardware_version  -> 0xFF           0x09          [2bytes ] Unit:
FF: firmware_version  -> 0xFF           0x1F          [4bytes ] Unit:

03: total_in          -> 0x03           0xD2          [4bytes ] Unit:
04: total_out         -> 0x04           0xD2          [4bytes ] Unit:
05: counting          -> 0x05           0xCC          [2bytes ] Unit:

---------------------------------------------------------------

```

## Example for The Things Network

**Payload**

```
FF 01 01
FF 16 66 14 C3 96 94 87 00 00
FF 09 01 02
FF 1F 84 01 00 01
03 D2 BE 00 00 00
04 D2 31 01 00 00
05 CC 00 00 00 00
```

**Output**

```json
{
    "protocol_version": 1,
    "sn": "6614c39694870000",
    "hardware_version": "1.2",
    "firmware_version": "132.1.0.1",
    "total_counter_in": 190,
    "total_counter_out": 305,
    "periodic_counter_in": 0,
    "periodic_counter_out": 0
}
```
