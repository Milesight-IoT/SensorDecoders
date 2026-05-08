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
| Hardware Version | 0xDA | 3 | r |  |  |  |
| Firmware Version | 0xDA | 7 | r |  |  |  |
| Device Status | 0xC8 | 2 | rw | 1 |  | 0：Off<br>1：On |
| Bluetooth Status | 0xBA | 11 | r |  |  |  |
| Bluetooth Status | 0xBA | M | r |  |  |  |
| Index | 0xBA | 2 | r | 0 |  |  |
| Status | 0xBA | 2 | r | 0 |  | 0：unpair<br>1：paired<br>2：disconnected |
| Mac | 0xBA | 9 | r | 24e124123456789a |  |  |
| Relay Status Change | 0x01 | 2 | r |  |  |  |
| Y1 | 0x01 | 2 | r | 0 |  | 0: Disconnect<br>1: Close |
| W1 | 0x01 | 2 | r | 0 |  | 0: Disconnect<br>1: Close |
| O/B | 0x01 | 2 | r | 0 |  | 0: Disconnect<br>1: Close |
| GL | 0x01 | 2 | r | 0 |  | 0: Disconnect<br>1: Close |
| GM | 0x01 | 2 | r | 0 |  | 0: Disconnect<br>1: Close |
| GH | 0x01 | 2 | r | 0 |  | 0: Disconnect<br>1: Close |
| Reserved | 0x01 | 2 | r |  |  |  |
| Temperature | 0x06 | 3 | r |  | -20 - 60 |  |
| Humidity | 0x08 | 3 | r |  | 0 - 100 |  |
| Temperature Control Info | 0x0C | 2 | r |  |  |  |
| Temperature Control Status | 0x0C | 2 | r | 0 |  | 0：standby<br>1：stage-1 heat<br>2：stage-2 heat<br>3：stage-3 heat<br>4：stage-4 heat<br>5：stage-5 heat<br>7：stage-1 cool<br>8：stage-2 cool<br>9：stage-3 cool |
| Fan Info | 0x0D | 2 | r |  |  |  |
| Fan Status | 0x0D | 2 | r | 0 |  | 0：off<br>1：open<br>2：low<br>3:medium<br>4:high |
| Temperature Control Mode | 0x60 | 1 | rw |  |  |  |
| Sub-command | 0x60 | 2 | rw | 0 |  | 0：Mode<br>1：Plan Temperature Control<br>Mode Enable |
| Temperature Control Mode | 0x60 | 2 | rw | 0 |  | 0：heat<br>2：cool<br>3：auto |
| Plan Temperature Control 
Mode Enable | 0x60 | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Target Temperature Settings | 0x61 | 1 | rw |  |  |  |
| Temperature Control Mode | 0x61 | 2 | rw | 0 |  |  |
| Heat Temperature | 0x61 | 3 | rw | 17 | 5 - 35 |  |
| Cool Temperature | 0x61 | 3 | rw | 28 | 5 - 35 |  |
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
| Temperature Unit | 0x64 | 2 | rw | 0 |  | 0：℃<br>1：℉ |
| Reporting Interval | 0x66 | 1 | rw |  |  |  |
| Reporting Interval Type | 0x66 | 2 | rw | 0 |  | 0：BLE+LORA<br>1：POWERBUS+LORA |
| BLE_LORA Reporting Interval | 0x66 | 1 | rw |  |  |  |
| Reporting Interval Unit | 0x66 | 2 | rw | 1 |  | 0：second<br>1：min |
| Reporting Interval | 0x66 | 3 | rw | 10 | 1 - 1440 |  |
| POWERBUS_LORA Reporting Interval | 0x66 | 1 | rw |  |  |  |
| Reporting Interval Unit | 0x66 | 2 | rw | 1 |  | 0：second<br>1：min |
| Reporting Interval | 0x66 | 3 | rw | 10 | 1 - 1440 |  |
| System Switch | 0x6F | 2 | rw | 0 |  | 0：Switch Off<br>1：Switch On |
| Fan Settings | 0x70 | 1 | rw |  |  |  |
| Sub-command | 0x70 | 2 | rw | 0 |  |  |
| Fan Mode | 0x70 | 2 | rw | 0 |  | 0：Auto<br>1：Ventilation<br>2：Always Open<br>3：Low<br>4：Medium<br>5：High<br>255：Disabled |
| Adjust Humidity Enable | 0x70 | 2 | rw | 0 |  | 0：Disable<br>1：Enable |
| Adjust Humidity Period | 0x70 | 2 | rw | 30 | 5 - 55 |  |
| Circulate Work Time | 0x70 | 2 | rw | 30 | 5 - 55 |  |
| Anti Freezing | 0x71 | 1 | rw |  |  |  |
| Sub-command | 0x71 | 2 | rw | 0 |  |  |
| Enable | 0x71 | 2 | rw | 0 |  | 0：Disable<br>1：Enable |
| Target Temperature | 0x71 | 3 | rw | 3 | 1 - 5 |  |
| Dehumidify Settings | 0x72 | 1 | rw |  |  |  |
| Sub-command | 0x72 | 2 | rw | 2 |  |  |
| Humidify Low Threshold | 0x72 | 3 | rw | 40 | 0 - 100 |  |
| Humidify High Threshold | 0x72 | 3 | rw | 80 | 0 - 100 |  |
| Temperature Control Mode Enable | 0x75 | 2 | rw |  |  |  |
| Heat Mode | 0x75 | 2 | rw | 0 |  | 0：disable<br>1：enable |
| EM Heat Mode | 0x75 | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Cool Mode | 0x75 | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Auto Mode | 0x75 | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Dehumidify Mode | 0x75 | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Ventilate Mode | 0x75 | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Reserved | 0x75 | 2 | rw |  |  |  |
| Unilateral Tolerance Enable | 0x77 | 2 | rw | 0 |  | 0：Disable<br>1：Enable |
| Fan Delay Off Settings | 0x82 | 1 | rw |  |  |  |
| Sub-command | 0x82 | 2 | rw | 0 |  |  |
| Fan Delay Off Enable | 0x82 | 2 | rw | 1 |  | 0：Disable<br>1：Enable |
| Fan Delay Off Time | 0x82 | 3 | rw | 60 | 1 - 3600 |  |
| Temperature Control Level Switch | 0x83 | 1 | rw |  |  |  |
| Subcmd ID | 0x83 | 2 | rw | 0 |  |  |
| Setforw Enable | 0x83 | 2 | rw | 1 |  | 0：disable<br>1：enable |
| Setback Enable | 0x83 | 2 | rw | 1 |  | 0：disable<br>1：enable |
| Heat Switch Time | 0x83 | 2 | rw | 5 | 1 - 30 |  |
| Heat Switch Temp | 0x83 | 3 | rw | 1 | 0.5 - 5 |  |
| Cool Switch Time | 0x83 | 2 | rw | 5 | 1 - 30 |  |
| Cool Switch Temp | 0x83 | 3 | rw | 1 | 0.5 - 50 |  |
| level-1 Threshold | 0x83 | 3 | rw | 3 | 0 - 10 |  |
| level-2 Threshold | 0x83 | 3 | rw | 5 | 0 - 10 |  |
| Energy-Saving Enable | 0x84 | 2 | rw | 0 |  | 0：Disable<br>1：Enable |
| Energy-Saving Settings | 0x85 | 1 | rw |  |  |  |
| Energy-Saving Level | 0x85 | 2 | rw | 0 |  |  |
| Level 1 Settings | 0x85 | 1 | rw |  |  |  |
| Sub-command | 0x85 | 2 | rw | 0 |  |  |
| Enable | 0x85 | 2 | rw | 0 |  | 0：Disable<br>1：Enable |
| Free Time | 0x85 | 3 | rw | 480 | 1 - 1440 |  |
| Energy Saving Target Temperature Tolerance | 0x85 | 3 | rw | 2 | 0.1 - 5 |  |
| Level 2 Settings | 0x85 | 1 | rw |  |  |  |
| Sub-command | 0x85 | 2 | rw | 0 |  |  |
| Enable | 0x85 | 2 | rw | 0 |  | 0：Disable<br>1：Enable |
| Free Time | 0x85 | 3 | rw | 720 | 1 - 1440 |  |
| Energy Saving Target Temperature Tolerance | 0x85 | 3 | rw | 4 | 0.1 - 5 |  |
| Installation Settings | 0x8E | 5 | rw |  |  |  |
| Subcmd ID | 0x8E | 2 | rw | 0 |  | 0：wire config<br>1:reversing_valve config<br>2:combine config<br>3:fan owner config |
| Reversing Valve Mode | 0x8E | 1 | rw |  |  |  |
| Reversing Valve Mode | 0x8E | 2 | rw | 1 |  | 0：o/b on heat<br>1：o/b on cool |
| Fan Owner | 0x8E | 1 | rw |  |  |  |
| Fan Owner | 0x8E | 2 | rw | 0 |  | 0：thermostat<br>1：hvac |

### Service

| CHANNEL |  ID  | LENGTH | READ/WRITE | DEFAULT | RANGE | ENUM |
| :------ | :--: | :----: | :--------: | :-----: | :---: | :--: |
| Retrieval(Point-in-Time) | 0xBA | 5 | w |  |  |  |
| Time Point | 0xBA | 5 | w |  |  |  |
| Time Synchronize | 0xB8 | 1 | w |  |  |  |

