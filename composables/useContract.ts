import { BigNumberish, ethers } from 'ethers';

import TaskOwnerSingleRedeem2 from '@/build/contracts/TaskOwnerSingleRedeem2.json';

declare global {
  interface Window {
    ethereum: any;
  }
}

export interface CreateContractProps {
  budget: number;
  totalNumberOfStudents: number;
}

export interface CancelledContractProps {
  contractAddress: string;
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

  const getCompiledContract = () => {
    return {
      contractABI: TaskOwnerSingleRedeem2.abi,
      contractBinary: TaskOwnerSingleRedeem2.bytecode,
    };
  };

  const createTaskContract = async (props: CreateContractProps) => {
    const { budget, totalNumberOfStudents } = props;
    loading.value = true;
    try {
      const browserProvider = new ethers.BrowserProvider(window.ethereum);

      await switchNetwork(localGanacheChainId);

      const wallet = await withTimeout(12000, browserProvider.getSigner());
      const budgetInWei = ethers.parseEther(usdToEth(budget).toString());

      const { contractABI, contractBinary } = getCompiledContract();

      const contractFactory = new ethers.ContractFactory(
        contractABI,
        contractBinary,
        wallet,
      );

      const contract = await contractFactory.deploy(totalNumberOfStudents, {
        value: budgetInWei,
      });
      await contract.waitForDeployment();

      if (!contract) throw new Error('failed to create contract');
      const balance = await getContractBalance(
        contract.target as string | null,
      );
      loading.value = false;
      return contract.target;
    } catch (err) {
      console.log(err);
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
    const { contractAddress } = props;
    console.log(props);

    loading.value = true;

    try {
      if (!contractAddress) throw new Error('Contract address not provided');
      const { contractABI } = getCompiledContract();

      // Replace with the actual freelancer address
      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      const signer = await withTimeout(12000, browserProvider.getSigner());
      const taskContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer,
      );
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

  const hasTheStudentBeenPaid = async (
    contractAddress: string | undefined,
    studentAddress: string | undefined,
  ) => {
    if (!contractAddress) throw new Error('Contract address not provided');
    if (!studentAddress) throw new Error('Student address not provided');
    const provider = await ethers.getDefaultProvider(networkUrl);
    const { contractABI } = getCompiledContract();

    const taskContract = new ethers.Contract(
      contractAddress,
      contractABI,
      provider,
    );
    const redeemers: string[] = [];
    try {
      let i = 0;
      try {
        while (i < 100) {
          redeemers.push(await taskContract.redeemers(i));
          i++;
        }
      } catch (err) {}

      console.log({ redeemers, studentAddress });
      console.log(`Redeemers: ${redeemers.join(', ')}`); // Assuming redeemers is an array
    } catch (error) {
      console.error('Error reading public variables:', error);
    }
    return redeemers.includes(studentAddress);
  };

  const rewardStudents = async (
    contractAddress: string | undefined,
    addressList: string[] = [],
    gradeList: number[] = [],
    redeemAll = true,
  ) => {
    if (!contractAddress) throw new Error('Contract address not provided');
    if (addressList.length === 0)
      throw new Error('Address list cannot be empty');
    if (addressList.length !== gradeList.length)
      throw new Error('Address list and gradeList must have the same length');
    loading.value = true;

    const { contractABI } = getCompiledContract();

    try {
      // Replace with the actual freelancer address

      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      const signer = await withTimeout(12000, browserProvider.getSigner());
      const taskContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer,
      );
      const tx = await taskContract.redeemRewards(
        addressList,
        gradeList,
        redeemAll,
      );
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

    const contractABI = TaskOwnerSingleRedeem2.abi;

    try {
      // Replace with the actual freelancer address

      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      const signer = await withTimeout(12000, browserProvider.getSigner());
      const taskContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer,
      );
      const tx = await taskContract.redeemSingleReward(
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

    const contractABI = TaskOwnerSingleRedeem2.abi;

    try {
      // Replace with the actual freelancer address
      const provider = await ethers.getDefaultProvider(networkUrl);
      const gasPrice = await provider.getFeeData();
      const taskContract = new ethers.Contract(
        contractAddress,
        contractABI,
        provider,
      );
      const estimatedGas = taskContract.estimateGas.redeemRewards(
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
    const { contractABI, contractBinary } = getCompiledContract();
    const provider = await ethers.getDefaultProvider(networkUrl);
    const contractFactory = new ethers.ContractFactory(
      contractABI,
      contractBinary,
      provider,
    );

    const deployedTransaction = await contractFactory.getDeployTransaction(2);

    console.log({ deployedTransaction });
    const estimatedGas = await provider.estimateGas(deployedTransaction);
    // Estimate gas for deployment
    console.log({ estimatedGas });
    // Step 3: Get current gas price
    const feeData = await provider.getFeeData();
    // Step 4: Calculate the fee
    const gasPrice = feeData.gasPrice;

    if (!gasPrice) return;
    // Convert the gas price from Wei to Gwei or Ether for better readability
    const gasPriceInEth = ethers.formatUnits(gasPrice, 'ether');
    const gasPriceInGwei = ethers.formatUnits(gasPrice, 'gwei');
    const gasPriceInWei = ethers.formatUnits(gasPrice, 'wei');
    console.log(estimatedGas);
    console.log(feeData);
    console.log(`Estimated deployment fee: ${gasPriceInEth} ETH`);
    console.log(`Estimated deployment fee: ${gasPriceInGwei} Gwei`);
    console.log(`Estimated deployment fee: ${gasPriceInWei} Wei`);

    return weiToUsd(gasPrice);
  };

  return {
    createTaskContract,
    rewardStudents,
    getContractBalance,
    weiToUsd,
    usdToEth,
    getRewardStudentsFee,
    loading,
    hasTheStudentBeenPaid,
    cancelContract,
    getDeployContractFee,
    rewardSingleStudent,
  };
};
