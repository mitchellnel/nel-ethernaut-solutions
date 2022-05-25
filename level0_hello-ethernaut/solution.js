await contract.info();
// >> returns "You will find what you need in info1()."

await contract.info1();
// >> returns "Try info2(), but with "hello" as a parameter."

await contract.info2("hello");
// >> returns "The property infoNum holds the number of the next info method to call."

await contract.infoNum();
// >> returns 42

await contract.info42();
// >> returns "theMethodName is the name of the next method."

await contract.theMethodName();
// >> returns "If you know the password, submit it to authenticate()."

// looking at the contract ABI, we see that there is a password state variable
let password = await contract.password();
// >> returns whatever the password is -- in my case it was "ethernaut0"

await contract.authenticate(password);
// >> no return

// looking at the ABI, we see that there is a getCleared() method
await contract.getCleared();
// >> returns true

// submit
