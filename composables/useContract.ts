import { ethers } from 'ethers';

import TaskOwnerReedemsContract from '@/build/contracts/TaskOwnerReedemsContract.json';
import GiveawayContract from '@/build/contracts/GiveawayContract.json';

declare global {
  interface Window {
    ethereum: any;
  }
}

export const useContracts = () => {
  const loading = ref(false);
  const usdToEth = (usdAmount: number) => {
    const ethExchangeRate = 3000;
    return usdAmount / ethExchangeRate;
  };

  const networkUrl = 'http://localhost:7545';

  const createTaskContract = async (budget: number) => {
    loading.value = true;
    console.log('createTaskContract');
    try {
      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      const wallet = await withTimeout(12000, browserProvider.getSigner());
      const budgetInWei = ethers.parseEther(usdToEth(budget).toString());

      await earnFunds(wallet.address, budgetInWei);

      const contractABI = TaskOwnerReedemsContract.abi;
      const contractBinary = TaskOwnerReedemsContract.bytecode;
      const contractFactory = new ethers.ContractFactory(
        contractABI,
        contractBinary,
        wallet,
      );
      const unlockTime = Math.floor(Date.now() / 1000) + 600;

      console.log({ usdt: budget, wei: budgetInWei });
      const contract = await contractFactory.deploy(unlockTime, {
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

  const rewardStudents = async (
    contractAddress: string | undefined,
    addressList: string[] = [],
  ) => {
    console.log({ addressList });
    if (!contractAddress) return;
    if (addressList.length === 0) return;
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
      const tx = await TaskContract.redeemRewards(addressList);
      await tx.wait(); // Wait for the transaction to be mined
      console.log('Students paid successfully!');
    } catch (error) {
      console.error('Error:', error);
    }

    loading.value = false;
  };

  return { createTaskContract, rewardStudents, loading };
};
