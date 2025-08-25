module.exports = async ({ getNamedAccounts, deployments }) => {


        const { firstAccount } = await getNamedAccounts()  //const firstAccount = (await getNamedAccounts()).firstAccount
        const { deploy, log } = deployments  //  const deploy = deployments.deploy

        log("Deploying wnft contract ")

        await deploy("WrappedMyToken", {
            contract : "WrappedMyToken",
            from: firstAccount,
            args: ["WrappedMyToken", "WMT"],
            log: true
        })

           log("wnft contract deploying  successfully  部署成功 ")
   
}

//发布在目标链
module.exports.tags = ["destchain","all"]
