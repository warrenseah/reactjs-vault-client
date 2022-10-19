import { createContext, useState, useCallback } from "react";
import { ethers } from "ethers";
import ContractMeta from "../contractMeta.json";
import { showToast } from "../lib/utils";

const UserContext = createContext({
  address: "",
  balance: 0,
  connectToMM: () => {},
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

  // Button handler button for handling a
  // request event for metamask
  const connectToMetamask = useCallback(async () => {
    // Asking if metamask is already present or not
    if (window.ethereum) {
      const newProvider = new ethers.providers.Web3Provider(window.ethereum);
      const chainId = await newProvider.getNetwork();

      if(chainId.chainId !== 97) {
        showToast("Switch and use BNB Test Network", 'warning');
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
      showToast(`Wallet connected: ${accounts[0]}`);
    } else {
      showToast("Install metamask extension!", 'info');
    }
  }, []);

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

  return (
    <UserContext.Provider
      value={{
        address: userData.address,
        balance: userData.balance,
        connectToMM: connectToMetamask,
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
