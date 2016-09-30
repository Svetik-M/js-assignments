'use strict';

/**
 * Returns the array of 32 compass points and heading.
 * See details here:
 * https://en.wikipedia.org/wiki/Points_of_the_compass#32_cardinal_points
 *
 * @return {array}
 *
 * Example of return :
 *  [
 *     { abbreviation : 'N',     azimuth : 0.00 ,
 *     { abbreviation : 'NbE',   azimuth : 11.25 },
 *     { abbreviation : 'NNE',   azimuth : 22.50 },
 *       ...
 *     { abbreviation : 'NbW',   azimuth : 348.75 }
 *  ]
 */
function createCompassPoints() {
    var sides = ['N','E','S','W'];  // use array of cardinal directions only!
    var result = [];
    for (let i = 1; i <= sides.length; i++) {
        var v1 = sides[i-1], v2, vv;
        i === 4 ? v2 = sides[0] : v2 = sides[i];
        i % 2 === 0 ? vv = v2 + v1 : vv = v1 + v2;
        var abbreviation = [{abbreviation: v1},
                            {abbreviation: v1+'b'+v2},
                            {abbreviation: v1+vv},
                            {abbreviation: vv+'b'+v1},
                            {abbreviation: vv},
                            {abbreviation: vv+'b'+v2},
                            {abbreviation: v2+vv},
                            {abbreviation: v2+'b'+v1}]
        result = result.concat(abbreviation);
    }
    (function() {
        var azimuth = 0.00;
        for (var n = 0; n < result.length; n++) {
            result[n].azimuth = azimuth;
            azimuth += 11.25;
        }
    })(result);
    return result;
}
//console.log(createCompassPoints());

/**
 * Expand the braces of the specified string.
 * See https://en.wikipedia.org/wiki/Bash_(Unix_shell)#Brace_expansion
 *
 * In the input string, balanced pairs of braces containing comma-separated substrings
 * represent alternations that specify multiple alternatives which are to appear at that position in the output.
 *
 * @param {string} str
 * @return {Iterable.<string>}
 *
 * NOTE: The order of output string does not matter.
 *
 * Example:
 *   '~/{Downloads,Pictures}/*.{jpg,gif,png}'  => '~/Downloads/*.jpg',
 *                                                '~/Downloads/*.gif'
 *                                                '~/Downloads/*.png',
 *                                                '~/Pictures/*.jpg',
 *                                                '~/Pictures/*.gif',
 *                                                '~/Pictures/*.png'
 *
 *   'It{{em,alic}iz,erat}e{d,}, please.'  => 'Itemized, please.',
 *                                            'Itemize, please.',
 *                                            'Italicized, please.',
 *                                            'Italicize, please.',
 *                                            'Iterated, please.',
 *                                            'Iterate, please.'
 *
 *   'thumbnail.{png,jp{e,}g}'  => 'thumbnail.png'
 *                                 'thumbnail.jpeg'
 *                                 'thumbnail.jpg'
 *
 *   'nothing to do' => 'nothing to do'
 */
function* expandBraces(str) {
    var strArr = [str],
        result = [];

    while (strArr.length > 0) {
        let newStr = strArr.shift(),
            match = newStr.match(/\{([^{}]+)\}/);

        if (match) {
            for (let value of match[1].split(','))
                strArr.push(newStr.replace(match[0], value));
        } else if (result.indexOf(newStr) < 0) {
            result.push(newStr);
            yield newStr;
        }
    }
}


/**
 * Returns the ZigZag matrix
 *
 * The fundamental idea in the JPEG compression algorithm is to sort coefficient of given image by zigzag path and encode it.
 * In this task you are asked to implement a simple method to create a zigzag square matrix.
 * See details at https://en.wikipedia.org/wiki/JPEG#Entropy_coding
 * and zigzag path here: https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/JPEG_ZigZag.svg/220px-JPEG_ZigZag.svg.png
 *
 * @param {number} n - matrix dimension
 * @return {array}  n x n array of zigzag path
 *
 * @example
 *   1  => [[0]]
 *
 *   2  => [[ 0, 1 ],
 *          [ 2, 3 ]]
 *
 *         [[ 0, 1, 5 ],
 *   3  =>  [ 2, 4, 6 ],
 *          [ 3, 7, 8 ]]
 *
 *         [[ 0, 1, 5, 6 ],
 *   4 =>   [ 2, 4, 7,12 ],
 *          [ 3, 8,11,13 ],
 *          [ 9,10,14,15 ]]
 *
 */
function getZigZagMatrix(n) {
    var matrix = Array.from({length: n}, x => Array.from({length: n}, y => 0));
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if ((i + j) < n) {
                matrix[i][j] = 0.5 * (i + j + 1) * (i + j + 2) + ((i + j) % 2 == 0 ? -i : -j) - 1;
            } else {
                let p = n - i - 1;
                let q = n - j - 1;
                matrix[i][j] = n * n + 1 - (0.5 * (p + q + 1) * (p + q + 2) + ((p + q) % 2 == 0 ? -p : -q)) - 1;
            }
        }
    }
    return matrix;
}

    /*var matrix = Array.from({length: n}, x => Array.from([]));
    var curr = (n-1)*2+1; // количество диагональных линий матрицы
    var i = 0;
    var first = 0;
    var last = 0;
    function fn(fs, lt, k) {
        if(k % 2 === 0) {
                for (var a = fs; a <= lt; a++) {
                    matrix[a].push(i);
                    i += 1;
                }
                if (k <= n){
                    first = lt + 1;
                    last = fs;
                } else {
                    last = fs + 1;
                    first = lt;
                }
            } else {
                for (var b = fs; b >= lt; b--) {
                    matrix[b].push(i);
                    i += 1;
                }
                if (k <= n) {
                    last = fs + 1;
                    first = lt;
                } else {
                    first = lt + 1;
                    last = fs;
                }
            }
    }
    // заполняем матрицу сверху от главной диагонали и по главной диагонали
    for (let k = 1; k <= n; k++) {
        fn(first, last, k);
    }
    // заполняем матрицу снизу от главной диагонали
    if (Math.ceil(curr/2) % 2 === 0) {
        first = n-1;
        last = 1;
    } else {
        first = 1;
        last = n-1;
    }
    for (let k = n+1; k <= curr; k++) {
            fn(first, last, k);
    }
    return matrix;
}*/

//console.log(getZigZagMatrix(5));


/**
 * Returns true if specified subset of dominoes can be placed in a row accroding to the game rules.
 * Dominoes details see at: https://en.wikipedia.org/wiki/Dominoes
 *
 * Each domino tile presented as an array [x,y] of tile value.
 * For example, the subset [1, 1], [2, 2], [1, 2] can be arranged in a row (as [1, 1] followed by [1, 2] followed by [2, 2]),
 * while the subset [1, 1], [0, 3], [1, 4] can not be arranged in one row.
 * NOTE that as in usual dominoes playing any pair [i, j] can also be treated as [j, i].
 *
 * @params {array} dominoes
 * @return {bool}
 *
 * @example
 *
 * [[0,1],  [1,1]] => true
 * [[1,1], [2,2], [1,5], [5,6], [6,3]] => false
 * [[1,3], [2,3], [1,4], [2,4], [1,5], [2,5]]  => true
 * [[0,0], [0,1], [1,1], [0,2], [1,2], [2,2], [0,3], [1,3], [2,3], [3,3]] => false
 *
 */
function canDominoesMakeRow(dominoes) {
    var arrayOfNum = dominoes.reduce((prev, curr) => {
       return prev.concat(curr);
    }).sort();

    for (let i = arrayOfNum.length-1; i >= 0; i--) {
        if (arrayOfNum[i] === arrayOfNum[i-1]) arrayOfNum.splice(i-1, 2);
    }

    var len = dominoes.map((v, i) => {
        var bool = arrayOfNum[0] === v[0] || arrayOfNum[1] === v[0];
        if (v[0] === v[1] && !bool) return v[0];
    }).join('').length

    return arrayOfNum.length <= 2 && len === 0;
}
//console.log(canDominoesMakeRow([[0,1],  [1,1]]));

/**
 * Returns the string expression of the specified ordered list of integers.
 *
 * A format for expressing an ordered list of integers is to use a comma separated list of either:
 *   - individual integers
 *   - or a range of integers denoted by the starting integer separated from the end integer in the range by a dash, '-'.
 *     (The range includes all integers in the interval including both endpoints)
 *     The range syntax is to be used only for, and for every range that expands to more than two values.
 *
 * @params {array} nums
 * @return {bool}
 *
 * @example
 *
 * [ 0, 1, 2, 3, 4, 5 ]   => '0-5'
 * [ 1, 4, 5 ]            => '1,4,5'
 * [ 0, 1, 2, 5, 7, 8, 9] => '0-2,5,7-9'
 * [ 1, 2, 4, 5]          => '1,2,4,5'
 */
function extractRanges(nums) {
    var str = nums.map((v, i) => {
        return nums[i-1] === v-1 && nums[i+1] === v+1 ? '-' : v;
    }).join();
    while (/(,*-,*-,*)|(,-,)/g.test(str)) {
        str = str.replace(/(,*-,*-,*)|(,-,)/g, '-');
    }
    return str;
}
//console.log(extractRanges([ 0, 1, 2, 3, 4, 5 ]))

module.exports = {
    createCompassPoints : createCompassPoints,
    expandBraces : expandBraces,
    getZigZagMatrix : getZigZagMatrix,
    canDominoesMakeRow : canDominoesMakeRow,
    extractRanges : extractRanges
};
