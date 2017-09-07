import { BaseScale, IScale } from "./BaseScale";
import { IConfig } from "./../modules/Widget";

import { Bisector } from "../utils/d3";
import { Coord } from "../modules/Coord";
import { ctxTest, formatDate, formatTime } from "../utils/util";

// 10 сек, 1 мин, 5 мин, 15 мин, 30 мин, 1 час, 3 часа, 6 часов, 1 день, 3 дня, 10 дней
const intervals: number[] = [10, 60, 300, 900, 1800, 3600, 10800, 21600, 86400, 259200, 864000];
const bisect: Bisector<number> = new Bisector<number>();

export class XScale extends BaseScale {

    public static type: string = "xscale";

    public static updateTicks(scales: IScale[], sizeBody: number[], settings: IConfig, coord: Coord): void {

        // шкала X будет одна
        const scale: IScale = scales[0];

        if (scale.min === null || scale.max === null) {
            scale.coord = null;
            scale.labels = null;
            scale.coords = [];
            return;
        }

        const widthBody = sizeBody[0];  // ширина графика
        const heightBody = sizeBody[1]; // высота графика

        scale.coord = heightBody + coord.getTop();
        scale.labels = [];
        scale.coords = [];

        // ширина текста (сколько пикселей занимает надпись). 10 - небольшой отступ взятый с потолка
        ctxTest.font = settings.sizeText + "px " + settings.font;
        const widthText: number = ctxTest.measureText("00:00:00").width + 10;

        // где min это начало времени,
        //   а max это конец времени.
        // тогда max - min = 100%
        const fullX: number = scale.max - scale.min;

        // ширина графика с учетом масштабирования
        // widthBody - ширина canvas
        // потребуется widthBody пикселей, чтобы нарисовать график полностью
        const widthScale: number = widthBody * coord.getScale();

        // fullX / 1000 - кол-во секунд в графике (т.е. преобразуем из миллисекунд в секунды)
        // fullX / 1000 / widthScale - количество секунд в одном пикселе
        // partTime - кол-во секунд в ширине текста
        const partTime: number = fullX / 1000 / widthScale * widthText;

        const index: number = bisect.left(intervals, partTime);

        // найдем нужный формат. выводить дату или время
        const format: (data: Date) => string = index < 8 ? formatTime : formatDate;

        // найдем шаг с которым мы будем идти. (преобразуем обратно в миллисекунды)
        const step: number = intervals[index] * 1000;

        // узнаем какое время в координате 0
        //   как писалось выше: fullX миллисекунд помещается в widthScale пикселей
        //   значит widthScale пикселей равняется fullX миллисекунд!!
        //   offset - это смещение по оси x и задается в пикселях
        //
        //  widthScale - 1 или fullX (ширина одного графика или fullX)
        //  offset     - time (найдем отношение)
        //
        //            offset
        //  time = ------------ * fullX
        //          widthScale
        //
        // min - time; //время в нулевой координате
        //
        let time: number = scale.min - fullX * coord.getOffset() / widthScale;

        // округляем наше полученное время. делаем кратным шагу
        time = (Math.ceil(time / step) - 1) * step;

        let x: number;
        let max: number = 1000; // чтобы небыло бесконечного цикла (на всякий случай)
        while (--max) {
            time += step;

            // преобразовываем обратно из даты в пиксели
            //   t = time - this.minTime;
            //
            //   fullX - widthScale
            //   t     - x (найдем x)
            //
            //                   t
            //   x = offset + ------- * widthScale
            //                 fullX

            x = coord.getOffset() + ((time - scale.min) * widthScale / fullX);

            // вышли за пределы канваса
            if (widthBody < x) {
                break;
            }

            scale.coords.push(x);
            scale.labels.push(format(new Date(time)));
        }
    }

    constructor(config: any) {
        super();
        this.update(config);
    }

    public update(config: any): void {
        super.update(config);
    }

    public draw(ctx: CanvasRenderingContext2D, coord: Coord): void {
        if (this.coord === null) {
            return;
        }

        ctx.beginPath();

        ctx.globalAlpha = this.opacity;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.lineWidth;
        ctx.textAlign = "center";
        ctx.fillStyle = "black";
        ctx.textBaseline = "top";

        ctx.moveTo(0, this.coord);
        ctx.lineTo(coord.getWidth() - 1, this.coord);

        const ln: number = this.coords.length;
        let xCoord: number;

        for (let i: number = 0; i < ln; ++i) {
            xCoord = this.coords[i];

            ctx.moveTo(xCoord, this.coord + 1);
            ctx.lineTo(xCoord, this.coord + 5);
            ctx.fillText(this.labels[i], xCoord, this.coord + 4);
        }

        ctx.stroke();
    }
}
