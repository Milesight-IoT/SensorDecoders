# Smart Portable Socket - Milesight IoT

The payload decoder function is applicable to WS52X.

For more detailed information, please visit [milsight official website](https://wwww.milesight-iot.com).

|       WS523       |       WS525       |       WS523 US       |
| :---------------: | :---------------: | :-------------------: |
| ![WS523](WS523.png) | ![WS525](WS525.png) | ![WS523US](WS523US.png) |

## Payload Definition

|      CHANNEL      |  ID  | TYPE | LENGTH | DESCRIPTION                                                            |
| :---------------: | :--: | :--: | :----: | ---------------------------------------------------------------------- |
|      Voltage      | 0x03 | 0x74 |   2   | voltage(2B)<br />voltage, read: uint16/10                              |
|   Active Power   | 0x04 | 0x80 |   4   | active_power(4B)<br />active_power, read: uint32, unit: W              |
|   Power Factor   | 0x05 | 0x81 |   1   | power_factor(1B)<br />power_factor, read: uint8/100                    |
| Power Consumption | 0x06 | 0x83 |   4   | power_consumption(4B)<br />power_consumption, read: uint32, unit: W\*h |
|      Current      | 0x07 | 0xC9 |   2   | current(2B)<br />current, read: uint16, unit: mA                       |
|   Socket Status   | 0x08 | 0x70 |   1   | socket_status(1B)<br />socket_status, values: (0: close, 1: open)      |

## Example

```json
// 0374ED08 068356040000 087001 058152 07C9A400 048001000000
{
    "active_power": 1,
    "current": 164,
    "power_consumption": 1110,
    "power_factor": 0.82,
    "socket_status": "open",
    "voltage": 228.5
}
```
