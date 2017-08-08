let printWarn: boolean = false;

export function setEnablePrintWarn(enable: boolean): void {
    printWarn = enable;
}

export function isEnablePrintWarn(): boolean {
    return printWarn;
}
