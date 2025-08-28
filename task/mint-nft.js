
const { task } = require("hardhat/config")

task("mint-nft").setAction(async(taskArgs, hre)=>{
    const { firstAccount }  = await getNamedAccounts()
    const nft = await ethers.getContract("MyToken", firstAccount)

    const totalSupply =  await nft.totalSupply()

    console.log("开始mint  nft 合约............")
    const mintTx = await nft.safeMint(firstAccount)
    mintTx.wait(6)

      console.log("nft  被mint 成功了...........")

})

module.exports = {}