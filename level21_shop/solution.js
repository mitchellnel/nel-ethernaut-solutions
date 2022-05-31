// We use a very similar strategy to the Elevator level

// However, this time, the contract to be called is marked view, which means
//  that it cannot change state in our malicious contract

// However, the Shop contract was kind enough to provide to us a Boolean
//  variable that we can use in place of the one we would use in our malicious
//  contract

// So we use very similar code in our Shoplifter contract, using the isSold
//  state variable to work out when price() is called the 1st or the 2nd time

// Note: first time we've used abi.decode(bytesToDecode, (typeToDecodeInto))

(await contract.price())
    .toString()(
        // >> returns 100

        // Deploy Shoplifter contract via Remix IDE, execute shoplift() method

        await contract.price()
    )
    .toString();
// >> returns 0

// submit
