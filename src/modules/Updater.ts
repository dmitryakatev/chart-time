import { toGroup } from "../utils/group";

type Create<T> = (config: any) => T;
type Update<T> = (instance: T, config: any) => void;
type Clean<T> = (instance: T) => void;

interface IInstance {
    type?: string;
}

export class Updater<T extends IInstance> {

    private defType: string;

    private cCreate: Create<T>;
    private cUpdate: Update<T>;
    private cClean: Clean<T>;

    constructor(defType: string, create: Create<T>, update: Update<T>, clean: Clean<T>) {
        this.defType = defType;

        this.cCreate = create;
        this.cUpdate = update;
        this.cClean = clean;
    }

    public update(config: any[], instacnes: T[] = []): T[] {
        const result: T[] = [];

        const ln: number = config.length;
        let defaultType: string;
        let group: { [propName: string]: T[] };

        if (this.defType) {
            defaultType = this.defType;
            group = toGroup(instacnes, "type");
        } else {
            defaultType = "unknown";
            group = { [defaultType]: instacnes };
        }

        for (let i: number = 0, type: string, instance: T; i < ln; ++i) {
            type = config[i].type || defaultType;

            if (group.hasOwnProperty(type) && group[type].length > 0) {
                instance = group[type].pop();
                this.cUpdate(instance, config[i]);
            } else {
                instance = this.cCreate(config[i]);
            }

            result.push(instance);
        }

        this.clean(group);

        return result;
    }

    private clean(group: { [propName: string]: T[] }): void {
        let i: number;
        let ln: number;
        let list: T[];

        for (const key in group) {
            if (group.hasOwnProperty(key)) {
                list = group[key];
                for (i = 0, ln = list.length; i < ln; ++i) {
                    this.cClean(list[i]);
                }
            }
        }
    }
}
