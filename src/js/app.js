App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  loading: false,
  recentshome: {},

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
      $.getJSON("PropertyRegistry.json", function(PropertyRegistry) {
        App.contracts.PropertyRegistry = TruffleContract(PropertyRegistry);
        App.contracts.PropertyRegistry.setProvider(App.web3Provider);
        App.contracts.PropertyRegistry.deployed().then(function(PropertyRegistry) {
          console.log("Property Registry Address:", PropertyRegistry.address);
        });
        }).done(function() {
          $.getJSON("RightsRegistry.json", function(rightsRegistry) {
            App.contracts.RightsRegistry = TruffleContract(rightsRegistry);
            App.contracts.RightsRegistry.setProvider(App.web3Provider);
            App.contracts.RightsRegistry.deployed().then(function(rightsRegistry) {
              console.log("Rights Registry Address:", rightsRegistry.address);
            });
            return App.render();
          });
        });
      });
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

    if(document.location.pathname=='/') { return App.getinfoProperty(); }

  },

  addProperty: function() {
    var typeProperty = $(".type-property").val();

    var isBathroomPrivate = [];
    $("input[name='bathroom-private']:checked").each(function(i){
      isBathroomPrivate[i] = $(this).val();
    });

    var bedahdbath = $(".max-guests").val() + ", " + $(".bedrooms").val()  
    + ", " + $(".beds").val() + ", " + $(".bathrooms").val() 
    + ", " + isBathroomPrivate;

    var location = $(".country").val() + ", " + $(".city").val() 
    + ", " + $(".district").val()  
    + ", " + $(".street").val() 
    + ", " + $(".zipcode").val();

    var amenities = [];
    var amenis;
    $("input[name='amenities']:checked").each(function(i){
        amenities[i] = $(this).val();
        amenis += amenities[i] + ", ";
    });

    var title = $(".title").val();
    var ghash = $(".ghash").val();   

    var hlink = $(".description").val();  

    App.contracts.PropertyRegistry.deployed().then(function(instance) {
      return instance.addProperty(title, ghash, typeProperty,bedahdbath, location , amenis, {
        from: App.account,
        value: 0
      });
    }).then(function(result) {
      console.log(result);
      console.log(result.logs[0].args);
      App.contracts.MetadataRegistry.deployed().then(function(instance) {
        return instance.setLink(result.logs[0].args._newProperty, hlink, {
          from: App.account,
          value: 0
        });
      }).then(function(result) {
        console.log(result.logs[0].args);
      }); 
    });

  },

  getinfoProperty: function() {

    App.contracts.PropertyRegistry.deployed().then(function(instance) {
      return instance.getinfoProperty(0, {
        from: App.account,
        value: 0
      });
    }).then(function(result) {
      App.contracts.MetadataRegistry.deployed().then(function(instance) {
        return instance.getLink(result[0], 0, {
          from: App.account,
          value: 0
        });
      }).then(function(results) {
        result.hyperlink = results;
        Array.prototype.push.call(App.recentshome, result);
        console.log(App.recentshome);

        var src = document.getElementById("jobitem");
        var myvar = '<div class="col-xs-12">'+
        '              <a class="item-block" href="home-detail.html">'+
        '                <header>'+
        '                  <img src='+ App.recentshome[0].hyperlink + ' alt="">'+
        '                  <div class="hgroup">'+
        '                    <h4>'+ App.recentshome[0][1] +''+
        '                    	<span class="fa fa-star checked"></span>'+
        '                    	<span class="fa fa-star checked"></span>'+
        '                    	<span class="fa fa-star checked"></span>'+
        '                    	<span class="fa fa-star checked"></span>'+
        '                    	<span class="fa fa-star"></span>'+
        '                    </h4>'+
        '                    <h5>'+ App.recentshome[0][2] +'</h5>'+
        '                  </div>'+
        '                  <div class="header-meta">'+
        '                    <span class="location">'+ App.recentshome[0][3].split(",",2) +'</span>'+
        '                    <span class="label label-warning">negotiate</span>'+
        '                  </div>'+
        '                </header>'+
        '              </a>'+
        '            </div>';
          
        src.innerHTML = myvar;

      });
    });
  }
}

$(function() {
  $(window).load(function() {
    App.init();
  })
});