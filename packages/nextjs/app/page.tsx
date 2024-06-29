"use client";

import { useState } from "react";
import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Address, AddressInput } from "~~/components/scaffold-eth";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const Home: NextPage = () => {
  // connected wallet
  const { address: connectedAddress } = useAccount();

  // READ 'yoannAddress' from contract
  const { data: yoannAddressValueFromContract } = useScaffoldReadContract({
    contractName: "YourContract",
    functionName: "yoannAddress",
  });

  // DISPLAY 'yoannAddress' on the website. Link contract to Front.
  const [yoannAddressValue, setYoannAddressValue] = useState<string>(yoannAddressValueFromContract || "");

  // INPUT for new 'yoannAddress'
  const handleYoannAddressChange = (newValue: string) => {
    setYoannAddressValue(newValue);
  };

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
            <p className="my-2 font-medium">Yoann Address from contract:</p>
            <Address address={yoannAddressValueFromContract} />
          </div>

          {/* Set Yoann Address */}
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0">
            <div className="flex justify-center items-center space-x-2">
              <p className="my-2 font-medium">Yoann Address:</p>
              <AddressInput
                onChange={handleYoannAddressChange}
                value={yoannAddressValue}
                placeholder="Set Yoann Address"
              />
            </div>
            <div className="flex justify-center items-center space-x-2">
              <button
                className="btn btn-primary"
                onClick={async () => {
                  try {
                    await writeYourContractAsync({
                      functionName: "setYoannAddress",
                      args: [yoannAddressValue],
                    });
                  } catch (e) {
                    console.error("Error setting new Yoann Address:", e);
                  }
                }}
              >
                Set address
              </button>
            </div>
          </div>
          <p className="text-center text-lg">
            Get started by editing{" "}
            <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
              packages/nextjs/app/page.tsx
            </code>
          </p>
          <p className="text-center text-lg">
            Edit your smart contract{" "}
            <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
              YourContract.sol
            </code>{" "}
            in{" "}
            <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
              packages/hardhat/contracts
            </code>
          </p>
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
