<a href="read_items.php">Items</a><br/>
<a href="read_customers.php">Customers</a><br/>
<a href="read_gl_accounts.php">GL Accounts</a><br/>
<a href="read_vendors.php">Vendors</a><br/><br/>
<?php
$csvFile = file('GLAccountData.csv');
    $data = [];
    foreach ($csvFile as $line) {
        $row = str_getcsv($line, "~");
        $data[] = array(
            'Entry No.' => substr(trim($row[0]), 1, strlen(trim($row[0]))-2),
            'G/L Account No.' => substr(trim($row[1]), 1, strlen(trim($row[1]))-2),
            'Posting Date' => substr(trim($row[2]), 1, strlen(trim($row[2]))-2),
            'Document Type' => substr(trim($row[3]), 1, strlen(trim($row[3]))-2),
            'Document No.' => substr(trim($row[4]), 1, strlen(trim($row[4]))-2),
            'Description' => substr(trim($row[5]), 1, strlen(trim($row[5]))-2),
            'Bal. Account No.' => substr(trim($row[6]), 1, strlen(trim($row[6]))-2),
            'Amount' => substr(trim($row[7]), 1, strlen(trim($row[7]))-2),
            'Global Dimension 1 Code' => substr(trim($row[8]), 1, strlen(trim($row[8]))-2),
            'Global Dimension 2 Code' => substr(trim($row[9]), 1, strlen(trim($row[9]))-2),
            'User ID' => substr(trim($row[10]), 1, strlen(trim($row[10]))-2),
            'Source Code' => substr(trim($row[11]), 1, strlen(trim($row[11]))-2),
            'System-Created Entry' => substr(trim($row[12]), 1, strlen(trim($row[12]))-2),
            'Prior-Year Entry' => substr(trim($row[13]), 1, strlen(trim($row[13]))-2),
            'Job No.' => substr(trim($row[14]), 1, strlen(trim($row[14]))-2),
            'Quantity' => substr(trim($row[15]), 1, strlen(trim($row[15]))-2),
            'VAT Amount' => substr(trim($row[16]), 1, strlen(trim($row[16]))-2),
            'Business Unit Code' => substr(trim($row[17]), 1, strlen(trim($row[17]))-2),
            'Journal Batch Name' => substr(trim($row[18]), 1, strlen(trim($row[18]))-2),
            'Reason Code' => substr(trim($row[19]), 1, strlen(trim($row[19]))-2),
            'Gen. Posting Type' => substr(trim($row[20]), 1, strlen(trim($row[20]))-2),
            'Gen. Bus. Posting Group' => substr(trim($row[21]), 1, strlen(trim($row[21]))-2),
            'Gen. Prod. Posting Group' => substr(trim($row[22]), 1, strlen(trim($row[22]))-2),
            'Bal. Account Type' => substr(trim($row[23]), 1, strlen(trim($row[23]))-2),
            'Transaction No.' => substr(trim($row[24]), 1, strlen(trim($row[24]))-2),
            'Debit Amount' => substr(trim($row[25]), 1, strlen(trim($row[25]))-2),
            'Credit Amount' => substr(trim($row[26]), 1, strlen(trim($row[26]))-2),
            'Document Date' => substr(trim($row[27]), 1, strlen(trim($row[27]))-2),
            'External Document No.' => substr(trim($row[28]), 1, strlen(trim($row[28]))-2),
            'Source Type' => substr(trim($row[29]), 1, strlen(trim($row[29]))-2),
            'Source No.' => substr(trim($row[30]), 1, strlen(trim($row[30]))-2),
            'No. Series' => substr(trim($row[31]), 1, strlen(trim($row[31]))-2),
            'Tax Area Code' => substr(trim($row[32]), 1, strlen(trim($row[32]))-2),
            'Tax Liable' => substr(trim($row[33]), 1, strlen(trim($row[33]))-2),
            'Tax Group Code' => substr(trim($row[34]), 1, strlen(trim($row[34]))-2),
            'Use Tax' => substr(trim($row[35]), 1, strlen(trim($row[35]))-2),
            'VAT Bus. Posting Group' => substr(trim($row[36]), 1, strlen(trim($row[36]))-2),
            'VAT Prod. Posting Group' => substr(trim($row[37]), 1, strlen(trim($row[37]))-2),
            'Additional-Currency Amount' => substr(trim($row[38]), 1, strlen(trim($row[38]))-2),
            'Add.-Currency Debit Amount' => substr(trim($row[39]), 1, strlen(trim($row[39]))-2),
            'Add.-Currency Credit Amount' => substr(trim($row[40]), 1, strlen(trim($row[40]))-2),
            'Close Income Statement Dim. ID' => substr(trim($row[41]), 1, strlen(trim($row[41]))-2),
            'Prod. Order No.' => substr(trim($row[42]), 1, strlen(trim($row[42]))-2),
            'FA Entry Type' => substr(trim($row[43]), 1, strlen(trim($row[43]))-2),
            'FA Entry No.' => substr(trim($row[44]), 1, strlen(trim($row[44]))-2),
            'Value Entry No.' => substr(trim($row[45]), 1, strlen(trim($row[45]))-2)
        );
    }

    echo "GL Accounts  Data<br/><pre>";
    print_r($data);
    echo "</pre>";