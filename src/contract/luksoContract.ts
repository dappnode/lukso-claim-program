import { ethers } from "ethers";
import { address } from "./address.js";
import { Abi__factory, Abi } from "../types/contracts/index.js";
import { luksoNetworkParams } from "../params.js";

// READ
// addressToIncentive =>  Mapping of beneficiaries to their respective incentive data. mapping(address => IncentiveData) public addressToIncentive;
// incentiveDuration => Duration of the incentive since it's assigned. uint256 public incentiveDuration;
// validatorNum => Number of validator that are assigned to every beneficiary. uint256 public validatorNum;
// WRITE
// claimIncentive => Allows a beneficiary to claim his incentive, the beneficiary provide the deposit data and the contract pay the deposit cost on his behalf
//   @param data Deposit data, encoded the same way that SBCDepositContract, see: https://github.com/NethermindEth/gnosischain-deposit-contract/blob/master/contracts/SBCDepositContract.sol#L120 in the will pass it further to the LUKSO deposit contract.
/**
 * REQUIREMENTS TO CLAIM INCENTIVE
 *       require(
            data.length == validatorNum * 176 + 32,
            "IncentiveDepositContract::claimIncentive:: incorrect deposit data length"
        );

        require(
            addressToIncentive[msg.sender].isClaimed == false,
            "IncentiveDepositContract::claimIncentive:: incentive already claimed"
        );

        require(
            addressToIncentive[msg.sender].endTime >= block.timestamp,
            "IncentiveDepositContract::claimIncentive:: incentive timeout"
        );
 */

const provider = new ethers.JsonRpcProvider(luksoNetworkParams.rpcUrl, {
  name: luksoNetworkParams.name,
  chainId: luksoNetworkParams.chainIdNumber,
});

const contract: Abi = Abi__factory.connect(address, provider);
