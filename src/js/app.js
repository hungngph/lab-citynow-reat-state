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
    $("input[name='amenities']:checked").each(function(i){
        amenities[i] = $(this).val();
    });

    var title = $(".title").val();
    var ghash = $(".ghash").val();   

    var hlink = $(".description").val();  

    App.contracts.PropertyRegistry.deployed().then(function(instance) {
      return instance.addProperty(title, ghash, typeProperty, location, bedahdbath, "amenities", {
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

        var div1 = document.createElement('div');
        var div2 = document.createElement('div');
        var div3 = document.createElement('div');
        div1.className = "col-xs-12";
        div2.className = "hgroup";
        div3.className = "header-meta";

        var a1 = document.createElement('a');
        a1.className = "item-block";
        a1.href = "home-detail.html";

        var header1 = document.createElement('header');
        header1.id = "insertimg"; 

        var h1 = document.createElement('h4');
        h1.innerHTML = App.recentshome[0][1];

        var h2 = document.createElement('h5');
        h2.innerHTML = App.recentshome[0][2];
        
        var starSpan1 = document.createElement('span');
        starSpan1.className = "fa fa-star checked";
        var starSpan2 = document.createElement('span');
        starSpan2.className = "fa fa-star checked";
        var starSpan3 = document.createElement('span');
        starSpan3.className = "fa fa-star checked";
        var starSpan4 = document.createElement('span');
        starSpan4.className = "fa fa-star checked";
        var starSpan5 = document.createElement('span');
        starSpan5.className = "fa fa-star unchecked";

        var locatSpan = document.createElement('span');
        locatSpan.className = "location";
        var templot = App.recentshome[0][3].split(",",2);
        locatSpan.innerHTML = templot;

        var neoSpan = document.createElement('span');
        neoSpan.className = "label label-warning";
        neoSpan.innerHTML = "Negotiate";

        var source = document.getElementById("jobitem");
        source.appendChild(div1);
        div1.appendChild(a1);
        a1.appendChild(header1);
        header1.appendChild(div2);
        header1.appendChild(div3);
        div2.appendChild(h1);
        div2.appendChild(h2);
        h1.appendChild(starSpan1);
        h1.appendChild(starSpan2);
        h1.appendChild(starSpan3);
        h1.appendChild(starSpan4);
        h1.appendChild(starSpan5);
        div3.appendChild(locatSpan);
        div3.appendChild(neoSpan);

        var img = new Image();
        img.src = App.recentshome[0].hyperlink;
        var src = document.getElementById("insertimg");
        src.appendChild(img);

      });
    });
  }
}

$(function() {
  $(window).load(function() {
    App.init();
  })
});