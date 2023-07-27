# Smart Light Controller - Milesight IoT

The payload decoder function is applicable to WS558.

For more detailed information, please visit [milesight official website](https://www.milesight-iot.com).

|        WS558        |         WS558-LN          |
| :-----------------: | :---------------------: |
| ![WS558](WS558.png) | ![WS558LN](WS558LN.png) |

## Payload Definition

```
--------------------- Payload Definition ---------------------

                           [channel_id] [channel_type] [channel_value]
03: voltage            ->   0x03         0x74          [2bytes] Unit: V (0.1)
04: active_power       ->   0x04         0x80          [4bytes] Unit: W
05: power_factor       ->   0x05         0x81          [1byte ] Uint: %
06: power_consumption  ->   0x06         0x83          [4bytes] Uint: W*h
07: total_current      ->   0x07         0xC9          [2bytes] Uint: mA
08: switch             ->   0x08         0x31          [2bytes]  Unit:
------------------------------------------ WS558

---- Switch Value Definition ---
binary:  0 0 0 0 0 0 0 0  0 0 0 0 0 0 0 0
switch:  8 7 6 5 4 3 2 1  8 7 6 5 4 3 2 1
        ---------------  ---------------
bitmask:          change            state

----------

```

## Example for The Things Network

**Payload**

```
08 31 00 01 05 81 64 07 C9 02 00 03 74 B2 08 06 83 01 00 00 00 04 80 01 00 00 00
```

**Data Segmentation**

-   `03 74 B2 08`
-   `04 80 01 00 00 00`
-   `05 81 64`
-   `06 83 01 00 00 00`
-   `07 C9 02 00`
-   `08 31 00 01`

**Output**

```json
{
    "voltage": 222.6,
    "active_power": 1,
    "power_factor": 100,
    "total_current": 2,
    "power_consumption": 1,
    "switch_1": "on",
    "switch_2": "off",
    "switch_3": "off",
    "switch_4": "off",
    "switch_5": "off",
    "switch_6": "off",
    "switch_7": "off",
    "switch_8": "off"
}
```
