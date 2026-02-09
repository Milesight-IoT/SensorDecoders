# GS601 Sensor

![GS601](gs601.png)

For more detailed information, please visit [Milesight Official Website](https://www.milesight.com/iot/product/lorawan-sensor/gs601)

## Payload Definition

### Attribute

| CHANNEL |  ID  | LENGTH | READ/WRITE | DEFAULT | RANGE | ENUM |
| :------ | :--: | :----: | :--------: | :-----: | :---: | :--: |
| LoRaWAN  Settings | 0xCF | 1 | rw |  |  |  |
| LoRaWAN Comand | 0xCF | 2 | rw |  |  |  |
| LoRaWAN Work Mode | 0xCF | 2 | rw | 0 |  | 0:ClassA<br>1:ClassB<br>2:ClassC<br>3:ClassC to B |
| TSL Version | 0xDF | 3 | r |  |  |  |
| SN | 0xDB | 9 | r |  |  |  |
| Product Version | 0xDA | 9 | r |  |  |  |
| Hardware Version | 0xDA | 3 | r |  |  |  |
| Firmware Version | 0xDA | 7 | r |  |  |  |
| OEM ID | 0xD9 | 3 | rw |  |  |  |
| Battery | 0x00 | 2 | r |  | 0 - 100 |  |
| Vaping Index | 0x01 | 2 | r |  | 0 - 100 |  |
| PM1.0 | 0x03 | 3 | r |  | 0 - 1000 |  |
| PM2.5 | 0x05 | 3 | r |  | 0 - 1000 |  |
| PM10 | 0x07 | 3 | r |  | 0 - 1000 |  |
| Temperature | 0x09 | 3 | r |  | -20 - 60 |  |
| Humidity | 0x0B | 3 | r |  | 0 - 100 |  |
| TVOC | 0x0D | 3 | r |  | 0 - 2000 |  |
| Tamper Status | 0x0F | 2 | r |  |  | 0：Normal<br>1：Triggered |
| Buzzer | 0x11 | 2 | r |  |  | 0：Normal<br>1：Triggered |
| Occupancy Status | 0x12 | 2 | r |  |  | 0：vacant<br>1：occuppied |
|  TVOC Data | 0x20 | 9 | r |  |  |  |
|  TVOC Data | 0x20 | 5 | r |  |  |  |
|  TVOC Data | 0x20 | 5 | r |  |  |  |
|  TVOC Data | 0x21 | 9 | r |  |  |  |
|  TVOC Data | 0x21 | 5 | r |  |  |  |
|  TVOC Data | 0x21 | 5 | r |  |  |  |
|  TVOC Data | 0x22 | 9 | r |  |  |  |
|  TVOC Data | 0x22 | 5 | r |  |  |  |
|  TVOC Data | 0x22 | 5 | r |  |  |  |
|  TVOC Data | 0x23 | 9 | r |  |  |  |
|  TVOC Data | 0x23 | 5 | r |  |  |  |
|  TVOC Data | 0x23 | 5 | r |  |  |  |
|  TVOC Data | 0x24 | 9 | r |  |  |  |
|  TVOC Data | 0x24 | 5 | r |  |  |  |
|  TVOC Data | 0x24 | 5 | r |  |  |  |
|  TVOC Data | 0x25 | 9 | r |  |  |  |
|  TVOC Data | 0x25 | 5 | r |  |  |  |
|  TVOC Data | 0x25 | 5 | r |  |  |  |
|  TVOC Data | 0x26 | 9 | r |  |  |  |
|  TVOC Data | 0x26 | 5 | r |  |  |  |
|  TVOC Data | 0x26 | 5 | r |  |  |  |
|  TVOC Data | 0x27 | 9 | r |  |  |  |
|  TVOC Data | 0x27 | 5 | r |  |  |  |
|  TVOC Data | 0x27 | 5 | r |  |  |  |
|  TVOC Data | 0x28 | 9 | r |  |  |  |
|  TVOC Data | 0x28 | 5 | r |  |  |  |
|  TVOC Data | 0x28 | 5 | r |  |  |  |
|  TVOC Data | 0x29 | 9 | r |  |  |  |
|  TVOC Data | 0x29 | 5 | r |  |  |  |
|  TVOC Data | 0x29 | 5 | r |  |  |  |
|  TVOC Data | 0x2A | 9 | r |  |  |  |
|  TVOC Data | 0x2A | 5 | r |  |  |  |
|  TVOC Data | 0x2A | 5 | r |  |  |  |
| PM Sensor Working Time | 0x2B | 5 | r |  |  |  |
| Random key | 0xC9 | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Device Status | 0xC8 | 2 | r | 1 |  | 0：Off<br>1：On |
| Reporting Interval | 0x60 | 1 | rw |  |  |  |
| Reporting Interval Unit | 0x60 | 2 | rw | 1 |  | 0：second<br>1：min |
| Reporting Interval | 0x60 | 3 | rw | 600 | 10 - 64800 |  |
| Reporting Interval | 0x60 | 3 | rw | 10 | 1 - 1440 |  |
| Temperature Unit | 0x61 | 2 | rw | 0 |  | 0：℃<br>1：℉ |
| Tampering Alarm Enable | 0x67 | 2 | rw | 1 |  | 0：disable<br>1：enable |
| LED Indicator | 0x62 | 2 | rw | 1 |  | 0：disable<br>1：enable |
| Buzzer Enable | 0x63 | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Hibernate Period | 0x64 | 1 | rw |  |  |  |
| Number | 0x64 | 2 | rw |  |  |  |
| Hibernate Period | 0x64 | 6 | rw |  |  |  |
| Hibernate Period 1 | 0x64 | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Start Time | 0x64 | 3 | rw | 420 | 0 - 1439 |  |
| End Time | 0x64 | 3 | rw | 480 | 0 - 1439 |  |
| Hibernate Period | 0x64 | 6 | rw |  |  |  |
| Hibernate Period 2 | 0x64 | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Start Time | 0x64 | 3 | rw | 1080 | 0 - 1439 |  |
| End Time | 0x64 | 3 | rw | 1140 | 0 - 1439 |  |
| Stop Buzzer | 0x65 | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Buzzer Silence Time | 0x66 | 3 | rw | 15 | 0 - 1440 |  |
| Time Zone | 0xC7 | 3 | rw | 0 |  | -720：UTC-12(IDLW)<br>-660：UTC-11(SST)<br>-600：UTC-10(HST)<br>-570：UTC-9:30(MIT)<br>-540：UTC-9(AKST)<br>-480：UTC-8(PST)<br>-420：UTC-7(MST)<br>-360：UTC-6(CST)<br>-300：UTC-5(EST)<br>-240：UTC-4(AST)<br>-210：UTC-3:30(NST)<br>-180：UTC-3(BRT)<br>-120：UTC-2(FNT)<br>-60：UTC-1(CVT)<br>0：UTC(WET)<br>60：UTC+1(CET)<br>120：UTC+2(EET)<br>180：UTC+3(MSK)<br>210：UTC+3:30(IRST)<br>240：UTC+4(GST)<br>270：UTC+4:30(AFT)<br>300：UTC+5(PKT)<br>330：UTC+5:30(IST)<br>345：UTC+5:45(NPT)<br>360：UTC+6(BHT)<br>390：UTC+6:30(MMT)<br>420：UTC+7(ICT)<br>480：UTC+8(CT/CST)<br>540：UTC+9(JST)<br>570：UTC+9:30(ACST)<br>600：UTC+10(AEST)<br>630：UTC+10:30(LHST)<br>660：UTC+11(VUT)<br>720：UTC+12(NZST)<br>765：UTC+12:45(CHAST)<br>780：UTC+13(PHOT)<br>840：UTC+14(LINT) |
| Daylight Saving Time | 0xC6 | M | rw |  |  |  |
| Daylight Saving Time | 0xC6 | 2 | rw | 0 |  | 0：disable<br>1：enable |
| DST Bias | 0xC6 | 2 | rw | 60 | 0 - 120 |  |
|  Month | 0xC6 | 2 | rw | 3 |  | 1:Jan.<br>2:Feb.<br>3:Mar.<br>4:Apr.<br>5:May<br>6:Jun.<br>7:Jul.<br>8:Aug.<br>9:Sep.<br>10:Oct.<br>11:Nov.<br>12:Dec. |
|  Number of Week | 0xC6 | 2 | rw | 2 |  | 1:1st<br>2: 2nd<br>3: 3rd<br>4: 4th<br>5: last |
| Week | 0xC6 | 2 | rw | 7 |  | 1：Mon.<br>2：Tues.<br>3：Wed.<br>4：Thurs.<br>5：Fri.<br>6：Sat.<br>7：Sun. |
| Time | 0xC6 | 3 | rw | 0 |  | 0：00:00<br>60：01:00<br>120：02:00<br>180：03:00<br>240：04:00<br>300：05:00<br>360：06:00<br>420：07:00<br>480：08:00<br>540：09:00<br>600：10:00<br>660：11:00<br>720：12:00<br>780：13:00<br>840：14:00<br>900：15:00<br>960：16:00<br>1020：17:00<br>1080：18:00<br>1140：19:00<br>1200：20:00<br>1260：21:00<br>1320：22:00<br>1380：23:00 |
|  Month | 0xC6 | 2 | rw | 11 |  | 1:Jan.<br>2:Feb.<br>3:Mar.<br>4:Apr.<br>5:May<br>6:Jun.<br>7:Jul.<br>8:Aug.<br>9:Sep.<br>10:Oct.<br>11:Nov.<br>12:Dec. |
|  Number of Week | 0xC6 | 2 | rw | 1 |  | 1:1st<br>2: 2nd<br>3: 3rd<br>4: 4th<br>5: last |
| Week | 0xC6 | 2 | rw | 1 |  | 1：Mon.<br>2：Tues.<br>3：Wed.<br>4：Thurs.<br>5：Fri.<br>6：Sat.<br>7：Sun. |
| Time | 0xC6 | 3 | rw | 0 |  | 0：00:00<br>60：01:00<br>120：02:00<br>180：03:00<br>240：04:00<br>300：05:00<br>360：06:00<br>420：07:00<br>480：08:00<br>540：09:00<br>600：10:00<br>660：11:00<br>720：12:00<br>780：13:00<br>840：14:00<br>900：15:00<br>960：16:00<br>1020：17:00<br>1080：18:00<br>1140：19:00<br>1200：20:00<br>1260：21:00<br>1320：22:00<br>1380：23:00 |
| TVOC Raw Data Report | 0x68 | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Temperature Threshold Alarm | 0x69 | 7 | rw |  |  |  |
| Temperature Threshold Alarm | 0x69 | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Threshold Condition | 0x69 | 2 | rw | 0 |  | 0:disable<br>1:condition: x<A<br>2:condition: x>B<br>3:condition: A<x<B<br>4:condition: x<A or x>B |
| Value A | 0x69 | 3 | rw | 0 | -20 - 60 |  |
| Value B | 0x69 | 3 | rw | 0 | -20 - 60 |  |
| PM1.0 Threshold Alarm | 0x6A | 7 | rw |  |  |  |
| PM1.0 Threshold Alarm | 0x6A | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Threshold Condition | 0x6A | 2 | rw |  |  | 0:disable<br>1:condition: x<A<br>2:condition: x>B<br>3:condition: A<x<B<br>4:condition: x<A or x>B |
| Value A | 0x6A | 3 | rw | 0 | 0 - 1000 |  |
| Over | 0x6A | 3 | rw | 0 | 0 - 1000 |  |
| PM2.5 Threshold Alarm | 0x6B | 7 | rw |  |  |  |
| PM2.5 Threshold Alarm | 0x6B | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Threshold Condition | 0x6B | 2 | rw |  |  | 0:disable<br>1:condition: x<A<br>2:condition: x>B<br>3:condition: A<x<B<br>4:condition: x<A or x>B |
| Value A | 0x6B | 3 | rw | 0 | 0 - 1000 |  |
| Over | 0x6B | 3 | rw | 0 | 0 - 1000 |  |
| PM10 Threshold Alarm | 0x6C | 7 | rw |  |  |  |
| PM10 Threshold Alarm | 0x6C | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Threshold Condition | 0x6C | 2 | rw |  |  | 0:disable<br>1:condition: x<A<br>2:condition: x>B<br>3:condition: A<x<B<br>4:condition: x<A or x>B |
| Value A | 0x6C | 3 | rw | 0 | 0 - 1000 |  |
| Over | 0x6C | 3 | rw | 0 | 0 - 1000 |  |
| TVOC Threshold Alarm | 0x6D | 7 | rw |  |  |  |
| TVOC Threshold Alarm | 0x6D | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Threshold Condition | 0x6D | 2 | rw |  |  | 0:disable<br>1:condition: x<A<br>2:condition: x>B<br>3:condition: A<x<B<br>4:condition: x<A or x>B |
| Value A | 0x6D | 3 | rw | 0 | 0 - 2000 |  |
| Over | 0x6D | 3 | rw | 0 | 0 - 2000 |  |
| Vaping Threshold Alarm | 0x6E | 5 | rw |  |  |  |
| Vaping Threshold Alarm | 0x6E | 2 | rw | 1 |  | 0：disable<br>1：enable |
| Threshold Condition | 0x6E | 2 | rw |  |  | 0:disable<br>1:condition: x<A<br>2:condition: x>B<br>3:condition: A<x<B<br>4:condition: x<A or x>B |
| Value A | 0x6E | 2 | rw | 0 | 0 - 100 |  |
| Over | 0x6E | 2 | rw | 5 | 0 - 100 |  |
| Alarm Reporting Times | 0x6F | 3 | rw | 1 | 1 - 1000 |  |
| Threshold Alarm Release | 0x70 | 2 | rw | 1 |  | 0：disable<br>1：enable |
| Temperature Calibration Settings | 0x71 | 4 | rw |  |  |  |
| Temperature Calibration | 0x71 | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Calibration Value | 0x71 | 3 | rw | 0 | -80 - 80 |  |
| Humidity Calibration Settings | 0x72 | 4 | rw |  |  |  |
| Humidity Calibration | 0x72 | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Calibration Value | 0x72 | 3 | rw | 0 | -100 - 100 |  |
| PM1.0 Calibration Settings | 0x73 | 4 | rw |  |  |  |
| PM1.0 Calibration | 0x73 | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Calibration Value | 0x73 | 3 | rw | 0 | -1000 - 1000 |  |
| PM2.5 Calibration Settings | 0x74 | 4 | rw |  |  |  |
| PM2.5 Calibration | 0x74 | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Calibration Value | 0x74 | 3 | rw | 0 | -1000 - 1000 |  |
| PM10 Calibration Settings | 0x75 | 4 | rw |  |  |  |
| PM10 Calibration | 0x75 | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Calibration Value | 0x75 | 3 | rw | 0 | -1000 - 1000 |  |
| TVOC Calibration Settings | 0x76 | 4 | rw |  |  |  |
| TVOC Calibration | 0x76 | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Calibration Value | 0x76 | 3 | rw | 0 | -2000 - 2000 |  |
| Vaping Calibration Settings | 0x77 | 3 | rw |  |  |  |
| Vaping Calibration | 0x77 | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Calibration Value | 0x77 | 2 | rw | 0 | -100 - 100 |  |

### Event

| CHANNEL |  ID  | LENGTH | READ/WRITE | DEFAULT | RANGE | ENUM |
| :------ | :--: | :----: | :--------: | :-----: | :---: | :--: |
| Order Check Response | 0xFE | 2 | r |  |  |  |
| Full Inspection Response | 0xF4 | 1 | r |  |  |  |
| Command Response | 0xEF | 1 | r |  |  |  |
| Request to Push All Configurations | 0xEE | 1 | r |  |  |  |
| Vaping Index Alarm | 0x02 | 1 | r |  |  |  |
| PM1.0 Alarm | 0x04 | 1 | r |  |  |  |
| PM2.5 Alarm | 0x06 | 1 | r |  |  |  |
| PM10 Alarm | 0x08 | 1 | r |  |  |  |
| Temperature  Alarm | 0x0A | 1 | r |  |  |  |
| Humidity Alarm | 0x0C | 1 | r |  |  |  |
| TVOC Alarm | 0x0E | 1 | r |  |  |  |
| Tamper Status | 0x10 | 1 | r |  |  |  |

### Service

| CHANNEL |  ID  | LENGTH | READ/WRITE | DEFAULT | RANGE | ENUM |
| :------ | :--: | :----: | :--------: | :-----: | :---: | :--: |
| Order Check | 0xFE | 2 | w |  |  |  |
| Order | 0xFE | 2 | w | 0 | 0 - 255 |  |
| Order | 0xFE | 2 | r | 0 | 0 - 255 |  |
| Full Inspection Request | 0xF4 | 1 | w |  |  |  |
| Full Inspection Request Subcommand | 0xF4 | 2 | w |  |  |  |
| Full Inspection Start | 0xF4 | 1 | w |  |  |  |
| Full Inspection Control | 0xF4 | 1 | w |  |  |  |
| Control Command Length | 0xF4 | 3 | w | 0 | 0 - 65535 |  |
| Control Command Content | 0xF4 | 1 | w |  |  |  |
| Full Inspection Read | 0xF4 | 1 | w |  |  |  |
| Read Parameter Length | 0xF4 | 3 | w |  |  |  |
| Read Parameter Content | 0xF4 | 1 | w | 0 | 0 - 65535 |  |
| Full Inspection End | 0xF4 | 1 | w |  |  |  |
| Full Inspection Response Subcommand | 0xF4 | 2 | r |  |  |  |
| Full Inspection Start Response | 0xF4 | 2 | r |  |  |  |
| Full Inspection Start Response  | 0xF4 | 2 | r | 0 |  | 0：success<br>1：failed |
| Full Inspection Control Response | 0xF4 | 2 | r |  |  |  |
| Full Inspection Control Response  | 0xF4 | 2 | r | 0 |  | 0：success<br>1：failed |
| Full Inspection Read Response | 0xF4 | 1 | r |  |  |  |
| Read Response Length | 0xF4 | 3 | r | 0 | 0 - 65535 |  |
| Read Response Content | 0xF4 | 1 | r |  |  |  |
| Full Inspection End Response | 0xF4 | 2 | r |  |  |  |
| Full Inspection End Response | 0xF4 | 2 | r | 0 |  | 0：success<br>1：failed |
| Command Queries | 0xEF | 1 | w |  |  |  |
| Query Information | 0xEF | 2 | w |  |  |  |
| Command Length | 0xEF | 2 | w | 1 | 1 - 15 |  |
| The command that was queried | 0xEF | 1 | w |  |  |  |
| Answer Result | 0xEF | 2 | r | 0 |  | 0：success<br>1：unknow<br>2：error order<br>3：error passwd<br>4：error read params<br>5：error write params<br>6：error read<br>7：error write<br>8：error read apply<br>9：error write apply |
| Command Length | 0xEF | 2 | r | 1 | 1 - 15 |  |
| Answered Commands | 0xEF | 1 | r |  |  |  |
| Alarm Type | 0x02 | 2 | r |  |  |  |
| Collection Error | 0x02 | 1 | r |  |  |  |
| Out of The Low Range | 0x02 | 1 | r |  |  |  |
| Out of The High Range | 0x02 | 1 | r |  |  |  |
| Threshold Alarm Release | 0x02 | 2 | r |  |  |  |
| Vaping Index | 0x02 | 2 | r |  | 0 - 100 |  |
| Threshold Alarm | 0x02 | 2 | r |  |  |  |
| Vaping Index | 0x02 | 2 | r |  | 0 - 100 |  |
| Vaping Interference Alarm Release | 0x02 | 1 | r |  |  |  |
| Vaping Interference Alarm | 0x02 | 1 | r |  |  |  |
| Alarm Type | 0x04 | 2 | r |  |  |  |
| Collection Error | 0x04 | 1 | r |  |  |  |
| Out of The Low Range | 0x04 | 1 | r |  |  |  |
| Out of The High Range | 0x04 | 1 | r |  |  |  |
| Threshold Alarm Release | 0x04 | 3 | r |  |  |  |
| PM1.0 | 0x04 | 3 | r |  | 0 - 1000 |  |
| PM1.0 Threshold Alarm | 0x04 | 3 | r |  |  |  |
| PM1.0 | 0x04 | 3 | r |  | 0 - 1000 |  |
| Alarm Type | 0x06 | 2 | r |  |  |  |
| Collection Error | 0x06 | 1 | r |  |  |  |
| Out of The Low Range | 0x06 | 1 | r |  |  |  |
| Out of The High Range | 0x06 | 1 | r |  |  |  |
| Threshold Alarm Release | 0x06 | 3 | r |  |  |  |
| PM2.5 | 0x06 | 3 | r |  | 0 - 1000 |  |
| PM2.5 Threshold Alarm | 0x06 | 3 | r |  |  |  |
| PM2.5 | 0x06 | 3 | r |  | 0 - 1000 |  |
| Alarm Type | 0x08 | 2 | r |  |  |  |
| Collection Error | 0x08 | 1 | r |  |  |  |
| Out of The Low Range | 0x08 | 1 | r |  |  |  |
| Out of The High Range | 0x08 | 1 | r |  |  |  |
| Threshold Alarm Release | 0x08 | 3 | r |  |  |  |
| PM10 | 0x08 | 3 | r |  | 0 - 1000 |  |
| Threshold Alarm | 0x08 | 3 | r |  |  |  |
| PM10 | 0x08 | 3 | r |  | 0 - 1000 |  |
| Alarm Type | 0x0A | 2 | r |  |  |  |
| Collection Error | 0x0A | 1 | r |  |  |  |
| Out of The Low Range | 0x0A | 1 | r |  |  |  |
| Out of The High Range | 0x0A | 1 | r |  |  |  |
| Threshold Alarm Release | 0x0A | 3 | r |  |  |  |
| Temperature | 0x0A | 3 | r |  | -20 - 60 |  |
| Threshold Alarm | 0x0A | 3 | r |  |  |  |
| Temperature | 0x0A | 3 | r |  | -20 - 60 |  |
| Burning alarm Release | 0x0A | 1 | r |  |  |  |
| Burning Alarm | 0x0A | 1 | r |  |  |  |
| Alarm Type | 0x0C | 2 | r |  |  |  |
| Humidity  Collection Error | 0x0C | 1 | r |  |  |  |
| Humidity  Out of The Low Range | 0x0C | 1 | r |  |  |  |
| Humidity Out of The High Range | 0x0C | 1 | r |  |  |  |
| Alarm Type | 0x0E | 2 | r |  |  |  |
| Collection Error | 0x0E | 1 | r |  |  |  |
| Out of The Low Range | 0x0E | 1 | r |  |  |  |
| Out of The High Range | 0x0E | 1 | r |  |  |  |
| Threshold Alarm Release | 0x0E | 3 | r |  |  |  |
| TVOC | 0x0E | 3 | r |  | 0 - 2000 |  |
| Threshold Alarm | 0x0E | 3 | r |  |  |  |
| TVOC | 0x0E | 3 | r |  | 0 - 2000 |  |
| Alarm Type | 0x10 | 2 | r |  |  |  |
| Normal | 0x10 | 1 | r |  |  |  |
| Triggered | 0x10 | 1 | r |  |  |  |
| Reset | 0xBF | 1 | w |  |  |  |
| Reboot | 0xBE | 1 | w |  |  |  |
| Clear Data | 0xBD | 1 | w |  |  |  |
| Stop Retrieval | 0xBC | 1 | w |  |  |  |
| Retrieval(Time Period) | 0xBB | 5 | w |  |  |  |
| Time Point | 0xBB | 5 | w |  |  |  |
| Retrieval(Time Period) | 0xBA | 9 | w |  |  |  |
| Start Time | 0xBA | 5 | w |  |  |  |
| End Time | 0xBA | 5 | w |  |  |  |
| Query Device Status | 0xB9 | 1 | w |  |  |  |
| Time Synchronize | 0xB8 | 1 | w |  |  |  |
| Time Synchronize | 0xB7 | 5 | w |  |  |  |
| Timestamp | 0xB7 | 5 | w |  |  |  |
| Network Reconnection | 0xB6 | 1 | w |  |  |  |
| Stop Buzzer | 0x5F | 1 | w |  |  |  |
| TVOC Self-Cleaning | 0x5E | 1 | w |  |  |  |

