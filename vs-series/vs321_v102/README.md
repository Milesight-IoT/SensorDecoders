# VS321 Sensor

![VS321](vs321.png)

For more detailed information, please visit [Milesight Official Website](https://www.milesight.com/iot/product/lorawan-sensor/vs321)

## Payload Definition

### Attribute

| CHANNEL |  ID  | TYPE | LENGTH | READ/WRITE | DEFAULT | RANGE | ENUM |
| :------ | :--: | :--: | :----: | :--------: | :-----: | :---: | :--: |
| Device Status | 0xFF | 0x0B | 2 | r |  |  | 0: off<br>1: on |
| IPSO | 0xFF | 0x01 | 2 | r |  |  |  |
| SN | 0xFF | 0x16 | 9 | r |  |  |  |
| TSL Version | 0xFF | 0xFF | 3 | r |  |  |  |
| Hardware Version | 0xFF | 0x09 | 3 | r |  |  |  |
| Firmware Version | 0xFF | 0x0A | 3 | r |  |  |  |
| LoRaWAN Work Mode | 0xFF | 0x0F | 2 | r |  |  | 0:class_a |
| Electricity | 0x01 | 0x75 | 2 | r |  | 1 - 100 |  |
| Temperature | 0x03 | 0x67 | 3 | r |  | -40 - 125 |  |
| Humidity | 0x04 | 0x68 | 2 | r |  | 0 - 100 |  |
| Illuminance Status | 0x07 | 0xFF | 2 | r |  |  | 0：Bright<br>1：Dim |
| Detection Status | 0x08 | 0xF4 | 3 | r |  |  |  |
| Detection Status  ID | 0x08 | 0xF4 | 2 | r |  |  | 2：Detect Confidence |
| Detect Confidence Reliability | 0x08 | 0xF4 | 2 | r |  |  | 0：Normal Detection<br>1：Undetectable |
| Total Number | 0x05 | 0xFD | 3 | r |  |  |  |
| Region Status | 0x06 | 0xFE | 5 | r |  |  |  |
| Region 1 Enable | 0x06 | 0xFE | 2 | r |  |  | 0：disable<br>1：enable |
| Region 2 Enable | 0x06 | 0xFE | 2 | r |  |  | 0：disable<br>1：enable |
| Region 3 Enable | 0x06 | 0xFE | 2 | r |  |  | 0：disable<br>1：enable |
| Region 4 Enable | 0x06 | 0xFE | 2 | r |  |  | 0：disable<br>1：enable |
| Region 5 Enable | 0x06 | 0xFE | 2 | r |  |  | 0：disable<br>1：enable |
| Region 6 Enable | 0x06 | 0xFE | 2 | r |  |  | 0：disable<br>1：enable |
| Region 7 Enable | 0x06 | 0xFE | 2 | r |  |  | 0：disable<br>1：enable |
| Region 8 Enable | 0x06 | 0xFE | 2 | r |  |  | 0：disable<br>1：enable |
| Region 9 Enable | 0x06 | 0xFE | 2 | r |  |  | 0：disable<br>1：enable |
| Region 10 Enable | 0x06 | 0xFE | 2 | r |  |  | 0：disable<br>1：enable |
| Region 1 Occupancy Status | 0x06 | 0xFE | 2 | r |  |  | 0：vacant<br>1：occupied |
| Region 2 Occupancy Status | 0x06 | 0xFE | 2 | r |  |  | 0：vacant<br>1：occupied |
| Region 3 Occupancy Status | 0x06 | 0xFE | 2 | r |  |  | 0：vacant<br>1：occupied |
| Region 4 Occupancy Status | 0x06 | 0xFE | 2 | r |  |  | 0：vacant<br>1：occupied |
| Region 5 Occupancy Status | 0x06 | 0xFE | 2 | r |  |  | 0：vacant<br>1：occupied |
| Region 6 Occupancy Status | 0x06 | 0xFE | 2 | r |  |  | 0：vacant<br>1：occupied |
| Region 7 Occupancy Status | 0x06 | 0xFE | 2 | r |  |  | 0：vacant<br>1：occupied |
| Region 8 Occupancy Status | 0x06 | 0xFE | 2 | r |  |  | 0：vacant<br>1：occupied |
| Region 9 Occupancy Status | 0x06 | 0xFE | 2 | r |  |  | 0：vacant<br>1：occupied |
| Region 10 Occupancy Status | 0x06 | 0xFE | 2 | r |  |  | 0：vacant<br>1：occupied |
| Historical Data Retransmission Package | 0x20 | 0xCE | 10 | r |  |  |  |
| Timestamp | 0x20 | 0xCE | 5 | r |  |  |  |
| Detection Mode | 0x20 | 0xCE | 2 | r |  |  | 0：People Counting<br>1：Desk Occupancy |
| Total People | 0x20 | 0xCE | 3 | r |  |  |  |
| Region Status | 0x20 | 0xCE | 5 | r |  |  |  |
| Region 1 Enable | 0x20 | 0xCE | 2 | r |  |  | 0：disable<br>1：enable |
| Region 2 Enable | 0x20 | 0xCE | 2 | r |  |  | 0：disable<br>1：enable |
| Region 3 Enable | 0x20 | 0xCE | 2 | r |  |  | 0：disable<br>1：enable |
| Region 4 Enable | 0x20 | 0xCE | 2 | r |  |  | 0：disable<br>1：enable |
| Region 5 Enable | 0x20 | 0xCE | 2 | r |  |  | 0：disable<br>1：enable |
| Region 6 Enable | 0x20 | 0xCE | 2 | r |  |  | 0：disable<br>1：enable |
| Region 7 Enable | 0x20 | 0xCE | 2 | r |  |  | 0：disable<br>1：enable |
| Region 8 Enable | 0x20 | 0xCE | 2 | r |  |  | 0：disable<br>1：enable |
| Region 9 Enable | 0x20 | 0xCE | 2 | r |  |  | 0：disable<br>1：enable |
| Region 10 Enable | 0x20 | 0xCE | 2 | r |  |  | 0：disable<br>1：enable |
| Region 1 Occupancy Status | 0x20 | 0xCE | 2 | r |  |  | 0：vacant<br>1：occupied |
| Region 2 Occupancy Status | 0x20 | 0xCE | 2 | r |  |  | 0：vacant<br>1：occupied |
| Region 3 Occupancy Status | 0x20 | 0xCE | 2 | r |  |  | 0：vacant<br>1：occupied |
| Region 4 Occupancy Status | 0x20 | 0xCE | 2 | r |  |  | 0：vacant<br>1：occupied |
| Region 5 Occupancy Status | 0x20 | 0xCE | 2 | r |  |  | 0：vacant<br>1：occupied |
| Region 6 Occupancy Status | 0x20 | 0xCE | 2 | r |  |  | 0：vacant<br>1：occupied |
| Region 7 Occupancy Status | 0x20 | 0xCE | 2 | r |  |  | 0：vacant<br>1：occupied |
| Region 8 Occupancy Status | 0x20 | 0xCE | 2 | r |  |  | 0：vacant<br>1：occupied |
| Region 9 Occupancy Status | 0x20 | 0xCE | 2 | r |  |  | 0：vacant<br>1：occupied |
| Region 10 Occupancy Status | 0x20 | 0xCE | 2 | r |  |  | 0：vacant<br>1：occupied |
| Temperature Threshold Alarm | 0x83 | 0x67 | 4 | r |  |  |  |
| Alarm Temperature | 0x83 | 0x67 | 3 | r |  | -40 - 125 |  |
| Status | 0x83 | 0x67 | 2 | r |  |  | 0：release<br>1：alarm |
| Humidity Threshold Alarm | 0x84 | 0x68 | 3 | r |  |  |  |
| Alarm Humidity | 0x84 | 0x68 | 2 | r |  | 0 - 100 |  |
| Status | 0x84 | 0x68 | 2 | r |  |  | 0:Release Alarm<br>1：Alarm |
| Reporting Interval Settings Switch | 0xFF | 0x8E | 5 | w |  |  |  |
| Reporting Interval Settings | 0xFF | 0x8E | 4 | w |  |  |  |
| Reporting Interval ID | 0xFF | 0x8E | 2 | w |  |  | 0：sec<br>1：min |
| Reporting Interval | 0xFF | 0x8E | 3 | w | 10 | 2 - 1440 |  |
| Reporting Interval Settings | 0xFF | 0x8E | 4 | w |  |  |  |
| Reporting Interval ID | 0xFF | 0x8E | 2 | w |  |  | 0：sec<br>1：min |
| Reporting Interval | 0xFF | 0x8E | 3 | w | 10 |  | 5：5min<br>10：10min<br>15：15min<br>30：30min<br>60：1h<br>240：4h<br>360：6h<br>480：8h<br>720：12h |
| Reporting Type | 0xF9 | 0x10 | 2 | w | 1 |  | 0：Dot Report<br>1：Now Report |
| Detection Mode | 0xF9 | 0x6B | 2 | w | 0 |  | 0：Auto<br>1：Always ON |
| Detection Interval | 0xFF | 0x02 | 3 | w | 2 |  | 2：2min<br>5：5min<br>10：10min<br>15：15min<br>30：30min<br>60：1h |
| ADR Mode | 0xFF | 0x40 | 2 | w | 0 |  | 0：disable<br>1：enable |
| Threshold Alarm of Temperature | 0xFF | 0x06 | 10 | w |  |  |  |
| Threshold Alarm of Temperature | 0xFF | 0x06 | 2 | w | 0 |  | 0：Disabled<br>1：Condition: Temperature＜A<br>2：Condition: Temperature＞B<br>3：Condition: A＜Temperature＜B<br>4：Condition: Temperature＜A or Temperature＞B |
| Threshold ID | 0xFF | 0x06 | 2 | w | 1 |  | 3: Threshold of Temperature |
| Threshold Enable | 0xFF | 0x06 | 2 | w | 0x01 |  | 1：enable |
| Value A | 0xFF | 0x06 | 3 | w | 0 | -40 - 125 |  |
| Value B | 0xFF | 0x06 | 3 | w | 0 | -40 - 125 |  |
| Threshold Lock Time | 0xFF | 0x06 | 3 | w |  |  |  |
| Threshold Duration | 0xFF | 0x06 | 3 | w |  |  |  |
| Threshold Alarm of Humidity | 0xFF | 0x06 | 10 | w |  |  |  |
| Threshold Alarm of Humidity | 0xFF | 0x06 | 2 | w | 0 |  | 0：Disabled<br>1：Condition: Humidity＜A<br>2：Condition: Humidity＞B<br>3：Condition: A＜Humidity＜B<br>4：Condition: Humidity＜A or Humidity＞B |
| Threshold ID | 0xFF | 0x06 | 2 | w | 2 |  | 3: Threshold of Humidity |
| Threshold Enable | 0xFF | 0x06 | 2 | w | 0x01 |  | 1：enable |
| Value A | 0xFF | 0x06 | 3 | w | 0 | 0 - 100 |  |
| Value B | 0xFF | 0x06 | 3 | w | 0 | 0 - 100 |  |
| Threshold Lock Time | 0xFF | 0x06 | 3 | w |  |  |  |
| Threshold Duration | 0xFF | 0x06 | 3 | w |  |  |  |
| D2D Enable | 0xFF | 0x84 | 2 | w | 0 |  | 0：disable<br>1：enable |
| Data Storage Enable | 0xFF | 0x68 | 2 | w | 0 |  | 0:disable<br>1:enable |
| Data Retransmission Enable | 0xFF | 0x69 | 2 | w | 0 |  | 0:disable<br>1:enable |
| Retransmission Interval Settings | 0xFF | 0x6A | 4 | w |  |  |  |
| Retransmission | 0xFF | 0x6A | 2 | w | 0 |  | 0: retransmission interval |
| Retransmission Interval | 0xFF | 0x6A | 3 | w | 600 | 30 - 1200 |  |
| Retrival Interval Settings | 0xFF | 0x6A | 4 | w |  |  |  |
| Retrival | 0xFF | 0x6A | 2 | w | 1 |  | 1: retrival interval |
| Retrival Interval | 0xFF | 0x6A | 3 | w | 600 | 30 - 1200 |  |

### Service

| CHANNEL |  ID  | TYPE | LENGTH | READ/WRITE | DEFAULT | RANGE | ENUM |
| :------ | :--: | :--: | :----: | :--------: | :-----: | :---: | :--: |
| Trigger a detection | 0xF9 | 0x6C | 2 | w |  |  |  |
| Reset | 0xF9 | 0x6E | 2 | w |  |  |  |
| Rebot | 0xFF | 0x10 | 2 | w |  |  |  |
| Retrival(Time Point) | 0xFD | 0x6B | 5 | w |  |  |  |
| Time Point | 0xFD | 0x6B | 5 | w |  |  |  |
| Retrival(Time Period) | 0xFD | 0x6C | 9 | w |  |  |  |
| Start Time | 0xFD | 0x6C | 5 | w |  |  |  |
| End Time | 0xFD | 0x6C | 5 | w |  |  |  |
| Stop Retrival | 0xFD | 0x6D | 2 | w |  |  |  |

