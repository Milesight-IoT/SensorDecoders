# Passage People Counter - Milesight IoT

The payload decoder function is applicable to VS350.

For more detailed information, please visit [Milesight official website](https://www.milesight-iot.com).

![VS350](VS350.png)

## Payload Definition

|       CHANNEL       |  ID  | TYPE | LENGTH | DESCRIPTION                                                                                                                                                                                         |
| :-----------------: | :--: | :--: | :----: | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|       Battery       | 0x01 | 0x75 |   1    | battery(1B)<br/>battery, read: uint8, unit：%                                                                                                                                                       |
|     Temperature     | 0x03 | 0x67 |   2    | temperature(2B)<br/>temperature, read: int16/10, unit: ℃                                                                                                                                            |
|    Total IN/OUT     | 0x04 | 0xCC |   4    | total_in(2B) + total_out(2B)                                                                                                                                                                        |
|    Period IN/OUT    | 0x05 | 0xCC |   4    | period_in(2B) + period_out(2B)                                                                                                                                                                      |
|  Temperature Alarm  | 0x83 | 0x67 |   3    | temperature(2B) + temperature_alarm(1B)<br/>temperature_alarm, values: (0: threshold alarm release, 1: threshold alarm, 3: high temperature alarm, 4: high temperature alarm release)               |
| Total IN/OUT Alarm  | 0x84 | 0xCC |   5    | total_in(2B) + total_out(2B) + total_count_alarm(1B)<br/>total_count_alarm, values: (1: threshold alarm)                                                                                            |
| Period IN/OUT Alarm | 0x85 | 0xCC |   5    | period_in(2B) + period_out(2B) + period_count_alarm(1B)<br/>period_count_alarm, values: (1: threshold alarm)                                                                                        |
|   Historical Data   | 0x20 | 0xCE |   13   | timestamp(4B) + data_type(1B) + period_in(2B) + period_out(2B) + total_in(2B) + total_out(2B)<br/>data_type, values: (0: period_in + period_out, 1: period_in + period_out + total_in + total_out ) |

## Example

```json
// 017564 03670C01
{
    "battery": 100,
    "temperature": 26.8
}

// 04CC12001600 05CC13001400
{
    "total_in": 18,
    "total_out": 22,
    "period_in": 19,
    "period_out": 20
}

// 84CC0111081101 85CCE803E90301
{
    "total_in": 4353,
    "total_out": 4360,
    "period_in": 1000,
    "period_out": 1001,
    "total_count_alarm": "threshold alarm",
    "period_count_alarm": "threshold alarm"
}

// 8367360101
{
    "temperature": 31,
    "temperature_alarm": "threshold alarm"
}

// 8367220100
{
    "temperature": 29,
    "temperature_alarm": "threshold alarm release"
}

// 8367500103
{
    "temperature": 33.6,
    "temperature_alarm": "high temperature alarm"
}

// 83673E0104
{
    "temperature": 31.8,
    "temperature_alarm": "high temperature alarm release"
}

// 20CE7B3AF164000B000400
{
    "history": [
        {
            "period_in": 11,
            "period_out": 4,
            "timestamp": 1693530747
        }
    ]
}

// 20CEFF3DF16401070002001D000800
{
    "history": [
        {
            "period_in": 7,
            "period_out": 2,
            "total_in": 29,
            "total_out": 8,
            "timestamp": 1693531647
        }
    ]
}
```
