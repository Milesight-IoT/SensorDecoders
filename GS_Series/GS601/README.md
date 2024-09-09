# Vape Detector - Milesight IoT

The payload codec function applies to GS601.

For more detailed information, please visit Milesight's [Official Website](https://www.milesight.com).

![GS601](GS601.png)

## Payload Definition

### Attribute

| CHANNEL         |  ID  | LENGTH | DESCRIPTION                                 |
| :-------------- | :--: | :----: | :------------------------------------------ |
| TSL Version     | 0xDF |   2    | tsl_version                                 |
| Product Name    | 0xDE |   32   | custom_name                                 |
| PartNumber      | 0xDD |   32   | custom_pn                                   |
| SerialNumber    | 0xDB |   8    | sn                                          |
| Product Version | 0xDA |   8    | hardware_version(2B) + firmware_version(6B) |
| OEM ID          | 0xD9 |   2    | oem                                         |

### Telemetry

| CHANNEL               |  ID  | LENGTH | DESCRIPTION                                                                                                                                                                                                                                                                                                                                                                                                |
| :-------------------- | :--: | :----: | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Vaping Index          | 0x01 |   1    | vaping_index<br />vaping_index, read: uint8                                                                                                                                                                                                                                                                                                                                                                |
| Vaping Index Alarm    | 0x02 |        | vaping_index_alarm：type(1B) + extra_data(NB)<br />type=0x00, type=collection_error<br />type=0x01, type=lower_range_error<br />type=0x02, type=over_range_error<br />type=0x10, type=alarm_deactivation, extra_data(1B)=vaping_index<br />type=0x11, type=alarm_trigger, extra_data(1B)=vaping_index<br />type=0x20, type=interference_alarm_deactivation<br />type=0x21, type=interference_alarm_trigger |
| PM1.0                 | 0x03 |   2    | pm1_0<br />pm1_0, read: uint16, unit: ug/m3                                                                                                                                                                                                                                                                                                                                                                |
| PM1.0 Alarm           | 0x04 |        | pm1_0_alarm: type(1B) + extra_data(NB)<br />type=0x00, type=collection_error<br />type=0x01, type=lower_range_error<br />type=0x02, type=over_range_error<br />type=0x10, type=alarm_deactivation, extra_data(2B)=pm1_0<br />type=0x11, type=alarm_trigger, extra_data(2B)=pm1_0                                                                                                                           |
| PM2.5                 | 0x05 |   2    | pm2_5<br />pm2_5, read: uint16, unit: ug/m3                                                                                                                                                                                                                                                                                                                                                                |
| PM2.5 Alarm           | 0x06 |        | pm2_5_alarm: type(1B) + extra_data(NB)<br />type=0x00, type=collection_error<br />type=0x01, type=lower_range_error<br />type=0x02, type=over_range_error<br />type=0x10, type=alarm_deactivation, extra_data(2B)=pm2_5<br />type=0x11, type=alarm_trigger, extra_data(2B)=pm2_5                                                                                                                           |
| PM10                  | 0x07 |   2    | pm10<br />pm10, read: uint16, unit: ug/m3                                                                                                                                                                                                                                                                                                                                                                  |
| PM10 Alarm            | 0x08 |        | pm10_alarm: type(1B) + extra_data(NB)<br />type=0x00, type=collection_error<br />type=0x01, type=lower_range_error<br />type=0x02, type=over_range_error<br />type=0x10, type=alarm_deactivation, extra_data(2B)=pm10<br />type=0x11, type=alarm_trigger, extra_data(2B)=pm10                                                                                                                              |
| Temperature           | 0x09 |   2    | temperature<br />temperature, read: int16/10, unit: ℃                                                                                                                                                                                                                                                                                                                                                      |
| Temperature Alarm     | 0x0A |        | temperature_alarm: type(1B) + extra_data(NB)<br />type=0x00, type=collection_error<br />type=0x01, type=lower_range_error<br />type=0x02, type=over_range_error<br />type=0x10, type=alarm_deactivation, extra_data(2B)=temperature<br />type=0x11, type=alarm_trigger, extra_data(2B)=temperature<br />type=0x20, type=burning_alarm_deactivation<br />type=0x21, type=burning_alarm_trigger              |
| Humidity              | 0x0B |   2    | humidity<br />humidity, read: uint16/10, unit: %                                                                                                                                                                                                                                                                                                                                                           |
| Humidity Alarm        | 0x0C |        | humidity_alarm: type(1B)<br />type=0x00, type=collection_error<br />type=0x01, type=lower_range_error<br />type=0x02, type=over_range_error                                                                                                                                                                                                                                                                |
| TVOC                  | 0x0D |   2    | tvoc<br />tvoc, read: uint16, unit: ug/m3                                                                                                                                                                                                                                                                                                                                                                  |
| TVOC Alarm            | 0x0E |        | tvoc_alarm: type(1B) + extra_data(NB)<br />type=0x00, type=collection_error<br />type=0x01, type=lower_range_error<br />type=0x02, type=over_range_error<br />type=0x10, type=alarm_deactivation, extra_data(2B)=tvoc<br />type=0x11, type=alarm_trigger, extra_data(2B)=tvoc                                                                                                                              |
| Tamper Status         | 0x0F |   1    | tamper_status<br />tamper_status, read: uint8, values: (0: normal, 1: triggered)                                                                                                                                                                                                                                                                                                                           |
| Tamper Status Alarm   | 0x10 |        | tamper_status_alarm: type(1B) + extra_data(NB)<br />type=0x20, type=normal<br />type=0x21, type=trigger                                                                                                                                                                                                                                                                                                    |
| buzzer                | 0x11 |   1    | buzzer<br />buzzer, read: uint8, values: (0: normal, 1: triggered)                                                                                                                                                                                                                                                                                                                                         |
| Radar Detection Exist | 0x12 |   1    | occupancy_status<br />occupancy_status, values: (0: not occupancy_status, 1: occupancy_status)                                                                                                                                                                                                                                                                                                             |

# Sample

```json
// 01000302000502000702000A020B43020D30000F001100
{
    "buzzer": 0,
    "vaping_index": 0,
    "humidity": 57.9,
    "pm10": 2,
    "pm1_0": 2,
    "pm2_5": 2,
    "tamper_status": 0,
    "temperature_alarm": {
        "over_range_error": {}
    },
    "tvoc": 48
}
```
