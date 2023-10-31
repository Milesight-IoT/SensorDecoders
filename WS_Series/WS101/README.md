# Smart Button - Milesight IoT

The payload decoder function is applicable to WS101.

For more detailed information, please visit [milesight official website](https://www.milesight-iot.com).

|        WS101        |          WS101 SOS          |
| :-----------------: | :-------------------------: |
| ![WS101](WS101.png) | ![WS101_SOS](WS101_SOS.png) |

## Payload Definition

|   CHANNEL    |  ID  | TYPE | LENGTH | DESCRIPTION                                                 |
| :----------: | :--: | :--: | :----: | ----------------------------------------------------------- |
|   Battery    | 0x01 | 0x75 |   1    | battery(1B)<br/>battery, unit: %                            |
| Button Press | 0xFF | 0x2E |   1    | press(1B)<br/>press, values: (1: short, 2: long, 3: double) |

## Example

```json
// 017510 FF2E01
{
    "battery": 16,
    "press": "short"
}
```
