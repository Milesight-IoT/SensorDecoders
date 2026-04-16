# WT401 Sensor

![WT401](wt401.png)

For more detailed information, please visit [Milesight Official Website](https://www.milesight.com/iot/product/lorawan-sensor/wt401)

## Payload Definition

### Attribute

| CHANNEL |  ID  | LENGTH | READ/WRITE | DEFAULT | RANGE | ENUM |
| :------ | :--: | :----: | :--------: | :-----: | :---: | :--: |
| LoRaWAN  Settings | 0xCF | 1 | rw |  |  |  |
| LoRaWAN Comand | 0xCF | 2 | rw |  |  |  |
| LoRaWAN Work Mode | 0xCF | 2 | rw | 0 |  | 0:ClassA<br>1:ClassB<br>2:ClassC<br>3:ClassC to B |
| TSL Version | 0xDF | 3 | r |  |  |  |
| Product Name | 0xDE | 33 | rw |  |  |  |
| PN | 0xDD | 33 | rw |  |  |  |
| SN | 0xDB | 9 | r |  |  |  |
| Product Version | 0xDA | 9 | r |  |  |  |
| Hardware Version | 0xDA | 3 | r |  |  |  |
| Firmware Version | 0xDA | 7 | r |  |  |  |
| OEM ID | 0xD9 | 3 | rw |  |  |  |
| Product Region | 0xD8 | 17 | r |  |  |  |
| BLE Phone Name | 0xD5 | 1 | rw |  |  |  |
| Length | 0xD5 | 2 | rw | 6 | 1 - 64 |  |
| Name | 0xD5 | 1 | rw | 123456 |  |  |
| Battery | 0x00 | 2 | r |  | 0 - 100 |  |
| Temperature | 0x01 | 3 | r |  | -20 - 60 |  |
| Humidity | 0x02 | 3 | r |  | 0 - 100 |  |
| Occupied Status | 0x08 | 2 | r | 0 | 0 - 2 | 0：Vacant<br>1：Occupied<br>2：Night Occupied |
| Temperature Control Mode | 0x03 | 2 | r | 0 |  | 0：heat<br>1：em heat<br>2：cool<br>3：auto<br>4：dehumidify<br>5：ventilation<br>10：off<br>11：none |
| Target Temperature1 | 0x06 | 3 | r |  | 5 - 35 |  |
| Target Temperature2 | 0x07 | 3 | r |  | 5 - 35 |  |
| Fan Mode | 0x04 | 2 | r | 0 |  | 0：auto<br>1：circulate<br>2：on<br>3：low<br>4：medium<br>5：high<br>10：off<br>11：none/keep |
| Schedule | 0x05 | 2 | r | 0 | 0 - 16 | 0:plan0<br>1:plan1<br>2:plan2<br>3:plan3<br>4:plan4<br>5:plan5<br>6:plan6<br>7:plan7<br>8:plan8<br>9:plan9<br>10:plan10<br>11:plan11<br>12:plan12<br>13:plan13<br>14:plan14<br>15:plan15<br>255:Not executed |
| Collecting Interval | 0x60 | 1 | rw |  |  |  |
| Collecting Interval Unit | 0x60 | 2 | rw | 0 |  | 0：second<br>1：min |
|  Collecting Interval | 0x60 | 3 | rw | 30 | 1 - 3600 |  |
| Collecting Interval | 0x60 | 3 | rw | 1 | 1 - 1440 |  |
| Communication Mode | 0x8D | 2 | rw | 1 | 0 - 3 | 0：BLE<br>1：LoRa<br>2：BLE+LoRa<br>3：PowerBus+LoRa |
| Reporting Interval | 0x61 | 1 | rw |  |  |  |
| Reporting Interval Type | 0x61 | 2 | rw | 0 |  | 0：BLE<br>1：LORA<br>2：BLE+LORA<br>3：POWERBUS+lora |
| BLE Reporting Interval | 0x61 | 1 | rw |  |  |  |
| Reporting Interval Unit | 0x61 | 2 | rw | 1 |  | 0：second<br>1：min |
| Reporting Interval | 0x61 | 3 | rw | 600 | 10 - 64800 |  |
| Reporting Interval | 0x61 | 3 | rw | 10 | 1 - 1440 |  |
| LORA Reporting Interval | 0x61 | 1 | rw |  |  |  |
| Reporting Interval Unit | 0x61 | 2 | rw | 1 |  | 0：second<br>1：min |
| Reporting Interval | 0x61 | 3 | rw | 600 | 10 - 64800 |  |
| Reporting Interval | 0x61 | 3 | rw | 10 | 1 - 1440 |  |
| BLE_LORA Reporting Interval | 0x61 | 1 | rw |  |  |  |
| Reporting Interval Unit | 0x61 | 2 | rw | 1 |  | 0：second<br>1：min |
| Reporting Interval | 0x61 | 3 | rw | 600 | 10 - 64800 |  |
| Reporting Interval | 0x61 | 3 | rw | 10 | 1 - 1440 |  |
| POWERBUS_LORA Reporting Interval | 0x61 | 1 | rw |  |  |  |
| Reporting Interval Unit | 0x61 | 2 | rw | 1 |  | 0：second<br>1：min |
| Reporting Interval | 0x61 | 3 | rw | 600 | 10 - 64800 |  |
| Reporting Interval | 0x61 | 3 | rw | 10 | 1 - 1440 |  |
| Communicate Interval | 0x6C | 1 | rw |  |  |  |
| Communicate Interval ID | 0x6C | 2 | rw | 0 |  | 0:BLE<br>1:LORA<br>2:BLE+LORA<br>3:POWERBUS+LORA |
| BLE Communicate Interval | 0x6C | 1 | rw |  |  |  |
| BLE Communicate Interval Unit | 0x6C | 2 | rw | 1 |  | 0：second<br>1：min |
| BLE Communicate Interval | 0x6C | 3 | rw | 600 | 10 - 1800 |  |
| BLE Communicate Interval | 0x6C | 3 | rw | 1 | 1 - 30 |  |
| LORA Communicate Interval | 0x6C | 1 | rw |  |  |  |
| LORA Communicate Interval Unit | 0x6C | 2 | rw | 1 |  | 0：second<br>1：min |
| LORA Communicate Interval | 0x6C | 3 | rw | 600 | 10 - 1800 |  |
| LORA Communicate Interval | 0x6C | 3 | rw | 1 | 1 - 30 |  |
| BLE_LORA Communicate Interval | 0x6C | 1 | rw |  |  |  |
| BLE_LORA Communicate Interval Unit | 0x6C | 2 | rw | 1 |  | 0：second<br>1：min |
| BLE_LORA Communicate Interval | 0x6C | 3 | rw | 600 | 10 - 1800 |  |
| BLE_LORA Communicate Interval | 0x6C | 3 | rw | 1 | 1 - 30 |  |
| POWERBUS_LORA Communicate Interval | 0x6C | 1 | rw |  |  |  |
| POWERBUS_LORA Communicate Interval Unit | 0x6C | 2 | rw | 1 |  | 0：second<br>1：min |
| POWERBUS_LORA Communicate Interval | 0x6C | 3 | rw | 600 | 10 - 1800 |  |
| POWERBUS_LORA Communicate Interval | 0x6C | 3 | rw | 1 | 1 - 30 |  |
| Device Status | 0xC8 | 2 | rw | 0 |  | 0：Power Off<br>1：Power On |
| Temperature Unit | 0x63 | 2 | rw | 0 |  | 0：℃<br>1：℉ |
| Temperature &amp; Humidity Data Source | 0x7D | 2 | rw | 0 |  | 0:Embedded Data<br>1:External Receive |
| Data Timeout | 0x7E | 2 | rw | 10 | 1 - 60 |  |
| Bluetooth Enable | 0x85 | 2 | rw | 1 |  | 0:disable<br>1:enable |
| Bluetooth Name | 0x8B | 33 | rw |  |  |  |
| System On/Off | 0x67 | 2 | rw | 0 |  | 0：Off<br>1：On |
| Temperature Control Mode Enable | 0x64 | 2 | rw |  |  |  |
| Heat | 0x64 | 2 | rw | 1 |  | 0：disable<br>1：enable |
| EM Heat | 0x64 | 2 | rw | 1 |  | 0：disable<br>1：enable |
| Cool | 0x64 | 2 | rw | 1 |  | 0：disable<br>1：enable |
| Auto | 0x64 | 2 | rw | 1 |  | 0：disable<br>1：enable |
| Reserved | 0x64 | 2 | rw |  |  |  |
| Fan Mode Enabled | 0x88 | 2 | rw |  |  |  |
| Auto | 0x88 | 2 | rw | 1 |  | 0：disable<br>1：enable |
| Circul | 0x88 | 2 | rw | 1 |  | 0：disable<br>1：enable |
| On | 0x88 | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Low | 0x88 | 2 | rw | 1 |  | 0：disable<br>1：enable |
| Medium | 0x88 | 2 | rw | 1 |  | 0：disable<br>1：enable |
| High | 0x88 | 2 | rw | 1 |  | 0：disable<br>1：enable |
| Reserved | 0x88 | 2 | rw | 0 |  |  |
| Temperature Control Mode | 0x68 | 1 | rw |  |  |  |
| Subcmd ID | 0x68 | 2 | rw | 0 |  |  |
| Temperature Control Mode | 0x68 | 2 | rw | 0 | 0 - 5 | 0：heat<br>1：em heat<br>2：cool<br>3：auto<br>4：dehumidify<br>5：ventilation |
| Plan Temperature Control Mode Enable | 0x68 | 2 | rw | 1 |  | 0：disable<br>1：enable |
| Target Temperature Mode | 0x65 | 2 | rw | 0 |  | 0：single<br>1：dual |
| Target Temperature Resolution | 0x66 | 2 | rw | 0 |  | 0：0.5<br>1：1 |
| Target Temperature Settings | 0x69 | 1 | rw |  |  |  |
| Temperature Control Mode | 0x69 | 2 | rw | 0 |  |  |
| Heat Target Temperature | 0x69 | 3 | rw | 17 | 5 - 35 |  |
| EM Heat Target Temperature | 0x69 | 3 | rw | 25 | 5 - 35 |  |
| Cool Target Temperature | 0x69 | 3 | rw | 28 | 5 - 35 |  |
| Auto Target Temperature | 0x69 | 3 | rw | 23 | 5 - 35 |  |
| Auto-Heat Target Temperature | 0x69 | 3 | rw | 17 | 5 - 35 |  |
| Auto-Cool Target Temperature | 0x69 | 3 | rw | 28 | 5 - 35 |  |
| DeadBand | 0x6A | 3 | rw | 5 | 1 - 30 |  |
| Target Temperature Range | 0x6B | 1 | rw |  |  |  |
| Target Temperature Range ID | 0x6B | 2 | rw | 0 |  | 0：heat<br>1：em heat<br>2：cool<br>3：auto |
| Heat Target Temperature Range | 0x6B | 1 | rw |  |  |  |
| Min Value | 0x6B | 3 | rw | 10 | 5 - 35 |  |
| Max Value | 0x6B | 3 | rw | 19 | 5 - 35 |  |
| EM Heat Target Temperature Range | 0x6B | 1 | rw |  |  |  |
| Min Value | 0x6B | 3 | rw | 10 | 5 - 35 |  |
| Max Value | 0x6B | 3 | rw | 27 | 5 - 35 |  |
| Cool Target Temperature Range | 0x6B | 1 | rw |  |  |  |
| Min Value | 0x6B | 3 | rw | 23 | 5 - 35 |  |
| Max Value | 0x6B | 3 | rw | 35 | 5 - 35 |  |
| Auto Target Temperature Range | 0x6B | 1 | rw |  |  |  |
| Min Value | 0x6B | 3 | rw | 10 | 5 - 35 |  |
| Max Value | 0x6B | 3 | rw | 35 | 5 - 35 |  |
| Fan Mode | 0x74 | 2 | rw | 0 | 0 - 5 | 0：auto<br>1：circulate<br>2：on<br>3：low<br>4：medium<br>5：high |
| Occupancy Detection | 0x82 | 1 | rw |  |  |  |
| Common Cmd | 0x82 | 2 | rw | 0 |  |  |
| Occupancy Detection | 0x82 | 2 | rw | 1 | 0 - 1 | 0:disable<br>1:enable |
| Occupied to Vacant Delay | 0x82 | 3 | rw | 30 | 1 - 360 |  |
| Detection Mode | 0x82 | 2 | rw |  |  | 0:Immediate Trigger<br>1:Rule Trigger |
| Trigger Condition | 0x82 | 1 | rw |  |  |  |
| Duration | 0x82 | 2 | rw | 5 | 1 - 60 |  |
| Trigger Ratio | 0x82 | 2 | rw | 50 | 1 - 100 |  |
| Energy-saving Setting | 0x83 | 1 | rw |  |  |  |
| Energy Cmd | 0x83 | 2 | rw | 0 |  |  |
| Energy-Saving Enable | 0x83 | 2 | rw | 1 | 0 - 1 | 0:disable<br>1:enable |
| Energy Saving Plan | 0x83 | 1 | rw |  |  |  |
| Occupied Execution | 0x83 | 2 | rw | 0 | 0 - 255 | 0:plan0<br>1:plan1<br>2:plan2<br>3:plan3<br>4:plan4<br>5:plan5<br>6:plan6<br>7:plan7<br>255:Not executed |
| Vacant Execution | 0x83 | 2 | rw | 1 | 0 - 255 | 0:plan0<br>1:plan1<br>2:plan2<br>3:plan3<br>4:plan4<br>5:plan5<br>6:plan6<br>7:plan7<br>255:Not executed |
| Night Occupancy Settings | 0x84 | 1 | rw |  |  |  |
| Night Cmd | 0x84 | 2 | rw | 1 |  |  |
| Night Occupancy Settings | 0x84 | 2 | rw | 0 | 0 - 1 | 0:disable<br>1:enable |
| Nighttime | 0x84 | 1 | rw |  |  |  |
| Start Time | 0x84 | 3 | rw | 1260 | 0 - 1439 |  |
| Stop Time | 0x84 | 3 | rw | 480 | 0 - 1439 |  |
| Night Occupied Execution | 0x84 | 2 | rw | 2 | 0 - 255 | 0:plan0<br>1:plan1<br>2:plan2<br>3:plan3<br>4:plan4<br>5:plan5<br>6:plan6<br>7:plan7<br>255:Not executed |
| Detection Mode | 0x84 | 2 | rw | 0 |  | 0:Immediate Trigger<br>1:Rule Trigger |
| Trigger Condition | 0x84 | 1 | rw |  |  |  |
| Duration | 0x84 | 2 | rw | 5 | 1 - 60 |  |
| Trigger Ratio | 0x84 | 2 | rw | 50 | 1 - 100 |  |
| Screen Display Settings | 0x75 | 2 | rw |  |  |  |
| Schedule Name | 0x75 | 2 | rw | 1 |  | 0:disable<br>1:enable |
| Ambient Temperature | 0x75 | 2 | rw | 1 |  | 0:disable<br>1:enable |
| Ambient Humidity | 0x75 | 2 | rw | 1 |  | 0:disable<br>1:enable |
| Target Temperature | 0x75 | 2 | rw | 1 |  | 0:disable<br>1:enable |
| Reserved | 0x75 | 2 | rw | 0 |  |  |
| Button Custom Function | 0x71 | 1 | rw |  |  |  |
| Subcmd ID | 0x71 | 2 | rw | 0 |  |  |
| Enable | 0x71 | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Button1 Custom Function | 0x71 | 2 | rw | 1 |  | 1：Temperature Control Mode<br>2：Fan Mode<br>3：Schedule Switch<br>4：Status Report<br>5：Filter Cleaning Reset<br>6：Button Event1<br>7：Temperature Unit Switch |
| Button2 Custom Function | 0x71 | 2 | rw | 2 |  | 1：Temperature Control Mode<br>2：Fan Mode<br>3：Schedule Switch<br>4：Status Report<br>5：Filter Cleaning Reset<br>6：Button Event2<br>7：Temperature Unit Switch |
| Button3 Custom Function | 0x71 | 2 | rw | 0 |  | 0：System On/Off<br>3：Schedule Switch<br>4：Status Report<br>5：Filter Cleaning Reset<br>6：Button Event3<br>7：Temperature Unit Switch |
| Child Lock | 0x72 | 4 | rw |  |  |  |
| Enable | 0x72 | 2 | rw | 0 |  | 0:disable<br>1:enable |
| Temperature + | 0x72 | 3 | rw | 0 |  | 0:disable<br>1:enable |
| Temperature - | 0x72 | 3 | rw | 0 |  | 0:disable<br>1:enable |
| System On/Off | 0x72 | 3 | rw | 0 |  | 0:disable<br>1:enable |
| Fan Mode | 0x72 | 3 | rw | 0 |  | 0:disable<br>1:enable |
| Temperature Control Mode | 0x72 | 3 | rw | 0 |  | 0:disable<br>1:enable |
| Reboot&amp;Reset | 0x72 | 3 | rw | 0 |  | 0:disable<br>1:enable |
| Power On/Off | 0x72 | 3 | rw | 0 |  | 0:disable<br>1:enable |
| Cancel Pairing | 0x72 | 3 | rw | 0 |  | 0:disable<br>1:enable |
| Schedule Switch | 0x72 | 3 | rw | 0 |  | 0:disable<br>1:enable |
| Status Report  | 0x72 | 3 | rw | 0 |  | 0:disable<br>1:enable |
| Filter Clean Alarm Release | 0x72 | 3 | rw | 0 |  | 0:disable<br>1:enable |
| Button Event 1  | 0x72 | 3 | rw | 0 |  | 0:disable<br>1:enable |
| Button Event 2  | 0x72 | 3 | rw | 0 |  | 0:disable<br>1:enable |
| Button Event 3  | 0x72 | 3 | rw | 0 |  | 0:disable<br>1:enable |
| Temperature Unit Switch | 0x72 | 3 | rw | 0 |  | 0:disable<br>1:enable |
| Reserved | 0x72 | 3 | rw | 0 |  |  |
| Temporary Unlock | 0x81 | 1 | rw |  |  |  |
| Temporary Unlock Enable | 0x81 | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Temporary Unlock Time | 0x81 | 3 | rw | 30 | 1 - 3600 |  |
| Temporary Unlock Button Combination | 0x80 | 2 | rw |  |  |  |
| Button 1 | 0x80 | 2 | rw | 1 |  | 0：disable<br>1：enable |
| Button 2 | 0x80 | 2 | rw | 1 |  | 0：disable<br>1：enable |
| Button 3 | 0x80 | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Button 4 | 0x80 | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Button 5 | 0x80 | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Reserved | 0x80 | 2 | rw | 0 |  |  |
| Smart Display | 0x62 | 2 | rw | 1 |  | 0：disable<br>1：enable |
| Time Zone | 0xC7 | 3 | rw | 0 | -720 - 840 | -720：UTC-12(IDLW)<br>-660：UTC-11(SST)<br>-600：UTC-10(HST)<br>-570：UTC-9:30(MIT)<br>-540：UTC-9(AKST)<br>-480：UTC-8(PST)<br>-420：UTC-7(MST)<br>-360：UTC-6(CST)<br>-300：UTC-5(EST)<br>-240：UTC-4(AST)<br>-210：UTC-3:30(NST)<br>-180：UTC-3(BRT)<br>-120：UTC-2(FNT)<br>-60：UTC-1(CVT)<br>0：UTC(WET)<br>60：UTC+1(CET)<br>120：UTC+2(EET)<br>180：UTC+3(MSK)<br>210：UTC+3:30(IRST)<br>240：UTC+4(GST)<br>270：UTC+4:30(AFT)<br>300：UTC+5(PKT)<br>330：UTC+5:30(IST)<br>345：UTC+5:45(NPT)<br>360：UTC+6(BHT)<br>390：UTC+6:30(MMT)<br>420：UTC+7(ICT)<br>480：UTC+8(CT/CST)<br>540：UTC+9(JST)<br>570：UTC+9:30(ACST)<br>600：UTC+10(AEST)<br>630：UTC+10:30(LHST)<br>660：UTC+11(VUT)<br>720：UTC+12(NZST)<br>765：UTC+12:45(CHAST)<br>780：UTC+13(PHOT)<br>840：UTC+14(LINT) |
| Daylight Saving Time | 0xC6 | M | rw |  |  |  |
| Daylight Saving Time | 0xC6 | 2 | rw | 0 |  | 0：disable<br>1：enable |
| DST Bias | 0xC6 | 2 | rw | 60 | 1 - 120 |  |
|  Month | 0xC6 | 2 | rw | 1 | 1 - 12 | 1:Jan.<br>2:Feb.<br>3:Mar.<br>4:Apr.<br>5:May<br>6:Jun.<br>7:Jul.<br>8:Aug.<br>9:Sep.<br>10:Oct.<br>11:Nov.<br>12:Dec. |
|  Number of Week | 0xC6 | 2 | rw | 1 | 1 - 2 | 1:1st<br>2: 2nd<br>3: 3rd<br>4: 4th<br>5: last |
| Week | 0xC6 | 2 | rw | 1 | 1 - 7 | 1：Mon.<br>2：Tues.<br>3：Wed.<br>4：Thurs.<br>5：Fri.<br>6：Sat.<br>7：Sun. |
| Time | 0xC6 | 3 | rw | 0 | 0 - 1380 | 0：00:00<br>60：01:00<br>120：02:00<br>180：03:00<br>240：04:00<br>300：05:00<br>360：06:00<br>420：07:00<br>480：08:00<br>540：09:00<br>600：10:00<br>660：11:00<br>720：12:00<br>780：13:00<br>840：14:00<br>900：15:00<br>960：16:00<br>1020：17:00<br>1080：18:00<br>1140：19:00<br>1200：20:00<br>1260：21:00<br>1320：22:00<br>1380：23:00 |
|  Month | 0xC6 | 2 | rw | 1 | 1 - 12 | 1:Jan.<br>2:Feb.<br>3:Mar.<br>4:Apr.<br>5:May<br>6:Jun.<br>7:Jul.<br>8:Aug.<br>9:Sep.<br>10:Oct.<br>11:Nov.<br>12:Dec. |
|  Number of Week | 0xC6 | 2 | rw | 1 | 1 - 5 | 1:1st<br>2: 2nd<br>3: 3rd<br>4: 4th<br>5: last |
| Week | 0xC6 | 2 | rw | 1 | 1 - 7 | 1：Mon.<br>2：Tues.<br>3：Wed.<br>4：Thurs.<br>5：Fri.<br>6：Sat.<br>7：Sun. |
| Time | 0xC6 | 3 | rw | 0 | 0 - 1380 | 0：00:00<br>60：01:00<br>120：02:00<br>180：03:00<br>240：04:00<br>300：05:00<br>360：06:00<br>420：07:00<br>480：08:00<br>540：09:00<br>600：10:00<br>660：11:00<br>720：12:00<br>780：13:00<br>840：14:00<br>900：15:00<br>960：16:00<br>1020：17:00<br>1080：18:00<br>1140：19:00<br>1200：20:00<br>1260：21:00<br>1320：22:00<br>1380：23:00 |
| Temperature Calibration Settings | 0x76 | 4 | rw |  |  |  |
| Temperature Calibration | 0x76 | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Calibration Value | 0x76 | 3 | rw | 0 | -80 - 80 |  |
| Humidity Calibration Settings | 0x77 | 4 | rw |  |  |  |
| Humidity Calibration | 0x77 | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Calibration Value | 0x77 | 3 | rw | 0 | -100 - 100 |  |
| Schedule Settings | 0x7B | 1 | rw |  |  |  |
| Schedule Settings | 0x7B | 1 | rw |  |  |  |
| Schedule ID | 0x7B | 2 | rw | 0 | 0 - 15 |  |
| Sub-command | 0x7B | 2 | rw | 0 |  |  |
| Enable | 0x7B | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Name | 0x7B | 7 | rw |  |  |  |
| Name | 0x7B | 5 | rw |  |  |  |
| Schedule Content | 0x7B | 8 | rw |  |  |  |
| Temperature Control Mode | 0x7B | 2 | rw | 0 | 0 - 255 | 0：heat<br>1：em heat<br>2：cool<br>3：auto<br>10：off |
| Heating Target Temperature | 0x7B | 3 | rw | 19 | 5 - 35 |  |
| EM Heat Target Temperature | 0x7B | 3 | rw | 25 | 5 - 35 |  |
| Cool Target Temperature | 0x7B | 3 | rw | 28 | 5 - 35 |  |
| Schedule Content | 0x7B | 8 | rw |  |  |  |
| Fan Mode | 0x7B | 2 | rw | 0 | 0 - 255 | 0：auto<br>1：circulate<br>2：on<br>3：low<br>4：medium<br>5：high<br>10：off |
| Auto Target Temperature | 0x7B | 3 | rw | 23 | 5 - 35 |  |
| Auto-Cool Target Temperature | 0x7B | 3 | rw | 17 | 5 - 35 |  |
| Auto-Heat Target Temperature | 0x7B | 3 | rw | 28 | 5 - 35 |  |
| System Status Control | 0x59 | 7 | w |  |  |  |

### Event

| CHANNEL |  ID  | LENGTH | READ/WRITE | DEFAULT | RANGE | ENUM |
| :------ | :--: | :----: | :--------: | :-----: | :---: | :--: |
| Sequence Number Check Response | 0xFF | 2 | r |  |  |  |
| Order Check Response | 0xFE | 2 | r |  |  |  |
| Command Response | 0xEF | 1 | r |  |  |  |
| Request to Push All Configurations | 0xEE | 1 | r |  |  |  |
| Temperature  Alarm | 0x0B | 1 | r |  |  |  |
| Humidity Alarm | 0x0C | 1 | r |  |  |  |
| Bluetooth Event | 0x09 | 1 | r |  |  |  |
| Powerbus Event | 0x0A | 1 | r |  |  |  |
| Button Report | 0x0D | 1 | r |  |  |  |
| Battery Event | 0x0F | 1 | r |  |  |  |

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
| Alarm Type | 0x0B | 2 | r |  |  |  |
| Alarm Type | 0x0C | 2 | r |  |  |  |
| Bluetooth Event Type | 0x09 | 2 | r |  |  |  |
| Powerbus Event Type | 0x0A | 2 | r |  |  |  |
| Event Type | 0x0D | 2 | r |  |  |  |
| Button 1 Report | 0x0D | 1 | r |  |  |  |
| Button 2 Report | 0x0D | 1 | r |  |  |  |
| Button 3 Report | 0x0D | 1 | r |  |  |  |
| Battery Event Type | 0x0F | 2 | r |  |  |  |
| System On/Off | 0x59 | 2 | w | 1 |  | 0：system close<br>1：system open |
| Temperature Control Mode | 0x59 | 2 | w | 0 | 0 - 5 | 0：heat<br>1：em heat<br>2：cool<br>3：auto<br>4：dehumidify<br>5：ventilation |
| Heat Temperature | 0x59 | 3 | w | 17 | 5 - 35 |  |
| Cool Temperature | 0x59 | 3 | w | 28 |  |  |
| External Temperature | 0x86 | 3 | rw |  | -20 - 60 |  |
| External Humidity | 0x87 | 3 | rw |  | 0 - 100 |  |
| Insert Temporary Plan | 0x5C | 2 | w |  |  |  |
| Plan ID | 0x5C | 2 | w | 0 | 0 - 15 |  |
| Fan Error Alarm | 0x55 | 2 | w |  |  |  |
| Action | 0x55 | 2 | w | 0 |  | 0：clean alarm<br>1：trigger alarm |
| Filter Cleaning Alarm | 0x5B | 2 | w |  |  |  |
| Action | 0x5B | 2 | w | 0 |  | 0：clean alarm<br>1：report alarm |
| Frost Protection Alarm | 0x57 | 2 | w |  |  |  |
| Action | 0x57 | 2 | w | 0 |  | 0：clean alarm<br>1：trigger alarm |
| Open Window Alarm | 0x5A | 2 | w |  |  |  |
| Action | 0x5A | 2 | w | 0 |  | 0：clean alarm<br>1：report alarm |
| Not Wired Alarm | 0x58 | 2 | w |  |  |  |
| Action | 0x58 | 2 | w | 0 |  | 0：clean alarm<br>1：trigger alarm |
| Reboot | 0xBE | 1 | w |  |  |  |
| Query Device Status | 0xB9 | 1 | w |  |  |  |
| Time Synchronize | 0xB8 | 1 | w |  |  |  |
| Network Reconnection | 0xB6 | 1 | w |  |  |  |
| Delete Schedule | 0x5F | 2 | w |  |  |  |
| Delete Schedule | 0x5F | 2 | w | 255 | 0 - 255 | 0：Schedule1<br>1：Schedule2<br>2：Schedule3<br>3：Schedule4<br>4：Schedule5<br>5：Schedule6<br>6：Schedule7<br>7：Schedule8<br>255：Reset All |

