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
| SN | 0xDB | 9 | r |  |  |  |
| Product Version | 0xDA | 9 | r |  |  |  |
| Hardware Version | 0xDA | 3 | r |  |  |  |
| Firmware Version | 0xDA | 7 | r |  |  |  |
| Device Status | 0xC8 | 2 | rw | 1 |  | 0：Off<br>1：On |
| Voltage  | 0x00 | 3 | r |  | 0 - 250 |  |
| Electric Power  | 0x01 | 5 | r |  | 0 - 4000 |  |
| Power Factor  | 0x02 | 2 | r |  | 0 - 100 |  |
| Power Consumption  | 0x03 | 5 | r |  | 0 - 4294967295 |  |
| Current Rating  | 0x04 | 3 | r |  | 0 - 65535 |  |
| Equipment Temperature | 0x05 | 3 | r |  | -40 - 125 |  |
| Ambient  Temperature | 0x06 | 3 | r |  | -20 - 60 |  |
| Relays Status | 0x07 | 2 | r |  |  | 0：normally open<br>1：normally closed |
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
| Alarm Dismiss Report Enable | 0x6A | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Power-On Relay Mode | 0x6B | 2 | rw | 2 |  | 2：Return to Previous Working State<br>0：normally open<br>1：normally closed |
| Power Consumption Enable | 0x6C | 2 | rw | 1 |  | 0：disable<br>1：enable |
| D2D Data Receiving Enable | 0x6E | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Ambient Temperature Enable | 0x70 | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Ambient Temperature Settings | 0x71 | 1 | rw |  |  |  |
| Type | 0x71 | 2 | rw |  |  |  |
| Data Source | 0x71 | 2 | rw | 0 |  | 0 : d2d data<br>1：lora data |
| Time Out | 0x71 | 2 | rw | 10 | 1 - 60 |  |
| Timeout Relay Status | 0x71 | 2 | rw | 1 |  | 0：keep status<br>1：normally open<br>2：normally closed |
| Heater Relay Status | 0x71 | 2 | rw | 0 |  | 0：normally closed<br>1：normally open |
| System Switch Enable | 0x72 | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Temperature Control Settings | 0x73 | 1 | rw |  |  |  |
| Type | 0x73 | 2 | rw |  |  |  |
| Target Temperature | 0x73 | 3 | rw | 19 | 5 - 35 |  |
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
| Enable | 0x76 | 2 | rw | 0 |  | 0：Disable<br>1：Enable |
| Freeze Temperature | 0x76 | 3 | rw | 3 | 1 - 5 |  |

### Event

| CHANNEL |  ID  | LENGTH | READ/WRITE | DEFAULT | RANGE | ENUM |
| :------ | :--: | :----: | :--------: | :-----: | :---: | :--: |
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
| Time Synchronize | 0xB8 | 1 | w |  |  |  |
| Reset | 0xBF | 1 | w |  |  |  |
| Reboot | 0xBE | 1 | w |  |  |  |
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
| Relays Status | 0x11 | 2 | r |  |  | 0：normally open<br>1：normally closed |
| Clear Power Consumption | 0x7B | 2 | w |  |  |  |
| Clear | 0x7B | 2 | w |  |  |  |
|  Open Window Status Control | 0x7C | 2 | w |  |  |  |
|  Control | 0x7C | 2 | w |  |  |  |
| Ambient Temperature Settings | 0x7D | 3 | w |  |  |  |
| Ambient Temperature Value | 0x7D | 3 | w | 0 | -20 - 60 |  |

