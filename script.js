// Function to format numerical inputs with commas for thousands separators
function formatNumericInput(input) {
    var value = input.value.replace(/\D/g, ''); // Remove non-numeric characters
    var formattedValue = numberWithCommas(value); // Format the value with commas
    input.value = formattedValue; // Set the input value with the formatted value
}

// Function to generate proposal input boxes dynamically
function generateProposalBoxes() {
    var totalProposals = 4; // Total number of past proposals

    var proposalBoxesDiv = document.getElementById("pastProposals");
    if (!proposalBoxesDiv) return; // Check if the element exists

    proposalBoxesDiv.innerHTML = ""; // Clear previous boxes

    // Define past proposals with their respective total voting power
var pastProposals = [
    { name: "Proposal 1: Test Proposal (Which Animal Is The Cutest?)", totalVotingPower: 140857857 },
    { name: "Proposal 2:Round #1 of LFG Voting", totalVotingPower: 201857511 },
    { name: "Proposal 3:Core Working Group Budget", totalVotingPower: 198987006 },
    { name: "Proposal 4:Round #2 of LFG Voting", totalVotingPower: 230849742 }
];

pastProposals.forEach(function(proposal, index) {
    var proposalBox = document.createElement("div");
    proposalBox.classList.add("proposal");
    proposalBox.innerHTML = `
        <h3>${proposal.name}</h3>
        <label for="votingPowerProposal${index + 1}">Your Voting Power:</label>
        <input type="text" id="votingPowerProposal${index + 1}" placeholder="How much did you vote with?"  oninput="formatNumericInput(this)">
        <label for="totalVotingPowerProposal${index + 1}">DAO Total Voting Power:</label>
        <input type="text" id="totalVotingPowerProposal${index + 1}" value="${proposal.totalVotingPower.toLocaleString()}" disabled>
    `;
    proposalBoxesDiv.appendChild(proposalBox);
});

    // Enable the Estimate button
    var estimateButton = document.getElementById("estimateButton");
    if (estimateButton) estimateButton.disabled = false;

    // Add event listeners for hover effect to all proposal elements
    var proposalElements = document.querySelectorAll('.proposal');
    proposalElements.forEach(function(proposalElement) {
        proposalElement.addEventListener('mouseover', function() {
            this.classList.add('hovered');
        });
        proposalElement.addEventListener('mouseout', function() {
            this.classList.remove('hovered');
        });
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
             <input type="text" id="votingPowerFutureProposal${i}" placeholder="How much will you vote with?" oninput="formatNumericInput(this)">
             <label for="totalVotingPowerFutureProposal${i}">DAO Total Voting Power:</label>
           <input type="text" id="totalVotingPowerFutureProposal${i}" placeholder="Enter the DAO Total voting power for this proposal (suggested 250,000,000)" oninput="formatNumericInput(this)">
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
 
     // Enable the Calculate Rewards button
     var calculateButton = document.getElementById("calculateButton");
     calculateButton.disabled = false;
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
    
    // Calculation logic here

    // Proceed with calculations if all fields are filled in
    if (allFieldsFilled) {


    // Calculate total voting power across all past proposals
        var totalVotingPower = 0;
        for (var i = 1; i <= 4; i++) {
            var input = document.getElementById(`totalVotingPowerProposal${i}`);
            var votingPower = parseFloat(input.value.replace(/\D/g, '')) || 0;
            totalVotingPower += votingPower;
        }

        // Calculate total voting power across all future proposals
        var numFutureProposals = parseInt(document.getElementById("numFutureProposals").value);
        for (var i = 1; i <= numFutureProposals; i++) {
            var input = document.getElementById(`totalVotingPowerFutureProposal${i}`);
            var votingPower = parseFloat(input.value.replace(/\D/g, '')) || 0;
            totalVotingPower += votingPower;
        }

        // Calculate rewards based on total voting power and reward pools
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
        for (var i = 1; i <= 4; i++) {
            var input = document.getElementById(`votingPowerProposal${i}`);
            var votingPower = parseFloat(input.value.replace(/\D/g, '')) || 0;
            totalYourVotingPower += votingPower;
        }
        for (var i = 1; i <= numFutureProposals; i++) {
            var input = document.getElementById(`votingPowerFutureProposal${i}`);
            var votingPower = parseFloat(input.value.replace(/\D/g, '')) || 0;
            totalYourVotingPower += votingPower;
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
                <p>These results display your total reward share. If you'd like to know the results per Voting Power Unit (1 locked $JUP), use 1 Jup as voting power in the estimate.</p>
            `;
        }

        // Show the stats section after calculation
        document.getElementById("stats").style.display = "block";

        // Update the stats section with relevant data
        var statsDiv = document.getElementById("stats");
        if (statsDiv) {
            statsDiv.innerHTML = `
                <h2>More Stats</h2>
                <p>Total Voting Power Exercised by the Entire DAO according to your estimate: <strong>${totalVotingPower}</strong></p>
                <p>Your Total Voting Power across all proposals: <strong>${totalYourVotingPower}</strong></p>
                <p>JUP Reward Pool: <span id="totalRewardPools">[50,000,000 $JUP]</span></p>
                <p>WEN Reward Pool: <span id="totalRewardPools">[7,5,000,000,000 $WEN]</span></p>
                <p>Zeus Reward Pool: <span id="totalRewardPools">[7,500,000 $ZEUS]</span></p>
                <p>Sharky Reward Pool: <span id="totalRewardPools">[750,000 $SHARKY]</span></p>
                <p>UPROCK Reward Pool: <span id="totalRewardPools">[7,500,000 $UPT]</span></p>
                <!-- Add more stats as needed -->
            `;
        }

    } else {
        // Optionally, display an error message to the user
        alert('Please fill in all required fields.');
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
