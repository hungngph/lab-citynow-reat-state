pragma solidity ^0.4.22;

contract SpatialUnit  
{
    
    address public owner;
    address public renter;
    string public alias;
    string public geohash;
    address[] public rentalhistory;
    
    mapping(address => uint) paymentpool;
	mapping(bytes32 => bytes32) keyvaluestore;
    
    function SpatialUnit(address _owner, string _alias, string _geohash)
    public
    payable 
    {
        owner = _owner;
		ownerhistory.push(owner);
		registry_address = msg.sender;
        alias = _alias;
        geohash = _geohash;
    }
    
    function () 
    public 
    payable 
    {
        // fallback function
    }
    
    function getBalance() 
    public 
    view 
    returns (uint)
    {
        return (address(this).balance);
    }

	function store(bytes32 _key, bytes32 _value)
	public
	{
		require(msg.sender == owner);
		keyvaluestore[_key] = _value;
	}

	function retrieve(bytes32 _key)
	public
	view 
	returns (bytes32 _stored_val)
	{
		return (keyvaluestore[_key]);
	}
    
	function changeOwner(address _newOwner)
	public 
	returns (address)
	{
		require(msg.sender == owner);
		owner = _newOwner;
		ownerhistory.push(owner);
		ownertransfercount++;
		return (address(owner));
	}

    function execPayment(address _receiver, uint _amount) 
    public 
    payable 
    {
		require(msg.sender == owner);
        receiver = _receiver;
        require(_amount <= address(this).balance);
        paymentpool[receiver] += _amount;
    }
    
    function receivePayment() 
    external 
    {
        uint pmnt = paymentpool[msg.sender]; 
        paymentpool[msg.sender] = 0; 
        msg.sender.transfer(pmnt); 
    }
}

contract SpatialUnitRegistry
{
    address public owner;
	// adding creator in addition to owner because ownership of a Spatial Unit can be transferred later
    uint public numSpUnits;
    mapping(address => Unit) records;
    address[] public keys;
    
    // events
    event PropertyAdded(address indexed owner, string  _alias, string  _geoHash);
    
    // structs    
    struct Unit 
    {
        address creator;
        string alias;
        string geoHash; 
        uint keysIndex;
    }
    
    function SpatialUnitRegistry()
    public
    {
        owner = msg.sender;
    }
    
    function addSpatialUnit(string _alias, string _geoHash) 
    public
	returns (address _newSpatialunit, uint _keyslength)
    {
        SpatialUnit newSpatialUnit = new SpatialUnit(msg.sender, _alias, _geoHash);
        // newSpatialUnit.changeOwner(msg.sender);
        keys.push(newSpatialUnit);
        records[newSpatialUnit].alias = _alias;
        records[newSpatialUnit].geoHash = _geoHash;
        records[newSpatialUnit].creator = msg.sender;
        records[newSpatialUnit].keysIndex = keys.length;
        numSpUnits++;
        emit SpatialUnitAdded(newSpatialUnit, _alias, _geoHash);
		return (address(newSpatialUnit), keys.length);
    }
    
    function getSpatialUnit(address addr) 
    public
    view
    returns (address creator, string alias, string geoHash) 
    {
        creator = records[addr].creator;
        alias = records[addr].alias;
        geoHash = records[addr].geoHash;
		return (creator, alias, geoHash);
    }
    
} 
