import { isEnablePrintWarn } from "../modules/PrintWarn";

import { Updater } from "../modules/Updater";

import { IItem, IItemRaw, IPoint, ISeries, ISeriesCtor } from "./BaseSeries";
import { HLine } from "./HLine";
import { Line } from "./Line";
import { Rect } from "./Rect";

const map = {
    [Line.type]: Line,
    [Rect.type]: Rect,
    [HLine.type]: HLine,
};

// export ???
export function create(config: any): ISeries {
    const type: string = config.type || Line.type;

    if (!map.hasOwnProperty(type)) {
        if (isEnablePrintWarn()) {
            console.warn(`Series not found. type: ${type}`);
        }
        return null;
    }

    return new map[type](config);
}

function update(series: ISeries, config: any): void {
    series.update(config);
}

function destroy(series: ISeries): void {
    series.destroy();
}

const updater: Updater<ISeries> = new Updater<ISeries>(Line.type, create, update, destroy);

export function updateSeries(configs: any[], series: ISeries[] = []): ISeries[] {
    return updater.update(configs, series);
}

export { IItem, IItemRaw, IPoint, ISeries };
