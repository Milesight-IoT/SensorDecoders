# Bathroom Occupancy Sensor - Milesight IoT

![VS330](VS330.png)

The payload decoder function is applicable to VS330.

For more detailed information, please visit [milesight official website](https://www.milesight-iot.com).

## Payload Definition

```
--------------------- Payload Definition ---------------------

                    [channel_id] [channel_type] [channel_value]
01: battery           -> 0x01         0x75          [1byte ] Unit: %
02: distance          -> 0x02         0x82          [2bytes] Unit: mm
04: occupy            -> 0x03         0x8E          [1byte ] Unit: 
FF: calibration       -> 0x04         0x8E          [1byte ] Unit:

---------------------------------------------------------------

```

## Example for The Things Network

```
01 75 62 02 82 0F 00 03 8E 01 04 8E 01
```

**Payload**

```
01 75 62 
02 82 0F 00
03 8E 01
04 8E 01
```

**Output**

```json
{
    "battery": 98,
    "distance": 15,
    "occupy": "occupy",
    "calibration": "success"
}
```
