const { getNamedAccounts, ethers } = require("hardhat");
const { deleteDeployments } = require("hardhat-deploy/dist/src/utils");
const { expect } = require("chai")

let firstAccount
let ccipLocalSimulator
let nft
let nftPoolLockAndRelease
let nftPoolBurnAndMint
let wnft
let signer
before(async function () {

    firstAccount = (await getNamedAccounts()).firstAccount;
    const signer = await ethers.getSigner(firstAccount);

    await deployments.fixture(["all"]);
    ccipLocalSimulator = await ethers.getContract("CCIPLocalSimulator", firstAccount)
    nft = await ethers.getContract("MyToken", firstAccount)
    nftPoolLockAndRelease = await ethers.getContract("NFTPoolLockAndRelease", firstAccount)
    nftPoolBurnAndMint = await ethers.getContract("NFTPoolBurnAndMint", firstAccount)
    wnft = await ethers.getContract("WrappedMyToken", firstAccount)
    chainSelector = (await ccipLocalSimulator.configuration()).chainSelector_


})

/**
 * 以下三步是原链  到   目标链上的逻辑
 * 
 */
describe("source chain -> dest chain tests", async function (params) {
    it("测试 用户是否能够mint 一个mytoken  nft", async function () {
        await nft.safeMint(firstAccount);
        const owner = await nft.ownerOf(0);
        expect(owner).to.equal(firstAccount);
    })

    it("测试 用户是否能够 锁定nft 到nftpool 里 在原链上 并且发送ccip 消息", async function () {
        await nft.approve(nftPoolLockAndRelease.target, 0)
        //ethers.parseEther("10") 给与10 个link 
        await ccipLocalSimulator.requestLinkFromFaucet(nftPoolLockAndRelease, ethers.parseEther("10"))

        await nftPoolLockAndRelease.lockAndSendNFT(0,
            firstAccount,
            chainSelector,
            nftPoolBurnAndMint.target)

        const owner = await nft.ownerOf(0)
        expect(owner).to.equal(nftPoolLockAndRelease);
    })




    it("测试 用户能否得到一个wnft 到目标链上", async function () {
        const owner = await wnft.ownerOf(0)
        expect(owner).to.equal(firstAccount);
    })
})



/**
 * 下面是目标链到原链的逻辑
 * 
 * 
 */


describe("dest chain -> source chain tests", async function (params) {
    it("测试 用户是否能够烧掉wnft 并且发送ccip 消息 在原链上", async function () {
        await wnft.approve(nftPoolBurnAndMint.target, 0)
        //ethers.parseEther("10") 给与10 个link 
        await ccipLocalSimulator.requestLinkFromFaucet(nftPoolBurnAndMint, ethers.parseEther("10"))

        await nftPoolBurnAndMint.burnAndSendNFT(0,
            firstAccount,
            chainSelector,
            nftPoolLockAndRelease.target)

        //烧掉了 期望是0
        const totalSupply = await wnft.totalSupply()
        expect(totalSupply).to.equal(0);
    })


    it("测试 用户拥有nft 后 在原链上解锁", async function () {
        const owner = await nft.ownerOf(0)
        expect(owner).to.equal(firstAccount);
    })
})

//5、 测试 用户拥有nft 后 在原链上解锁