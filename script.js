// Get the checkbox element
var themeToggle = document.getElementById("theme-toggle-checkbox");

// Listen for changes in the checkbox state
themeToggle.addEventListener("change", function() {
    // Check if the checkbox is checked (dark mode enabled)
    if (this.checked) {
        // Apply dark theme
        document.body.classList.add("dark-theme");
    } else {
        // Remove dark theme
        document.body.classList.remove("dark-theme");
    }
});

// Function to handle changes in the perfect voter checkbox
function handlePerfectVoterCheckbox() {
    var perfectVoterCheckbox = document.getElementById("perfectVoterCheckbox");
    var perfectVoterInputContainer = document.getElementById("perfectVoterInputContainer");

    if (perfectVoterCheckbox.checked) {
        // Show the perfect voter input box
        perfectVoterInputContainer.style.display = "block";
    } else {
        // Hide the perfect voter input box and clear its value
        perfectVoterInputContainer.style.display = "none";
        document.getElementById("perfectVoterInput").value = "";
    }
}

// Add event listener for changes in the perfect voter checkbox
document.getElementById("perfectVoterCheckbox").addEventListener("change", handlePerfectVoterCheckbox);


// Add event listener for input in the perfect voter input box
document.getElementById("perfectVoterInput").addEventListener("input", handlePerfectVoterInput);


// Function to handle changes in the perfect voter input box
function handlePerfectVoterInput() {
    var perfectVoterInput = document.getElementById("perfectVoterInput");
    var perfectVoterValue = perfectVoterInput.value;

    // Remove non-numeric characters and format the value with commas
    var formattedValue = perfectVoterValue.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    // Update the perfect voter input box with the formatted value
    perfectVoterInput.value = formattedValue;

    // Update the input boxes for past and future proposals with the formatted value
    var proposalInputs = document.querySelectorAll('.proposal input[type="text"]:not([id^="totalVotingPower"])');
    proposalInputs.forEach(function(input) {
        input.value = formattedValue;
    });
}


// Function to format numerical inputs with commas for thousands separators
function formatNumericInput(input) {
    var value = input.value.replace(/\D/g, ''); // Remove non-numeric characters
    var formattedValue = numberWithCommas(value); // Format the value with commas
    input.value = formattedValue; // Set the input value with the formatted value
}

// Function to generate proposal input boxes dynamically
function generateProposalBoxes() {
    var proposalBoxesDiv = document.getElementById("pastProposals");
    if (!proposalBoxesDiv) return; // Check if the element exists

    proposalBoxesDiv.innerHTML = ""; // Clear previous boxes

    // Define past proposals with their respective total voting power
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

    // Loop through past proposals and create HTML elements for each
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

// Function to estimate future proposals based on user input
function estimateFutureProposals() {
    var numFutureProposals = parseInt(document.getElementById("numFutureProposals").value);

    var futureProposalBoxesDiv = document.getElementById("futureProposalBoxes");
    futureProposalBoxesDiv.innerHTML = ""; // Clear previous future proposal boxes

    for (var i = 1; i <= numFutureProposals; i++) { 
        var futureProposalBox = document.createElement("div");
        futureProposalBox.classList.add("proposal");
        futureProposalBox.innerHTML = `
            <h3>Future Proposal ${i}</h3>
            <label for="votingPowerFutureProposal${i}">Your Voting Power:</label>
            <input type="text" id="votingPowerFutureProposal${i}" class="future-proposal-input" placeholder="How much will you vote with?" oninput="formatNumericInput(this)">
            <label for="totalVotingPowerFutureProposal${i}">DAO Total Voting Power:</label>
            <input type="text" id="totalVotingPowerFutureProposal${i}" class="future-proposal-input" placeholder="Enter the DAO Total voting power for this proposal (suggested 250,000,000)" oninput="formatNumericInput(this)">
        `;
        futureProposalBoxesDiv.appendChild(futureProposalBox); 
        // Add event listeners for hover effect to the newly generated proposal box
        futureProposalBox.addEventListener('mouseover', function() {
            this.classList.add('hovered');
        });
        futureProposalBox.addEventListener('mouseout', function() {
            this.classList.remove('hovered');
        });
    }

 // Check if the input box is empty
    if (isNaN(numFutureProposals) || numFutureProposals < 0) {
        // Display an error message and return
        alert("Please enter a valid number of future proposals.");
        return;
    }


 // Show the Calculate Rewards button
    document.getElementById("calculateButton").style.display = "block";

}



// Function to add commas for thousands separators
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function calculateRewards() {
    // Check if all required fields are filled in
    var allFieldsFilled = true;

    // Check past proposal inputs
    var pastProposalInputs = document.querySelectorAll('.proposal input[type="text"]');
    pastProposalInputs.forEach(function(input) {
        if (input.value.trim() === '') {
            allFieldsFilled = false;
            // Apply error styling to the input
            input.classList.add('error');
        } else {
            // Remove error styling if present
            input.classList.remove('error');
        }
    });

    // Check future proposal inputs
    var futureProposalInputs = document.querySelectorAll('.future-proposal-input');
    futureProposalInputs.forEach(function(input) {
        if (input.value.trim() === '') {
            allFieldsFilled = false;
            // Apply error styling to the input
            input.classList.add('error');
        } else {
            // Remove error styling if present
            input.classList.remove('error');
        }
    });

    // If there are empty fields, display a warning message and return
    if (!allFieldsFilled) {
        alert('Please fill in all required fields.');
        return;
    }

    // Proceed with calculations if all fields are filled in
    if (allFieldsFilled) {
        // Calculate total voting power across all past proposals
        var totalVotingPower = 0;
        for (var i = 1; i <= 7; i++) { // Updated to include Proposal 7
            var input = document.getElementById(`totalVotingPowerProposal${i}`);
            if (input) {
                var votingPower = parseFloat(input.value.replace(/\D/g, '')) || 0;
                totalVotingPower += votingPower;
            }
        }

        // Calculate total voting power for Proposal 5 (DAO)
        var subProposal1DaoVotingPower = document.getElementById('totalVotingPowerSubProposal1') ? parseFloat(document.getElementById('totalVotingPowerSubProposal1').value.replace(/\D/g, '')) || 0 : 0;
        var subProposal2DaoVotingPower = document.getElementById('totalVotingPowerSubProposal2') ? parseFloat(document.getElementById('totalVotingPowerSubProposal2').value.replace(/\D/g, '')) || 0 : 0;
        var subProposal3DaoVotingPower = document.getElementById('totalVotingPowerSubProposal3') ? parseFloat(document.getElementById('totalVotingPowerSubProposal3').value.replace(/\D/g, '')) || 0 : 0;
        var averageProposal5DaoVotingPower = (subProposal1DaoVotingPower + subProposal2DaoVotingPower + subProposal3DaoVotingPower) / 3;
        totalVotingPower += averageProposal5DaoVotingPower;

        // Calculate total voting power for future proposals
        var numFutureProposals = parseInt(document.getElementById("numFutureProposals").value) || 0;
        for (var i = 1; i <= numFutureProposals; i++) {
            var input = document.getElementById(`totalVotingPowerFutureProposal${i}`);
            if (input) {
                var votingPower = parseFloat(input.value.replace(/\D/g, '')) || 0;
                totalVotingPower += votingPower;
            }
        }

        // Define power and reward pools
        var totalJupTokensAllocated = 50000000; // Total number of JUP tokens allocated
        var totalWENTokensAllocated = 7500000000; // Total number of WEN tokens allocated
        var totalZeusTokensAllocated = 7500000; // Total number of Zeus tokens allocated
        var totalSharkyTokensAllocated = 750000; // Total number of Sharky tokens allocated
        var totalUPROCKTokensAllocated = 7500000; // Total number of UPROCK tokens allocated

        var JUPrewardPerVotingPowerUnit = totalJupTokensAllocated / totalVotingPower;
        var WENrewardPerVotingPowerUnit = totalWENTokensAllocated / totalVotingPower;
        var ZeusrewardPerVotingPowerUnit = totalZeusTokensAllocated / totalVotingPower;
        var sharkyRewardPerVotingPowerUnit = totalSharkyTokensAllocated / totalVotingPower;
        var UPROCKrewardPerVotingPowerUnit = totalUPROCKTokensAllocated / totalVotingPower;

        // Calculate total user voting power
        var totalYourVotingPower = 0;
        for (var i = 1; i <= 7; i++) { // Updated to include Proposal 7
            var input = document.getElementById(`votingPowerProposal${i}`);
            if (input) {
                var votingPower = parseFloat(input.value.replace(/\D/g, '')) || 0;
                totalYourVotingPower += votingPower;
            }
        }

        // Calculate total voting power for Proposal 5 (User)
        var subProposal1UserVotingPower = document.getElementById('votingPowerSubProposal1') ? parseFloat(document.getElementById('votingPowerSubProposal1').value.replace(/\D/g, '')) || 0 : 0;
        var subProposal2UserVotingPower = document.getElementById('votingPowerSubProposal2') ? parseFloat(document.getElementById('votingPowerSubProposal2').value.replace(/\D/g, '')) || 0 : 0;
        var subProposal3UserVotingPower = document.getElementById('votingPowerSubProposal3') ? parseFloat(document.getElementById('votingPowerSubProposal3').value.replace(/\D/g, '')) || 0 : 0;
        var averageProposal5UserVotingPower = (subProposal1UserVotingPower + subProposal2UserVotingPower + subProposal3UserVotingPower) / 3;
        totalYourVotingPower += averageProposal5UserVotingPower;

        for (var i = 1; i <= numFutureProposals; i++) {
            var input = document.getElementById(`votingPowerFutureProposal${i}`);
            if (input) {
                var votingPower = parseFloat(input.value.replace(/\D/g, '')) || 0;
                totalYourVotingPower += votingPower;
            }
        }

        // Calculate reward shares for the user
        var jupRewardShare = JUPrewardPerVotingPowerUnit * totalYourVotingPower;
        var WENRewardShare = WENrewardPerVotingPowerUnit * totalYourVotingPower;
        var zeusRewardShare = ZeusrewardPerVotingPowerUnit * totalYourVotingPower;
        var sharkyRewardShare = sharkyRewardPerVotingPowerUnit * totalYourVotingPower;
        var UPROCKRewardShare = UPROCKrewardPerVotingPowerUnit * totalYourVotingPower;

        // Show the results section after calculation
        document.getElementById("results").style.display = "block";

        // Update the results section with the calculated rewards
        var resultsDiv = document.getElementById("results");
        if (resultsDiv) {
            resultsDiv.innerHTML = `
                <h2>Your Rewards Estimate</h2>
                <p>JUP Reward Share: <strong>${jupRewardShare.toFixed(4)} JUP tokens</strong></p>
                <p>WEN Reward Share: <strong>${WENRewardShare.toFixed(4)} WEN tokens</strong></p>
                <p>Zeus Reward Share: <strong>${zeusRewardShare.toFixed(4)} Zeus tokens</strong></p>
                <p>Sharky Reward Share: <strong>${sharkyRewardShare.toFixed(4)} Sharky tokens</strong></p>
                <p>UPROCK Reward Share: <strong>${UPROCKRewardShare.toFixed(4)} UPROCK tokens</strong></p>
                <p>These results display your total reward share. If you'd like to know the results per Voting Power Unit (1 locked $JUP), use 1 JUP as voting power in the estimate.</p>
            `;
        }

        // Show the stats section after calculation
        document.getElementById("stats").style.display = "block";

        // Update the stats section with relevant data
        var statsDiv = document.getElementById("stats");
        if (statsDiv) {
            statsDiv.innerHTML = `
                <h2>More Stats</h2>
                <p>Total Voting Power Exercised by the Entire DAO according to your estimate: <strong>${totalVotingPower.toLocaleString()}</strong></p>
                <p>Your Total Voting Power across all proposals: <strong>${totalYourVotingPower.toLocaleString()}</strong></p>
                <p>JUP Reward Pool: <span id="totalRewardPools">[50,000,000 $JUP]</span></p>
                <p>WEN Reward Pool: <span id="totalRewardPools">[7,500,000,000 $WEN]</span></p>
                <p>Zeus Reward Pool: <span id="totalRewardPools">[7,500,000 $ZEUS]</span></p>
                <p>Sharky Reward Pool: <span id="totalRewardPools">[750,000 $SHARKY]</span></p>
                <p>UPROCK Reward Pool: <span id="totalRewardPools">[7,500,000 $UPT]</span></p>
                <!-- Add more stats as needed -->
            `;
        }
    }
}

// Adding placeholder text dynamically through JavaScript
window.onload = function() {
    generateProposalBoxes();
};

// Add event listeners to all input fields
document.querySelectorAll('input[type="text"], input[type="number"]').forEach(function(element) {
    element.addEventListener('input', hideResults);
});

// Function to hide the results
function hideResults() {
    document.getElementById("results").style.display = "none";
}
