'use strict';

/**
 * Returns true if word occurrs in the specified word snaking puzzle.
 * Each words can be constructed using "snake" path inside a grid with top, left, right and bottom directions.
 * Each char can be used only once ("snake" should not cross itself).
 *
 * @param {array} puzzle
 * @param {array} searchStr
 * @return {bool}
 *
 * @example
 *   var puzzle = [
 *      'ANGULAR',
 *      'REDNCAE',
 *      'RFIDTCL',
 *      'AGNEGSA',
 *      'YTIRTSP',
 *   ];
 *   'ANGULAR'   => true   (first row)
 *   'REACT'     => true   (starting from the top-right R adn follow the ↓ ← ← ↓ )
 *   'UNDEFINED' => true
 *   'RED'       => true
 *   'STRING'    => true
 *   'CLASS'     => true
 *   'ARRAY'     => true   (first column)
 *   'FUNCTION'  => false
 *   'NULL'      => false
 */
function findStringInSnakingPuzzle(puzzle, searchStr) {
    var str = puzzle.join('');
    var firstLetter = [];

    function check(j1, i1, index) {
        if (i1 > 0 && puzzle[j1][i1-1] === searchStr[index]) {
            return j1*puzzle[0].length + i1-1;
        } else if (i1 < puzzle[0].length-1 && puzzle[j1][i1+1] === searchStr[index]) {
            return j1*puzzle[0].length + i1+1;
        } else if (j1 > 0 && puzzle[j1-1][i1] === searchStr[index]) {
            return (j1-1)*puzzle[0].length + i1;
        } else if (j1 < puzzle.length-1 && puzzle[j1+1][i1] === searchStr[index]) {
            return (j1+1)*puzzle[0].length + i1;
        }
    }

    function findString(index, indexLetter, indexes) {
        var j = Math.floor(index/puzzle[0].length);
        var i = index - j*puzzle[0].length;
        var ind1 = check(j, i, indexLetter);
        var ind2 = check(j, i, indexLetter) &&
                   (i > 0 && check(j, i-1, indexLetter+1)) ||
                   (i < puzzle[0].length-1 && check(j, i+1, indexLetter+1)) ||
                   (j > 0 && check(j-1, i, indexLetter+1)) ||
                   (j < puzzle.length-1 && check(j+1, i, indexLetter+1));
        var res;

        if (ind2) {
            indexes[indexes.length-1] = ind1;
            indexes.push(ind2);
            indexLetter +=1;
            findString(ind1, indexLetter, indexes);
        }

        if (indexes.length === searchStr.length) {
            indexes = indexes.sort((a,b) => {
                if (a < b) return -1;
                if (a > b) return 1;
                return 0;
            });
            var arr = [];
            for (let a = indexes.length-1; a < 0; a--) {
                if(indexes[a] === indexes[a-1]) arr.push(indexes[a]);
            }
            if (arr.length === 0) res = true;
        }
        return res;
    }

    for (let k = 0; str.indexOf(searchStr[0],k) !== -1; k = str.indexOf(searchStr[0],k) + 1) {
        firstLetter.push(str.indexOf(searchStr[0],k));
    }
    for (let m = 0; m < firstLetter.length; m++){
        var result = findString(firstLetter[m], 1, [firstLetter[m],undefined]);
        if (result === true) return true;
    }
    return false;
}


/**
 * Returns all permutations of the specified string.
 * Assume all chars in the specified string are different.
 * The order of permutations does not matter.
 *
 * @param {string} chars
 * @return {Iterable.<string>} all posible strings constructed with the chars from the specfied string
 *
 * @example
 *    'ab'  => 'ab','ba'
 *    'abc' => 'abc','acb','bac','bca','cab','cba'
 */
function* getPermutations(chars) {
    function* genPermut(start, rest, str) {
        if (rest.length === 0) {
            yield str;
        } else {
            for (let i = 0; i < rest.length; i++) {
                let perm1 = Array.from(start);
                let perm2 = rest.slice(0, rest.length);
                let char = perm2.splice(i,1);
                perm1 = perm1.concat(char);
                str = perm1.concat(perm2).join('');
                yield* genPermut(perm1, perm2, str);
            }
        }
    }
    yield* genPermut([], chars.split(''), '');
}


/**
 * Returns the most profit from stock quotes.
 * Stock quotes are stores in an array in order of date.
 * The stock profit is the difference in prices in buying and selling stock.
 * Each day, you can either buy one unit of stock, sell any number of stock units you have already bought, or do nothing.
 * Therefore, the most profit is the maximum difference of all pairs in a sequence of stock prices.
 *
 * @param {array} quotes
 * @return {number} max profit
 *
 * @example
 *    [ 1, 2, 3, 4, 5, 6]   => 15  (buy at 1,2,3,4,5 and then sell all at 6)
 *    [ 6, 5, 4, 3, 2, 1]   => 0   (nothing to buy)
 *    [ 1, 6, 5, 10, 8, 7 ] => 18  (buy at 1,6,5 and sell all at 10)
 */
function getMostProfitFromStockQuotes(quotes) {
    var profit = 0;

    while (quotes.length > 1) {
        var maxQuot = Math.max.apply(null, quotes);
        let index = quotes.indexOf(maxQuot);
        let arr = quotes.slice(0, index);
        profit += arr.reduce((prev, curr) => {return prev += maxQuot - curr}, 0);
        quotes.splice(0, arr.length+1);
    }

    return profit;
}


/**
 * Class representing the url shorting helper.
 * Feel free to implement any algorithm, but do not store link in the key\value stores.
 * The short link can be at least 1.5 times shorter than the original url.
 *
 * @class
 *
 * @example
 *
 *     var urlShortener = new UrlShortener();
 *     var shortLink = urlShortener.encode('https://en.wikipedia.org/wiki/URL_shortening');
 *     var original  = urlShortener.decode(shortLink); // => 'https://en.wikipedia.org/wiki/URL_shortening'
 *
 */
function UrlShortener() {
    this.urlAllowedChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"+
                           "abcdefghijklmnopqrstuvwxyz"+
                           "0123456789-_.~!*'();:@&=+$,/?#[]";

    this.strNumToLetter = function(strNum) {
        let numA = parseInt(strNum);
        return this.urlAllowedChars[numA];
    }
}

UrlShortener.prototype = {

    encode: function(url) {
        var URLArr = Array.from(url);
        var numStr = URLArr.reduce((prev, curr) => {
            var index = this.urlAllowedChars.indexOf(curr);
            var strNum = index < 10 ? '0' + index : '' + index;
            return prev + strNum;
        }, '');

        if (numStr.length % 4) numStr += '85';

        var shortURL = '';
        while(numStr.length > 3) {
            var charCode = numStr.slice(0, 4);
            shortURL += String.fromCharCode(charCode);
            numStr = numStr.replace(charCode, '');
        }
        return shortURL;
    },

    decode: function(code) {
        var codeArr = Array.from(code);

        var str = codeArr.reduce((prev, curr) => {
            var charCode = curr.charCodeAt(0);
            prev.push(Math.floor(charCode / 100));
            prev.push(charCode % 100)
            return prev;
        }, []);

        var lastInd = str.length - 1;
        if (str[lastInd] === 85)
            str.splice(lastInd, 1);

        var URLArr = str.map(v => {
            var num = parseInt(v),
                char = this.urlAllowedChars[num];
            return char;
        });
        return URLArr.join('');
    }
}


module.exports = {
    findStringInSnakingPuzzle: findStringInSnakingPuzzle,
    getPermutations: getPermutations,
    getMostProfitFromStockQuotes: getMostProfitFromStockQuotes,
    UrlShortener: UrlShortener
};
