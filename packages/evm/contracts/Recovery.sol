// SPDX-License-Identifier: LGPL-3.0-only
pragma solidity ^0.8.9;

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

contract Recovery is Module {
    error InvalidRecoverer(address);
    error NoQuorum();

    event Replace(address oldOwner, address newOwner);

    struct Permit {
        address signer;
        bytes signature;
    }

    struct Replacement {
        address oldOwner;
        address newOwner;
    }

    uint256 private quorum;
    mapping(address => bool) private recoverers;

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

    function recover(
        Permit[] calldata permits,
        Replacement[] calldata replacements
    ) public {
        uint256 count;
        for (uint256 i; i < permits.length; ++i) {
            Permit calldata permit = permits[i];
            _validate(permit);

            ++count;
            delete recoverers[permit.signer];
        }

        if (count < quorum) {
            revert NoQuorum();
        }

        for (uint256 i; i < replacements.length; ++i) {
            Replacement memory replacement = replacements[i];
            _swapSigner(replacement.oldOwner, replacement.newOwner);
            emit Replace(replacement.oldOwner, replacement.newOwner);
        }
    }

    function _validate(Permit calldata permit) private view {
        if (!recoverers[permit.signer]) {
            revert InvalidRecoverer(permit.signer);
        }

        bytes32 messageHash = ECDSA.toEthSignedMessageHash(
            keccak256(abi.encodePacked(permit.signer))
        );

        if (permit.signer != ECDSA.recover(messageHash, permit.signature)) {
            revert InvalidRecoverer(permit.signer);
        }
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
