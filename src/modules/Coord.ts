import { IItem } from "../series/index";

export class Coord {

    private keyX: string;
    private keyY: string;

    private offset: number;
    private scale: number;

    private width: number;
    private height: number;

    private top: number;

    public set(keyX: string, keyY: string): void {
        this.keyX = keyX;
        this.keyY = keyY;
    }

    public getX(item: IItem): number {
        return this.offset + item[this.keyX] * this.scale;
    }

    public getY(item: IItem): number {
        return item[this.keyX] === null ? null : (this.top + item[this.keyY]);
    }

    public getOffset(): number {
        return this.offset;
    }

    public getScale(): number {
        return this.scale;
    }

    public getTop(): number {
        return this.top;
    }

    public getWidth(): number {
        return this.width;
    }

    public getHeight(): number {
        return this.height;
    }

    public update(offset: number, scale: number, top: number, width: number, height: number): void {
        this.offset = offset;
        this.scale = scale;
        this.top = top;
        this.width = width;
        this.height = height;
    }

     public copyProps(coord: Coord) {
         coord.update(this.offset, this.scale, this.top, this.width, this.height);
     }
}
