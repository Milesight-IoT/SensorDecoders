# UC701 Sensor

![UC701](uc701.png)

For more detailed information, please visit [Milesight Official Website](https://www.milesight.com/iot/product/lorawan-sensor/uc701)

## Payload Definition

### Attribute

| CHANNEL |  ID  | LENGTH | READ/WRITE | DEFAULT | RANGE | ENUM |
| :------ | :--: | :----: | :--------: | :-----: | :---: | :--: |
| LoRaWAN  Settings | 0xCF | 1 | rw |  |  |  |
| LoRaWAN Comand | 0xCF | 2 | rw |  |  |  |
| Device EUI | 0xCF | 9 | r |  |  |  |
| APP EUI | 0xCF | 9 | rw | 24e124c0002a0001 |  |  |
| Network ID | 0xCF | 4 | rw | 10203 |  |  |
| Application Port | 0xCF | 2 | rw | 85 | 1 - 223 |  |
| LoRaWAN Version | 0xCF | 2 | rw | 2 |  | 1：1.0.2<br>2：1.0.3<br>3：1.0.3<br>4：1.0.4 |
| LoRaWAN Work Mode | 0xCF | 2 | rw | 2 |  | 0:ClassA<br>1:ClassB<br>2:ClassC<br>3:ClassC to B |
| Confirmed Mode | 0xCF | 2 | rw | 0 |  | 0：disable<br>1：enable |
| ACK | 0xCF | 2 | rw | 1 | 1 - 15 |  |
| Join Type | 0xCF | 2 | rw | 1 |  | 0：ABP<br>1：OTAA |
| Application Key | 0xCF | 17 | w | 5572404c696e6b4c6f52613230313823 |  |  |
| Network Session Key | 0xCF | 17 | w | 5572404c696e6b4c6f52613230313823 |  |  |
| Application Session Key | 0xCF | 17 | w | 5572404c696e6b4c6f52613230313823 |  |  |
| Device Address | 0xCF | 5 | rw |  |  |  |
| Rejoin Mode  | 0xCF | 2 | rw | 1 |  | 0：disable<br>1：enable |
| Set the number of detection signals  sent | 0xCF | 2 | rw | 32 | 4 - 32 |  |
| Frequency Band | 0xCF | 2 | rw | 0 |  | 0：CN470<br>2：AS923<br>3：AU915<br>4：EU868<br>5：KR920<br>6：IN865<br>7：US915<br>10：RU864 |
| Channel Plan | 0xCF | 2 | rw | 0 |  | 0：AS923-1<br>1：AS923-2<br>2：AS923-3<br>3：AS923-4 |
| Channel Mask | 0xCF | 13 | rw | 00000000000000000000ff00 |  |  |
| Channel Settings | 0xCF | 8 | rw |  |  |  |
| Channel | 0xCF | 8 | rw |  |  |  |
| Number | 0xCF | 2 | rw | 1 | 1 - 8 |  |
| Enable | 0xCF | 2 | rw | 1 |  | 0：disable<br>1：enable |
| Frequency | 0xCF | 5 | rw | 868.3 |  |  |
| Max Data Rate | 0xCF | 2 | rw | 5 |  | 0：DR0(SF12<br>125kHz)<br>1：DR1(SF11<br>125kHz)<br>2：DR2(SF10<br>125kHz)<br>3：DR3(SF9<br>125kHz)<br>4：DR4(SF8<br>125kHz)<br>5：DR5(SF7<br>125kHz) |
| Min Data Rate | 0xCF | 2 | rw | 0 |  | 0：DR0(SF12<br>125kHz)<br>1：DR1(SF11<br>125kHz)<br>2：DR2(SF10<br>125kHz)<br>3：DR3(SF9<br>125kHz)<br>4：DR4(SF8<br>125kHz)<br>5：DR5(SF7<br>125kHz) |
| ADR Mode | 0xCF | 2 | rw | 1 |  | 0：disable<br>1：enable |
| TX Data Rate | 0xCF | 2 | rw | 2 |  | 0：DR0(SF12<br>125kHz)<br>1：DR1(SF11<br>125kHz)<br>2：DR2(SF10<br>125kHz)<br>3：DR3(SF9<br>125kHz)<br>4：DR4(SF8<br>125kHz)<br>5：DR5(SF7<br>125kHz) |
| TX Power | 0xCF | 2 | rw | 0 |  | 0：TXPOWER0-16dBm<br>1：TXPOWER1-14dBm<br>2：TXPOWER2-12dBm<br>3：TXPOWER3-10dBm<br>4：TXPOWER4-8dBm<br>5：TXPOWER5-6dBm<br>6：TXPOWER6-4dBm<br>7：TXPOWER7-2dBm |
| RX2 Data Rate | 0xCF | 2 | rw | 0 |  | 0：DR0(SF12<br>125kHz)<br>1：DR1(SF11<br>125kHz)<br>2：DR2(SF10<br>125kHz)<br>3：DR3(SF9<br>125kHz)<br>4：DR4(SF8<br>125kHz)<br>5：DR5(SF7<br>125kHz) |
| RX2 Frequency | 0xCF | 5 | rw | 869.525 |  |  |
| Ping Slot Periodicity | 0xCF | 2 | rw | 4 |  | 0：1s<br>1：2s<br>2：4s<br>3：8s<br>4：16s<br>5：32s<br>6：64s<br>7：128s |
| RX1 Open Delay Time | 0xCF | 5 | rw | 1 | 1 - 60 |  |
| RX2 Open Delay Time | 0xCF | 5 | rw | 2 | 1 - 60 |  |
| Join RX1 Open Delay Time | 0xCF | 5 | rw | 5 | 1 - 60 |  |
| Join RX2 Open Delay Time | 0xCF | 5 | rw | 6 | 1 - 60 |  |
| Multicast Group Settings | 0xCF | 1 | rw |  |  |  |
| Multicast Comand | 0xCF | 2 | rw |  |  |  |
| Multicast Group 1 Enable | 0xCF | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Multicast Address | 0xCF | 5 | rw | 11111111 |  |  |
| McAppSKey | 0xCF | 17 | w | 5572404c696e6b4c6f52613230313823 |  |  |
| McNetSKey | 0xCF | 17 | w | 5572404c696e6b4c6f52613230313823 |  |  |
| Multicast Ping Slot Periodicity | 0xCF | 2 | rw | 2 |  | 0：1s<br>1：2s<br>2：4s<br>3：8s<br>4：16s<br>5：32s<br>6：64s<br>7：128s |
| Multicast Data Rate | 0xCF | 2 | rw | 2 |  | 0：DR0(SF12<br>125kHz)<br>1：DR1(SF11<br>125kHz)<br>2：DR2(SF10<br>125kHz)<br>3：DR3(SF9<br>125kHz)<br>4：DR4(SF8<br>125kHz)<br>5：DR5(SF7<br>125kHz) |
| Multicast Frequency | 0xCF | 5 | rw | 869.525 |  |  |
| Multicast Group 2 Enable | 0xCF | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Multicast Address | 0xCF | 5 | rw | 22222222 |  |  |
| McAppSKey | 0xCF | 17 | w | 5572404c696e6b4c6f52613230313824 |  |  |
| McNetSKey | 0xCF | 17 | w | 5572404c696e6b4c6f52613230313824 |  |  |
| Ping Slot Periodicity | 0xCF | 2 | rw | 2 |  | 0：1s<br>1：2s<br>2：4s<br>3：8s<br>4：16s<br>5：32s<br>6：64s<br>7：128s |
| Multicast Data Rate | 0xCF | 2 | rw | 2 |  | 0：DR0(SF12<br>125kHz)<br>1：DR1(SF11<br>125kHz)<br>2：DR2(SF10<br>125kHz)<br>3：DR3(SF9<br>125kHz)<br>4：DR4(SF8<br>125kHz)<br>5：DR5(SF7<br>125kHz) |
| Multicast Frequency | 0xCF | 5 | rw | 869.525 |  |  |
| Multicast Group 3 Enable | 0xCF | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Multicast Address | 0xCF | 5 | rw | 33333333 |  |  |
| McAppSKey | 0xCF | 17 | w | 5572404c696e6b4c6f52613230313825 |  |  |
| McNetSKey | 0xCF | 17 | w | 5572404c696e6b4c6f52613230313825 |  |  |
| Ping Slot Periodicity | 0xCF | 2 | rw | 2 |  | 0：1s<br>1：2s<br>2：4s<br>3：8s<br>4：16s<br>5：32s<br>6：64s<br>7：128s |
| Multicast Data Rate | 0xCF | 2 | rw | 2 |  | 0：DR0(SF12<br>125kHz)<br>1：DR1(SF11<br>125kHz)<br>2：DR2(SF10<br>125kHz)<br>3：DR3(SF9<br>125kHz)<br>4：DR4(SF8<br>125kHz)<br>5：DR5(SF7<br>125kHz) |
| Multicast Frequency | 0xCF | 5 | rw | 869.525 |  |  |
| Multicast Group 4 Enable | 0xCF | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Multicast Address | 0xCF | 5 | rw | 44444444 |  |  |
| McAppSKey | 0xCF | 17 | w | 5572404c696e6b4c6f52613230313826 |  |  |
| McNetSKey | 0xCF | 17 | w | 5572404c696e6b4c6f52613230313826 |  |  |
| Ping Slot Periodicity | 0xCF | 2 | rw | 2 |  | 0：1s<br>1：2s<br>2：4s<br>3：8s<br>4：16s<br>5：32s<br>6：64s<br>7：128s |
| Multicast Data Rate | 0xCF | 2 | rw | 2 |  | 0：DR0(SF12<br>125kHz)<br>1：DR1(SF11<br>125kHz)<br>2：DR2(SF10<br>125kHz)<br>3：DR3(SF9<br>125kHz)<br>4：DR4(SF8<br>125kHz)<br>5：DR5(SF7<br>125kHz) |
| Multicast Frequency | 0xCF | 5 | rw | 869.525 |  |  |
| Duty Cycle Enable | 0xCF | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Duty cycle | 0xCF | 5 | rw | 0 |  |  |
| Product Name | 0xDE | 33 | rw |  |  |  |
| PN | 0xDD | 33 | rw |  |  |  |
| SN | 0xDB | 9 | r |  |  |  |
| OEM ID | 0xD9 | 3 | rw |  |  |  |
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
| BLE Phone Name | 0xD5 | 1 | rw |  |  |  |
|  Name Length | 0xD5 | 2 | rw | 6 | 1 - 64 |  |
| Phone Name | 0xD5 | 1 | rw | 123456 |  |  |
| BLE Settings | 0xCD | 1 | rw |  |  |  |
| BLE Command | 0xCD | 2 | rw | 0 |  |  |
| Bluetooth Enable | 0xCD | 2 | rw | 1 |  | 0：disable<br>1：enable |
| Device Bluetooth Address | 0xCD | 8 | r |  |  |  |
| Address Type | 0xCD | 2 | r | 0 |  | 0：public<br>1：private |
| Bluetooth Mac Address | 0xCD | 7 | r | 24e124123456 |  |  |
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
| ID | 0xCD | 2 | rw | 0 |  |  |
| Name Length | 0xCD | 2 | rw | 13 | 1 - 13 |  |
| Bluetooth Name | 0xCD | 1 | rw |  |  |  |
| Paired Device | 0xCD | 1 | rw |  |  |  |
| Paired Device | 0xCD | 10 | rw |  |  |  |
| ID | 0xCD | 2 | rw | 0 |  |  |
| DevEUI | 0xCD | 9 | rw | 24e124123456789a |  |  |
| Paired Device Bluetooth Mac Address | 0xCD | 1 | rw |  |  |  |
| Paired Device Bluetooth Mac Address  | 0xCD | 9 | rw |  |  |  |
| ID | 0xCD | 2 | rw | 0 |  |  |
| Address Type | 0xCD | 2 | rw | 0 |  | 0：public<br>1：private |
| Bluetooth Mac Address | 0xCD | 7 | rw | 24e124123456 |  |  |
| Paired Device Bluetooth Information | 0xCD | 1 | rw |  |  |  |
| Address Type | 0xCD | 2 | rw | 0 |  | 0：public<br>1：private |
| Mac Address | 0xCD | 7 | rw | 24e124123456 |  |  |
| DevEUI | 0xCD | 9 | rw | 24e124123456789a |  |  |
| Name Length | 0xCD | 2 | rw | 13 | 1 - 13 |  |
| Bluetooth Name | 0xCD | 1 | rw |  |  |  |
| Battery | 0x00 | 2 | r |  | 0 - 100 |  |
| Infrared Command Status | 0x04 | 5 | r |  |  |  |
| Infrared Command | 0x04 | 3 | r |  |  |  |
| Switch | 0x04 | 2 | r |  |  | 0: Switch Off<br>1: Switch On |
| Mode | 0x04 | 2 | r |  |  | 0：heat<br>1：em heat<br>2：cool<br>3：auto<br>4：dehumidify<br>5：ventilation |
| Fan Mode | 0x04 | 2 | r |  |  | 0：Auto<br>1：Ventilation<br>2：Always Open<br>3：Low<br>4：Medium<br>5：High<br>255：Disabled |
| Command Type | 0x04 | 2 | r |  |  | 0: Command<br>1: Local |
| Control Word | 0x04 | 2 | r |  |  |  |
| Infrared Command Valid | 0x04 | 2 | r |  |  | 0: Command Invalid<br>1: Command Valid |
| Infrared Command Available | 0x04 | 2 | r |  |  | 0: Command unavailable<br>1: Command available |
| Reserved | 0x04 | 2 | r |  |  |  |
| Target Temperature | 0x04 | 3 | r |  | 16 - 30 |  |
| Running State | 0x05 | 1 | r |  |  |  |
| Data Source | 0x05 | 2 | r |  |  |  |
| Infrared Command | 0x05 | 2 | r |  |  |  |
| Switch State | 0x05 | 2 | r |  |  | 0: Switch Off<br>1: Switch On |
| Current Transformer | 0x05 | 5 | r |  |  |  |
| Current | 0x05 | 5 | r |  | 0 - 30 |  |
| Internal Temperature | 0x06 | 3 | r |  | -20 - 60 |  |
| External Temperature | 0x07 | 3 | r |  | -20 - 60 |  |
| Humidity | 0x08 | 3 | r |  | 0 - 100 |  |
| Random key | 0xC9 | 2 | rw | 0 |  | 0：Disable<br>1：Enable |
| Auto-P | 0xC4 | 2 | rw | 1 |  | 0：Disable<br>1：Enable |
| Data Storage Settings | 0xC5 | 1 | rw |  |  |  |
| Sub-command | 0xC5 | 2 | rw | 0 |  |  |
| Data Storage Enable | 0xC5 | 2 | rw | 1 |  | 0：Disable<br>1：Enable |
| Data Retransmission Enable | 0xC5 | 2 | rw | 1 |  | 0：Disable<br>1：Enable |
| Data Retransmission Interval | 0xC5 | 3 | rw | 600 | 30 - 1200 |  |
| Data Retrieval Interval | 0xC5 | 3 | rw | 60 | 30 - 1200 |  |
| Temperature Control Mode | 0x60 | 1 | rw |  |  |  |
| Sub-command | 0x60 | 2 | rw | 0 |  | 0：Mode<br>1：Plan Temperature Control<br>Mode Enable |
| Mode | 0x60 | 2 | rw | 2 |  | 0：heat<br>2：cool<br>3：auto<br>4：dehumidify<br>5：ventilation |
| Plan Temperature Control Mode Enable | 0x60 | 2 | rw | 1 |  | 0：disable<br>1：enable |
| Target Temperature Settings | 0x61 | 1 | rw |  |  |  |
| Temperature Control Mode | 0x61 | 2 | rw | 0 |  |  |
| Heat Target Temperature | 0x61 | 3 | rw | 17 | 16 - 30 |  |
| Cool Target Temperature | 0x61 | 3 | rw | 28 | 16 - 30 |  |
| Auto Target Temperature | 0x61 | 3 | rw | 23 | 16 - 30 |  |
| Target Temperature Tolerance | 0x62 | 1 | rw |  |  |  |
| Target Temperature Tolerance ID | 0x62 | 2 | rw | 0 |  |  |
| Target Temperature Tolerance Value | 0x62 | 3 | rw | 1 | 0.1 - 5 |  |
| Temperature Unit | 0x64 | 2 | rw | 0 |  | 0：℃<br>1：℉ |
| Target Temperature Resolution | 0x65 | 2 | rw | 1 |  | 0：0.5<br>1：1 |
| Communication Mode | 0x91 | 2 | rw | 0 |  | 0：BLE+Lorawan |
| Reporting Interval | 0x66 | 1 | rw |  |  |  |
| Reporting Interval Type | 0x66 | 2 | rw | 0 |  | 0：BLE+LORA |
| BLE_LORA Reporting Interval | 0x66 | 1 | rw |  |  |  |
| Reporting Interval Unit | 0x66 | 2 | rw | 1 |  | 0：second<br>1：min |
| Reporting Interval | 0x66 | 3 | rw | 600 | 60 - 64800 |  |
| Reporting Interval | 0x66 | 3 | rw | 10 | 1 - 1440 |  |
| Open Window Detection | 0x68 | 1 | rw |  |  |  |
| Sub-command | 0x68 | 2 | rw | 0 |  |  |
| Enable | 0x68 | 2 | rw | 0 |  | 0：Disable<br>1：Enable |
| Temperature Change | 0x68 | 3 | rw | 3 | 1 - 20 |  |
| Stop Temperature Control For | 0x68 | 3 | rw | 30 | 1 - 1440 |  |
| Temperature Data Source Settings | 0x6A | 1 | rw |  |  |  |
| Sub-command | 0x6A | 2 | rw | 0 |  |  |
| Data Source | 0x6A | 2 | rw | 4 |  | 0: External Temperature Sensor<br>4: Internal Temperature Sensor |
| AC On/Off | 0x6F | 2 | rw | 0 |  | 0：Switch Off<br>1：Switch On |
| Fan Settings | 0x70 | 1 | rw |  |  |  |
| Sub-command | 0x70 | 2 | rw | 0 |  |  |
| Fan Mode | 0x70 | 2 | rw | 0 |  | 0：Auto<br>1：Ventilation<br>2：Always Open<br>3：Low<br>4：Medium<br>5：High |
| Temperature Control Mode Enable | 0x75 | 2 | rw |  |  |  |
| Heat Mode | 0x75 | 2 | rw | 1 |  | 0：disable<br>1：enable |
| EM Heat Mode | 0x75 | 2 | rw | 1 |  | 0：disable<br>1：enable |
| Cool Mode | 0x75 | 2 | rw | 1 |  | 0：disable<br>1：enable |
| Auto Mode | 0x75 | 2 | rw | 1 |  | 0：disable<br>1：enable |
| Dehumidify Mode | 0x75 | 2 | rw | 1 |  | 0：disable<br>1：enable |
| Ventilation Mode | 0x75 | 2 | rw | 1 |  | 0：disable<br>1：enable |
| Reserved | 0x75 | 2 | rw |  |  |  |
| Indicator Light Disable Settings | 0x80 | 1 | rw |  |  |  |
| Sub-command | 0x80 | 2 | rw | 0 |  |  |
| Enable | 0x80 | 2 | rw | 1 |  | 0：disable<br>1：enable |
| Time | 0x80 | 3 | rw | 600 | 600 - 3600 |  |
| Enhanced Infrared Emission Power | 0x81 | 2 | rw | 0 |  | 0：Disable<br>1：Enable |
| Air Conditioning Power Setting | 0x82 | 1 | rw |  |  |  |
| Sub-command | 0x82 | 2 | rw | 0 |  |  |
| Refrigeration Power | 0x82 | 3 | rw | 0 | 0 - 60000 |  |
| Heating Power | 0x82 | 3 | rw | 0 | 0 - 60000 |  |
| Temperature Limit Task Settings | 0x83 | 1 | rw |  |  |  |
| Task Settings | 0x83 | 1 | rw |  |  |  |
| Task ID | 0x83 | 2 | rw | 0 | 0 - 0 |  |
| Sub-command | 0x83 | 2 | rw | 0 |  |  |
| Task Enable | 0x83 | 2 | rw | 0 |  | 0：Disable<br>1：Enable |
| Task Date | 0x83 | 5 | rw |  |  |  |
| Task Start Month | 0x83 | 2 | rw | 1 | 1 - 12 |  |
| Task Start Day | 0x83 | 2 | rw | 1 | 1 - 31 |  |
| Task End Month | 0x83 | 2 | rw | 12 | 1 - 12 |  |
| Task End Day | 0x83 | 2 | rw | 31 | 1 - 31 |  |
| Execution Period | 0x83 | 5 | rw |  |  |  |
| Start Minute | 0x83 | 3 | rw | 0 |  |  |
| End Minute | 0x83 | 3 | rw | 1439 |  |  |
| Week | 0x83 | 2 | rw |  |  |  |
| Sun. | 0x83 | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Mon. | 0x83 | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Tues. | 0x83 | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Wed. | 0x83 | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Thur. | 0x83 | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Fri. | 0x83 | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Sat. | 0x83 | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Reserved | 0x83 | 2 | rw |  |  |  |
| Low Temperature Threshold | 0x83 | 3 | rw | 5 | 5 - 35 |  |
| High Temperature Threshold | 0x83 | 3 | rw | 35 | 5 - 35 |  |
| Vacation Task Settings | 0x85 | 1 | rw |  |  |  |
| Task Settings | 0x85 | 1 | rw |  |  |  |
| Task ID | 0x85 | 2 | rw | 0 | 0 - 7 |  |
| Sub-command | 0x85 | 2 | rw | 0 |  |  |
| Task Enable | 0x85 | 2 | rw | 0 |  | 0：Disable<br>1：Enable |
| Task Date | 0x85 | 5 | rw |  |  |  |
| Task Start Month | 0x85 | 2 | rw | 1 | 1 - 12 |  |
| Task Start Day | 0x85 | 2 | rw | 1 | 1 - 31 |  |
| Task End Month | 0x85 | 2 | rw | 12 | 1 - 12 |  |
| Task End Day | 0x85 | 2 | rw | 31 | 1 - 31 |  |
| Execution Period | 0x85 | 5 | rw |  |  |  |
| Start Minute | 0x85 | 3 | rw | 0 |  |  |
| End Minute | 0x85 | 3 | rw | 1439 |  |  |
| Week | 0x85 | 2 | rw |  |  |  |
| Sun. | 0x85 | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Mon. | 0x85 | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Tues. | 0x85 | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Wed. | 0x85 | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Thur. | 0x85 | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Fri. | 0x85 | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Sat. | 0x85 | 2 | rw | 0 |  | 0：disable<br>1：enable |
| Reserved | 0x85 | 2 | rw |  |  |  |
| Ir Command | 0x85 | 2 | rw | 255 |  | 0：Schedule1<br>1：Schedule2<br>2：Schedule3<br>3：Schedule4<br>4：Schedule5<br>5：Schedule6<br>6：Schedule7<br>7：Schedule8<br>8：Schedule9<br>9：Schedule10<br>10：Schedule11<br>11：Schedule12<br>12：Schedule13<br>13：Schedule14<br>14：Schedule15<br>15：Schedule16<br>255：Not Chosen |
| Infrared Learn | 0x86 | 1 | rw |  |  |  |
| Sub-command | 0x86 | 2 | rw | 0 |  |  |
| Learn Status | 0x86 | 2 | r | 0 |  | 0: Non learning state<br>1: During a learning session<br>2: In secondary learning (requires secondary learning+or - key)<br>3: In secondary learning (requires secondary learning mode key)<br>4: In secondary learning (requires secondary learning of wind keys)<br>5: Learning failure (timeout failure)<br>6: Learning failed (code library matching failed)<br>7: Success in Learning (One Study)<br>8: Learning success (secondary learning) |
| Findnext Max | 0x86 | 2 | r | 1 | 1 - 20 |  |
| Findnext | 0x86 | 2 | rw | 1 | 1 - 20 |  |
| Predefine Brand | 0x86 | 2 | rw | 0 |  | 0: NONE<br>1: XIAOMI/TCL<br>2: SHINCO/SAMSUNG/ELECTROLUX<br>3: RSD/MCQUAY/TICA<br>4: WHIRLPOOL/BOSCH/AIRWELL<br>5: FUJITSU/McQUAY<br>6: TRUMA |
| Infrared Package Status | 0x86 | 2 | r | 0 |  | 0: No infrared format packet<br>1: Infrared format package already exists |
| Internal Temperature Sensor Setting | 0x88 | 1 | rw |  |  |  |
| Sub-command | 0x88 | 2 | rw | 0 |  |  |
| Name(prefix6) | 0x88 | 7 | rw | built- |  |  |
| Name(infix6) | 0x88 | 7 | rw | in sen |  |  |
| Name(suffix6) | 0x88 | 7 | rw | sor |  |  |
| Collect Period | 0x88 | 3 | rw | 30 | 30 - 3600 |  |
| Temperature Calibration Value | 0x88 | 3 | rw | 0 | -80 - 80 |  |
| Humidity Calibration Value | 0x88 | 3 | rw | 0 | -100 - 100 |  |
| External Temperature Sensor Setting | 0x89 | 1 | rw |  |  |  |
| Sub-command | 0x89 | 2 | rw | 0 |  |  |
| Sensor Enable | 0x89 | 2 | rw | 0 |  | 0：Disable<br>1：Enable |
| Name(prefix6) | 0x89 | 7 | rw | extern |  |  |
| Name(infix6) | 0x89 | 7 | rw | al sen |  |  |
| Name(suffix6) | 0x89 | 7 | rw | sor |  |  |
| Temperature Calibration Value | 0x89 | 3 | rw | 0 | -80 - 80 |  |
| CT Sensor Setting | 0x8A | 1 | rw |  |  |  |
| Sub-command | 0x8A | 2 | rw | 0 |  |  |
| Connection Config | 0x8A | 2 | rw | 0 |  | 0：Disconnected<br>1：Connected |
| Collect Period | 0x8A | 3 | rw | 5 | 1 - 128 |  |
| Collect threshold | 0x8A | 3 | rw | 100 | 30 - 1000 |  |
| AC Type | 0x8A | 2 | rw | 0 |  | 0: Wall mounted machine<br>1: Vertical cabinet machine<br>2: Ceiling machine |
| Filter Clean Reminder Setting | 0x8B | 1 | rw |  |  |  |
| Sub-command | 0x8B | 2 | rw | 0 |  |  |
| Filter Clean Reminder Enable | 0x8B | 2 | rw | 0 |  | 0：Disable<br>1：Enable |
| Reminder Period | 0x8B | 3 | rw | 90 | 1 - 730 |  |
| Infrared Format Code | 0x8E | 1 | rw |  |  |  |
| Offset | 0x8E | 2 | rw | 0 |  |  |
| Data Length | 0x8E | 2 | rw | 186 | 0 - 255 |  |
| Format Code Data | 0x8E | 1 | rw |  |  |  |
| BLE Broadcast Duration Settings | 0x90 | 1 | rw |  |  |  |
| Sub-command | 0x90 | 2 | rw | 0 |  |  |
| Broadcast Duration Control Enable | 0x90 | 2 | rw | 1 |  | 0：Disable<br>1：Enable |
| BLE Broadcast Duration | 0x90 | 2 | rw | 1 | 1 - 10 |  |
| Battery Enable | 0x92 | 2 | rw | 0 |  | 0：Disable<br>1：Enable |
| Dormant Settings | 0x93 | 1 | rw |  |  |  |
| Dormant Settings | 0x93 | 1 | rw |  |  |  |
| Dormant ID | 0x93 | 2 | rw | 0 | 0 - 1 |  |
| Sub-command | 0x93 | 2 | rw | 0 |  |  |
| Dormant Enable | 0x93 | 2 | rw | 0 |  | 0：Disable<br>1：Enable |
| Dormant Date | 0x93 | 5 | rw |  |  |  |
| Dormant Start Month | 0x93 | 2 | rw | 1 | 1 - 12 |  |
| Dormant Start Day | 0x93 | 2 | rw | 1 | 1 - 31 |  |
| Dormant End Month | 0x93 | 2 | rw | 12 | 1 - 12 |  |
| Dormant End Day | 0x93 | 2 | rw | 31 | 1 - 31 |  |

### Event

| CHANNEL |  ID  | LENGTH | READ/WRITE | DEFAULT | RANGE | ENUM |
| :------ | :--: | :----: | :--------: | :-----: | :---: | :--: |
| Sequence Number Check Response | 0xFF | 2 | r |  |  |  |
| Order Check Response | 0xFE | 2 | r |  |  |  |
| Password Change Response | 0xFC | 2 | r |  |  |  |
| Password Change Response | 0xFA | 2 | r |  |  |  |
| Firmware Upgrade Response | 0xF7 | 1 | r |  |  |  |
| Historical Data | 0xED | 6 | r |  |  |  |
| LoRaWAN Status | 0xBF | 1 | r |  |  |  |
| Device Time | 0xB9 | M | r |  |  |  |
| Battery Status | 0xB8 | M | r |  |  |  |
| Low Battery Alarm | 0x01 | 2 | r |  |  |  |
| Temperature  Alarm | 0x02 | 1 | r |  |  |  |
| Sensor Alarm | 0x03 | 1 | r |  |  |  |
| Filter Clean Remind | 0x09 | 5 | r |  |  |  |
| Command Temperature Limit Alarm | 0x0A | 1 | r |  |  |  |
| Local Temperature Limit Alarm | 0x0B | 1 | r |  |  |  |
| Data Passthrough | 0x30 | 1 | r |  |  |  |

### Service

| CHANNEL |  ID  | LENGTH | READ/WRITE | DEFAULT | RANGE | ENUM |
| :------ | :--: | :----: | :--------: | :-----: | :---: | :--: |
| Sequence Number Check | 0xFF | 2 | w |  |  |  |
| Sequence Number | 0xFF | 2 | w | 0 | 0 - 255 |  |
| Sequence Number | 0xFF | 2 | r | 0 | 0 - 255 |  |
| Order Check | 0xFE | 2 | w |  |  |  |
| Order | 0xFE | 2 | w | 0 | 0 - 255 |  |
| Order | 0xFE | 2 | r | 0 | 0 - 255 |  |
| Password Change | 0xFC | 1 | w |  |  |  |
| Password Length | 0xFC | 2 | w | 6 | 0 - 255 |  |
| Password | 0xFC | 1 | w | 123456 |  |  |
| Change Result | 0xFC | 2 | r | 0 |  | 0：success<br>1：failed<br>2：length error |
| Password Change | 0xFA | 7 | w |  |  |  |
| Password | 0xFA | 7 | w | 123456 |  |  |
| Result | 0xFA | 2 | r | 0 |  | 0：success<br>1：failed |
| Firmware Upgrade Request | 0xF7 | 1 | w |  |  |  |
| Firmware Upgrade Subcommand | 0xF7 | 2 | w |  |  |  |
| Firmware Upgrade Request | 0xF7 | 1 | w |  |  |  |
| Firmware Upgrade Request Type | 0xF7 | 2 | w | 0 |  | 0：all<br>1：diff<br>2：module |
| Firmware Upgrade Request Length | 0xF7 | 2 | w | 68 | 0 - 255 |  |
| Firmware Upgrade Request Check Data | 0xF7 | 1 | w |  |  |  |
| Firmware Transmission | 0xF7 | 1 | w |  |  |  |
| Transmission Length | 0xF7 | 3 | w | 1 | 1 - 65535 |  |
| Firmware Content | 0xF7 | 1 | w |  |  |  |
| Firmware Upgrade End | 0xF7 | 1 | w |  |  |  |
| Firmware Upgrade Continue | 0xF7 | 1 | w |  |  |  |
| Firmware Upgrade End Check | 0xF7 | 1 | w |  |  |  |
| Transmission Length | 0xF7 | 3 | w | 1 | 1 - 65535 |  |
| Check Content | 0xF7 | 1 | w |  |  |  |
| Firmware Upgrade Response Subcommand | 0xF7 | 2 | r |  |  |  |
| Firmware Upgrade Request Response | 0xF7 | 4 | r |  |  |  |
| Firmware Upgrade Request Response | 0xF7 | 2 | r | 0 |  | 0：success<br>1：failed<br>2：resend |
| Firmware Upgrade Maximum Transmission Length | 0xF7 | 3 | r | 1 | 1 - 65535 |  |
| Firmware Transmission Response | 0xF7 | 2 | r |  |  |  |
| Firmware Transmission Response | 0xF7 | 2 | r | 0 |  | 0：success<br>1：failed |
| Firmware Upgrade End Response | 0xF7 | 2 | r |  |  |  |
| Firmware Upgrade End Response | 0xF7 | 2 | r | 0 |  | 0：success<br>1：failed |
| Firmware Upgrade Continue Response | 0xF7 | 2 | r |  |  |  |
| Firmware Upgrade Continue Response | 0xF7 | 2 | r | 0 |  | 0：success<br>1：failed |
| Firmware Upgrade End Check Response | 0xF7 | 2 | r |  |  |  |
| Firmware Upgrade End Check Response | 0xF7 | 2 | r | 0 |  | 0：success<br>1：failed |
| Command Queries | 0xEF | 1 | w |  |  |  |
| Query Information | 0xEF | 2 | w |  |  |  |
| Command Length | 0xEF | 2 | w | 1 | 1 - 15 |  |
| Queried Command | 0xEF | 1 | w |  |  |  |
| Historical Data Mode | 0xED | 2 | r |  |  | 0：target time<br>1：historical time |
| Historical Data Timestamps | 0xED | 5 | r |  |  |  |
| OTA Update | 0xEC | 1 | w |  |  |  |
| Firmware List | 0xEC | 1 | w |  |  |  |
| Firmware Item | 0xEC | 1 | w |  |  |  |
| Original Version | 0xEC | 3 | w |  |  |  |
| Target Version | 0xEC | 3 | w |  |  |  |
| File Size | 0xEC | 3 | w | 0 |  |  |
| CRC Check Value | 0xEC | 5 | w | 0 |  |  |
| URL Length | 0xEC | 2 | w | 0 |  |  |
| URL | 0xEC | 161 | w |  |  |  |
| AT Debug | 0xEB | 1 | rw |  |  |  |
| Command Length | 0xEB | 3 | rw | 1 | 1 - 65535 |  |
| Command Content | 0xEB | 1 | rw |  |  |  |
| LoRaWAN Status | 0xBF | 2 | r |  |  |  |
| Join Status | 0xBF | 2 | r |  |  | 0：Not Joined<br>1：Joined |
| Device EUI | 0xBF | 9 | r |  |  |  |
| Signal | 0xBF | 4 | r |  |  |  |
| Signal Strength | 0xBF | 3 | r |  |  |  |
| SNR | 0xBF | 2 | r |  |  |  |
| Channel Mask | 0xBF | 13 | r |  |  |  |
| Frame Counter | 0xBF | 9 | r |  |  |  |
| Uplink Frame Counter | 0xBF | 5 | r | 0 | 0 - 4294967295 |  |
| Downlink Frame Counter | 0xBF | 5 | r | 0 | 0 - 4294967295 |  |
| Reset | 0xBF | 1 | w |  |  |  |
| Current Time | 0xB9 | 5 | r |  |  |  |
| Operation Time | 0xB9 | 5 | r |  |  |  |
| Power-On Time | 0xB9 | 5 | r |  |  |  |
| Device Status Query | 0xB9 | 1 | w |  |  |  |
| Battery Capacity | 0xB8 | 5 | r |  |  |  |
| Battery Drain | 0xB8 | 5 | r |  |  |  |
| Current Battery | 0xB8 | 5 | r |  |  |  |
| Battery Voltage | 0xB8 | 3 | r |  |  |  |
| Current Battery Status | 0xB8 | 3 | r |  |  |  |
| Time Synchronize | 0xB8 | 1 | w |  |  |  |
| BLE Server | 0xB4 | 1 | w |  |  |  |
| BLE Server | 0xB4 | 2 | w | 0 |  | 0：Reset BLE Name<br>1：Cancel Pairing |
| Battery | 0x01 | 2 | r |  | 0 - 100 |  |
| Alarm Type | 0x02 | 2 | r |  |  |  |
| Open Window Alarm Released | 0x02 | 3 | r |  |  |  |
| Temperature | 0x02 | 3 | r |  | -20 - 60 |  |
| Open Window Alarm | 0x02 | 3 | r |  |  |  |
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
| Temperature Below Above Alarm | 0x02 | 3 | r |  |  |  |
| Temperature | 0x02 | 3 | r |  | -20 - 60 |  |
| Temperature Below Above Alarm Released | 0x02 | 3 | r |  |  |  |
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
| Internal Sensor Collect Error | 0x03 | 1 | r |  |  |  |
| External Sensor Collect Error | 0x03 | 1 | r |  |  |  |
| Humidity Sensor Collect Error | 0x03 | 1 | r |  |  |  |
| Internal Sensor Out of The Low Range | 0x03 | 1 | r |  |  |  |
| External Sensor Out of The Low Range | 0x03 | 1 | r |  |  |  |
| Humidity Out of The Low Range | 0x03 | 1 | r |  |  |  |
| Internal Sensor Out of The High Range | 0x03 | 1 | r |  |  |  |
| External Sensor Out of The High Range | 0x03 | 1 | r |  |  |  |
| Humidity Out of The High Range | 0x03 | 1 | r |  |  |  |
| Usage Time | 0x09 | 5 | r |  |  |  |
| Alarm Type | 0x0A | 2 | r |  |  |  |
| Temperature Below Alarm | 0x0A | 7 | r |  |  |  |
| Low Threshold | 0x0A | 3 | r |  | 5 - 35 |  |
| High Threshold | 0x0A | 3 | r |  | 5 - 35 |  |
| Ambient Temperature | 0x0A | 3 | r |  | -20 - 60 |  |
| Temperature Above Alarm | 0x0A | 7 | r |  |  |  |
| Low Threshold | 0x0A | 3 | r |  | 5 - 35 |  |
| High Threshold | 0x0A | 3 | r |  | 5 - 35 |  |
| Ambient Temperature | 0x0A | 3 | r |  | -20 - 60 |  |
| Alarm Type | 0x0B | 2 | r |  |  |  |
| Temperature Below Alarm | 0x0B | 7 | r |  |  |  |
| Low Threshold | 0x0B | 3 | r |  | 5 - 35 |  |
| High Threshold | 0x0B | 3 | r |  | 5 - 35 |  |
| Ambient Temperature | 0x0B | 3 | r |  | -20 - 60 |  |
| Temperature Above Alarm | 0x0B | 7 | r |  |  |  |
| Low Threshold | 0x0B | 3 | r |  | 5 - 35 |  |
| High Threshold | 0x0B | 3 | r |  | 5 - 35 |  |
| Ambient Temperature | 0x0B | 3 | r |  | -20 - 60 |  |
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
| Network Reconnection | 0xB6 | 1 | w |  |  |  |
| Time Synchronize | 0xB7 | 5 | w |  |  |  |
| Timestamp | 0xB7 | 5 | w |  |  |  |
| Data Collection | 0xB5 | 1 | w |  |  |  |
| Clear Data | 0xBD | 1 | w |  |  |  |
| Stop Retrieval | 0xBC | 1 | w |  |  |  |
| Retrieval(Periods of Time) | 0xBB | 9 | w |  |  |  |
| Start Time | 0xBB | 5 | w |  |  |  |
| End Time | 0xBB | 5 | w |  |  |  |
| Retrieval(Point-in-Time) | 0xBA | 5 | w |  |  |  |
| Time Point | 0xBA | 5 | w |  |  |  |
| Reboot | 0xBE | 1 | w |  |  |  |
| Filter Clean Remainder Alarm | 0x5B | 2 | w |  |  |  |
| Action | 0x5B | 2 | w | 0 |  | 0：clean alarm<br>1：report alarm |
| Open Window Alarm | 0x5A | 2 | w |  |  |  |
| Action | 0x5A | 2 | w | 0 |  | 0：clean alarm<br>1：report alarm |
| Clear Infrared Format Code | 0x59 | 1 | w |  |  |  |
| Delete Temperature Limit Task | 0x58 | 2 | w |  |  |  |
| Delete Temperature Limit Task | 0x58 | 2 | w | 0 |  | 0：Task1 |
| Delete Vacation Task | 0x56 | 2 | w |  |  |  |
| Delete Vacation Task | 0x56 | 2 | w | 255 |  | 0：Task1<br>1：Task2<br>2：Task3<br>3：Task4<br>4：Task5<br>5：Task6<br>6：Task7<br>7：Task8<br>255：All |
| Trigger Infrared Learning | 0x55 | 1 | w |  |  |  |

