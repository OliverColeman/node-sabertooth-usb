import { SabertoothUSB, SingleChannel} from '../index'

const sabertooth = new SabertoothUSB('/dev/ttyACM0')

// Get all the SabertoothUSB class methods starting with 'get'
const stats = Reflect.ownKeys(Reflect.getPrototypeOf(sabertooth))
  .map(method => method.toString())
  .filter(method => method.startsWith('get') && method !== 'get')

const printStats = async () => {
  // Check that the connection is open and working.
  if (sabertooth.isConnected()) {
    try {
      console.log('==== Sabertooth stats ====')

      console.log(`battery voltage: ${await sabertooth.getBatteryVoltage()}V`)
      for (const channel of [1, 2] as SingleChannel[]) {
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

setInterval(printStats, 1000)
