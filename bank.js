
// Main app state (balance, account number, visibility flags, transaction log)
let accountState = {
    balance: 10000.00,
    accountNumber: "456011924321",
    isBalanceHidden: false,
    isAccountHidden: true,
    transactions: [
        { timestamp: "2026-05-29 09:14:22", type: "Setup", details: "Initial Checking Account Setup", amount: 10000.00, classification: "credit" }
    ]
};


// Account summary card elements
const balanceDisplay = document.getElementById('balance-display');
const accNumberDisplay = document.getElementById('acc-number-display');
const toggleBalBtn = document.getElementById('toggle-bal-btn');
const toggleAccBtn = document.getElementById('toggle-acc-btn');

// Top Navbar Buttons
const navBrand = document.querySelector('.nav-brand');
const navLoansBtn = document.getElementById('nav-loans-btn');
const navBillsBtn = document.getElementById('nav-bills-btn');
const navHelpBtn = document.getElementById('nav-help-btn');
const logoutBtn = document.getElementById('logout-btn');

// Sidebar Tab Buttons
const tabDepositBtn = document.getElementById('tab-deposit-btn');
const tabTransferBtn = document.getElementById('tab-transfer-btn');
const tabHistoryBtn = document.getElementById('tab-history-btn');

// Form and Table Window Sections
const sectionDeposit = document.getElementById('section-deposit');
const sectionTransfer = document.getElementById('section-transfer');
const sectionHistory = document.getElementById('section-history');
const sectionLoans = document.getElementById('section-loans');
const sectionBills = document.getElementById('section-bills');
const sectionHelp = document.getElementById('section-help');

const depositForm = document.getElementById('deposit-form');
const transferForm = document.getElementById('transfer-form');
const historyRows = document.getElementById('history-rows');

// Alert System Status Bar Components
const bankStatusBar = document.getElementById('bank-status-bar');
const statusMessage = document.getElementById('status-message');
const closeStatusBtn = document.getElementById('close-status-btn');


// Converts raw numbers into readable strings 
function formatCurrency(value) {
    return "$" + value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

// Generates simple timestamp format strings
function getFormattedTimestamp() {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    return `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}

function triggerBankStatus(type, title, text) {
    bankStatusBar.classList.remove('hidden');
    statusMessage.innerHTML = `<strong>${title}:</strong> ${text}`;

    if (type === 'success') {
        bankStatusBar.style.backgroundColor = "#e1fbe8"; // subtle green
        bankStatusBar.style.borderColor = "#a3e635";
        bankStatusBar.style.color = "#14532d";
    } else if (type === 'error') {
        bankStatusBar.style.backgroundColor = "#ffe2e2"; // subtle red
        bankStatusBar.style.borderColor = "#fecaca";
        bankStatusBar.style.color = "#7f1d1d";
    } else {
        bankStatusBar.style.backgroundColor = "#e0f2fe"; // subtle blue
        bankStatusBar.style.borderColor = "#bae6fd";
        bankStatusBar.style.color = "#0369a1";
    }
    
    // Automatically scrolls page window smoothly back to top banner row position
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Dismiss the status banner
closeStatusBtn.addEventListener('click', () => {
    bankStatusBar.classList.add('hidden');
});


// Re-render balance and account number based on visibility flags
function syncDisplayComponents() {
    // Hide or Show Balance Values
    if (accountState.isBalanceHidden) {
        balanceDisplay.textContent = "******";
        toggleBalBtn.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';
    } else {
        balanceDisplay.textContent = formatCurrency(accountState.balance);
        toggleBalBtn.innerHTML = '<i class="fa-solid fa-eye"></i>';
    }

    // Hide or Show Account Number Strings
    if (accountState.isAccountHidden) {
        accNumberDisplay.textContent = "************" + accountState.accountNumber.slice(-4);
        toggleAccBtn.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';
    } else {
        accNumberDisplay.textContent = accountState.accountNumber.substring(0,4) + " " + accountState.accountNumber.substring(4,8) + " " + accountState.accountNumber.substring(8,12);
        toggleAccBtn.innerHTML = '<i class="fa-solid fa-eye"></i>';
    }
}

// Rebuild the transaction history table (newest first)
function renderTransactionTable() {
    historyRows.innerHTML = '';
    
    // Creates copy then reverses it so newest transaction logs sit on top row
    let displayList = [...accountState.transactions].reverse();
    
    displayList.forEach(tx => {
        const tr = document.createElement('tr');
        const isCredit = tx.classification === 'credit';
        
        tr.innerHTML = `
            <td>${tx.timestamp}</td>
            <td><strong>${tx.type}</strong></td>
            <td>${tx.details}</td>
            <td class="align-right" style="color: ${isCredit ? '#16a34a' : '#dc2626'}; font-weight: bold;">
                ${isCredit ? '+' : '-'}${formatCurrency(Math.abs(tx.amount))}
            </td>
        `;
        historyRows.appendChild(tr);
    });
}

// Hide all panels, highlight active tab, show target panel
function globalRouteTransition(activeButton, targetSection) {
    const allSections = [sectionDeposit, sectionTransfer, sectionHistory, sectionLoans, sectionBills, sectionHelp];
    const sideTabs = [tabDepositBtn, tabTransferBtn, tabHistoryBtn];

    allSections.forEach(sec => sec.classList.add('hidden'));
    sideTabs.forEach(btn => btn.classList.remove('active-tab'));


    if (sideTabs.includes(activeButton)) {
        activeButton.classList.add('active-tab');
    }

    targetSection.classList.remove('hidden');

    // Refresh history on demand so new transactions show immediately
    if (targetSection === sectionHistory) {
        renderTransactionTable();
    }
}


// Toggle visibility of balance and account number
toggleBalBtn.addEventListener('click', () => { accountState.isBalanceHidden = !accountState.isBalanceHidden; syncDisplayComponents(); });
toggleAccBtn.addEventListener('click', () => { accountState.isAccountHidden = !accountState.isAccountHidden; syncDisplayComponents(); });

// Sidebar tabs
tabDepositBtn.addEventListener('click', () => globalRouteTransition(tabDepositBtn, sectionDeposit));
tabTransferBtn.addEventListener('click', () => globalRouteTransition(tabTransferBtn, sectionTransfer));
tabHistoryBtn.addEventListener('click', () => globalRouteTransition(tabHistoryBtn, sectionHistory));

// Top navbar links
navLoansBtn.addEventListener('click', () => globalRouteTransition(navLoansBtn, sectionLoans));
navBillsBtn.addEventListener('click', () => globalRouteTransition(navBillsBtn, sectionBills));
navHelpBtn.addEventListener('click', () => globalRouteTransition(navHelpBtn, sectionHelp));
// Brand click returns user to the Deposit home view
navBrand.addEventListener('click', () => globalRouteTransition(tabDepositBtn, sectionDeposit));

logoutBtn.addEventListener('click', () => {
    triggerBankStatus('info', 'Session Exit', 'Simulated account logout processed.');
});



// Handle deposit form: validate, update balance, log transaction
depositForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const depType = document.getElementById('deposit-type');
    const depAmt = document.getElementById('deposit-amount');
    const errType = document.getElementById('err-dep-type');
    const errAmt = document.getElementById('err-dep-amt');

    let formValid = true;

    // Validate account type and amount fields
    if (depType.value === "") { errType.classList.remove('hidden'); formValid = false; } else { errType.classList.add('hidden'); }

    const amount = parseFloat(depAmt.value);
    if (isNaN(amount) || amount <= 0) { errAmt.classList.remove('hidden'); formValid = false; } else { errAmt.classList.add('hidden'); }

    if (formValid) {
        accountState.balance += amount;
        accountState.transactions.push({
            timestamp: getFormattedTimestamp(),
            type: "Deposit",
            details: `Deposited directly into ${depType.value}`,
            amount: amount,
            classification: "credit"
        });
        syncDisplayComponents();
        triggerBankStatus('success', 'Success', `Added ${formatCurrency(amount)} to your account.`);
        depositForm.reset();
    }
});

// Handle transfer form: validate, debit balance, log transaction
transferForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const trnName = document.getElementById('transfer-name');
    const trnAcc = document.getElementById('transfer-account');
    const trnType = document.getElementById('transfer-type');
    const trnAmt = document.getElementById('transfer-amount');
    const trnPurp = document.getElementById('transfer-purpose');

    const errName = document.getElementById('err-trn-name');
    const errAcc = document.getElementById('err-trn-acc');
    const errType = document.getElementById('err-trn-type');
    const errAmt = document.getElementById('err-trn-amt');
    const errPurp = document.getElementById('err-trn-purp');

    let formValid = true;

    // Validate each text field
    if (trnName.value.trim() === "") { errName.classList.remove('hidden'); formValid = false; } else { errName.classList.add('hidden'); }
    if (trnAcc.value.trim() === "" || isNaN(trnAcc.value.trim())) { errAcc.classList.remove('hidden'); formValid = false; } else { errAcc.classList.add('hidden'); }
    if (trnType.value === "") { errType.classList.remove('hidden'); formValid = false; } else { errType.classList.add('hidden'); }
    if (trnPurp.value.trim() === "") { errPurp.classList.remove('hidden'); formValid = false; } else { errPurp.classList.add('hidden'); }

    // Amount must be positive and within available balance
    const amount = parseFloat(trnAmt.value);
    if (isNaN(amount) || amount <= 0 || amount > accountState.balance) {
        errAmt.textContent = amount > accountState.balance ? "Insufficient balance available." : "Please type a positive number value.";
        errAmt.classList.remove('hidden');
        formValid = false;
    } else {
        errAmt.classList.add('hidden');
    }

    if (formValid) {
        accountState.balance -= amount;
        accountState.transactions.push({
            timestamp: getFormattedTimestamp(),
            type: "Transfer",
            details: `Transferred to ${trnName.value.trim()} via ${trnType.value}. Note: ${trnPurp.value.trim()}`,
            amount: amount,
            classification: "debit"
        });
        syncDisplayComponents();
        triggerBankStatus('success', 'Success', `Transferred ${formatCurrency(amount)} to ${trnName.value.trim()} successfully.`);
        transferForm.reset();
    }
});

// Initial render on page load
syncDisplayComponents();