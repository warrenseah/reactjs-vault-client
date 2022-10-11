import { createContext, useState } from "react";
import { ethers } from "ethers";
import ContractMeta from "../contractMeta.json";

const UserContext = createContext({
  address: "",
  balance: 0,
  connectToMM: () => {},
  saveUserData: (address, balance) => {},
  saveUserAddress: (address) => {},
  saveUserBalance: () => {},
  vault: null,
  signer: null,
});

export const UserContextProvider = (props) => {
  const [userData, setUserData] = useState({ address: "", balance: 0 });
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [vault, setVault] = useState(null);

  // Button handler button for handling a
  // request event for metamask
  const connectToMetamask = async () => {
    // Asking if metamask is already present or not
    if (window.ethereum) {
      const newProvider = new ethers.providers.Web3Provider(window.ethereum);
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
    } else {
      alert("install metamask extension!!");
    }
  };

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

  return (
    <UserContext.Provider
      value={{
        address: userData.address,
        balance: userData.balance,
        connectToMM: connectToMetamask,
        saveUserData: saveUserData,
        saveUserAddress: saveUserAddress,
        saveUserBalance: saveUserBalance,
        vault: vault,
        signer: signer,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};

export default UserContext;
