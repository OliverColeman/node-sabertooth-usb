import { SabertoothUSB } from '../index'

const sabertooth = new SabertoothUSB('/dev/ttyACM0')

const sourceVoltage = 12
let value = -sourceVoltage

setInterval(async () => {
  try {
    sabertooth.setMotor('*', value / sourceVoltage)
    value = value >= sourceVoltage ? -sourceVoltage : value + 1
  }
  catch (e) {
    console.error(e)
  }
}, 2000)
