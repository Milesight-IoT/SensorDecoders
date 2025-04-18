# Spot Leak Detection Sensor / Zone Leak Detection Sensor - Milesight IoT

The payload decoder function is applicable to EM300-SLD and EM300-ZLD.

For more detailed information, please visit [milesight official website](https://www.milesight-iot.com).

|          EM300-SLD          |          EM300-ZLD          |
| :-------------------------: | :-------------------------: |
| ![EM300-SLD](EM300-SLD.png) | ![EM300-ZLD](EM300-ZLD.png) |

## Payload Definition

### Attribute

|      CHANNEL       |  ID  | TYPE | LENGTH | DESCRIPTION          |
| :----------------: | :--: | :--: | :----: | -------------------- |
|  Protocol Version  | 0xFF | 0x01 |   1    | protocol_version(1B) |
|    Power Status    | 0xFF | 0x0B |   1    | power_status(1B)     |
|   Serial Number    | 0xFF | 0x16 |   8    | sn(8B)               |
|  Hardware Version  | 0xFF | 0x09 |   2    | hardware_version(2B) |
|  Firmware Version  | 0xFF | 0x0A |   2    | firmware_version(2B) |
| LoRaWAN Class Type | 0xFF | 0x0F |   1    | lorawan_class(1B)    |
|    TSL Version     | 0xFF | 0xFF |   2    | tsl_version(2B)      |

### Telemetry

|     CHANNEL     |  ID  | TYPE | LENGTH | DESCRIPTION                                                          |
| :-------------: | :--: | :--: | :----: | -------------------------------------------------------------------- |
|     Battery     | 0x01 | 0x75 |   1    | battery(1B)<br />battery, unit: %                                    |
|   Temperature   | 0x03 | 0x67 |   2    | temperature(2B)<br />temperature, unit: ℃                            |
|    Humidity     | 0x04 | 0x68 |   1    | humidity(1B)<br />humidity, unit: %RH                                |
| Leakage Status  | 0x05 | 0x00 |   1    | leakage_status(1B)<br />leakage_status, values: (0: normal, 1: leak) |
| Historical Data | 0x20 | 0XCE |   8    | timestamp(4B) + temperature(2B) + humidity(1B) + leakage_status(1B)  |

## Example

```json
// 01755C 03673401 046865 050000
{
  "battery": 92,
  "temperature": 30.8,
  "humidity": 50.5,
  "leakage_status": "normal"
}

// 20CE9E74466310015D01
{
  "history": [
    {
      "temperature": 27.2,
      "humidity": 46.5,
      "leakage_status": "leak",
      "timestamp": 1665561758
    }
  ]
}
```
