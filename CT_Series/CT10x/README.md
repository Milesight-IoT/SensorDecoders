# Smart Current Transformer - Milesight IoT

The payload decoder function is applicable to CT101 / CT103 / CT105.

For more detailed information, please visit [Milesight Official Website](https://www.milesight.com/iot/product/lorawan-sensor/ct10x).

|          CT101 / CT103          |        CT105        |
| :-----------------------------: | :-----------------: |
| ![CT101_CT103](CT101_CT103.png) | ![CT105](CT105.png) |

## Payload Definition

### Attributes

|     CHANNEL      |  ID  | TYPE | LENGTH | DESCRIPTION          |
| :--------------: | :--: | :--: | :----: | -------------------- |
|   IPSO Version   | 0xFF | 0x01 |   1    | ipso_version(1B)     |
|  Device Status   | 0xFF | 0x0B |   1    | device_status(1B)    |
|  Serial Number   | 0xFF | 0x16 |   8    | sn(8B)               |
| Hardware Version | 0xFF | 0x09 |   2    | hardware_version(2B) |
| Firmware Version | 0xFF | 0x0A |   2    | firmware_version(2B) |
|  LoRaWAN Class   | 0xFF | 0x0F |   1    | lorawan_class(1B)    |
|   TSL Version    | 0xFF | 0xFF |   2    | tsl_version(2B)      |
|   Reset Event    | 0xFF | 0xFE |   1    | reset_event(1B)      |

### Telemetry

|      CHANNEL      |  ID  | TYPE | LENGTH | DESCRIPTION                                                                                                                                                                        |
| :---------------: | :--: | :--: | :----: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|   Total Current   | 0x03 | 0x97 |   4    | total_ah(4B)<br />total_ah, read: uint32/100, unit: Ah                                                                                                                             |
|      Current      | 0x04 | 0x98 |   2    | current(2B)<br />current, read: uint16/100, unit: A                                                                                                                                |
|    Temperature    | 0x09 | 0x67 |   2    | temperature(2B)<br />temperature, read: int16/10, unit: ℃                                                                                                                          |
|   Current Alarm   | 0x84 | 0x98 |   7    | current_max(2B) + current_min(2B) + current(2B) + alarm(1B)<br />alarm, values: (1: threshold alarm, 2: threshold alarm release, 4: over range alarm, 8: over range alarm release) |
| Temperature Alarm | 0x89 | 0x67 |   3    | temperature(2B) + temperature_alarm(1B)<br />temperature, read: int16/10, unit: ℃<br />temperature_alarm, values: (0: threshold alarm release, 1: threshold alarm)                 |

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
