<a href="read_items.php">Items</a><br/>
<a href="read_customers.php">Customers</a><br/>
<a href="read_gl_accounts.php">GL Accounts</a><br/>
<a href="read_vendors.php">Vendors</a><br/><br/>
    <?php
$csvFile = file('VendorData.csv');
    $data = [];
    foreach ($csvFile as $line) {
        $row = str_getcsv($line, "~");
        $data[] = array(
            'No.' => substr(trim($row[0]), 1, strlen(trim($row[0]))-2),
            'Name' => substr(trim($row[1]), 1, strlen(trim($row[1]))-2),
            'Search Name' => substr(trim($row[2]), 1, strlen(trim($row[2]))-2),
            'Name 2' => substr(trim($row[3]), 1, strlen(trim($row[3]))-2),
            'Address' => substr(trim($row[4]), 1, strlen(trim($row[4]))-2),
            'Address 2' => substr(trim($row[5]), 1, strlen(trim($row[5]))-2),
            'City' => substr(trim($row[6]), 1, strlen(trim($row[6]))-2),
            'Contact' => substr(trim($row[7]), 1, strlen(trim($row[7]))-2),
            'Phone No.' => substr(trim($row[8]), 1, strlen(trim($row[8]))-2),
            'Telex No.' => substr(trim($row[9]), 1, strlen(trim($row[9]))-2),
            'Our Account No.' => substr(trim($row[10]), 1, strlen(trim($row[10]))-2),
            'Territory Code' => substr(trim($row[11]), 1, strlen(trim($row[11]))-2),
            'Global Dimension 1 Code' => substr(trim($row[12]), 1, strlen(trim($row[12]))-2),
            'Global Dimension 2 Code' => substr(trim($row[13]), 1, strlen(trim($row[13]))-2),
            'Budgeted Amount' => substr(trim($row[14]), 1, strlen(trim($row[14]))-2),
            'Vendor Posting Group' => substr(trim($row[15]), 1, strlen(trim($row[15]))-2),
            'Currency Code' => substr(trim($row[16]), 1, strlen(trim($row[16]))-2),
            'Language Code' => substr(trim($row[17]), 1, strlen(trim($row[17]))-2),
            'Statistics Group' => substr(trim($row[18]), 1, strlen(trim($row[18]))-2),
            'Payment Terms Code' => substr(trim($row[19]), 1, strlen(trim($row[19]))-2),
            'Fin. Charge Terms Code' => substr(trim($row[20]), 1, strlen(trim($row[20]))-2),
            'Purchaser Code' => substr(trim($row[21]), 1, strlen(trim($row[21]))-2),
            'Shipment Method Code' => substr(trim($row[22]), 1, strlen(trim($row[22]))-2),
            'Shipping Agent Code' => substr(trim($row[23]), 1, strlen(trim($row[23]))-2),
            'Invoice Disc. Code' => substr(trim($row[24]), 1, strlen(trim($row[24]))-2),
            'Country Code' => substr(trim($row[25]), 1, strlen(trim($row[25]))-2),
            'Blocked' => substr(trim($row[26]), 1, strlen(trim($row[26]))-2),
            'Pay-to Vendor No.' => substr(trim($row[27]), 1, strlen(trim($row[27]))-2),
            'Priority' => substr(trim($row[28]), 1, strlen(trim($row[28]))-2),
            'Payment Method Code' => substr(trim($row[29]), 1, strlen(trim($row[29]))-2),
            'Last Date Modified' => substr(trim($row[30]), 1, strlen(trim($row[30]))-2),
            'Application Method' => substr(trim($row[31]), 1, strlen(trim($row[31]))-2),
            'Prices Including VAT' => substr(trim($row[32]), 1, strlen(trim($row[32]))-2),
            'Fax No.' => substr(trim($row[33]), 1, strlen(trim($row[33]))-2),
            'Telex Answer Back' => substr(trim($row[34]), 1, strlen(trim($row[34]))-2),
            'VAT Registration No.' => substr(trim($row[35]), 1, strlen(trim($row[35]))-2),
            'Gen. Bus. Posting Group' => substr(trim($row[36]), 1, strlen(trim($row[36]))-2),
            'Post Code' => substr(trim($row[37]), 1, strlen(trim($row[37]))-2),
            'County' => substr(trim($row[38]), 1, strlen(trim($row[38]))-2),
            'E-Mail' => substr(trim($row[39]), 1, strlen(trim($row[39]))-2),
            'Home Page' => substr(trim($row[40]), 1, strlen(trim($row[40]))-2),
            'No. Series' => substr(trim($row[41]), 1, strlen(trim($row[41]))-2),
            'Tax Area Code' => substr(trim($row[42]), 1, strlen(trim($row[42]))-2),
            'Tax Liable' => substr(trim($row[43]), 1, strlen(trim($row[43]))-2),
            'VAT Bus. Posting Group' => substr(trim($row[44]), 1, strlen(trim($row[44]))-2),
            'Block Payment Tolerance' => substr(trim($row[45]), 1, strlen(trim($row[45]))-2),
            'Primary Contact No.' => substr(trim($row[46]), 1, strlen(trim($row[46]))-2),
            'Responsibility Center' => substr(trim($row[47]), 1, strlen(trim($row[47]))-2),
            'Location Code' => substr(trim($row[48]), 1, strlen(trim($row[48]))-2),
            'Lead Time Calculation' => substr(trim($row[49]), 1, strlen(trim($row[49]))-2),
            'Reverse Auction Participant' => substr(trim($row[50]), 1, strlen(trim($row[50]))-2),
            'Notification Process Code' => substr(trim($row[51]), 1, strlen(trim($row[51]))-2),
            'Queue Priority' => substr(trim($row[52]), 1, strlen(trim($row[52]))-2),
            'Base Calendar Code' => substr(trim($row[53]), 1, strlen(trim($row[53]))-2),
            'Type of Supply Code' => substr(trim($row[54]), 1, strlen(trim($row[54]))-2),
            'BACS Account No.' => substr(trim($row[55]), 1, strlen(trim($row[55]))-2),
            'Accounts Name' => substr(trim($row[56]), 1, strlen(trim($row[56]))-2),
            'Accounts Telephone' => substr(trim($row[57]), 1, strlen(trim($row[57]))-2),
            'Accounts E-mail' => substr(trim($row[58]), 1, strlen(trim($row[58]))-2),
            'Purchase Order E-mail' => substr(trim($row[59]), 1, strlen(trim($row[59]))-2),
            'Summary Aging' => substr(trim($row[60]), 1, strlen(trim($row[60]))-2),
            'Remittance E-Mail' => substr(trim($row[61]), 1, strlen(trim($row[61]))-2)
        );
    }

    echo "Vendors  Data<br/><pre>";
    print_r($data);
    echo "</pre>";