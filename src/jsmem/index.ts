import * as mjs from 'memoryjs'

interface Iprocess {
  cntThreads: number
  pcPriClassBase: number
  szExeFile: string
  th32ParentProcessID: number
  th32ProcessID: number
}

interface IopenProcess extends Iprocess {
  dwSize: number
  handle: number
  modBaseAddr: number
}

interface Imodule {
  hModule: number
  modBaseAddr: number
  modBaseSize: number
  szExePath: string
  szModule: string
  th32ProcessID: number
  th32ModuleID: number
}

type IdataType = keyof IdataTypeProxy

interface IdataTypeProxy {
  int: number
  int32: number
  uint32: number
  int64: number
  uint64: number
  dword: number
  short: number
  long: number
  float: number
  double: number
  bool: boolean
  boolean: boolean
  ptr: number
  pointer: number
  str: string
  string: string
  vec3: { x: number, y: number, z: number }
  vector3: { x: number, y: number, z: number }
  vec4: { w: number, x: number, y: number, z: number }
  vector4: { w: number, x: number, y: number, z: number }
  buffer: Buffer[]
}

const dataTypes: IdataType[] = ['int', 'int32', 'uint32', 'int64', 'uint64', 'dword', 'short', 'long', 'float', 'double', 'bool', 'boolean', 'ptr', 'pointer', 'str', 'string', 'vec3', 'vector3', 'vec4', 'vector4', 'buffer']

enum asm32 {
  nop = 0x00
}

enum asm64 {
  nop = 0x90
}

class Memoryjs {
  public static get processes (): Iprocess[] {
    return mjs.getProcesses()
  }

  public static getModules (processId: number): Imodule[] {
    return mjs.getModules(processId)
  }

  public static findModule (moduleName: string, processId: number): Imodule {
    return mjs.findModule(moduleName, processId)
  }

  public static readMemory (handle: number, address: number, dataType: IdataType) {
    return mjs.readMemory(handle, address, dataType);
  }

  public static writeMemory (handle: number, address: number, value, dataType: IdataType) {
    return mjs.writeMemory(handle, address, value, dataType);
  }
}

class Memory {
  constructor (private handle: number, private adress: number) {}

  public read (dataType: IdataType) {
    return Memoryjs.readMemory(this.handle, this.adress, dataType)
  }

  public write (value, dataType: IdataType) {
    return Memoryjs.writeMemory(this.handle, this.adress, value, dataType)
  }
}

class MemoryProxy {
  constructor (private handle: number) {}

  public get (target, prop) {
    const adress = parseInt(prop)
    if (isNaN(adress)) return

    const memory = new Memory(this.handle, adress)

    const handler = {}
    dataTypes.forEach(type => {
      Object.defineProperty(handler, type, {
          get: () => memory.read(type),
          set: val => memory.write(val, type),
      })
    })

    return handler as IdataTypeProxy
  }
}

class Process {
  constructor (private process: Iprocess) {
    this.openProcess = mjs.openProcess(process.th32ProcessID)
  }

  public openProcess: IopenProcess

  public get modules () {
    return Memoryjs.getModules(this.process.th32ProcessID)
  }

  public getModule (moduleName: string) {
    return Memoryjs.findModule(moduleName, this.process.th32ProcessID)
  }

  public get memory (): {[key: number]: IdataTypeProxy} {
    return new Proxy({}, new MemoryProxy(this.openProcess.handle))
  }

  public getBuffer (adress: number, size: number): Buffer {
    return mjs.readBuffer(this.openProcess.handle, adress, size)
  }

  public setBuffer (adress: number, buffer: Buffer) {
    return mjs.writeBuffer(this.openProcess.handle, adress, buffer);
  }

  public deepPointer (...offsets: number[]) {
    let pointer = 0
    offsets.forEach(offset => pointer = this.memory[pointer + offset].dword)
    return pointer
  }
}

export class JsMem {
  public process (process: Iprocess) {
    return new Process(process)
  }

  public getModules (processId: number) {
    return Memoryjs.getModules(processId)
  }

  public getProcess (): Iprocess[];
  public getProcess (processId?: number): Iprocess;
  public getProcess (processName?: string): Iprocess;
  public getProcess (processId?: number | string) {
    switch (true) {
      case !processId:
        return Memoryjs.processes

      case typeof processId === typeof 0:
        return Memoryjs.processes.find(process => process.th32ProcessID === processId)

      case typeof processId === typeof '':
        return Memoryjs.processes.find(process => process.szExeFile === processId)
    }
  }

  public get processes () {
    return this.getProcess()
  }
}

export const jsmem = new JsMem()