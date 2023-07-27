# Smart Portable Socket - Milesight IoT

The payload decoder function is applicable to WS52X.

For more detailed information, please visit [milsight official website](https://wwww.milesight-iot.com).

|          WS523          |        WS525        | WS523 US |
| :---------------------: | :-----------------: | :------: |
|   ![WS523](WS523.png)   | ![WS525](WS525.png) | ![WS523US](WS523US.png) |

## Payload Definition

```
--------------------- Payload Definition ---------------------

                   [channel_id] [channel_type] [channel_value]
03: voltage    ->   0x03         0x74          [2bytes ] Unit: V (0.1)
04: power      ->   0x04         0x80          [4bytes ] Unit: W
05: factor     ->   0x05         0x81          [1byte  ] Uint: %
06: power_sum  ->   0x06         0x83          [4bytes ] Uint: W*h
07: current    ->   0x07         0xC9          [2bytes ] Uint: mA
08: state      ->   0x08         0x70          [1byte  ] Uint: Open/Close
------------------------------------------ WS52x

----------

```

## Example for The Things Network

**Payload**

```
03 74 ED 08 06 83 56 04 00 00 08 70 01 05 81 52 07 C9 A4 00 04 80 01 00 00 00
```

**Data Segmentation**

-   `03 74 ED 08`
-   `06 83 56 04 00 00`
-   `08 70 01 `
-   `05 81 52`
-   `07 C9 A4 00`
-   `04 80 01 00 00 00`

**Output**

```json
{
    "state": "open",
    "voltage": 228.5,
    "current": 164,
    "factor": 82,
    "energy_sum": 1110,
    "power": 1
}
```
