import { isEnablePrintWarn } from "../modules/PrintWarn";

import { Updater } from "../modules/Updater";

import { Calc, IScale, IScaleCtor } from "./BaseScale";
import { XScale } from "./XScale";
import { YScale } from "./YScale";

const map = {
    [XScale.type]: XScale,
    [YScale.type]: YScale,
};

export function create(config: any): IScale {
    const type: string = config.type || YScale.type;

    if (!map.hasOwnProperty(type)) {
        if (isEnablePrintWarn()) {
            console.warn(`Scale not found. type: ${type}`);
        }
        return null;
    }

    return new map[type](config);
}

function update(scale: IScale, config: any): void {
    scale.update(config);
}

function destroy(scale: IScale): void {
    scale.destroy();
}

const updater: Updater<IScale> = new Updater<IScale>(YScale.type, create, update, destroy);

export function updateScales(configs: any[], scales: IScale[] = []): IScale[] {
    return updater.update(configs, scales);
}

export { Calc, IScale };
