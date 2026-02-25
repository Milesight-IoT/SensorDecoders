# UC711 Sensor

![UC711](uc711.png)

For more detailed information, please visit [Milesight Official Website](https://www.milesight.com/iot/product/lorawan-sensor/uc711)

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
| Temperature | 0x06 | 3 | r |  | -20 - 60 |  |
| Humidity | 0x08 | 3 | r |  | 0 - 100 |  |
| Temperature Control Info | 0x0C | 2 | r |  |  |  |
| Temperature Control Mode | 0x0C | 2 | r | 0 |  | 0：heat<br>2：cool<br>3：auto<br>15：na |
| Temperature Control Status | 0x0C | 2 | r | 0 |  | 0：standby<br>1：stage-1 heat<br>2：stage-2 heat<br>3：stage-3 heat<br>4：stage-4 heat<br>5：em heat<br>6：stage-1 cool<br>7：stage-2 cool<br>8：stage-5 heat |
| Fan Info | 0x0D | 2 | r |  |  |  |
| Fan Mode | 0x0D | 2 | r | 0 |  | 0：auto<br>1：circulate<br>2：on<br>3：low<br>4：medium<br>5：high<br>15：na |
| Fan Status | 0x0D | 2 | r | 0 |  | 0：off<br>1：open<br>2：low<br>3:medium<br>4:high |
| Plan Status | 0x0E | 2 | r | 0 | 0 - 16 |  |
| Target Temperature | 0x10 | 3 | r |  | 5 - 35 |  |
| Auto-P | 0xC4 | 2 | rw | 1 |  | 0：Disable<br>1：Enable |
| Data Storage Settings | 0xC5 | 1 | rw |  |  |  |
| Sub-command | 0xC5 | 2 | rw | 0 |  |  |
| Data Storage Enable | 0xC5 | 2 | rw | 0 |  | 0：Disable<br>1：Enable |
| Data Retransmission Enable | 0xC5 | 2 | rw | 0 |  | 0：Disable<br>1：Enable |
| Data Retransmission Interval | 0xC5 | 3 | rw | 600 | 30 - 1200 |  |
| Data Retrieval Interval | 0xC5 | 3 | rw | 60 | 30 - 1200 |  |
| Bluetooth Config | 0xD4 | 1 | rw |  |  |  |
| Sub-command | 0xD4 | 2 | rw |  |  |  |
| Bluetooth Name | 0xD4 | 1 | rw |  |  |  |
| Name Length | 0xD4 | 2 | rw | 13 | 1 - 255 |  |
| Bluetooth Name | 0xD4 | 1 | rw |  |  |  |
| Temperature Control Mode | 0x60 | 1 | rw |  |  |  |
| Sub-command | 0x60 | 2 | rw | 0 |  | 0：Mode<br>1：Plan Temperature Control<br>Mode Enable |
| Temperature Control Mode | 0x60 | 2 | rw | 0 |  | 0：heat<br>2：cool<br>3：auto |
| Plan Temperature Control
Mode Enable | 0x60 | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Target Temperature Settings | 0x61 | 1 | rw |  |  |  |
| Temperature Control Mode | 0x61 | 2 | rw | 0 |  |  |
| Heat Temperature | 0x61 | 3 | rw | 17 | 5 - 35 |  |
| Cool Temperature | 0x61 | 3 | rw | 28 | 5 - 35 |  |
| Auto Temperature | 0x61 | 3 | rw | 23 | 5 - 35 |  |
| Target Temperature Tolerance | 0x62 | 1 | rw |  |  |  |
| Target Temperature Tolerance | 0x62 | 2 | rw | 0 |  |  |
| Target Temperature Tolerance | 0x62 | 3 | rw | 1 | 0.1 - 5 |  |
| Temperature Control Tolerance | 0x62 | 3 | rw | 1 | 0.1 - 5 |  |
| Heat Target Temperature Tolerance | 0x62 | 3 | rw | 1 | 0.1 - 5 |  |
| Cool Target Temperature Tolerance | 0x62 | 3 | rw | 1 | 0.1 - 5 |  |
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
| Temperature Unit | 0x64 | 2 | rw | 0 |  | 0：℃<br>1：℉ |
| Target Temperature Resolution | 0x65 | 2 | rw | 0 |  | 0：0.5<br>1：1 |
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
| Schedule Settings | 0x67 | 1 | rw |  |  |  |
| Schedule Settings | 0x67 | 1 | rw |  |  |  |
| Schedule ID | 0x67 | 2 | rw | 0 | 0 - 16 |  |
| Sub-command | 0x67 | 2 | rw | 0 |  |  |
| Schedule Enable | 0x67 | 2 | rw | 0 |  | 0：Disable<br>1：Enable |
| Name(prefix6) | 0x67 | 7 | rw |  |  |  |
| Name(prefix4) | 0x67 | 5 | rw |  |  |  |
| Fan Mode | 0x67 | 2 | rw | 0 |  | 0：Auto<br>1：Always Open<br>2：Ventilation<br>3：Low<br>4：Medium<br>5：High<br>255：Disabled |
| Switch On | 0x67 | 2 | rw | 1 |  | 0：Switch Off<br>1：Switch On |
| Work Mode | 0x67 | 2 | rw | 0 |  | 0：heat<br>2：cool<br>3：auto |
| Heat Target Temperature | 0x67 | 3 | rw | 17 | 5 - 35 |  |
| Cool Target Temperature | 0x67 | 3 | rw | 28 | 5 - 35 |  |
| Auto Target Temperature | 0x67 | 3 | rw | 23 | 5 - 35 |  |
| Target Temperature Tolerance | 0x67 | 3 | rw | 1 | 0.1 - 5 |  |
| Temperature Control Tolerance | 0x67 | 3 | rw | 2 | 0.5 - 10 |  |
| Heat Target Temperature Tolerance | 0x67 | 3 | rw | 1 | 0.1 - 5 |  |
| Cool Target Temperature Tolerance | 0x67 | 3 | rw | 1 | 0.1 - 5 |  |
| Time | 0x67 | 6 | rw |  |  |  |
| Time Configuration | 0x67 | 6 | rw |  |  |  |
| Time ID | 0x67 | 2 | rw | 0 | 0 - 16 |  |
| Enable | 0x67 | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Trigger Time | 0x67 | 3 | rw | 0 |  |  |
| Sun. | 0x67 | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Mon. | 0x67 | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Tues. | 0x67 | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Wed. | 0x67 | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Thur. | 0x67 | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Fri. | 0x67 | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Sat. | 0x67 | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Valid | 0x67 | 2 | rw | 0 |  | 0：delete<br>1：valid |
| Open Window Detection | 0x68 | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Open Window Detection Settings | 0x69 | 1 | rw |  |  |  |
| Open Window Detection Method | 0x69 | 2 | rw | 0 |  | 0：temperature<br>1：door |
| Temperature Detection | 0x69 | 1 | rw |  |  |  |
| Command | 0x69 | 2 | rw | 0 |  |  |
| Temperature Variation | 0x69 | 3 | rw | 3 | 1 - 10 |  |
| Stop Control For | 0x69 | 3 | rw | 30 | 1 - 1440 |  |
| Magnetic Contact Switch Detection | 0x69 | 2 | rw |  |  |  |
| Detection Duration | 0x69 | 2 | rw | 10 | 1 - 60 |  |
| Temperature Data Source Settings | 0x6A | 1 | rw |  |  |  |
| Sub-command | 0x6A | 2 | rw | 0 |  |  |
| Data Source | 0x6A | 2 | rw | 3 |  | 0: External Temperature Sensor<br>1: Issued By Lorawan Gateway<br>2: Lorawan D2D<br>3: HMI(WT401) |
| Time Out | 0x6A | 2 | rw | 10 |  |  |
| Offline Mode | 0x6A | 2 | rw | 0 |  | 0: Maintain<br>1: Disconnect<br>2: Cut into internal |
| Data Sync | 0x6A | 2 | rw | 1 |  | 0：disable<br>1：enable |
| Persistent High Temperature Alarm Settings | 0x6C | 1 | rw |  |  |  |
| Sub-command | 0x6C | 2 | rw | 0 |  |  |
| Persistent High Temperature | 0x6C | 2 | rw | 0 |  | 0：Disable<br>1：Enable |
| Difference in Temperature | 0x6C | 3 | rw | 3 | 1 - 10 |  |
| Duration | 0x6C | 2 | rw | 5 | 0 - 60 |  |
| Persistent Low Temperature Alarm Settings | 0x6D | 1 | rw |  |  |  |
| Sub-command | 0x6D | 2 | rw | 0 |  |  |
| Persistent Low Temperature | 0x6D | 2 | rw | 0 |  | 0：Disable<br>1：Enable |
| Difference in Temperature | 0x6D | 3 | rw | 3 | 1 - 10 |  |
| Duration | 0x6D | 2 | rw | 5 | 0 - 60 |  |
| System Switch | 0x6F | 2 | rw | 0 |  | 0：Switch Off<br>1：Switch On |
| Fan Settings | 0x70 | 1 | rw |  |  |  |
| Sub-command | 0x70 | 2 | rw | 0 |  |  |
| Fan Mode | 0x70 | 2 | rw | 0 |  | 0：Auto<br>1：Always Open<br>2：Ventilation<br>3：Low<br>4：Medium<br>5：High<br>255：Disabled |
| Adjust Humidity Enable | 0x70 | 2 | rw | 0 |  | 0：Disable<br>1：Enable |
| Adjust Period | 0x70 | 2 | rw | 5 | 5 - 55 |  |
| Work Time | 0x70 | 2 | rw | 30 | 5 - 55 |  |
| Anti Freezing | 0x71 | 1 | rw |  |  |  |
| Sub-command | 0x71 | 2 | rw | 0 |  |  |
| Enable | 0x71 | 2 | rw | 0 |  | 0：Disable<br>1：Enable |
| Target Temperature | 0x71 | 3 | rw | 3 | 1 - 5 |  |
| Dehumidify Settings | 0x72 | 1 | rw |  |  |  |
| Sub-command | 0x72 | 2 | rw | 2 |  |  |
| Humidify Low Threshold | 0x72 | 3 | rw | 40 | 0 - 100 |  |
| Humidify High Threshold | 0x72 | 3 | rw | 60 | 0 - 100 |  |
| Plan Dwell Time Settings | 0x73 | 1 | rw |  |  |  |
| Schedule Settings | 0x73 | 1 | rw |  |  |  |
| Schedule ID | 0x73 | 2 | rw | 0 | 0 - 16 |  |
| Sub-command | 0x73 | 2 | rw | 0 |  |  |
| Permanent Stay Enable | 0x73 | 2 | rw | 0 |  | 0：Disable<br>1：Enable |
| Dwell  Time | 0x73 | 2 | rw | 0 | 0 - 120 |  |
| System Protect | 0x74 | 1 | rw |  |  |  |
| Sub-command | 0x74 | 2 | rw | 0 |  |  |
| Enable | 0x74 | 2 | rw | 0 |  | 0：Disable<br>1：Enable |
| Run Time | 0x74 | 2 | rw | 5 | 1 - 60 |  |
| Temperature Control Mode Enable | 0x75 | 2 | rw |  |  |  |
| Heat Mode | 0x75 | 2 | rw | 0 |  | 0：disable<br>1：enable |
| EM Heat Mode | 0x75 | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Cool Mode | 0x75 | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Auto Mode | 0x75 | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Dehumidify Mode | 0x75 | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Ventilate Mode | 0x75 | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Reserved | 0x75 | 2 | rw |  |  |  |
| Target Temperature Mode | 0x76 | 2 | rw | 0 |  | 0：single<br>1：double |
| Unilateral Tolerance Enable | 0x77 | 2 | rw | 0 |  | 0：Disable<br>1：Enable |
| Relay Change Report Enable | 0x80 | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Fan Delay Off Settings | 0x82 | 1 | rw |  |  |  |
| Sub-command | 0x82 | 2 | rw | 0 |  |  |
| Fan Delay Off Enable | 0x82 | 2 | rw | 1 |  | 0：Disable<br>1：Enable |
| Fan Delay Off Time | 0x82 | 3 | rw | 60 | 1 - 3600 |  |
| DI Settings Enable | 0x86 | 2 | rw | 0 |  | 0：Disable<br>1：Enable |
| DI Settings | 0x87 | 1 | rw |  |  |  |
| DI Control Object | 0x87 | 2 | rw | 0 |  | 0：card<br>1：door |
| Room Card | 0x87 | 1 | rw |  |  |  |
| Room Card Control Type | 0x87 | 2 | rw | 0 |  | 0：system_ctrl<br>1：insert_sche |
| System Control | 0x87 | 2 | rw |  |  |  |
| Insert Card | 0x87 | 2 | rw | 1 |  | 0：system close<br>1：system open |
| Insert Schedule | 0x87 | 3 | rw |  |  |  |
| Insert Card Schedule | 0x87 | 2 | rw | 0 |  | 0：Insert Schedule1<br>1：Insert Schedule2<br>2：Insert Schedule3<br>3：Insert Schedule4<br>4：Insert Schedule5<br>5：Insert Schedule6<br>6：Insert Schedule7<br>7：Insert Schedule8<br>8：Insert Schedule9<br>9：Insert Schedule10<br>10：Insert Schedule11<br>11：Insert Schedule12<br>12：Insert Schedule13<br>13：Insert Schedule14<br>14：Insert Schedule15<br>15：Insert Schedule16 |
| Unplug Card Schedule | 0x87 | 2 | rw | 1 |  | 0：Insert Schedule1<br>1：Insert Schedule2<br>2：Insert Schedule3<br>3：Insert Schedule4<br>4：Insert Schedule5<br>5：Insert Schedule6<br>6：Insert Schedule7<br>7：Insert Schedule8<br>8：Insert Schedule9<br>9：Insert Schedule10<br>10：Insert Schedule11<br>11：Insert Schedule12<br>12：Insert Schedule13<br>13：Insert Schedule14<br>14：Insert Schedule15<br>15：Insert Schedule16 |
| Magnetic Contact Switch | 0x87 | 2 | rw |  |  |  |
| Magnetic Contact Switch Type | 0x87 | 2 | rw | 1 |  | 0：normally closed<br>1：normally open |
| Filter Clean Reminder Setting | 0x8B | 1 | rw |  |  |  |
| Sub-command | 0x8B | 2 | rw | 0 |  |  |
| Filter Clean Reminder Enable | 0x8B | 2 | rw | 0 |  | 0：Disable<br>1：Enable |
| Reminder Period | 0x8B | 3 | rw | 90 | 1 - 730 |  |
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
| Reversing Valve Mode | 0x8E | 1 | rw |  |  |  |
| Reversing Valve Mode | 0x8E | 2 | rw | 0 |  | 0：o/b on cool<br>1：o/b on heat |
| Compressor and Auxiliary Heat Linkage | 0x8E | 1 | rw |  |  |  |
| Compressor and Auxiliary Heat Linkage | 0x8E | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Fan Owner | 0x8E | 1 | rw |  |  |  |
| Fan Owner | 0x8E | 2 | rw | 0 |  | 0：thermostat<br>1：hvac |
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
| D2D Pairing Enable | 0x95 | 2 | rw | 0 |  | 0：disable<br>1：enable |
| D2D Pairing Information | 0x96 | 1 | rw |  |  |  |
| D2D Pairing Information | 0x96 | 1 | rw |  |  |  |
| ID | 0x96 | 2 | rw | 0 | 0 - 4 |  |
| Type | 0x96 | 2 | rw | 0 |  |  |
| Pairing | 0x96 | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Device ID | 0x96 | 9 | rw |  |  |  |
| Device Name (prefix8) | 0x96 | 9 | rw |  |  |  |
| Device Name (suffix8) | 0x96 | 9 | rw |  |  |  |
| D2D Agent Enable | 0x97 | 2 | rw | 0 |  | 0：disable<br>1：enable |
| D2D Controlled | 0x98 | 1 | rw |  |  |  |
| D2D Controlled | 0x98 | 1 | rw |  |  |  |
| D2D Controlled ID | 0x98 | 2 | rw | 0 | 0 - 15 |  |
| Enable | 0x98 | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Control Command | 0x98 | 3 | rw | 0000 |  |  |
| Action Status | 0x98 | 2 | rw | 16 |  | 0：Schedule1<br>1：Schedule2<br>2：Schedule3<br>3：Schedule4<br>4：Schedule5<br>5：Schedule6<br>6：Schedule7<br>7：Schedule8<br>8：Schedule9<br>9：Schedule10<br>10：Schedule11<br>11：Schedule12<br>12：Schedule13<br>13：Schedule14<br>14：Schedule15<br>15：Schedule16<br>16：System Off<br>17：System On |

### Event

| CHANNEL |  ID  | LENGTH | READ/WRITE | DEFAULT | RANGE | ENUM |
| :------ | :--: | :----: | :--------: | :-----: | :---: | :--: |
| Order Check Response | 0xFE | 2 | r |  |  |  |
| Full Inspection Response | 0xF4 | 1 | r |  |  |  |
| Command Response | 0xEF | 1 | r |  |  |  |
| Request to Push All Configurations | 0xEE | 1 | r |  |  |  |

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
| Full Inspection Aging | 0xF4 | 1 | w |  |  |  |
| Full Inspection Response Subcommand | 0xF4 | 2 | r |  |  |  |
| Full Inspection Start Response | 0xF4 | 2 | r |  |  |  |
| Full Inspection Start Response | 0xF4 | 2 | r | 0 |  | 0：success<br>1：failed |
| Full Inspection Control Response | 0xF4 | 2 | r |  |  |  |
| Full Inspection Control Response | 0xF4 | 2 | r | 0 |  | 0：success<br>1：failed |
| Full Inspection Read Response | 0xF4 | 1 | r |  |  |  |
| Read Response Length | 0xF4 | 3 | r | 0 | 0 - 65535 |  |
| Read Response Content | 0xF4 | 1 | r |  |  |  |
| Full Inspection End Response | 0xF4 | 2 | r |  |  |  |
| Full Inspection End Response | 0xF4 | 2 | r | 0 |  | 0：success<br>1：failed |
| Full Inspection Aging Response | 0xF4 | 2 | r |  |  |  |
| Full Inspection Aging Response | 0xF4 | 2 | r | 0 |  | 0：success<br>1：failed |
| Command Queries | 0xEF | 1 | w |  |  |  |
| Query Information | 0xEF | 2 | w |  |  |  |
| Command Length | 0xEF | 2 | w | 1 | 1 - 15 |  |
| The command that was queried | 0xEF | 1 | w |  |  |  |
| Answer Result | 0xEF | 2 | r | 0 |  | 0：success<br>1：unknow<br>2：error order<br>3：error passwd<br>4：error read params<br>5：error write params<br>6：error read<br>7：error write<br>8：error read apply<br>9：error write apply |
| Command Length | 0xEF | 2 | r | 1 | 1 - 15 |  |
| Answered Commands | 0xEF | 1 | r |  |  |  |
| Device Status Query | 0xB9 | 1 | w |  |  |  |
| Time Synchronize | 0xB8 | 1 | w |  |  |  |
| Clear Data | 0xBD | 1 | w |  |  |  |
| Stop Retrieval | 0xBC | 1 | w |  |  |  |
| Retrieval(Periods of Time) | 0xBB | 9 | w |  |  |  |
| Start Time | 0xBB | 5 | w |  |  |  |
| End Time | 0xBB | 5 | w |  |  |  |
| Retrieval(Point-in-Time) | 0xBA | 5 | w |  |  |  |
| Time Point | 0xBA | 5 | w |  |  |  |
| Reboot | 0xBE | 1 | w |  |  |  |
| Delete Schedule | 0x5F | 2 | w |  |  |  |
| Delete Schedule | 0x5F | 2 | w | 255 |  | 0：Schedule1<br>1：Schedule2<br>2：Schedule3<br>3：Schedule4<br>4：Schedule5<br>5：Schedule6<br>6：Schedule7<br>7：Schedule8<br>8：Schedule9<br>9：Schedule10<br>10：Schedule11<br>11：Schedule12<br>12：Schedule13<br>13：Schedule14<br>14：Schedule15<br>15：Schedule16<br>255：All |

