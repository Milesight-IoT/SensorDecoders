#Function to parse the Payload, typedata is the digits designing the data, size the length of the value to retrieve
def decode_payload(payload, typedata , size):
    
    position=payload.find(typedata)
    
    if position==-1:
        return None

    index =position + len(typedata) # len(obj) 
    data = payload[index:index+(size*2)]
    chunks = [data[i-2:i]for i in range(len(data),0, -2)]
    result=""
    for hex in chunks:
        result+=hex
    return result


#Function to retrieve all the values of the Sensor
def data_payload(payload):
    if len(payload)<56:

        return None

    battery=decode_payload(payload,"0175",1)

    if battery!=None:
        battery=int(battery,16)

    hum = int(decode_payload(payload,"0468",1), 16)
    temp = int(decode_payload(payload,"0367",2), 16)
    co2 = int(decode_payload(payload,"077d",2),16)
    activity =int(decode_payload(payload,"056a",2),16)
    illumination=decode_payload(payload,"0665",6)
    lum,vis,infra = illumination[0:4], illumination[4:8] ,illumination[8:]
    lum,vis,infra = int(lum, 16),int(vis,16),int(infra,16)
    tvoc=int(decode_payload(payload,"087d",2),16)
    barometric=int(decode_payload(payload,"0973",2),16)
    
    return battery, int(temp*0.1),int(hum*0.5),co2,activity, lum, vis,infra,tvoc,barometric*0.1
    


#Payload sans Batterie
payload = "03671f0104686206658a003f025b00056a0000077dc402087d100209736f27"

#Payload avec Batterie
#payload = "01754b03671c010468550665a602370a5401056a1c00077d8001087dbd0009735927"

battery, temp,hum,co2, activity,lum, vis,infra,tvoc, barometric = data_payload(payload)

print(battery,temp,hum,co2,activity,lum, vis,infra, tvoc ,barometric)