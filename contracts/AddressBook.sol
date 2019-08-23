pragma solidity ^0.4.18;

/*
	make an app where you put health records on the blockchain using truffle (or remix if you're running into issues)

	you'll allow anyone to fill out a form that consists of 

	problems, medications, allergies, weight, height

	you'll associate these to an address

	you'll make a form that let's anyone retrieve anyone's health record based on an ethereum address entered into the form.

	bonus one: 

	allow only the person who created the health record to update the health record's information

*/

contract AddressBook{
	//each contact will store: problems, medications, allergies, weight, height
	struct Contact {
		string problems;
		string medications;
		string allergies;
		string weight;
		string height;
		string payment;
		string shippingCompany;
		string shipmentTracking;
		string deliveryDate;
	}

	//way one
		address internal owner;

		//keeping track of the next contact id
		uint id; //uint is an alias for uint256. it defaults to 0. the highest it goes up to is 2^256-1

		//data structure that maps one data type to another, generally one maps uint, address or bytes32 to another data structure
		mapping (uint => address) id_to_record_owner;
		mapping (address => uint) record_owner_to_id;
		mapping (uint => Contact) id_to_contact;

		constructor() public{
			owner = msg.sender;
		}

		function getId() view public returns (uint id_){
			require(msg.sender == owner);
			return id;
		}

	//way two
		// mapping (address => Contact) record_owner_to_contact;

	//this costs gas
	function newContact(string _problems, string _medications, string _allergies, string _weight, string _height, address _record_owner) external returns (uint _id) {

		require( (bytes(_problems).length <= 50) && (bytes(_medications).length <= 50) && (bytes(_allergies).length <= 50) && (bytes(_weight).length <= 50) && (bytes(_height).length <= 50));

	    // Creates new struct and saves in storage. We leave out the mapping type.
	    id_to_contact[id] = Contact(_problems, _medications, _allergies, _weight, _height);
	    id_to_record_owner[id] = _record_owner;
	    record_owner_to_id[_record_owner] = id;

	    id++;

	    return id-1;
	}

	// this doesn't cost gas
	//view means that the function accesses state but doesn't change it
	function getContact(address _record_owner) view public returns (string _problems, string _medications, string _allergies, string _weight, string _height) {
		
		//make sure that the person who is getting the medical record information is the person who owns that medical record
		// require(msg.sender == _record_owner);

		uint idd = record_owner_to_id[_record_owner];

	    Contact memory con = id_to_contact[idd];

	    //we unfortunately can't return the struct, we have to return it in in a tuple like this
	    return (con.problems, con.medications, con.allergies, con.weight, con.height);
	}

	function updateContact(string _problems, string _medications, string _allergies, string _weight, string _height, address _record_owner) public {
		
		//make sure that the person who is getting the medical record information is the person who owns that medical record
		require(msg.sender == _record_owner);

		uint idd = record_owner_to_id[_record_owner];

	    Contact storage con = id_to_contact[idd];

	    con.problems = _problems;
	    con.medications = _medications;
	    con.allergies = _allergies;
	    con.weight = _weight;
	    con.height = _height;
	}




}











