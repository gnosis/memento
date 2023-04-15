import { defaultAbiCoder } from '@ethersproject/abi';
import { DeployFunction } from 'hardhat-deploy/types';

import { deployMastercopyWithInitData } from '@gnosis.pm/zodiac';

import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { Recovery__factory } from '../typechain-types';
import { getCreate2Address, keccak256 } from 'ethers/lib/utils';

const DEFAULT_SALT =
  '0x0000000000000000000000000000000000000000000000000000000000000000';

const AddressOne = '0x0000000000000000000000000000000000000001';
const ERC2470_SINGLETON_FACTORY_ADDRESS =
  '0xce0042b868300000d44a59004da54a005ffdcf9f';
const MASTERCOPY_INIT_ARGS = [AddressOne, AddressOne, [], 0];

const deploy: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { ethers } = hre;

  const [signer] = await ethers.getSigners();
  const deployer = ethers.provider.getSigner(signer.address);

  const initData = defaultAbiCoder.encode(
    ['address', 'address', 'address[]', 'uint256'],
    MASTERCOPY_INIT_ARGS
  );
  await deployMastercopyWithInitData(
    deployer,
    Recovery__factory.bytecode + initData.slice(2),
    DEFAULT_SALT
  );

  try {
    await hre.run('verify:verify', {
      address: await calculateMastercopyAddress(),
      constructorArguments: MASTERCOPY_INIT_ARGS,
    });
  } catch (e) {
    if (
      e instanceof Error &&
      e.stack &&
      (e.stack.indexOf('Reason: Already Verified') > -1 ||
        e.stack.indexOf('Contract source code already verified') > -1)
    ) {
      console.log('  ✔ Mastercopy is already verified');
    } else {
      console.log(
        '  ✘ Verifying the mastercopy failed. This is probably because Etherscan is still indexing the contract. Try running this same command again in a few seconds.'
      );
      throw e;
    }
  }
};

export const calculateMastercopyAddress = () => {
  const initData = defaultAbiCoder.encode(
    ['address', 'address', 'address[]', 'uint256'],
    MASTERCOPY_INIT_ARGS
  );
  return getCreate2Address(
    ERC2470_SINGLETON_FACTORY_ADDRESS,
    DEFAULT_SALT,
    keccak256(Recovery__factory.bytecode + initData.slice(2))
  );
};

export default deploy;
