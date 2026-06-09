# UC711 Sensor

![UC711](uc711.png)

For more detailed information, please visit [Milesight Official Website](https://www.milesight.com/iot/product/lorawan-sensor/uc711)

## Payload Definition

### Attribute

| CHANNEL |  ID  | LENGTH | READ/WRITE | DEFAULT | RANGE | ENUM |
| :------ | :--: | :----: | :--------: | :-----: | :---: | :--: |
| LoRaWAN  Settings | 0xCF | 1 | rw |  |  |  |
| LoRaWAN Command | 0xCF | 2 | rw |  |  |  |
| LoRaWAN Work Mode | 0xCF | 2 | rw | 0 |  | 0:ClassA<br>1:ClassB<br>2:ClassC<br>3:ClassC to B |
| TSL Version | 0xDF | 3 | r |  |  |  |
| SN | 0xDB | 9 | r |  |  |  |
| Product Version | 0xDA | 9 | r |  |  |  |
| Hardware Version | 0xDA | 3 | r |  |  |  |
| Firmware Version | 0xDA | 7 | r |  |  |  |
| OEM ID | 0xD9 | 3 | rw |  |  |  |
| Device Status | 0xC8 | 2 | rw | 1 |  | 0：Off<br>1：On |
| BLE Settings | 0xCD | 1 | rw |  |  |  |
| BLE Command | 0xCD | 2 | rw | 0 |  |  |
| Bluetooth Enable | 0xCD | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Device Bluetooth Name (prefix8) | 0xCD | 9 | rw |  |  |  |
| Device Bluetooth Name (suffix5) | 0xCD | 6 | rw |  |  |  |
| Device Bluetooth Information | 0xCD | 1 | rw |  |  |  |
| Address Type | 0xCD | 2 | rw | 0 |  | 0：public<br>1：private |
| Mac Address | 0xCD | 7 | rw | 24e124123456 |  |  |
| DevEUI | 0xCD | 9 | rw | 24e124123456789a |  |  |
| Name Length | 0xCD | 2 | rw | 13 | 1 - 13 |  |
| Bluetooth Name | 0xCD | 1 | rw |  |  |  |
| Paired Device Name | 0xCD | 1 | rw |  |  |  |
| Paired Device Name | 0xCD | 1 | rw |  |  |  |
| ID | 0xCD | 2 | rw | 0 | 0 - 0 |  |
| Name Length | 0xCD | 2 | rw | 13 | 1 - 13 |  |
| Bluetooth Name | 0xCD | 1 | rw |  |  |  |
| Paired Device | 0xCD | 1 | rw |  |  |  |
| Paired Device | 0xCD | 10 | rw |  |  |  |
| ID | 0xCD | 2 | rw | 0 | 0 - 0 |  |
| DevEUI | 0xCD | 9 | rw | 24e124123456789a |  |  |
| Paired Device Bluetooth Mac Address | 0xCD | 1 | rw |  |  |  |
| Paired Device Bluetooth Mac Address | 0xCD | 9 | rw |  |  |  |
| ID | 0xCD | 2 | rw | 0 | 0 - 0 |  |
| Address Type | 0xCD | 2 | rw | 0 |  | 0：public<br>1：private |
| Bluetooth Mac Address | 0xCD | 7 | rw | 24e124123456 |  |  |
| Paired Device Bluetooth Information | 0xCD | 1 | rw |  |  |  |
| Address Type | 0xCD | 2 | rw | 0 |  | 0：public<br>1：private |
| Mac Address | 0xCD | 7 | rw | 24e124123456 |  |  |
| DevEUI | 0xCD | 9 | rw | 24e124123456789a |  |  |
| Name Length | 0xCD | 2 | rw | 13 | 1 - 13 |  |
| Bluetooth Name | 0xCD | 1 | rw |  |  |  |
| Bluetooth Status | 0xBA | 11 | r |  |  |  |
| Bluetooth Status | 0xBA | M | r |  |  |  |
| ID | 0xBA | 2 | r | 0 |  |  |
| Bluetooth Status | 0xBA | 2 | r | 0 |  | 0: Not paired<br>1: Paired<br>2: Disconnected |
| Paired Device DevEUI | 0xBA | 9 | r | 24e124123456789a |  |  |
| Temp. &amp; Humidity Data Source | 0x05 | 2 | r | 0 |  | 0: NTC Sensor<br>1: Lora Data<br>2:  D2D Data<br>3: WT401 |
| Temperature | 0x06 | 3 | r |  | -20 - 60 |  |
| Humidity | 0x08 | 3 | r |  | 0 - 100 |  |
| Temperature Control Mode and Status | 0x0C | 2 | r |  |  |  |
| Temperature Control Mode | 0x0C | 2 | r | 0 |  | 0：heat<br>2：cool<br>3：auto |
| Temperature Control Status | 0x0C | 2 | r | 0 |  | 0：standby<br>1：stage-1 heat<br>2：stage-2 heat<br>3：stage-3 heat<br>4：stage-4 heat<br>5：stage-5 heat<br>7：stage-1 cool<br>8：stage-2 cool<br>9：stage-3 cool |
| Fan Mode and Status | 0x0D | 2 | r |  |  |  |
| Fan Mode | 0x0D | 2 | r | 0 |  | 0：auto<br>1：circulate<br>2：on<br>3：low<br>4：medium<br>5：high |
| Fan Status | 0x0D | 2 | r | 0 |  | 0：off<br>1：open<br>2：low<br>3:medium<br>4:high |
| Schedule Status | 0x0E | 2 | r | 0 | 0 - 255 |  |
| System Status | 0x0F | 2 | r |  |  |  |
| System On/Off | 0x0F | 2 | r | 0 |  | 0：system Off<br>1：system on |
| Occupancy status | 0x0F | 2 | r | 0 |  | 0：Vacant<br>1：occupied<br>2：night occupied |
| Reserved | 0x0F | 2 | r |  |  |  |
| Target Temperature | 0x10 | 3 | r |  | 5 - 35 |  |
| Cool Target Temperature | 0x12 | 3 | r |  | 5 - 35 |  |
| Relay Status | 0x01 | 2 | r |  |  |  |
| Y1 | 0x01 | 2 | r | 0 |  | 0：opened<br>1：closed |
| W1 | 0x01 | 2 | r | 0 |  | 0：opened<br>1：closed |
| O/B | 0x01 | 2 | r | 0 |  | 0：opened<br>1：closed |
| GL | 0x01 | 2 | r | 0 |  | 0：opened<br>1：closed |
| GM | 0x01 | 2 | r | 0 |  | 0：opened<br>1：closed |
| GH | 0x01 | 2 | r | 0 |  | 0：opened<br>1：closed |
| Reserved | 0x01 | 2 | r |  |  |  |
| Communication Mode | 0x91 | 2 | rw | 0 |  | 0：BLE+Lorawan<br>1：POWERBUS+Lorawan |
| Reporting Interval | 0x66 | 1 | rw |  |  |  |
| Reporting Interval Type | 0x66 | 2 | rw | 0 |  | 0：BLE+LORA<br>1：POWERBUS+LORA |
| BLE_LORA Reporting Interval | 0x66 | 1 | rw |  |  |  |
| Reporting Interval Unit | 0x66 | 2 | rw | 1 |  | 0：second<br>1：min |
| Reporting Interval | 0x66 | 3 | rw | 600 | 60 - 64800 |  |
| Reporting Interval | 0x66 | 3 | rw | 10 | 1 - 1440 |  |
| POWERBUS_LORA Reporting Interval | 0x66 | 1 | rw |  |  |  |
| Reporting Interval Unit | 0x66 | 2 | rw | 1 |  | 0：second<br>1：min |
| Reporting Interval | 0x66 | 3 | rw | 600 | 60 - 64800 |  |
| Reporting Interval | 0x66 | 3 | rw | 10 | 1 - 1440 |  |
| Temperature Unit | 0x64 | 2 | rw | 0 |  | 0：℃<br>1：℉ |
| Relay Change Report Enable | 0x80 | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Temperature Data Source Settings | 0x6A | 1 | rw |  |  |  |
| Sub-command | 0x6A | 2 | rw | 0 |  |  |
| Data Source | 0x6A | 2 | rw | 3 |  | 0: NTC<br>1: Lora Data<br>2: D2D Data<br>3: WT401 |
| Time Out | 0x6A | 2 | rw | 10 |  |  |
| Device Offline Settings | 0x6A | 2 | rw | 0 |  | 0:  keep relays status<br>1: turn off all relays<br>2: thermostat control |
| System Switch | 0x6F | 2 | rw | 0 |  | 0：Switch Off<br>1：Switch On |
| Temperature Control Mode | 0x60 | 1 | rw |  |  |  |
| Sub-command | 0x60 | 2 | rw | 0 |  | 0：Mode<br>1：Plan Temperature Control<br>Mode Enable |
| Temperature Control Mode | 0x60 | 2 | rw | 0 |  | 0：heat<br>2：cool<br>3：auto |
| Plan Temperature Control
Mode Enable | 0x60 | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Target Temperature Mode | 0x76 | 2 | rw | 1 |  | 0：single<br>1：double |
| Target Temperature Resolution | 0x65 | 2 | rw | 0 |  | 0：0.5<br>1：1 |
| Target Temperature Settings | 0x61 | 1 | rw |  |  |  |
| Temperature Control Mode | 0x61 | 2 | rw | 0 |  |  |
| Heat Target Temperature | 0x61 | 3 | rw | 17 | 5 - 35 |  |
| Cool Target Temperature | 0x61 | 3 | rw | 28 | 5 - 35 |  |
| Auto Target Temperature | 0x61 | 3 | rw | 23 | 5 - 35 |  |
| Unilateral Tolerance Enable | 0x77 | 2 | rw | 0 |  | 0：Disable<br>1：Enable |
| Target Temperature Tolerance | 0x62 | 1 | rw |  |  |  |
| Target Temperature Tolerance | 0x62 | 2 | rw | 0 |  |  |
| Heat Target Temperature Tolerance | 0x62 | 3 | rw | 1 | 0.1 - 5 |  |
| Cool Target Temperature Tolerance | 0x62 | 3 | rw | 1 | 0.1 - 5 |  |
| Auto Target Temperature Tolerance | 0x62 | 3 | rw | 1 | 0.1 - 5 |  |
| Temperature Control Tolerance | 0x62 | 3 | rw | 1 | 0.1 - 5 |  |
| Target Temperature Range | 0x63 | 1 | rw |  |  |  |
| Target Temperature Range ID | 0x63 | 2 | rw | 0 |  |  |
| Heat Target Temperature Range | 0x63 | 1 | rw |  |  |  |
| Min Value | 0x63 | 3 | rw | 10 | 5 - 35 |  |
| Max Value | 0x63 | 3 | rw | 19 | 5 - 35 |  |
| Cool Target Temperature Range | 0x63 | 1 | rw |  |  |  |
| Min Value | 0x63 | 3 | rw | 23 | 5 - 35 |  |
| Max Value | 0x63 | 3 | rw | 35 | 5 - 35 |  |
| Auto Target Temperature Range | 0x63 | 1 | rw |  |  |  |
| Min Value | 0x63 | 3 | rw | 10 | 5 - 35 |  |
| Max Value | 0x63 | 3 | rw | 35 | 5 - 35 |  |
| Target Humidity Range | 0x72 | 1 | rw |  |  |  |
| Sub-command | 0x72 | 2 | rw | 2 |  |  |
| Min Value | 0x72 | 3 | rw | 40 | 0 - 100 |  |
| Max Value | 0x72 | 3 | rw | 80 | 0 - 100 |  |
| Temperature Control Level Switch Enable | 0x83 | 1 | rw |  |  |  |
| Subcmd ID | 0x83 | 2 | rw | 0 |  |  |
| Setforward Enable | 0x83 | 2 | rw | 1 |  | 0：disable<br>1：enable |
| Setback Enable | 0x83 | 2 | rw | 1 |  | 0：disable<br>1：enable |
| Heat Timeout | 0x83 | 2 | rw | 5 | 1 - 30 |  |
| Heat Change Value | 0x83 | 3 | rw | 1 | 0.5 - 5 |  |
| Cool Timeout | 0x83 | 2 | rw | 5 | 1 - 30 |  |
| Cool Change Value | 0x83 | 3 | rw | 1 | 0.5 - 5 |  |
| ΔT1 | 0x83 | 3 | rw | 3 | 0 - 10 |  |
| ΔT2 | 0x83 | 3 | rw | 5 | 0 - 10 |  |
| Fan Settings | 0x70 | 1 | rw |  |  |  |
| Sub-command | 0x70 | 2 | rw | 0 |  |  |
| Fan Mode | 0x70 | 2 | rw | 0 |  | 0：Auto<br>1：Ventilation<br>2：Always Open<br>3：Low<br>4：Medium<br>5：High |
| Fan Circulate Time | 0x70 | 2 | rw | 30 | 5 - 55 |  |
| Regulate Humidity Enable | 0x70 | 2 | rw | 0 |  | 0：Disable<br>1：Enable |
| Regulation Interval | 0x70 | 2 | rw | 30 | 5 - 55 |  |
| Fan Delay Off Settings | 0x82 | 1 | rw |  |  |  |
| Sub-command | 0x82 | 2 | rw | 0 |  |  |
| Fan Delay Off Enable | 0x82 | 2 | rw | 1 |  | 0：Disable<br>1：Enable |
| Fan Delay Off Time | 0x82 | 3 | rw | 60 | 30 - 3600 |  |
| Energy-saving Enable | 0x84 | 2 | rw | 0 |  | 0：Disable<br>1：Enable |
| Energy-saving Settings | 0x85 | 1 | rw |  |  |  |
| Energy-saving Level | 0x85 | 2 | rw | 0 |  |  |
| Level 1 Energy-saving Settings | 0x85 | 1 | rw |  |  |  |
| Sub-command | 0x85 | 2 | rw | 0 |  |  |
| Level 1 Energy-saving Enable | 0x85 | 2 | rw | 0 |  | 0：Disable<br>1：Enable |
| Vacant Time | 0x85 | 3 | rw | 480 | 1 - 1440 |  |
| Energy Saving Target Temperature Tolerance | 0x85 | 3 | rw | 2 | 0.1 - 5 |  |
| Level 2 Energy-saving Settings | 0x85 | 1 | rw |  |  |  |
| Sub-command | 0x85 | 2 | rw | 0 |  |  |
| Level 2 Energy-saving Enable | 0x85 | 2 | rw | 0 |  | 0：Disable<br>1：Enable |
| Vacant Time | 0x85 | 3 | rw | 720 | 1 - 1440 |  |
| Energy Saving Target Temperature Tolerance | 0x85 | 3 | rw | 4 | 0.1 - 5 |  |
| Filter Clean Reminder Setting | 0x8B | 1 | rw |  |  |  |
| Sub-command | 0x8B | 2 | rw | 0 |  |  |
| Filter Clean Reminder Enable | 0x8B | 2 | rw | 0 |  | 0：Disable<br>1：Enable |
| Reminder Period | 0x8B | 3 | rw | 90 | 1 - 730 |  |
| Time Zone | 0xC7 | 3 | rw | 0 |  | -720：UTC-12(IDLW)<br>-660：UTC-11(SST)<br>-600：UTC-10(HST)<br>-570：UTC-9:30(MIT)<br>-540：UTC-9(AKST)<br>-480：UTC-8(PST)<br>-420：UTC-7(MST)<br>-360：UTC-6(CST)<br>-300：UTC-5(EST)<br>-240：UTC-4(AST)<br>-210：UTC-3:30(NST)<br>-180：UTC-3(BRT)<br>-120：UTC-2(FNT)<br>-60：UTC-1(CVT)<br>0：UTC(WET)<br>60：UTC+1(CET)<br>120：UTC+2(EET)<br>180：UTC+3(MSK)<br>210：UTC+3:30(IRST)<br>240：UTC+4(GST)<br>270：UTC+4:30(AFT)<br>300：UTC+5(PKT)<br>330：UTC+5:30(IST)<br>345：UTC+5:45(NPT)<br>360：UTC+6(BHT)<br>390：UTC+6:30(MMT)<br>420：UTC+7(ICT)<br>480：UTC+8(CT/CST)<br>540：UTC+9(JST)<br>570：UTC+9:30(ACST)<br>600：UTC+10(AEST)<br>630：UTC+10:30(LHST)<br>660：UTC+11(VUT)<br>720：UTC+12(NZST)<br>765：UTC+12:45(CHAST)<br>780：UTC+13(PHOT)<br>840：UTC+14(LINT) |
| Daylight Saving Time | 0xC6 | M | rw |  |  |  |
| Enable | 0xC6 | 2 | rw | 0 |  | 0：Disable<br>1：Enable |
| DST Bias | 0xC6 | 2 | rw | 60 | 1 - 120 |  |
| Month | 0xC6 | 2 | rw | 1 |  | 1:Jan.<br>2:Feb.<br>3:Mar.<br>4:Apr.<br>5:May<br>6:Jun.<br>7:Jul.<br>8:Aug.<br>9:Sep.<br>10:Oct.<br>11:Nov.<br>12:Dec. |
| Number of Week | 0xC6 | 2 | rw | 1 |  | 1:1st<br>2: 2nd<br>3: 3rd<br>4: 4th<br>5: last |
| Week | 0xC6 | 2 | rw | 7 |  | 1：Mon.<br>2：Tues.<br>3：Wed.<br>4：Thurs.<br>5：Fri.<br>6：Sat.<br>7：Sun. |
| Time | 0xC6 | 3 | rw | 0 |  | 0：00:00<br>60：01:00<br>120：02:00<br>180：03:00<br>240：04:00<br>300：05:00<br>360：06:00<br>420：07:00<br>480：08:00<br>540：09:00<br>600：10:00<br>660：11:00<br>720：12:00<br>780：13:00<br>840：14:00<br>900：15:00<br>960：16:00<br>1020：17:00<br>1080：18:00<br>1140：19:00<br>1200：20:00<br>1260：21:00<br>1320：22:00<br>1380：23:00 |
| Month | 0xC6 | 2 | rw | 1 |  | 1:Jan.<br>2:Feb.<br>3:Mar.<br>4:Apr.<br>5:May<br>6:Jun.<br>7:Jul.<br>8:Aug.<br>9:Sep.<br>10:Oct.<br>11:Nov.<br>12:Dec. |
| Number of Week | 0xC6 | 2 | rw | 1 |  | 1:1st<br>2: 2nd<br>3: 3rd<br>4: 4th<br>5: last |
| Week | 0xC6 | 2 | rw | 7 |  | 1：Mon.<br>2：Tues.<br>3：Wed.<br>4：Thurs.<br>5：Fri.<br>6：Sat.<br>7：Sun. |
| Time | 0xC6 | 3 | rw | 0 |  | 0：00:00<br>60：01:00<br>120：02:00<br>180：03:00<br>240：04:00<br>300：05:00<br>360：06:00<br>420：07:00<br>480：08:00<br>540：09:00<br>600：10:00<br>660：11:00<br>720：12:00<br>780：13:00<br>840：14:00<br>900：15:00<br>960：16:00<br>1020：17:00<br>1080：18:00<br>1140：19:00<br>1200：20:00<br>1260：21:00<br>1320：22:00<br>1380：23:00 |
| Data Storage Settings | 0xC5 | 1 | rw |  |  |  |
| Sub-command | 0xC5 | 2 | rw | 0 |  |  |
| Data Storage Enable | 0xC5 | 2 | rw | 0 |  | 0：Disable<br>1：Enable |
| Data Retransmission Enable | 0xC5 | 2 | rw | 0 |  | 0：Disable<br>1：Enable |
| Data Retransmission Interval | 0xC5 | 3 | rw | 600 | 30 - 1200 |  |
| Data Retrieval Interval | 0xC5 | 3 | rw | 60 | 30 - 1200 |  |
| NTC Sensor | 0x89 | 1 | rw |  |  |  |
| Sub-command | 0x89 | 2 | rw | 2 |  |  |
| Collecting Interval | 0x89 | 3 | rw | 30 | 1 - 3600 |  |
| Temperature Calibration Enable | 0x89 | 2 | rw | 0 |  | 0：Disable<br>1：Enable |
| Temperature Calibration Value | 0x89 | 3 | rw | 0 | -80 - 80 |  |
| Temperature Threshold Alarm | 0x6E | 1 | rw |  |  |  |
| Sub-command | 0x6E | 2 | rw | 0 |  |  |
| Enable | 0x6E | 2 | rw | 0 |  | 0：Disable<br>1：Enable |
| Alarm Mode | 0x6E | 2 | rw | 0 |  | 0:Disable<br>1:Condition: x<A<br>2:Condition: x>B<br>3:Condition: A≤x≤B<br>4:Condition: x<A or x>B |
| Low Threshold | 0x6E | 3 | rw | -20 | -20 - 60 |  |
| High Threshold | 0x6E | 3 | rw | 60 | -20 - 60 |  |
| Persistent Low Temperature Alarm Settings | 0x6D | 1 | rw |  |  |  |
| Sub-command | 0x6D | 2 | rw | 0 |  |  |
| Persistent Low Temperature | 0x6D | 2 | rw | 0 |  | 0：Disable<br>1：Enable |
| Difference in Temperature | 0x6D | 3 | rw | 3 | 1 - 10 |  |
| Duration | 0x6D | 2 | rw | 5 | 0 - 60 |  |
| Persistent High Temperature Alarm Settings | 0x6C | 1 | rw |  |  |  |
| Sub-command | 0x6C | 2 | rw | 0 |  |  |
| Persistent High Temperature | 0x6C | 2 | rw | 0 |  | 0：Disable<br>1：Enable |
| Difference in Temperature | 0x6C | 3 | rw | 3 | 1 - 10 |  |
| Duration | 0x6C | 2 | rw | 5 | 0 - 60 |  |
| Installation Settings | 0x8E | 5 | rw |  |  |  |
| Subcmd ID | 0x8E | 2 | rw | 0 |  | 0：wire config<br>1:reversing_valve config<br>2:combine config<br>3:fan owner config |
| Wire Settings | 0x8E | 1 | rw |  |  |  |
| Y1 | 0x8E | 2 | rw | 1 |  | 0：disable<br>1：enable |
| GH | 0x8E | 2 | rw | 1 |  | 0：disable<br>1：enable |
| OB | 0x8E | 2 | rw | 1 |  | 0：disable<br>1：enable |
| W1 | 0x8E | 2 | rw | 1 |  | 0：disable<br>1：enable |
| E | 0x8E | 2 | rw | 0 |  | 0：disable<br>1：enable |
| DI | 0x8E | 2 | rw | 0 |  | 0：disable<br>1：enable |
| PEK | 0x8E | 2 | rw | 0 |  | 0：disable<br>1：enable |
| W2/AUX | 0x8E | 2 | rw | 0 |  | 0：disable<br>1：w2 enable<br>2：aux enable |
| GL | 0x8E | 2 | rw | 0 |  | 0：disable<br>1：enable |
| GM | 0x8E | 2 | rw | 1 |  | 0：disable<br>1：enable |
| NTC | 0x8E | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Reserved | 0x8E | 2 | rw | 0 |  |  |
| Reversing Valve | 0x8E | 1 | rw |  |  |  |
| Reversing Valve | 0x8E | 2 | rw | 1 |  | 0：Energize on Heat<br>1：Energize on Cool |
| Fan Owner | 0x8E | 1 | rw |  |  |  |
| Fan Owner | 0x8E | 2 | rw | 0 |  | 0：thermostat<br>1：hvac |
| Compressor and Auxiliary Heat Linkage | 0x8E | 1 | rw |  |  |  |
| Compressor and Auxiliary Heat Linkage | 0x8E | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Freeze Protection | 0x71 | 1 | rw |  |  |  |
| Sub-command | 0x71 | 2 | rw | 0 |  |  |
| Freeze Protection Enable | 0x71 | 2 | rw | 0 |  | 0：Disable<br>1：Enable |
| Protection Temperature | 0x71 | 3 | rw | 3 | 1 - 5 |  |
| System Protection | 0x74 | 1 | rw |  |  |  |
| Sub-command | 0x74 | 2 | rw | 0 |  |  |
| System Protection | 0x74 | 2 | rw | 0 |  | 0：Disable<br>1：Enable |
| Protection Time | 0x74 | 2 | rw | 5 | 1 - 60 |  |
| Open Window Detection | 0x68 | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Open Window Detection Settings | 0x69 | 1 | rw |  |  |  |
| Open Window Detection Method | 0x69 | 2 | rw | 0 |  | 0：Temperature Change<br>1：Magnetic Contact Switch |
| Temperature Detection | 0x69 | 5 | rw |  |  |  |
| Temperature Change | 0x69 | 3 | rw | 3 | 1 - 10 |  |
| Stop Temperature Control For | 0x69 | 3 | rw | 30 | 1 - 1440 |  |
| Magnetic Contact Switch Detection | 0x69 | 2 | rw |  |  |  |
| Detection Duration | 0x69 | 2 | rw | 10 | 1 - 60 |  |
| DI Enable | 0x86 | 2 | rw | 0 |  | 0：Disable<br>1：Enable |
| DI Settings | 0x87 | 1 | rw |  |  |  |
| DI Control Object | 0x87 | 2 | rw | 0 |  | 0：Room Card<br>1：Magnetic Contact Switch |
| Room Card | 0x87 | 1 | rw |  |  |  |
| Room Card Control Type | 0x87 | 2 | rw | 0 |  | 0：System Control<br>1：Insert Schedule |
| System Control | 0x87 | 2 | rw |  |  |  |
| Insert Card | 0x87 | 2 | rw | 1 |  | 0：system off<br>1：system on |
| Insert Schedule | 0x87 | 3 | rw |  |  |  |
| Insert Card | 0x87 | 2 | rw | 0 |  | 0：Schedule1<br>1：Schedule2<br>2：Schedule3<br>3：Schedule4<br>4：Schedule5<br>5：Schedule6<br>6：Schedule7<br>7：Schedule8<br>8：Schedule9<br>9：Schedule10<br>10：Schedule11<br>11：Schedule12<br>12：Schedule13<br>13：Schedule14<br>14：Schedule15<br>15：Schedule16 |
| Unplug | 0x87 | 2 | rw | 1 |  | 0：Schedule1<br>1：Schedule2<br>2：Schedule3<br>3：Schedule4<br>4：Schedule5<br>5：Schedule6<br>6：Schedule7<br>7：Schedule8<br>8：Schedule9<br>9：Schedule10<br>10：Schedule11<br>11：Schedule12<br>12：Schedule13<br>13：Schedule14<br>14：Schedule15<br>15：Schedule16 |
| Magnetic Contact Switch | 0x87 | 2 | rw |  |  |  |
| Magnetic Contact Switch Type | 0x87 | 2 | rw | 1 |  | 0：NC<br>1：NO |
| D2D Pairing Enable | 0x95 | 2 | rw | 0 |  | 0：disable<br>1：enable |
| D2D Data Receiving Settings | 0x96 | 1 | rw |  |  |  |
| D2D Data Receiving Settings | 0x96 | 1 | rw |  |  |  |
| ID | 0x96 | 2 | rw | 0 | 0 - 4 |  |
| Type | 0x96 | 2 | rw | 0 |  |  |
| Enable | 0x96 | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Paired Device EUI | 0x96 | 9 | rw |  |  |  |
| Device Name (prefix8) | 0x96 | 9 | rw |  |  |  |
| Device Name (suffix8) | 0x96 | 9 | rw |  |  |  |
| D2D Controller Enable | 0x97 | 2 | rw | 0 |  | 0：disable<br>1：enable |
| D2D Master Control | 0x98 | 1 | rw |  |  |  |
| D2D Master Control | 0x98 | 9 | rw |  |  |  |
| Trigger Mode | 0x98 | 2 | rw | 0 |  | 0: Schedule1<br>1: Schedule2<br>2: Schedule3<br>3: Schedule4<br>4: Schedule5<br>5: Schedule6<br>6: Schedule7<br>7: Schedule8<br>8：Schedule9<br>9：Schedule10<br>10：Schedule11<br>11：Schedule12<br>12：Schedule13<br>13：Schedule14<br>14：Schedule15<br>15：Schedule16<br>16：System Off<br>17：System On |
| Enable | 0x98 | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Control Command | 0x98 | 3 | rw | 0000 |  |  |
| LoRa Uplink | 0x98 | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Enable Control Time | 0x98 | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Control Time | 0x98 | 3 | rw | 5 | 1 - 1440 |  |
| D2D Agent Enable | 0x99 | 2 | rw | 0 |  | 0：disable<br>1：enable |
| D2D Controlled | 0x9A | 1 | rw |  |  |  |
| D2D Controlled | 0x9A | 1 | rw |  |  |  |
| D2D Controlled ID | 0x9A | 2 | rw | 0 | 0 - 15 |  |
| Enable | 0x9A | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Control Command | 0x9A | 3 | rw | 0000 |  |  |
| Action Status | 0x9A | 2 | rw | 16 |  | 0: Schedule1<br>1: Schedule2<br>2: Schedule3<br>3: Schedule4<br>4: Schedule5<br>5: Schedule6<br>6: Schedule7<br>7: Schedule8<br>8：Schedule9<br>9：Schedule10<br>10：Schedule11<br>11：Schedule12<br>12：Schedule13<br>13：Schedule14<br>14：Schedule15<br>15：Schedule16<br>16：System Off<br>17：System On |

### Event

| CHANNEL |  ID  | LENGTH | READ/WRITE | DEFAULT | RANGE | ENUM |
| :------ | :--: | :----: | :--------: | :-----: | :---: | :--: |
| Order Check Response | 0xFE | 2 | r |  |  |  |
| Request to Push All Configurations | 0xEE | 1 | r |  |  |  |
| Temperature  Alarm | 0x02 | 1 | r |  |  |  |
| Temperature  Abnormal | 0x03 | 1 | r |  |  |  |
| Filter Clean Remind | 0x04 | 5 | r |  |  |  |
| Humidity Abnormal | 0x07 | 1 | r |  |  |  |
| Data Passthrough | 0x30 | 1 | r |  |  |  |

### Service

| CHANNEL |  ID  | LENGTH | READ/WRITE | DEFAULT | RANGE | ENUM |
| :------ | :--: | :----: | :--------: | :-----: | :---: | :--: |
| Order Check | 0xFE | 2 | w |  |  |  |
| Order | 0xFE | 2 | w | 0 | 0 - 255 |  |
| Order | 0xFE | 2 | r | 0 | 0 - 255 |  |
| Command Queries | 0xEF | 1 | w |  |  |  |
| Request to Query All Configurations | 0xEE | 1 | w |  |  |  |
| Retrieval(Point-in-Time) | 0xBA | 5 | w |  |  |  |
| Time Point | 0xBA | 5 | w |  |  |  |
| BLE Server | 0xB4 | 1 | w |  |  |  |
| BLE Server | 0xB4 | 2 | w | 0 |  | 0：Reset BLE Name<br>1：Cancel Pairing<br>2：Trigger Pairing |
| Alarm Type | 0x02 | 2 | r |  |  |  |
| Open Window Alarm Released | 0x02 | 3 | r |  |  |  |
| Temperature | 0x02 | 3 | r |  | -20 - 60 |  |
| Open Window Alarm | 0x02 | 3 | r |  |  |  |
| Temperature | 0x02 | 3 | r |  | -20 - 60 |  |
| Freeze Protection Alarm Released | 0x02 | 3 | r |  |  |  |
| Temperature | 0x02 | 3 | r |  | -20 - 60 |  |
| Freeze Protection Alarm | 0x02 | 3 | r |  |  |  |
| Temperature | 0x02 | 3 | r |  | -20 - 60 |  |
| Temperature Above Alarm | 0x02 | 3 | r |  |  |  |
| Temperature | 0x02 | 3 | r |  | -20 - 60 |  |
| Temperature Above Alarm Released | 0x02 | 3 | r |  |  |  |
| Temperature | 0x02 | 3 | r |  | -20 - 60 |  |
| Temperature Below Alarm | 0x02 | 3 | r |  |  |  |
| Temperature | 0x02 | 3 | r |  | -20 - 60 |  |
| Temperature Below Alarm Released | 0x02 | 3 | r |  |  |  |
| Temperature | 0x02 | 3 | r |  | -20 - 60 |  |
| Temperature Within Alarm | 0x02 | 3 | r |  |  |  |
| Temperature | 0x02 | 3 | r |  | -20 - 60 |  |
| Temperature Within Alarm Released | 0x02 | 3 | r |  |  |  |
| Temperature | 0x02 | 3 | r |  | -20 - 60 |  |
| Persistent Low Temp Release | 0x02 | 3 | r |  |  |  |
| Temperature | 0x02 | 3 | r |  | -20 - 60 |  |
| Persistent Low Temp Trigger | 0x02 | 3 | r |  |  |  |
| Temperature | 0x02 | 3 | r |  | -20 - 60 |  |
| Persistent High Temp Release | 0x02 | 3 | r |  |  |  |
| Temperature | 0x02 | 3 | r |  | -20 - 60 |  |
| Persistent High Temp Trigger | 0x02 | 3 | r |  |  |  |
| Temperature | 0x02 | 3 | r |  | -20 - 60 |  |
| Alarm Type | 0x03 | 2 | r |  |  |  |
| Collection Error | 0x03 | 1 | r |  |  |  |
| Exceed the Range Lower Limit | 0x03 | 1 | r |  |  |  |
| Exceed the Range Upper Limit | 0x03 | 1 | r |  |  |  |
| No Data | 0x03 | 1 | r |  |  |  |
| Usage Time | 0x04 | 5 | r |  |  |  |
| Alarm Type | 0x07 | 2 | r |  |  |  |
| Collection Error | 0x07 | 1 | r |  |  |  |
| Exceed the Range Lower Limit | 0x07 | 1 | r |  |  |  |
| Exceed the Range Upper Limit | 0x07 | 1 | r |  |  |  |
| No Data | 0x07 | 1 | r |  |  |  |
| Reserved Cmd | 0x30 | 2 | r | 0 |  |  |
| Reserved Cmd1 | 0x30 | 1 | r |  |  |  |
| Sub-command | 0x30 | 2 | r |  |  |  |
| WT401 Battery | 0x30 | 2 | r |  | 0 - 100 |  |
| WT401 Battery Event | 0x30 | 2 | r |  |  |  |
| Battery Event Type | 0x30 | 2 | r |  |  |  |
| Battery Normal | 0x30 | 1 | r |  |  |  |
| Low Battery | 0x30 | 1 | r |  |  |  |
| WT401 Button Event | 0x30 | 2 | r |  |  |  |
| Event Type | 0x30 | 2 | r |  |  |  |
| Button Event 1 | 0x30 | 1 | r |  |  |  |
| Button Event 2 | 0x30 | 1 | r |  |  |  |
| Button Event 3 | 0x30 | 1 | r |  |  |  |
| Device Status | 0x30 | 2 | r |  |  | 0：Off<br>1：On |
| Reboot | 0xBE | 1 | w |  |  |  |
| Retrieval(Periods of Time) | 0xBB | 9 | w |  |  |  |
| Start Time | 0xBB | 5 | w |  |  |  |
| End Time | 0xBB | 5 | w |  |  |  |
| System Status Control | 0x59 | 7 | w |  |  |  |
| System On/Off | 0x59 | 2 | w | 1 |  | 0：system off<br>1：system on |
| Temperature Control Mode | 0x59 | 2 | w | 0 |  | 0：heat<br>2：cool<br>3：auto<br>255：disable |
| Heat Temperature | 0x59 | 3 | w | 17 | 5 - 35 |  |
| Cool Temperature | 0x59 | 3 | w | 28 | 5 - 35 |  |

