
declare global {
    interface String {
        /**
         * 
         * @param find word to find in the string
         * @param replace word to replace the found wound in the string
         * @returns {string} it returns the input string after replacing all the occurances
         */
        replaceAll(find: string, replace: string): string;
    }
}

String.prototype.replaceAll = function (find: string, replace: string): string {
    let str = String(this)
    while (str.indexOf(find) > -1) {
        str = str.replace(find, replace)
    }
    return str
}


export { };
