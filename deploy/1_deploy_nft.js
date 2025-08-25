

module.exports = async ({ getNamedAccounts, deployments }) => {

        const { firstAccount } = await getNamedAccounts()  //const firstAccount = (await getNamedAccounts()).firstAccount
        const { deploy, log } = deployments  //  const deploy = deployments.deploy

        log("Deploying nft contract ")

        await deploy("MyToken", {
            contract: "MyToken",
            from: firstAccount,
            args: ["MyToken", "MT"],
            log: true
        })

        log("mynft contract deploying  successfully  部署成功 ")


}

module.exports.tags = ["sourcechain", "all"]
