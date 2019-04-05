import { jsmem } from '../jsmem'

// const proc = jsmem.getProcess("DyingLightGame.exe")
// const game = jsmem.process(proc)
// const dll = game.getModule('gamedll_x64_rwdi.dll')

// const damageAdrr = dll.modBaseAddr + 0xAD2D37
// const damageComp = Buffer.from([0xF3, 0x0F, 0x11, 0x83, 0x54, 0x09, 0x00, 0x00])
// const damageNop = Buffer.from([0x90, 0x90, 0x90, 0x90, 0x90, 0x90, 0x90, 0x90])
// const damageGame = game.getBuffer(damageAdrr, 8)

// if (Buffer.compare(damageGame, damageComp) === 0) {

//   // opcode is as expected
//   game.setBuffer(damageAdrr, damageNop) // godmode!

// } else if (Buffer.compare(damageGame, damageNop) === 0) {

//   // opcode has been modifyed
//   game.setBuffer(damageAdrr, damageComp) // disable godmode

// }

// 2nd game
const process = jsmem.getProcess('Sakura Clicker.exe')
const game2 = jsmem.process(process)

const baseAddr = game2.openProcess.modBaseAddr
const moneyAddr = game2.deepPointer(baseAddr + 0x002F0DD8, 0x24) + 0x8
const healthAddr = game2.deepPointer(baseAddr + 0x00313B88, 0x38, 0x138, 0x62C) + 0x8

const money = game2.memory[moneyAddr]
const health = game2.memory[healthAddr]

money.double = money.double * 2 // dublicate money!
health.double = 0 // kill the enemy!
