import { SabertoothUSB, SingleChannel} from '../index'

const sabertooth = new SabertoothUSB('/dev/ttyACM0', {
  // All options at default values.
  baudRate: 38400, timeout: 1000, maxGetAttemptCount: 3, address: 128, debug: true
})

const printStats = async () => {
  const startTime = Date.now()

  // Check that the connection is open and working.
  if (sabertooth.isConnected()) {
    try {
      console.log('==== Sabertooth stats ====')
      const startTime = Date.now()

      console.log(`battery voltage: ${await sabertooth.getBatteryVoltage()}V`)
      for (const channel of [1, 2] as SingleChannel[]) {
        console.log(`motor driver channel ${channel}`)
        console.log(`  temp:    ${await sabertooth.getMotorDriverOutputTemperature(channel)}°C`)
        // Note: the current sensor is extremely noisy and can vary as much as several amps.
        console.log(`  current: ${await sabertooth.getMotorCurrent(channel)}A`)
        // Motor rates are in range [-1, 1], full-reverse to full-forward.
        console.log(`  rate:    ${Math.round(await sabertooth.getMotorDriverOutputRate(channel) * 100)}%`)
      }

      console.log(`Got stats in ${((Date.now() - startTime) / 1000).toFixed(1)}s`)
    }
    catch (e) {
      console.error(e)
    }
  }
  else {
    console.log(`waiting for connection, last error: ${sabertooth.getLastError()}`)
  }

  // Print stats at most once every second (allow for requests to take longer than a second).
  setTimeout(printStats, 1000 - (Date.now() - startTime))
}

printStats()
