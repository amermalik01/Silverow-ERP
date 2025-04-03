<?php

include_once 'Imap.class.php';

$imap = new Imap('mail3.gridhost.co.uk','mudassir@navsonsoftware.com','gpcmm2015', 'INBOX.Trash', 143, 'notls');
$MailBoxes = $imap->returnImapMailBoxes();
echo "<pre>";
print_r($MailBoxes);
echo "</pre>";
//print_r($imap->returnImapMailBoxmMsgInfoObj());
//echo "</pre>";
//echo "Mail Box Header123<pre>";
//print_r();
//$MailBox = $imap->returnMailBoxHeaderArr();
//echo "Sent Mail Box Header Array789<pre>";
//print_r($MailBox);
//echo "</pre>";
$result = array();
//$i = 0;
//foreach($MailBox as $Mail){
////    echo "<pre>";
////    print_r($Mail);
////    echo "</pre>";
//    $MessageArr = $imap->returnEmailMessageArr($Mail['msgno']);
////    echo "Message Array<pre>";
////    print_r($MessageArr);
////    echo "</pre>";
//    $result[$i]['header'] = $Mail;
//    $result[$i]['message'] = $MessageArr;
//    $i++;
//}
//echo json_encode($result);

//echo "</pre>";
//echo "Mail Box List<pre>";
//print_r($imap->returnImapHeadersArr());
//print_r($imap->returnMailboxListArr());
//echo "</pre>";
//echo "Mail Box Header<pre>";
//print_r($imap->returnMailBoxHeaderArr());
//echo "</pre>";
//echo "Email Message<pre>";
//print_r($imap->returnEmailMessageArr(1));
//echo "</pre>";

echo "////////////////////////////////////////////////////////////////////////";

//$imap = new Imap('mail3.gridhost.co.uk','mudassir@navsonsoftware.com','gpcmm2015', 'INBOX.Sent', 143, 'notls');
//echo "Is connected";
//var_dump($imap->get_is_connected());
//echo "Imap Mail Box Message Info<pre>";
//print_r($imap->returnImapMailBoxmMsgInfoObj());
//echo "</pre>";
//echo "Mail Box List<pre>";
////print_r($imap->returnImapHeadersArr());
//print_r($imap->returnMailboxListArr());
//echo "</pre>";
//echo "Mail Box Header<pre>";
//print_r($imap->returnMailBoxHeaderArr());
//echo "</pre>";
//echo "Email Message<pre>";
//print_r($imap->returnEmailMessageArr(1));
//echo "</pre>";

//echo $imap->saveAttachment(2,2,'/path/to/where/you/want/the/attachment/saved'.md5('14'.date('Y-m-d H:i:s')))
?> 