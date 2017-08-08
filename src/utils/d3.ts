// алгоритм нагло спизжен из библиотеки d3. и чуть-чуть перепилен

type Accessor = <L>(item: L) => number;

export class Bisector<T> {
    public accessor: Accessor = null;
    constructor(accessor?: Accessor) {
        this.accessor = accessor ? accessor : <S>(item: S) => {
            return (item as any) as number; // TODO
        };
    }

    public left(array: T[], num: number): number {
        let lo: number = 0;
        let hi: number = array.length;
        let mid: number;

        while (lo < hi) {
            mid = lo + hi >>> 1;

            if (this.ascending(this.accessor(array[mid]), num) < 0) {
                lo = mid + 1;
            } else {
                hi = mid;
            }
        }

        return lo;
    }

    public right(array: T[], num: number): number {
        let lo: number = 0;
        let hi: number = array.length;
        let mid: number;

        while (lo < hi) {
            mid = lo + hi >>> 1;

            if (this.ascending(this.accessor(array[mid]), num) > 0) {
                hi = mid;
            } else {
                lo = mid + 1;
            }
        }

        return lo;
    }

    private ascending(a: number, b: number): number {
        return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
    }
}
