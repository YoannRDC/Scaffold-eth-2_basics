
// Initial project:
See https://scaffoldeth.io/

// Documentation
See https://scaffold-eth-2-docs.vercel.app/

// *********
// Setup
// *********

Launch the hardhat blockchain: 
-> yarn chain

Deploy the contracts:
-> yarn Deploy

Launch the website: 
-> yarn start


// *********
// Implemented functions from the documentation
// *********

⚙ Components
-> <Address>
-> <Balance>
-> <AddressInput>
-> <EtherInput>
-> <InputBase>
-> <IntegerInput>
-> <RainbowKitCustomConnectButton>

🛠 Interacting with Your Smart Contracts
-> useScaffoldReadContract
-> useScaffoldWriteContract
-> useScaffoldWatchContractEvent
-> useScaffoldEventHistory (block number and status missing)



// *********
// Debug
// *********

-> Error: eth_sendRawTransaction ==> Nonce too high. Expected nonce to be 0 but got 6. Note that transactions can't be queued when automining.
Onpen Metamask -> 'Parameters' -> 'Advanced parameters' -> 'Erase Activity of the tab'.  Then retry transaction.

