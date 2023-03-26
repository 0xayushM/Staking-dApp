import React, { useEffect, useState } from "react";
import NFTCard from "../Cards/NFTCard";
import BuidlNFT from "@/ABIs/BuidlNFT.json";
import Staking from "@/ABIs/Staking.json";
import { useAccount, useContract, useProvider } from "wagmi";
import { ethers } from "ethers";

const StakedNFT = () => {
  const { address } = useAccount();
  const provider = useProvider();
  const [rewardBal, setRewardBal] = useState();
  const [tokenId, setTokenId] = useState();
  const [tokenURI, setTokenURI] = useState("");

  const stakingContract = useContract({
    address: Staking.address,
    abi: Staking.abi,
    signerOrProvider: provider,
  });
  const nftContract = useContract({
    address: BuidlNFT.address,
    abi: BuidlNFT.abi,
    signerOrProvider: provider,
  });

  useEffect(() => {
    if (address) {
      const getStakedNFTs = async () => {
        try {
          const tx = await stakingContract?.stakeTokenId(address);
          setTokenId(tx.toNumber());
          console.log(tx.toNumber());
          const tx2 = await nftContract?.tokenURI(tokenId);
          setTokenURI(tx2);
        } catch (err) {
          console.log(err);
        }
      };
      getStakedNFTs();
    }
    if (address) {
      const getReward = async () => {
        try {
          const reward = await stakingContract?.calculateReward(address);
          setRewardBal(ethers.utils.formatUnits(reward, 18));
        } catch (err) {
          console.log(err);
        }
      };
      getReward();
    }
  }, [tokenId, address, stakingContract, nftContract]);
  return (
    <div className="flex flex-col mx-auto text-center">
      <h2 className="text-2xl">Your Staked NFTs</h2>
      <div className="mx-auto my-7">
      {tokenURI && rewardBal ? (
          <NFTCard url={tokenURI} stake={false} tokenId={tokenId} />
        ) : (
          <section className="border p-5 rounded-lg shadow-lg">
            <h1 className="my-5 text-lg">No NFTs Staked !</h1>
          </section>
        )}
      </div>
    </div>
  );
};

export default StakedNFT;
