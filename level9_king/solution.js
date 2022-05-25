await contract._king();
// >> returns current king's address

await contract.prize();
// >> returns 0.001 Ether -- to become King we need to send at least 0.001
//     Ether to the King contract

// We will break the King contract by reverting any attempts to transfer Ether
//  to our own contract -- we do this using the revert() function in our
//  receive() fallback function

// In our contract, we try to becomeKing() and then revert the King contract
//  trying to transfer us Ether

// Then deploy on Remix IDE **with at least 0.002 Ether
// Then call becomeKing() -- I had to fiddle with the gas amounts to make this
//  work

await contract._king();
// >> returns my address

// submit
