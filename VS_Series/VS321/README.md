# Wireless AI Occupancy Sensor - Milesight IoT

The payload decoder function is applicable to VS321.

For more detailed information, please visit [Milesight Official Website (VS321)](https://www.milesight.com/iot/product/lorawan-sensor/vs321).

![VS321](VS321.png)

## Payload Definition

### Attributes

|     CHANNEL      |  ID  | TYPE | LENGTH | DESCRIPTION          |
| :--------------: | :--: | :--: | :----: | -------------------- |
|   IPSO Version   | 0xFF | 0x01 |   1    | ipso_version(1B)     |
|  Device Status   | 0xFF | 0x0B |   1    | device_status(1B)    |
|  Serial Number   | 0xFF | 0x16 |   8    | sn(8B)               |
|  LoRaWAN Class   | 0xFF | 0x0F |   1    | lorawan_class(1B)    |
| Hardware Version | 0xFF | 0x09 |   2    | hardware_version(2B) |
| Firmware Version | 0xFF | 0x0A |   2    | firmware_version(2B) |
|   TSL Version    | 0xFF | 0xFF |   2    | tsl_version(2B)      |
|   Reset Event    | 0xFF | 0xFE |   1    | reset_event(1B)      |

### Telemetry

|       CHANNEL       |  ID  | TYPE | LENGTH | DESCRIPTION                               |
| :-----------------: | :--: | :--: | :----: | ----------------------------------------- |
|       Battery       | 0x01 | 0x75 |   1    | battery(1B)<br />battery, unit: %         |
|     Temperature     | 0x03 | 0x67 |   2    | temperature(2B)<br />temperature, unit: ℃ |
|      Humidity       | 0x04 | 0x68 |   1    | humidity(1B)<br />humidity, unit: %       |
| People Total Counts | 0x05 | 0xFD |   2    | people_total_counts(2B)                   |
|  Region Occupancy   | 0x06 | 0xFE |   4    | mask(2B) + value(2B)                      |
| Illuminance Status  | 0x07 | 0xFF |   1    | illuminance_status(1B)                    |
|  Confidence Status  | 0x08 | 0xF4 |   2    | confidence(1B)                            |
|      Timestamp      | 0x0A | 0xEF |   4    | timestamp(4B)                             |
|  Temperature Alarm  | 0x83 | 0x67 |   3    | temperature(2B) + temperature_alarm(1B)   |
|   Humidity Alarm    | 0x84 | 0x68 |   2    | humidity(1B) + humidity_alarm(1B)         |
|   Historical Data   | 0x20 | 0xCE |   N    | timestamp(4B) + data_type(1B) + data(MB)  |

## Example

```json
// FF0F00 FFFF0100 FF090100 FF0A0101F F166443F07120770000 FF0BFF FF0101
{
    "device_status": "on",
    "firmware_version": "v1.1",
    "hardware_version": "v1.0",
    "ipso_version": "v0.1",
    "lorawan_class": "Class A",
    "sn": "6443f07120770000",
    "tsl_version": "v1.0"
}

// 06FE0F000600
{
    "region_1": "vacant",
    "region_10": "vacant",
    "region_10_enable": "disable",
    "region_1_enable": "enable",
    "region_2": "occupied",
    "region_2_enable": "enable",
    "region_3": "occupied",
    "region_3_enable": "enable",
    "region_4": "vacant",
    "region_4_enable": "enable",
    "region_5": "vacant",
    "region_5_enable": "disable",
    "region_6": "vacant",
    "region_6_enable": "disable",
    "region_7": "vacant",
    "region_7_enable": "disable",
    "region_8": "vacant",
    "region_8_enable": "disable",
    "region_9": "vacant",
    "region_9_enable": "disable"
}

// 017564 03670401 04686B 07FF00 08F40201
{
    "battery": 100,
    "confidence": "low",
    "humidity": 53.5,
    "illuminance_status": "dim",
    "temperature": 26
}
```
