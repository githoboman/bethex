// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title BotChainBethex
 * @dev Foundational contract for the Bethex prediction/exchange protocol on BOT Chain.
 * Configured with official Mainnet addresses for WBOT and USDT.
 */
contract BotChainBethex {
    // BOT Chain Mainnet Configuration
    address public constant WBOT = 0xD5452816194a3784dBa983426cCe7c122F4abd30;
    address public constant USDT = 0xaBabc7Ddc03e501d190C676BF3d92ef0e6e87a3C;

    address public owner;

    // Events
    event Deposit(address indexed user, address token, uint256 amount);
    event Withdrawal(address indexed user, address token, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev Deposit WBOT or USDT into the protocol
     * @param token Address of the token to deposit
     * @param amount Amount to deposit
     */
    function deposit(address token, uint256 amount) external {
        require(token == WBOT || token == USDT, "Unsupported token");
        require(amount > 0, "Amount must be > 0");

        IERC20(token).transferFrom(msg.sender, address(this), amount);
        emit Deposit(msg.sender, token, amount);
    }

    /**
     * @dev Withdraw tokens from the protocol (Owner only for this simple version)
     * @param token Address of the token to withdraw
     * @param amount Amount to withdraw
     */
    function withdraw(address token, uint256 amount) external onlyOwner {
        require(token == WBOT || token == USDT, "Unsupported token");
        IERC20(token).transfer(owner, amount);
        emit Withdrawal(owner, token, amount);
    }
}
