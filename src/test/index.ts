import { jsmem } from '../jsmem'

const proc = jsmem.getProcess("DyingLightGame.exe")
const game = jsmem.process(proc)
const dll = game.getModule('gamedll_x64_rwdi.dll')

const damageAdrr = dll.modBaseAddr + 0xAD2D37
const damageComp = Buffer.from([0xF3, 0x0F, 0x11, 0x83, 0x54, 0x09, 0x00, 0x00])

const { nop } = jsmem.asm64
const damageNop = Buffer.from(new Array(8).fill(nop))

const damageGame = game.memory[damageAdrr].buffer[8]

if (Buffer.compare(damageGame, damageComp) === 0) {
  // opcode is as expected
  game.memory[damageAdrr].buffer[8] = damageNop // godmode!

} else if (Buffer.compare(damageGame, damageNop) === 0) {
  // opcode has been modifyed
  game.memory[damageAdrr].buffer[8] = damageComp // disable godmode

}

// 2nd game
const process = jsmem.getProcess('Sakura Clicker.exe')
const game2 = jsmem.process(process)

const baseAddr = game2.openProcess.modBaseAddr
const moneyAddr = game2.deepPointer(baseAddr + 0x002F0DD8, 0x24) + 0x8
const healthAddr = game2.deepPointer(baseAddr + 0x00313B88, 0x38, 0x138, 0x62C) + 0x8

let money = game2.memory[moneyAddr].double
let health = game2.memory[healthAddr].double

money = money * 2 // dublicate money!
health = 0 // kill the enemy!
