# Controller - Milesight IoT

The payload decoder function is applicable to UC100.

For more detailed information, please visit [milesight official website](https://www.milesight-iot.com).

![UC100](UC100.png)

## Payload Definition

|     CHANNEL      |  ID  | TYPE | LENGTH | DESCRIPTION                                                                                                                                                                                          |
| :--------------: | :--: | :--: | :----: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|   IPSO Version   | 0xFF | 0x01 |   1    | ipso_version(1B)                                                                                                                                                                                     |
|  Device Status   | 0xFF | 0x0B |   1    | device_status(1B)                                                                                                                                                                                    |
|  Serial Number   | 0xFF | 0x16 |   8    | sn(8B)                                                                                                                                                                                               |
| Hardware Version | 0xFF | 0x09 |   2    | hardware_version(2B)                                                                                                                                                                                 |
| Firmware Version | 0xFF | 0x0A |   2    | firmware_version(2B)                                                                                                                                                                                 |
|      Modbus      | 0xFF | 0x19 |   N    | modbus_chn_id(1B) + data_size(1B) + data_type(1B) + channel_value(MB)                                                                                                                                |
|   Modbus Error   | 0xFF | 0x15 |   1    | modbus_chn_id(1B)                                                                                                                                                                                    |
|   Modbus Alarm   | 0xFF | 0xEE |   N    | modbus_chn_def(1B) + data_length(1B) + modbus_chn_data_def(1B) + data(MB)<br/>modbus_chn_def, modbus_chn_id(0..5) + modbus_chn_event(6..7)<br/>modbus_chn_data_def, modbus_data_type(0..6) + sign(7) |
|  Modbus History  | 0x20 | 0xCE |   10   | timestamp(4B) + data_length(1B) + modbus_chn_data_def(1B) + data(4B)<br/>modbus_chn_data_def, reserved(1) + modbus_data_type(2..6) + sign(7)                                                         |
| Message Histroy  | 0x20 | 0xCD |   N    | timestamp(4B) + size(1B) + data(MB)                                                                                                                                                                  |

### MODBUS DATA DEFINITION

**modbus_chn_event**

| ID  | EVENT TYPE              |
| :-: | :---------------------- |
|  0  | normal                  |
|  1  | threshold alarm         |
|  2  | threshold release alarm |
|  3  | mutation alarm          |

**modbus_data_type**

| ID  | DATA TYPE               |
| :-: | :---------------------- |
|  0  | MB_REG_COIL             |
|  1  | MB_REG_DIS              |
|  2  | MB_REG_INPUT_AB         |
|  3  | MB_REG_INPUT_BA         |
|  4  | MB_REG_INPUT_INT32_ABCD |
|  5  | MB_REG_INPUT_INT32_BADC |
|  6  | MB_REG_INPUT_INT32_CDAB |
|  7  | MB_REG_INPUT_INT32_DCBA |
|  8  | MB_REG_INPUT_INT32_AB   |
|  9  | MB_REG_INPUT_INT32_CD   |
| 10  | MB_REG_INPUT_FLOAT_ABCD |
| 11  | MB_REG_INPUT_FLOAT_BADC |
| 12  | MB_REG_INPUT_FLOAT_CDAB |
| 13  | MB_REG_INPUT_FLOAT_DCBA |
| 14  | MB_REG_HOLD_INT16_AB    |
| 15  | MB_REG_HOLD_INT16_BA    |
| 16  | MB_REG_HOLD_INT32_ABCD  |
| 17  | MB_REG_HOLD_INT32_BADC  |
| 18  | MB_REG_HOLD_INT32_CDAB  |
| 19  | MB_REG_HOLD_INT32_DCBA  |
| 20  | MB_REG_HOLD_INT32_AB    |
| 21  | MB_REG_HOLD_INT32_CD    |
| 22  | MB_REG_HOLD_FLOAT_ABCD  |
| 23  | MB_REG_HOLD_FLOAT_BADC  |
| 24  | MB_REG_HOLD_FLOAT_CDAB  |
| 25  | MB_REG_HOLD_FLOAT_DCBA  |
