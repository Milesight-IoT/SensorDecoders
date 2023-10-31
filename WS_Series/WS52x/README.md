# Smart Portable Socket - Milesight IoT

The payload decoder function is applicable to WS52X.

For more detailed information, please visit [milsight official website](https://wwww.milesight-iot.com).

|        WS523        |        WS525        |        WS523 US         |
| :-----------------: | :-----------------: | :---------------------: |
| ![WS523](WS523.png) | ![WS525](WS525.png) | ![WS523US](WS523US.png) |

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
// 0374ED08 068356040000 087001 058152 07C9A400 048001000000
{
    "state": "open",
    "voltage": 228.5,
    "current": 164,
    "factor": 82,
    "energy_sum": 1110,
    "power": 1
}
```
