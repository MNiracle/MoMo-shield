const analyzeBtn = document.getElementById("analyzeBtn");

const resultSection = document.getElementById("resultSection");
const riskBadge = document.getElementById("riskBadge");
const riskScore = document.getElementById("riskScore");
const riskTitle = document.getElementById("riskTitle");
const recommendation = document.getElementById("recommendation");
const signalsList = document.getElementById("signalsList");

analyzeBtn.addEventListener("click", async () => {

    const recipient = document.getElementById("recipient").value.trim();
    const amount = Number(document.getElementById("amount").value);

    if (!recipient || !amount || amount <= 0) {
        alert("Please enter a recipient and a valid amount.");
        return;
    }

    analyzeBtn.disabled = true;
    analyzeBtn.textContent = "🛡️ Analyzing...";

    try {

        const response = await fetch(
            "http://127.0.0.1:8000/api/risk/analyze",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    recipient: recipient,
                    amount: amount
                })
            }
        );

        if (!response.ok) {
            throw new Error("Risk analysis failed.");
        }

        const data = await response.json();

        displayResult(data);

    } catch (error) {

        console.error(error);

        alert(
            "Unable to connect to MoMoShield. " +
            "Make sure the backend server is running."
        );

    } finally {

        analyzeBtn.disabled = false;
        analyzeBtn.textContent = "🛡️ Analyze Transaction";
    }
});


function displayResult(data) {

    resultSection.classList.remove("hidden");
    saveTransaction({
    recipient:
        document.getElementById("recipient").value.trim(),

    amount:
        Number(
            document.getElementById("amount").value
        ),

    risk_score:
        data.risk_score,

    risk_level:
        data.risk_level,

    action:
        "Assessed",

    timestamp:
        new Date().toISOString()
});

    // Risk information
    riskScore.textContent = data.risk_score;
    const scoreCircle =
    document.querySelector(".score-circle");

const scoreDegrees =
    Math.min(data.risk_score, 100) * 3.6;
let riskColor = "#ffcc00";

if (data.risk_level === "SAFE") {
    riskColor = "#22a06b";
} else if (data.risk_level === "CAUTION") {
    riskColor = "#ffb020";
} else if (data.risk_level === "HIGH RISK") {
    riskColor = "#e5484d";
}

scoreCircle.style.background = `
    conic-gradient(
        ${riskColor} ${scoreDegrees}deg,
        #e8eaec ${scoreDegrees}deg
    )
`;
    riskTitle.textContent = data.risk_level;
    recommendation.textContent = data.recommendation;

    // Risk badge
    riskBadge.textContent = data.risk_level;
    riskBadge.className = "risk-badge";

    if (data.risk_level === "SAFE") {

        riskBadge.classList.add("safe");

    } else if (data.risk_level === "CAUTION") {

        riskBadge.classList.add("caution");

    } else {

        riskBadge.classList.add("high-risk");
    }

    // Risk signals
    signalsList.innerHTML = "";

    data.signals.forEach(signal => {

        const li = document.createElement("li");
        li.textContent = signal;

        signalsList.appendChild(li);
    });
    // Risk breakdown
let breakdownBox = document.getElementById("breakdownBox");

if (!breakdownBox) {

    breakdownBox = document.createElement("div");

    breakdownBox.id = "breakdownBox";
    breakdownBox.className = "breakdown-box";

    resultSection.insertBefore(
        breakdownBox,
        document.querySelector(".signals-card")
    );
}

const breakdown = data.risk_breakdown;

breakdownBox.innerHTML = `
    <h4>🧠 Risk Breakdown</h4>

    <div class="risk-row">
        <span>Identity Risk</span>
        <strong>${breakdown.identity_risk}</strong>
    </div>

    <div class="risk-bar">
        <div style="width: ${Math.min(breakdown.identity_risk, 100)}%"></div>
    </div>

    <div class="risk-row">
        <span>Transaction Risk</span>
        <strong>${breakdown.transaction_risk}</strong>
    </div>

    <div class="risk-bar">
        <div style="width: ${Math.min(breakdown.transaction_risk, 100)}%"></div>
    </div>

    <div class="risk-row">
        <span>Recipient Risk</span>
        <strong>${breakdown.recipient_risk}</strong>
    </div>

    <div class="risk-bar">
        <div style="width: ${Math.min(breakdown.recipient_risk, 100)}%"></div>
    </div>
`;

    // Identity confidence
    let identityBox = document.getElementById("identityBox");

    if (!identityBox) {

        identityBox = document.createElement("div");

        identityBox.id = "identityBox";

        identityBox.className = "identity-box";

        resultSection.insertBefore(
            identityBox,
            document.querySelector(".signals-card")
        );
    }

    let identityStatus;

    if (data.identity_confidence >= 90) {

        identityStatus = "✅ High-confidence match";

    } else if (data.identity_confidence >= 60) {

        identityStatus = "⚠️ Partial verification";

    } else {

        identityStatus = "🚨 Low-confidence identity";
    }

    identityBox.innerHTML = `
        <h4>👤 Recipient Identity</h4>
        <div class="identity-score">
            ${data.identity_confidence}%
        </div>
        <p>${identityStatus}</p>
        <small>Demo verification data</small>
    `;

    resultSection.scrollIntoView({
        behavior: "smooth"
    });
}
// ----------------------------------
// Recipient Verification
// ----------------------------------

document.addEventListener("click", async (event) => {

    if (event.target.id !== "verifyBtn") {
        return;
    }

    const recipient =
        document.getElementById("recipient").value.trim();

    if (!recipient) {
        alert("Recipient number is missing.");
        return;
    }

    const verifyBtn = event.target;

    verifyBtn.disabled = true;
    verifyBtn.textContent = "🔍 Verifying...";

    try {

        const response = await fetch(
            `http://127.0.0.1:8000/api/recipient/verify/${recipient}`
        );

        if (!response.ok) {
            throw new Error("Verification failed.");
        }

        const data = await response.json();

        showVerificationResult(data);

    } catch (error) {

        console.error(error);

        alert(
            "Unable to verify recipient. " +
            "Make sure the backend server is running."
        );

    } finally {

        verifyBtn.disabled = false;
        verifyBtn.textContent = "Verify Recipient";
    }
});


function showVerificationResult(data) {

    let verificationResult =
        document.getElementById("verificationResult");

    if (!verificationResult) {

        verificationResult =
            document.createElement("div");

        verificationResult.id =
            "verificationResult";

        verificationResult.className =
            "verification-result";

        resultSection.appendChild(
            verificationResult
        );
    }

    let statusIcon = "⚠️";

    if (data.verified) {
        statusIcon = "✅";
    }

    verificationResult.innerHTML = `
        <h4>
            ${statusIcon} Recipient Verification
        </h4>

        <div class="verification-status">
            ${data.status}
        </div>

        <div class="verification-confidence">
            ${data.identity_confidence}%
        </div>

        <p>
            ${data.message}
        </p>

        <small>
            Demo verification data
        </small>
    `;

    verificationResult.scrollIntoView({
        behavior: "smooth"
    });
}
// ----------------------------------
// Cancel Transaction
// ----------------------------------

document.addEventListener("click", (event) => {

    const cancelBtn = event.target.closest("#cancelBtn");

    if (!cancelBtn) {
        return;
    }

    const resultSection =
        document.getElementById("resultSection");

    resultSection.innerHTML = `
        <div class="cancelled-result">

            <div class="cancel-icon">🛡️</div>

            <h3>Transaction Cancelled</h3>

            <p>
                MoMoShield helped prevent this transaction
                from proceeding while risk signals were present.
            </p>

            <button id="newTransactionBtn">
                Start New Transaction
            </button>

        </div>
    `;

    resultSection.scrollIntoView({
        behavior: "smooth"
    });
});
document.addEventListener("click", (event) => {

    const newTransactionBtn =
        event.target.closest("#newTransactionBtn");

    if (!newTransactionBtn) {
        return;
    }

    window.location.reload();
});
// ----------------------------------
// Proceed Anyway
// ----------------------------------

document.addEventListener("click", (event) => {

    const proceedBtn =
        event.target.closest("#proceedBtn");

    if (!proceedBtn) {
        return;
    }

    showProceedConfirmation();
});


function showProceedConfirmation() {

    let confirmation =
        document.getElementById("proceedConfirmation");

    if (!confirmation) {

        confirmation =
            document.createElement("div");

        confirmation.id =
            "proceedConfirmation";

        confirmation.className =
            "proceed-confirmation";

        resultSection.appendChild(
            confirmation
        );
    }

    confirmation.innerHTML = `
        <div class="confirmation-icon">
            ⚠️
        </div>

        <h3>
            Are you sure?
        </h3>

        <p>
            MoMoShield detected risk signals associated
            with this transaction.
        </p>

        <p>
            We recommend confirming the recipient
            directly before sending.
        </p>

        <div class="confirmation-actions">

            <button id="goBackBtn"
                    class="secondary-btn">
                Go Back
            </button>

            <button id="confirmProceedBtn"
                    class="danger-btn">
                Proceed Anyway
            </button>

        </div>
    `;

    confirmation.scrollIntoView({
        behavior: "smooth"
    });
}


// ----------------------------------
// Go Back
// ----------------------------------

document.addEventListener("click", (event) => {

    const goBackBtn =
        event.target.closest("#goBackBtn");

    if (!goBackBtn) {
        return;
    }

    const confirmation =
        document.getElementById(
            "proceedConfirmation"
        );

    if (confirmation) {
        confirmation.remove();
    }
});


// ----------------------------------
// Confirm Proceed
// ----------------------------------

document.addEventListener("click", (event) => {

    const confirmBtn =
        event.target.closest(
            "#confirmProceedBtn"
        );

    if (!confirmBtn) {
        return;
    }

    resultSection.innerHTML = `
        <div class="proceed-success">

            <div class="success-icon">
                ⚠️
            </div>

            <h3>
                Transaction Approved
            </h3>

            <p>
                You chose to proceed after reviewing
                the MoMoShield warning.
            </p>

            <small>
                Demo transaction — no real money was sent.
            </small>

            <button id="newTransactionBtn">
                Start New Transaction
            </button>

        </div>
    `;

    resultSection.scrollIntoView({
        behavior: "smooth"
    });
});
// ==================================
// SAFETY DASHBOARD
// ==================================

let transactionHistory =
    JSON.parse(
        localStorage.getItem("momoShieldHistory")
    ) || [];

function saveTransaction(transaction) {

    transactionHistory.unshift(transaction);

    // Keep only the latest 10 transactions
    transactionHistory =
        transactionHistory.slice(0, 10);

    localStorage.setItem(
        "momoShieldHistory",
        JSON.stringify(transactionHistory)
    );

    updateDashboard();
}


function updateDashboard() {

    const protectedCount =
        document.getElementById("protectedCount");

    const riskCount =
        document.getElementById("riskCount");

    const cancelledCount =
        document.getElementById("cancelledCount");

    const activityList =
        document.getElementById("activityList");

    if (!protectedCount ||
        !riskCount ||
        !cancelledCount ||
        !activityList) {
        return;
    }

    protectedCount.textContent =
        transactionHistory.length;

    riskCount.textContent =
        transactionHistory.filter(
            item => item.risk_score >= 30
        ).length;

    cancelledCount.textContent =
        transactionHistory.filter(
            item => item.action === "Cancelled"
        ).length;

    if (transactionHistory.length === 0) {

        activityList.innerHTML = `
            <div class="empty-activity">
                No transactions assessed yet.
            </div>
        `;

        return;
    }

    activityList.innerHTML =
        transactionHistory.map(item => {

            let icon = "🟢";

            if (item.risk_score >= 70) {
                icon = "🔴";
            } else if (item.risk_score >= 30) {
                icon = "🟡";
            }

            return `
                <div class="activity-item">

                    <div class="activity-info">

                        <div class="activity-icon">
                            ${icon}
                        </div>

                        <div>
                            <strong>
                                ${item.recipient}
                            </strong>

                            <small>
                                GH₵${item.amount}
                            </small>
                        </div>

                    </div>

                    <div class="activity-risk">

                        <strong>
                            ${item.risk_level}
                        </strong>

                        <small>
                            ${item.risk_score}/100
                            • ${item.action}
                        </small>

                    </div>

                </div>
            `;

        }).join("");
}


// Initial dashboard load
updateDashboard();