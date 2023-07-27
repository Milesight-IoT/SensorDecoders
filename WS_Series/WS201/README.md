# Smart Fill Level Monitoring Sensor - Milesight IoT

The payload decoder function is applicable to WS201.

For more detailed information, please visit [milesight official website](https://www.milesight-iot.com).

![WS201](WS201.png)

## Payload Definition

```
--------------------- Payload Definition ---------------------

                 [channel_id] [channel_type] [channel_value]
01: battery       -> 0x01         0x75          [1byte ] Unit: %
03: distance      -> 0x03         0x82          [2bytes] Unit: mm
04: remaining     -> 0x04         0xD6          [1byte ] Unit: %
------------------------------------------ WS201
```

## Example for The Things Network

**Payload**

```
01 75 64 03 82 3E 00 04 D6 45
```

**Data Segmentation**

-   `01 75 64`
-   `03 82 3E 00`
-   `04 D6 45`

**Output**

```json
{
    "battery": 100,
    "distance": 62,
    "remaining": 69
}
```
