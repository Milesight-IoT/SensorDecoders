# Smart Eink Display - Milesight IoT

The payload decoder function is applicable to DS3604.

For more detailed information, please visit [milesight official website](https://www.milesight-iot.com).

![DS3604](DS3604.png)

## Payload Definition

```
--------------------- Payload Definition ---------------------

                   [channel_id] [channel_type] [channel_value]
01: battery      -> 0x01         0x75          [1byte ] Unit: %
FB: template     -> 0xFB         0x01          [Nbytes] Unit: -

# Template Data Definition
+-------------+-------------------+---------------------+----------------------+-------------------+-----------------+---------------+
| Definition  | Channel ID(1Byte) | Channel Type(1Byte) | Template ID(Bit 6-7) | Block ID(Bit 0-6) | Data Length(1B) | Data(N Bytes) |
+-------------+-------------------+---------------------+----------------------+-------------------+-----------------+---------------+
| Sample      | 0xFB              | 0x01                | 00                   | 000000            | 0x05            | 4d696c6573    |
| Description | Template          | Template Data Frame | Template ID          | Block ID          | Data Length     | UTF-8 Unicode |
|             |                   |                     | 1                    | text 1            | 5 Bytes         | Miles         |
+-------------+-------------------+---------------------+----------------------+-------------------+-----------------+---------------+
```

## Example

-   Template id range `0 - 1`
-   Text block id range `0 - 9`
-   QRcode block id `10`

**Payload**

```
01 75 64 FB 01 00 05 4D 69 6C 65 73 FB 01 0A 05 68 65 6C 6C 6F
```

**Data Segmentation**

-   `01 75 64`
-   `FB 01 00 05 4D 69 6C 65 73`
-   `FB 01 0A 05 68 65 6C 6C 6F`

**Output**

```json
{
    "battery": 100,
    "template": 1,
    "text_1": "Miles",
    "qrcode": "hello"
}
```
