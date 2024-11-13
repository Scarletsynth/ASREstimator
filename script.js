// Handle theme toggle
var themeToggle = document.getElementById("theme-toggle-checkbox");
themeToggle.addEventListener("change", function() {
    if (this.checked) {
        document.body.classList.add("dark-theme");
    } else {
        document.body.classList.remove("dark-theme");
    }
});

// Handle collapsible content
document.addEventListener('DOMContentLoaded', function () {
    var collapsibles = document.getElementsByClassName("collapsible");

    for (var i = 0; i < collapsibles.length; i++) {
        collapsibles[i].addEventListener("click", function () {
            this.classList.toggle("active");
            var content = this.nextElementSibling;

            if (content.classList.contains("expanded")) {
                content.classList.remove("expanded");
                content.style.maxHeight = null;
            } else {
                var allContents = document.querySelectorAll('.collapsible-content');
                allContents.forEach(function(item) {
                    item.classList.remove('expanded');
                    item.style.maxHeight = null;
                });

                content.classList.add('expanded');
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    }
});


// Function to handle changes in the perfect voter checkbox
function handlePerfectVoterCheckbox() {
    var perfectVoterCheckbox = document.getElementById("perfectVoterCheckbox");
    var perfectVoterInputContainer = document.getElementById("perfectVoterInputContainer");

    if (perfectVoterCheckbox.checked) {
        perfectVoterInputContainer.style.display = "block";
    } else {
        perfectVoterInputContainer.style.display = "none";
        document.getElementById("perfectVoterInput").value = "";
    }
}

document.getElementById("perfectVoterCheckbox").addEventListener("change", handlePerfectVoterCheckbox);

// Add event listener for input in the perfect voter input box
document.getElementById("perfectVoterInput").addEventListener("input", handlePerfectVoterInput);

function handlePerfectVoterInput() {
    var perfectVoterInput = document.getElementById("perfectVoterInput");
    var perfectVoterValue = perfectVoterInput.value;

    // Remove commas for internal value handling
    var numericValue = perfectVoterValue.replace(/,/g, '').replace(/\D/g, '');

    // Format value with commas for display
    var formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    // Update the input value with formatted value for display
    perfectVoterInput.value = formattedValue;

    // Select all proposal input fields within the collapsible-container (Q1 section)
    var proposalInputs = document.querySelectorAll('.collapsible-container .proposal input[type="text"]:not([id^="totalVotingPower"])');
    proposalInputs.forEach(function(input) {
        input.value = formattedValue;
    });
}


// Function to format numerical inputs with commas for thousands separators
function formatNumericInput(input) {
    var value = input.value.replace(/\D/g, '');
    var formattedValue = numberWithCommas(value);
    input.value = formattedValue;
}

// Function to generate proposal input boxes dynamically
function generateProposalBoxes() {
    var proposalBoxesDiv = document.getElementById("pastProposals");
    if (!proposalBoxesDiv) return;

    proposalBoxesDiv.innerHTML = "";

    var pastProposals = [
        { name: "Proposal 1: Test Proposal (Which Animal Is The Cutest?)", totalVotingPower: 140857857 },
        { name: "Proposal 2: Round #1 of LFG Voting", totalVotingPower: 201857511 },
        { name: "Proposal 3: Core Working Group Budget", totalVotingPower: 198987006 },
        { name: "Proposal 4: Round #2 of LFG Voting", totalVotingPower: 230849742 },
        { 
            name: "Proposal 5: Catdet, WEB and Reddit Working Groups Budget", 
            totalVotingPower: 189097954, 
            subProposals: [
                { name: "Trial Budget: Reddit Working Group", daoTotalVotingPower: 189406552 },
                { name: "Trial Budget: Catdet Working Group", daoTotalVotingPower: 188577101 },
                { name: "Trial Budget: Web Working Group", daoTotalVotingPower: 189310210 }
            ]
        },
        { name: "Proposal 6: Round #3 of LFG Voting", totalVotingPower: 217498625 },
        { name: "Proposal 7: Uplink Working Group Budget", totalVotingPower: 177958477 }
    ];

    pastProposals.forEach(function(proposal, index) {
        var proposalBox = document.createElement("div");
        proposalBox.classList.add("proposal");
        proposalBox.innerHTML = `
            <div class="proposal-title-container">
                <h3>${proposal.name}</h3>
                ${index === 4 ? '<span class="tooltip proposal5-tooltip"><i class="info">i</i><span class="tooltiptext">These 3 different votes count as 1 Proposal in terms of rewards. If you missed any votes, type 0 for Your Voting Power accordingly. </span></span>' : ''}
            </div>
            ${index === 4 ? proposal.subProposals.map((subProposal, subIndex) => `
                <div class="sub-proposal">
                    <h4>${subProposal.name}</h4>
                    <label for="votingPowerSubProposal${subIndex + 1}">Your Voting Power:</label>
                    <input type="text" id="votingPowerSubProposal${subIndex + 1}" placeholder="How much did you vote with?" oninput="formatNumericInput(this)">
                    <label for="totalVotingPowerSubProposal${subIndex + 1}">DAO Total Voting Power:</label>
                    <input type="text" id="totalVotingPowerSubProposal${subIndex + 1}" value="${subProposal.daoTotalVotingPower.toLocaleString()}" disabled>
                </div>
            `).join('') : `
                <label for="votingPowerProposal${index + 1}">Your Voting Power:</label>
                <input type="text" id="votingPowerProposal${index + 1}" placeholder="How much did you vote with?" oninput="formatNumericInput(this)">
                <label for="totalVotingPowerProposal${index + 1}">DAO Total Voting Power:</label>
                <input type="text" id="totalVotingPowerProposal${index + 1}" value="${proposal.totalVotingPower.toLocaleString()}" disabled>
            `}
        `;
        proposalBoxesDiv.appendChild(proposalBox);
    });
}

window.onload = function() {
    generateProposalBoxes();
    generateQ2ProposalBoxes()
    // Show the Calculate Rewards button
    document.getElementById("calculateButton").style.display = "block";
};

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
console.time('calculateRewards');

// Function to fetch price for a specific token
async function fetchTokenPrice(tokenId, vsToken = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v') {
    try {
        const response = await fetch(`https://price.jup.ag/v6/price?ids=${tokenId}&vsToken=${vsToken}`);
        const data = await response.json();
        const price = data.data[tokenId].price;
        return price;
    } catch (error) {
        console.error(`Error fetching price for token ${tokenId}:`, error);
        return null;
    }
}


// Function to calculate rewards and display results
async function calculateRewards() {
    var allFieldsFilledQ1 = true;

    var pastProposalInputsQ1 = document.querySelectorAll('#pastProposals .proposal input[type="text"]');
    pastProposalInputsQ1.forEach(function(input) {
        if (input.value.trim() === '') {
            allFieldsFilledQ1 = false;
            input.classList.add('error');
        } else {
            input.classList.remove('error');
        }
    });

    if (!allFieldsFilledQ1) {
        alert('Please fill in all required fields in Q1.');
        return;
    }

    if (allFieldsFilledQ1) {
        var totalJupTokensAllocated = 50000000;
        var totalWENTokensAllocated = 7500000000;
        var totalZeusTokensAllocated = 7500000;
        var totalSharkyTokensAllocated = 750000;
        var totalUPROCKTokensAllocated = 7500000;

        var pastProposals = [
            { name: "Proposal 1", totalVotingPower: 140857857 },
            { name: "Proposal 2", totalVotingPower: 201857511 },
            { name: "Proposal 3", totalVotingPower: 198987006 },
            { name: "Proposal 4", totalVotingPower: 230849742 },
            { 
                name: "Proposal 5", 
                totalVotingPower: 189097954, 
                subProposals: [
                    { name: "Trial Budget: Reddit Working Group", daoTotalVotingPower: 189406552 },
                    { name: "Trial Budget: Catdet Working Group", daoTotalVotingPower: 188577101 },
                    { name: "Trial Budget: Web Working Group", daoTotalVotingPower: 189310210 }
                ]
            },
            { name: "Proposal 6", totalVotingPower: 217498625 },
            { name: "Proposal 7", totalVotingPower: 177958477 }
        ];

        var rewardPoolPerProposal = {
            JUP: totalJupTokensAllocated / 7,
            WEN: totalWENTokensAllocated / 7,
            ZEUS: totalZeusTokensAllocated / 7,
            SHARK: totalSharkyTokensAllocated / 7,
            UPROCK: totalUPROCKTokensAllocated / 7
        };

        var averageProposal5DaoVotingPower = (
            pastProposals[4].subProposals.reduce((sum, subProposal) => sum + subProposal.daoTotalVotingPower, 0) 
        ) / pastProposals[4].subProposals.length;

        pastProposals[4].totalVotingPower = averageProposal5DaoVotingPower;

        var rewardPerVotingPowerUnit = pastProposals.map(proposal => ({
            JUP: rewardPoolPerProposal.JUP / proposal.totalVotingPower,
            WEN: rewardPoolPerProposal.WEN / proposal.totalVotingPower,
            ZEUS: rewardPoolPerProposal.ZEUS / proposal.totalVotingPower,
            SHARK: rewardPoolPerProposal.SHARK / proposal.totalVotingPower,
            UPROCK: rewardPoolPerProposal.UPROCK / proposal.totalVotingPower
        }));

        var totalYourVotingPower = pastProposals.map((proposal, index) => {
            if (index === 4) {
                var subProposal1UserVotingPower = parseFloat(document.getElementById('votingPowerSubProposal1').value.replace(/\D/g, '')) || 0;
                var subProposal2UserVotingPower = parseFloat(document.getElementById('votingPowerSubProposal2').value.replace(/\D/g, '')) || 0;
                var subProposal3UserVotingPower = parseFloat(document.getElementById('votingPowerSubProposal3').value.replace(/\D/g, '')) || 0;
                return (subProposal1UserVotingPower + subProposal2UserVotingPower + subProposal3UserVotingPower) / 3;
            } else {
                return parseFloat(document.getElementById(`votingPowerProposal${index + 1}`).value.replace(/\D/g, '')) || 0;
            }
        });

        var totalRewards = {
            JUP: totalYourVotingPower.reduce((sum, vp, index) => sum + vp * rewardPerVotingPowerUnit[index].JUP, 0),
            WEN: totalYourVotingPower.reduce((sum, vp, index) => sum + vp * rewardPerVotingPowerUnit[index].WEN, 0),
            ZEUS: totalYourVotingPower.reduce((sum, vp, index) => sum + vp * rewardPerVotingPowerUnit[index].ZEUS, 0),
            SHARK: totalYourVotingPower.reduce((sum, vp, index) => sum + vp * rewardPerVotingPowerUnit[index].SHARK, 0),
            UPROCK: totalYourVotingPower.reduce((sum, vp, index) => sum + vp * rewardPerVotingPowerUnit[index].UPROCK, 0)
        };

        // Fetch prices for all tokens
        const jupPrice = await fetchTokenPrice('JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN');
        const wenPrice = await fetchTokenPrice('WENWENvqqNya429ubCdR81ZmD69brwQaaBYY6p3LCpk'); 
        const zeusPrice = await fetchTokenPrice('ZEUS1aR7aX8DFFJf5QjWj2ftDDdNTroMNGo8YoQm3Gq');  
        const sharkPrice = await fetchTokenPrice('SHARKSYJjqaNyxVfrpnBN9pjgkhwDhatnMyicWPnr1s');  
        const uprockPrice = await fetchTokenPrice('UPTx1d24aBWuRgwxVnFmX4gNraj3QGFzL3QqBgxtWQG');  

        // Ensure that all values are clean numbers
const rewardValuesInUSD = {
    JUP: jupPrice ? parseFloat((totalRewards.JUP * jupPrice).toFixed(4)) : NaN,
    WEN: wenPrice ? parseFloat((totalRewards.WEN * wenPrice).toFixed(4)) : NaN,
    ZEUS: zeusPrice ? parseFloat((totalRewards.ZEUS * zeusPrice).toFixed(4)) : NaN,
    SHARK: sharkPrice ? parseFloat((totalRewards.SHARK * sharkPrice).toFixed(4)) : NaN,
    UPROCK: uprockPrice ? parseFloat((totalRewards.UPROCK * uprockPrice).toFixed(4)) : NaN
};

// Calculate total USDC value by summing only valid numbers
const totalUSDCValue = (
    (isNaN(rewardValuesInUSD.JUP) ? 0 : rewardValuesInUSD.JUP) +
    (isNaN(rewardValuesInUSD.WEN) ? 0 : rewardValuesInUSD.WEN) +
    (isNaN(rewardValuesInUSD.ZEUS) ? 0 : rewardValuesInUSD.ZEUS) +
    (isNaN(rewardValuesInUSD.SHARK) ? 0 : rewardValuesInUSD.SHARK) +
    (isNaN(rewardValuesInUSD.UPROCK) ? 0 : rewardValuesInUSD.UPROCK)
).toFixed(2); // Adjust the number of decimal places as needed


        var resultsDiv = document.getElementById("results");
        if (resultsDiv) {
            resultsDiv.innerHTML = `
        <h2>Your Rewards Estimate total value: <strong>${totalUSDCValue} USDC</strong></h2>
        <p>JUP Reward Share: <strong>${totalRewards.JUP.toFixed(4)} JUP tokens</strong> <strong>(${rewardValuesInUSD.JUP} USDC)</strong></p>
        <p>WEN Reward Share: <strong>${totalRewards.WEN.toFixed(4)} WEN tokens</strong> <strong>(${rewardValuesInUSD.WEN} USDC)</strong></p>
        <p>Zeus Reward Share: <strong>${totalRewards.ZEUS.toFixed(4)} Zeus tokens</strong> <strong>(${rewardValuesInUSD.ZEUS} USDC)</strong></p>
        <p>Sharky Reward Share: <strong>${totalRewards.SHARK.toFixed(4)} Sharky tokens</strong> <strong>(${rewardValuesInUSD.SHARK} USDC)</strong></p>
        <p>UPROCK Reward Share: <strong>${totalRewards.UPROCK.toFixed(4)} UPROCK tokens</strong> <strong>(${rewardValuesInUSD.UPROCK} USDC)</strong></p>
        <p><em>USDC values powered by Jupiter Price API and reflect current prices at the time of calculation. Recalculate for a live update.</a></em></p>
        <p>These results display your total reward share. If you'd like to know the results per Voting Power Unit (1 locked $JUP), use 1 JUP as voting power in the estimate.</p>
        <p>The claim window for these rewards has closed.</p>
  <p><strong>If you found this useful, please use the /appreciate command in Discord, and Appurrciate the catdet that shared it with you! ❤️ PPP ❤️</strong></p>

    `;
}

        var statsDiv = document.getElementById("stats");
        if (statsDiv) {
            statsDiv.innerHTML = `
                <h2>More Stats</h2>
                <p>Total Voting Power Exercised by the Entire DAO: <strong>${pastProposals.reduce((sum, proposal) => sum + proposal.totalVotingPower, 0).toLocaleString()}</strong></p>
                <p>Your Total Voting Power across all proposals: <strong>${totalYourVotingPower.reduce((sum, vp) => sum + vp, 0).toLocaleString()}</strong></p>
                <p>JUP Reward Pool: <span id="totalRewardPools">[50,000,000 $JUP]</span></p>
                <p>WEN Reward Pool: <span id="totalRewardPools">[7,500,000,000 $WEN]</span></p>
                <p>Zeus Reward Pool: <span id="totalRewardPools">[7,500,000 $ZEUS]</span></p>
                <p>Sharky Reward Pool: <span id="totalRewardPools">[750,000 $SHARK]</span></p>
                <p>UPROCK Reward Pool: <span id="totalRewardPools">[7,500,000 $UPT]</span></p>
            `;
        }
        document.getElementById("results").style.display = "block";
        document.getElementById("stats").style.display = "block";
    }
}

document.querySelectorAll('input[type="text"], input[type="number"]').forEach(function(element) {
    element.addEventListener('input', hideResults);
});

function hideResults() {
    document.getElementById("results").style.display = "none";
    document.getElementById("stats").style.display = "none";
}
// Your code
console.timeEnd('calculateRewards');



// Function to generate Q2 proposal input boxes dynamically

function generateQ2ProposalBoxes() {
    var q2ProposalBoxesDiv = document.getElementById("q2PastProposals");
    if (!q2ProposalBoxesDiv) return; // Check if the element exists

    q2ProposalBoxesDiv.innerHTML = ""; // Clear previous boxes

    // Define Q2 past proposals with their respective total voting power
    var q2PastProposals = [
        { name: "Proposal 1: J4J #1: Supply Reduction Proposal", totalVotingPower: 274033926 },
        { name: "Proposal 2: Jupiter DAO: Microgrants Proposal", totalVotingPower: 267190808 },
        { name: "Proposal 3: Trial Budget: Jup & Juice WG (JJWG)", totalVotingPower: 256001468 },
        { name: "Proposal 4: J4J #2: Utilize Excess Jupuary for ASR", totalVotingPower: 307483434 }
    ];

    // Loop through Q2 past proposals and create HTML elements for each
    q2PastProposals.forEach(function(proposal, index) {
        var proposalBox = document.createElement("div");
        proposalBox.classList.add("proposal");
        proposalBox.innerHTML = `
            <h3>${proposal.name}</h3>
            <label for="q2VotingPowerProposal${index + 1}">Your Voting Power:</label>
            <input type="text" id="q2VotingPowerProposal${index + 1}" placeholder="How much did you vote with?" oninput="formatNumericInput(this)">
            <label for="q2TotalVotingPowerProposal${index + 1}">DAO Total Voting Power:</label>
            <input type="text" id="q2TotalVotingPowerProposal${index + 1}" value="${proposal.totalVotingPower.toLocaleString()}" disabled>
        `;
        q2ProposalBoxesDiv.appendChild(proposalBox);
    });
}


// Get the checkbox and input container for Q3
const perfectVoterCheckboxQ3 = document.getElementById('perfectVoterCheckbox-q3');
const perfectVoterInputContainerQ3 = document.getElementById('perfectVoterInputContainer-q3');
const perfectVoterInputQ3 = document.getElementById('perfectVoterInput-q3');

// Show input box when the checkbox is checked
perfectVoterCheckboxQ3.addEventListener('change', function() {
    if (this.checked) {
        perfectVoterInputContainerQ3.style.display = 'block';
    } else {
        perfectVoterInputContainerQ3.style.display = 'none';
    }
});

// Format input with thousands separator
perfectVoterInputQ3.addEventListener('input', function() {
    formatNumericInput(perfectVoterInputQ3);

    // Find the parent collapsible-content for Q3
    const q3CollapsibleContent = perfectVoterCheckboxQ3.closest('.collapsible-content');

    // Autopopulate all 'Your Voting Power' fields within Q3's collapsible-content
    const votingPowerInputsQ3 = q3CollapsibleContent.querySelectorAll('input[id^="q2VotingPowerProposal"]'); // Select only "Your Voting Power" inputs

    votingPowerInputsQ3.forEach(input => {
        input.value = perfectVoterInputQ3.value; // Populate with the value from the perfect voter input
    });
});


function parseDAOFormattedInput(value) {
    // Remove any unwanted characters except for digits and spaces
    const cleanedValue = value.replace(/[^\d\s]/g, ''); // Allow digits and spaces

    // Remove spaces for proper numeric parsing
    const finalValue = cleanedValue.replace(/\s/g, ''); // Remove all spaces

    return parseFloat(finalValue) || 0; // Convert to float and return 0 if NaN
}

    // Show the Calculate Q2 Rewards button
    document.getElementById("calculateQ2RewardsButton").style.display = "block";




// Function to fetch JUP price in USDC
async function fetchJupPrice() {
    try {
        const response = await fetch('https://price.jup.ag/v6/price?ids=JUP&vsToken=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'); // USDC mint address
        const data = await response.json();
        const jupPrice = data.data['JUP'].price;
        return jupPrice;
    } catch (error) {
        console.error('Error fetching JUP price:', error);
        return null;
    }
}

function parseFormattedInput(value) {
    // Remove any unwanted characters except for digits, commas, and spaces
    const cleanedValue = value.replace(/[^\d\s]/g, ''); // Allow digits and spaces
    const finalValue = cleanedValue.replace(/\s/g, ''); // Remove all spaces
    return parseFloat(finalValue) || 0; // Convert to float and return 0 if NaN
}

// Function to calculate and display Q2 rewards


async function calculateQ2Rewards() {

    var resultsDiv = document.querySelector(".q2-results");
    var statsDiv = document.querySelector(".q2-stats");

    if (!resultsDiv || !statsDiv) {
        console.error('Results or Stats div not found');
        return;
    }

    var allFieldsFilled = true;

    // Initialize total rewards and voting power
    var totalRewardShare = 0;
    var totalYourVotingPower = 0;
    var totalDaoVotingPower = 0;

    // Check all inputs for past proposals
    var q2PastProposalInputs = document.querySelectorAll('#q2PastProposals input[type="text"]');
    q2PastProposalInputs.forEach(function(input) {
        if (input.value.trim() === '') {
            allFieldsFilled = false;
            input.classList.add('error');
        } else {
            input.classList.remove('error');
        }
    });

    if (!allFieldsFilled) {
        alert('Please fill in all required fields.');
        return;
    }

    // Define the JUP reward pool
    var totalJupTokensAllocated = 50000000;

// Define the total Cloud tokens allocated as rewards
var totalCloudTokensAllocated = 7500000; // 7,500,000


    // Calculate total proposals count
    var pastProposalsCount = q2PastProposalInputs.length / 2;
    var totalProposalsCount = pastProposalsCount;

    // Calculate rewards for past proposals
    for (var i = 1; i <= pastProposalsCount; i++) {
        var totalVotingPowerInput = document.getElementById(`q2TotalVotingPowerProposal${i}`);
        var userVotingPowerInput = document.getElementById(`q2VotingPowerProposal${i}`);

        if (totalVotingPowerInput && userVotingPowerInput) {
            var totalVotingPower = parseFormattedInput(totalVotingPowerInput.value);
            var userVotingPower = parseFormattedInput(userVotingPowerInput.value);

            totalYourVotingPower += userVotingPower;
            totalDaoVotingPower += totalVotingPower;

            if (totalVotingPower > 0) {
                var rewardPoolPerProposal = totalJupTokensAllocated / totalProposalsCount;
                var rewardPerProposal = (userVotingPower / totalVotingPower) * rewardPoolPerProposal;
                totalRewardShare += rewardPerProposal;
            }
        }
    }


var totalCloudRewardShare = 0; // Initialize total Cloud reward share

for (var i = 1; i <= pastProposalsCount; i++) {
    var totalVotingPowerInput = document.getElementById(`q2TotalVotingPowerProposal${i}`);
    var userVotingPowerInput = document.getElementById(`q2VotingPowerProposal${i}`);

    if (totalVotingPowerInput && userVotingPowerInput) {
        var totalVotingPower = parseFormattedInput(totalVotingPowerInput.value);
        var userVotingPower = parseFormattedInput(userVotingPowerInput.value);

        if (totalVotingPower > 0) {
            var cloudRewardPoolPerProposal = totalCloudTokensAllocated / totalProposalsCount; // Split the Cloud tokens by proposals
            var cloudRewardPerProposal = (userVotingPower / totalVotingPower) * cloudRewardPoolPerProposal; // User's share for this proposal
            totalCloudRewardShare += cloudRewardPerProposal; // Add to the total Cloud reward share
        }
    }
}



    // Fetch JUP and Cloud prices in USDC
const jupPrice = await fetchJupPrice();
const cloudPrice = await fetchTokenPrice('CLoUDKc4Ane7HeQcPpE3YHnznRxhMimJ4MyaUqyHFzAu');

// Calculate USD values for rewards
const rewardValueInUSD = jupPrice ? parseFloat((totalRewardShare * jupPrice).toFixed(4)) : NaN;
const cloudRewardValueInUSD = cloudPrice ? parseFloat((totalCloudRewardShare * cloudPrice).toFixed(4)) : NaN;

const totalUSDCValue_Q2 = isNaN(rewardValueInUSD) ? 0 : rewardValueInUSD;
const totalCloudValue_Q2 = isNaN(cloudRewardValueInUSD) ? 0 : cloudRewardValueInUSD;

// Show the results section after calculation
resultsDiv.style.display = "block";
resultsDiv.innerHTML = `
    <h2>Your Rewards Estimate total value: <strong>${totalUSDCValue_Q2.toFixed(4)} USDC</strong></h2>
    <p>JUP Reward Share: <strong>${totalRewardShare.toFixed(4)} JUP tokens</strong> <strong>(${rewardValueInUSD} USDC)</strong></p>
        <p><em>USDC values powered by Jupiter Price API and reflect current prices at the time of calculation. Recalculate for a live update.</em></p>
    <p>These results display your total reward share. If you'd like to know the results per Voting Power Unit (1 locked $JUP), use 1 JUP as voting power in the estimate.</p>
    <p>ASR rewards will be distributed sometime in October.</p>
    <p><strong>If you found this tool useful, please use the /appreciate command in Discord, and Appurrciate the catdet that shared it with you! ❤️ PPP ❤️</strong></p>
`;

    // Show the stats section after calculation
    statsDiv.style.display = "block";
    statsDiv.innerHTML = `
       <p>Total Voting Power Exercised by the Entire DAO: <strong>${totalDaoVotingPower.toLocaleString()}</strong></p>
    <p>Your Total Voting Power across all proposals: <strong>${totalYourVotingPower.toLocaleString()}</strong></p>
    <p>JUP Reward Pool: <span id="totalRewardPools">[50,000,000 $JUP]</span></p>
    `;
}




// Generate Q4 past proposals on page load
document.addEventListener("DOMContentLoaded", function() {
    generateQ4PastProposals();
});

// Function to generate past proposals for Q4 dynamically
function generateQ4PastProposals() {
    var pastProposalsDiv = document.getElementById("q4PastProposals");
    if (!pastProposalsDiv) return;

    // Clear previous content
    pastProposalsDiv.innerHTML = "";

    // Define Q4 past proposals with known total voting power
    var q4PastProposals = [
        { name: "Proposal 1: JUP DAO Quorum Vote", totalVotingPower: 360642471 }
    ];

    // Loop through Q4 past proposals and create HTML elements for each
    q4PastProposals.forEach(function(proposal, index) {
        var proposalBox = document.createElement("div");
        proposalBox.classList.add("proposal");
        proposalBox.innerHTML = `
            <h3>${proposal.name}</h3>
            <label for="q4VotingPowerProposal${index + 1}">Your Voting Power:</label>
            <input type="text" id="q4VotingPowerProposal${index + 1}" placeholder="How much did you vote with?" oninput="formatNumericInput(this)">
            <label for="q4TotalVotingPowerProposal${index + 1}">Total Voting Power:</label>
            <input type="text" id="q4TotalVotingPowerProposal${index + 1}" value="${proposal.totalVotingPower.toLocaleString()}" disabled>
        `;
        pastProposalsDiv.appendChild(proposalBox);
    });
}



// Function to estimate future proposals for Q4 based on user input
function estimateQ4FutureProposals() {
    var numFutureProposals = parseInt(document.getElementById("q4NumFutureProposals").value);

    var futureProposalBoxesDiv = document.getElementById("q4FutureProposalBoxes");
    futureProposalBoxesDiv.innerHTML = ""; // Clear previous future proposal boxes

    // Check if the input box is empty or negative
    if (isNaN(numFutureProposals) || numFutureProposals < 0) {
        alert("Please enter a valid number of future proposals.");
        return;
    }

    // If there are no future proposals, display the calculate button
    if (numFutureProposals === 0) {
        document.getElementById("calculateQ4RewardsButton").style.display = "block";
        return;
    }

    // Generate future proposal input boxes
    for (var i = 1; i <= numFutureProposals; i++) {
        var futureProposalBox = document.createElement("div");
        futureProposalBox.classList.add("proposal");
        futureProposalBox.innerHTML = `
            <h3>Future Proposal ${i}</h3>
            <label for="q4VotingPowerFutureProposal${i}">Your Voting Power:</label>
            <input type="text" id="q4VotingPowerFutureProposal${i}" class="future-proposal-input" placeholder="How much will you vote with?" oninput="formatNumericInput(this)">
            <label for="q4TotalVotingPowerFutureProposal${i}">DAO Total Voting Power:</label>
            <input type="text" id="q4TotalVotingPowerFutureProposal${i}" class="future-proposal-input" placeholder="Enter the DAO Total voting power for this proposal" oninput="formatNumericInput(this)">
        `;
        futureProposalBoxesDiv.appendChild(futureProposalBox);
    }

    // Show the Calculate Rewards button
    document.getElementById("calculateQ4RewardsButton").style.display = "block";
}

// Function to format numerical inputs with commas for thousands separators
function formatNumericInput(input) {
    var value = input.value.replace(/\D/g, '');
    var formattedValue = numberWithCommas(value);
    input.value = formattedValue;
}

// Function to add commas for thousands separators
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


// Function to fetch JUP price in USDC
async function fetchJupPrice() {
    try {
        const response = await fetch('https://price.jup.ag/v6/price?ids=JUP&vsToken=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'); // USDC mint address
        const data = await response.json();
        const jupPrice = data.data['JUP'].price;
        return jupPrice;
    } catch (error) {
        console.error('Error fetching JUP price:', error);
        return null;
    }
}



// Function to fetch DBR price in USDC
async function fetchDbrPrice() {
    try {
        const response = await fetch('https://price.jup.ag/v6/price?ids=DBR&vsToken=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'); // USDC mint address
        const data = await response.json();
        const dbrPrice = data.data['DBR'].price;
        return dbrPrice;
    } catch (error) {
        console.error('Error fetching DBR price:', error);
        return null;
    }
}

// Function to calculate and display Q4 rewards
async function calculateQ4Rewards() {
    var resultsDiv = document.querySelector(".q4-results");
    var statsDiv = document.querySelector(".q4-stats");

    if (!resultsDiv || !statsDiv) {
        console.error('Results or Stats div not found');
        return;
    }

    var allFieldsFilled = true;

    // Initialize total rewards and voting power
    var totalJupRewardShare = 0;
    var totalDbrRewardShare = 0;
    var totalYourVotingPower = 0;
    var totalDaoVotingPower = 0;

    // Check all inputs for past proposals
    var q4PastProposalInputs = document.querySelectorAll('#q4PastProposals input[type="text"]');
    q4PastProposalInputs.forEach(function(input) {
        if (input.value.trim() === '') {
            allFieldsFilled = false;
            input.classList.add('error');
        } else {
            input.classList.remove('error');
        }
    });

    // Check all inputs for future proposals
    var q4FutureProposalInputs = document.querySelectorAll('#q4FutureProposalBoxes input[type="text"]');
    q4FutureProposalInputs.forEach(function(input) {
        if (input.value.trim() === '') {
            allFieldsFilled = false;
            input.classList.add('error');
        } else {
            input.classList.remove('error');
        }
    });

    if (!allFieldsFilled) {
        alert('Please fill in all required fields.');
        return;
    }

    // Define the reward pools
    var totalJupTokensAllocated = 50000000; // JUP pool
    var totalDbrTokensAllocated = 75000000; // DBR pool

    // Calculate total proposals count
    var pastProposalsCount = q4PastProposalInputs.length / 2; // Adjusted for Q4
    var numFutureProposals = parseInt(document.getElementById("q4NumFutureProposals").value, 10);
    if (isNaN(numFutureProposals) || numFutureProposals < 0) {
        numFutureProposals = 0;
    }
    var totalProposalsCount = pastProposalsCount + numFutureProposals;

    // Calculate rewards for JUP and DBR for all proposals
    for (var i = 1; i <= pastProposalsCount; i++) {
        var totalVotingPowerInput = document.getElementById(`q4TotalVotingPowerProposal${i}`);
        var userVotingPowerInput = document.getElementById(`q4VotingPowerProposal${i}`);

        if (totalVotingPowerInput && userVotingPowerInput) {
            var totalVotingPower = parseFormattedInput(totalVotingPowerInput.value);
            var userVotingPower = parseFormattedInput(userVotingPowerInput.value);

            totalYourVotingPower += userVotingPower;
            totalDaoVotingPower += totalVotingPower;

            if (totalVotingPower > 0) {
                var rewardPoolPerProposalJUP = totalJupTokensAllocated / totalProposalsCount;
                var rewardPoolPerProposalDBR = totalDbrTokensAllocated / totalProposalsCount;

                var rewardPerProposalJUP = (userVotingPower / totalVotingPower) * rewardPoolPerProposalJUP;
                var rewardPerProposalDBR = (userVotingPower / totalVotingPower) * rewardPoolPerProposalDBR;

                totalJupRewardShare += rewardPerProposalJUP;
                totalDbrRewardShare += rewardPerProposalDBR;
            }
        }
    }

    for (var i = 1; i <= numFutureProposals; i++) {
        var totalVotingPowerInput = document.getElementById(`q4TotalVotingPowerFutureProposal${i}`);
        var userVotingPowerInput = document.getElementById(`q4VotingPowerFutureProposal${i}`);

        if (totalVotingPowerInput && userVotingPowerInput) {
            var totalVotingPower = parseFormattedInput(totalVotingPowerInput.value);
            var userVotingPower = parseFormattedInput(userVotingPowerInput.value);

            totalYourVotingPower += userVotingPower;
            totalDaoVotingPower += totalVotingPower;

            if (totalVotingPower > 0) {
                var rewardPoolPerProposalJUP = totalJupTokensAllocated / totalProposalsCount;
                var rewardPoolPerProposalDBR = totalDbrTokensAllocated / totalProposalsCount;

                var rewardPerProposalJUP = (userVotingPower / totalVotingPower) * rewardPoolPerProposalJUP;
                var rewardPerProposalDBR = (userVotingPower / totalVotingPower) * rewardPoolPerProposalDBR;

                totalJupRewardShare += rewardPerProposalJUP;
                totalDbrRewardShare += rewardPerProposalDBR;
            }
        }
    }

    // Fetch JUP and DBR prices in USDC and calculate the equivalent value in USD
    const jupPrice = await fetchJupPrice();
    const dbrPrice = await fetchDbrPrice();

    const jupRewardValueInUSD = jupPrice ? parseFloat((totalJupRewardShare * jupPrice).toFixed(4)) : NaN;
    const dbrRewardValueInUSD = dbrPrice ? parseFloat((totalDbrRewardShare * dbrPrice).toFixed(4)) : NaN;

    const totalUSDCValue_Q4 = (jupRewardValueInUSD || 0) + (dbrRewardValueInUSD || 0);

// Assuming 'totalYourVotingPower' is your initial JUP and 'totalJupRewardShare' is the reward
var initialJupHolding = totalYourVotingPower;  // Replace with your actual value
var rewardJup = totalJupRewardShare;

// Calculate the APY for the quarter
var quarterlyAPY = (rewardJup / initialJupHolding) * 100;

// Display in the results section
resultsDiv.innerHTML = `
    <h2>Your Rewards Estimate:</h2>
    <p>JUP Reward Share: <strong>${totalJupRewardShare.toFixed(4)} JUP tokens</strong> <strong>(${jupRewardValueInUSD} USDC)</strong></p>
    <p><strong>Quarterly APY: ${quarterlyAPY.toFixed(2)}%</strong></p>
    <p><em>USDC values powered by Jupiter Price API and reflect current prices at the time of calculation. Recalculate for a live update.</em></p>
`;


// Show the results and stats after calculation
document.querySelector(".q4-results").style.display = "block";
document.querySelector(".q4-stats").style.display = "block";




    // Show the results section after calculation
    resultsDiv.style.display = "block";
    resultsDiv.innerHTML = `
        <h2>Your Rewards Estimate:</h2>
        <p>JUP Reward Share: <strong>${totalJupRewardShare.toFixed(4)} JUP tokens</strong> <strong>(${jupRewardValueInUSD} USDC)</strong></p>
        <p><em>USDC values powered by Jupiter Price API and reflect current prices at the time of calculation. Recalculate for a live update.</em></p>
        <p>These results display your total reward share. If you'd like to know the results per Voting Power Unit (1 locked $JUP), use 1 JUP as voting power in the estimate.</p>
  <p><strong>If you found this useful, please use the /appreciate command in Discord, and Appurrciate the catdet that shared it with you! ❤️ PPP ❤️</strong></p>

    `;

    // Show the stats section after calculation
    statsDiv.style.display = "block";
    statsDiv.innerHTML = `
        <h2>More Stats</h2>
        <p>Total Voting Power Exercised by the Entire DAO according to your estimate: <strong>${totalDaoVotingPower.toLocaleString()}</strong></p>
        <p>Your Total Voting Power across all proposals: <strong>${totalYourVotingPower.toLocaleString()}</strong></p>
        <p>JUP Reward Pool: <span id="totalRewardPools">[50,000,000 $JUP]</span></p>
    `;
}
