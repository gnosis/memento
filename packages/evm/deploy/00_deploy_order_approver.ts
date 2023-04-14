import { defaultAbiCoder } from '@ethersproject/abi';
import { DeployFunction } from 'hardhat-deploy/types';

import { Recovery, Recovery__factory } from '../typechain-types';

const deployOrderSigner: DeployFunction = async ({
  ethers,
  getNamedAccounts,
  deployments,
}) => {
  const { deploy, getNetworkName } = deployments;
  const [signer] = await ethers.getSigners();
  const deployer = ethers.provider.getSigner(signer.address);

  const Recovery: Recovery__factory = await ethers.getContractFactory(
    'Recovery'
  );

  const recovery = await Recovery.deploy(
    '0xd2a39516A6528A6FA1eb8c529Fd2b9F43ACD82b2',
    '0xd2a39516A6528A6FA1eb8c529Fd2b9F43ACD82b2'
  );

  const a = await recovery.deployed();

  console.log('Deployed at:' + a.address);
};

export default deployOrderSigner;
