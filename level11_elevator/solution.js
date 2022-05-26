await contract.top();
// >> returns false

// Our goal is to make the state variable top in the Elevator contract true

// We can do this by calling the goTo() method in Elevator, however, to do so,
//  we need to proceed through the if-statement correctly

// Note that it is a Building contract that calls the Elevator, and whichever
//  Building instance calls the Elevator is the Building instance whose
//  isLastFloor() the Elevator uses; as long as we satisfy the interface for
//  Building laid out in the Elevator contract file, then we can do whatever
//  we want internally in our version of a Building

// So, we create a malicious FakeBuilding contract that will allow us to pass
//  through the if-statement as we desire

// We implement our isLastFloor() method so that the first call to it returns
//  false, and the second call to it returns true

// This is achieved by maintaining some sort of state variable in the
//  FakeBuilding contract -- we just use a Boolean, initially set to false, and
//  then flip the value after the first call

// We deploy the FakeBuilding contract via Remix and call the Elevator's goTo()
//  function

await contract.top();
// >> returns true

// submit
