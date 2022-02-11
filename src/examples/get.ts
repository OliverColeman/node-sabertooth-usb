/**
 * Prints telemetry from each connected Sabertooth device.
 */

import { SabertoothUSB, listSabertoothDevices, SingleChannel } from '../index'

let sabertoothDevices:SabertoothUSB[] = null
// Get all available sabertooth devices.
listSabertoothDevices().then(devices => {
  if (devices.length === 0) {
    console.error("No Sabertooth devices found.")
  }
  else {
    console.log(`Found ${devices.length} Sabertooth devices.`)
    sabertoothDevices = devices.map(device => new SabertoothUSB(device.path, {
      // All options at default values.
      baudRate: 38400, timeout: 1000, maxGetAttemptCount: 3, address: 128, debug: true
    }))
  }
})

const printStats = async () => {
  const startTime = Date.now()

  if (sabertoothDevices !== null) {
    for (const sabertooth of sabertoothDevices) {
      console.log(`Sabertooth @ ${sabertooth.path}:`)

      // Check that the connection is open and working.
      if (sabertooth.isConnected()) {
        try {
          console.log(`  Battery voltage: ${await sabertooth.getBatteryVoltage()}V`)
          for (const channel of [1, 2] as SingleChannel[]) {
            console.log(`  Motor driver channel ${channel}`)
            console.log(`    Temp:    ${await sabertooth.getMotorDriverOutputTemperature(channel)}°C`)
            // Note: the current sensor is extremely noisy and can vary as much as several amps.
            console.log(`    Current: ${await sabertooth.getMotorCurrent(channel)}A`)
            // Motor rates are in range [-1, 1], full-reverse to full-forward.
            console.log(`    Rate:    ${Math.round(await sabertooth.getMotorDriverOutputRate(channel) * 100)}%`)
          }
        }
        catch (e) {
          console.error(e)
        }
      }
      else {
        console.log(`  Waiting for connection, last error: ${sabertooth?.getLastError()}`)
      }
    }

    console.log(`Got stats in ${((Date.now() - startTime) / 1000).toFixed(1)}s\n`)
  }
  else {
    console.log(`Searching for devices.`)
  }

  // Print stats at most once every second (allow for all requests to take longer than a second).
  setTimeout(printStats, 1000 - (Date.now() - startTime))
}

printStats()
