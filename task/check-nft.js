
const { task } = require("hardhat/config")

task("check-nft").setAction(async(taskArgs, hre)=>{
    const { firstAccount }  = await getNamedAccounts()
    const nft = await ethers.getContract("MyToken", firstAccount)

    const totalSupply =  await nft.totalSupply()

    console.log("检查 Mytoken 状态")
    for(let tokenId = 0; tokenId < totalSupply; tokenId ++){
        const owner = await nft.ownerOf(tokenId)

            console.log(`TokenId: ${tokenId} - owner: ${owner}`)
    }

})

module.exports = {}