# Smart Current Transformer - CT103

|        CT103        |         CT103         |
| :-----------------: | :-------------------: |
| ![CT103](ct103.png) | ![CT103](ct103-2.png) |

For more detailed information, please visit [Milesight Official Website](https://www.milesight.com/iot/product/lorawan-sensor/ct10x)

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

|      CHANNEL      |  ID  | TYPE | LENGTH | DESCRIPTION                                                                                                                                                                                        |
| :---------------: | :--: | :--: | :----: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|   Total Current   | 0x03 | 0x97 |   4    | total_current(4B)<br/>total_current, unit: Ah, read: uint32/100                                                                                                                                   |
|      Current      | 0x04 | 0x98 |   2    | current(2B)<br/>current, unit: A , read: uint16/100                                                                                                                                               |
|    Temperature    | 0x09 | 0x67 |   2    | temperature(2B)<br/>temperature, unit: °C, read: int16/10                                                                                                                                         |
|   Current Alarm   | 0x84 | 0x98 |   7    | current_max(2B) + current_min(2B) + current(2B) + current_alarm(1B)<br/>current_alarm, values: (1: threshold alarm, 2: threshold alarm release, 4: over range alarm, 8: over range alarm release) |
| Temperature Alarm | 0x89 | 0x67 |   3    | temperature(2B) + temperature_alarm(1B)<br/>temperature, unit: °C, read: int16/10<br/>temperature_alarm, values: (0: threshold alarm release, 1: threshold alarm)                                 |

## Example

```json
// FF0BFF FF0101 FF166746D38802580000 FF090100 FF0A0101 FF0F00
{
    "device_status": "on",
    "firmware_version": "v1.1",
    "hardware_version": "v1.0",
    "ipso_version": "v0.1",
    "lorawan_class": "Class A",
    "sn": "6746d38802580000"
}

// 039710270000
{
    "total_current": 100
}

// 0498B80B00000000
{
    "current": 30
}

// 0498FFFF
{
    "current_sensor_status": "read failed"
}

// 8498B80BD007C40905
{
    "current": 25,
    "current_alarm": {
        "current_over_range_alarm": "yes",
        "current_over_range_alarm_release": "no",
        "current_threshold_alarm": "yes",
        "current_threshold_alarm_release": "no"
    },
    "current_max": 30,
    "current_min": 20
}
```
