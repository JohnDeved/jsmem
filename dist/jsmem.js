"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mjs = require("memoryjs");
var asm32;
(function (asm32) {
})(asm32 || (asm32 = {}));
class Memoryjs {
    static get processes() {
        return mjs.getProcesses();
    }
    static getModules(processId) {
        return mjs.getModules(processId);
    }
    static findModule(moduleName, processId) {
        return mjs.findModule(moduleName, processId);
    }
    static readMemory(handle, address, dataType) {
        return mjs.readMemory(handle, address, dataType);
    }
    static writeMemory(handle, address, value, dataType) {
        return mjs.writeMemory(handle, address, value, dataType);
    }
}
class Memory {
    constructor(handle, adress) {
        this.handle = handle;
        this.adress = adress;
    }
    read(dataType) {
        return Memoryjs.readMemory(this.handle, this.adress, dataType);
    }
    write(value, dataType) {
        return Memoryjs.writeMemory(this.handle, this.adress, value, dataType);
    }
}
class MemoryProxy {
    constructor(handle) {
        this.handle = handle;
    }
    get(t, p) {
        const adress = parseInt(p);
        if (isNaN(adress))
            return;
        const memory = new Memory(this.handle, adress);
        return new Proxy({}, {
            get: (t, p) => {
                return memory.read(p);
            },
            set: (t, p, v) => {
                memory.write(v, p);
                return true;
            }
        });
    }
}
class Process {
    constructor(process) {
        this.process = process;
        this.openProcess = mjs.openProcess(process.th32ProcessID);
    }
    get modules() {
        return Memoryjs.getModules(this.process.th32ProcessID);
    }
    getModule(moduleName) {
        return Memoryjs.findModule(moduleName, this.process.th32ProcessID);
    }
    get memory() {
        return new Proxy({}, new MemoryProxy(this.openProcess.handle));
    }
    getBuffer(adress, size) {
        return mjs.readBuffer(this.openProcess.handle, adress, size);
    }
    setBuffer(adress, buffer) {
        return mjs.writeBuffer(this.openProcess.handle, adress, buffer);
    }
    deepPointer(...offsets) {
        let pointer = 0;
        offsets.forEach(offset => pointer = this.memory[pointer + offset].dword);
        return pointer;
    }
}
class JsMem {
    process(process) {
        return new Process(process);
    }
    getModules(processId) {
        return Memoryjs.getModules(processId);
    }
    getProcess(processId) {
        switch (true) {
            case !processId:
                return Memoryjs.processes;
            case typeof processId === typeof 0:
                return Memoryjs.processes.find(process => process.th32ProcessID === processId);
            case typeof processId === typeof '':
                return Memoryjs.processes.find(process => process.szExeFile === processId);
        }
    }
    get processes() {
        return this.getProcess();
    }
}
exports.JsMem = JsMem;
exports.jsmem = new JsMem();
// const process = jsmem.getProcesses('Sakura Clicker.exe') as Iprocess
// const game = jsmem.process(process)
// const baseAddr = game.openProcess.modBaseAddr
// const moneyAddr = game.deepPointer(baseAddr + 0x002F0DD8, 0x24) + 0x8
// const healthAddr = game.deepPointer(baseAddr + 0x00313B88, 0x38, 0x138, 0x62C) + 0x8
// const money = game.memory[moneyAddr]
// const health = game.memory[healthAddr]
// money.double = money.double * 2 // dublicate money!
// health.double = 0 // kill the enemy!
