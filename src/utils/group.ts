
export function toGroup<T, K extends keyof T>(instacnes: T[], key: K): any {
    const result = {};

    const ln: number = instacnes.length;

    let instacne: T;
    let name: any;
    let i: number;

    for (i = 0; i < ln; ++i) {
        instacne = instacnes[i];
        name = instacne[key];

        if (result.hasOwnProperty(name)) {
            result[name].push(instacne);
        } else {
            result[name] = [instacne];
        }
    }

    return result;
}

export function toMap<T, K extends keyof T>(instacnes: T[], key: K): any {
    const result = {};

    const ln: number = instacnes.length;

    let instacne: T;
    let name: any;
    let i: number;

    for (i = 0; i < ln; ++i) {
        instacne = instacnes[i];
        name = instacne[key];

        result[name] = instacne;
    }

    return result;
}
