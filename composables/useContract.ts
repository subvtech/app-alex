import { BigNumberish, ethers } from 'ethers';

import TaskOwnerReedemsContract from '@/build/contracts/TaskOwnerReedemsContract.json';
import TaskOwnerReedemsContract2 from '@/build/contracts/TaskOwnerReedemsContract2.json';
import GiveawayContract from '@/build/contracts/GiveawayContract.json';

declare global {
  interface Window {
    ethereum: any;
  }
}

export type AvailableContracts =
  | 'TaskOwnerReedemsContract'
  | 'TaskOwnerReedemsContract2';

export interface CreateContractProps {
  budget: number;
  chosenContract: AvailableContracts;
}

export interface CancelledContractProps {
  contractAddress: string;
  chosenContract: AvailableContracts;
}

const localGanacheChainId = 1337; // '0x1691';
const sepoliaChainId = 11155111; // '0xaa36a7';
const networkUrl = 'http://127.0.0.1:7545';

const ganacheTestnet = {
  chainId: '0x539', // '1337'
  chainName: 'Ganache Local Testnet',
  nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
  rpcUrls: [networkUrl],
  blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
};

export const useContracts = () => {
  const loading = ref(false);
  const usdToEth = (usdAmount: number) => {
    const ethExchangeRate = 3000;
    return usdAmount / ethExchangeRate;
  };

  const ethToUsd = (usdAmount: number) => {
    // console.log({ ethToUsd: usdAmount });
    const ethExchangeRate = 3000;
    return ethExchangeRate * usdAmount;
  };

  const weiToUsd = (weiAmount: BigNumberish) => {
    // console.log({ weiToUsd: weiAmount });
    // console.log({ formatWeiToUsd: ethers.formatEther(weiAmount) });
    return ethToUsd(parseFloat(ethers.formatEther(weiAmount)));
  };

  const getContractBalance = async (
    contractAddress: string | null | undefined,
  ) => {
    console.log('getContractBalance');
    try {
      if (!contractAddress) return;
      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      const contractBalance = (await browserProvider.getBalance(
        contractAddress,
      )) as BigNumberish;
      return contractBalance;
    } catch (err) {
      console.log(err);
    }
  };

  const getCompiledContract = (chosenContract: AvailableContracts) => {
    let contractABI, contractBinary;
    if (chosenContract === 'TaskOwnerReedemsContract') {
      contractABI = TaskOwnerReedemsContract.abi;
      contractBinary = TaskOwnerReedemsContract.bytecode;
    } else {
      contractABI = TaskOwnerReedemsContract2.abi;
      contractBinary = TaskOwnerReedemsContract2.bytecode;
    }
    return { contractABI, contractBinary };
  };

  const createTaskContract = async (props: CreateContractProps) => {
    const { budget, chosenContract } = props;
    loading.value = true;
    console.log({ createTaskContract: budget });
    try {
      const browserProvider = new ethers.BrowserProvider(window.ethereum);

      await switchNetwork(localGanacheChainId);

      const wallet = await withTimeout(12000, browserProvider.getSigner());
      const budgetInWei = ethers.parseEther(usdToEth(budget).toString());

      const { contractABI, contractBinary } =
        getCompiledContract(chosenContract);

      const contractFactory = new ethers.ContractFactory(
        contractABI,
        contractBinary,
        wallet,
      );

      console.log({ usdt: budget, wei: budgetInWei });
      const contract = await contractFactory.deploy({
        value: budgetInWei,
      });
      await contract.waitForDeployment();

      if (!contract) throw new Error('failed to create contract');
      const balance = await getContractBalance(
        contract.target as string | null,
      );
      console.log({ createdContractBalance: balance });
      loading.value = false;
      return contract.target;
    } catch (err) {
      console.log(err);
    }

    loading.value = false;
  };

  const earnFunds = async (luckyAddress: string, budgetInWei: bigint) => {
    loading.value = true;
    const provider = new ethers.JsonRpcProvider(networkUrl);

    const wallet = new ethers.Wallet(
      '0x5d921ddd849ea879278f3d87b97399364c159440e475a0ebfa49bcefb6f5e212',
      provider,
    );
    const contractABI = GiveawayContract.abi;
    const contractBinary = GiveawayContract.bytecode;
    const contractFactory = new ethers.ContractFactory(
      contractABI,
      contractBinary,
      wallet,
    );

    const contract = await contractFactory.deploy({
      value: budgetInWei,
    });

    try {
      const tx = await contract.withdraw(luckyAddress);
      await tx.wait(); // Wait for the transaction to be mined
      console.log({ balance: await provider.getBalance(contract.target) });
      console.log('Withdrawal successful!');
    } catch (error) {
      console.error('Error:', error);
    }

    loading.value = false;
  };

  const switchNetwork = async (targetedNetwork: number) => {
    const currentChainId = await window.ethereum.request({
      method: 'eth_chainId',
    });

    if (localGanacheChainId === targetedNetwork) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [ganacheTestnet],
      });
    }

    const hexTargetedNetwork = '0x' + targetedNetwork.toString(16);

    console.log({
      currentChainId,
      targetedNetwork,
      hexTargetedNetwork,
    });
    if (currentChainId === hexTargetedNetwork) return;

    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: hexTargetedNetwork }],
    });
    // refresh
    // window.location.reload();
  };

  const cancelContract = async (props: CancelledContractProps) => {
    const { chosenContract, contractAddress } = props;
    console.log(props);

    loading.value = true;

    try {
      if (!contractAddress) throw new Error('Contract address not provided');
      const { contractABI } = getCompiledContract(chosenContract);

      // Replace with the actual freelancer address
      console.log({ contractABI });
      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      const signer = await withTimeout(12000, browserProvider.getSigner());
      const TaskContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer,
      );
      const tx = await TaskContract.cancelDeal();
      await tx.wait(); // Wait for the transaction to be mined

      console.log('The contract was cancelled successfully!');

      return true;
    } catch (error) {
      console.error('Error:', error);
      return false;
    } finally {
      loading.value = false;
    }
  };

  const rewardStudents = async (
    contractAddress: string | undefined,
    addressList: string[] = [],
    gradeList: number[] = [],
  ) => {
    if (!contractAddress) throw new Error('Contract address not provided');
    if (addressList.length === 0)
      throw new Error('Address list cannot be empty');
    if (addressList.length !== gradeList.length)
      throw new Error('Address list and gradeList must have the same length');
    loading.value = true;

    const contractABI = TaskOwnerReedemsContract.abi;

    try {
      // Replace with the actual freelancer address

      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      const signer = await withTimeout(12000, browserProvider.getSigner());
      const TaskContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer,
      );
      const tx = await TaskContract.redeemRewards(addressList, gradeList);
      await tx.wait(); // Wait for the transaction to be mined
      console.log('Students paid successfully!');
      return true;
    } catch (error) {
      console.error('Error:', error);
      return false;
    } finally {
      loading.value = false;
    }
  };

  const rewardSingleStudent = async (
    contractAddress: string | undefined,
    studentAddress: string,
    studentGrade: number,
  ) => {
    if (!contractAddress) throw new Error('Contract address not provided');

    loading.value = true;

    const contractABI = TaskOwnerReedemsContract.abi;

    try {
      // Replace with the actual freelancer address

      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      const signer = await withTimeout(12000, browserProvider.getSigner());
      const TaskContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer,
      );
      const tx = await TaskContract.redeemSingleReward(
        studentAddress,
        studentGrade,
      );
      await tx.wait(); // Wait for the transaction to be mined
      console.log('Student paid successfully!');
      return true;
    } catch (error) {
      console.error('Error:', error);
      return false;
    } finally {
      loading.value = false;
    }
  };

  const getRewardStudentsFee = async (
    contractAddress: string | undefined,
    addressList: string[] = [],
    gradeList: number[] = [],
  ) => {
    if (!contractAddress) return;

    loading.value = true;

    const contractABI = TaskOwnerReedemsContract.abi;

    try {
      // Replace with the actual freelancer address

      const gasPrice = await ethers.getDefaultProvider(networkUrl).getFeeData();
      const TaskContract = new ethers.Contract(
        contractAddress,
        contractABI,
        ethers.getDefaultProvider(networkUrl),
      );
      const estimatedGas = TaskContract.estimateGas.redeemRewards(
        addressList,
        gradeList,
      );

      console.log(
        `Estimated gas cost: ${ethers.formatEther(estimatedGas)} ETH`,
        gasPrice,
      );
      return estimatedGas;
    } catch (error) {
      console.error('Error:', error);
    }

    loading.value = false;
  };

  const getDeployContractFee = async () => {
    const { contractABI, contractBinary } = getCompiledContract(chosenContract);

    const contractFactory = new ethers.ContractFactory(
      contractABI,
      contractBinary,
      ethers.getDefaultProvider(networkUrl),
    );

    // Estimate gas for deployment
    const estimatedGas = await ethers
      .getDefaultProvider(networkUrl)
      .estimateGas(contractFactory.getDeployTransaction().data);

    return estimatedGas;
  };

  return {
    createTaskContract,
    rewardStudents,
    getContractBalance,
    weiToUsd,
    usdToEth,
    getRewardStudentsFee,
    loading,
    cancelContract,
    rewardSingleStudent,
  };
};
