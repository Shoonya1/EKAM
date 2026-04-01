// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title EKAMToken
 * @notice ERC-20 token for the EKAM wellness super-app on Polygon.
 *         Users earn EKAM by completing workouts, meditation, nutrition logging,
 *         and other wellness activities. Daily reward cap prevents abuse.
 *
 * @dev    Inherits ERC20Burnable (users can burn their tokens) and
 *         ERC20Capped (hard cap of 100 000 000 EKAM).
 */
contract EKAMToken is ERC20, ERC20Burnable, ERC20Capped, Ownable {
    // ----------------------------------------------------------------
    // Constants
    // ----------------------------------------------------------------

    /// @notice Maximum tokens any single user can receive per calendar day.
    uint256 public constant DAILY_REWARD_CAP = 1_000 * 10 ** 18; // 1 000 EKAM

    // ----------------------------------------------------------------
    // Storage
    // ----------------------------------------------------------------

    /// @dev user => day-index => amount already rewarded that day.
    ///      Day-index = block.timestamp / 86400 (UTC day boundary).
    mapping(address => mapping(uint256 => uint256)) private _dailyRewards;

    /// @dev user => streak multiplier (basis-points; 10000 = 1.0x).
    ///      Defaults to 10000 if never set.
    mapping(address => uint256) public streakMultiplier;

    // ----------------------------------------------------------------
    // Events
    // ----------------------------------------------------------------

    event TokensRewarded(address indexed user, uint256 amount, string reason);
    event StreakMultiplierUpdated(address indexed user, uint256 multiplier);

    // ----------------------------------------------------------------
    // Constructor
    // ----------------------------------------------------------------

    /**
     * @param initialOwner Address that will own the contract and be
     *                     authorised to mint / set multipliers.
     */
    constructor(address initialOwner)
        ERC20("EKAM Token", "EKAM")
        ERC20Capped(100_000_000 * 10 ** 18) // 100 M cap
        Ownable(initialOwner)
    {}

    // ----------------------------------------------------------------
    // Public / External — Owner only
    // ----------------------------------------------------------------

    /**
     * @notice Reward a user with EKAM tokens for a wellness activity.
     * @param user   Recipient address.
     * @param amount Raw token amount (18 decimals).
     * @param reason Human-readable activity key, e.g. "wellness.completeWorkout".
     *
     * @dev The effective amount is `amount * streakMultiplier / 10000`.
     *      Reverts if the daily cap for `user` would be exceeded.
     */
    function rewardUser(
        address user,
        uint256 amount,
        string calldata reason
    ) external onlyOwner {
        require(user != address(0), "EKAMToken: zero address");
        require(amount > 0, "EKAMToken: zero amount");

        // Apply streak multiplier (default 1.0x = 10 000 bps)
        uint256 mult = streakMultiplier[user];
        if (mult == 0) mult = 10_000;
        uint256 effective = (amount * mult) / 10_000;

        // Enforce daily cap
        uint256 dayIndex = block.timestamp / 86400;
        uint256 used = _dailyRewards[user][dayIndex];
        require(used + effective <= DAILY_REWARD_CAP, "EKAMToken: daily cap exceeded");

        _dailyRewards[user][dayIndex] = used + effective;
        _mint(user, effective);

        emit TokensRewarded(user, effective, reason);
    }

    /**
     * @notice Set the streak multiplier for a user.
     * @param user       Target address.
     * @param multiplier Basis-points value (10000 = 1x, 15000 = 1.5x, etc.).
     */
    function setStreakMultiplier(
        address user,
        uint256 multiplier
    ) external onlyOwner {
        require(multiplier >= 10_000, "EKAMToken: multiplier < 1x");
        require(multiplier <= 30_000, "EKAMToken: multiplier > 3x");
        streakMultiplier[user] = multiplier;
        emit StreakMultiplierUpdated(user, multiplier);
    }

    // ----------------------------------------------------------------
    // Public / External — View
    // ----------------------------------------------------------------

    /**
     * @notice How many reward tokens a user has already received today.
     * @param user Address to query.
     * @return Amount in wei (18 decimals).
     */
    function getDailyRewardsUsed(address user) external view returns (uint256) {
        uint256 dayIndex = block.timestamp / 86400;
        return _dailyRewards[user][dayIndex];
    }

    /**
     * @notice How many reward tokens a user can still receive today.
     * @param user Address to query.
     * @return Remaining allowance in wei.
     */
    function getDailyRewardsRemaining(address user) external view returns (uint256) {
        uint256 dayIndex = block.timestamp / 86400;
        uint256 used = _dailyRewards[user][dayIndex];
        if (used >= DAILY_REWARD_CAP) return 0;
        return DAILY_REWARD_CAP - used;
    }

    // ----------------------------------------------------------------
    // Internal overrides (resolve diamond)
    // ----------------------------------------------------------------

    function _update(
        address from,
        address to,
        uint256 value
    ) internal override(ERC20, ERC20Capped) {
        super._update(from, to, value);
    }
}
