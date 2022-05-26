await contract.entrant();
// >> returns null address

// There are essentially three parts to this level, represented by each of the
//  three "gate" access modifiers

/* Part 1: gateOne
Recalling what we know about msg.sender and tx.origin, to pass through this
 gate we simply need to use another contract to register ourselves as an 
 entrant, which will satisfy the msg.sender != tx.origin requiement -- easy
 enough.
*/

/* Part 2: gateTwo
This gate requires us to know about the gasleft() function -- this function
 returns the remaining gas for the transaction (it's like the fuel meter in a
 car).

To pass through this gate, we need to ensure that by the time we're executing
 gasleft(), we have 8191 gas remaining.

We can control the amount of gas we use for a transaction by changing the
 options when we make a call() in our contract.

Working out exactly how much gas to send with the transaction will require
 debugging and trial and error. This was pretty tedious.

I compiled, using Soliditiy v0.6.12, a copy of the GatekeeperOne contract on
 Remix. I then changed gateOne slightly (see the contract in my directory) so
 that it would be satisfied on Remix. Then, I deployed the contract using the
 JavaScript VM, and called enter() with my calculated gateKey (it actually
 doesn't matter).

The transaction reverted, since the gas is incorrect. But I used the Remix
 debugger to try and work out how much gas was used to, and including, the
 point in the code where the GAS opcode is called.

I did this simply by stepping through each opcode of the transaction, from the
 beginning, summing the gas usaged quoted by the debugger for each opcode up to
 and including the point where the GAS opcode is called.

This gave me a value of 246 gas, so I added this to a multiple of 8191 (I like
 the number 3 so I chose 3) to give me a gas value of 246 + 8191*3 = 24819 to
 use.

This didn't work, and since I checked my gas counting 3 times, I wasn't sure
 exactly why.

However, some Googling let me to find out that different compiler versions and
 different levels of optimisations would lead to different gas values being
 used for similar transactions for different contracts.

As the GatekeeperOne instance contract is no longer verified on Etherscan, I
 couldn't take a look at the specific compiler version used or the level of
 optimisation used.

So I turned to brute force (as other solutions have too).

I figured the true gas value couldn't be far off from 246, so I just decided to
 use a range of 33 either side, and make calls in a for loop (as you can see in
 my GatesmasherOne contract).
 
Eventually, the call worked when gas was set to 24827, which means that the
 true gas value was 254.

NOTE: this was the last part of the contract I had to configure to get the
       attack to work
*/

/* Part 3: gateThree
This gate requires us to understand how casting, both up and down, will affect
 the value of a variable.

This helps: https://www.tutorialspoint.com/solidity/solidity_conversions.htm

From this, we have two things to keep in mind:
- conversion to as maller type costs higher order bits (i.e. leftmost bits)
- conversion to a higher type adds padding bits to the left

We will have to pass in some key that satisfies the 3 require statements for
 this access modifier.

We start with the last require() function call, since this relies on tx.origin,
 a value that is known to us.

Note that _gateKey itself is an 8 byte == 64 bit value

All the require statements use uint64(_gateKey) -- this is just casting bytes8
 to uint64, and no information is lost since 64 bits == 8 bytes

My wallet address (tx.origin) is 0xcDA1048cf97B65ED9fb852AE677F02a28bd09ad3 --
 this is 20 bytes, or 160 bits => uint16(tx.origin) will truncate the upper 144
 bits (18 bytes == 36 hexadecimal digits)
 => uint16(tx.origin) = 0x9ad3

Then, uint16(tx.origin) needs to be equal to uint32(uint64(_gateKey)) --
 comparing uints of two different sizes will upcast the smaller sized value to
 ensure that no information is lost (which would occur if we downcasted the
 value of larger size).

So, upcasting uint16(tx.origin) to uint32 requires adding 16 bits of padding
 to the left, and gives us a value of 0x00009ad3
 => we now know that uint32(uint64(_gateKey)) == 0x00009ad3
 => downcasting from uint64 to uint32 means that we lose the upper 32 bits of
    information, so we have that _gateKey == 0x****00009ad3 (*s indicate don't
    care)
 => thus, to pass the third require statement, we must have that _gateKey is
    0x********00009ad3

Looking at the first require statement now:
 => we need that uint32(uint64(_gateKey)) == uint16(uint64(_gateKey))
 => let's try the _gateKey candidate we found above
 => truncating 0x********00009ad3 to 32 bits gives 0x00009ad3, and truncating
    0x********00009ad3 to 16 bits, then implicity casting to 32 bits gives
    0x00009ad3
 => all good here

Looking at the second require statement now:
 => we need that uint32(uint64(_gateKey)) != uint64(_gateKey)
 => let's try the _gateKey candidate we found above
 => truncating 0x********00009ad3 to 32 bits gives 0x00009ad3, then implicity
    casting to 64 bits givex 0x000000009ad3
 => this tells us that the * values in our _gateKey cannot be 0s

Hence, we find that our gateKey is 0x********00009ad3, where * != 0

I use 0x1111111100009ad3
*/

// As long as we fulfill each part when we call the GatesmasherOne's
//  smashGate() method, we'll be registered as an entrant

// I deploy via Remix IDE and call smashGate()

await contract.entrant();
// >> returns my address

// submit
