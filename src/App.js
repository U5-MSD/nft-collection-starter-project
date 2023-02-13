import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import "./styles/App.css";
import twitterLogo from "./assets/twitter-logo.svg";
import myEpicNft from "./utils/MyEpicNFT.json";

const TWITTER_HANDLE = "";
const TWITTER_LINK = "";
const OPENSEA_LINK = "";
const TOTAL_MINT_COUNT = 50;

const App = () =>{
  const [currentAccount, setCurrentAccount] = useState("");
  console.log("currentAccount:",currentAccount);
  
  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;
    if(!ethereum){
      console.log("Make sure you have MetaMask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }
    const accounts = await ethereum.request({ method: "eth_accounts" });
    if(accounts.length != 0){
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account);
      setupEventListener();
    } else {
      console.log("No authorized account found");
    }
  };

  const connectWallet = async () => {
    try{
      const { ethereum } = window;
      if(!ethereum) {
        alert("Get MetaMask!");
        return;
      }
      const accounts = await ethereum.request({method:"eth_requestAccounts"});
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
      setupEventListener();
    } catch (error){
      console.log(error);
    }
  };

  const setupEventListener = async () => {
    const CONTRACT_ADDRESS = "0x4C40e7703D4b42f82428369d0c8E7BAf9A76b996";
    try{
      const { ethereum } = window;
      if(ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS,myEpicNft.abi,signer);
        connectedContract.on("NewEpicNFTMinted",(from,tokenId) => {
          console.log(from,tokenId.toNumber());
          alert("sent NFT to your wallet");
        });
        console.log("Setup event listener!");
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error){
      console.log(error);
    }
  };

  const askContractToMintNft = async () => {
    const CONTRACT_ADDRESS = "0x4C40e7703D4b42f82428369d0c8E7BAf9A76b996";
    try{
      const { ethereum } = window;
      if(ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS,myEpicNft.abi,signer);
        console.log("Going to pop wallet now to pay gas...");
        let nftTxn = await connectedContract.makeAnEpicNFT();
        console.log("Mining...please wait.");
        await nftTxn.wait();
        console.log(`Mined, see transaction: https://goerli.etherscan.io/tx/${nftTxn.hash}`);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch(error){
      console.log(error);
    }
  };

  const renderNotConnectedContainer = () => (
    <button className="cta-button connect-wallet-button" onClick={connectWallet}>
      Connect to Wallet
    </button>
  );

  useEffect( () => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">My NFT Collection</p>
          <p className="sub-text">Mint NFT</p>
          {currentAccount === "" ? (renderNotConnectedContainer()) : (<button onClick={askContractToMintNft} className="cta-button connect-wallet-button">Mint</button>)}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo}/>
          <a className="footer-text" href={TWITTER_LINK} target="_blank" rel="noreferrer">
            {`built on @{TWITTER_HANDLE}`}
          </a>
        </div>
      </div>
    </div>
  );

};
export default App;