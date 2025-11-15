// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmExpertConsultation
 * @dev Expert consultation booking and payment system
 */
contract FarmExpertConsultation is Ownable {
    struct Expert {
        uint256 expertId;
        address expertAddress;
        string specialization;
        uint256 hourlyRate;
        bool available;
        uint256 rating;
        uint256 consultationCount;
    }

    struct Consultation {
        uint256 consultationId;
        uint256 expertId;
        address farmer;
        uint256 scheduledDate;
        uint256 duration;
        uint256 totalCost;
        bool completed;
        bool paid;
    }

    mapping(uint256 => Expert) public experts;
    mapping(uint256 => Consultation) public consultations;
    mapping(address => uint256[]) public consultationsByFarmer;
    uint256 private _expertIdCounter;
    uint256 private _consultationIdCounter;

    event ExpertRegistered(
        uint256 indexed expertId,
        address indexed expertAddress,
        string specialization
    );

    event ConsultationBooked(
        uint256 indexed consultationId,
        address indexed farmer,
        uint256 expertId
    );

    constructor() Ownable(msg.sender) {}

    function registerExpert(
        string memory specialization,
        uint256 hourlyRate
    ) public returns (uint256) {
        uint256 expertId = _expertIdCounter++;
        experts[expertId] = Expert({
            expertId: expertId,
            expertAddress: msg.sender,
            specialization: specialization,
            hourlyRate: hourlyRate,
            available: true,
            rating: 0,
            consultationCount: 0
        });

        emit ExpertRegistered(expertId, msg.sender, specialization);
        return expertId;
    }

    function bookConsultation(
        uint256 expertId,
        uint256 scheduledDate,
        uint256 duration
    ) public returns (uint256) {
        require(experts[expertId].available, "Expert not available");
        uint256 totalCost = duration * experts[expertId].hourlyRate;

        uint256 consultationId = _consultationIdCounter++;
        consultations[consultationId] = Consultation({
            consultationId: consultationId,
            expertId: expertId,
            farmer: msg.sender,
            scheduledDate: scheduledDate,
            duration: duration,
            totalCost: totalCost,
            completed: false,
            paid: false
        });

        consultationsByFarmer[msg.sender].push(consultationId);
        emit ConsultationBooked(consultationId, msg.sender, expertId);
        return consultationId;
    }

    function completeConsultation(uint256 consultationId) public {
        require(consultations[consultationId].farmer == msg.sender || 
                experts[consultations[consultationId].expertId].expertAddress == msg.sender, 
                "Not authorized");
        consultations[consultationId].completed = true;
        experts[consultations[consultationId].expertId].consultationCount++;
    }

    function getConsultation(uint256 consultationId) public view returns (Consultation memory) {
        return consultations[consultationId];
    }
}
