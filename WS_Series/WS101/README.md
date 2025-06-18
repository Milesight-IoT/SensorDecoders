# Smart Button - Milesight IoT

The payload decoder function is applicable to WS101.

For more detailed information, please visit [Milesight Official Website](https://www.milesight.com/iot/product/lorawan-sensor/ws101).

|        WS101        |          WS101 SOS          |
| :-----------------: | :-------------------------: |
| ![WS101](WS101.png) | ![WS101_SOS](WS101_SOS.png) |

## Payload Definition

### Attribute

|      CHANNEL       |  ID  | TYPE | LENGTH | DESCRIPTION          |
| :----------------: | :--: | :--: | :----: | -------------------- |
|  Protocol Version  | 0xFF | 0x01 |   1    | protocol_version(1B) |
|    Power Status    | 0xFF | 0x0B |   1    | power(1B)            |
|   Serial Number    | 0xFF | 0x16 |   8    | sn(8B)               |
|  Hardware Version  | 0xFF | 0x09 |   2    | hardware_version(2B) |
|  Firmware Version  | 0xFF | 0x0A |   2    | firmware_version(2B) |
| LoRaWAN Class Type | 0xFF | 0x0F |   1    | lorawan_class(1B)    |
|    TSL Version     | 0xFF | 0xFF |   2    | tsl_version(2B)      |

### Telemetry

|   CHANNEL    |  ID  | TYPE | LENGTH | DESCRIPTION                                                                    |
| :----------: | :--: | :--: | :----: | ------------------------------------------------------------------------------ |
|   Battery    | 0x01 | 0x75 |   1    | battery(1B)<br/>battery, unit: %                                               |
| Button Press | 0xFF | 0x2E |   1    | status(1B)<br/>press, values: (1: short press, 2: long press, 3: double press) |

### Downlink

|       CHANNEL       |  ID  | TYPE | LENGTH | DESCRIPTION             |
| :-----------------: | :--: | :--: | :----: | ----------------------- |
| Reporting Interval  | 0xff | 0x03 |   2    | reporting_interval(2B)  |
|    LED Indicator    | 0xff | 0x2f |   1    | led_indicator(1B)       |
| Double Press Enable | 0xff | 0x74 |   1    | double_click_enable(1B) |
|    Buzzer Enable    | 0xff | 0x3e |   1    | buzzer_enable(1B)       |
|       Reboot        | 0xff | 0x10 |   1    | reboot(1B)              |
| Query Device Status | 0xff | 0x28 |   1    | query_device_status(1B) |

## Example

```json
// 017510 FF2E01
{
    "battery": 16,
    "button_event": {
        "status": "short press"
    }
}
```
