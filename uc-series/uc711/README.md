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
| Hardware Version | 0xDA | 3 | r |  |  |  |
| Firmware Version | 0xDA | 7 | r |  |  |  |
| Device Status | 0xC8 | 2 | rw | 1 |  | 0：Off<br>1：On |
| Bluetooth Status | 0xBA | 11 | r |  |  |  |
| Bluetooth Status | 0xBA | M | r |  |  |  |
| ID | 0xBA | 2 | r | 0 |  |  |
| Bluetooth Status | 0xBA | 2 | r | 0 |  | 0: Not paired<br>1: Paired<br>2: Disconnected |
| Paired Device DevEUI | 0xBA | 9 | r | 24e124123456789a |  |  |
| Temperature | 0x06 | 3 | r |  | -20 - 60 |  |
| Humidity | 0x08 | 3 | r |  | 0 - 100 |  |
| Temperature Control Mode and Status | 0x0C | 2 | r |  |  |  |
| Temperature Control Status | 0x0C | 2 | r | 0 |  | 0：standby<br>1：stage-1 heat<br>2：stage-2 heat<br>3：stage-3 heat<br>4：stage-4 heat<br>5：stage-5 heat<br>7：stage-1 cool<br>8：stage-2 cool<br>9：stage-3 cool |
| Fan Mode and Status | 0x0D | 2 | r |  |  |  |
| Fan Status | 0x0D | 2 | r | 0 |  | 0：off<br>1：open<br>2：low<br>3:medium<br>4:high |
| Relay Status | 0x01 | 2 | r |  |  |  |
| Y1 | 0x01 | 2 | r | 0 |  | 0：opened<br>1：closed |
| W1 | 0x01 | 2 | r | 0 |  | 0：opened<br>1：closed |
| O/B | 0x01 | 2 | r | 0 |  | 0：opened<br>1：closed |
| GL | 0x01 | 2 | r | 0 |  | 0：opened<br>1：closed |
| GM | 0x01 | 2 | r | 0 |  | 0：opened<br>1：closed |
| GH | 0x01 | 2 | r | 0 |  | 0：opened<br>1：closed |
| Reserved | 0x01 | 2 | r |  |  |  |
| Reporting Interval | 0x66 | 1 | rw |  |  |  |
| Reporting Interval Type | 0x66 | 2 | rw | 0 |  | 0：BLE+LORA<br>1：POWERBUS+LORA |
| BLE_LORA Reporting Interval | 0x66 | 1 | rw |  |  |  |
| Reporting Interval Unit | 0x66 | 2 | rw | 1 |  | 0：second<br>1：min |
| Reporting Interval | 0x66 | 3 | rw | 10 | 1 - 1440 |  |
| POWERBUS_LORA Reporting Interval | 0x66 | 1 | rw |  |  |  |
| Reporting Interval Unit | 0x66 | 2 | rw | 1 |  | 0：second<br>1：min |
| Reporting Interval | 0x66 | 3 | rw | 10 | 1 - 1440 |  |
| Temperature Unit | 0x64 | 2 | rw | 0 |  | 0：℃<br>1：℉ |
| System Switch | 0x6F | 2 | rw | 0 |  | 0：Switch Off<br>1：Switch On |
| Temperature Control Mode | 0x60 | 1 | rw |  |  |  |
| Sub-command | 0x60 | 2 | rw | 0 |  | 0：Mode<br>1：Plan Temperature Control<br>Mode Enable |
| Temperature Control Mode | 0x60 | 2 | rw | 0 |  | 0：heat<br>2：cool<br>3：auto |
| Plan Temperature Control
Mode Enable | 0x60 | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Target Temperature Settings | 0x61 | 1 | rw |  |  |  |
| Temperature Control Mode | 0x61 | 2 | rw | 0 |  |  |
| Heat Target Temperature | 0x61 | 3 | rw | 17 | 5 - 35 |  |
| Cool Target Temperature | 0x61 | 3 | rw | 28 | 5 - 35 |  |
| Unilateral Tolerance Enable | 0x77 | 2 | rw | 0 |  | 0：Disable<br>1：Enable |
| Target Temperature Tolerance | 0x62 | 1 | rw |  |  |  |
| Target Temperature Tolerance | 0x62 | 2 | rw | 0 |  |  |
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
| Schedule Stay Duration Settings | 0x73 | 1 | rw |  |  |  |
| Schedule | 0x73 | 1 | rw |  |  |  |
| Schedule ID | 0x73 | 2 | rw | 0 | 0 - 15 |  |
| Sub-command | 0x73 | 2 | rw | 0 |  |  |
| Permanent Stay Enable | 0x73 | 2 | rw | 0 |  | 0：Disable<br>1：Enable |
| Temporary Stay Duration | 0x73 | 2 | rw | 0 | 0 - 120 |  |
| Installation Settings | 0x8E | 5 | rw |  |  |  |
| Subcmd ID | 0x8E | 2 | rw | 0 |  | 0：wire config<br>1:reversing_valve config<br>2:combine config<br>3:fan owner config |
| Reversing Valve | 0x8E | 1 | rw |  |  |  |
| Reversing Valve | 0x8E | 2 | rw | 1 |  | 0：Energize on Heat<br>1：Energize on Cool |
| Fan Owner | 0x8E | 1 | rw |  |  |  |
| Fan Owner | 0x8E | 2 | rw | 0 |  | 0：thermostat<br>1：hvac |
| Freeze Protection | 0x71 | 1 | rw |  |  |  |
| Sub-command | 0x71 | 2 | rw | 0 |  |  |
| Freeze Protection Enable | 0x71 | 2 | rw | 0 |  | 0：Disable<br>1：Enable |
| Protection Temperature | 0x71 | 3 | rw | 3 | 1 - 5 |  |

### Service

| CHANNEL |  ID  | LENGTH | READ/WRITE | DEFAULT | RANGE | ENUM |
| :------ | :--: | :----: | :--------: | :-----: | :---: | :--: |
| Retrieval(Point-in-Time) | 0xBA | 5 | w |  |  |  |
| Time Point | 0xBA | 5 | w |  |  |  |
| Time Synchronize | 0xB8 | 1 | w |  |  |  |
| System Status Control | 0x59 | 7 | w |  |  |  |
| System On/Off | 0x59 | 2 | w | 1 |  | 0：system off<br>1：system on |
| Temperature Control Mode | 0x59 | 2 | w | 0 |  | 0：heat<br>2：cool<br>3：auto<br>255：disable |
| Heat Temperature | 0x59 | 3 | w | 17 | 5 - 35 |  |
| Cool Temperature | 0x59 | 3 | w | 28 | 5 - 35 |  |

