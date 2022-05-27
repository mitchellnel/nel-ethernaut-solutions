await contract.entrant();
// >> returns null address

// Like in the previous level, there are three parts to this level, represented
//  by each of the three gates.

/* Part 1: gateOne
Same as in the previous level: use our own malicious contract to interact with
 the level instance.
*/

/* Part 2: gateTwo
The key line to understand for this gate is:
 assembly { x := extcodesize(caller()) }

extcodesize() is an assembly level function, i.e. an opcode, that returns the
 size of the code at the address.

We can inuit that caller() is an assembly level function that returns the
 address of the code that is calling it.

The := operator is an assignment operator for Yul: an intermediate language
 that can be compiled to bytecode for different backends -- think of it as
 writing very, very simple assembly in our smart contracts.

This leads us to deduce that the code is assigning x the size of contract's
 code.

However, the gate requires that the size of our contract's code is equal to 0.
 This doesn't make immediate sense.

Doing some Googling (specifically looking here 
 https://ethereum.stackexchange.com/questions/45095/how-could-msg-sender-tx-origin-and-extcodesizecaller-0-be-true)
 we find out that no code is committed to the blockchain until after
 construction has finished. This implies that when extcodesize() is called
 during construction, it will return 0.

This tells us that we need to make sure extcodesize() is called when the return
 of caller() is under construction -- i.e. all our attack code needs to be in
 the constructor.
*/

/* Part 3: gateThree
This part is also similar to the previous level's gateThree.

We keep in mind our knowledge of how upcasting and downcasting work in
 Solidity.

We now also have to understand what the abi.encodePacked() function does, what
 keccak256 is/does, how an XOR is carried out in Solidity, and how integer
 underflow works.

Firstly, abi.encodePacked() is a function that can pack and "encode" some data
 into a length of bits.
 => abi.encodePacked(msg.sender) just packs the 20 byte sized msg.sender
    address into a length of 20 bytes

Next, keccak256 is a hashing function, which creates a deterministic hash value
 from some piece of data.
 => keccak256(abi.encodePacked(msg.sender)) will produce a deterministic hash
    value based off of the content in msg.sender

After that, and XOR (^) operation in Solidity is carried out bitwise -- each
 bit is XORed with the corresponding bit in the other value to give the 
 corresponding bit in the result.

Finally, each integer in Solidity has a minimum and maximum value. When one
 attempts to either exceed the maximum value or the minimum value, the integer
 will overflow to the minimum value or underflow to the maximum value,
 respectively.
 => this means that uint64(0) - 1 will underflow to the maximum value that can
    be held in a 64-bit unsigned integer, which is 2^64 - 1

In summary, to pass this gate we must have that:
 uint64(bytes8(keccak256(abi.encodePacked(msg.sender)))) ^ uint64(_gateKey)
 == 2^64 - 1

Since msg.sender is not predictable for us, it seems difficult to find what
 _gateKey should be. However, it follows that if A ^ B == C, then A ^ C == B

So, we can rearrange our gate passing condition to be that:
 uint64(bytes8(keccak256(abi.encodePacked(msg.sender)))) ^ (2^64 - 1)
 == uint64(_gateKey)

However, Solidity 0.8.0 onwards does not let us underflow or overflow integers,
 but since we know the result of 2^64 - 1, I just use that instead.

And this allows us to just let our contract work out what _gateKey should be
 based on its own address -- so programmatically implement this and pass it to
 GatekeeperTwo's enter() method.
*/

// So, we set up GatesmasherTwo as per the comments we have above

// We then deploy via Remix IDE, which invokes the constructor, which we have
//  designed to carry out the attack for us

await contract.entrant();
// >> returns my address

// submit
