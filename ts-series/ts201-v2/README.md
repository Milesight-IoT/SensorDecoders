# Temperature Sensor - TS201

![TS201](ts201-v2.png)

For more detailed information, please visit [Milesight Official Website](https://www.milesight.com/iot/product/lorawan-sensor/ts201)

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

|           CHANNEL           |  ID  | TYPE | LENGTH | DESCRIPTION                                                                                                                                                                  |
| :-------------------------: | :--: | :--: | :----: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|           Battery           | 0x01 | 0x75 |   1    | battery(1B)<br/>battery, unit: %                                                                                                                                             |
|         Temperature         | 0x03 | 0x67 |   2    | temperature(2B)<br/>temperature, unit: °C                                                                                                                                    |
|          Humidity           | 0x04 | 0x68 |   1    | humidity(1B)<br/>humidity, unit: %                                                                                                                                           |
| Temperature Threshold Alarm | 0x83 | 0x67 |   3    | temperature(2B) + temperature_alarm(1B)<br/>temperature, unit: °C                                                                                                            |
|  Humidity Threshold Alarm   | 0x84 | 0x68 |   3    | humidity(1B) + humidity_alarm(1B)<br/>humidity, unit: %                                                                                                                      |
| Temperature Mutation Alarm  | 0x93 | 0x67 |   5    | temperature(2B) + temperature_mutation(2B) + temperature_alarm(1B)<br/>temperature, unit: °C                                                                                 |
|   Humidity Mutation Alarm   | 0x94 | 0x68 |   3    | humidity(1B) + humidity_mutation(1B) + humidity_alarm(1B)<br/>humidity, unit: %                                                                                              |
|  Temperature Sensor Status  | 0xB3 | 0x67 |   1    | temperature_sensor_status(1B)<br/>temperature_sensor_status, values: (0: sensor error, 1: out of range)                                                                      |
|   Humidity Sensor Status    | 0xB4 | 0x68 |   1    | humidity_sensor_status(1B)<br/>humidity_sensor_status, values: (0: sensor error, 1: out of range)                                                                            |
|          Sensor Id          | 0xFF | 0xA0 |   9    | channel_id(4bit) + sensor_type(4bit) + sensor_id(8B)<br/>sensor_type, values: (1: DS18B20, 2: SHT4X)                                                                         |
|        History Data         | 0x20 | 0xCE |   9    | timestamp(4B) + sensor_type(1B) + temperature(2B) + humidity(1B) + event(1B)<br/>sensor_type, values: (1: DS18B20, 2: SHT4X)<br/>temperature, unit: °C<br/>humidity, unit: % |

```
History Data
+---------------------------+------------------------+---------------+
|                             event definition                       |
+---------------------------+------------------------+---------------+
|      7      |      6      |      5     |     4     | 3 | 2 | 1 | 0 |
+---------------------------+------------------------+---------------+
| temperature_sensor_status | humidity_sensor_status |  event_type   |
+---------------------------+------------------------+---------------+

temperature_sensor_status / humidity_sensor_status:
- 0: normal
- 1: read error
- 2: out of range

event_type:
- 1: periodic event
- 2: temperature alarm event
- 3: temperature alarm release event
- 4: humidity alarm event
- 5: humidity alarm release event
```

## Example

```json
// 03673401
{
    "temperature": 30.8
}

// 8367340101
{
    "event": [
        {
            "temperature": 30.8,
            "temperature_alarm": "threshold alarm"
        }
    ],
    "temperature": 30.8
}

// 93673401640002
{
    "event": [
        {
            "temperature": 30.8,
            "temperature_alarm": "mutation alarm",
            "temperature_mutation": 10
        }
    ],
    "temperature": 30.8
}

// 94684E0802
{
    "event": [
        {
            "humidity": 39,
            "humidity_alarm": "mutation alarm",
            "humidity_mutation": 0.8
        }
    ],
    "humidity": 39
}

// B36700
{
    "event": [
        {
            "temperature_sensor_status": "read error"
        }
    ]
}

// 20CEC79AFA6401BDFF2E01
{
    "history": [
        {
            "event": {
                "event_type": "periodic",
                "temperature_sensor_status": "normal"
            },
            "sensor_type": "DS18B20",
            "temperature": -6.7,
            "timestamp": 1694145223
        }
    ]
}
```
