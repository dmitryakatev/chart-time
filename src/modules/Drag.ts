import { CacheEvent } from "./CacheEvent";

type Callback = (event: Event, difX: number, difY: number) => void;

const cacheEvent: CacheEvent = new CacheEvent();

let captured: Drag = null;
let moved: boolean;

function onMoveEvent(event: MouseEvent): void {
    // в некоторых браузерах срабатывает событие mousemove даже если мышь
    // не перемещали. делаем хак, если координаты "e.clientX" и "x" оданаковые
    // то флаг isMoved в true не выставляем (как будто move небыло)
    if (moved || event.clientX !== captured.eventX || event.clientY !== captured.eventY) {
        moved = true;
        captured.onMove(
            event,
            captured.x + event.clientX - captured.eventX,
            captured.y + event.clientY - captured.eventY,
        );
    }
}

function onUpEvent(event: MouseEvent): void {
    if (captured.onFinish) {
        captured.onFinish(
            event,
            captured.x + event.clientX - captured.eventX,
            captured.y + event.clientY - captured.eventY,
        );
    }
    captured.finish();
}

export class Drag {
    public onMove: Callback;
    public onFinish: Callback;

    public eventX: number;
    public eventY: number;

    public x: number;
    public y: number;

    private dragging: boolean;

    constructor(onMove: Callback, onFinish: Callback = null) {
        this.dragging = false;
        this.onMove = onMove;
        this.onFinish = onFinish;
    }

    public start(event: MouseEvent, x: number, y: number): void {
        if (this.dragging) {
            return;
        }

        this.clearSelection();

        cacheEvent.on(document as any, {
            mousemove: onMoveEvent,
            mouseup: onUpEvent,
        });

        this.eventX = event.clientX;
        this.eventY = event.clientY;

        this.x = x;
        this.y = y;

        captured = this;
        moved = false;

        this.dragging = true;
    }

    public finish(): void {
        if (!this.dragging) {
            return;
        }

        captured = null;
        cacheEvent.off();

        this.dragging = false;
    }

    public destroy(): void {
        this.finish();

        this.onMove = null;
        this.dragging = null;
    }

    private clearSelection(): void {
        if (window.getSelection) {
            window.getSelection().removeAllRanges();
        } else {
            (document as any).selection.empty();
        }
    }
}
