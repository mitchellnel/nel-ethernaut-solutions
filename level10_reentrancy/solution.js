await getBalance(instance);
// >> returns 0.001 Ether

// Again, we'll take advantage of the receive() fallback function in our
//  ReentrantAttacker contract to drain the Reentrance contract of Ether

// We'll use the contract constructor to donate some Ether -- I donated 0.001
//  Ether -- using the donate() method, passing our ReentrantAttacker contract
//  address as the parameter

await getBalance(instance);
// >> returns 0.002 Ether

fromWei(
    (
        await contract.balanceOf("0x54b7B69298aF930C386B160cc27fAE8032D95dE8")
    ).toString(),
    "ether"
);
// >> returns 0.001 Ether

// Then, we setup up the receive() fallback function in our ReentrantAttacker
//  contract to call withdraw() for the remaining Reentrance contract balance

// After that will use a method to call withdraw() from our ReentrantAttacker
//  contract, using our initial donation as the parameter

// This will lead to the receipt of our initial donation, which will be handled
//  by the receive() fallback function, which will call withdraw() passing the
//  entire Reentrance contract balance as a parameter, thereby draiing it of
//  funds completely

// I deployed the contract via Remix IDE and made the calls from there

// ** Be sure to set the gas limit high enough when making the
//    reentrantWithdraw() method call on your contract, otherwise there may not
//    be not be enough gas to make the reentrant series of calls

// submit
