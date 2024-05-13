export default function isEmpty(value: any) {
    switch (Object.prototype.toString.call(value)) {
        case '[object Undefined]':
            return value === void 0;
        case '[object Null]':
            return value === null;
        case '[object Number]':
            return isNaN(value);
        case '[object String]':
            return value === '';
        case '[object Boolean]':
            return false;
        case '[object Object]':
            return Object.keys(value).length === 0;
        case '[object Array]':
            return value.length === 0;
        default:
            return false;
    }
}
