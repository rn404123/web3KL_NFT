const { developmentChains, networkConfig } = require("../helper-hardhat-config")
const { ethers,network,getNamedAccounts } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {

    const { firstAccount } = await getNamedAccounts()  //const firstAccount = (await getNamedAccounts()).firstAccount
    const { deploy, log } = deployments  //  const deploy = deployments.deploy

    log("NFTPoolBurnAndMint deploying....... ")
    let destChainRouter;
    let linkTokenAddr;
    if (developmentChains.includes(network.name)) {

        const cCIPLocalSimulator = await deployments.get("CCIPLocalSimulator");

        const ccipSimulator = await ethers.getContractAt("CCIPLocalSimulator", cCIPLocalSimulator.address);
        const ccipConfig = await ccipSimulator.configuration();

        destChainRouter = ccipConfig.destinationRouter_;
        linkTokenAddr = ccipConfig.linkToken_;


    } else {
        destChainRouter = networkConfig[network.config.chainId].router
        linkTokenAddr = networkConfig[network.config.chainId].linkToken
    }

    const wnftDeploymnt = await deployments.get("WrappedMyToken");
    const wnftAddr = wnftDeploymnt.address;




    await deploy("NFTPoolBurnAndMint", {
        contract: "NFTPoolBurnAndMint",
        //部署人
        from: firstAccount,
        //构造参数  address _router, address _link, address nftAddr
        args: [destChainRouter, linkTokenAddr, wnftAddr],
        //打印日志信息
        log: true

    })

    log("nft Burn And Mint  部署成功...........")

}

module.exports.tags = ["destchain", "all"]
