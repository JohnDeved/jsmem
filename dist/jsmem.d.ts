interface Iprocess {
    cntThreads: number;
    pcPriClassBase: number;
    szExeFile: string;
    th32ParentProcessID: number;
    th32ProcessID: number;
}
interface IopenProcess extends Iprocess {
    dwSize: 304;
    handle: 632;
    modBaseAddr: 0;
}
interface Imodule {
    hModule: number;
    modBaseAddr: number;
    modBaseSize: number;
    szExePath: string;
    szModule: string;
    th32ProcessID: number;
    th32ModuleID: number;
}
interface IdataTypeProxy {
    int: number;
    int32: number;
    uint32: number;
    int64: number;
    uint64: number;
    dword: number;
    short: number;
    long: number;
    float: number;
    double: number;
    bool: boolean;
    boolean: boolean;
    ptr: number;
    pointer: number;
    str: string;
    string: string;
    vec3: {
        x: number;
        y: number;
        z: number;
    };
    vector3: {
        x: number;
        y: number;
        z: number;
    };
    vec4: {
        w: number;
        x: number;
        y: number;
        z: number;
    };
    vector4: {
        w: number;
        x: number;
        y: number;
        z: number;
    };
}
declare class Process {
    private process;
    constructor(process: Iprocess);
    openProcess: IopenProcess;
    readonly modules: Imodule[];
    getModule(moduleName: string): Imodule;
    readonly memory: {
        [key: number]: IdataTypeProxy;
    };
    getBuffer(adress: number, size: number): Buffer;
    setBuffer(adress: number, buffer: Buffer): any;
    deepPointer(...offsets: number[]): number;
}
export declare class JsMem {
    process(process: Iprocess): Process;
    getModules(processId: number): Imodule[];
    getProcess(): Iprocess[];
    getProcess(processId?: number): Iprocess;
    getProcess(processName?: string): Iprocess;
    readonly processes: Iprocess[];
}
export declare const jsmem: JsMem;
export {};
