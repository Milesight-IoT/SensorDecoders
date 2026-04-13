# Motion & Temperature Sensor - WS203

![WS203](ws203.png)

For more detailed information, please visit [Milesight Official Website](https://www.milesight.com/iot/product/lorawan-sensor/ws203)

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

|       CHANNEL        |  ID  | TYPE | LENGTH | DESCRIPTION                                                                                                                                                                                           |
| :------------------: | :--: | :--: | :----: | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|       Battery        | 0x01 | 0x75 |   1    | battery(1B)<br/>battery, unit: %                                                                                                                                                                      |
|     Temperature      | 0x03 | 0x67 |   2    | temperature(2B)<br/>temperature, unit: °C                                                                                                                                                             |
|       Humidity       | 0x04 | 0x68 |   1    | humidity(1B)<br/>humidity, unit: %r.h.                                                                                                                                                                  |
|      Occupancy       | 0x05 | 0x00 |   1    | occupancy(1B)<br/>occupancy, values(0: vacant, 1: occupied)                                                                                                                                           |
| Temperature Abnormal | 0x83 | 0x67 |   3    | temperature(2B) + temperature_abnormal(1B)                                                                                                                                                            |
|   Historical Data    | 0x20 | 0xCE |   9    | timestamp(4B) + report_type(1B) + occupancy(1B) + temperature(2B) + humidity(1B)<br/>report_type, values: (0: temperature resume, 1: temperature threshold, 2: pir ilde, 3: pir occupancy, 4: period) |

## Example

```json
// 017564 03673401 046865 050000
{
    "battery": 100,
    "humidity": 50.5,
    "occupancy": "vacant",
    "temperature": 30.8
}

// 8367220101
{
    "temperature": 29,
    "temperature_abnormal": "abnormal"
}

// 20CEAE5BA6640400240165 20CE5C5CA6640301340165
{
    "history": [
        {
            "humidity": 50.5,
            "occupancy": "vacant",
            "report_type": "period",
            "temperature": 29.2,
            "timestamp": 1688624046
        },
        {
            "humidity": 50.5,
            "occupancy": "occupied",
            "report_type": "pir occupancy",
            "temperature": 30.8,
            "timestamp": 1688624220
        }
    ]
}
```
