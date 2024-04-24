# Smart Current Transformer - Milesight IoT

The payload decoder function is applicable to CT305 / CT310.

For more detailed information, please visit [milesight official website](https://www.milesight-iot.com).

|       CT305       |       CT310       |
| :---------------: | :---------------: |
| ![CT305](CT305.png) | ![CT310](CT310.png) |

## Payload Definition

|          CHANNEL          |  ID  | TYPE | LENGTH | DESCRIPTION                                                                                                                                                                                                                 |
| :-----------------------: | :--: | :--: | :----: | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|     Protocol Version     | 0xFF | 0x01 |   1   | protocol_version(1B)                                                                                                                                                                                                        |
|       Power Status       | 0xFF | 0x0B |   1   | power(1B)                                                                                                                                                                                                                   |
|       Serial Number       | 0xFF | 0x16 |   8   | sn(8B)                                                                                                                                                                                                                      |
|     Hardware Version     | 0xFF | 0x09 |   2   | hardware_version(2B)                                                                                                                                                                                                        |
|     Firmware Version     | 0xFF | 0x0A |   2   | firmware_version(2B)                                                                                                                                                                                                        |
|    LoRaWAN Class Type    | 0xFF | 0x0F |   1   | lorawan_class(1B)                                                                                                                                                                                                           |
|        TSL Version        | 0xFF | 0xFF |   2   | tsl_version(2B)                                                                                                                                                                                                             |
| Total Current<br />(CHN1) | 0x03 | 0x97 |   4   | current_chn1_total(4B)<br />current_chn1_total, read: uint32/100, unit: Ah                                                                                                                                                  |
|    Current<br />(CHN1)    | 0x04 | 0x99 |   2   | current_chn1(2B)<br />current_chn1, read: uint16/10, unit: A                                                                                                                                                                |
| Total Current<br />(CHN2) | 0x05 | 0x97 |   4   | current_chn2_total(4B)<br />current_chn2_total, read: uint32/100, unit: Ah                                                                                                                                                  |
|    Current<br />(CHN2)    | 0x06 | 0x99 |   2   | current_chn2(2B)<br />current_chn2, read: uint16/10, unit: A                                                                                                                                                                |
| Total Current<br />(CHN3) | 0x07 | 0x97 |   4   | current_chn3_total(4B)<br />current_chn3_total, read: uint32/100, unit: Ah                                                                                                                                                  |
|    Current<br />(CHN3)    | 0x08 | 0x99 |   2   | current_chn3(2B)<br />current_chn3, read: uint16/10, unit: A                                                                                                                                                                |
|        Temperature        | 0x09 | 0x67 |   2   | temperature(2B)<br />temperature, read: int16/10, unit: ℃                                                                                                                                                                  |
| Current Alarm<br />(CHN1) | 0x84 | 0x99 |   7   | current_chn1_max(2B) + current_chn1_min(2B) + current_chn1(2B) + current_chn1_alarm(1B)<br />current_chn1_alarm, values: (0: threshold alarm, 1: threshold alarm release, 2: over range alarm, 3: over range alarm release) |
| Current Alarm<br />(CHN2) | 0x86 | 0x99 |   7   | current_chn2_max(2B) + current_chn2_min(2B) + current_chn2(2B) + current_chn2_alarm(1B)<br />current_chn2_alarm, values: (0: threshold alarm, 1: threshold alarm release, 2: over range alarm, 3: over range alarm release) |
| Current Alarm<br />(CHN3) | 0x88 | 0x99 |   7   | current_chn3_max(2B) + current_chn3_min(2B) + current_chn3(2B) + current_chn3_alarm(1B)<br />current_chn3_alarm, values: (0: threshold alarm, 1: threshold alarm release, 2: over range alarm, 3: over range alarm release) |
|     Temperature Alarm     | 0x89 | 0x67 |   3   | temperature(2B) + temperature_alarm(1B)<br />temperature, read: int16/10, unit: ℃<br />temperature_alarm, values: (0: threshold alarm release, 1: threshold alarm)                                                         |

## Example

```json
// FF0BFF FF0101 FF166746D38802580000 FF090100 FF0A0101 FF0F00 FFFF0101
{
    "firmware_version": "v1.1",
    "hardware_version": "v1.0",
    "ipso_version": "v0.1",
    "lorawan_class": "ClassA",
    "power_status": "on",
    "sn": "6746d38802580000",
    "tsl_version": "v1.1"
}

// 039710270000
{
    "current_chn1_total": 100
}

// 0499B80B00000000
{
    "current_chn1": 3
}

// 0499FFFF
{
    "current_chn1_alarm": "read failed"
}

// 8499B80BD007C40905
{
    "current_chn1_alarm": [
        "threshold alarm",
        "over range alarm"
    ],
    "current_chn1": 2.5,
    "current_chn1_max": 3.0,
    "current_chn1_min": 2.0
}
```
