# Weather Station - WTS506

![WTS506](wts506.png)

For more detailed information, please visit [Milesight Official Website](https://www.milesight.com/iot/product/lorawan-sensor/wts506)

## Payload

```
+-------------------------------------------------------+
|           DEVICE UPLINK / DOWNLINK PAYLOAD            |
+---------------------------+---------------------------+
|          DATA 1           |          DATA 2           |
+--------+--------+---------+--------+--------+---------+
|   ID   |  TYPE  |  DATA   |   ID   |  TYPE  |  DATA   |
+--------+--------+---------+--------+--------+---------+
| 1 Byte | 1 Byte | N Bytes | 1 Byte | 1 Byte | N Bytes |
|--------+--------+---------+--------+--------+---------+
```

### Attribute

|    CHANNEL    |  ID  | TYPE | LENGTH | DESCRIPTION                                                                                       |
| :-----------: | :--: | :--: | :----: | ------------------------------------------------------------------------------------------------ |
|     IPSO      | 0xFF | 0x01 |   1    | ipso_version(1B)                                                                                 |
|   Hardware    | 0xFF | 0x09 |   2    | hardware_version(2B)<br/>hardware_version, e.g. 0110 -> v1.1                                     |
|   Firmware    | 0xFF | 0x0A |   2    | firmware_version(2B)<br/>firmware_version, e.g. 0110 -> v1.10                                    |
|      TSL      | 0xFF | 0xFF |   2    | tsl_version(2B)                                                                                  |
| Serial Number | 0xFF | 0x16 |   2    | sn(8B)                                                                                           |
| LoRaWAN Class | 0xFF | 0x0F |   1    | lorawan_class(1B)<br/>lorawan_class, values: (0: Class A, 1: Class B, 2: Class C, 3: Class CtoB) |
|  Reset Event  | 0xFF | 0xFE |   1    | reset_event(1B)                                                                                  |
| Device Status | 0xFF | 0x0B |   1    | device_status(1B)                                                                                |

### Telemetry

|          CHANNEL          |  ID  | TYPE | LENGTH | DESCRIPTION                                                                                                                        |
| :-----------------------: | :--: | :--: | :----: | ---------------------------------------------------------------------------------------------------------------------------------- |
|          Battery          | 0x01 | 0x75 |   1    | battery(1B)<br/>battery, unit: %                                                                                                   |
|        Temperature        | 0x03 | 0x67 |   2    | temperature(2B)<br/>temperature, unit: °C                                                                                          |
|         Humidity          | 0x04 | 0x68 |   1    | humidity(1B)<br/>humidity, unit: %r.h.                                                                                               |
|      Wind Direction       | 0x05 | 0x84 |   2    | wind_direction(2B)<br/>wind_direction, unit: °                                                                                     |
|    Barometric Pressure    | 0x06 | 0x73 |   2    | pressure(2B)<br/>pressure, unit: hPa                                                                                               |
|        Wind Speed         | 0x07 | 0x92 |   2    | wind_speed(2B)<br/>wind_speed, unit: m/s                                                                                           |
|       Rainfall(v1)        | 0x08 | 0x77 |   3    | rainfall_total(2B) + rainfall_counter(1B)<br/>rainfall_total, unit: mm                                                             |
|       Rainfall(v2)        | 0x08 | 0xEC |   5    | rainfall_total(4B) + rainfall_counter(1B)<br/>rainfall_total, unit: mm                                                             |
|     Temperature Alarm     | 0x83 | 0x67 |   3    | temperature(2B) + temperature_alarm(1B)<br/>temperature, unit: °C<br/>temperature_alarm, values: (1: threshold)                    |
| Barometric Pressure Alarm | 0x86 | 0x73 |   3    | pressure(2B) + pressure_alarm(1B)<br/>pressure, unit: hPa<br/>pressure_alarm, values: (1: threshold)                               |
|     Wind Speed Alarm      | 0x87 | 0x92 |   3    | wind_speed(2B) + wind_speed_alarm<br/>wind_speed, unit: m/s<br/>wind_speed_alarm, values: (1: threshold)                           |
|       Rainfall(v2)        | 0x88 | 0xEC |   6    | rainfall_total(4B) + rainfall_counter(1B) + rainfall_alarm<br/>rainfall_total, unit: mm<br/>rainfall_alarm, values: (1: threshold) |
|    Historical Data(v1)    | 0x20 | 0xCE |   15   | timestamp(4B) + temperature(2B) + humidity(1B) + pressure(2B) + wind_direction(2B) + wind_speed(2B) + rainfall_total(2B)           |
|    Historical Data(v2)    | 0x21 | 0xCE |   17   | timestamp(4B) + temperature(2B) + humidity(1B) + pressure(2B) + wind_direction(2B) + wind_speed(2B) + rainfall_total(4B)           |

## Example

```json
// 017564 0367FF00 046879
{
    "battery": 100,
    "temperature": 25.5,
    "humidity": 60.5
}

// 0584BA04 06734F27 07920100 08777B0001
{
    "wind_direction": 121,
    "pressure": 1006.3,
    "wind_speed": 0.1,
    "rainfall_total": 1.23,
    "rainfall_counter": 1
}

// 0584BA04 06734F27 07920100 08EC7B00000001
{
    "wind_direction": 121,
    "pressure": 1006.3,
    "wind_speed": 0.1,
    "rainfall_total": 1.23,
    "rainfall_counter": 1
}

// 8367FF0001
{
    "temperature": 25.5,
    "temperature_alarm": "threshold alarm"
}

// 86734F2701
{
    "pressure": 1006.3,
    "pressure_alarm": "threshold alarm"
}

// 8792320001
{
    "wind_speed": 5,
    "wind_speed_alarm": "threshold alarm"
}

// 88EC8D1300000201
{
    "rainfall_total": 50.05,
    "rainfall_counter": 2,
    "rainfall_alarm": "threshold alarm"
}

// 20CEE59BE164FF00794F27BA0432008D13
{
    "history": [
        {
            "timestamp": 1692507109,
            "temperature": 25.5,
            "humidity": 60.5,
            "pressure": 1006.3,
            "wind_direction": 121,
            "wind_speed": 5,
            "rainfall_total": 50.05
        }
    ]
}

// 21CEE59BE164FF00794F27BA043200EA840100
{
    "history": [
        {
            "timestamp": 1692507109,
            "temperature": 25.5,
            "humidity": 60.5,
            "pressure": 1006.3,
            "wind_direction": 121,
            "wind_speed": 5,
            "rainfall_total": 995.62
        }
    ]
}
```
