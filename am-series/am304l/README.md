# AM304L Sensor

![AM304L](am300l.png)

For more detailed information, please visit [Milesight Official Website](https://www.milesight.com/iot/product/lorawan-sensor/am304l)

## Payload Definition

### Attribute

| CHANNEL |  ID  | LENGTH | READ/WRITE | DEFAULT | RANGE | ENUM |
| :------ | :--: | :----: | :--------: | :-----: | :---: | :--: |
| Device Status | 0xFF | 2 | r |  |  |  |
| IPSO | 0xFF | 2 | r |  |  |  |
| SN | 0xFF | 9 | r |  |  |  |
| TSL Version | 0xFF | 3 | r |  |  |  |
| Hardware Version | 0xFF | 3 | r |  |  |  |
| Firmware Version | 0xFF | 3 | r |  |  |  |
| LoRaWAN Work Mode | 0xFF | 2 | r |  |  | 0:class_a |
| Alarm Reporting Times | 0xFF | 3 | rw | 1 | 1 - 1000 |  |
| Alarm Dismiss Report | 0xFF | 2 | rw | 0 |  | 0: disable<br>1: enable |
| LED Indicator | 0xFF | 2 | w | 2 |  | 0：disable<br>2：enable |
| Button Lock | 0xFF | 2 | w |  |  |  |
| Power Off Lock | 0xFF | 2 | w | 0 |  | 0：disable<br>1：enable |
| Power On Lock | 0xFF | 2 | w | 0 |  | 0：disable<br>1：enable |
| Temperature Threshold Settings | 0xFF | 10 | w |  |  |  |
| Threshold Enable | 0xFF | 2 | w | 0 |  | 0：disable<br>1：enable |
| Threshold Condition | 0xFF | 2 | w | 1 |  | 1:condition: x<A<br>2:condition: x>B<br>3:condition: A<x<B<br>4:condition: x<A or x>B |
| Threshold ID | 0xFF | 2 | w |  |  |  |
| Value B | 0xFF | 3 | w | 0 | -20 - 60 |  |
| Value A | 0xFF | 3 | w | 0 | -20 - 60 |  |
| PIR Collecting Enable | 0xFF | 3 | w |  |  |  |
| Sensor Id | 0xFF | 2 | w |  |  | 1:temperature<br>2:humidity<br>3:PIR<br>4:Illuminance<br>5:CO₂ |
| PIR Collecting Enable | 0xFF | 2 | w | 1 |  | 0：disable<br>1：enable |
| Time To Report Vacancy | 0xFF | 3 | w | 120 | 60 - 3600 |  |
| Illuminance Collecting Enable | 0xFF | 3 | w |  |  |  |
| Sensor Id | 0xFF | 2 | w |  |  | 1:temperature<br>2:humidity<br>3:PIR<br>4:Illuminance<br>5:CO₂ |
| Illuminance Collecting Enable | 0xFF | 2 | w | 1 |  | 0：disable<br>1：enable |
| Temperature Calibration Settings | 0xFF | 4 | w |  |  |  |
| Calibration ID | 0xFF | 2 | w |  |  | 1:temperature<br>2:humidity<br>3:CO₂ |
| Calibration Enable | 0xFF | 2 | w | 0 |  | 0: disable<br>1: enable |
| Calibration Value | 0xFF | 3 | w | 0 | -20 - 60 |  |
| Humidity Calibration Settings | 0xFF | 4 | w |  |  |  |
| Calibration ID | 0xFF | 2 | w |  |  | 1:temperature<br>2:humidity<br>3:CO₂ |
| Calibration Enable | 0xFF | 2 | w | 0 |  | 0: disable<br>1: enable |
| Calibration Value | 0xFF | 3 | w | 0 | 0 - 100 |  |
| CO₂ Calibration Settings | 0xFF | 4 | w |  |  |  |
| Calibration ID | 0xFF | 2 | w |  |  | 1:temperature<br>2:humidity<br>3:CO₂ |
| Calibration Enable | 0xFF | 2 | w | 0 |  | 0: disable<br>1: enable |
| Calibration Value | 0xFF | 3 | w | 400 | 400 - 5000 |  |
| CO₂  Auto Background Calibration Settings | 0xFF | 6 | w |  |  |  |
| CO₂  Auto Background Calibration Enable | 0xFF | 2 | w | 1 |  | 0: disable<br>1: enable |
| CO₂ Altitude Compensation | 0xFF | 4 | w |  |  |  |
| CO₂ Altitude Compensation | 0xFF | 2 | w | 0 |  | 0: disable<br>1: enable |
| Compensation Value | 0xFF | 3 | w | 0 | 0 - 5000 |  |
| D2D Controller Settings | 0xFF | 9 | w |  |  |  |
| D2D Controller Settings | 0xFF | 9 | w |  |  |  |
| Trigger Mode | 0xFF | 2 | w | 0 |  | 0:PIR Trigger<br>1:PIR Vacant<br>2:Illuminance Bright<br>3:Illuminance Dim<br>4:Trigger/Bright<br>5:Trigger/Dim |
| Enable | 0xFF | 2 | w | 0 |  | 0：disable<br>1：enable |
| LoRa Uplink | 0xFF | 2 | w | 0 |  | 0：disable<br>1：enable |
| Control Command | 0xFF | 3 | w | 0000 |  |  |
| Enable Control Time | 0xFF | 2 | w | 0 |  | 0：disable<br>1：enable |
| Control Time | 0xFF | 3 | w | 5 | 1 - 1440 |  |
| Data Storage Enable | 0xFF | 2 | w |  |  |  |
| Data Storage Enable | 0xFF | 2 | w | 0 |  | 0：disable<br>1：enable |
| Data Retransmission Enable | 0xFF | 2 | w |  |  |  |
| Data Retransmission Enable | 0xFF | 2 | w | 0 |  | 0：disable<br>1：enable |
| Electricity | 0x01 | 2 | r |  | 1 - 100 |  |
| Temperature | 0x03 | 3 | r |  | -20 - 60 |  |
| Humidity | 0x04 | 2 | r |  | 0 - 100 |  |
| PIR | 0x05 | 3 | r |  |  |  |
| PIR Status | 0x05 | 3 | r |  |  | 0:vacant<br>1:trigger |
| PIR Count | 0x05 | 3 | r |  | 0 - 32767 |  |
| Illuminance Level | 0x06 | 2 | r |  | 0 - 5 |  |
| Illuminance Value | 0x06 | 3 | r |  | 0 - 60000 |  |
| Reporting Interval | 0xF9 | 4 | w |  |  |  |
| Interval Unit | 0xF9 | 2 | w |  |  | 0:second<br>1:minute |
| Reporting Interval | 0xF9 | 3 | w | 10 | 1 - 1440 |  |
| Collecting Interval | 0xF9 | 5 | w |  |  |  |
| Collecting ID | 0xF9 | 2 | w |  |  | 0:temperature<br>humidity<br>CO₂ collect interval<br>1:illuminace collect interval |
| Interval Unit | 0xF9 | 2 | w |  |  | 0:second<br>1:minute |
| Collecting Interval | 0xF9 | 3 | w | 10 | 1 - 1440 |  |
| Temperature Unit | 0xF9 | 3 | w |  |  |  |
| Sensor Id | 0xF9 | 2 | w |  |  | 0:temperature<br>1:Illuminance |
| Temperature Unit | 0xF9 | 2 | w | 0 |  | 0:celsius<br>1:fahrenheit |
| CO₂ Threshold Settings | 0xF9 | 7 | w |  |  |  |
| Threshold Enable | 0xF9 | 2 | w | 0 |  | 0：disable<br>1：enable |
| Threshold Mode | 0xF9 | 2 | w | 2 |  | 0:enable 1-level only<br>1:enable 2-levle only<br>2:enable 1-level&2-levle |
| Bad,1-level Alarm Value | 0xF9 | 3 | w | 400 | 400 - 5000 |  |
| Polluted,2-level Alarm Value | 0xF9 | 3 | w | 5000 | 400 - 5000 |  |
| PIR Trigger Reporting | 0xF9 | 3 | w |  |  |  |
| Report Type | 0xF9 | 2 | w |  |  | 0:trigger report<br>1:vacant report |
| PIR Trigger Reporting | 0xF9 | 2 | w | 0 |  | 0：disable<br>1：enable |
| PIR Vacant Reporting | 0xF9 | 3 | w |  |  |  |
| Report Type | 0xF9 | 2 | w |  |  | 0:trigger report<br>1:vacant report |
| PIR Vacant Reporting | 0xF9 | 2 | w | 0 |  | 0：disable<br>1：enable |
| Illuminance Threshold Settings | 0xF9 | 6 | w |  |  |  |
| Illuminance Threshold Enable | 0xF9 | 2 | w | 0 |  | 0：disable<br>1：enable |
| Dim,Below | 0xF9 | 3 | w | 300 | 0 - 60000 |  |
| Bright,Above | 0xF9 | 3 | w | 700 | 0 - 60000 |  |
| D2D Data Transmission Settings | 0xF9 | 5 | w |  |  |  |
| D2D Data Transmission Enalbe | 0xF9 | 2 | w | 0 |  | 0：disable<br>1：enable |
| LoRa Uplink | 0xF9 | 2 | w | 0 |  | 0：disable<br>1：enable |
| Temperature | 0xF9 | 3 | w | 0 |  | 0：disable<br>1：enable |
| Humidity | 0xF9 | 3 | w | 0 |  | 0：disable<br>1：enable |
| D2D Controller Enable | 0xF9 | 2 | w | 0 |  | 0：disable<br>1：enable |

### Event

| CHANNEL |  ID  | LENGTH | READ/WRITE | DEFAULT | RANGE | ENUM |
| :------ | :--: | :----: | :--------: | :-----: | :---: | :--: |
| Request Tsl Config | 0xFF | 2 | r |  |  |  |
| PIR Status Change | 0x05 | 2 | r |  |  |  |
| Abnormal temperature | 0xB3 | 2 | r |  |  |  |
| Abnormal humidity | 0xB4 | 2 | r |  |  |  |
| Abnormal illuminace Level | 0xB6 | 2 | r |  |  |  |
| Abnormal illuminace Value | 0xB6 | 2 | r |  |  |  |
| Temperature Threshold Alarm | 0x83 | 4 | r |  |  |  |
| Illuminace Value Threshold Alarm | 0x86 | 4 | r |  |  |  |
| Historical Data Return | 0x20 | M | r |  |  |  |
| Historical Data Return | 0x21 | M | r |  |  |  |

### Service

| CHANNEL |  ID  | LENGTH | READ/WRITE | DEFAULT | RANGE | ENUM |
| :------ | :--: | :----: | :--------: | :-----: | :---: | :--: |
| CO₂ Restore Factory Calibration | 0xFF | 2 | w |  |  |  |
| CO₂ Manual Calibration | 0xFF | 2 | w |  |  |  |
| PIR Status | 0x05 | 2 | r |  |  | 0:vacant<br>1:trigger |
| Abnormal temperature | 0xB3 | 2 | r |  |  | 0:collect abnormal<br>1:collect out of range |
| Abnormal humidity | 0xB4 | 2 | r |  |  | 0:collect abnormal |
| Abnormal illuminace Level | 0xB6 | 2 | r |  |  | 0:collect abnormal |
| Abnormal illuminace Value | 0xB6 | 2 | r |  |  | 0:collect abnormal<br>1:collect out of range |
| Temperature | 0x83 | 3 | r |  |  |  |
| Alarm Type | 0x83 | 2 | r |  |  | 16:below alarm released<br>17:below alarm<br>18:above alarm released<br>19:above alarm<br>20:within alarm released<br>21:within alarm<br>22:exceed tolerance alarm released<br>23:exceed tolerance alarm |
| Illuminace Value | 0x86 | 3 | r |  |  |  |
| Alarm Type | 0x86 | 2 | r |  |  | 16:dim<br>17:bright |
| Timestamp | 0x20 | 5 | r |  |  |  |
| Temperature Type | 0x20 | 2 | r |  |  | 0:data invalid<br>1:data valid<br>2:data out of range<br>3:data collect abnormal |
| Temperature | 0x20 | 3 | r |  |  |  |
| Humidity type | 0x20 | 2 | r |  |  | 0:data invalid<br>1:data valid<br>2:data out of range<br>3:data collect abnormal |
| Humidity | 0x20 | 2 | r |  |  |  |
| PIR type | 0x20 | 2 | r |  |  | 0:data invalid<br>1:data valid |
| PIR Status | 0x20 | 2 | r |  |  | 0:vacant<br>1:trigger |
| PIR Count | 0x20 | 3 | r |  |  |  |
| Illuminance Level Type | 0x20 | 2 | r |  |  | 0:data invalid<br>1:data valid<br>2:data out of range<br>3:data collect abnormal |
| Illuminance Level | 0x20 | 3 | r |  |  |  |
| Timestamp | 0x21 | 5 | r |  |  |  |
| Temperature type | 0x21 | 2 | r |  |  | 0:data invalid<br>1:data valid<br>2:data out of range<br>3:data collect abnormal |
| Temperature | 0x21 | 3 | r |  |  |  |
| Humidity Type | 0x21 | 2 | r |  |  | 0:data invalid<br>1:data valid<br>2:data out of range<br>3:data collect abnormal |
| Humidity | 0x21 | 2 | r |  |  |  |
| PIR Type | 0x21 | 2 | r |  |  | 0:data invalid<br>1:data valid |
| PIR Status | 0x21 | 2 | r |  |  | 0:vacant<br>1:trigger |
| PIR Count | 0x21 | 3 | r |  |  |  |
| Illuminace Value Type | 0x21 | 2 | r |  |  | 0:data invalid<br>1:data valid<br>2:data out of range<br>3:data collect abnormal |
| Illuminace Value | 0x21 | 3 | r |  |  |  |

