await contract.owner();
// >> returns some owner address

// we can interact with the contract in this level the same way we did the
//  last

// the key is that tx.origin will be the address of the account making the
//  transaction, whereas if we call changeOwner() from another contract,
//  then msg.sender will be the address of that contract

// since they will be different this allows us to take ownership of the
//  contract

// deploy CallTelephone contract via Remix IDE
// call hackTelephone() method

await contract.owner();
// >> returns my address

// submit
