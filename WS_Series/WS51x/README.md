# Smart Wall Socket - Milesight IoT

The payload decoder function is applicable to WS513 / WS515.

For more detailed information, please visit [milsight official website](https://wwww.milesight-iot.com).

|        WS513        |        WS515        |         WS513 EU          |
| :-----------------: | :-----------------: | :-----------------------: |
| ![WS513](WS513.png) | ![WS515](WS515.png) | ![WS513_EU](WS513_EU.png) |

## Payload Definition

|      CHANNEL      |  ID  | TYPE | LENGTH | DESCRIPTION                                           |
| :---------------: | :--: | :--: | :----: | ----------------------------------------------------- |
|      Voltage      | 0x03 | 0x74 |   2    | voltage(2B)<br/>voltage, read: uint16/10              |
|   Active power    | 0x04 | 0x80 |   4    | power(4B)<br/>power, read: uint32, unit: W            |
|   Active factor   | 0x05 | 0x81 |   1    | factor(1B)<br/>factor, read: uint8, unit: %           |
| Power Consumption | 0x06 | 0x83 |   4    | power_sum(4B)<br/>power_sum, read: uint32, unit: W\*h |
|      Current      | 0x07 | 0xC9 |   2    | current(2B)<br/>current, read: uint16, unit: mA       |
|       State       | 0x08 | 0x70 |   1    | state(1B)<br/>state, values: (0: close, 1: open)      |

## Example

```json
// 087001 058161 07c9a800 03748308 06831d000000 048023000000
{
    "current": 168,
    "factor": 97,
    "power": 35,
    "power_sum": 29,
    "state": "open",
    "voltage": 217.9
}
```
