
const { task } = require("hardhat/config")
const { networkConfig } = require("../helper-hardhat-config")


task("burn-and-cross", "chain seletor of dest chain")
    .addOptionalParam("chainselector")
    .addOptionalParam("receiver", "receiver address on dest chain")
    .addOptionalParam("tokenid", "token ID to be crossed chain")
    .setAction(async (taskArgs, hre) => {
        let chainSelector
        let receiver
        const tokenId = taskArgs.tokenid
        const { firstAccount } = await getNamedAccounts()

        if (taskArgs.chainselector) {
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
            const nftPoolLockAndRelease = await hre.companionNetworks["destChain"].deployments.get("NFTPoolLockAndRelease")
            receiver = nftPoolLockAndRelease.address
            console.log(`receiver 没有设置，从配置文件读取`)
        }

        console.log(`receiver is ${receiver}`)


        //  nftPoolLockAndRelease.lockAndSendNFT(tokenId, firstAccount, chainSelector, receiver)

        //转移link token to 合约地址
        const klinkTokenAddress = networkConfig[network.config.chainId].linkToken
        const linkToken = await ethers.getContractAt("LinkToken", klinkTokenAddress)
        const nftPoolBurnAndMint = await ethers.getContract("NFTPoolBurnAndMint", firstAccount)
        //   const transferTx = await linkToken.transfer(nftPoolBurnAndMint.target, ethers.parseEther("10"))
        //  await transferTx.wait(6)
        const balance = await linkToken.balanceOf(nftPoolBurnAndMint.target)

        console.log(`balance of pool is ${balance}`)

        const wnft = await ethers.getContract("WrappedMyToken", firstAccount)
        //授权nftPoolLockAndRelease 合约权限调用这个持有的tokenid
        console.log(`看看pool地址 ${nftPoolBurnAndMint.target}`)
      //  await wnft.approve(nftPoolBurnAndMint.target, tokenId)

        console.log(`nftPoolBurnAndMint 授权成功`)

        console.log("tokenId:", tokenId)
        console.log("firstAccount:", firstAccount)
        console.log("chainSelector:", chainSelector)
        console.log("receiver:", receiver)
        console.log("nftPoolBurnAndMint.address:", nftPoolBurnAndMint.target)
        //授权成功即可调用 lockAndSendNFT
        const burnAndMintNFTtx = await nftPoolBurnAndMint.burnAndSendNFT(tokenId, firstAccount, chainSelector, receiver)

        console.log(`ccip 已经发送， 哈希地址是 ${burnAndMintNFTtx.hash}`)
    })

module.exports = {}