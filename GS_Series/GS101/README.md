# GAS Detector - Milesight IoT

The payload decoder function is applicable to GS101.

For more detailed information, please visit [milesight official website](https://www.milesight-iot.com).

![GS101](GS101.png)

## Payload Definition

|   CHANNEL   |  ID  | TYPE | LENGTH | DESCRIPTION                                                                                                                                 |
| :---------: | :--: | :--: | :----: | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Temperature | 0x03 | 0x67 |   2    | temperature(2B)<br/>temperature, unit: ℃                                                                                                    |
|  Humidity   | 0x04 | 0x68 |   1    | humidity(1B)<br/>humidity, unit: %RH                                                                                                        |
| GAS Status  | 0x05 | 0x8E |   1    | gas_status(1B)<br/>gas_status, values: (0: normal, 1: abnormal)                                                                             |
|    Valve    | 0x06 | 0x01 |   1    | valve(1B)<br/>valve, values: (0: close, 1: open)                                                                                            |
|    Relay    | 0x07 | 0x01 |   1    | relay(1B)<br/>relay, values: (0: close, 1: open)                                                                                            |
| Life Remain | 0x08 | 0x90 |   4    | life_remain(4B)<br/>life_remain, unit: s                                                                                                    |
|    Alarm    | 0xFF | 0x3F |   1    | alarm(1B)<br/>alarm, values: (0: power down, 1: power on, 2: sensor failure, 3: sensor recover, 4: sensor about to fail, 5: sensor failed ) |
