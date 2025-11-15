// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmTrainingCertification
 * @dev Training and certification issuance system
 */
contract FarmTrainingCertification is Ownable {
    struct Training {
        uint256 trainingId;
        string courseName;
        string description;
        address instructor;
        uint256 duration;
        uint256 completionDate;
        bool active;
    }

    struct Certification {
        uint256 certId;
        uint256 trainingId;
        address recipient;
        string certType;
        uint256 issueDate;
        uint256 expiryDate;
        string certificateHash;
        bool valid;
    }

    mapping(uint256 => Training) public trainings;
    mapping(uint256 => Certification) public certifications;
    mapping(address => uint256[]) public certsByRecipient;
    uint256 private _trainingIdCounter;
    uint256 private _certIdCounter;

    event TrainingCreated(
        uint256 indexed trainingId,
        string courseName,
        address indexed instructor
    );

    event CertificationIssued(
        uint256 indexed certId,
        address indexed recipient,
        string certType
    );

    constructor() Ownable(msg.sender) {}

    function createTraining(
        string memory courseName,
        string memory description,
        uint256 duration
    ) public returns (uint256) {
        uint256 trainingId = _trainingIdCounter++;
        trainings[trainingId] = Training({
            trainingId: trainingId,
            courseName: courseName,
            description: description,
            instructor: msg.sender,
            duration: duration,
            completionDate: 0,
            active: true
        });

        emit TrainingCreated(trainingId, courseName, msg.sender);
        return trainingId;
    }

    function issueCertification(
        uint256 trainingId,
        address recipient,
        string memory certType,
        uint256 validityDays,
        string memory certificateHash
    ) public onlyOwner returns (uint256) {
        require(trainings[trainingId].active, "Training not active");
        uint256 certId = _certIdCounter++;
        certifications[certId] = Certification({
            certId: certId,
            trainingId: trainingId,
            recipient: recipient,
            certType: certType,
            issueDate: block.timestamp,
            expiryDate: block.timestamp + (validityDays * 1 days),
            certificateHash: certificateHash,
            valid: true
        });

        certsByRecipient[recipient].push(certId);
        emit CertificationIssued(certId, recipient, certType);
        return certId;
    }

    function revokeCertification(uint256 certId) public onlyOwner {
        certifications[certId].valid = false;
    }

    function verifyCertification(uint256 certId) public view returns (bool) {
        Certification memory cert = certifications[certId];
        return cert.valid && block.timestamp <= cert.expiryDate;
    }

    function getCertification(uint256 certId) public view returns (Certification memory) {
        return certifications[certId];
    }
}
