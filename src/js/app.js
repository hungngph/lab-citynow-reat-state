App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  loading: false,

  init: function() {
    console.log("App initialized...")
    return App.initWeb3();
  },

  initWeb3: function() {
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContracts();
  },

  initContracts: function() {
    $.getJSON("MetadataRegistry.json", function(metadataregistry) {
      App.contracts.MetadataRegistry = TruffleContract(metadataregistry);
      App.contracts.MetadataRegistry.setProvider(App.web3Provider);
      App.contracts.MetadataRegistry.deployed().then(function(metadataregistry) {
        console.log("Metadata Registry Address:", metadataregistry.address);
      });
    }).done(function() {
      $.getJSON("SpatialUnitRegistry.json", function(spatialUnitRegistry) {
        App.contracts.SpatialUnitRegistry = TruffleContract(spatialUnitRegistry);
        App.contracts.SpatialUnitRegistry.setProvider(App.web3Provider);
        App.contracts.SpatialUnitRegistry.deployed().then(function(spatialUnitRegistry) {
          console.log("SpatialUnit Registry Address:", spatialUnitRegistry.address);
        });
        }).done(function() {
          $.getJSON("RightsRegistry.json", function(rightsRegistry) {
            App.contracts.RightsRegistry = TruffleContract(rightsRegistry);
            App.contracts.RightsRegistry.setProvider(App.web3Provider);
            App.contracts.RightsRegistry.deployed().then(function(rightsRegistry) {
              console.log("Rights Registry Address:", rightsRegistry.address);
            });
            App.listenForEvents();
            return App.render();
          });
        });
      });
  },

  // Listen for events emitted from the contract

  listenForEvents: function() {
    App.contracts.SpatialUnitRegistry.deployed().then(function(instance) {
      instance.Sell({}, {
        fromBlock: 0,
        toBlock: 'latest',
      }).watch(function(error, event) {
        console.log("event triggered", event);
        App.render();
      })
    })
  },

  render: function() {
    if (App.loading) {
      return;
    }
    App.loading = true;

    var loader  = $('#loader');
    var content = $('#content');

    loader.show();
    content.hide();

    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if(err === null) {
        App.account = account;
        console.log("Your Account: " + account);
      }
    })
  },

  addSpatialUnit: function() {
    var typeProperty = $(".type-property").val();

    var maxGuests = $(".max-guests").val();
    var bedrooms = $(".bedrooms").val();
    var beds = $(".beds").val();
    var bathrooms = $(".bathrooms").val();
    var isBathroomPrivate = $("input[name='bathroom-private']:checked").val();
    var bedahdbath = $(".max-guests").val() + ", " + $(".bedrooms").val()  
    + ", " + $(".beds").val() + ", " + $(".bathrooms").val() 
    + ", " + $(".input[name='bathroom-private']:checked").val();
    console.log(bedahdbath);
    
    var country = $(".country").val();
    var street = $(".street").val();
    var city = $(".city").val();   
    var district = $(".district").val();
    var zipcode = $(".zipcode").val();

    var location = $(".street").val() + ", " + $(".district").val()  
    + ", " + $(".city").val() + ", " + $(".country").val() 
    + ", " + $(".zipcode").val();

    App.contracts.SpatialUnitRegistry.deployed().then(function(instance) {
      console.log(instance);
      return instance.addSpatialUnit("T", "T", {
        from: App.account,
        value: 0,
        gas: 3000000 // Gas limit
      });
    }).then(function(result) {
      console.log("Done...")
    });
  }
}

$(function() {
  $(window).load(function() {
    App.init();
  })
});