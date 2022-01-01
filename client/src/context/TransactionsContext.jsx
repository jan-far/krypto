import React, { useState, useEffect, createContext } from "react";
import { ethers } from "ethers";

import { contractABI, contractAddress } from "../utils/constants";

export const TransactionsContext = createContext({
  formData: {},
  isLoading: false,
  currentAccount: "",
  transactions: [],
  connectWallet: () => {},
  handleChange: () => {},
  sendTransaction: () => {},
});

const { ethereum } = window;

const getEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const transactionContract = new ethers.Contract(contractAddress, contractABI, signer);

  return transactionContract;
};

const TransactionsProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [formData, setFormData] = useState({ addressTo: "", amount: "", keyword: "", message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [transactionCount, setTransactionCount] = useState(localStorage.getItem("trxCount"));
  const [transactions, setTransactions] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const getAllTransactions = async () => {
    try {
      if (!ethereum) return alert("Please install metamask");

      const trxContract = getEthereumContract();
      const availableTrnxs = await trxContract.getAllTransactions();
      const structuredTrnxs = availableTrnxs.map((trnx) => ({
        addressTo: trnx.receiver,
        addressFrom: trnx.sender,
        timestamp: new Date(trnx.timestamp.toNumber() * 1000).toLocaleString(),
        message: trnx.message,
        keyword: trnx.keyword,
        amount: parseInt(trnx.amount._hex) / 10 ** 18,
      }));

      setTransactions(structuredTrnxs);
    } catch (error) {
      console.log(error);
      throw new Error("No Ethereum Object");
    }
  };

  const checkIfWalletIsConnected = async () => {
    try {
      if (!ethereum) return;

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length) {
        setCurrentAccount(accounts[0]);

        getAllTransactions();
      } else {
        console.log("No account found!");
      }
    } catch (error) {
      console.log(error);
      throw new Error("No Ethereum Object");
    }
  };

  const checkIfTransactionsExist = async () => {
    try {
      if (!ethereum) return alert("Please install metamask");

      const trxContract = getEthereumContract();
      const trxCount = await trxContract.getTransactionCount();
      window.localStorage.setItem("trxCount", trxCount);
    } catch (error) {
      console.log(error);
      throw new Error("No Ethereum Object");
    }
  };

  const connectWallet = async () => {
    try {
      if (!ethereum) return alert("Please install metamask");

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
      throw new Error("No Ethereum Object");
    }
  };

  const sendTransaction = async () => {
    try {
      if (!ethereum) return alert("Please install metamask");

      const { addressTo, amount, keyword, message } = formData;
      const transactionContract = getEthereumContract();
      const parsedAmount = ethers.utils.parseEther(amount);

      setIsLoading(true);

      await ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: currentAccount,
            to: addressTo,
            gas: "0X5208", //21000 GWEI
            value: parsedAmount._hex,
          },
        ],
      });

      const trxHash = await transactionContract.addToBlockchain(
        addressTo,
        parsedAmount,
        message,
        keyword
      );

      console.log(`Loading - ${trxHash.hash}`);
      await trxHash.wait();
      console.log(`Success - ${trxHash.hash}`);

      const trxCount = await transactionContract.getTransactionCount();

      setTransactionCount(trxCount.toNumber());
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      throw new Error("No Ethereum Object");
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
    checkIfTransactionsExist();
  }, []);

  return (
    <TransactionsContext.Provider
      value={{
        formData,
        isLoading,
        currentAccount,
        transactions,
        connectWallet,
        handleChange,
        sendTransaction,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
};

export default TransactionsProvider;
