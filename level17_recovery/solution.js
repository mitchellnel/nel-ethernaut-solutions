await getBalance(instance);
// >> returns 0

// The key to solving this level is understanding how addresses for Ethereum
//  contracts are derived

// The Solidity docs (https://docs.soliditylang.org/en/v0.8.14/introduction-to-smart-contracts.html#accounts)
//  simply state that "the address of a contract is determined at the time the
//  contract is created (it is derived from the creator address and the number
//  of transactions sent from that address, the so-called “nonce”)."

// However, the docs do not specifically state the method by which the creator
//  address and the creator's nonce are utilised to derive the contract address

// Doing some more looking around, we find this StackOverflow article: https://ethereum.stackexchange.com/questions/760/how-is-the-address-of-an-ethereum-contract-computed
//  which states that "The address for an Ethereum contract is
//  deterministically computed from the address of its creator (sender) and how
//  many transactions the creator has sent (nonce). The sender and nonce are
//  RLP encoded and then hashed with Keccak-256."

// In fact, it even provides Solidity code which we could utilise to derive the
//  address of a newly deployed contract -- but it seems easier to use a
//  Node.js script that another answer provides to us

// This script can be found in the ethAddressDerivation.js file (given that it
//  uses some Node packages, we have to do the usual npm/yarn setup to run it)

// I had some errors using the most recent versions of rlp and keccak, so I
//  installed the versions listed in the comment at the top of the file

// Since the Recovery contract is what calls the function to create a new token
//  contract, that is the sending address

// Additionally, the level tells us that one token contract was already created
//  by the Recovery contract instance -- this means that one transaction has
//  been sent by the contract, and so the nonce is 1

// I also used the web3 package to work out the correctly capitalised version
//  of the address using the web3.utils.checksum() function

// This gave me an address that I confirmed via Etherscan (of the instance
//  generated for my level) was the correct contract address to be looking at

// Given that I don't know what the contract creator's address is, I used the
//  token contract's in-built destroy() method to forcefully send the 0.001
//  Ether to the recovery contract (since selfdestruct() is a way to get around
//  not being payable)

let payload = web3.eth.abi.encodeFunctionCall(
    {
        name: "destroy",
        type: "function",
        inputs: [
            {
                type: "address",
                name: "_to",
            },
        ],
    },
    [instance]
);

await web3.eth.sendTransaction({
    from: player,
    to: "0xbE31d6261767A12b459BBe804547cB024d5d2E98",
    data: payload,
});

await getBalance(instance);
// >> returns 0.001

// submit
