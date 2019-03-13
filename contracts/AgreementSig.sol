pragma solidity ^0.4.23;

import "./PropertyRegistry.sol";

contract Agreement
{

    address landlord;
    address premises;
    address tenant;


    function Agreement(address _landlord, address _tenant, address _premises)
    public
    payable 
    {
        landlord = _landlord;
        premises = _premises;
        tenant = _tenant;
    }
}

contract AgreementSig
{
    struct twoSig
    {
        address landlord;
        address premises;
        string managementinfo;
        uint cost;
        string[] damages;
    
        address tenant;
        uint securitydeposit;
        string starttime;
        string endtime;
    }

    mapping(address => twoSig) arecords;

    // events
    event InitializeAgreement(address indexed  _landlord, address indexed  _tenant, address indexed  _premises);

    function InitAgreement(address _landlord, address _tenant, address _premises) 
    public
	returns (address _newAgreement)
    {
        Agreement newAgreement = new Agreement(_landlord, msg.sender, _premises);
        arecords[newAgreement].landlord = _landlord;
        arecords[newAgreement].premises = _premises;
        arecords[newAgreement].tenant = msg.sender;
        emit InitializeAgreement(_landlord, msg.sender, _premises);
		return (address(newAgreement));
    }

    function getAgreement(address addr) 
    public
    view
    returns (address landlord, address tenant, address premises) 
    {
        landlord = arecords[addr].landlord;
        tenant = arecords[addr].tenant;
        premises = arecords[addr].premises;
		return (landlord, tenant, premises);
    }
}