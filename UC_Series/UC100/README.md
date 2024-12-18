# Controller - Milesight IoT

The payload decoder function is applicable to UC100.

For more detailed information, please visit [milesight official website](https://www.milesight-iot.com).

![UC100](UC100.png)

## Payload Definition

|     CHANNEL      |  ID  | TYPE | LENGTH | DESCRIPTION                                                           |
| :--------------: | :--: | :--: | :----: | --------------------------------------------------------------------- |
| Protocol Version | 0xFF | 0x01 |   1    | ipso_version(1B)                                                      |
|   Power Status   | 0xFF | 0x0B |   1    | power(1B)                                                             |
|  Serial Number   | 0xFF | 0x16 |   8    | sn(8B)                                                                |
| Hardware Version | 0xFF | 0x09 |   2    | hardware_version(2B)                                                  |
| Firmware Version | 0xFF | 0x0A |   2    | firmware_version(2B)                                                  |
|      MODBUS      | 0xFF | 0x19 |   N    | modbus_chn_id(1B) + data_size(1B) + data_type(1B) + channel_value(MB) |
|   MODBUS ERROR   | 0xFF | 0x15 |   1    | modbus_chn_id_alarm(1B)                                               |
