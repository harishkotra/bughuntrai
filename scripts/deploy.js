const hre = require("hardhat");

async function main() {
  console.log("🚀 Starting deployment of BugHuntr.ai...\n");

  const [deployer] = await hre.ethers.getSigners();
  console.log("🔑 Deploying with account:", deployer.address);

  // Get balance using provider
  const provider = hre.ethers.provider;
  const balance = await provider.getBalance(deployer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(balance), "AIA\n");

  const BugHuntr = await hre.ethers.getContractFactory("BugHuntr");
  console.log("📄 Deploying BugHuntr.ai...");
  
  const bugHuntr = await BugHuntr.deploy();
  console.log("⏳ Waiting for deployment...");
  await bugHuntr.waitForDeployment();
  
  const deployedAddress = await bugHuntr.getAddress();
  console.log("✅ BugHuntr.ai deployed to:", deployedAddress);
  
  console.log("\n⏳ Waiting for block explorer to index the contract...");
  // Wait for a few blocks to ensure the contract is indexed
  await new Promise(resolve => setTimeout(resolve, 30000));

  console.log("\n🔍 Starting contract verification...");
  try {
    await hre.run("verify:verify", {
      address: deployedAddress,
      constructorArguments: [],
    });
    console.log("✅ Contract verified on block explorer!");
  } catch (error) {
    console.log("❌ Verification error:", error.message);
  }

  console.log("\n📝 Deployment Summary:");
  console.log("----------------------");
  console.log("Contract Address:", deployedAddress);
  console.log("Block Explorer:", `https://testnet.aiascan.com/address/${deployedAddress}`);
  console.log("Network:", hre.network.name);
  console.log("----------------------\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });