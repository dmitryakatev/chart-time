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

const button: Full = new Full({
    chartTime: {},
    // bindTo: document.body,
});

setTimeout(() => {
    button.bindTo(document.body);
}, 5000);
