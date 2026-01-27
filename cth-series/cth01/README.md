# CTH01 Sensor

![CTH01](cth01.png)

For more detailed information, please visit [Milesight Official Website](https://www.milesight.com/iot/product/lorawan-sensor/cth01)

## Payload Definition

### Attribute

| CHANNEL |  ID  | LENGTH | READ/WRITE | DEFAULT | RANGE | ENUM |
| :------ | :--: | :----: | :--------: | :-----: | :---: | :--: |
| LoRaWAN  Settings | 0xCF | 1 | rw |  |  |  |
| LoRaWAN Comand | 0xCF | 2 | rw |  |  |  |
| LoRaWAN Version | 0xCF | 2 | rw | 2 |  | 1：1.0.2<br>2：1.0.3<br>3：1.0.3<br>4：1.0.4 |
| TSL Version | 0xDF | 3 | r |  |  |  |
| Product Name | 0xDE | 33 | rw |  |  |  |
| PN | 0xDD | 33 | rw |  |  |  |
| SN | 0xDB | 9 | r |  |  |  |
| Product Version | 0xDA | 9 | r |  |  |  |
| Hardware Version | 0xDA | 3 | r |  |  |  |
| Firmware Version | 0xDA | 7 | r |  |  |  |
| OEM ID | 0xD9 | 3 | rw |  |  |  |
| Product Region | 0xD8 | 17 | r |  |  |  |
| Device Information | 0xD7 | M | r |  |  |  |
| Temperature | 0x01 | 3 | r |  | -20 - 100 |  |
| Voltage Three-phase Unbalance | 0x02 | 3 | r |  | 0 - 100 |  |
| THDi | 0x03 | 25 | r |  |  |  |
| THDi | 0x03 | 3 | r |  |  |  |
| THDi | 0x03 | 3 | r | 0 | 0 - 100 |  |
| THDv | 0x04 | 7 | r |  |  |  |
| THDv | 0x04 | 3 | r |  |  |  |
| THDv | 0x04 | 3 | r | 0 | 0 - 100 |  |
| Current(RMS) | 0x05 | 37 | r |  |  |  |
| Current(RMS) | 0x05 | 4 | r |  |  |  |
| Current(RMS) | 0x05 | 4 | r | 0 | 0 - 4000 |  |
| Voltage(RMS) | 0x06 | 7 | r |  |  |  |
| Voltage(RMS) | 0x06 | 3 | r |  |  |  |
| Voltage(RMS) | 0x06 | 3 | r | 0 | 0 - 500 |  |
| Power Factor | 0x07 | 1 | r |  |  |  |
| Power Factor | 0x07 | 2 | r |  |  |  |
| Power Factor | 0x07 | 2 | r |  |  |  |
| Power Factor | 0x07 | 2 | r |  |  |  |
| Power Factor | 0x07 | 2 | r |  |  |  |
| Power Factor | 0x07 | 2 | r | 0 | 0 - 100 |  |
| Power Factor | 0x07 | 4 | r |  |  |  |
| Power Factor | 0x07 | 2 | r | 0 | 0 - 100 |  |
| Power Factor | 0x07 | 2 | r | 0 | 0 - 100 |  |
| Power Factor | 0x07 | 2 | r | 0 | 0 - 100 |  |
| Power Factor | 0x07 | 2 | r | 0 | 0 - 100 |  |
| Power Factor | 0x07 | 4 | r |  |  |  |
| Power Factor | 0x07 | 2 | r | 0 | 0 - 100 |  |
| Power Factor | 0x07 | 2 | r | 0 | 0 - 100 |  |
| Power Factor | 0x07 | 2 | r | 0 | 0 - 100 |  |
| Power Factor | 0x07 | 2 | r | 0 | 0 - 100 |  |
| Power Factor | 0x07 | 4 | r |  |  |  |
| Power Factor | 0x07 | 2 | r | 0 | 0 - 100 |  |
| Power Factor | 0x07 | 2 | r | 0 | 0 - 100 |  |
| Power Factor | 0x07 | 2 | r | 0 | 0 - 100 |  |
| Power Factor | 0x07 | 2 | r | 0 | 0 - 100 |  |
| Power Factor | 0x07 | 4 | r |  |  |  |
| Power Factor | 0x07 | 2 | r | 0 | 0 - 100 |  |
| Power Factor | 0x07 | 2 | r | 0 | 0 - 100 |  |
| Power Factor | 0x07 | 2 | r | 0 | 0 - 100 |  |
| Active Power | 0x08 | 1 | r |  |  |  |
| Active Power | 0x08 | 2 | r |  |  |  |
| Active Power | 0x08 | 2 | r |  |  |  |
| Active Power | 0x08 | 5 | r | 0 |  |  |
| Active Power | 0x08 | 9 | r |  |  |  |
| Active Power | 0x08 | 5 | r | 0 |  |  |
| Active Power | 0x08 | 5 | r | 0 |  |  |
| Active Power | 0x08 | 5 | r | 0 |  |  |
| Active Power | 0x08 | 5 | r | 0 |  |  |
| Active Power | 0x08 | 9 | r |  |  |  |
| Active Power | 0x08 | 5 | r | 0 |  |  |
| Active Power | 0x08 | 5 | r | 0 |  |  |
| Active Power | 0x08 | 5 | r | 0 |  |  |
| Active Power | 0x09 | 1 | r |  |  |  |
| Active Power | 0x09 | 2 | r |  |  |  |
| Active Power | 0x09 | 2 | r |  |  |  |
| Active Power | 0x09 | 5 | r | 0 |  |  |
| Active Power | 0x09 | 9 | r |  |  |  |
| Active Power | 0x09 | 5 | r | 0 |  |  |
| Active Power | 0x09 | 5 | r | 0 |  |  |
| Active Power | 0x09 | 5 | r | 0 |  |  |
| Active Power | 0x09 | 5 | r | 0 |  |  |
| Active Power | 0x09 | 9 | r |  |  |  |
| Active Power | 0x09 | 5 | r | 0 |  |  |
| Active Power | 0x09 | 5 | r | 0 |  |  |
| Active Power | 0x09 | 5 | r | 0 |  |  |
| Reactive Power | 0x0A | 1 | r |  |  |  |
| Reactive Power | 0x0A | 2 | r |  |  |  |
| Reactive Power | 0x0A | 2 | r |  |  |  |
| Reactive Power | 0x0A | 5 | r | 0 |  |  |
| Reactive Power | 0x0A | 9 | r |  |  |  |
| Reactive Power | 0x0A | 5 | r | 0 |  |  |
| Reactive Power | 0x0A | 5 | r | 0 |  |  |
| Reactive Power | 0x0A | 5 | r | 0 |  |  |
| Reactive Power | 0x0A | 5 | r | 0 |  |  |
| Reactive Power | 0x0A | 9 | r |  |  |  |
| Reactive Power | 0x0A | 5 | r | 0 |  |  |
| Reactive Power | 0x0A | 5 | r | 0 |  |  |
| Reactive Power | 0x0A | 5 | r | 0 |  |  |
| Reactive Power | 0x0B | 1 | r |  |  |  |
| Reactive Power | 0x0B | 2 | r |  |  |  |
| Reactive Power | 0x0B | 2 | r |  |  |  |
| Reactive Power | 0x0B | 5 | r | 0 |  |  |
| Reactive Power | 0x0B | 9 | r |  |  |  |
| Reactive Power | 0x0B | 5 | r | 0 |  |  |
| Reactive Power | 0x0B | 5 | r | 0 |  |  |
| Reactive Power | 0x0B | 5 | r | 0 |  |  |
| Reactive Power | 0x0B | 5 | r | 0 |  |  |
| Reactive Power | 0x0B | 9 | r |  |  |  |
| Reactive Power | 0x0B | 5 | r | 0 |  |  |
| Reactive Power | 0x0B | 5 | r | 0 |  |  |
| Reactive Power | 0x0B | 5 | r | 0 |  |  |
| Apparent Power | 0x0C | 1 | r |  |  |  |
| Apparent Power | 0x0C | 2 | r |  |  |  |
| Apparent Power | 0x0C | 2 | r |  |  |  |
| Apparent Power | 0x0C | 5 | r | 0 |  |  |
| Apparent Power | 0x0C | 9 | r |  |  |  |
| Apparent Power | 0x0C | 5 | r | 0 |  |  |
| Apparent Power | 0x0C | 5 | r | 0 |  |  |
| Apparent Power | 0x0C | 5 | r | 0 |  |  |
| Apparent Power | 0x0C | 5 | r | 0 |  |  |
| Apparent Power | 0x0C | 9 | r |  |  |  |
| Apparent Power | 0x0C | 5 | r | 0 |  |  |
| Apparent Power | 0x0C | 5 | r | 0 |  |  |
| Apparent Power | 0x0C | 5 | r | 0 |  |  |
| Apparent Power | 0x0D | 1 | r |  |  |  |
| Apparent Power | 0x0D | 2 | r |  |  |  |
| Apparent Power | 0x0D | 2 | r |  |  |  |
| Apparent Power | 0x0D | 5 | r | 0 |  |  |
| Apparent Power | 0x0D | 9 | r |  |  |  |
| Apparent Power | 0x0D | 5 | r | 0 |  |  |
| Apparent Power | 0x0D | 5 | r | 0 |  |  |
| Apparent Power | 0x0D | 5 | r | 0 |  |  |
| Apparent Power | 0x0D | 5 | r | 0 |  |  |
| Apparent Power | 0x0D | 9 | r |  |  |  |
| Apparent Power | 0x0D | 5 | r | 0 |  |  |
| Apparent Power | 0x0D | 5 | r | 0 |  |  |
| Apparent Power | 0x0D | 5 | r | 0 |  |  |
| Imported Active Energy | 0x0E | 1 | r |  |  |  |
| Imported Active Energy | 0x0E | 2 | r |  |  |  |
| Imported Active Energy | 0x0E | 2 | r |  |  |  |
| Imported Active Energy | 0x0E | 5 | r | 0 |  |  |
| Imported Active Energy | 0x0E | 9 | r |  |  |  |
| Imported Active Energy | 0x0E | 5 | r | 0 |  |  |
| Imported Active Energy | 0x0E | 5 | r | 0 |  |  |
| Imported Active Energy | 0x0E | 5 | r | 0 |  |  |
| Imported Active Energy | 0x0E | 5 | r | 0 |  |  |
| Imported Active Energy | 0x0E | 9 | r |  |  |  |
| Imported Active Energy | 0x0E | 5 | r | 0 |  |  |
| Imported Active Energy | 0x0E | 5 | r | 0 |  |  |
| Imported Active Energy | 0x0E | 5 | r | 0 |  |  |
| Imported Active Energy | 0x0F | 1 | r |  |  |  |
| Imported Active Energy | 0x0F | 2 | r |  |  |  |
| Imported Active Energy | 0x0F | 2 | r |  |  |  |
| Imported Active Energy | 0x0F | 5 | r | 0 |  |  |
| Imported Active Energy | 0x0F | 9 | r |  |  |  |
| Imported Active Energy | 0x0F | 5 | r | 0 |  |  |
| Imported Active Energy | 0x0F | 5 | r | 0 |  |  |
| Imported Active Energy | 0x0F | 5 | r | 0 |  |  |
| Imported Active Energy | 0x0F | 5 | r | 0 |  |  |
| Imported Active Energy | 0x0F | 9 | r |  |  |  |
| Imported Active Energy | 0x0F | 5 | r | 0 |  |  |
| Imported Active Energy | 0x0F | 5 | r | 0 |  |  |
| Imported Active Energy | 0x0F | 5 | r | 0 |  |  |
| Exported Active Energy | 0x10 | 1 | r |  |  |  |
| Exported Active Energy | 0x10 | 2 | r |  |  |  |
| Exported Active Energy | 0x10 | 2 | r |  |  |  |
| Exported Active Energy | 0x10 | 5 | r | 0 |  |  |
| Exported Active Energy | 0x10 | 9 | r |  |  |  |
| Exported Active Energy | 0x10 | 5 | r | 0 |  |  |
| Exported Active Energy | 0x10 | 5 | r | 0 |  |  |
| Exported Active Energy | 0x10 | 5 | r | 0 |  |  |
| Exported Active Energy | 0x10 | 5 | r | 0 |  |  |
| Exported Active Energy | 0x10 | 9 | r |  |  |  |
| Exported Active Energy | 0x10 | 5 | r | 0 |  |  |
| Exported Active Energy | 0x10 | 5 | r | 0 |  |  |
| Exported Active Energy | 0x10 | 5 | r | 0 |  |  |
| Exported Active Energy | 0x11 | 1 | r |  |  |  |
| Exported Active Energy | 0x11 | 2 | r |  |  |  |
| Exported Active Energy | 0x11 | 2 | r |  |  |  |
| Exported Active Energy | 0x11 | 5 | r | 0 |  |  |
| Exported Active Energy | 0x11 | 9 | r |  |  |  |
| Exported Active Energy | 0x11 | 5 | r | 0 |  |  |
| Exported Active Energy | 0x11 | 5 | r | 0 |  |  |
| Exported Active Energy | 0x11 | 5 | r | 0 |  |  |
| Exported Active Energy | 0x11 | 5 | r | 0 |  |  |
| Exported Active Energy | 0x11 | 9 | r |  |  |  |
| Exported Active Energy | 0x11 | 5 | r | 0 |  |  |
| Exported Active Energy | 0x11 | 5 | r | 0 |  |  |
| Exported Active Energy | 0x11 | 5 | r | 0 |  |  |
| Imported Reactive Energy | 0x12 | 1 | r |  |  |  |
| Imported Reactive Energy | 0x12 | 2 | r |  |  |  |
| Imported Reactive Energy | 0x12 | 2 | r |  |  |  |
| Imported Reactive Energy | 0x12 | 5 | r | 0 |  |  |
| Imported Reactive Energy | 0x12 | 9 | r |  |  |  |
| Imported Reactive Energy | 0x12 | 5 | r | 0 |  |  |
| Imported Reactive Energy | 0x12 | 5 | r | 0 |  |  |
| Imported Reactive Energy | 0x12 | 5 | r | 0 |  |  |
| Imported Reactive Energy | 0x12 | 5 | r | 0 |  |  |
| Imported Reactive Energy | 0x12 | 9 | r |  |  |  |
| Imported Reactive Energy | 0x12 | 5 | r | 0 |  |  |
| Imported Reactive Energy | 0x12 | 5 | r | 0 |  |  |
| Imported Reactive Energy | 0x12 | 5 | r | 0 |  |  |
| Imported Reactive Energy | 0x13 | 1 | r |  |  |  |
| Imported Reactive Energy | 0x13 | 2 | r |  |  |  |
| Imported Reactive Energy | 0x13 | 2 | r |  |  |  |
| Imported Reactive Energy | 0x13 | 5 | r | 0 |  |  |
| Imported Reactive Energy | 0x13 | 9 | r |  |  |  |
| Imported Reactive Energy | 0x13 | 5 | r | 0 |  |  |
| Imported Reactive Energy | 0x13 | 5 | r | 0 |  |  |
| Imported Reactive Energy | 0x13 | 5 | r | 0 |  |  |
| Imported Reactive Energy | 0x13 | 5 | r | 0 |  |  |
| Imported Reactive Energy | 0x13 | 9 | r |  |  |  |
| Imported Reactive Energy | 0x13 | 5 | r | 0 |  |  |
| Imported Reactive Energy | 0x13 | 5 | r | 0 |  |  |
| Imported Reactive Energy | 0x13 | 5 | r | 0 |  |  |
| Exported Reactive Energy | 0x14 | 1 | r |  |  |  |
| Exported Reactive Energy | 0x14 | 2 | r |  |  |  |
| Exported Reactive Energy | 0x14 | 2 | r |  |  |  |
| Exported Reactive Energy | 0x14 | 5 | r | 0 |  |  |
| Exported Reactive Energy | 0x14 | 9 | r |  |  |  |
| Exported Reactive Energy | 0x14 | 5 | r | 0 |  |  |
| Exported Reactive Energy | 0x14 | 5 | r | 0 |  |  |
| Exported Reactive Energy | 0x14 | 5 | r | 0 |  |  |
| Exported Reactive Energy | 0x14 | 5 | r | 0 |  |  |
| Exported Reactive Energy | 0x14 | 9 | r |  |  |  |
| Exported Reactive Energy | 0x14 | 5 | r | 0 |  |  |
| Exported Reactive Energy | 0x14 | 5 | r | 0 |  |  |
| Exported Reactive Energy | 0x14 | 5 | r | 0 |  |  |
| Exported Reactive Energy | 0x15 | 1 | r |  |  |  |
| Exported Reactive Energy | 0x15 | 2 | r |  |  |  |
| Exported Reactive Energy | 0x15 | 2 | r |  |  |  |
| Exported Reactive Energy | 0x15 | 9 | r |  |  |  |
| Exported Reactive Energy | 0x15 | 5 | r | 0 |  |  |
| Exported Reactive Energy | 0x15 | 5 | r | 0 |  |  |
| Exported Reactive Energy | 0x15 | 5 | r | 0 |  |  |
| Exported Reactive Energy | 0x15 | 5 | r | 0 |  |  |
| Exported Reactive Energy | 0x15 | 9 | r |  |  |  |
| Exported Reactive Energy | 0x15 | 5 | r | 0 |  |  |
| Exported Reactive Energy | 0x15 | 5 | r | 0 |  |  |
| Exported Reactive Energy | 0x15 | 5 | r | 0 |  |  |
| Apparent Energy | 0x16 | 1 | r |  |  |  |
| Apparent Energy | 0x16 | 2 | r |  |  |  |
| Apparent Energy | 0x16 | 2 | r |  |  |  |
| Apparent Energy | 0x16 | 5 | r | 0 |  |  |
| Apparent Energy | 0x16 | 9 | r |  |  |  |
| Apparent Energy | 0x16 | 5 | r | 0 |  |  |
| Apparent Energy | 0x16 | 5 | r | 0 |  |  |
| Apparent Energy | 0x16 | 5 | r | 0 |  |  |
| Apparent Energy | 0x16 | 5 | r | 0 |  |  |
| Apparent Energy | 0x16 | 9 | r |  |  |  |
| Apparent Energy | 0x16 | 5 | r | 0 |  |  |
| Apparent Energy | 0x16 | 5 | r | 0 |  |  |
| Apparent Energy | 0x16 | 5 | r | 0 |  |  |
| Apparent Energy | 0x17 | 1 | r |  |  |  |
| Apparent Energy | 0x17 | 2 | r |  |  |  |
| Apparent Energy | 0x17 | 2 | r |  |  |  |
| Apparent Energy | 0x17 | 5 | r | 0 |  |  |
| Apparent Energy | 0x17 | 9 | r |  |  |  |
| Apparent Energy | 0x17 | 5 | r | 0 |  |  |
| Apparent Energy | 0x17 | 5 | r | 0 |  |  |
| Apparent Energy | 0x17 | 5 | r | 0 |  |  |
| Apparent Energy | 0x17 | 5 | r | 0 |  |  |
| Apparent Energy | 0x17 | 9 | r |  |  |  |
| Apparent Energy | 0x17 | 5 | r | 0 |  |  |
| Apparent Energy | 0x17 | 5 | r | 0 |  |  |
| Apparent Energy | 0x17 | 5 | r | 0 |  |  |
| Historical Data Type | 0x40 | 2 | r |  |  |  |
| Historical Data Type | 0x40 | 2 | r | 1 |  | 1:month energy<br>2:month min<br>3:month max |
| Collecting Interval | 0x60 | 1 | rw |  |  |  |
| Collecting Interval Unit | 0x60 | 2 | rw | 0 |  | 0：second<br>1：min |
| Collecting Interval | 0x60 | 3 | rw | 30 | 10 - 64800 |  |
| Collecting Interval | 0x60 | 3 | rw | 1 | 1 - 1440 |  |
| Report Interval | 0x61 | 1 | rw |  |  |  |
| Report Interval Unit | 0x61 | 2 | rw | 0 |  | 0：second<br>1：min |
| Report Interval | 0x61 | 3 | rw | 30 | 10 - 64800 |  |
| Report Interval | 0x61 | 3 | rw | 1 | 1 - 1440 |  |
| Device Status | 0xC8 | 2 | rw | 0 |  | 0：Power Off<br>1：Power On |
| Temperature Unit | 0x63 | 2 | rw | 0 |  | 0：℃<br>1：℉ |
| Bluetooth Name | 0x64 | 1 | rw |  |  |  |
| Name Length | 0x64 | 2 | rw | 13 | 1 - 255 |  |
| Name | 0x64 | 1 | rw |  |  |  |
| Data Storage Settings | 0xC5 | 1 | rw |  |  |  |
| Sub-command | 0xC5 | 2 | rw | 0 |  |  |
| Data Storage Enable | 0xC5 | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Data Retransmission Enable | 0xC5 | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Retransmission Interval | 0xC5 | 3 | rw | 600 | 30 - 1200 |  |
| Retrieval Interval | 0xC5 | 3 | rw | 60 | 30 - 1200 |  |
| Voltage Channel | 0x66 | 2 | rw | 0 |  | 0：four_wire<br>1：three_wire |
| Group a | 0x67 | 1 | rw |  |  |  |
| Circuit Type | 0x67 | 2 | rw | 0 |  | 0：one_phase<br>1：three_phase |
| Current Channel Configuration | 0x67 | 10 | rw |  |  |  |
| Current Channel Configuration | 0x67 | 4 | rw |  |  |  |
| Current Direction | 0x67 | 2 | rw | 0 |  | 0：forward<br>1：reserse |
| Channel Range | 0x67 | 3 | rw | 0 |  | 0：NONE<br>1：100A<br>2：300A<br>3：500A<br>4：1000A<br>5：4000A |
| Group b | 0x68 | 1 | rw |  |  |  |
| Circuit Type | 0x68 | 2 | rw | 0 |  | 0：one_phase<br>1：three_phase |
| Current Channel Configuration | 0x68 | 10 | rw |  |  |  |
| Current Channel Configuration | 0x68 | 4 | rw |  |  |  |
| Current Direction | 0x68 | 2 | rw | 0 |  | 0：forward<br>1：reserse |
| Channel Range | 0x68 | 3 | rw | 0 |  | 0：NONE<br>1：100A<br>2：300A<br>3：500A<br>4：1000A<br>5：4000A |
| Group c | 0x69 | 1 | rw |  |  |  |
| Circuit Type | 0x69 | 2 | rw | 0 |  | 0：one_phase<br>1：three_phase |
| Current Channel Configuration | 0x69 | 10 | rw |  |  |  |
| Current Channel Configuration | 0x69 | 4 | rw |  |  |  |
| Current Direction | 0x69 | 2 | rw | 0 |  | 0：forward<br>1：reserse |
| Channel Range | 0x69 | 3 | rw | 0 |  | 0：NONE<br>1：100A<br>2：300A<br>3：500A<br>4：1000A<br>5：4000A |
| Group d | 0x6A | 1 | rw |  |  |  |
| Circuit Type | 0x6A | 2 | rw | 0 |  | 0：one_phase<br>1：three_phase |
| Current Channel Configuration | 0x6A | 10 | rw |  |  |  |
| Current Channel Configuration | 0x6A | 4 | rw |  |  |  |
| Current Direction | 0x6A | 2 | rw | 0 |  | 0：forward<br>1：reserse |
| Channel Range | 0x6A | 3 | rw | 0 |  | 0：NONE<br>1：100A<br>2：300A<br>3：500A<br>4：1000A<br>5：4000A |
| Temperature Calibration Settings | 0x6B | 4 | rw |  |  |  |
| Temperature Calibration | 0x6B | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Calibration Value | 0x6B | 3 | rw | 0 | -120 - 120 |  |
| Time Zone | 0xC7 | 3 | rw | 0 |  | -720：UTC-12(IDLW)<br>-660：UTC-11(SST)<br>-600：UTC-10(HST)<br>-570：UTC-9:30(MIT)<br>-540：UTC-9(AKST)<br>-480：UTC-8(PST)<br>-420：UTC-7(MST)<br>-360：UTC-6(CST)<br>-300：UTC-5(EST)<br>-240：UTC-4(AST)<br>-210：UTC-3:30(NST)<br>-180：UTC-3(BRT)<br>-120：UTC-2(FNT)<br>-60：UTC-1(CVT)<br>0：UTC(WET)<br>60：UTC+1(CET)<br>120：UTC+2(EET)<br>180：UTC+3(MSK)<br>210：UTC+3:30(IRST)<br>240：UTC+4(GST)<br>270：UTC+4:30(AFT)<br>300：UTC+5(PKT)<br>330：UTC+5:30(IST)<br>345：UTC+5:45(NPT)<br>360：UTC+6(BHT)<br>390：UTC+6:30(MMT)<br>420：UTC+7(ICT)<br>480：UTC+8(CT/CST)<br>540：UTC+9(JST)<br>570：UTC+9:30(ACST)<br>600：UTC+10(AEST)<br>630：UTC+10:30(LHST)<br>660：UTC+11(VUT)<br>720：UTC+12(NZST)<br>765：UTC+12:45(CHAST)<br>780：UTC+13(PHOT)<br>840：UTC+14(LINT) |
| Daylight Saving Time | 0xC6 | M | rw |  |  |  |
| Daylight Saving Time | 0xC6 | 2 | rw | 0 |  | 0：disable<br>1：enable |
| DST Bias | 0xC6 | 2 | rw | 60 | 0 - 120 |  |
| Month | 0xC6 | 2 | rw | 1 |  | 1:Jan.<br>2:Feb.<br>3:Mar.<br>4:Apr.<br>5:May<br>6:Jun.<br>7:Jul.<br>8:Aug.<br>9:Sep.<br>10:Oct.<br>11:Nov.<br>12:Dec. |
| Number of Week | 0xC6 | 2 | rw | 1 |  | 1:1st<br>2: 2nd<br>3: 3rd<br>4: 4th<br>5: last |
| Week | 0xC6 | 2 | rw | 1 |  | 1：Mon.<br>2：Tues.<br>3：Wed.<br>4：Thurs.<br>5：Fri.<br>6：Sat.<br>7：Sun. |
| Time | 0xC6 | 3 | rw | 0 |  | 0：00:00<br>60：01:00<br>120：02:00<br>180：03:00<br>240：04:00<br>300：05:00<br>360：06:00<br>420：07:00<br>480：08:00<br>540：09:00<br>600：10:00<br>660：11:00<br>720：12:00<br>780：13:00<br>840：14:00<br>900：15:00<br>960：16:00<br>1020：17:00<br>1080：18:00<br>1140：19:00<br>1200：20:00<br>1260：21:00<br>1320：22:00<br>1380：23:00 |
| Month | 0xC6 | 2 | rw | 1 |  | 1:Jan.<br>2:Feb.<br>3:Mar.<br>4:Apr.<br>5:May<br>6:Jun.<br>7:Jul.<br>8:Aug.<br>9:Sep.<br>10:Oct.<br>11:Nov.<br>12:Dec. |
| Number of Week | 0xC6 | 2 | rw | 1 |  | 1:1st<br>2: 2nd<br>3: 3rd<br>4: 4th<br>5: last |
| Week | 0xC6 | 2 | rw | 1 |  | 1：Mon.<br>2：Tues.<br>3：Wed.<br>4：Thurs.<br>5：Fri.<br>6：Sat.<br>7：Sun. |
| Time | 0xC6 | 3 | rw | 0 |  | 0：00:00<br>60：01:00<br>120：02:00<br>180：03:00<br>240：04:00<br>300：05:00<br>360：06:00<br>420：07:00<br>480：08:00<br>540：09:00<br>600：10:00<br>660：11:00<br>720：12:00<br>780：13:00<br>840：14:00<br>900：15:00<br>960：16:00<br>1020：17:00<br>1080：18:00<br>1140：19:00<br>1200：20:00<br>1260：21:00<br>1320：22:00<br>1380：23:00 |
| Temperature Threshold Alarm Settings | 0x76 | 7 | rw |  |  |  |
| Threshold Alarm Enable | 0x76 | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Threshold Mode | 0x76 | 2 | rw | 0 |  | 0:disable<br>1:condition: x<A<br>2:condition: x>B<br>3:condition: A≤x≤B<br>4:condition: x<A or x>B |
| Value A | 0x76 | 3 | rw | 0 | -20 - 100 |  |
| Value B | 0x76 | 3 | rw | 0 | -20 - 100 |  |
| Current Threshold Alarm Settings | 0x77 | 1 | rw |  |  |  |
| Current Threshold Alarm | 0x77 | 8 | rw |  |  |  |
| Threshold Alarm Channel | 0x77 | 2 | rw | 0 |  |  |
| Threshold Alarm Enable | 0x77 | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Threshold Mode | 0x77 | 2 | rw | 0 |  | 0:disable<br>1:condition: x<A<br>2:condition: x>B<br>3:condition: A≤x≤B<br>4:condition: x<A or x>B |
| Value A | 0x77 | 3 | rw | 0 | 0 - 4000 |  |
| Value B | 0x77 | 3 | rw | 0 | 0 - 4000 |  |
| Voltage Threshold Alarm Settings | 0x78 | 1 | rw |  |  |  |
| Voltage Threshold Alarm | 0x78 | 8 | rw |  |  |  |
| Threshold Alarm Channel | 0x78 | 2 | rw | 0 |  |  |
| Threshold Alarm Enable | 0x78 | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Threshold Mode | 0x78 | 2 | rw | 0 |  | 0:disable<br>1:condition: x<A<br>2:condition: x>B<br>3:condition: A≤x≤B<br>4:condition: x<A or x>B |
| Value A | 0x78 | 3 | rw | 0 | 0 - 500 |  |
| Value B | 0x78 | 3 | rw | 0 | 0 - 500 |  |
| THDi Threshold Alarm Settings | 0x79 | 8 | rw |  |  |  |
| THDi Threshold Alarm | 0x79 | 8 | rw |  |  |  |
| Threshold Alarm Channel | 0x79 | 2 | rw | 0 |  |  |
| Threshold Alarm Enable | 0x79 | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Threshold Mode | 0x79 | 2 | rw | 2 |  | 0:disable<br>1:condition: x<A<br>2:condition: x>B<br>3:condition: A≤x≤B<br>4:condition: x<A or x>B |
| Value A | 0x79 | 3 | rw | 0 | 0 - 100 |  |
| Value B | 0x79 | 3 | rw | 0 | 0 - 100 |  |
| THDv Threshold Alarm Settings | 0x7A | 8 | rw |  |  |  |
| THDv Threshold Alarm | 0x7A | 8 | rw |  |  |  |
| Threshold Alarm Channel | 0x7A | 2 | rw | 0 |  |  |
| Threshold Alarm Enable | 0x7A | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Threshold Mode | 0x7A | 2 | rw | 2 |  | 0:disable<br>1:condition: x<A<br>2:condition: x>B<br>3:condition: A≤x≤B<br>4:condition: x<A or x>B |
| Value A | 0x7A | 3 | rw | 0 | 0 - 100 |  |
| Value B | 0x7A | 3 | rw | 0 | 0 - 100 |  |
| Voltage Three-phase Unbalance Threshold Alarm Settings | 0x7B | 7 | rw |  |  |  |
| Threshold Alarm Enable | 0x7B | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Threshold Mode | 0x7B | 2 | rw | 2 |  | 0:disable<br>1:condition: x<A<br>2:condition: x>B<br>3:condition: A≤x≤B<br>4:condition: x<A or x>B |
| Value A | 0x7B | 3 | rw | 0 | 0 - 100 |  |
| Value B | 0x7B | 3 | rw | 0 | 0 - 100 |  |
| Threshold Alarm Global Settings | 0x7C | 1 | rw |  |  |  |
| Alarm Interval | 0x7C | 3 | rw | 5 | 1 - 1440 |  |
| Alarm Times | 0x7C | 3 | rw | 3 | 1 - 1000 |  |
| Threshold Released Report Enable | 0x7C | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Monthly Statistics Time | 0x6D | 1 | rw |  |  |  |
| day | 0x6D | 2 | rw | 1 | 1 - 28 |  |
| hour | 0x6D | 2 | rw | 0 | 0 - 23 |  |
| minute | 0x6D | 2 | rw | 0 | 0 - 59 |  |
| Report Parameters | 0x6C | 3 | rw |  |  |  |
| Temperature | 0x6C | 3 | rw | 1 |  | 0：disable<br>1：enable |
| Current(RMS) | 0x6C | 3 | rw | 0 |  | 0：disable<br>1：enable |
| Voltage(RMS) | 0x6C | 3 | rw | 0 |  | 0：disable<br>1：enable |
| Power Factor | 0x6C | 3 | rw | 1 |  | 0：disable<br>1：enable |
| Active Power | 0x6C | 3 | rw | 1 |  | 0：disable<br>1：enable |
| ReActive Power | 0x6C | 3 | rw | 0 |  | 0：disable<br>1：enable |
| Apparent Power | 0x6C | 3 | rw | 0 |  | 0：disable<br>1：enable |
| Imported Active Energy | 0x6C | 3 | rw | 1 |  | 0：disable<br>1：enable |
| Exported Active Energy | 0x6C | 3 | rw | 0 |  | 0：disable<br>1：enable |
| Imported Reactive Energy | 0x6C | 3 | rw | 0 |  | 0：disable<br>1：enable |
| Exported Reactive Energy | 0x6C | 3 | rw | 0 |  | 0：disable<br>1：enable |
| Apparent Energy | 0x6C | 3 | rw | 0 |  | 0：disable<br>1：enable |
| THDi | 0x6C | 3 | rw | 0 |  | 0：disable<br>1：enable |
| THDv | 0x6C | 3 | rw | 0 |  | 0：disable<br>1：enable |
| Voltage Three-phase Unbalance | 0x6C | 3 | rw | 0 |  | 0：disable<br>1：enable |

### Event

| CHANNEL |  ID  | LENGTH | READ/WRITE | DEFAULT | RANGE | ENUM |
| :------ | :--: | :----: | :--------: | :-----: | :---: | :--: |
| Sequence Number Check Response | 0xFF | 2 | r |  |  |  |
| Order Check Response | 0xFE | 2 | r |  |  |  |
| Command Response | 0xEF | 1 | r |  |  |  |
| Request to Push All Configurations | 0xEE | 1 | r |  |  |  |
| Historical Data | 0xED | 6 | r |  |  |  |
| Temperature Threshold Alarm | 0x30 | 1 | r |  |  |  |
| Current Threshold  Alarm | 0x31 | 1 | r |  |  |  |
| Voltage Threshold  Alarm | 0x32 | 1 | r |  |  |  |
| THDi Threshold Alarm | 0x33 | 1 | r |  |  |  |
| THDv Threshold Alarm | 0x34 | 1 | r |  |  |  |
| Voltage Three-phase Unbalance Threshold Alarm | 0x35 | 1 | r |  |  |  |
| Power Failure Alarm | 0x36 | 1 | r |  |  |  |

### Service

| CHANNEL |  ID  | LENGTH | READ/WRITE | DEFAULT | RANGE | ENUM |
| :------ | :--: | :----: | :--------: | :-----: | :---: | :--: |
| Sequence Number Check | 0xFF | 2 | w |  |  |  |
| Sequence Number | 0xFF | 2 | w | 0 | 0 - 255 |  |
| Sequence Number | 0xFF | 2 | r | 0 | 0 - 255 |  |
| Order Check | 0xFE | 2 | w |  |  |  |
| Order | 0xFE | 2 | w | 0 | 0 - 255 |  |
| Command Queries | 0xEF | 1 | w |  |  |  |
| Query Information | 0xEF | 2 | w |  |  |  |
| Command Length | 0xEF | 2 | w | 1 | 1 - 15 |  |
| The command that was queried | 0xEF | 1 | w |  |  |  |
| Answer Result | 0xEF | 2 | r | 0 |  | 0：success<br>1：unknow<br>2：error order<br>3：error passwd<br>4：error read params<br>5：error write params<br>6：error read<br>7：error write<br>8：error read apply<br>9：error write apply |
| Command Length | 0xEF | 2 | r | 1 | 1 - 15 |  |
| Answered Commands | 0xEF | 1 | r |  |  |  |
| Request to Query All Configurations | 0xEE | 1 | w |  |  |  |
| Historical Data Mode | 0xED | 2 | r |  |  | 0：target time<br>1：historical time |
| Historical Data Timestamps | 0xED | 5 | r |  |  |  |
| Alarm Type | 0x30 | 2 | r |  |  |  |
| Collection Error | 0x30 | 1 | r |  |  |  |
| Overrange (Lower Limit) | 0x30 | 1 | r |  |  |  |
| Overrange (Upper Limit) | 0x30 | 1 | r |  |  |  |
| No Data | 0x30 | 1 | r |  |  |  |
| Temperature Below Threshold Alarm Released | 0x30 | 3 | r |  |  |  |
| Temperature | 0x30 | 3 | r |  | -20 - 100 |  |
| Temperature Below Threshold Alarm | 0x30 | 3 | r |  |  |  |
| Temperature | 0x30 | 3 | r |  | -20 - 100 |  |
| Temperature Exceeds Threshold Alarm Released | 0x30 | 3 | r |  |  |  |
| Temperature | 0x30 | 3 | r |  | -20 - 100 |  |
| Temperature Exceeds Threshold Alarm | 0x30 | 3 | r |  |  |  |
| Temperature | 0x30 | 3 | r |  | -20 - 100 |  |
| Temperature Between Thresholds Alarm Released | 0x30 | 3 | r |  |  |  |
| Temperature | 0x30 | 3 | r |  | -20 - 100 |  |
| Temperature Between Thresholds Alarm | 0x30 | 3 | r |  |  |  |
| Temperature | 0x30 | 3 | r |  | -20 - 100 |  |
| Temperature Outside Thresholds Alarm Released | 0x30 | 3 | r |  |  |  |
| Temperature | 0x30 | 3 | r |  | -20 - 100 |  |
| Temperature Outside Thresholds Alarm | 0x30 | 3 | r |  |  |  |
| Temperature | 0x30 | 3 | r |  | -20 - 100 |  |
| Alarm Channel | 0x31 | 2 | r |  | 0 - 11 |  |
| Current Threshold Alarm Info | 0x31 | 1 | r |  |  |  |
| Alarm Type | 0x31 | 2 | r |  |  |  |
| Collection Error | 0x31 | 1 | r |  |  |  |
| Overrange (Lower Limit) | 0x31 | 4 | r |  |  |  |
| Current | 0x31 | 4 | r |  |  |  |
| Overrange (Upper Limit) | 0x31 | 4 | r |  |  |  |
| Current | 0x31 | 4 | r |  |  |  |
| No Data | 0x31 | 1 | r |  |  |  |
| Overrange Release | 0x31 | 4 | r |  |  |  |
| Current | 0x31 | 4 | r |  |  |  |
| Current Below Threshold Alarm Released | 0x31 | 4 | r |  |  |  |
| Current | 0x31 | 4 | r |  |  |  |
| Current Below Threshold Alarm | 0x31 | 4 | r |  |  |  |
| Current | 0x31 | 4 | r |  |  |  |
| Current Exceeds Threshold Alarm Released | 0x31 | 4 | r |  |  |  |
| Current | 0x31 | 4 | r |  |  |  |
| Current Exceeds Threshold Alarm | 0x31 | 4 | r |  |  |  |
| Current | 0x31 | 4 | r |  |  |  |
| Current in-Range Thresholds Alarm Released | 0x31 | 4 | r |  |  |  |
| Current | 0x31 | 4 | r |  |  |  |
| Current in-Range Thresholds Alarm | 0x31 | 4 | r |  |  |  |
| Current | 0x31 | 4 | r |  |  |  |
| Current Out-of-Range Thresholds Alarm Released | 0x31 | 4 | r |  |  |  |
| Current | 0x31 | 4 | r |  |  |  |
| Current Out-of-Range Thresholds Alarm | 0x31 | 4 | r |  |  |  |
| Current | 0x31 | 4 | r |  |  |  |
| Alarm Channel | 0x32 | 2 | r |  | 0 - 11 |  |
| Voltage Threshold Alarm Info | 0x32 | 1 | r |  |  |  |
| Alarm Type | 0x32 | 2 | r |  |  |  |
| Collection Error | 0x32 | 1 | r |  |  |  |
| Overrange (Lower Limit) | 0x32 | 3 | r |  |  |  |
| Voltage | 0x32 | 3 | r |  |  |  |
| Overrange (Upper Limit) | 0x32 | 3 | r |  |  |  |
| Voltage | 0x32 | 3 | r |  |  |  |
| No Data | 0x32 | 1 | r |  |  |  |
| Overrange Release | 0x32 | 3 | r |  |  |  |
| Voltage | 0x32 | 3 | r |  |  |  |
| Voltage Below Threshold Alarm Released | 0x32 | 3 | r |  |  |  |
| Voltage | 0x32 | 3 | r |  |  |  |
| Voltage Below Threshold Alarm | 0x32 | 3 | r |  |  |  |
| Voltage | 0x32 | 3 | r |  |  |  |
| Voltage Exceeds Threshold Alarm Released | 0x32 | 3 | r |  |  |  |
| Voltage | 0x32 | 3 | r |  |  |  |
| Voltage Exceeds Threshold Alarm | 0x32 | 3 | r |  |  |  |
| Voltage | 0x32 | 3 | r |  |  |  |
| Voltage in-Range Thresholds Alarm Released | 0x32 | 3 | r |  |  |  |
| Voltage | 0x32 | 3 | r |  |  |  |
| Voltage in-Range Thresholds Alarm | 0x32 | 3 | r |  |  |  |
| Voltage | 0x32 | 3 | r |  |  |  |
| Voltage Out-of-Range Thresholds Alarm Released | 0x32 | 3 | r |  |  |  |
| Voltage | 0x32 | 3 | r |  |  |  |
| Voltage Out-of-Range Thresholds Alarm | 0x32 | 3 | r |  |  |  |
| Voltage | 0x32 | 3 | r |  |  |  |
| Alarm Channel | 0x33 | 2 | r |  | 0 - 11 |  |
| THDi Threshold Alarm Info | 0x33 | 1 | r |  |  |  |
| Alarm Type | 0x33 | 2 | r |  |  |  |
| Collection Error | 0x33 | 1 | r |  |  |  |
| THDi Exceeds Threshold Alarm Released | 0x33 | 3 | r |  |  |  |
| THDi | 0x33 | 3 | r |  |  |  |
| THDi Exceeds Threshold Alarm | 0x33 | 3 | r |  |  |  |
| THDi | 0x33 | 3 | r |  |  |  |
| Alarm Channel | 0x34 | 2 | r |  | 0 - 11 |  |
| THDv Threshold Alarm Info | 0x34 | 1 | r |  |  |  |
| Alarm Type | 0x34 | 2 | r |  |  |  |
| Collection Error | 0x34 | 1 | r |  |  |  |
| THDv Exceeds Threshold Alarm Released | 0x34 | 3 | r |  |  |  |
| THDv | 0x34 | 3 | r |  |  |  |
| THDv Exceeds Threshold Alarm | 0x34 | 3 | r |  |  |  |
| THDv | 0x34 | 3 | r |  |  |  |
| Alarm Type | 0x35 | 2 | r |  |  |  |
| Collection Error | 0x35 | 1 | r |  |  |  |
| Voltage Three-phase Unbalance Exceeds Threshold Alarm Released | 0x35 | 3 | r |  |  |  |
| Voltage Three-phase Unbalance | 0x35 | 3 | r |  |  |  |
| Voltage Three-phase Unbalance Exceeds Threshold Alarm | 0x35 | 3 | r |  |  |  |
| Voltage Three-phase Unbalance | 0x35 | 3 | r |  |  |  |
| Reset | 0xBF | 1 | w |  |  |  |
| Reboot | 0xBE | 1 | w |  |  |  |
| Stop Retrieval | 0x5D | 1 | w |  |  |  |
| Stop Retrieval | 0x5D | 2 | w | 0 |  | 0：alarm data<br>1：period data<br>2：month energy data<br>3：month min_max data |
| Retrieval (Time Period) | 0x5B | 6 | w |  |  |  |
| Type | 0x5B | 2 | w | 0 |  | 0：alarm data<br>1：period data<br>2：month energy data<br>3：month min_max data |
| Time Point | 0x5B | 5 | w |  |  |  |
| Retrieval (Time Period) | 0x5C | 10 | w |  |  |  |
| Type | 0x5C | 2 | w | 0 |  | 0：alarm data<br>1：period data<br>2：month energy data<br>3：month min_max data |
| Start Time | 0x5C | 5 | w |  |  |  |
| End Time | 0x5C | 5 | w |  |  |  |
| Query Device Status | 0xB9 | 1 | w |  |  |  |
| Time Synchronize | 0xB8 | 1 | w |  |  |  |
| Time Synchronize | 0xB7 | 5 | w |  |  |  |
| Timestamp | 0xB7 | 5 | w |  |  |  |
| Network Reconnection | 0xB6 | 1 | w |  |  |  |
| Clear Cumulative Energy Consumption | 0x5F | 2 | w |  |  |  |
| Channel Number | 0x5F | 2 | w | 0 |  |  |
| Clear Historical Data | 0x5E | 2 | w |  |  |  |
| Data Type to Clear | 0x5E | 2 | w | 0 |  | 0：alarm data<br>1：period data<br>2：month energy data<br>3：month min_max data |
| Query Data Storage Configuration | 0x57 | 1 | w |  |  |  |

