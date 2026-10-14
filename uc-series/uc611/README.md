# UC611 Sensor

![UC611](uc611.png)

For more detailed information, please visit [Milesight Official Website](https://www.milesight.com/iot/product/lorawan-sensor/uc611)

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
| Power-On Relay Mode | 0x6B | 2 | rw | 2 |  | 2：Return to Previous Working State<br>0：normally open<br>1：normally closed |
| D2D Data Receiving Enable | 0x6E | 2 | rw | 1 |  | 0：disable<br>1：enable |
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

### Event

| CHANNEL |  ID  | LENGTH | READ/WRITE | DEFAULT | RANGE | ENUM |
| :------ | :--: | :----: | :--------: | :-----: | :---: | :--: |
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

