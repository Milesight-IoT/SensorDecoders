# Smart Fan Coil Thermostat - Milesight IoT

The payload codec function applies to WT303 / WT304.

For more detailed information, please visit Milesight's [Official Website](https://www.milesight.com).

![WT30x](WT30x.png)

## Payload Definition

### Attribute

| CHANNEL                |  ID  | LENGTH | DESCRIPTION                                 |
| :--------------------- | :--: | :----: | :------------------------------------------ |
| TSL Version            | 0xDF |   2    | tsl_version                                 |
| Product Name           | 0xDE |   32   | custom_name                                 |
| PartNumber             | 0xDD |   32   | custom_pn                                   |
| SerialNumber           | 0xDB |   8    | sn                                          |
| Product Version        | 0xDA |   8    | hardware_version(2B) + firmware_version(6B) |
| OEM ID                 | 0xD9 |   2    | oem                                         |
| Product Frequency Band | 0xD8 |   16   | product_frequency_band                      |
| Device Request         | 0xEE |   0    | device_request                              |
| Device Status          | 0xCF |   1    | device_status                               |
| LoRaWAN Class          | 0xCF |   1    | lorawan_class                               |

### Telemetry

| CHANNEL                    |  ID  | LENGTH | DESCRIPTION                                                                                                          |
| :------------------------- | :--: | :----: | :------------------------------------------------------------------------------------------------------------------- |
| Temperature                | 0x01 |   2    | temperature<br />temperature, read: int16/10, unit: ℃                                                                |
| Humidity                   | 0x02 |   2    | humidity<br />humidity, read: uint16/10, unit: %                                                                     |
| Target Temperature         | 0x03 |   2    | target_temperature<br />target_temperature, read: int16/10, unit: ℃                                                  |
| Temperature Control Status | 0x04 |   1    | temperature_control_status<br />temperature_control_status, read: uint8, values: (0: normal, 1: heating, 2: cooling) |
| Temperature Control Mode   | 0x68 |   1    | temperature_control_mode<br />temperature_control_mode, read: uint8, values: (0: manual, 1: auto)                    |
| Valve Status (WT303)       | 0x05 |   1    | valve_status<br />valve_status, read: uint8, values: (0: close, 1: open)                                             |
| Valve Status (WT304)       | 0x05 |   1    | valve_status<br />valve_status, read: uint8                                                                          |
| Fan Status                 | 0x06 |   1    | fan_status<br />fan_status, read: uint8, values: (0: off, 1: low, 2: medium, 3: high)                                |
| Fan Mode                   | 0x72 |   1    | fan_mode<br />fan_mode, read: uint8, values: (0: auto, 1: low, 2: medium, 3: high)                                   |
| Plan ID                    | 0x07 |   1    | plan_id<br />plan_id, read: uint8                                                                                    |
| Temperature Alarm          | 0x08 |   M    | temperature_alarm<br />temperature_alarm, read: uint8                                                                |
| Humidity Alarm             | 0x09 |   1    | humidity_alarm<br />humidity_alarm, read: uint8                                                                      |
| System Status              | 0x67 |   1    | system_status<br />system_status, read: uint8, values: (0: off, 1: on)                                               |

# Sample

```json

```
