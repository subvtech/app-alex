import { BigNumberish, ethers } from 'ethers';

export const usdToEth = (usdAmount: number) => {
  const ethExchangeRate = 3000;
  return usdAmount / ethExchangeRate;
};

export const ethToUsd = (usdAmount: number) => {
  // console.log({ ethToUsd: usdAmount });
  const ethExchangeRate = 3000;
  return ethExchangeRate * usdAmount;
};

export const weiToUsd = (weiAmount: BigNumberish) => {
  // console.log({ weiToUsd: weiAmount });
  // console.log({ formatWeiToUsd: ethers.formatEther(weiAmount) });
  return ethToUsd(parseFloat(ethers.formatEther(weiAmount)));
};
