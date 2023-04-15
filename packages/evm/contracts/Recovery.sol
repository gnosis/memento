// SPDX-License-Identifier: LGPL-3.0-only
pragma solidity ^0.8.9;

import "./Account.sol";
import "@gnosis.pm/zodiac/contracts/core/Module.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

interface IWithOwners {
    function getOwners() external view returns (address[] memory);

    function swapOwner(
        address prevOwner,
        address oldOwner,
        address newOwner
    ) external;
}

contract Recovery is Module, Account {
    error Unauthorized(address recoverer);
    error AlreadyProposed(
        address recoverer,
        address oldOwner,
        address newOwner
    );
    event Replace(address oldOwner, address newOwner);

    struct Replacement {
        address oldOwner;
        address newOwner;
    }

    uint256 public quorum;

    constructor(
        address avatar,
        address target,
        address[] memory _recoverers,
        uint256 _quorum
    ) {
        bytes memory initializeParams = abi.encode(
            avatar,
            target,
            _recoverers,
            _quorum
        );
        setUp(initializeParams);
    }

    /// @dev Initialize function, will be triggered when a new proxy is deployed
    /// @param initializeParams Parameters of initialization encoded
    function setUp(bytes memory initializeParams) public override initializer {
        __Ownable_init();
        (
            address _avatar,
            address _target,
            address[] memory _recoverers,
            uint256 _quorum
        ) = abi.decode(
                initializeParams,
                (address, address, address[], uint256)
            );

        setAvatar(_avatar);
        setTarget(_target);
        transferOwnership(_avatar);

        quorum = _quorum;
        for (uint256 i; i < _recoverers.length; ++i) {
            recoverers[_recoverers[i]] = true;
        }
    }

    mapping(address => bool) private recoverers;
    mapping(address => mapping(bytes32 => bool)) private proposed;
    mapping(bytes32 => uint256) public progress;

    function isValidSignature(
        bytes32 hash,
        bytes memory signature
    ) public view override returns (bool) {
        return recoverers[ECDSA.recover(hash, signature)] == true;
    }

    function recover(
        bytes calldata signature,
        Replacement[] calldata replacements
    ) public {
        address recoverer = _authorize(signature, replacements);

        for (uint256 i; i < replacements.length; i++) {
            address oldOwner = replacements[i].oldOwner;
            address newOwner = replacements[i].newOwner;
            bytes32 key = keccak256(abi.encode(oldOwner, newOwner));

            if (proposed[recoverer][key]) {
                revert AlreadyProposed(recoverer, oldOwner, newOwner);
            } else {
                proposed[recoverer][key] = true;
            }

            uint256 counter = progress[key] + 1;
            if (counter == quorum) {
                _swapSigner(oldOwner, newOwner);
                emit Replace(oldOwner, newOwner);
            }
            progress[key] = counter;
        }
    }

    function _authorize(
        bytes calldata signature,
        Replacement[] calldata replacements
    ) private view returns (address) {
        bytes32 messageHash = ECDSA.toEthSignedMessageHash(
            keccak256(abi.encode(replacements))
        );

        address signer = ECDSA.recover(messageHash, signature);
        if (!recoverers[signer]) {
            revert Unauthorized(signer);
        }
        return signer;
    }

    function _swapSigner(address oldOwner, address newOwner) private {
        exec(
            avatar,
            0,
            abi.encodeCall(
                IWithOwners.swapOwner,
                (_findPrevOwner(oldOwner), oldOwner, newOwner)
            ),
            Enum.Operation.Call
        );
    }

    function _findPrevOwner(
        address oldOwner
    ) private view returns (address prevOwner) {
        prevOwner = address(0x1);
        address[] memory owners = IWithOwners(avatar).getOwners();
        for (uint256 i; i < owners.length; ++i) {
            address owner = owners[i];
            if (owner == oldOwner) {
                break;
            }
            prevOwner = owner;
        }
    }
}
