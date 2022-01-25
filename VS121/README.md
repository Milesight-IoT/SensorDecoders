# Workplace Sensors - Milesight IoT

![VS121](VS121.png)

The payload decoder function is applicable to VS121.

For more detailed information, please visit [milesight official website](https://www.milesight-iot.com).

## Payload Definition

```
--------------------- Payload Definition ---------------------

                        [channel_id]  [channel_type] [channel_value]
FF: protocol_version  -> 0xFF           0x01          [1byte  ] Unit:
FF: serial_number     -> 0xFF           0x08          [6bytes ] Unit:
FF: hardware_version  -> 0xFF           0x09          [2bytes ] Unit:
FF: firmware_version  -> 0xFF           0x0A          [4bytes ] Unit:

04: counter           -> 0x04           0xC9          [4bytes ] Unit:
05: passing           -> 0x05           0xCC          [2bytes ] Unit:
06: max               -> 0x06           0xCD          [1byte  ] Unit:
------------------------------------------ VS121

---- People Counter Definition ---
data(4bytes):  0x00   0x00           0x00  0x00
               ----   ------------   -----------
               SUM    REGION COUNT   REGION MASK
----------------------------------

```

## Example for The Things Network

**Payload**

```
FF 01 01
FF 08 66 00 12 34 56 78
FF 09 01 00
FF 0A 1F 07 00 4B
04 C9 03 03 00 02
05 CC 02 00 01 00
06 CD 05
```

**Output**

```json
{
    "protocol_version": 1,
    "sn": "660012345678",
    "hardware_version": "1.0",
    "firmware_version": "31.7.0.75",
    "people_counter_all": 3,
    "region_count": 3,
    "region_0": 1,
    "region_1": 1,
    "region_2": 0
    "in": 2,
    "out": 1,
    "max": 5
}
```
