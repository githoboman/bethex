// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/BotChainBethex.sol";

contract DeployBethex is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);

        BotChainBethex bethex = new BotChainBethex();
        
        vm.stopBroadcast();
        
        console.log("BotChainBethex deployed to:", address(bethex));
    }
}
