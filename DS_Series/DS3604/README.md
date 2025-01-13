# Smart E-Ink Display - Milesight IoT

The payload decoder function is applicable to DS3604.

For more detailed information, please visit [milesight official website](https://www.milesight-iot.com).

![DS3604](DS3604.png)

## Payload Definition

| CHANNEL  |  ID  | TYPE | LENGTH | DESCRIPTION                      |
| :------: | :--: | :--: | :----: | -------------------------------- |
| Battery  | 0x01 | 0x75 |   1    | battery(1B)<br/>battery, unit: % |
| Template | 0xFB | 0x01 |   N    | template(NB)                     |

### Template Data Definition

| ID(1Byte) |  Type(1Byte)  | Template ID(Bit 6-7) | Block ID(Bit 0-6) | Data Length(1B) | Data(N Bytes) |
| :-------: | :-----------: | :------------------: | :---------------: | :-------------: | :-----------: |
|   0xFB    |     0x01      |          00          |      000000       |      0x05       |  4d696c6573   |
| Template  | Text/QR Frame |     Template ID      |     Block ID      |   Data Length   | UTF-8 Unicode |
|           |               |          1           |      text 1       |     5 Bytes     |     Miles     |

-   Id
    -   Template id range `0 - 1`
    -   Text block id range `0 - 9`
    -   QRcode block id `10`

## Example

```json
// 017564 FB0100054D696C6573 FB010A1968747470733A2F2F7777772E6D696C6573696768742E636F6D
{
    "battery": 100,
    "template_1": {
        "qrcode": "https://www.milesight.com",
        "text_1": "Miles"
    }
}
```
