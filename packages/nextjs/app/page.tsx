"use client";

import { useState } from "react";
import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Address, AddressInput } from "~~/components/scaffold-eth";
import {
  useScaffoldReadContract,
  useScaffoldWatchContractEvent,
  useScaffoldWriteContract,
} from "~~/hooks/scaffold-eth";

// Définir le type pour les logs d'adresse utilisateur
interface UserAddressLog {
  _userAddress: string;
}

const Home: NextPage = () => {
  // connected wallet
  const { address: connectedAddress } = useAccount();

  // READ 'userAddress' from contract
  const { data: userAddressValueFromContract } = useScaffoldReadContract({
    contractName: "YourContract",
    functionName: "userAddress",
  });

  // DISPLAY 'userAddress' on the website. Link contract to Front.
  const [userAddressValue, setUserAddressValue] = useState<string>(userAddressValueFromContract || "");

  // INPUT for new 'userAddress'
  const handleUserAddressChange = (newValue: string) => {
    setUserAddressValue(newValue);
  };

  // EVENT emitted when 'userAddress' is updated.
  const [userAddressLogs, setUserAddressLogs] = useState<UserAddressLog[]>([]);
  useScaffoldWatchContractEvent({
    contractName: "YourContract",
    eventName: "UserAddressUpdated",
    // The onLogs function is called whenever a UserAddressUpdated event is emitted by the contract.
    // Parameters emitted by the event can be destructed using the below example
    // for this example: event UserAddressUpdated(address _userAddress);
    onLogs: logs => {
      const newLogs = logs.map(log => {
        const { _userAddress } = log.args;
        console.log("📡 UserAddressUpdated event", _userAddress);
        return { _userAddress: _userAddress ?? "" }; // Provide a default empty string if _userAddress is undefined
      });
      // Set removes double, otherwise the same address is added every 4 seconds. Only in local blockchain ?
      setUserAddressLogs(prevLogs => {
        const combinedLogs = [...prevLogs, ...newLogs];
        const uniqueLogs = Array.from(new Set(combinedLogs.map(log => log._userAddress))).map(_userAddress => ({
          _userAddress,
        }));
        return uniqueLogs;
      });
    },
  });

  const { writeContractAsync: writeYourContractAsync } = useScaffoldWriteContract("YourContract");

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">Scaffold-ETH 2</span>
          </h1>
          <div className="flex justify-center items-center space-x-2 flex-col sm:flex-row">
            <p className="my-2 font-medium">Connected Address:</p>
            <Address address={connectedAddress} />
          </div>
          <div className="flex jsustify-center items-center space-x-2 flex-col sm:flex-row">
            <p className="my-2 font-medium">User Address from contract:</p>
            <Address address={userAddressValueFromContract} />
          </div>

          {/* Set User Address */}
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0">
            <div className="flex justify-center items-center space-x-2">
              <p className="my-2 font-medium">User Address:</p>
              <AddressInput
                onChange={handleUserAddressChange}
                value={userAddressValue}
                placeholder="Set User Address"
              />
            </div>
            <div className="flex justify-center items-center space-x-2">
              <button
                className="btn btn-primary"
                onClick={async () => {
                  try {
                    await writeYourContractAsync({
                      functionName: "setUserAddress",
                      args: [userAddressValue],
                    });
                  } catch (e) {
                    console.error("Error setting new User Address:", e);
                  }
                }}
              >
                Set address
              </button>
            </div>
          </div>

          <h1>Events: </h1>
          <ul>
            {userAddressLogs.map((log, index) => (
              <li key={index}>User Address: {log._userAddress}</li>
            ))}
          </ul>
        </div>

        <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <BugAntIcon className="h-8 w-8 fill-secondary" />
              <p>
                Tinker with your smart contract using the{" "}
                <Link href="/debug" passHref className="link">
                  Debug Contracts
                </Link>{" "}
                tab.
              </p>
            </div>
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <MagnifyingGlassIcon className="h-8 w-8 fill-secondary" />
              <p>
                Explore your local transactions with the{" "}
                <Link href="/blockexplorer" passHref className="link">
                  Block Explorer
                </Link>{" "}
                tab.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
