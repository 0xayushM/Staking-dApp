const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  try {
    const NFT = await ethers.getContractFactory("BuidlNFT");
    const nft = await NFT.deploy("BuidlNFT", "BN");
    await nft.deployed();
    console.log("Contract address:", nft.address);

    const TOKEN = await ethers.getContractFactory("BuidlToken");
        const token = await TOKEN.deploy("BuidlToken", "BT");
        await token.deployed();
        console.log("Token Contract Address:", token.address);

        const STAKING = await ethers.getContractFactory("Staking");
        const staking = await STAKING.deploy(nft.address, token.address);
        await staking.deployed();
        console.log("Staking Contract Address:", staking.address);
  console.log("Sleeping.....");
  await sleep(40000);

    await hre.run("verify:verify", {
      address: nft.address,
      constructorArguments: ["BuidlNFT", "BN"],
    });
    await hre.run("verify:verify", {
      address: token.address,
      constructorArguments: ["BuidlToken", "BT"],
    });
    await hre.run("verify:verify", {
      address: staking.address,
      constructorArguments: [nft.address, token.address],
    });
  } catch (error) {
    console.error(error);
  }

}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


// BuidlNFT = https://mumbai.polygonscan.com/address/0x422769cEab12968Ee9450024913bC2D24C6f086E#code
// BuidlToken = https://mumbai.polygonscan.com/address/0xcF80b4291557514A7f445088D6D8393756e9C167#code
// Staking = https://mumbai.polygonscan.com/address/0xA48fD186299366CEC5c69400E96A3b96275Ae01E#code