document.addEventListener('DOMContentLoaded', function() {
    const navDashboard = document.getElementById('nav-dashboard');
    const navSettings = document.getElementById('nav-settings');
    const dashboard = document.getElementById('dashboard');
    const settingsPage = document.getElementById('settings');
    const formPage = document.getElementById('document-form-page');
    const cards = document.querySelectorAll('.card');
    const settingsForm = document.getElementById('settings-form');
    const documentForm = document.getElementById('document-form');
    const itemsContainer = document.getElementById('items-container');
    const addItemBtn = document.getElementById('add-item');
    const generateBtn = document.getElementById('generate-preview');
    const savePdfBtn = document.getElementById('save-pdf');
    const printBtn = document.getElementById('print');
    const previewDiv = document.getElementById('document-preview');
    const dateInput = document.getElementById('date');
    const paymentAmountGroup = document.getElementById('payment-amount-group');
    const paymentMethodGroup = document.getElementById('payment-method-group');
    const validityDateGroup = document.getElementById('validity-date-group');
    const statusGroup = document.getElementById('status-group');
    const referenceInvoiceGroup = document.getElementById('reference-invoice-group');
    const reasonGroup = document.getElementById('reason-group');
    const amountGroup = document.getElementById('amount-group');
    const paymentTermsGroup = document.getElementById('payment-terms-group');
    const signatureGroup = document.getElementById('signature-group');
    const itemsSection = document.getElementById('items-section');
    const paymentAmountInput = document.getElementById('payment-amount');
    const paymentMethodSelect = document.getElementById('payment-method');
    const validityDateInput = document.getElementById('validity-date');
    const statusSelect = document.getElementById('status');
    const referenceInvoiceInput = document.getElementById('reference-invoice');
    const reasonInput = document.getElementById('reason');
    const amountInput = document.getElementById('amount');
    const paymentTermsInput = document.getElementById('payment-terms');
    const includeTaxCheckbox = document.getElementById('include-tax');
    const totalInput = document.getElementById('total');
    const formTitle = document.getElementById('form-title');
    const loginPage = document.getElementById('login-page');
    const loginForm = document.getElementById('login-form');
    const loginUsernameInput = document.getElementById('login-username');
    const loginPasswordInput = document.getElementById('login-password');
    const loginButton = document.getElementById('login-button');
    const loginMessage = document.getElementById('login-message');

    let currentType = '';
    let shopSettings = {
        name: '',
        location: '',
        phone: '',
        logo: null
    };
    const authUser = { username: 'admin', password: 'admin123' };
    let isAuthenticated = false;

    function showLoginPage() {
        setActivePage('login');
        loginMessage.textContent = 'Use username: admin and password: admin123';
        loginButton.textContent = 'Login';
    }

    window.gotoGentrixLogin = showLoginPage;

    function handleLogin() {
        const username = loginUsernameInput.value.trim();
        const password = loginPasswordInput.value.trim();
        if (!username || !password) {
            alert('Enter both username and password.');
            return;
        }
        if (username === authUser.username && password === authUser.password) {
            isAuthenticated = true;
            setActivePage('dashboard');
        } else {
            alert('Invalid username or password.');
        }
    }

    function setActivePage(page) {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.querySelectorAll('.nav-btn').forEach(n => n.classList.remove('active'));
        if (page === 'dashboard') {
            if (!isAuthenticated) {
                showLoginPage();
                return;
            }
            dashboard.classList.add('active');
            navDashboard.classList.add('active');
        } else if (page === 'settings') {
            if (!isAuthenticated) {
                showLoginPage();
                return;
            }
            settingsPage.classList.add('active');
            navSettings.classList.add('active');
        } else if (page === 'form') {
            if (!isAuthenticated) {
                showLoginPage();
                return;
            }
            formPage.classList.add('active');
        } else if (page === 'login') {
            loginPage.classList.add('active');
        }
    }


    // Load settings from localStorage
    loadSettings();

    // Set default date
    dateInput.value = new Date().toISOString().split('T')[0];

    // Navigation
    navDashboard.addEventListener('click', function() {
        setActivePage('dashboard');
    });

    navSettings.addEventListener('click', function() {
        setActivePage('settings');
    });

    loginButton.addEventListener('click', handleLogin);

    function updateFormForType(type) {
        const dynamicGroups = [
            paymentAmountGroup,
            paymentMethodGroup,
            validityDateGroup,
            statusGroup,
            referenceInvoiceGroup,
            reasonGroup,
            amountGroup,
            paymentTermsGroup,
            signatureGroup
        ];

        dynamicGroups.forEach(group => group.classList.add('hidden'));
        itemsSection.classList.remove('hidden');
        includeTaxCheckbox.parentElement.classList.remove('hidden');
        totalInput.parentElement.classList.remove('hidden');
        paymentAmountInput.required = false;
        amountInput.required = false;
        referenceInvoiceInput.required = false;
        reasonInput.required = false;
        validityDateInput.required = false;
        statusSelect.required = false;
        paymentTermsInput.required = false;

        setDeliveryMode(false);
        includeTaxCheckbox.checked = false;

        if (type === 'invoice') {
            paymentTermsGroup.classList.remove('hidden');
            paymentTermsInput.required = false;
        } else if (type === 'receipt') {
            paymentAmountGroup.classList.remove('hidden');
            paymentMethodGroup.classList.remove('hidden');
            paymentAmountInput.required = true;
            paymentMethodSelect.required = true;
        } else if (type === 'quotation') {
            validityDateGroup.classList.remove('hidden');
            validityDateInput.required = true;
        } else if (type === 'sales-order') {
            statusGroup.classList.remove('hidden');
            statusSelect.required = true;
        } else if (type === 'delivery-note') {
            signatureGroup.classList.remove('hidden');
            setDeliveryMode(true);
            includeTaxCheckbox.parentElement.classList.add('hidden');
            totalInput.parentElement.classList.add('hidden');
        } else if (type === 'credit-note') {
            itemsSection.classList.add('hidden');
            referenceInvoiceGroup.classList.remove('hidden');
            amountGroup.classList.remove('hidden');
            referenceInvoiceInput.required = true;
            amountInput.required = true;
        } else if (type === 'debit-note') {
            itemsSection.classList.add('hidden');
            reasonGroup.classList.remove('hidden');
            amountGroup.classList.remove('hidden');
            reasonInput.required = true;
            amountInput.required = true;
        }

        calculateTotal();
    }

    function setDeliveryMode(enabled) {
        itemsSection.classList.toggle('delivery-mode', enabled);
        document.querySelectorAll('.item-row').forEach(row => {
            const priceInput = row.querySelector('.item-price');
            priceInput.required = !enabled;
            priceInput.style.display = enabled ? 'none' : 'inline-block';
        });
    }

    // Card clicks
    cards.forEach(card => {
        card.addEventListener('click', function() {
            currentType = this.dataset.type;
            formTitle.textContent = `Create ${this.textContent}`;
            updateFormForType(currentType);
            setActivePage('form');
        });
    });

    // Settings form
    settingsForm.addEventListener('submit', function(e) {
        e.preventDefault();
        shopSettings.name = document.getElementById('shop-name').value;
        shopSettings.location = document.getElementById('location').value;
        shopSettings.phone = document.getElementById('shop-phone').value;
        const logoFile = document.getElementById('shop-logo').files[0];
        if (logoFile) {
            const reader = new FileReader();
            reader.onload = function(e) {
                shopSettings.logo = e.target.result;
                saveSettings();
            };
            reader.readAsDataURL(logoFile);
        } else {
            saveSettings();
        }
        alert('Settings saved!');
    });

    function saveSettings() {
        localStorage.setItem('shopSettings', JSON.stringify(shopSettings));
    }

    function loadSettings() {
        const saved = localStorage.getItem('shopSettings');
        if (saved) {
            shopSettings = JSON.parse(saved);
            document.getElementById('shop-name').value = shopSettings.name;
            document.getElementById('location').value = shopSettings.location;
            document.getElementById('shop-phone').value = shopSettings.phone;
        }
    }

    // Add item row
    addItemBtn.addEventListener('click', function() {
        const itemRow = document.createElement('div');
        itemRow.className = 'item-row';
        itemRow.innerHTML = `
            <input type="text" placeholder="Item Name" class="item-name" required>
            <input type="text" placeholder="Serial Number (optional)" class="item-serial">
            <input type="number" placeholder="Quantity" class="item-qty" min="1" required>
            <input type="number" placeholder="Price" class="item-price" step="0.01" min="0" required>
            <button type="button" class="remove-item">Remove</button>
        `;
        itemsContainer.appendChild(itemRow);
        attachRemoveListener(itemRow.querySelector('.remove-item'));
        if (itemsSection.classList.contains('delivery-mode')) {
            const priceInput = itemRow.querySelector('.item-price');
            priceInput.required = false;
            priceInput.style.display = 'none';
        }
    });

    // Remove item
    function attachRemoveListener(btn) {
        btn.addEventListener('click', function() {
            this.parentElement.remove();
            calculateTotal();
        });
    }

    // Initial remove listeners
    document.querySelectorAll('.remove-item').forEach(btn => attachRemoveListener(btn));

    // Calculate total
    function calculateTotal() {
        const subtotal = Array.from(document.querySelectorAll('.item-row')).reduce((sum, row) => {
            const qty = parseFloat(row.querySelector('.item-qty').value) || 0;
            const price = parseFloat(row.querySelector('.item-price').value) || 0;
            return sum + qty * price;
        }, 0);

        if (currentType === 'receipt') {
            const includeTax = includeTaxCheckbox.checked;
            const paymentAmount = parseFloat(paymentAmountInput.value) || 0;
            if (includeTax) {
                const tax = subtotal * 0.16;
                totalInput.value = (subtotal + tax).toFixed(2);
            } else {
                totalInput.value = (paymentAmount || subtotal).toFixed(2);
            }
            return;
        }

        if (currentType === 'credit-note' || currentType === 'debit-note') {
            const amount = parseFloat(amountInput.value) || 0;
            totalInput.value = amount.toFixed(2);
            return;
        }

        if (currentType === 'delivery-note') {
            totalInput.value = subtotal.toFixed(2);
            return;
        }

        const includeTax = includeTaxCheckbox.checked;
        let tax = 0;
        let total = subtotal;
        if (includeTax) {
            tax = subtotal * 0.16;
            total = subtotal + tax;
        }
        totalInput.value = total.toFixed(2);
    }

    // Listen for changes in items
    itemsContainer.addEventListener('input', calculateTotal);
    includeTaxCheckbox.addEventListener('change', calculateTotal);
    paymentAmountInput.addEventListener('input', calculateTotal);
    amountInput.addEventListener('input', calculateTotal);

    // Generate preview
    generateBtn.addEventListener('click', function() {
        if (!documentForm.checkValidity()) {
            documentForm.reportValidity();
            return;
        }

        const customerName = document.getElementById('customer-name').value;
        const customerPhone = document.getElementById('customer-phone').value;
        const date = dateInput.value;
        const paymentAmount = paymentAmountInput.value;
        const paymentMethod = paymentMethodSelect.value;
        const validityDate = validityDateInput.value;
        const status = statusSelect.value;
        const referenceInvoice = referenceInvoiceInput.value;
        const reason = reasonInput.value;
        const amountValue = amountInput.value;
        const paymentTerms = paymentTermsInput.value;

        // Get document number
        const counterKey = currentType + 'Counter';
        let counter = parseInt(localStorage.getItem(counterKey)) || 0;
        counter++;
        localStorage.setItem(counterKey, counter);
        const prefixes = {
            'invoice': 'INV',
            'receipt': 'REC',
            'quotation': 'QTN',
            'sales-order': 'SO',
            'delivery-note': 'DN',
            'credit-note': 'CN',
            'debit-note': 'DBN'
        };
        const prefix = prefixes[currentType] || 'DOC';
        const docNumber = prefix + '-' + counter.toString().padStart(3, '0');

        // Get items
        const items = [];
        document.querySelectorAll('.item-row').forEach(row => {
            const name = row.querySelector('.item-name').value;
            const serial = row.querySelector('.item-serial') ? row.querySelector('.item-serial').value : '';
            const qty = row.querySelector('.item-qty').value;
            const price = row.querySelector('.item-price').value;
            items.push({ name, serial, qty, price });
        });

        const total = totalInput.value;
        const includeTax = includeTaxCheckbox.checked;
        let subtotal = 0;
        items.forEach(item => {
            subtotal += item.qty * item.price;
        });
        const tax = includeTax ? (subtotal * 0.16).toFixed(2) : 0;

        // Document title
        const titles = {
            'invoice': 'INVOICE',
            'receipt': 'RECEIPT',
            'quotation': 'QUOTATION',
            'sales-order': 'SALES ORDER',
            'delivery-note': 'DELIVERY NOTE',
            'credit-note': 'CREDIT NOTE',
            'debit-note': 'DEBIT NOTE'
        };
        const docTitle = titles[currentType] || 'DOCUMENT';

        const showItems = ['invoice', 'quotation', 'sales-order', 'delivery-note', 'receipt'].includes(currentType);
        const showDeliveryColumns = currentType === 'delivery-note';
        const showReceiptSerial = currentType === 'receipt';

        let itemsHtml = '';
        if (showItems) {
            let headerRow;
            if (showDeliveryColumns) {
                headerRow = `<tr><th>Item Name</th><th>Quantity</th></tr>`;
            } else if (showReceiptSerial) {
                headerRow = `<tr><th>Item Name</th><th>Serial Number</th><th>Quantity</th><th>Unit Price</th><th>Total</th></tr>`;
            } else {
                headerRow = `<tr><th>Item Name</th><th>Quantity</th><th>Unit Price</th><th>Total</th></tr>`;
            }

            const bodyRows = items.map(item => {
                if (showDeliveryColumns) {
                    return `
                        <tr>
                            <td>${item.name}</td>
                            <td>${item.qty}</td>
                        </tr>
                    `;
                }

                if (showReceiptSerial) {
                    return `
                        <tr>
                            <td>${item.name}</td>
                            <td>${item.serial || '-'}</td>
                            <td>${item.qty}</td>
                            <td>${item.price}</td>
                            <td>${(item.qty * item.price).toFixed(2)}</td>
                        </tr>
                    `;
                }

                return `
                    <tr>
                        <td>${item.name}</td>
                        <td>${item.qty}</td>
                        <td>${item.price}</td>
                        <td>${(item.qty * item.price).toFixed(2)}</td>
                    </tr>
                `;
            }).join('');

            itemsHtml = `
                <table class="items-table">
                    <thead>${headerRow}</thead>
                    <tbody>${bodyRows}</tbody>
                </table>
            `;
        }

        let extraHtml = '';
        if (currentType === 'invoice' && paymentTerms) {
            extraHtml += `<p><strong>Payment Terms:</strong> ${paymentTerms}</p>`;
        }
        if (currentType === 'quotation') {
            extraHtml += `<p><strong>Validity Date:</strong> ${validityDate}</p>`;
        }
        if (currentType === 'sales-order') {
            extraHtml += `<p><strong>Status:</strong> ${status}</p>`;
        }
        if (currentType === 'credit-note') {
            extraHtml += `<p><strong>Reference Invoice:</strong> ${referenceInvoice}</p>`;
            extraHtml += `<p><strong>Amount Refunded:</strong> KES ${parseFloat(amountValue || 0).toFixed(2)}</p>`;
        }
        if (currentType === 'debit-note') {
            extraHtml += `<p><strong>Reason:</strong> ${reason}</p>`;
            extraHtml += `<p><strong>Amount:</strong> KES ${parseFloat(amountValue || 0).toFixed(2)}</p>`;
        }

        let totalHtml = '';
        if (currentType === 'delivery-note') {
            totalHtml = `<div class="total-section"><p><strong>Signature</strong></p><div class="signature-line"></div></div>`;
        } else if (currentType === 'receipt') {
            totalHtml = `
                <div style="text-align: right;">
                    <table class="total-table">
                        <tr><td>Subtotal:</td><td>KES ${subtotal.toFixed(2)}</td></tr>
                        ${includeTax ? `<tr><td>Tax (16%):</td><td>KES ${tax}</td></tr>` : ''}
                        <tr><td>Total:</td><td>KES ${parseFloat(total || 0).toFixed(2)}</td></tr>
                        <tr><td>Payment Amount:</td><td>KES ${parseFloat(paymentAmount || 0).toFixed(2)}</td></tr>
                        <tr><td>Payment Method:</td><td>${paymentMethod}</td></tr>
                    </table>
                </div>
            `;
        } else if (['credit-note', 'debit-note'].includes(currentType)) {
            totalHtml = `<div class="total-section"><p><strong>Total: KES ${parseFloat(total || 0).toFixed(2)}</strong></p></div>`;
        } else {
            totalHtml = `
                <div class="total-section">
                    <p><strong>Subtotal: KES ${subtotal.toFixed(2)}</strong></p>
                    ${includeTax ? `<p><strong>Tax (16%): KES ${tax}</strong></p>` : ''}
                    <p><strong>TOTAL: KES ${parseFloat(total || 0).toFixed(2)}</strong></p>
                </div>
            `;
        }

        previewDiv.innerHTML = `
            <div class="document-paper">
                <div class="doc-title">
                    <h2>${docTitle}</h2>
                </div>
                <div class="doc-header">
                    <div class="header-left">
                        ${shopSettings.logo ? `<img src="${shopSettings.logo}" alt="Logo" class="logo">` : ''}
                    </div>
                    <div class="header-right">
                        <h1 class="shop-name">${shopSettings.name}</h1>
                        <p class="shop-details">${shopSettings.location}</p>
                        <p class="shop-details">Phone: ${shopSettings.phone}</p>
                    </div>
                </div>
                <div class="doc-details">
                    <div class="left-details">
                        <p><strong>Customer Name:</strong> ${customerName}</p>
                        <p><strong>Phone:</strong> ${customerPhone}</p>
                    </div>
                    <div class="right-details">
                        <p><strong>${docTitle} Number:</strong> ${docNumber}</p>
                        <p><strong>Date:</strong> ${date}</p>
                    </div>
                </div>
                ${extraHtml ? `<div class="doc-extra">${extraHtml}</div>` : ''}
                ${itemsHtml}
                ${totalHtml}
                <p style="text-align: center; margin-top: 20px; font-weight: bold; color: #333;">Thank You for Your Business!</p>
            </div>
        `;
    });

    async function generateDocPDF() {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');

        // Use html2canvas to capture the paper exactly
        const paper = previewDiv.querySelector('.document-paper');
        if (!paper) return null;

        const canvas = await html2canvas(paper, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 297; // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;

        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft > 1) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        return pdf;
    }

    // Save as PDF
    savePdfBtn.addEventListener('click', async function() {
        if (!previewDiv.innerHTML) {
            alert('Please generate a preview first.');
            return;
        }

        const originalText = savePdfBtn.textContent;
        savePdfBtn.textContent = 'Generating PDF...';
        savePdfBtn.disabled = true;

        try {
            const pdf = await generateDocPDF();
            if (pdf) {
                if ('showSaveFilePicker' in window) {
                    try {
                        const handle = await window.showSaveFilePicker({
                            suggestedName: 'document.pdf',
                            types: [{
                                description: 'PDF Files',
                                accept: { 'application/pdf': ['.pdf'] }
                            }]
                        });
                        const writable = await handle.createWritable();
                        await writable.write(await pdf.output('blob'));
                        await writable.close();
                    } catch (err) {
                        pdf.save('document.pdf');
                    }
                } else {
                    pdf.save('document.pdf');
                }
            }
        } catch (err) {
            console.error(err);
            alert('Failed to generate PDF.');
        } finally {
            savePdfBtn.textContent = originalText;
            savePdfBtn.disabled = false;
        }
    });

    // Print
    printBtn.addEventListener('click', async function() {
        if (!previewDiv.innerHTML) {
            alert('Please generate a preview first.');
            return;
        }
        
        const originalText = printBtn.textContent;
        printBtn.textContent = 'Preparing Print...';
        printBtn.disabled = true;

        try {
            const pdf = await generateDocPDF();
            if (pdf) {
                pdf.autoPrint();
                const blobUrl = URL.createObjectURL(pdf.output('blob'));
                window.open(blobUrl, '_blank');
            }
        } catch (err) {
            console.error(err);
            alert('Failed to prepare print.');
        } finally {
            printBtn.textContent = originalText;
            printBtn.disabled = false;
        }
    });
});