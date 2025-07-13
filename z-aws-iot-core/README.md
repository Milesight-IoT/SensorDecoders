# Connecting Milesight IoT End devices to AWS IoT Core for LoRaWAN - Milesight IoT

The header code is applicable to all Milesight IoT end-devices listed in this repository.

For more detailed guide, please visit [milesight official knowledge base](https://support.milesight-iot.com/hc/en-us/articles/900007629603)

## How to Use the Header Code

- Go to the AWS Lambda console.
- Click on **Functions** in the navigation pane.
- Click on **Create function**.
- Select **Author from scratch**. Under Basic information, enter the function name “am100decoder” for instance and choose **Node.js 12.x**. from the drop-down under **Runtime**.
- Click on **Create function**.
- Click the function you created, Under **Code** tab, paste the Header Code, and under

```
// PASTE DECODER HERE
```

- Get the decoder for TTN from the model folder in this repository and paste it underneath.
