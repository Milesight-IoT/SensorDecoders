# Magnetic Contact Switch - Milesight IoT

The payload decoder function is applicable to WS301.

For more detailed information, please visit [milesight official website](https://www.milesight-iot.com).

![WS301](WS301.png)

## Payload Definition

|    CHANNEL     |  ID  | TYPE | LENGTH | DESCRIPTION                                      |
| :------------: | :--: | :--: | :----: | ------------------------------------------------ |
|    Battery     | 0x01 | 0x75 |   1    | battery(1B)<br/>battery, unit: %                 |
|     State      | 0x03 | 0x00 |   1    | state(1B)<br/>state, values: (0: close, 1: open) |
| Install Status | 0x04 | 0x00 |   1    | install(1B)<br/>install, values: (0: yes, 1: no) |

## Example

```json
// 017564 030001 040001
{
    "battery": 100,
    "state": "open",
    "install": "no"
}
```
