import { Bisector } from "../../utils/d3";
import { findFactor, OFFSET } from "./number";

import { MAX_VALUE } from "../../utils/util";

// набор "приятных" для глаз шагов
const niceDel: number[] = [1, 2, 3, 4, 5, 6, 8, 10, 12,  15,  20,  25,  30,  35,  40,  50, 60, 75, 80, 100,
                                                    120, 150, 200, 250, 300, 350, 400, 500];

const bisect: Bisector<number> = new Bisector<number>();

const FACTOR: number = 10;
const MAX_EXPONENT: number = 5;

// return [start, finish, step];
function findNiceStep(minValue: number, maxValue: number, countSteps: number): number[] {
    const sub: number = maxValue - minValue;

    let step: number = sub / countSteps; // raw step
    let start: number;
    let finish: number;

    let factor: number = 1;
    while (step >= 100) {
        step /= FACTOR;
        factor *= FACTOR;
    }

    let index: number = bisect.left(niceDel, step);

    do {
      // "приятный шаг"
      step = Math.round(niceDel[index++] * factor);

      // откуда будем начинать шагать. шагать будем снизу
      start = (minValue < 0 ? -1 : 1) * (Math.floor(Math.abs(minValue) / step) + (minValue < 0 ? 1 : 0)) * step;

      // каким числом закончим шаг
      finish = (countSteps * step) + start;

    } while (maxValue > finish);

    return [start, finish, step];
}

interface IScaleStub {
    min: number;
    max: number;
    labels: string[];
}

interface IScaleModifed {
    factor: number[];

    sub: number;
    min: number;
    max: number;

    rawStep: number[];
    step: number[];
}

function getScaleModifed(scalesStub: IScaleStub[]): IScaleModifed[] {
    return scalesStub.map((scaleStub: IScaleStub) => {
        const factor: number[] = findFactor(scaleStub.max - scaleStub.min);
        const mMin = scaleStub.min / factor[0];
        const mMax = scaleStub.max / factor[0];

        return {
            factor,

            sub: mMax - mMin,
            min: mMin,
            max: mMax,

            rawStep: null,
            step: null,
        };
    });
}

function updateInfo(scalesModifed: IScaleModifed[], rawSteps: number): IScaleModifed[] {
    const ln: number = scalesModifed.length;
    let i: number = 0;
    let scaleModifed: IScaleModifed;

    let lossPercentSub: number; // потеря полезного пространства
    let lossPercentSum: number;
    let lossPercentMin: number = MAX_VALUE;

    while (rawSteps > 1) { // rawStep не должен быть меньше 2

        lossPercentSum = 0;

        for (i = 0; i < ln; ++i) {
            scaleModifed = scalesModifed[i];

            scaleModifed.rawStep = findNiceStep(scaleModifed.min, scaleModifed.max, rawSteps);

            lossPercentSub = scaleModifed.rawStep[1] - scaleModifed.rawStep[0];
            lossPercentSum += (lossPercentSub - scaleModifed.sub) / lossPercentSub; // процент "потери пространства"
        }

        // если текущий процент потери меньше предыдущего,
        // то перезапишем и продолжим искать еще более меньший процент
        // если процент больше предыдущего, то остановимся сохраненном варианте
        if (lossPercentSum < lossPercentMin) {
            lossPercentMin = lossPercentSum;

            for (i = 0; i < ln; ++i) {
                scaleModifed = scalesModifed[i];
                scaleModifed.step = scaleModifed.rawStep;
            }
        } else {
            break;
        }

        --rawSteps;
    }

    return scalesModifed;
}

function _updateLabels(scalesStub: IScaleStub[], scalesModifed: IScaleModifed[]): void {
    const ln: number = scalesStub.length;
    for (let i: number = 0; i < ln; ++i) {
        targetUpdate(scalesStub[i], scalesModifed[i]);
    }
}

function targetUpdate(scaleStub: IScaleStub, scaleModifed: IScaleModifed): void {
    let start: number = scaleModifed.step[0];
    const finish: number = scaleModifed.step[1];
    const step: number = scaleModifed.step[2];

    let factor: number = scaleModifed.factor[0];
    const exponent: number = scaleModifed.factor[1];

    // установим реальное минимальное и максимальное значение
    scaleStub.min = start * factor;
    scaleStub.max = finish * factor;

    // обновим надписи
    let rStep: number = step;
    let zeros: number = 0;
    while (rStep % FACTOR === 0) {
        rStep /= FACTOR;
        ++zeros;
    }

    let toFixed: number = zeros + exponent;
    let expStr = "";

    if (Math.abs(exponent + OFFSET) > MAX_EXPONENT) {
        expStr = "e" + (exponent < 0 ? "-" : "+") + (Math.abs(toFixed + 1));
        factor = Math.pow(1 / FACTOR, zeros + 1);
        toFixed = 1;
    } else {
        toFixed = toFixed >= 0 ? 0 : Math.abs(toFixed);
    }

    scaleStub.labels = [];
    for (; start <= finish; start += step) {
        scaleStub.labels.push((start < 0 ? "" : " ") + (start * factor).toFixed(toFixed) + expStr);
    }
}

export function updateLabels(scalesStub: IScaleStub[], rawSteps: number): void {
    _updateLabels(scalesStub, updateInfo(getScaleModifed(scalesStub), rawSteps));
}
