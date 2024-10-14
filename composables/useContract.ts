import { BigNumberish, ethers } from 'ethers';

import TaskOwnerSingleRedeem2 from '@/build/contracts/TaskOwnerSingleRedeem2.json';
import { usdToEth, weiToUsd } from '~/utils/ethers';

declare global {
  interface Window {
    ethereum: any;
  }
}

export interface CreateContractProps {
  budget: number;
  totalNumberOfStudents: number;
}

const localGanacheChainId = 1337; // '0x1691';
const sepoliaChainId = 11155111; // '0xaa36a7';
const sepoliaNetworkUrl = 'https://rpc.sepolia.org';
const networkUrl = sepoliaNetworkUrl ?? 'http://127.0.0.1:7545';

const ganacheTestnet = {
  chainId: '0x539', // '1337'
  chainName: 'Ganache Local Testnet',
  nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
  rpcUrls: [networkUrl],
  blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
};

const sepoliaTestnet = {
  chainId: '0xaa36a7', // Hypothetical chain ID for Sepolia; replace with the actual value
  chainName: 'Sepolia Testnet',
  nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
  rpcUrls: ['https://rpc.sepolia.org'], // Replace with actual RPC URL(s)
  blockExplorerUrls: ['https://sepolia.etherscan.io'], // Replace with actual block explorer URL(s)
};

export const useContracts = (contractAddress: globalThis.Ref<string | null>) => {
  const loading = ref(false);

  const contractBalance = ref<number>(0);
  const isThereBalance = computed(() => contractBalance.value > 0);
  const isThereAContract = computed(() => !!contractAddress.value);

  const fetchContractBalance = async () => {
    if (!contractAddress.value) return;
    const balance = await getContractBalance();
    if (balance === undefined) return;
    contractBalance.value = weiToUsd(balance);
  };

  const getBrowserProvider = () => {
    return new ethers.BrowserProvider(window.ethereum);
  };

  const getDefaultProvider = async () => {
    return await ethers.getDefaultProvider(networkUrl);
  };

  const getCompiledContract = () => {
    return {
      contractABI: TaskOwnerSingleRedeem2.abi,
      contractBinary: TaskOwnerSingleRedeem2.bytecode,
    };
  };

  const getTaskContract = (provider) => {
    const { contractABI } = getCompiledContract();
    if (!contractAddress.value) throw new Error('taskContract not provided');
    return new ethers.Contract(contractAddress.value, contractABI, provider);
  };

  const getRedeemersArray = async (taskContract) => {
    if (!taskContract) throw new Error('taskContract not provided');
    const redeemers: string[] = [];
    try {
      let i = 0;
      try {
        while (i < 100) {
          redeemers.push(await taskContract.redeemers(i));
          i++;
        }
      } catch (err) {}
    } catch (error) {
      console.error('Error reading public variables:', error);
    }
    return redeemers;
  };

  const getContractBalance = async () => {
    try {
      if (!contractAddress.value) return;
      const provider = new ethers.JsonRpcProvider(networkUrl);
      const contractBalance = (await provider.getBalance(contractAddress.value)) as BigNumberish;

      return contractBalance;
    } catch (err) {
      console.log(err);
    }
  };

  const getContractReward = async () => {
    try {
      if (!contractAddress.value) return;
      const provider = new ethers.JsonRpcProvider(networkUrl);
      const contractBalance = (await provider.getBalance(contractAddress.value)) as BigNumberish;

      const redeemers = await getRedeemersArray(getTaskContract(provider));

      return weiToUsd(contractBalance) / redeemers.length;
    } catch (err) {
      console.log(err);
    }
  };

  const createTaskContract = async (props: CreateContractProps) => {
    const { budget, totalNumberOfStudents } = props;
    loading.value = true;
    try {
      const browserProvider = getBrowserProvider();

      await switchNetwork(sepoliaChainId);

      const wallet = await withTimeout(12000, browserProvider.getSigner());
      const budgetInWei = ethers.parseEther(usdToEth(budget).toString());

      const { contractABI, contractBinary } = getCompiledContract();

      const contractFactory = new ethers.ContractFactory(contractABI, contractBinary, wallet);

      const contract = await contractFactory.deploy(totalNumberOfStudents, {
        value: budgetInWei,
      });
      await contract.waitForDeployment();

      if (!contract) throw new Error('failed to create contract');
      /* const balance = await getContractBalance(
        contract.target as string | null,
      );
      */
      loading.value = false;
      return contract.target;
    } catch (err) {
      console.log(err);
    }

    loading.value = false;
  };
  const switchNetwork = async (targetedNetwork: number) => {
    const currentChainId = '0x' + (await window.ethereum.request({ method: 'eth_chainId' })).slice(2);
    const chainConfig =
      targetedNetwork === sepoliaChainId
        ? sepoliaTestnet
        : targetedNetwork === localGanacheChainId
        ? ganacheTestnet
        : null;
    const hexTargetedNetwork = '0x' + targetedNetwork.toString(16);

    if (chainConfig && currentChainId !== hexTargetedNetwork) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [chainConfig],
      });
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: hexTargetedNetwork }],
      });
    }
  };

  const cancelContract = async () => {
    loading.value = true;

    try {
      if (!contractAddress.value) throw new Error('Contract address not provided');

      // Replace with the actual freelancer address
      const browserProvider = getBrowserProvider();
      const signer = await withTimeout(12000, browserProvider.getSigner());
      const taskContract = getTaskContract(signer);
      const tx = await taskContract.cancelDeal();
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

  const hasTheStudentBeenPaid = async (studentAddress: string | undefined) => {
    if (!contractAddress.value) throw new Error('Contract address not provided');
    if (!studentAddress) throw new Error('Student address not provided');
    const provider = await getDefaultProvider();

    const taskContract = getTaskContract(provider);
    const redeemers = await getRedeemersArray(taskContract);
    return redeemers.includes(studentAddress);
  };

  const rewardStudents = async (addressList: string[] = [], gradeList: number[] = [], redeemAll = true) => {
    if (!contractAddress.value) throw new Error('Contract address not provided');
    if (addressList.length === 0) throw new Error('Address list cannot be empty');
    if (addressList.length !== gradeList.length)
      throw new Error('Address list and gradeList must have the same length');
    loading.value = true;

    try {
      // Replace with the actual freelancer address

      const browserProvider = getBrowserProvider();
      const signer = await withTimeout(12000, browserProvider.getSigner());
      const taskContract = getTaskContract(signer);
      const tx = await taskContract.redeemRewards(addressList, gradeList, redeemAll);
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

  const rewardSingleStudent = async (studentAddress: string, studentGrade: number) => {
    if (!contractAddress.value) throw new Error('Contract address not provided');

    loading.value = true;

    try {
      // Replace with the actual freelancer address

      const browserProvider = getBrowserProvider();
      const signer = await withTimeout(12000, browserProvider.getSigner());
      const taskContract = getTaskContract(signer);
      const tx = await taskContract.redeemSingleReward(studentAddress, studentGrade);
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

  const getRewardStudentsFee = async (addressList: string[] = [], gradeList: number[] = []) => {
    if (!contractAddress.value) return;

    loading.value = true;

    try {
      // Replace with the actual freelancer address
      const provider = await ethers.getDefaultProvider(networkUrl);
      const gasPrice = await provider.getFeeData();
      const taskContract = getTaskContract(provider);
      const estimatedGas = taskContract.estimateGas.redeemRewards(addressList, gradeList);

      console.log(`Estimated gas cost: ${ethers.formatEther(estimatedGas)} ETH`, gasPrice);
      return estimatedGas;
    } catch (error) {
      console.error('Error:', error);
    }

    loading.value = false;
  };

  const fetchContractReward = async () => {
    if (!contractAddress.value) return;
    const balance = await getContractReward();

    if (balance === undefined) return;
    contractBalance.value = balance;
  };
  return {
    createTaskContract,
    rewardStudents,
    getContractBalance,
    getRewardStudentsFee,
    loading,
    getContractReward,
    fetchContractReward,
    hasTheStudentBeenPaid,
    cancelContract,
    isThereBalance,
    isThereAContract,
    contractBalance,
    fetchContractBalance,
    rewardSingleStudent,
  };
};
