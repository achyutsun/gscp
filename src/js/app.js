var $problems= $('#problems');
var $medications = $('#medications');
var $allergies = $('#allergies');
var $weight = $('#weight');
var $height = $('#height');
var $record_owner = $('#record_owner');

var $retrieval_record_owner_address = $('#retrieval_record_owner_address');

function addTransactionToDOM(ob, transactionsDiv){
  //start a virtual unordered list (list with bullets - no numbers)
  var ul = $('<ul>');

  //the tx is in a key in ob, so we get to it directly
  var firstLi = $('<li>');
  var txTerm = $('<span>').html('<strong>tx</strong>').addClass('right-margin-5');
  var txVal = $('<span>').html(ob.tx);
  firstLi.append(txTerm);
  firstLi.append(txVal);

  ul.append(firstLi);

  //the rest of the data are grand childs of ob in ob.receipt

  var li, term, val;

  for (key in ob.receipt){
    li = $('<li>');
    term = $('<span>').html(`<strong>${key}</strong>`).addClass('right-margin-5');
    val = $('<span>').html(ob.receipt[key]);

    li.append(term)
    li.append(val);

    ul.append(li);
  }

  //we add the virtual unordered list onto the html
  transactionsDiv.append(ul);
}

App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    // Initialize web3 and set the provider to the testRPC.
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // set the provider you want from Web3.providers
      App.web3Provider = new Web3.providers.HttpProvider('http://127.0.0.1:7545');
      web3 = new Web3(App.web3Provider);
    }

    return App.initContract();
  },

  initContract: function() {
    $.getJSON('AddressBook.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract.
      var AddressBookArtifact = data;
      App.contracts.AddressBook = TruffleContract(AddressBookArtifact);

      // Set the provider for our contract.
      App.contracts.AddressBook.setProvider(App.web3Provider);
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '#submitContact', App.updateState);
    $(document).on('click', '#getContact', App.getContact);
    $(document).on('click', '#updateContact', App.updateContact);

  },
  updateContact: function(event) {
    event.preventDefault();

    var AddressBookInstance;

    App.contracts.AddressBook.deployed().then(function(instance) {
      AddressBookInstance = instance;
      
      return AddressBookInstance.updateContact($problems.val(), $medications.val(), $allergies.val(), $weight.val(), $height.val(), $record_owner.val());

    }).then(function(result) {
      //reference the div with an id of transactions from the html
      var transactionsDiv = $('#transactions');

      transactionsDiv.html("");

      //add a header to the div
      transactionsDiv.append($('<h2>').text('Your Transactions'));

      //add a hr to the div
      transactionsDiv.append($('<hr>'));

      addTransactionToDOM(result, transactionsDiv);

    }).catch(function(err) {
      $('#errors').addClass('bad').text(err.toString());
    });
  },
  updateState: function(event) {
    event.preventDefault();

    var AddressBookInstance;

    App.contracts.AddressBook.deployed().then(function(instance) {
      AddressBookInstance = instance;
      
      return AddressBookInstance.newContact($problems.val(), $medications.val(), $allergies.val(), $weight.val(), $height.val(), $record_owner.val());

    }).then(function(result) {
      //reference the div with an id of transactions from the html
      var transactionsDiv = $('#transactions');

      transactionsDiv.html("");

      //add a header to the div
      transactionsDiv.append($('<h2>').text('Your Transactions'));

      //add a hr to the div
      transactionsDiv.append($('<hr>'));

      addTransactionToDOM(result, transactionsDiv);

    }).catch(function(err) {
      $('#errors').addClass('bad').text(err.toString());
    });
  },

  getContact: function(event) {
    event.preventDefault();

    var AddressBookInstance;

    App.contracts.AddressBook.deployed().then(function(instance) {
      AddressBookInstance = instance;

      return AddressBookInstance.getContact($retrieval_record_owner_address.val());

    }).then(function(result) {
      
      var res = result.toString();

      $problems.val(result[0]);
      $medications.val(result[1]); 
      $allergies.val(result[2]); 
      $weight.val(result[3]); 
      $height.val(result[4]); 
      $record_owner.val($retrieval_record_owner_address.val());

      $('#contact').text(res);

    }).catch(function(err) {
      console.log(err.message);
    });
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
