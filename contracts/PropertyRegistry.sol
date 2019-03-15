pragma solidity ^0.4.22;

contract Property  
{
    address public creator;
    string public alias;
    string public geohash;
        
    constructor(address _owner, string memory _alias, string memory _geohash)
    public
    {
        creator = _owner;
        alias = _alias;
        geohash = _geohash;
    }
}

contract PropertyRegistry
{
    address public owner;
    mapping(address => Unit) records;
    
    // events
    event PropertyAdded(address indexed _creator, string _alias, string _geohash, string _placetype, string _bedandbath, string _location, string _amenities);
    
    // structs    
    struct  Unit
    {
        address creator;
        string alias;
        string geohash; 
        string placetype;
        string bedandbath;
        string location;
        string amenities;
        uint active;
    }
    
    constructor()
    public
    {
        owner = msg.sender;
    }
    
    function addProperty(string memory _alias, string memory _geohash, string memory _place, string memory _bab, string memory _locat, string memory _amenit) 
    public
	returns (address _newProperty)
    {
        Property newProperty = new Property(msg.sender, _alias, _geohash);
        records[newProperty].creator = msg.sender;
        records[newProperty].alias = _alias;
        records[newProperty].geohash = _geohash;
        records[newProperty].placetype = _place;
        records[newProperty].bedandbath = _bab;
        records[newProperty].location = _locat;
        records[newProperty].amenities = _amenit;
        records[newProperty].active = 1;

        emit PropertyAdded(msg.sender, _alias, _geohash, _place, _bab, _locat, _amenit);
		return (address(newProperty));
    }
    
    function getProperty(address addr) 
    public
    view
    returns (address _creator, string memory _alias, string memory _geohash, string memory _place, string memory _bab, string memory _locat, string memory _amenit, uint _acti) 
    {
        _creator = records[addr].creator;
        _alias = records[addr].alias;
        _geohash = records[addr].geohash;
        _place = records[addr].placetype;
        _bab = records[addr].bedandbath;
        _locat = records[addr].location;
        _amenit = records[addr].amenities;
        _acti = records[addr].active;
		return (_creator, _alias, _geohash, _place, _bab, _locat, _amenit, _acti);
    }
    
} 