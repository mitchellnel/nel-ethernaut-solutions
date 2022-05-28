// We get to write assembly!!!

// Yul docs:
//  https://docs.soliditylang.org/en/v0.8.14/yul.html

// Initially, I thought to use Yul to write inline assembly code in a Solver
//  contract -- but the bytecode was too long, I think because for such a
//  simple function (return 42) writing Yul is no better than writing normal
//  Solidity

// Alternatively, I thought to actually write the bytecode, with individual
//  operation opcodes

// However, reading the Yul docs more thoroughly, I learnt that I could use the
//  Solidity compiler for Yul code, thereby allowing me to write Yul and then
//  have it compiled down to bytecode for me

// Overview of writing Yul code:
//  https://docs.soliditylang.org/en/v0.8.14/yul.html#yul-object

// Example contract in Yul:
//  https://docs.soliditylang.org/en/v0.8.14/yul.html#complete-erc20-example

// Note that the level says we have to deploy a contract, and we can use the
//  example code in the ERC20 example to learn how to do that

// We then write the necessary code to return 42 when a transaction is sent to
//  the Solver contract

// We can then compile our code using solc, and then even optimise it using the
//  --optimize flag
//  (https://docs.soliditylang.org/en/v0.8.14/yul.html#yul-optimizer)

// $ solc --strict-assembly --optimize Solver.yul

// This command spits some stuff out into the terminal, including the bytecode
//  for our Solver (it says it is "binary" representation -- it's really hex)

// >> 600a80600c6000396000f3fe602a60005260206000f3

// We can use the web3.eth.sendTransaction() function to deploy our contract
//  using the bytecode

let payload = "600a80600c6000396000f3fe602a60005260206000f3";

await web3.eth.sendTransaction({ from: player, data: payload });

// We then take the address to which the contract was deployed, and place it in
//  the MagicNum contract

await contract.setSolver(solverAddress);

// submit
