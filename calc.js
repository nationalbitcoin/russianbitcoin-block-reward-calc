const nDiff1Target = 0x00000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffn;
const nCoin = 100000000n;
const nCent = nCoin / 100n;

// ==== Reward calculation parameters ==== //

// Set startup difficulty here
const nStartupDiff = 65536n;

// Set maximum reward here
const nMaxReward = 300n * nCoin;

// Set current difficulty here
const nCurrentDiff = 13107200000n;

// Set k here
const k = 4n;

// ===== Utility function ==== //

function btcToString(n) {
    const wholeBTCs = n / 100000000n;
    const leftOver = n - wholeBTCs * 100000000n;

    if (0 < leftOver) {
        const remaining = leftOver.toString();
        const startPos = 8 - remaining.length;
        if (8 < startPos) {
            return wholeBTCs.toString();
        }
        const decimals = ('0'.repeat(startPos) + remaining).substr(0, 8);
        return wholeBTCs.toString() + '.' + decimals.toString();
    }

    return wholeBTCs.toString();
}

// ====== Reward estimation loop ===== //

let nLowerBound = nCent;
let nUpperBound = nMaxReward;

const nTarget = nDiff1Target / nCurrentDiff;
const nInitialTarget = nDiff1Target / nStartupDiff;
const nUintDifficulty = nInitialTarget * 1000000n / nTarget;

const nSubsidyPowK = nMaxReward ** k;

// Find new value of block subsidy at current block target
while (nLowerBound + nCent <= nUpperBound)
{
  const nMidValue = (nLowerBound + nUpperBound) >> 1n;
  const nMidValuePowK = nMidValue ** k;
  if (nMidValuePowK * nUintDifficulty > nSubsidyPowK * 1000000n)
    nUpperBound = nMidValue;
  else
    nLowerBound = nMidValue;
}

console.log(btcToString(nUpperBound));
