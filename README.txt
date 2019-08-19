if you run into bugs
	
	truffle migrate --reset

	or create a new meta mask account and use that

	or restart ganache

Here we rewrite the solidity contract so that we can store multiple contacts

to make our lives easier, we get rid of some of the arguments in the struct so that we don't have to write multiple functions to create and update a struct

Gotyas

	you can't do this:

		function getContact(uint contactID) external returns (Contact) {
		    require(contactID < nextContactNum);
		    Contact memory c = contacts[contactID];
		    return c;
		}

	because it'll give you this error:

			TypeError: This type is only supported in the new experimental ABI encoder. Use "pragma experimental ABIEncoderV2;" to enable the feature.
			
			function getContact(uint contactID) external returns (Contact) {

	so instead we return a tuple of the struct's contents

we get rid of this error, by fixing the constructor function in Migrations.sol

	$ truffle compile
	Compiling ./contracts/Migrations.sol...

	Compilation warnings encountered:

	25-twenty-four-solution/contracts/Migrations.sol:11:3: Warning: This function is named "constructor" but is not the constructor of the contract. If you intend this to be a constructor, use "constructor(...) { ... }" without the "function" keyword to define it.
	  function constructor() public {
	  ^ (Relevant source part starts here and spans across multiple lines).

	Writing artifacts to ./build/contracts
