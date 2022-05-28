await contract.owner();
// >> returns owner's address

// The trick here is to understand how the delegatecall low-level function
//  works, and how it can be exploited

// delegatecall is context-preserving: this means that the context of the
//  calling contract is preserved, even when the delegate contract is executing
//  whatever method was delegate called -- context here refers to the state of
//  a contract, including how it lays out its state variables in memory

// This is dangerous because it can allow delegate contract's to make malicious
//  modifications to the state of the calling contract, as we will do here

// Recall how state variables are stored in Solidity, as in they are stored in
//  what is a indexed array of 32-byte elements

// Note how the LibraryContract's setTime() method, the one that is being
//  being delegatecalled by the Preservation contract, changes the first state
//  variable listed in LibraryContract

// Because delegatecall is context preserving, when the first state variable is
//  seemingly being changed in the delegate contract, it is actually changing
//  the first state variable in the calling contract

// Hence, when Preservation makes a delegatecall to setTime(), while it thinks
//  that the storedTime state variable is being changed in an instance of the
//  LibraryContract, it is actually changing the value of timeZone1Library

// We will use this exploit to change the state of the Preservation contract so
//  that timeZone1Library holds the address of our malicious contract

// Then, our malicious contract will be setup in such a way that it changes the
//  value of owner in the Preservation contract, which is the third state
//  variable -- in essence, we'll also change our third state variable in the
//  malicious setTime() method

// Deploy the malicious contract (FakeLibrary) via Remix IDE

// call setFirstTime() in the Preservation contract, passing a parameter of
//  our malicious contract's address, with 24 hexadecimal 0s padded to the
//  left of the address, since the downcast from uint256 (the 256-bit type that
//  setFirstTime() is expecting) to address (which is a 160-bit type) will drop
//  the leftmost 96 bits
await contract.setFirstTime(
    "0x0000000000000000000000002120176300b9af12ea6eee42f696e71133090b85"
);

(await contrast.timeZone1Library()).toLowerCase() ==
    "0x2120176300b9af12ea6eee42f696e71133090b85";
// >> returns true

// now call setFirstTime() again, passing a parametter of our address in the
//  format as we did above
await contract.setFirstTime(
    "0x000000000000000000000000cda1048cf97b65ed9fb852ae677f02a28bd09ad3"
);

await contract.owner();
// >> returns my address

// submit
