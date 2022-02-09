#sabertooth-usb

A node.js module providing an API for controlling a USB-enabled Sabertooth motor driver running in Packet Serial mode.

The API covers all available commands and data request types.

These are a series of dual-channel motor drivers produced by [Dimension Engineering](https://www.dimensionengineering.com/), including the popular Sabertooth 2x32:

![Sabertooth 2x32](https://www.dimensionengineering.com/images/products/Sabertooth2x32Small.jpg)

## Installation

```shell
npm i saberthooth-usb
```

## Usage

```ts
import { SabertoothUSB } from 'sabertooth-usb'

// Open a connection to the Sabertooth on port /dev/ttyACM0
// For Windows this would be something like 'COM1'
const sabertooth = new SabertoothUSB('/dev/ttyACM0')

// ... wait for connection to open.

// Drive motor 1 at full speed.
sabertooth.setMotor(1, 1)
// Drive motor 2 at half full reverse speed.
sabertooth.setMotor(2, -0.5)
// Drive both motors at full reverse speed.
sabertooth.setMotor('*', -1)
// Set the current limit for both motors to 10 Amps.
sabertooth.setCurrentLimit('*', 10)

// Print the results of querying the motor driver for available stats.
const printStats = async () => {
  // Check that the connection is open and working.
  if (sabertooth.isConnected()) {
    try {
      console.log('==== Sabertooth stats ====')

      console.log(`battery voltage: ${await sabertooth.getBatteryVoltage()}V`)
      for (const channel of [1, 2]) {
        console.log(`motor driver channel ${channel}`)
        console.log(`  temp:    ${await sabertooth.getMotorDriverOutputTemperature(channel)}°C`)
        // Note: the current sensor is extremely noisy and can vary as much as several amps.
        console.log(`  current: ${await sabertooth.getMotorCurrent(channel)}A`)
        // Motor rates are in range [-2047, 2047], full-reverse to full-forward.
        console.log(`  rate:    ${Math.round(await sabertooth.getMotorDriverOutputRate(channel) * 100)}%`)
      }
    }
    catch (e) {
      console.error(e)
    }
  }
  else {
    console.log("waiting for connection")
  }
}
```

See the `examples` folder for more usage examples.

## API



## Notes

Only Checksum protection is implemented, not CRC.
