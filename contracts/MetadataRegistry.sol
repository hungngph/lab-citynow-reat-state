pragma solidity ^0.4.23;

contract MetadataRegistry
{
    
    mapping(address => Link) propertylink;
    
    struct Link
    {
        address owner;
        address property;
 	    string[] hyperlink;
        uint numLinks;       
    }

	event LinkSet(address indexed property, string hyperlink);

	event LinkRemoved(address indexed property, uint numLink);

	function setLink(address _property, string memory _hyperlink)
	public
	{
		propertylink[_property].hyperlink.push(_hyperlink);
		propertylink[_property].numLinks++;

		emit LinkSet(_property, _hyperlink);		
	}
	
	
	function removeLink(address _property, uint _num)
	public
	{
		require(propertylink[_property].numLinks != 0);
		//require(msg.sender == propertylink[_property].owner);
		
		for (uint i = _num; i < propertylink[_property].numLinks-1; i++)
		{
			propertylink[_property].hyperlink[i] = propertylink[_property].hyperlink[i+1];
		}

        delete propertylink[_property].hyperlink[propertylink[_property].numLinks-1];
		propertylink[_property].numLinks--;        

		emit LinkRemoved(msg.sender, _num);
	}
	
	
	function getLink(address _property, uint _num)
	public
	view
	returns (string memory _hyperlink)
	{
		return propertylink[_property].hyperlink[_num];
	}
	


	function getNumLinks(address _property)
	public 
	view
	returns (uint)
	{
		return propertylink[_property].numLinks;
	}
}
