# TS602 Sensor

![TS602](ts602.png)

For more detailed information, please visit [Milesight Official Website](https://www.milesight.com/iot/product/lorawan-sensor/ts602)

## Payload Definition

### Attribute

| CHANNEL |  ID  | LENGTH | READ/WRITE | DEFAULT | RANGE | ENUM |
| :------ | :--: | :----: | :--------: | :-----: | :---: | :--: |
| TSL Version | 0xDF | 3 | r |  |  |  |
| Product Name | 0xDE | 33 | rw |  |  |  |
| PN | 0xDD | 33 | rw |  |  |  |
| SN | 0xDB | 9 | r |  |  |  |
| Product Version | 0xDA | 9 | r |  |  |  |
| Hardware Version | 0xDA | 3 | r |  |  |  |
| Firmware Version | 0xDA | 7 | r |  |  |  |
| OEM ID | 0xD9 | 3 | rw |  |  |  |
| Random key | 0xC9 | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Device Status | 0xC8 | 2 | rw | 1 |  | 0：Off<br>1：On |
| Product Region | 0xD8 | 17 | r |  |  |  |
| Device Information | 0xD7 | M | r |  |  |  |
| Model | 0xD7 | 9 | r |  |  |  |
| Sub-model 1 | 0xD7 | 9 | r |  |  |  |
| Sub-model 2 | 0xD7 | 9 | r |  |  |  |
| Sub-model 3 | 0xD7 | 9 | r |  |  |  |
| Sub-model 4 | 0xD7 | 9 | r |  |  |  |
| PN1 | 0xD7 | 9 | r |  |  |  |
| PN2 | 0xD7 | 9 | r |  |  |  |
| PN3 | 0xD7 | 9 | r |  |  |  |
| PN4 | 0xD7 | 9 | r |  |  |  |
| Battery | 0x01 | 2 | r |  | 0 - 100 |  |
| Sensor ID | 0x03 | 10 | r |  |  |  |
| Sensor Type | 0x03 | 2 | r | 0 |  | 0：none<br>1:PT100<br>2: SHT41<br>3: DS18B20 |
| Sensor ID | 0x03 | 9 | r |  |  |  |
| Temperature | 0x04 | 5 | r |  | -200 - 800 |  |
| Humidity | 0x05 | 3 | r |  | 0 - 100 |  |
| Base station positioning | 0x06 | 9 | r |  |  |  |
| Latitude | 0x06 | 5 | r |  | -90 - 90 |  |
| Longitude | 0x06 | 5 | r |  | -180 - 180 |  |
| Airplane Mode State | 0x07 | 2 | r | 0 |  | 0: enter airplane mode<br>1: exit airplane mode |
| Temperature  Alarm Type | 0x1A | 2 | r | 3 |  | 3：No Data<br>16：Temperature Below Alarm Released<br>17：Temperature Below Alarm<br>18：Temperature Above Alarm Released<br>19：Temperature Above Alarm<br>20：Temperature Between Alarm Released<br>21：Temperature Between Alarm<br>22：Temperature Exceed Tolerance Alarm Released<br>23：Temperature Exceed Tolerance Alarm<br>48：Temperature Shift Threshold<br>32：Temperature Shift Threshold |
| Humidity  Alarm Type | 0x1B | 2 | r | 3 |  | 3: No Data<br>16:humidity Below Alarm Released<br>17:humidity Below Alarm<br>18:humidity Above Alarm Released<br>19:humidity Above Alarm<br>20:humidity Between Alarm Released<br>21:humidity Between Alarm<br>22:humidity Exceed Tolerance Alarm Released<br>23:humidity Exceed Tolerance Alarm<br>48:humidity Shift Threshold<br>32:humidity Shift Threshold |
| Tilt  Alarm Type | 0x1C | 2 | r | 3 |  | 1：Exceed the Range Lower Limit<br>2：Exceed the Range Upper Limit<br>3：No Data<br>16：Tilt  Alam Release<br>17：Tilt Alam<br>33：Falling  Alam |
| Light  Alarm Type | 0x1D | 2 | r | 3 |  | 1：Exceed the Range Lower Limit<br>2：Exceed the Range Upper Limit<br>3：No Data<br>16：Bright to dark<br>17：Dark to bright |
| Probe Connect Status Alarm | 0x0C | 2 | r |  |  | 0：disconnect<br>1：connect |
| Get The Relative Initial Surface Angle Value | 0x0D | 7 | r |  |  |  |
| Angle X Value | 0x0D | 3 | r |  | -90 - 90 |  |
| Angle X Value | 0x0D | 3 | r |  | -90 - 90 |  |
| Angle Z Value | 0x0D | 3 | r |  | -90 - 90 |  |
| Report package type | 0x0E | 2 | r |  |  | 0：Normal cycle package<br>1：Key cycle package |
| Reporting Interval | 0x60 | 1 | rw |  |  |  |
| Reporting Interval Unit | 0x60 | 2 | rw | 1 |  | 0：second<br>1：min |
| Reporting Interval | 0x60 | 3 | rw | 1800 |  |  |
| Reporting Interval | 0x60 | 3 | rw | 30 |  |  |
| Cumulative Numbers | 0x61 | 2 | rw | 8 | 1 - 20 |  |
| Collecting Interval | 0x62 | 1 | rw |  |  |  |
| Collecting Interval Unit | 0x62 | 2 | rw | 1 |  | 0：second<br>1：min |
| Collecting Interval | 0x62 | 3 | rw | 900 | 10 - 64800 |  |
| Collecting Interval | 0x62 | 3 | rw | 15 | 1 - 1440 |  |
| Alarm Max Count | 0x63 | 3 | rw | 1 | 1 - 1000 |  |
| Alarm Threshold Release | 0x75 | 2 | rw | 0 |  | 0: disable<br>1:enable |
| Temperature Unit | 0x65 | 2 | rw | 0 |  | 0：℃<br>1：℉ |
| AutoP Enable | 0xC4 | 2 | rw | 1 |  | 0：disable<br>1：enable |
| Base Station Positioning | 0x71 | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Base Station Positioning Authentication Token | 0x72 | 17 | rw |  |  |  |
| Airplane Mode Time Period | 0x73 | 1 | rw |  |  |  |
| Data Type | 0x73 | 2 | rw |  |  |  |
| Flight Mode Enable Mode | 0x73 | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Start Time | 0x73 | 7 | rw |  |  |  |
| Start Year | 0x73 | 2 | rw | 0 | 0 - 255 |  |
| Start Month | 0x73 | 2 | rw | 1 | 1 - 12 |  |
| Start  Day | 0x73 | 2 | rw | 1 | 1 - 31 |  |
| Start  Hour | 0x73 | 2 | rw | 0 | 0 - 23 |  |
| Start  Minute | 0x73 | 2 | rw | 0 | 0 - 59 |  |
| Start Second | 0x73 | 2 | rw | 0 | 0 - 59 |  |
| End Time | 0x73 | 7 | rw |  |  |  |
| End Year | 0x73 | 2 | rw | 0 | 0 - 255 |  |
| End Month | 0x73 | 2 | rw | 1 | 1 - 12 |  |
| End Day | 0x73 | 2 | rw | 1 | 1 - 31 |  |
| End Hour | 0x73 | 2 | rw | 0 | 0 - 23 |  |
| End Minute | 0x73 | 2 | rw | 0 | 0 - 59 |  |
| End Second | 0x73 | 2 | rw | 0 | 0 - 59 |  |
| Time Zone | 0xC7 | 3 | rw | 0 |  | -720：UTC-12(IDLW)<br>-660：UTC-11(SST)<br>-600：UTC-10(HST)<br>-570：UTC-9:30(MIT)<br>-540：UTC-9(AKST)<br>-480：UTC-8(PST)<br>-420：UTC-7(MST)<br>-360：UTC-6(CST)<br>-300：UTC-5(EST)<br>-240：UTC-4(AST)<br>-210：UTC-3:30(NST)<br>-180：UTC-3(BRT)<br>-120：UTC-2(FNT)<br>-60：UTC-1(CVT)<br>0：UTC(WET)<br>60：UTC+1(CET)<br>120：UTC+2(EET)<br>180：UTC+3(MSK)<br>210：UTC+3:30(IRST)<br>240：UTC+4(GST)<br>270：UTC+4:30(AFT)<br>300：UTC+5(PKT)<br>330：UTC+5:30(IST)<br>345：UTC+5:45(NPT)<br>360：UTC+6(BHT)<br>390：UTC+6:30(MMT)<br>420：UTC+7(ICT)<br>480：UTC+8(CT/CST)<br>540：UTC+9(JST)<br>570：UTC+9:30(ACST)<br>600：UTC+10(AEST)<br>630：UTC+10:30(LHST)<br>660：UTC+11(VUT)<br>720：UTC+12(NZST)<br>765：UTC+12:45(CHAST)<br>780：UTC+13(PHOT)<br>840：UTC+14(LINT) |
| Daylight Saving Time | 0xC6 | M | rw |  |  |  |
| Daylight Saving Time | 0xC6 | 2 | rw | 0 |  | 0：disable<br>1：enable |
| DST Bias | 0xC6 | 2 | rw | 60 | 1 - 120 |  |
|  Month | 0xC6 | 2 | rw | 1 |  | 1:Jan.<br>2:Feb.<br>3:Mar.<br>4:Apr.<br>5:May<br>6:Jun.<br>7:Jul.<br>8:Aug.<br>9:Sep.<br>10:Oct.<br>11:Nov.<br>12:Dec. |
|  Number of Week | 0xC6 | 2 | rw | 1 |  | 1:1st<br>2: 2nd<br>3: 3rd<br>4: 4th<br>5: last |
| Week | 0xC6 | 2 | rw | 1 |  | 1：Mon.<br>2：Tues.<br>3：Wed.<br>4：Thurs.<br>5：Fri.<br>6：Sat.<br>7：Sun. |
| Time | 0xC6 | 3 | rw | 0 |  | 0：00:00<br>60：01:00<br>120：02:00<br>180：03:00<br>240：04:00<br>300：05:00<br>360：06:00<br>420：07:00<br>480：08:00<br>540：09:00<br>600：10:00<br>660：11:00<br>720：12:00<br>780：13:00<br>840：14:00<br>900：15:00<br>960：16:00<br>1020：17:00<br>1080：18:00<br>1140：19:00<br>1200：20:00<br>1260：21:00<br>1320：22:00<br>1380：23:00 |
|  Month | 0xC6 | 2 | rw | 2 |  | 1:Jan.<br>2:Feb.<br>3:Mar.<br>4:Apr.<br>5:May<br>6:Jun.<br>7:Jul.<br>8:Aug.<br>9:Sep.<br>10:Oct.<br>11:Nov.<br>12:Dec. |
|  Number of Week | 0xC6 | 2 | rw | 1 |  | 1:1st<br>2: 2nd<br>3: 3rd<br>4: 4th<br>5: last |
| Week | 0xC6 | 2 | rw | 1 |  | 1：Mon.<br>2：Tues.<br>3：Wed.<br>4：Thurs.<br>5：Fri.<br>6：Sat.<br>7：Sun. |
| Time | 0xC6 | 3 | rw | 0 |  | 0：00:00<br>60：01:00<br>120：02:00<br>180：03:00<br>240：04:00<br>300：05:00<br>360：06:00<br>420：07:00<br>480：08:00<br>540：09:00<br>600：10:00<br>660：11:00<br>720：12:00<br>780：13:00<br>840：14:00<br>900：15:00<br>960：16:00<br>1020：17:00<br>1080：18:00<br>1140：19:00<br>1200：20:00<br>1260：21:00<br>1320：22:00<br>1380：23:00 |
| Data Storage Settings | 0xC5 | 1 | rw |  |  |  |
| Sub-command | 0xC5 | 2 | rw | 0 |  |  |
| Data Storage Enable | 0xC5 | 2 | rw | 1 |  | 0：disable<br>1：enable |
| Data Retransmission Enable | 0xC5 | 2 | rw | 1 |  | 0：disable<br>1：enable |
| Retransmission Interval | 0xC5 | 3 | rw | 600 | 30 - 1200 |  |
| Retrieval Interval | 0xC5 | 3 | rw | 60 | 30 - 1200 |  |
| Button
Lock | 0x76 | 3 | rw |  |  |  |
| Button
Lock Enable | 0x76 | 2 | rw | 1 |  | 0: disable<br>1:enable |
| Turn off | 0x76 | 2 | rw | 1 |  | 0:  disable lock power off<br>1:enable lock collect |
| Collect And Report | 0x76 | 2 | rw | 0 |  | 0: enablecollect<br>1:disable lock collect |
| reserve | 0x76 | 2 | rw | 0 |  | 0: enablecollect<br>1:disable lock collect |
| Temperature Threshold Alarm Config | 0x77 | M | rw |  |  |  |
| Temperature Threshold Alarm | 0x77 | 2 | rw | 0 |  | 0: disable<br>1:enable |
| Threshold Condition | 0x77 | 2 | rw | 0 |  | 0:disable<br>1:condition: x<A<br>2:condition: x>B<br>3:condition: A<x<B<br>4:condition: x<A or x>B |
| Value A | 0x77 | 5 | rw | 0 | -200 - 800 |  |
| Value B | 0x77 | 5 | rw | 0 | -200 - 800 |  |
| Temperature Shift Threshold | 0x78 | 6 | rw |  |  |  |
| Temperature Shift Threshold | 0x78 | 2 | rw | 0 |  | 0: disable<br>1:enable |
| Temperature change greater than | 0x78 | 5 | rw | 10 | 0.1 - 100 |  |
| Humidity Threshold Alarm | 0x79 | 7 | rw |  |  |  |
| Humidity Threshold Alarm | 0x79 | 2 | rw | 0 |  | 0: disable<br>1:enable |
| Threshold Condition | 0x79 | 2 | rw | 0 |  | 0:disable<br>1:condition: x<A<br>2:condition: x>B<br>3:condition: A<x<B<br>4:condition: x<A or x>B |
| Value A | 0x79 | 3 | rw | 0 | 0 - 100 |  |
| Value B | 0x79 | 3 | rw | 0 | 0 - 100 |  |
| Humidity Mutation Alarm Config | 0x7A | 4 | rw |  |  |  |
| Humidity Shift Threshold | 0x7A | 2 | rw | 0 |  | 0: disable<br>1:enable |
| Humidity change greater than | 0x7A | 3 | rw | 10 | 0.1 - 100 |  |
| Temperature Calibration | 0x7B | 6 | rw |  |  |  |
| Calibration Enable | 0x7B | 2 | rw | 0 |  | 0: disable<br>1:enable |
| Calibration Value | 0x7B | 5 | rw | 0 | -1000 - 1000 |  |
| Humidity Calibration | 0x7C | 4 | rw |  |  |  |
| Calibration Enable | 0x7C | 2 | rw | 0 |  | 0: disable<br>1:enable |
| Calibration Value | 0x7C | 3 | rw | 0 | -100 - 100 |  |
| Light Collecting Interval | 0x64 | 1 | rw |  |  |  |
| Light Collecting Interval Unit | 0x64 | 2 | rw | 1 |  | 0：second<br>1：min |
| Light  Collecting Interval | 0x64 | 3 | rw | 60 | 10 - 64800 |  |
| Light  Collecting Interval | 0x64 | 3 | rw | 1 | 1 - 1440 |  |
| Light  Threshold Alarm Config | 0x7D | 5 | rw |  |  |  |
|  Threshold Alarm Config Enable | 0x7D | 2 | rw | 1 |  | 0: disable<br>1:enable |
| Threshold Condition | 0x7D | 2 | rw | 0 |  | 0:disable<br>2:condition: x>B |
| Threshold Value | 0x7D | 3 | rw | 10 | 0 - 600 |  |
| Light Tolerance Value | 0x7E | 2 | rw | 5 | 0 - 100 |  |
| Tilt Threshold Alarm Config | 0x7F | 5 | rw |  |  |  |
|  Threshold Alarm Config Enable | 0x7F | 2 | rw | 0 |  | 0: disable<br>1:enable |
| Threshold Condition | 0x7F | 2 | rw | 0 |  | 0:disable<br>2:condition: x>B |
| Threshold Value | 0x7F | 2 | rw | 20 | 1 - 90 |  |
| Duration | 0x7F | 2 | rw | 10 | 1 - 60 |  |
| Falling Alarm Config | 0x80 | 2 | rw |  |  |  |
| Falling Alarm Enable | 0x80 | 2 | rw | 0 |  | 0: disable<br>1:enable |
| Falling Alarm Threshold Config | 0x81 | 3 | rw |  |  |  |
| Free Fall Level | 0x81 | 2 | rw | 7 |  | 0: FREE_FALL_LEVEL_156<br>1: FREE_FALL_LEVEL_219<br>2: FREE_FALL_LEVEL_250<br>3: FREE_FALL_LEVEL_312<br>4: FREE_FALL_LEVEL_344<br>5: FREE_FALL_LEVEL_406<br>6: FREE_FALL_LEVEL_469<br>7: FREE_FALL_LEVEL_500 |
| Continue Level | 0x81 | 2 | rw | 32 | 1 - 32 |  |
| Probe Id Retransmit Count | 0x82 | 2 | rw | 1 | 1 - 10 |  |
| Cellular Status | 0xBE | 1 | r |  |  |  |
| Cellular Status | 0xBE | 2 | r |  |  |  |
| Register Status | 0xBE | 2 | r |  |  | 0:Register Failed<br>1:Register Success |
| SIM State | 0xBE | 2 | r |  |  | 0:Card Status Reservation<br>1:SIM Card Recognition Successful<br>2:SIM Card Not Recognized<br>3:PIN Code Required<br>4:PIN Incorrect<br>5:Need PUK Code<br>6:SIM Card Not Inserted |
| IMEI | 0xBE | 16 | r |  |  |  |
| IMSI | 0xBE | 16 | r |  |  |  |
| ICCID | 0xBE | 21 | r |  |  |  |
| Signal Strength | 0xBE | 3 | r |  |  |  |
| Server Status | 0xBE | 2 | r |  |  | 0:Connect Failed<br>1:Connect Success |
| Milesight MQTT Status | 0xBE | 2 | r |  |  | 0:Connect Failed<br>1:Connect Success |
| Milesight DTLS Status | 0xBE | 2 | r |  |  | 0:Connect Failed<br>1:Connect Success |
| Cellular Settings | 0xCE | 1 | rw |  |  |  |
| Cellular Command | 0xCE | 2 | rw | 0 |  |  |
| Work Mode | 0xCE | 2 | rw | 0 |  | 0: Low Power Mode |
| Transport Type | 0xCE | 2 | rw | 7 |  | 1:UDP<br>2:TCP<br>3:AWS<br>4:MQTT<br>7:Developer-DTLS |
| Network Config | 0xCE | 1 | rw |  |  |  |
| Network Command | 0xCE | 2 | rw | 0 |  |  |
| APN | 0xCE | 32 | rw |  |  |  |
| Authentication Mode | 0xCE | 2 | rw | 0 |  | 0：None<br>1：PAP<br>3：CHAP |
| Username | 0xCE | 64 | rw |  |  |  |
| Password | 0xCE | 64 | rw |  |  |  |
| PIN | 0xCE | 9 | rw |  |  |  |
| Network Type | 0xCE | 2 | rw | 0 |  | 0：Auto<br>1：Cat-N<br>3：NB-IOT |
| MQTT Settings | 0xCE | 1 | rw |  |  |  |
| MQTT Command | 0xCE | 2 | rw | 0 |  |  |
| Broker Address | 0xCE | 128 | rw |  |  |  |
| Port | 0xCE | 3 | rw | 8883 | 1 - 65535 |  |
| Keepalive Interval | 0xCE | 3 | rw | 300 | 10 - 65535 |  |
| Client ID | 0xCE | 64 | rw | [sn] |  |  |
| User Credentials Enable | 0xCE | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Username | 0xCE | 128 | rw |  |  |  |
| Password | 0xCE | 128 | rw |  |  |  |
| TLS Enable | 0xCE | 2 | rw | 0 |  | 0：disable<br>1：enable |
| CA File Enable | 0xCE | 2 | rw | 0 |  | 0：disable<br>1：enable |
| CA File Length | 0xCE | 3 | rw | 0 |  |  |
| CA File | 0xCE | 161 | rw |  |  |  |
| Client Certificate Enable | 0xCE | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Client Certificate Length | 0xCE | 3 | rw | 0 |  |  |
| Client Certificate | 0xCE | 161 | rw |  |  |  |
| Client Key Enable | 0xCE | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Client Key Length | 0xCE | 3 | rw | 0 |  |  |
| Client Key | 0xCE | 161 | rw |  |  |  |
| Uplink Topic | 0xCE | 128 | rw | ts/[sn]/uplink |  |  |
| Uplink QoS | 0xCE | 2 | rw | 0 |  | 0：QoS0<br>1：QoS1<br>2：QoS2 |
| Downlink Topic | 0xCE | 128 | rw | ts/[sn]/downlink |  |  |
| Downlink QoS | 0xCE | 2 | rw | 0 |  | 0：QoS0<br>1：QoS1<br>2：QoS2 |
| MQTT Status | 0xCE | 2 | r |  |  | 0：Connect Failed<br>1：Connect Success |
| AWS Settings | 0xCE | 1 | rw |  |  |  |
| AWS Command | 0xCE | 2 | rw | 0 |  |  |
| Broker Address | 0xCE | 128 | rw |  |  |  |
| Port | 0xCE | 3 | rw | 8883 | 1 - 65535 |  |
| KeepAlive Interval | 0xCE | 3 | rw | 300 | 10 - 65535 |  |
| CA File Enable | 0xCE | 2 | rw | 0 |  | 0：disable<br>1：enable |
| CA File Length | 0xCE | 3 | rw | 0 |  |  |
| CA Certificate | 0xCE | 161 | rw |  |  |  |
| Client Certificate Enable | 0xCE | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Client Certificate Length | 0xCE | 3 | rw | 0 |  |  |
| Client Certificate | 0xCE | 161 | rw |  |  |  |
| Client Key Enable | 0xCE | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Client Key Length | 0xCE | 3 | rw | 0 |  |  |
| Client Key | 0xCE | 161 | rw |  |  |  |
| AWS Status | 0xCE | 2 | r |  |  | 0：Connect Failed<br>1：Connect Success |
| TCP Settings | 0xCE | 1 | rw |  |  |  |
| TCP Settings | 0xCE | 1 | rw |  |  |  |
| TCP ID | 0xCE | 2 | rw | 0 |  |  |
| TCP Command | 0xCE | 2 | rw |  |  |  |
| Enable | 0xCE | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Server Address | 0xCE | 128 | rw |  |  |  |
| Port | 0xCE | 3 | rw | 1000 | 1 - 65535 |  |
| Retry Times | 0xCE | 2 | rw | 1 | 0 - 3 |  |
| Retry Interval | 0xCE | 2 | rw | 5 | 1 - 60 |  |
| KeepAlive Interval | 0xCE | 3 | rw | 300 | 10 - 65535 |  |
| TCP Status | 0xCE | 2 | r |  |  | 0：Connect Failed<br>1：Connect Success |
| UDP Settings | 0xCE | 1 | rw |  |  |  |
| UDP Settings | 0xCE | 1 | rw |  |  |  |
| UDP ID | 0xCE | 2 | rw | 0 |  |  |
| UDP Command | 0xCE | 2 | rw | 0 |  |  |
| Enable | 0xCE | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Server Address | 0xCE | 128 | rw |  |  |  |
| Port | 0xCE | 3 | rw | 1000 | 1 - 65535 |  |
| UDP Status | 0xCE | 2 | r |  |  | 0：Connect Failed<br>1：Connect Success |
| Milesight MQTT Settings | 0xCE | 1 | r |  |  |  |
| Milesight MQTT Command | 0xCE | 2 | r | 33 |  |  |
| Milesight MQTT Status | 0xCE | 2 | r |  |  | 0：Connect Failed<br>1：Connect Success |
| Milesight DTLS Settings | 0xCE | 1 | r |  |  |  |
| Milesight DTLS Command | 0xCE | 2 | r | 0 |  |  |
| Milesight DTLS Status | 0xCE | 2 | r |  |  | 0：Connect Failed<br>1：Connect Success |

### Event

| CHANNEL |  ID  | LENGTH | READ/WRITE | DEFAULT | RANGE | ENUM |
| :------ | :--: | :----: | :--------: | :-----: | :---: | :--: |
| Order Check Response | 0xFE | 2 | r |  |  |  |
| Command Response | 0xEF | 1 | r |  |  |  |
| Request to Push All Configurations | 0xEE | 1 | r |  |  |  |
| Historical Data | 0xED | 6 | r |  |  |  |
| Battery Alarm | 0x11 | 1 | r |  |  |  |
| Temperature  Alarm | 0x08 | 1 | r |  |  |  |
| Humidity  Alarm | 0x09 | 1 | r |  |  |  |
| Tilt  Alarm | 0x0A | 1 | r |  |  |  |
| Light  Alarm | 0x0B | 1 | r |  |  |  |

### Service

| CHANNEL |  ID  | LENGTH | READ/WRITE | DEFAULT | RANGE | ENUM |
| :------ | :--: | :----: | :--------: | :-----: | :---: | :--: |
| Order Check | 0xFE | 2 | w |  |  |  |
| Order | 0xFE | 2 | w | 0 | 0 - 255 |  |
| Order | 0xFE | 2 | r | 0 | 0 - 255 |  |
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
| Alarm Type | 0x11 | 2 | r |  |  |  |
| Low Battery Alarm | 0x11 | 2 | r |  |  |  |
| Current Battery Left | 0x11 | 2 | r |  |  |  |
| Alarm Type | 0x08 | 2 | r |  |  |  |
| Collection Error | 0x08 | 1 | r |  |  |  |
| Out of The Low Range | 0x08 | 1 | r |  |  |  |
| Out of The High Range | 0x08 | 1 | r |  |  |  |
| No Data | 0x08 | 1 | r |  |  |  |
| Temperature Below Alarm Released | 0x08 | 5 | r |  |  |  |
| Temperature | 0x08 | 5 | r |  | -200 - 800 |  |
| Temperature Below Alarm | 0x08 | 5 | r |  |  |  |
| Temperature | 0x08 | 5 | r |  | -200 - 800 |  |
| Temperature Above Alarm Released | 0x08 | 5 | r |  |  |  |
| Temperature | 0x08 | 5 | r |  | -200 - 800 |  |
| Temperature Above Alarm | 0x08 | 5 | r |  |  |  |
| Temperature | 0x08 | 5 | r |  | -200 - 800 |  |
| Temperature Between Alarm Released | 0x08 | 5 | r |  |  |  |
| Temperature | 0x08 | 5 | r |  | -200 - 800 |  |
| Temperature Between Alarm | 0x08 | 5 | r |  |  |  |
| Temperature | 0x08 | 5 | r |  | -200 - 800 |  |
| Temperature Exceed Tolerance Alarm Released | 0x08 | 5 | r |  |  |  |
| Temperature | 0x08 | 5 | r |  | -200 - 800 |  |
| Temperature Exceed Tolerance Alarm | 0x08 | 5 | r |  |  |  |
| Temperature | 0x08 | 5 | r |  | -200 - 800 |  |
| Temperature Shift Threshold | 0x08 | 5 | r |  |  |  |
| Temperature | 0x08 | 5 | r |  | -200 - 800 |  |
| Temperature Shift Threshold | 0x08 | 9 | r |  |  |  |
| Temperature | 0x08 | 5 | r |  | -200 - 800 |  |
|  Shift Temperature | 0x08 | 5 | r |  | -200 - 800 |  |
| Alarm Type | 0x09 | 2 | r |  |  |  |
| Collection Error | 0x09 | 1 | r |  |  |  |
| Out of The Low Range | 0x09 | 1 | r |  |  |  |
| Out of The High Range | 0x09 | 1 | r |  |  |  |
| No Data | 0x09 | 1 | r |  |  |  |
| Humidity Below Alarm Released | 0x09 | 3 | r |  |  |  |
| Humidity | 0x09 | 3 | r |  | 0 - 100 |  |
| Humidity Below Alarm | 0x09 | 3 | r |  |  |  |
| Humidity | 0x09 | 3 | r |  | 0 - 100 |  |
| Humidity Above Alarm Released | 0x09 | 3 | r |  |  |  |
| Humidity | 0x09 | 3 | r |  | 0 - 100 |  |
| Humidity Above Alarm | 0x09 | 3 | r |  |  |  |
| Humidity | 0x09 | 3 | r |  | 0 - 100 |  |
| Humidity Between Alarm Released | 0x09 | 3 | r |  |  |  |
| Humidity | 0x09 | 3 | r |  | 0 - 100 |  |
| Humidity Between Alarm | 0x09 | 3 | r |  |  |  |
| Humidity | 0x09 | 3 | r |  | 0 - 100 |  |
| Humidity Exceed Tolerance Alarm Released | 0x09 | 3 | r |  |  |  |
| Humidity | 0x09 | 3 | r |  | 0 - 100 |  |
| Humidity Exceed Tolerance Alarm | 0x09 | 3 | r |  |  |  |
| Humidity | 0x09 | 3 | r |  | 0 - 100 |  |
| Humidity Shift Threshold | 0x09 | 3 | r |  |  |  |
| Humidity | 0x09 | 3 | r |  | 0 - 100 |  |
| Humidity Shift Threshold | 0x09 | 5 | r |  |  |  |
| Humidity | 0x09 | 3 | r |  | 0 - 100 |  |
|  Shift Humidity | 0x09 | 3 | r |  | 0 - 100 |  |
| Alarm Type | 0x0A | 2 | r |  |  |  |
| Collection Error | 0x0A | 1 | r |  |  |  |
| Exceed the Range Lower Limit | 0x0A | 1 | r |  |  |  |
| Exceed the Range Upper Limit | 0x0A | 1 | r |  |  |  |
| No Data | 0x0A | 1 | r |  |  |  |
| Tilt  Alam Release | 0x0A | 2 | r |  |  |  |
| Tilt Alam | 0x0A | 2 | r |  |  |  |
| Falling  Alam | 0x0A | 2 | r |  |  |  |
| Alarm Type | 0x0B | 2 | r |  |  |  |
| Collection Error | 0x0B | 1 | r |  |  |  |
| Out of The Low Range | 0x0B | 1 | r |  |  |  |
| Out of The High Range | 0x0B | 1 | r |  |  |  |
| No Data | 0x0B | 1 | r |  |  |  |
| Bright to dark | 0x0B | 2 | r |  |  |  |
| Dark to bright | 0x0B | 2 | r |  |  |  |
| AT Debug | 0xEB | 1 | rw |  |  |  |
| length | 0xEB | 3 | rw | 1 | 1 - 65535 |  |
| content | 0xEB | 1 | rw |  |  |  |
| Reset | 0xBF | 1 | w |  |  |  |
| Reboot | 0xBE | 1 | w |  |  |  |
| Clear Data | 0xBD | 1 | w |  |  |  |
| Stop Retrieval | 0xBC | 1 | w |  |  |  |
| Retrieval(Time Period) | 0xBA | 5 | w |  |  |  |
| Time Point | 0xBA | 5 | w |  |  |  |
| Retrieval(Time Period) | 0xBB | 9 | w |  |  |  |
| Start Time | 0xBB | 5 | w |  |  |  |
| End Time | 0xBB | 5 | w |  |  |  |
| Query Device Status | 0xB9 | 1 | w |  |  |  |
| Time Synchronize | 0xB8 | 1 | w |  |  |  |
| Time Synchronize | 0xB7 | 5 | w |  |  |  |
| Timestamp | 0xB7 | 5 | w |  |  |  |
| Clear Alarm Item | 0x50 | 1 | w |  |  |  |
| Zero Calibration | 0x51 | 2 | w |  |  |  |
| Zero Calibration | 0x51 | 2 | w | 1 |  | 0:Clear zero calibration<br>1:Start zero calibration |
| Set Relative Initial Surface | 0x52 | 2 | w |  |  |  |
| Set Relative Initial Surface | 0x52 | 2 | w |  |  | 0:Reset the zero reference point to the horizontal plane<br>1:Set the current plane as the new zero reference point |
| Get Sensor ID | 0x53 | 1 | w |  |  |  |
| Temperature And Humidity Display Switch on Device Screen | 0x55 | 2 | w |  |  |  |
| Temperature And Humidity Display Switch on Device Screen | 0x55 | 2 | w |  |  | 0： temperature<br>1: humidity |

