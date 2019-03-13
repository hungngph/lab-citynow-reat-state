const PropertyRegistry = artifacts.require("./PropertyRegistry");
const Property = artifacts.require("./Property");

const alias = "123";
const geoHash = "abc";

contract("PropertyRegistry", async (accounts) => {
	it("should create a new Property  and add it to the registry", async () => {
		const instance = await PropertyRegistry.deployed();
		await instance.addProperty(alias, geoHash, {from:accounts[0]});
		let numPropertys = await instance.numSps();
	});
	it("creation of contract via contract factory"), async (accounts) => {
		const instance = await PropertyRegistry.deployed();
		let result = await instance.addProperty(alias, geoHash, {from: accounts[0]});
		let log = result.logs[0];
		let PropertyAddr = log.args._newContract;

		// get instance pointing to address obtained from event
		const sp = await PropertyRegistry.at(PropertyAddr);

		let spBal = await sp.getBalance();

		assert.equal(spBal, 0);
	}
	
	it("contract deployed by factory should be owned by msg.sender invoking addProperty function", async () => {
		
		assert.equal(owner, owner);
	})
});

