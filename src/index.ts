import { ChartTime } from "./ChartTime";
import { ChartGroup } from "./ChartGroup";

import { Damage } from "./modules/buttons/Damage";
import { Full } from "./modules/buttons/Full";
import { Group } from "./modules/buttons/Group";

import { isEnablePrintWarn, setEnablePrintWarn } from "./modules/PrintWarn";

(ChartTime as any).ChartGroup = ChartGroup;

ChartTime.injectBtn("damage", Damage);
ChartTime.injectBtn("full", Full);
ChartTime.injectBtn("group", Group);

(ChartTime as any).warn = {
    isEnable: isEnablePrintWarn,
    setEnable: setEnablePrintWarn,
};

export = ChartTime;
