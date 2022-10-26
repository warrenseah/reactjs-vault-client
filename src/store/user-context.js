import { createContext, useState, useCallback } from "react";
import { ethers } from "ethers";
import ContractMeta from "../contractMeta.json";
import { showToast } from "../lib/utils";

const UserContext = createContext({
  address: "",
  balance: 0,
  chainId: 0,
  referrer: '0',
  connectToMM: (closeSpinnerFunc) => {},
  saveUserData: (address, balance) => {},
  saveUserAddress: (address) => {},
  saveUserBalance: () => {},
  resetMM: () => {},
  vault: null,
  signer: null,
  provider: null,
});

// const chainId = ethers.BigNumber.from(56).toHexString(); // BNB chain
// const chainId2 = ethers.BigNumber.from(97).toHexString(); // BNB chain testnet
// const chainId3 = ethers.BigNumber.from(1337).toHexString(); // hardhat node test network

export const UserContextProvider = (props) => {
  const [userData, setUserData] = useState({ address: "", balance: 0 });
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [vault, setVault] = useState(null);
  const [selectedChain] = useState(ContractMeta.chain_id);
  const [hasReferrer, setHasReferrer] = useState(false);
  const [referrerId, setReferrerId] = useState('0');

  // Button handler button for handling a
  // request event for metamask
  const connectToMetamask = useCallback(async (closeSpinnerFunc) => {
    // Asking if metamask is already present or not
    if (window.ethereum) {
      const newProvider = new ethers.providers.Web3Provider(window.ethereum);
      const chainId = await newProvider.getNetwork();

      if(chainId.chainId !== selectedChain) {
        showToast("Switch and use BNB Test Network", 'warning');
        closeSpinnerFunc() // stop spinner display
        return;
      }

      const accounts = await newProvider.send("eth_requestAccounts", []);
      const balance = await newProvider.getBalance(accounts[0]);
      setUserData({
        address: accounts[0],
        balance: ethers.utils.formatEther(balance),
      });

      const newSigner = newProvider.getSigner();
      setProvider(newProvider);
      setSigner(newSigner);

      // instantiate contract abstraction
      const newVault = new ethers.Contract(
        ContractMeta.vaultAddress,
        ContractMeta.vaultAbi,
        newSigner
      );
      setVault(newVault);

      const doesReferrerExists = await newVault.hasReferrer(accounts[0]);
      setHasReferrer(doesReferrerExists);
      
      showToast(`Wallet connected: ${accounts[0]}`);
    } else {
      showToast("Install metamask extension!", 'info');
      closeSpinnerFunc();
    }
  }, [selectedChain]);

  const saveUserData = (address, balance) => {
    setUserData({ address, balance });
  };

  const saveUserAddress = (address) => {
    setUserData(prev => { 
        return { ...prev, address}; 
    });
  };

  const saveUserBalance = async () => {
    const newBalance = await signer.getBalance();
    setUserData(prev => { 
        return { ...prev, balance : ethers.utils.formatEther(newBalance)}; 
    });
  };

  const resetMM = useCallback(() => {
    setUserData({ address: "", balance: 0 });
    setVault(null);
    setSigner(null);
    setProvider(null);
  }, []);

  const saveReferrerId = useCallback((id) => {
    if(!hasReferrer) {
      setReferrerId(id);
      console.log('User dont have referrer address.');
      return;
    }

    console.log('User has a referrer id');
  }, [hasReferrer]);

  return (
    <UserContext.Provider
      value={{
        address: userData.address,
        balance: userData.balance,
        chainId: selectedChain,
        referrer: referrerId,
        connectToMM: connectToMetamask,
        saveReferrerId: saveReferrerId,
        saveUserData: saveUserData,
        saveUserAddress: saveUserAddress,
        saveUserBalance: saveUserBalance,
        resetMM: resetMM,
        vault: vault,
        signer: signer,
        provider: provider,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};

export default UserContext;
