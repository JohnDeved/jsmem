"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsmem_1 = require("./jsmem");
const proc = jsmem_1.jsmem.getProcess("DyingLightGame.exe");
const game = jsmem_1.jsmem.process(proc);
const dll = game.getModule('gamedll_x64_rwdi.dll');
const damageAdrr = dll.modBaseAddr + 0xAD2D37;
const damageComp = Buffer.from([0xF3, 0x0F, 0x11, 0x83, 0x54, 0x09, 0x00, 0x00]);
const damageNop = Buffer.from([0x90, 0x90, 0x90, 0x90, 0x90, 0x90, 0x90, 0x90]);
const damageGame = game.getBuffer(damageAdrr, 8);
if (Buffer.compare(damageGame, damageComp) === 0) {
    // opcode is as expected
    game.setBuffer(damageAdrr, damageNop);
}
else if (Buffer.compare(damageGame, damageNop) === 0) {
    // opcode has been modifyed
    game.setBuffer(damageAdrr, damageComp);
}
// const health = game.memory[0x119E3123C]
// health.float = 125
