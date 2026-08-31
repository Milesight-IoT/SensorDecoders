# UC601 Sensor

![UC601](uc601.png)

For more detailed information, please visit [Milesight Official Website](https://www.milesight.com/iot/product/lorawan-sensor/uc601)

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
| Device Status | 0xC8 | 2 | rw | 1 |  | 0：Off<br>1：On |
| Product Region | 0xD8 | 17 | r |  |  |  |
| Voltage  | 0x00 | 3 | r |  | 0 - 250 |  |
| Electric Power  | 0x01 | 5 | r |  | 0 - 4000 |  |
| Power Factor  | 0x02 | 2 | r |  | 0 - 100 |  |
| Power Consumption  | 0x03 | 5 | r |  | 0 - 4294967295 |  |
| Current Rating  | 0x04 | 3 | r |  | 0 - 65536 |  |
| Equipment Temperature | 0x05 | 3 | r |  | -40 - 125 |  |
| Ambient  Temperature | 0x06 | 3 | r |  | -20 - 60 |  |
| Relays Status | 0x07 | 2 | r |  |  | 0：normally closed<br>1：normally open |
| Reporting Interval | 0x60 | 1 | rw |  |  |  |
| Reporting Interval Unit | 0x60 | 2 | rw | 1 |  | 0：second<br>1：min |
| Reporting Interval | 0x60 | 3 | rw | 1200 | 10 - 64800 |  |
| Reporting Interval | 0x60 | 3 | rw | 20 | 1 - 1440 |  |
| Temperature Unit | 0x61 | 2 | rw | 0 |  | 0：℃<br>1：℉ |
| LED Indicator | 0x62 | 2 | rw | 1 |  | 0：disable<br>1：enable |
| Button Lock  | 0x63 | 1 | rw |  |  |  |
| Type | 0x63 | 2 | rw |  |  |  |
| Relay Switching  | 0x63 | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Reset | 0x63 | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Overcurrent Alarm | 0x64 | 1 | rw |  |  |  |
| Type | 0x64 | 2 | rw |  |  |  |
| Overcurrent Alarm Enable | 0x64 | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Overcurrent Alarm Value | 0x64 | 2 | rw | 16 | 1 - 16 |  |
| Over current Protection | 0x65 | 1 | rw |  |  |  |
| Type | 0x65 | 2 | rw |  |  |  |
| Overcurrent Protection Enable | 0x65 | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Overcurrent Protection Value | 0x65 | 2 | rw | 16 | 1 - 16 |  |
| Overvoltage Alarm | 0x66 | 1 | rw |  |  |  |
| Type | 0x66 | 2 | rw |  |  |  |
| Overvoltage Alarm Enable | 0x66 | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Overvoltage Alarm Value | 0x66 | 2 | rw | 250 | 1 - 250 |  |
| Overvoltage Protection | 0x67 | 1 | rw |  |  |  |
| Type | 0x67 | 2 | rw |  |  |  |
| Overvoltage Protection Enable | 0x67 | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Overvoltage Protection Value | 0x67 | 2 | rw | 250 | 1 - 250 |  |
| High Current Protection Enable | 0x68 | 2 | rw | 1 |  | 0：disable<br>1：enable |
| Relay Abnormal Protection Enable | 0x69 | 2 | rw | 1 |  | 0：disable<br>1：enable |
| Alarm Dismiss Report Enable | 0x6A | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Power-On Relay Mode | 0x6B | 2 | rw | 2 |  | 2：Return to Previous Working State<br>0：normally closed<br>1：normally open |
| Power Consumption Enable | 0x6C | 2 | rw | 1 |  | 0：disable<br>1：enable |
| Bluetooth Connection Name | 0x6D | 33 | rw |  |  |  |
| D2D Data Receiving Enable | 0x6E | 2 | rw | 1 |  | 0：disable<br>1：enable |
| D2D Data Receiving Settings | 0x6F | 1 | rw |  |  |  |
| D2D Data Receiving Settings | 0x6F | 1 | rw |  |  |  |
| ID | 0x6F | 2 | rw | 0 | 0 - 4 |  |
| Type | 0x6F | 2 | rw |  |  |  |
| Enable | 0x6F | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Paired Device EUI | 0x6F | 9 | rw |  |  |  |
| Device Name (First 8B) | 0x6F | 9 | rw |  |  |  |
| Device Name (Last 8B) | 0x6F | 9 | rw |  |  |  |
| Ambient Temperature Enable | 0x70 | 2 | rw | 1 |  | 0：disable<br>1：enable |
| Ambient Temperature Settings | 0x71 | 1 | rw |  |  |  |
| Type | 0x71 | 2 | rw |  |  |  |
| Data Source | 0x71 | 2 | rw | 0 |  | 0 : d2d data<br>1：lora data |
| Time Out | 0x71 | 2 | rw | 10 | 1 - 60 |  |
| Timeout Relay Status | 0x71 | 2 | rw | 1 |  | 0：keep status<br>1：normally open<br>2：normally closed |
| Heater Relay Status | 0x71 | 2 | rw | 1 |  | 0：normally closed<br>1：normally open |
| System Switch Enable | 0x72 | 2 | rw | 1 |  | 0：disable<br>1：enable |
| Temperature Control Settings | 0x73 | 1 | rw |  |  |  |
| Type | 0x73 | 2 | rw |  |  |  |
| Target Temperature | 0x73 | 3 | rw | 19 |  |  |
| Target Temperature Tolerance | 0x73 | 3 | rw | 1 | 0.5 - 5 |  |
| Target Temperature Range | 0x73 | 5 | rw |  |  |  |
| Min Value | 0x73 | 3 | rw | 5 | 5 - 35 |  |
| Max Value | 0x73 | 3 | rw | 35 | 5 - 35 |  |
| Open Window Detection Enable | 0x74 | 2 | rw | 0 |  | 0：Disable<br>1：Enable |
| Open Window Detection Settings | 0x75 | 6 | rw |  |  |  |
| Type | 0x75 | 2 | rw |  |  |  |
| Rate of Temperature Fall | 0x75 | 3 | rw | 3 | 2 - 10 |  |
| Stop Temperature Control | 0x75 | 3 | rw | 30 | 1 - 1440 |  |
| Freeze Protection | 0x76 | 1 | rw |  |  |  |
| Type | 0x76 | 2 | rw |  |  |  |
| Enable | 0x76 | 2 | rw | 1 |  | 0：Disable<br>1：Enable |
| Freeze Temperature | 0x76 | 3 | rw | 3 | 1 - 5 |  |
| Schedule Settings | 0x77 | 1 | rw |  |  |  |
| Schedule Settings | 0x77 | 1 | rw |  |  |  |
| Schedule ID | 0x77 | 2 | rw | 0 | 0 - 15 |  |
| Sub-command | 0x77 | 2 | rw |  |  |  |
| Schedule Enable | 0x77 | 2 | rw | 0 |  | 0：None<br>1：Enable<br>2：Disable |
| Schedule Repeat Day | 0x77 | 4 | rw |  |  |  |
| Sun. | 0x77 | 2 | rw | 0 |  | 0：Disable<br>1：Enable |
| Mon. | 0x77 | 2 | rw | 0 |  | 0：Disable<br>1：Enable |
| Tues. | 0x77 | 2 | rw | 0 |  | 0：Disable<br>1：Enable |
| Wed. | 0x77 | 2 | rw | 0 |  | 0：Disable<br>1：Enable |
| Thur. | 0x77 | 2 | rw | 0 |  | 0：Disable<br>1：Enable |
| Fri. | 0x77 | 2 | rw | 0 |  | 0：Disable<br>1：Enable |
| Sat. | 0x77 | 2 | rw | 0 |  | 0：Disable<br>1：Enable |
| Reserved | 0x77 | 2 | rw |  |  |  |
| Hour | 0x77 | 2 | rw | 0 | 0 - 23 |  |
| Minute | 0x77 | 2 | rw | 0 | 0 - 59 |  |
| Schedule Content | 0x77 | 2 | rw | 0 |  | 0：relay<br>1：temperature control |
| Status | 0x77 | 2 | rw | 0 |  | 0:normally open<br>1:normally closed<br>2:change<br>3：Start up<br>4：stop |
| Target Temperature | 0x77 | 3 | rw | 0 | 5 - 35 |  |
| D2D Agent Enable | 0x78 | 2 | rw | 0 |  | 0：disable<br>1：enable |
| D2D Agent | 0x79 | 1 | rw |  |  |  |
| D2D Agent | 0x79 | 1 | rw |  |  |  |
| Number | 0x79 | 2 | rw | 0 | 0 - 7 |  |
| Type | 0x79 | 2 | rw |  |  |  |
| Enable | 0x79 | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Control Command | 0x79 | 3 | rw | 0000 |  |  |
| Action Object | 0x79 | 2 | rw | 0 |  | 0：relay<br>1：temperature control |
| Action Status | 0x79 | 2 | rw | 0 |  | 0:normally open<br>1:normally closed<br>2:change<br>3：Start up<br>4：stop |
| Time Zone | 0xC7 | 3 | rw | 0 |  | -720：UTC-12(IDLW)<br>-660：UTC-11(SST)<br>-600：UTC-10(HST)<br>-570：UTC-9:30(MIT)<br>-540：UTC-9(AKST)<br>-480：UTC-8(PST)<br>-420：UTC-7(MST)<br>-360：UTC-6(CST)<br>-300：UTC-5(EST)<br>-240：UTC-4(AST)<br>-210：UTC-3:30(NST)<br>-180：UTC-3(BRT)<br>-120：UTC-2(FNT)<br>-60：UTC-1(CVT)<br>0：UTC(WET)<br>60：UTC+1(CET)<br>120：UTC+2(EET)<br>180：UTC+3(MSK)<br>210：UTC+3:30(IRST)<br>240：UTC+4(GST)<br>270：UTC+4:30(AFT)<br>300：UTC+5(PKT)<br>330：UTC+5:30(IST)<br>345：UTC+5:45(NPT)<br>360：UTC+6(BHT)<br>390：UTC+6:30(MMT)<br>420：UTC+7(ICT)<br>480：UTC+8(CT/CST)<br>540：UTC+9(JST)<br>570：UTC+9:30(ACST)<br>600：UTC+10(AEST)<br>630：UTC+10:30(LHST)<br>660：UTC+11(VUT)<br>720：UTC+12(NZST)<br>765：UTC+12:45(CHAST)<br>780：UTC+13(PHOT)<br>840：UTC+14(LINT) |
| Daylight Saving Time | 0xC6 | M | rw |  |  |  |
| Enable | 0xC6 | 2 | rw | 0 |  | 0：Disable<br>1：Enable |
| DST Bias | 0xC6 | 2 | rw | 60 | 1 - 120 |  |
|  Month | 0xC6 | 2 | rw | 1 |  | 1:Jan.<br>2:Feb.<br>3:Mar.<br>4:Apr.<br>5:May<br>6:Jun.<br>7:Jul.<br>8:Aug.<br>9:Sep.<br>10:Oct.<br>11:Nov.<br>12:Dec. |
|  Number of Week | 0xC6 | 2 | rw | 1 |  | 1:1st<br>2: 2nd<br>3: 3rd<br>4: 4th<br>5: last |
| Week | 0xC6 | 2 | rw | 7 |  | 1：Mon.<br>2：Tues.<br>3：Wed.<br>4：Thurs.<br>5：Fri.<br>6：Sat.<br>7：Sun. |
| Time | 0xC6 | 3 | rw | 0 |  | 0：00:00<br>60：01:00<br>120：02:00<br>180：03:00<br>240：04:00<br>300：05:00<br>360：06:00<br>420：07:00<br>480：08:00<br>540：09:00<br>600：10:00<br>660：11:00<br>720：12:00<br>780：13:00<br>840：14:00<br>900：15:00<br>960：16:00<br>1020：17:00<br>1080：18:00<br>1140：19:00<br>1200：20:00<br>1260：21:00<br>1320：22:00<br>1380：23:00 |
|  Month | 0xC6 | 2 | rw | 1 |  | 1:Jan.<br>2:Feb.<br>3:Mar.<br>4:Apr.<br>5:May<br>6:Jun.<br>7:Jul.<br>8:Aug.<br>9:Sep.<br>10:Oct.<br>11:Nov.<br>12:Dec. |
|  Number of Week | 0xC6 | 2 | rw | 1 |  | 1:1st<br>2: 2nd<br>3: 3rd<br>4: 4th<br>5: last |
| Week | 0xC6 | 2 | rw | 7 |  | 1：Mon.<br>2：Tues.<br>3：Wed.<br>4：Thurs.<br>5：Fri.<br>6：Sat.<br>7：Sun. |
| Time | 0xC6 | 3 | rw | 0 |  | 0：00:00<br>60：01:00<br>120：02:00<br>180：03:00<br>240：04:00<br>300：05:00<br>360：06:00<br>420：07:00<br>480：08:00<br>540：09:00<br>600：10:00<br>660：11:00<br>720：12:00<br>780：13:00<br>840：14:00<br>900：15:00<br>960：16:00<br>1020：17:00<br>1080：18:00<br>1140：19:00<br>1200：20:00<br>1260：21:00<br>1320：22:00<br>1380：23:00 |
| LoraTxRdtMax | 0x7E | 2 | rw | 5 | 0 - 60 |  |

### Event

| CHANNEL |  ID  | LENGTH | READ/WRITE | DEFAULT | RANGE | ENUM |
| :------ | :--: | :----: | :--------: | :-----: | :---: | :--: |
| Command Response | 0xEF | 1 | r |  |  |  |
| Request to Push All Configurations | 0xEE | 1 | r |  |  |  |
| Voltage  Alarm | 0x20 | 1 | r |  |  |  |
| Electric Power  Alarm | 0x21 | 1 | r |  |  |  |
| Power Factor  Alarm | 0x22 | 1 | r |  |  |  |
| Power Consumption Alarm | 0x23 | 1 | r |  |  |  |
| Current  Alarm | 0x24 | 1 | r |  |  |  |
| Equipment Temperature  Alarm | 0x25 | 1 | r |  |  |  |
| Ambient Temperature  Alarm | 0x26 | 1 | r |  |  |  |
| Over current Alarm | 0x08 | 4 | r |  |  |  |
| Over current Protection | 0x09 | 4 | r |  |  |  |
| High current Protection | 0x0A | 4 | r |  |  |  |
| Over Voltage Alarm | 0x0B | 4 | r |  |  |  |
| Over Voltage Protection | 0x0C | 4 | r |  |  |  |
| Device Abnormal Alarm | 0x0D | 2 | r |  |  |  |
| Over Temperature Protection | 0x0E | 4 | r |  |  |  |
| Freeze Protection | 0x0F | 4 | r |  |  |  |
| Open Window detection | 0x10 | 4 | r |  |  |  |
| Relays Status Change | 0x11 | 2 | r |  |  |  |

### Service

| CHANNEL |  ID  | LENGTH | READ/WRITE | DEFAULT | RANGE | ENUM |
| :------ | :--: | :----: | :--------: | :-----: | :---: | :--: |
|  Response Result | 0xEF | 2 | r | 0 |  | 0：success<br>1：unknown<br>2：error order<br>3：error passwd<br>4：error read params<br>5：error write params<br>6：error read<br>7：error write<br>8：error read apply<br>9：error write apply |
| Command Length | 0xEF | 2 | r | 1 | 1 - 15 |  |
| Answered Commands | 0xEF | 1 | r |  |  |  |
| Command Queries | 0xEF | 1 | w |  |  |  |
| Query Information | 0xEF | 2 | w |  |  |  |
| Command Length | 0xEF | 2 | w | 1 | 1 - 15 |  |
| The command that was queried | 0xEF | 1 | w |  |  | 0XDA:Product Version<br>0X00:Voltage<br>0X01:Electric Power<br>0X02:Power Factor<br>0X03:Power Consumption<br>0X04:Current Rating<br>0X05:Equipment Temperature<br>0X06:Ambient Temperature<br>0X07:Relays Status<br>0X60:Reporting Interval<br>0X61:LED Indicator<br>0X62:Button Lock<br>0X63:Reset Lock<br>0X6400:Overcurrent AlarmOvercurrent Alarm Enable<br>0X6400:Overcurrent AlarmOvercurrent Alarm Value<br>0X6500:Over current ProtectionOvercurrent Protection Enable<br>0X6501:Over current ProtectionOvercurrent Protection Value<br>0X6600:Overvoltage AlarmOvervoltage Alarm Enable<br>0X6601:Overvoltage AlarmOvervoltage Alarm Value<br>0X6700:Overvoltage ProtectionOvervoltage Protection Enable<br>0X6701:Overvoltage ProtectionOvervoltage Protection Value<br>0X68:High Current Protection Enable<br>0X69:Relay Abnormal Protection Enable<br>0X6A:Threshold Alarm Release<br>0X6B:Power-On Relay Mode<br>0X6C:Power Metering Enable<br>0X6D:Bluetooth Name<br>0X6E:D2D Data Reception Enable<br>0X6F00:D2D Data Receiving SettingsEnable<br>0X6F01:D2D Data Receiving SettingsPaired Device EUI<br>0X6F02:D2D Data Receiving SettingsDevice Name (First 8B)<br>0X6F03:D2D Data Receiving SettingsDevice Name (Last 8B)<br>0X70:Ambient Temperature Enable<br>0X7100:Ambient Temperature Config Ambient Temperature Source<br>0X7101:Ambient Temperature Config Ambient Temperature Timeout<br>0X7102:Ambient Temperature Config Relay Status After Temperature Timeout<br>0X72:Temperature Control Enable<br>0X7300:Temperature Control SettingsTemperature Control Target<br>0X7301:Temperature Control SettingsTemperature Control Tolerance<br>0X7302:Temperature Control SettingsTemperature Regulation Range<br>0X74:Enable<br>0X7500:Open Window DetectionRate of Temperature Fall<br>0X7501:Open Window DetectionStop Temperature Control<br>0X7600:Freeze ProtectionEnable<br>0X7601:Freeze ProtectionFreeze Temperature<br>0X7700:Schedule SettingsSchedule Enable<br>0X7701:Schedule SettingsSchedule Repeat Day<br>0X7702:Schedule SettingsSchedule Target<br>0X7703:Schedule SettingsSchedule Action<br>0X7704:Schedule SettingsSchedule Parameter<br>0X78:D2D Agent Enable<br>0X7900:D2D ControlledEnable<br>0X7901:D2D ControlledControl Command<br>0X7902:D2D ControlledControl Target<br>0X7903:D2D ControlledControl Action<br>0XC7:Time Zone<br>0XC6:Daylight Saving Time |
| Request to Query All Configurations | 0xEE | 1 | w |  |  |  |
| Time Synchronize | 0xB8 | 1 | w |  |  |  |
| Reset | 0xBF | 1 | w |  |  |  |
| Reboot | 0xBE | 1 | w |  |  |  |
| Alarm Type | 0x20 | 2 | r |  |  |  |
| Collection Error | 0x20 | 1 | r |  |  |  |
| Alarm Type | 0x21 | 2 | r |  |  |  |
| Collection Error | 0x21 | 1 | r |  |  |  |
| Alarm Type | 0x22 | 2 | r |  |  |  |
| Collection Error | 0x22 | 1 | r |  |  |  |
| Alarm Type | 0x23 | 2 | r |  |  |  |
| Collection Error | 0x23 | 1 | r |  |  |  |
| Alarm Type | 0x24 | 2 | r |  |  |  |
| Collection Error | 0x24 | 1 | r |  |  |  |
| Alarm Type | 0x25 | 2 | r |  |  |  |
| Collection Error | 0x25 | 1 | r |  |  |  |
| Exceed the Range Lower Limit | 0x25 | 1 | r |  |  |  |
| Exceed the Range Upper Limit | 0x25 | 1 | r |  |  |  |
| Alarm Type | 0x26 | 2 | r |  |  |  |
| Collection Error | 0x26 | 1 | r |  |  |  |
| No Data | 0x26 | 1 | r |  |  |  |
| Current | 0x08 | 3 | r |  | 0 - 65535 |  |
| Alarm Status | 0x08 | 2 | r |  |  | 0：over current alarm Release<br>1：over current alarm trigger |
| Current | 0x09 | 3 | r |  | 0 - 65535 |  |
| Protection Status | 0x09 | 2 | r |  |  | 0：normal<br>1：over current protect  trigger |
| Current | 0x0A | 3 | r |  | 0 - 65535 |  |
| Protection Status | 0x0A | 2 | r |  |  | 0：normal<br>1：high current protect  trigger |
| Voltage | 0x0B | 3 | r |  | 0 - 250 |  |
| Alarm Status | 0x0B | 2 | r |  |  | 0：over voltage alarm Release<br>1：over voltage alarm trigger |
| Voltage | 0x0C | 3 | r |  | 0 - 250 |  |
| Protection Status | 0x0C | 2 | r |  |  | 0：normal<br>1：over voltage protect trigger |
| Alarm  Status | 0x0D | 2 | r |  |  | 0：normal<br>1：device broken |
| Equipment Temperature | 0x0E | 3 | r |  | -40 - 125 |  |
| Protection Status | 0x0E | 2 | r |  |  | 0：normal<br>1：over temperature  trigger |
| Ambient Temperature | 0x0F | 3 | r |  | -20 - 60 |  |
| Protection Status | 0x0F | 2 | r |  |  | 0：normal<br>1：freeze protection |
| Ambient Temperature | 0x10 | 3 | r |  | -20 - 60 |  |
| Status | 0x10 | 2 | r |  |  | 0：normal<br>1：open window |
| Relays Status | 0x11 | 2 | r |  |  | 0：normally closed<br>1：normally open |
|  Relay Status Control | 0x7A | 2 | w |  |  |  |
|  Relay Status | 0x7A | 2 | w | 0 |  | 0：normally closed<br>1：normally open |
| Clear Power Consumption | 0x7B | 2 | w |  |  |  |
| Clear | 0x7B | 2 | w |  |  |  |
|  Open Window Status Control | 0x7C | 2 | w |  |  |  |
|  Control | 0x7C | 2 | w |  |  |  |
| Ambient Temperature Settings | 0x7D | 3 | w |  |  |  |
| Ambient Temperature Value | 0x7D | 3 | w | 0 | -20 - 60 |  |
| Reset All Schedule | 0x7F | 2 | w |  |  |  |
| Reset  | 0x7F | 2 | w |  |  |  |

