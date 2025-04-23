# Controller - Milesight IoT

The payload decoder function is applicable to UC100.

For more detailed information, please visit [Milesight Official Website](https://www.milesight.com/iot/product/iot-controller/uc100).

![UC100](UC100.png)

## Payload Definition

### Attribute

|     CHANNEL      |  ID  | TYPE | LENGTH | DESCRIPTION                                                                                       |
| :--------------: | :--: | :--: | :----: | ------------------------------------------------------------------------------------------------- |
|   IPSO Version   | 0xFF | 0x01 |   1    | ipso_version(1B)                                                                                  |
| Hardware Version | 0xFF | 0x09 |   2    | hardware_version(2B)                                                                              |
| Firmware Version | 0xFF | 0x0A |   2    | firmware_version(2B)                                                                              |
|   TSL Version    | 0xFF | 0xFF |   2    | tsl_version(2B)                                                                                   |
|  Serial Number   | 0xFF | 0x16 |   8    | sn(8B)                                                                                            |
|  LoRaWAN Class   | 0xFF | 0x0F |   1    | lorawan_class(1B)<br />lorawan_class, values: (0: Class A, 1: Class B, 2: Class C, 3: Class CtoB) |
|  Device Status   | 0xFF | 0x0B |   1    | device_status(1B)<br />device_status: values: (1: on)                                             |
|   Reset Event    | 0xFF | 0xFE |   1    | reset_event(1B)                                                                                   |

### Telemetry

|     CHANNEL     |  ID  | TYPE | LENGTH | DESCRIPTION                                                                                                                                                                           |
| :-------------: | :--: | :--: | :----: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|     Modbus      | 0xF9 | 0x73 |   N    | value_1(1B) + value_2(1B) + data(MB)<br />value_1, modbus_alarm_type(7..6) + modbus_chn_id(5..0)<br />value_2, sign(7) + register_offset(6..5) + modbus_data_type(4..0)               |
|  Modbus Error   | 0xFF | 0x15 |   1    | modbus_chn_id_alarm(1B)                                                                                                                                                               |
| Modbus Mutation | 0xF9 | 0x74 |   9    | value_1(1B) + value_2(8B)<br />value_1, register_offset(7..6) + modbus_chn_id(5..0)<br />value_2, read: double                                                                        |
| Modbus History  | 0x21 | 0xCE |   23   | timestamp(4B) + modbus_chn_id(1B) + value_1(2B) + data_1(8B) + data_2(8B)<br />value_1, sign(15) + modbus_data_type(14..9) + read_status(8) + register_count(7..6) + alarm_type(5..4) |
| Message History | 0x20 | 0xCD |   N    | timestamp(4B) + size(1B) + data(MB)                                                                                                                                                   |

### MODBUS DATA DEFINITION

**modbus_data_type**

| ID  | DATA TYPE                    |
| :-: | :--------------------------- |
|  0  | MB_REG_COIL                  |
|  1  | MB_REG_DIS                   |
|  2  | MB_REG_INPUT_AB              |
|  3  | MB_REG_INPUT_BA              |
|  4  | MB_REG_INPUT_INT32_ABCD      |
|  5  | MB_REG_INPUT_INT32_BADC      |
|  6  | MB_REG_INPUT_INT32_CDAB      |
|  7  | MB_REG_INPUT_INT32_DCBA      |
|  8  | MB_REG_INPUT_INT32_AB        |
|  9  | MB_REG_INPUT_INT32_CD        |
| 10  | MB_REG_INPUT_FLOAT_ABCD      |
| 11  | MB_REG_INPUT_FLOAT_BADC      |
| 12  | MB_REG_INPUT_FLOAT_CDAB      |
| 13  | MB_REG_INPUT_FLOAT_DCBA      |
| 14  | MB_REG_HOLD_INT16_AB         |
| 15  | MB_REG_HOLD_INT16_BA         |
| 16  | MB_REG_HOLD_INT32_ABCD       |
| 17  | MB_REG_HOLD_INT32_BADC       |
| 18  | MB_REG_HOLD_INT32_CDAB       |
| 19  | MB_REG_HOLD_INT32_DCBA       |
| 20  | MB_REG_HOLD_INT32_AB         |
| 21  | MB_REG_HOLD_INT32_CD         |
| 22  | MB_REG_HOLD_FLOAT_ABCD       |
| 23  | MB_REG_HOLD_FLOAT_BADC       |
| 24  | MB_REG_HOLD_FLOAT_CDAB       |
| 25  | MB_REG_HOLD_FLOAT_DCBA       |
| 26  | MB_REG_INPUT_DOUBLE_ABCDEFGH |
| 27  | MB_REG_INPUT_DOUBLE_GHEFCDAB |
| 28  | MB_REG_INPUT_DOUBLE_BADCFEHG |
| 29  | MB_REG_INPUT_DOUBLE_HGFEDCBA |
| 30  | MB_REG_INPUT_INT64_ABCDEFGH  |
| 31  | MB_REG_INPUT_INT64_GHEFCDAB  |
| 32  | MB_REG_INPUT_INT64_BADCFEHG  |
| 33  | MB_REG_INPUT_INT64_HGFEDCBA  |
| 34  | MB_REG_HOLD_DOUBLE_ABCDEFGH  |
| 35  | MB_REG_HOLD_DOUBLE_GHEFCDAB  |
| 36  | MB_REG_HOLD_DOUBLE_BADCFEHG  |
| 37  | MB_REG_HOLD_DOUBLE_HGFEDCBA  |
| 38  | MB_REG_HOLD_INT64_ABCDEFGH   |
| 39  | MB_REG_HOLD_INT64_GHEFCDAB   |
| 40  | MB_REG_HOLD_INT64_BADCFEHG   |
| 41  | MB_REG_HOLD_INT64_HGFEDCBA   |
