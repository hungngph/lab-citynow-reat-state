var PropertyRegistry = artifacts.require("./PropertyRegistry");
var MetadataRegistry = artifacts.require("./MetadataRegistry");
var RightsRegistry = artifacts.require("./RightsRegistry");

module.exports = function(deployer) {
	deployer.deploy(PropertyRegistry);
	deployer.deploy(MetadataRegistry);
	deployer.deploy(RightsRegistry);
};
