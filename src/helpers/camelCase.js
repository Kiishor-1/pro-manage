export default function separateCamelCase(str) {
    return str.replace(/([a-z])([A-Z])/g, '$1 $2');
}


