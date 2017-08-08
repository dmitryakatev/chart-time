
interface IParsedNumber {
    minus: string;
    i: string;
    f: string;
    e: string;
}

const INTEGER: string = "i";
const FLOAT: string = "f";
const EXPONENT: string = "e";

const minValue: number = 1000000; // 1'000'000
const minValueLn: number = minValue.toString().length; // 7

const symbol = {
    ".": FLOAT,
    "e": EXPONENT,
    "E": EXPONENT,
    "*": INTEGER, // подойдет любой тип
};

function parseNumber(num: number): IParsedNumber {
    const str: string = num.toString() + "*"; // * - конец строки
    const minus: boolean = str.charAt(0) === "-";
    const length: number = str.length;

    let zero: boolean = true;
    let index: number = 0;
    let char: string;

    let type: string = INTEGER;
    const result: IParsedNumber = {
        minus: (minus ? "-" : ""),
        i: "",
        e: "",
        f: "",
    };

    if (minus) {
        ++index;
    }

    while (index < length) {
        char = str.charAt(index++);

        if (symbol.hasOwnProperty(char)) {
            if (zero) {
                result[type] = "";
            } else {
                zero = true;
            }

            type = symbol[char];
        } else {
            if (char !== "0") {
                zero = false;
            }

            result[type] += char;
        }
    }

    return result;
}

// return [factor, exponent]
export function findFactor(num: number): number[] {
    if (num >= minValue && num < minValue * 10) {
        return [1, 0];
    }

    const parsedNumber: IParsedNumber = parseNumber(num);
    let strValue: string = parsedNumber[EXPONENT];
    let exponent: number = strValue === "" ? 0 : parseInt(strValue, 10);

    strValue = parsedNumber[INTEGER];

    if (strValue.length > minValueLn) {
        exponent += strValue.length - minValueLn;
    } else { // strValue.length < minValueLn
        exponent -= minValueLn - strValue.length;
    }

    return [Math.pow(10, exponent), exponent];
}
