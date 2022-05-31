// Looking at the contract, we notice that the Denial contract makes a
//  low-level call to the partner contract, just sending some value. This means
//  that the receive() fallback function (if defined) will be the invoked
//  method in the partner contract when the Denial contract attempts to send
//  some value to it

// Initially, I thought to just implement a revert() call in my malicious
//  contract's fallback function, but this would only cause the low-level call
//  to fail, and not actually deny the owner from making withdrawals

// Instead, I noticed that the level specifies a maximum gas for the
//  transaction, and the Denial contract doesn't specify a gas to spend on
//  sending balance to the partner contract -- this gave me an idea to deplete
//  the overall withdraw() transaction of gas, using some code in the partner
//  contract, in order to prevent the owner.transfer() call from executing

// The easiest way to do this is an infinite loop

await contract.partner();
// >> returns null address

// Deploy malicious Denier contract via Remix IDE

await contract.setWithdrawPartner(denierContractAddress);

await contract.partner();
// >> returns address of Denier contract

// submit
