const z = ["b","b'","r","r'","B","B'","R","R'","z","z'","z2","L","L'","F","F'","l","l'","f","f'"];
const zi = ["R","R'","B","B'","r","r'","b","b'","z","z'","z2","f","f'","l","l'","F","F'","L","L'"];
const z2 = ["B","B'","b","b'","R","R'","r","r'","z","z'","z2","F","F'","f","f'","L","L'","l","l'"];

const x = ["f","f'","r","r'","l","l'","B","B'","l","l'","L","L'","f","f'","F","F'"];
const xi = ["r","r'","R","R'","b","b'","B","B'","l","l'","L","L'","f","f'","F","F'"];
const x2 = ["r","r'","R","R'","b","b'","B","B'","l","l'","L","L'","f","f'","F","F'"];

const y = ["r","r'","R","R'","b","b'","B","B'","l","l'","L","L'","f","f'","F","F'"];
const yi = ["r","r'","R","R'","b","b'","B","B'","l","l'","L","L'","f","f'","F","F'"];
const y2 = ["r","r'","R","R'","b","b'","B","B'","l","l'","L","L'","f","f'","F","F'"];

const inverse = ["r'","r","R'","R","b'","b","B'","B","z'","z","z2","l'","l","L'","L","f'","f","F'","F"];
const space = ["r ","r' ","R ","R' ","b ","b' ","B ","B' ","z ","z' ","z2 ","l ","l' ","L ","L' ","f ","f' ","F ","F' "];

function rotate(input, rotation) {
    input = input.replace('’', '\'');

    switch (rotation) {
        case "z":
            return applyRotation(input, z);

        case "z'":
             return applyRotation(input, zi);

        case "z2":
            rotation = z2;
            return applyRotation(input, z2);

        case "x":
            rotation = x;
            return applyRotation(input, x);

        case "x'":
            rotation = xi;
            return applyRotation(input, xi);
               
        case "x2":
            rotation = x2;
            return applyRotation(input, x2);

        case "y":
            rotation = y;
            return applyRotation(input, y);

        case "y'":
            rotation = yi;
            return applyRotation(input, yi);

        case "y2":
            rotation = y2;
            return applyRotation(input, y2);

        case "space":
            rotation = space;
            return applyRotation(input, space);
        
        case "inverse":
            return applyRotation(input.split(" ").reverse().join(" "), inverse);
            
        case "zrot":
            return removeZRotations(input);

        default:
            return input;
    }        
}

function applyRotation(input, rotation) {
    inputArray = input.split(" ");
    for (let i = 0; i < inputArray.length; i++) {
        switch (inputArray[i]) {
            case "r":
                inputArray[i] = rotation[0];
                break;

            case "r'":
                inputArray[i] = rotation[1];
                break;

            case "R":
                inputArray[i] = rotation[2];
                break;

            case "R'":
                inputArray[i] = rotation[3];
                break;

            case "b":
                inputArray[i] = rotation[4];
                break;

            case "b'":
                inputArray[i] = rotation[5];
                break;

            case "B":
                inputArray[i] = rotation[6];
                break;

            case "B'":
                inputArray[i] = rotation[7];
                break;
                
            case "z":
                inputArray[i] = rotation[8];
                break;

            case "z'":
                inputArray[i] = rotation[9];
                break;

            case "z2":
                inputArray[i] = rotation[10];
                break;
        }
    }
    return inputArray.join(" ");
}

function removeZRotations(input) {
    if (input.length === 0) {
        return "";
    } 
    inputArray = input.split(" ");
    let output = [];
    while(inputArray.length > 0) {
        if(inputArray[0] === "z"){
            inputArray.shift();
            inputArray = applyRotation(inputArray.join(" "), zi).split(" ");
        }
        else if(inputArray[0] === "z'"){
            inputArray.shift();
            inputArray = applyRotation(inputArray.join(" "), z).split(" ");
        }
        else if(inputArray[0] === "z2"){
            inputArray.shift();
            inputArray = applyRotation(inputArray.join(" "), z2).split(" ");
        }
        else {
            output.push(inputArray[0]);
            inputArray.shift();
        }
    }
    return rotateOptimally(output.join(" "));

}

function rotateOptimally(input) {

    if ((/r/.test(input)&&(/R/.test(input))&&((/B/.test(input)&&(/b/.test(input)))))){
        return calculateOptimal4genRotation(input);
    }
    else if ((/r/.test(input)&&(/R/.test(input)&&(/B/.test(input))))){
        return input;
    }
    else if ((/r/.test(input)&&(/R/.test(input)&&(/b/.test(input))))){
        return rotate(input, "z'");
    }
    else if ((/b/.test(input)&&(/R/.test(input)&&(/B/.test(input))))){
        return rotate(input, "z");
    }
    else if ((/r/.test(input)&&(/b/.test(input)&&(/B/.test(input))))){
        return rotate(input, "z2");
    }
    else if ((/r/.test(input)&&(/b'/.test(input)))){
        return rotate(input, "z'");
    }
    else if ((/B/.test(input)&&(/b'/.test(input)))){
        return rotate(input, "z2");
    }
    else if ((/R/.test(input)&&(/B/.test(input)))){
        return rotate(input, "z");
    }
    else if ((/r/.test(input)&&(/B/.test(input)))){
        return calculateOptimal2genRotation(input);
    }
    else if ((/R/.test(input)&&(/b/.test(input)))){
        return calculateOptimal2genRotation(rotate(input, "z"));
    }
    return input
}

function calculateOptimal4genRotation(input) {
    let output = "";
    let leastbmoves = 100000;
    
    ["","z","z'","z2"].forEach(r => {
        let alg = rotate(input, r);
        let bcount = ((alg).match(/b/g) || []).length;
        if (bcount < leastbmoves) {
            leastbmoves = bcount
            output = alg
        }
    });

    return output
}

function calculateOptimal2genRotation(input) {
    let output = "";
    let leastBmoves = 100000;
    
    ["","z2"].forEach(r => {
        let alg = rotate(input, r);
        let bcount = ((alg).match(/B/g) || []).length;
        if (bcount < leastBmoves) {
            leastBmoves = bcount
            output = alg
        }
    });

    return output
}