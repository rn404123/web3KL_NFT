const { developmentChains, networkConfig } = require("../helper-hardhat-config")

const { ethers, network } = require("hardhat");


module.exports = async ({ getNamedAccounts, deployments }) => {

    const { firstAccount } = await getNamedAccounts()  //const firstAccount = (await getNamedAccounts()).firstAccount
    const { deploy, log } = deployments  //  const deploy = deployments.deploy

    log("NFTPoolLockAndRelease deploying....... ")

    let sourceChainRouter
    let linkTokenAddr

    if (developmentChains.includes(network.name)) {

        const cCIPLocalSimulator = await deployments.get("CCIPLocalSimulator");

        const ccipSimulator = await ethers.getContractAt("CCIPLocalSimulator", cCIPLocalSimulator.address);
        const ccipConfig = await ccipSimulator.configuration();

        sourceChainRouter = ccipConfig.sourceRouter_;
        linkTokenAddr = ccipConfig.linkToken_;

    } else {
        sourceChainRouter = networkConfig[network.config.chainId].router
        linkTokenAddr = networkConfig[network.config.chainId].linkToken
    }


    const nftDeploymnt = await deployments.get("MyToken");
    const nftAddr = nftDeploymnt.address;




    await deploy("NFTPoolLockAndRelease", {
        contract: "NFTPoolLockAndRelease",
        //部署人
        from: firstAccount,
        //构造参数  address _router, address _link, address nftAddr
        args: [sourceChainRouter, linkTokenAddr, nftAddr],
        //打印日志信息
        log: true

    })

    log("nft pool lock and release 部署成功...........")
}

module.exports.tags = ["sourcechain", "all"]
