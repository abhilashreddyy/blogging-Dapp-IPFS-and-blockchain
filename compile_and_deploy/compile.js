// import required modules
var solc = require('solc');
var fs = require('fs');
let Web3 = require('web3');
let web3 = new Web3();

var inputFilePath = process.argv[2];
var outputPath = process.argv[3];


var contractSolidity = fs.readFileSync(inputFilePath , 'utf-8');
if (!contractSolidity)
    return console.error('unable to read file: ' + inputFilePath);

var output = solc.compile(contractSolidity, 1);
console.log(output);
var temp_abi = output.contracts[":blog"].interface;
var temp_code = output.contracts[":blog"].bytecode;
fs.writeFileSync(outputPath + '/' + "blog" + '.abi', temp_abi, 'utf-8');
fs.writeFileSync(outputPath + '/' + "blog" + '.code', temp_code, 'utf-8');
