
const { developmentChains } = require("../helper-hardhat-config")


module.exports = async ({ getNamedAccounts, deployments }) => {

    if (developmentChains.includes(network.name)) {
        const { firstAccount } = await getNamedAccounts()  //const firstAccount = (await getNamedAccounts()).firstAccount
        const { deploy, log } = deployments  //  const deploy = deployments.deploy

        log("Deploying CCIP 本地mock 合约 ")

        await deploy("CCIPLocalSimulator", {
            contract: "CCIPLocalSimulator",
            from: firstAccount,
            args: [],
            log: true
        })

        log("ccip 本地合约部署成功")

    }

}

module.exports.tags = ["test", "all"]
