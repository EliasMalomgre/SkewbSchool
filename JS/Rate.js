const tier1 = 1.25;
const tier2 = 1;
const tier3 = 0.75;
const reduction1 = 0.25;
const reduction2 = 0.5;
const reduction3 = 0.75;
const reduction4 = 1;
const bonus1 = 0.25;
const bonus2 = 0.5;
const bonus3 = 0.75;
const bonus4 = 1;

const triggers = [
    //TIER1
    [/(r' R r )|(R' B R )|(B' b B )|(b' r b )/g, /(r' R' r )|(R' B' R )|(B' b' B )|(b' r' b )/g, /(R r' R' )|(B R' B' )|(b B' b' )|(r b' r' )/g,
    /(R r R' )|(B R B' )|(b B b' )|(r b r' )/g, /(r B r' )|(R b R' )|(B r B' )|(b R b' )/g, /(r' B' r )|(R' b' R )|(B' r' B )|(b' R' b )/g],

    //TIER2
    [/(r R r )|(R B R )|(B b B )|(b r b )/g,/(r R' r )|(R B' R )|(B b' B )|(b r' b )/g,/(R' r R' )|(B' R B' )|(b' B b' )|(r' b r' )/g,
    /(R r' R )|(B R' B )|(b B' b )|(r b' r )/g,/(r' R r' )|(R' B R' )|(B' b B' )|(b' r b' )/g,/(R' r R )|(B' R B )|(b' B b )|(r' b r )/g,
    /(R' r' R )|(B' R' B )|(b' B' b )|(r' b' r )/g],

    //TIER3
    [/(r R r' )|(R B R' )|(B b B' )|(b r b' )/g,/(r R' r' )|(R B' R' )|(B b' B' )|(b r' b' )/g,/(R r R )|(B R B )|(b B b )|(r b r )/g,
        /(r' R' r' )|(R' B' R' )|(B' b' B' )|(b' r' b' )/g,/(R' r' R' )|(B' R' B' )|(b' B' b' )|(r' b' r' )/g,
        /(r B' r' )|(R b' R' )|(B r' B' )|(b R' b' )/g,  /(r' B r )|(R' b R )|(B' r B )|(b' R b )/g],

    //DEDUCTION1
    [/(R' r' R' r' )|(B' R' B' R' )|(b' B' b' B' )|(r' b' r' b' )/g, /(R r R' r )|(B R B' R )|(b B b' B )|(r b r' b )/g,
    /(r B r )|(R b R )|(B r B )|(b R b )/g, /(r' B' r' )|(R' b' R' )|(B' r' B' )|(b' R' b' )/g, /(B R' B R' )|(R r' R r' )|(b B' b B' )|(r b' r b' )/g],

    //DEDUCTION2
    [/(R r R r )|(B R B R )|(b B b B )|(r b r b )/g],

    //DEDUCTION3
    [],

    //DEDUCTION4
    [],

    //BONUS1
    [],

    //BONUS2
    [/(r' R r R )|(R' B R B )|(B' b B b )|(b' r b r )/g,
        /(B R r R' )|(b B R B' )|(r b B b' )|(R r b r' )/g,/(B' R r R' )|(b' B R B' )|(r' b B b' )|(R' r b r' )/g ],

    //BONUS3
    [],

    //BONUS4
    []
];

function rate(input, cancelMove = "") {
    let algs = input.split(/\n/);
    let ratedAlgs = []
    algs.forEach(alg => {
        if((alg).match(/([rRbB][']?[ ]?){2,}/g))
        ratedAlgs.push(rateAlg(alg, cancelMove));       
    });
    ratedAlgs = ratedAlgs.filter(alg => alg != null && alg[0] > 0 && alg[1] != null)
    .sort(function(a, b) {
        return b[0] - a[0]
    })
    .map(alg => alg[0] + " " + alg[1]);

    return ratedAlgs;
}

function rateAlg(input, cancelMove) {
    let score=0;
    let temp = input;

    if (cancelMove!=="") {
        while ((temp.charAt(0) === "'") || (temp.charAt(0) === " ")) {
            temp = temp.substring(1);
        }
        if ((temp.charAt(0) !== cancelMove)) {
            score = -100000;
        }
        temp = temp.substring(1);
        while ((temp.charAt(0) === "'") || (temp.charAt(0) === " ")) {
            temp = temp.substring(1);
        }
    }

    for (let i = 0; i < triggers.length; i++) {
        for (let j = 0; j < triggers[i].length; j++) {
            const regex = triggers[i][j];
            if (i === 0){
                score += ((input).match(regex) || []).length*tier1;
            }
            else if (i === 1){
                score += ((input).match(regex) || []).length*tier2;
            }
            else if (i === 2){
                score += ((input).match(regex) || []).length*tier3;
            }
            else if (i === 3){
                score -= ((input).match(regex) || []).length*reduction1;
            }
            else if (i === 4){
                score -= ((input).match(regex) || []).length*reduction2;
            }
            else if (i === 5){
                score -= ((input).match(regex) || []).length*reduction3;
            }
            else if (i === 6){
                score -= ((input).match(regex) || []).length*reduction4;
            }
            else if (i === 7){
                score += ((input).match(regex) || []).length*bonus1;
            }
            else if (i === 8){
                score += ((input).match(regex) || []).length*bonus2;
            }
            else if (i === 9){
                score += ((input).match(regex) || []).length*bonus3;
            }
            else if (i === 10){
                score += ((input).match(regex) || []).length*bonus4;
            }
        }
    }
    score += moveCountReward(input);
        
    return [score, rotateOptimally(input)]
}

function moveCount(input) {
    let count = 0;
    for (let i = 0; i < input.length; i++) {
        if ((input[i] === "r") || (input[i] === "R") || (input[i] === "b") || (input[i] === "B")) {
            count++;
        }
    }
    return count;

}

function moveCountReward(input) {
    let move = moveCount(input)
    if (move < 9) {
        return (9 - move) * 1.75  
    }
    else if (move > 9) {
        return (9 - move) * 1.25  
    }
    return 0;
}

