pragma solidity ^0.4.22;

contract Property  
{
    
    address public owner;
	address public registry_address;
    address public receiver;
    string public alias;
    string public geohash;
    address[] public ownerhistory;
	uint public ownertransfercount;
    
    mapping(address => uint) paymentpool;
	mapping(bytes32 => bytes32) keyvaluestore;
    
    function Property(address _owner, string _alias, string _geohash)
    public
    payable 
    {
        owner = _owner;
		ownerhistory.push(owner);
		registry_address = msg.sender;
        alias = _alias;
        geohash = _geohash;
    }
}

contract PropertyRegistry
{
    address public owner;
    uint public numSps;
    mapping(address => Unit) records;
    address[] public keys;
    
    // events
    event PropertyAdded(address indexed owner, string _alias, string _geoHash);
    
    // structs    
    struct  Unit
    {
        address creator;
        string alias;
        string geoHash; 
        uint keysIndex;
    }
    
    function PropertyRegistry()
    public
    {
        owner = msg.sender;
    }
    
    function addProperty(string _alias, string _geoHash) 
    public
	returns (address _newProperty, uint _keyslength)
    {
        Property newProperty = new Property(msg.sender, _alias, _geoHash);
        // newProperty.changeOwner(msg.sender);
        keys.push(newProperty);
        records[newProperty].alias = _alias;
        records[newProperty].geoHash = _geoHash;
        records[newProperty].creator = msg.sender;
        records[newProperty].keysIndex = keys.length;
        numSps++;
        emit PropertyAdded(newProperty, _alias, _geoHash);
		return (address(newProperty), keys.length);
    }
    
    function getProperty(address addr) 
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