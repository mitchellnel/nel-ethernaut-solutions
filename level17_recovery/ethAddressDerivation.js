// module versions:
// rlp@2.0.0
// keccak@1.4.0

const rlp = require("rlp");
const keccak = require("keccak");
const web3 = require("web3");

let nonce = 0x01; // The nonce must be a hex literal!
let sender = "0x12B3B07B37a09Ff388835301d979c54DDc08e2e0"; // Requires a hex string as input!

let input_arr = [sender, nonce];
var rlp_encoded = rlp.encode(input_arr);

console.log(rlp_encoded);

let contract_address_long = keccak("keccak256")
    .update(rlp.encode([sender, nonce]))
    .digest("hex");

let contract_address = "0x" + contract_address_long.substring(24); // Trim the first 24 characters, add the leading "0x"

// make checksum address (correct capitalisation)
contract_address = web3.utils.toChecksumAddress(contract_address);

console.log("contract_address: " + contract_address);
