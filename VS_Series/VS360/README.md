# IR Breakbeam People Counter - Milesight IoT

The payload decoder function is applicable to VS360.

For more detailed information, please visit Milesight official website(https://www.milesight-iot.com).

![VS360](VS360.png)

## Payload Definition

| CHANNEL             |  ID  | TYPE | LENGTH | DESCRIPTION                                                                                                                                                                                          |
| :------------------ | :--: | :--: | :----: | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Protocol Version    | 0xFF | 0x01 |   1   | ipso_version(1B)                                                                                                                                                                                     |
| Device Status       | 0xFF | 0x0B |   1   | device_status(1B)                                                                                                                                                                                    |
| Serial Number       | 0xFF | 0x16 |   8   | sn(8B)                                                                                                                                                                                               |
| Hardware Version    | 0xFF | 0x09 |   2   | hardware_version(2B)                                                                                                                                                                                 |
| Firmware Version    | 0xFF | 0x0A |   2   | firmware_version(2B)                                                                                                                                                                                 |
| TSL Version         | 0xFF | 0xFF |   2   | tsl_version(2B)                                                                                                                                                                                      |
| LoRaWAN Class       | 0xFF | 0x0F |   1   | lorawan_class(1B)<br />lorawan_class, values: (0: classA, 1: classB, 2: classC, 3: classCtoB)                                                                                                        |
| Battery(Main)       | 0x01 | 0x75 |   1   | battery_main(1B)<br />battery_main, read: uint8, unit：%                                                                                                                                             |
| Battery(Node)       | 0x02 | 0x75 |   1   | battery_node(1B)<br />battery_node, read: uint8, unit：%                                                                                                                                             |
| Event               | 0x03 | 0xF4 |   2   | event_type(1B) + event_status(1B)<br />event_type, values: (0: counting anomaly, 1: node device without response, 2:devices misaligned)<br />event_status, values: (0: alarm release, 1: alarm)      |
| Total IN/OUT        | 0x04 | 0xCC |   4   | total_in(2B) + total_out(2B)                                                                                                                                                                         |
| Period IN/OUT       | 0x05 | 0xCC |   4   | period_in(2B) + period_out(2B)                                                                                                                                                                       |
| Total IN/OUT Alarm  | 0x84 | 0xCC |   5   | total_in(2B) + total_out(2B) + total_count_alarm(1B)<br />total_count_alarm, values: (1: threshold alarm)                                                                                            |
| Period IN/OUT Alarm | 0x85 | 0xCC |   5   | period_in(2B) + period_out(2B) + period_count_alarm(1B)<br />period_count_alarm, values: (1: threshold alarm)                                                                                        |
| Historical Data     | 0x20 | 0xCE | 9 / 13 | timestamp(4B) + data_type(1B) + period_in(2B) + period_out(2B) + total_in(2B) + total_out(2B)<br />data_type, values: (0: period_in + period_out, 1: period_in + period_out + total_in + total_out ) |

# Sample

```json
// 017564 027564
{
    "battery_main": 100,
    "battery_node": 100
}

// 04CC12001600 05CC13001400
{
    "period_in": 19,
    "period_out": 20,
    "total_in": 18,
    "total_out": 22
}

// 84CC0111081101 85CCE803E90301
{
    "period_in": 1000,
    "period_out": 1001,
    "period_count_alarm": "Threshold Alarm",
    "total_in": 4353,
    "total_out": 4360,
    "total_count_alarm": "Threshold Alarm"
}

// 03F40001 03F40000 03F40101 03F40201
{
    "event": [
        {
            "type": "Counting Anomaly",
            "status": "Alarm"
        },
        {
            "type": "Counting Anomaly",
            "status": "Alarm Release"
        },
        {
            "type": "Node Device Without Response",
            "status": "Alarm"
        },
        {
            "type": "Devices Misaligned",
            "status": "Alarm"
        }
    ]
}

// 20CE7B3AF164000B000400 20CEFF3DF16401070002001D000800
{
    "history": [
        {
            "period_in": 11,
            "period_out": 4,
            "timestamp": 1693530747
        },
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
