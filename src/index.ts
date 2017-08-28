import { ChartTime } from "./ChartTime";
// import { ChartGroup } from "./ChartGroup";

import { Damage } from "./modules/buttons/Damage";
import { Full } from "./modules/buttons/Full";
// import { Group } from "./modules/buttons/Group";

import { isEnablePrintWarn, setEnablePrintWarn } from "./modules/PrintWarn";

// (ChartTime as any).ChartGroup = ChartGroup;

ChartTime.injectBtn("damage", Damage);
ChartTime.injectBtn("full", Full);
// ChartTime.injectBtn("group", Group);

(ChartTime as any).warn = {
    isEnable: isEnablePrintWarn,
    setEnable: setEnablePrintWarn,
};

export = ChartTime;

/*
import { Full } from "./modules/buttons/Full";
import { Damage } from "./modules/buttons/Damage";

import "./less/chartTime.less";

const chartTime = {
    settings: {},
};

(window as any).button1 = new Full({
    chartTime,
    tooltip: {
        showDelay: 2000,
        hideDelay: 2000,
        saveDelay: 3000,
    },
});

(window as any).button2 = new Damage({
    chartTime,
    tooltip: {
        showDelay: 2000,
        hideDelay: 2000,
        saveDelay: 3000,
    },
});

setTimeout(() => {
    const div: HTMLDivElement =  document.createElement("div") as HTMLDivElement;
    document.body.appendChild(div);
    div.style.padding = "50px";

    (window as any).button1.bindTo(div);
    (window as any).button2.bindTo(div);
}, 100);
*/
