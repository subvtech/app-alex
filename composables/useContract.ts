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
    try {
      if (!contractAddress) return;
      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      const contractBalance = (await browserProvider.getBalance(
        contractAddress,
      )) as BigNumberish;
      console.log({ contractBalance });
      return contractBalance;
    } catch (err) {
      console.log(err);
    }
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
      let contractABI;
      let contractBinary;
      if (chosenContract === 'TaskOwnerReedemsContract') {
        contractABI = TaskOwnerReedemsContract.abi;
        contractBinary = TaskOwnerReedemsContract.bytecode;
      } else {
        contractABI = TaskOwnerReedemsContract2.abi;
        contractBinary = TaskOwnerReedemsContract2.bytecode;
      }

      const contractFactory = new ethers.ContractFactory(
        contractABI,
        contractBinary,
        wallet,
      );

      console.log({ usdt: budget, wei: budgetInWei });
      const contract = await contractFactory.deploy({
        value: budgetInWei,
      });
      console.log({ contractAddress: contract.target });
      if (!contract) throw new Error('failed to create contract');

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

  const rewardStudents = async (
    contractAddress: string | undefined,
    addressList: string[] = [],
    gradeList: number[] = [],
  ) => {
    console.log({ addressList });
    if (!contractAddress) return;
    if (addressList.length === 0) return;
    if (addressList.length !== gradeList.length) return;
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
    } catch (error) {
      console.error('Error:', error);
    }

    loading.value = false;
  };

  return {
    createTaskContract,
    rewardStudents,
    getContractBalance,
    weiToUsd,
    usdToEth,
    loading,
  };
};
