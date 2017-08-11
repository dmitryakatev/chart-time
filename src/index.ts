/*import { ChartTime } from "./ChartTime";
import { ChartGroup } from "./ChartGroup";

import { isEnablePrintWarn, setEnablePrintWarn } from "./modules/PrintWarn";

(ChartTime as any).ChartGroup = ChartGroup;

(ChartTime as any).warn = {
    isEnable: isEnablePrintWarn,
    setEnable: setEnablePrintWarn,
};

export = ChartTime;
*/

import { Full } from "./modules/buttons/Full";
import { Damage } from "./modules/buttons/Damage";

const chartTime = {
    settings: {},
};

const button1: Full = new Full({
    chartTime: chartTime,
    // bindTo: document.body,
});

const button2: Damage = new Damage({
    chartTime: chartTime,
});

setTimeout(() => {
    button1.bindTo(document.body);
    button2.bindTo(document.body);
}, 1000);
