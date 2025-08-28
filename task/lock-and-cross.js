
const { task } = require("hardhat/config")
const { networkConfig } = require("../helper-hardhat-config")
const { network, deployments } = require("hardhat")

task("lock-and-cross", "chain seletor of dest chain")
    .addOptionalParam("chainSelector")
    .addOptionalParam("receiver", "receiver address on dest chain")
    .addOptionalParam("tokenId", "token ID to be crossed chain")
    .setAction(async (taskArgs, hre) => {
        let chainSelector
        let receiver
        const tokenId = taskArgs.tokenId
        const { firstAccount } = await getNamedAccounts()

        if (taskArgs.chainSelector) {
            //如果有值则取参数里的.否则取配置文件里的
            chainSelector = taskArgs.chainSelector
        } else {
            chainSelector = networkConfig[network.config.chainId].companionChainSelector
            console.log(`chainSelector 没有设置，从配置文件读取`)
        }
        console.log(`chainSelector is ${chainSelector}`)
        if (taskArgs.receiver) {
            receiver = taskArgs.receiver
        } else {
            const nftPoolBurnAndMint = hre.companionNetworks["destChain"].deployments.get("NFTPoolBurnAndMint")
            receiver = nftPoolBurnAndMint.address
            console.log(`receiver 没有设置，从配置文件读取`)
        }
        console.log(`receiver is ${receiver}`)

        const nftPoolLockAndRelease = await ethers.getContract("NFTPoolLockAndRelease", firstAccount)
        nftPoolLockAndRelease.lockAndSendNFT(tokenId, firstAccount, chainSelector, receiver)


    })

module.exports = {}