await getBalance(instance);
// >> returns 0

// From https://docs.soliditylang.org/en/v0.8.14/introduction-to-smart-contracts.html?highlight=self%20destruct#deactivate-and-self-destruct
// We can use the selfdestruct(address) function to force remaining Ether in
//  the calling contract to be sent to address

// So we create a contract for this purpose, creating a hackForce() method that
//  invokes selfdestruct

// We also make sure that the constructor for the contract is designated
//  payable, so that we can deploy with some value (otherwise, deploy
//  transaction will revert)

// Then deploy on Remix IDE **with some value**
// -- I use 0.001 Ether or 1000000 Gwei

// Then call hackForce()

await getBalance(instance);
// >> returns 0.001

// submit
