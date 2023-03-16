<?php

require_once(SERVER_PATH . "/classes/class.phpmailer.php");

/**
 * LICENSE: The MIT License
 * Copyright (c) 2010 Chris Nizzardini (http://www.cnizz.com) 

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.

 * largely a wrapper class for php imap functions but since the classes on phpclasses.org are so shitty here we go....
 * @see http://www.php.net/manual/en/book.imap.php
 * @uses imap_mailboxmsginfo
 * @uses imap_headers
 * @uses imap_list
 * @uses imap_headerinfo
 */
class Imap {

    private $stream;
    private $mbox;
    private $is_connected = 0;
    private $host;
    private $username;
    private $password;
    private $folder;
    private $port;
    private $tls;
    private $ano = 0;

    function __construct($host, $username, $password, $folder = 'INBOX', $port = 143, $tls = 'notls') {
        $this->host = $host;
        $this->username = $username;
        $this->password = $password;
        $this->folder = $folder;
        $this->port = $port;
        $this->tls = $tls;
        $this->mbox = '{' . $host . ':' . $port . '/' . $tls . '}' . $folder;
        $this->stream = imap_open($this->mbox, $username, $password);
        if ($this->stream != false) {
            $this->is_connected = 1;
        }
    }

    public function returnImapMailBoxes() {
        $result = array();
        $mbox = '{' . $this->host . ':' . $this->port . '/' . $this->tls . '}';
        $stream = imap_open($mbox, $this->username, $this->password);
        $list = imap_getmailboxes($stream, '{' . $this->host . '}', "*");
//        echo "<pre>";
//        print_r($list);
//        echo "</pre>";
        if (is_array($list)) {
//            $result['INBOX'] = 'Inbox';
//            $result['INBOX.Drafts'] = 'Drafts';
//            $result['INBOX.Sent'] = 'Sent';
//            $result['INBOX.Trash'] = 'Trash';

            foreach ($list as $key => $val) {
                $folder = str_replace("{}", "", str_replace($this->host, "", $val->name));
                $foldervalue = ucfirst(strtolower(str_replace("INBOX.", "", $folder)));
                if ($foldervalue != "Inbox" && $foldervalue != "Drafts" && $foldervalue != "Sent" && $foldervalue != "Trash") {
                    $result[$folder] = $foldervalue;
                }
            }
        }
        return $result;
    }

    public function getIMAPSearchResults($stream, $search) {
        $Search = array();
        $SearchBodyResults = imap_search($stream, 'BODY "' . $search . '"', SE_FREE);
        $SearchSubjectResults = imap_search($stream, 'SUBJECT "' . $search . '"', SE_FREE);
        //$SearchUnseenResults = imap_search($stream, 'UNSEEN "' . $search . '"', SE_FREE);

        if ($SearchBodyResults && $SearchSubjectResults) {
            $Search = array_merge($SearchBodyResults, $SearchSubjectResults);
        } else if ($SearchBodyResults) {
            $Search = $SearchBodyResults;
        } else if ($SearchSubjectResults) {
            $Search = $SearchSubjectResults;
        }

        return array_unique($Search);
    }
    public function getIMAPUnseenResults() {
        $Search = array();
       // $SearchBodyResults = imap_search($stream, 'BODY "' . $search . '"', SE_FREE);
        $SearchUnseenResults = imap_search($this->stream, 'UNSEEN');

      if ($SearchUnseenResults) {
            $Search = $SearchUnseenResults;
        }

        return ($Search);
    }

    public function createSubFolder($stream, $folder, $subFolder) {
        $status = "";
        if ($folder == "") {
            $folder = "INBOX";
        }
        if (@imap_createmailbox($stream, imap_utf7_encode("{" . $this->host . "}$folder.$subFolder"))) {
            $status = @imap_status($stream, "{" . $this->host . "}$folder.$subFolder", SA_ALL);
        }




        return $status;
    }

    public function renameFolder($stream, $folder, $newFolder) {
        $status = "";
        $status = imap_renamemailbox($stream, "{" . $this->host . "}$folder", "{" . $this->host . "}$newFolder");

        return $status;
    }

    public function deleteFolder($stream, $folder) {
        $status = "";
        $status = imap_deletemailbox($stream, "{" . $this->host . "}$folder");

        return $status;
    }

    public function moveMessage($stream, $messageno, $folder) {
        $status = imap_mail_move($stream, $messageno, $folder);
        return array('error' => imap_errors());
    }

    public function deleteMessage($stream, $messageno) {
        $status = imap_delete($stream, $messageno);
        return $status;
    }

    public function sendMail($attr) {
        
    }

    public function getBody($messageno) {
//        $body = self::get_part($messageno, "TEXT/HTML");
//        // if HTML body is empty, try getting text body
//        if ($body == "") {
//            $body = self::get_part($messageno, "TEXT/PLAIN");
//        }

        $connection = imap_open('{' . $this->host . ':' . $this->port . '/' . $this->tls . '}' . $this->folder, $this->username, $this->password);

// the number in constructor is the message number
        $emailMessage = new EmailMessage($connection, $messageno);

// set to true to get the message parts (or don't set to false, the default is true)
        $emailMessage->getAttachments = true;
        $emailMessage->fetch();


        preg_match_all('/src="cid:(.*)"/Uims', $emailMessage->bodyHTML, $matches);

        if (count($matches)) {

            $search = array();
            $replace = array();

            foreach ($matches[1] as $match) {
                $uniqueFilename = time() . "teste.png";
                file_put_contents(UPLOAD_ATTACHMENT_PATH . "$uniqueFilename", $emailMessage->attachments[$match]['data']);
                $search[] = "src=\"cid:$match\"";
                $replace[] = "src=\"" . BASE_PATH . DOWNLOAD_ATTACHMENT_PATH . "/$uniqueFilename\"";
            }

            $emailMessage->bodyHTML = str_replace($search, $replace, $emailMessage->bodyHTML);
        }

//        preg_match_all('/src="cid:(.*)"/Uims', $body, $matches);
//        if(count($matches)) {
//	
//	$search = array();
//	$replace = array();
//	
//	foreach($matches[1] as $match) {
//		$uniqueFilename = time()."teste.png";
//		file_put_contents("directorio/$uniqueFilename", $emailMessage->attachments[$match]['data']);
//		$search[] = "src=\"cid:$match\"";
//		$replace[] = "src=\"http://navson.com/navson/imap/directorio/$uniqueFilename\"";
//	}
//	
//	$emailMessage->bodyHTML = str_replace($search, $replace, $emailMessage->bodyHTML);
//	
//}


        $body = "";
        if ($emailMessage->bodyHTML == "") {
            $body = str_replace("\r\n", "<br/>", $emailMessage->bodyPlain);
        } else {
            $body = $emailMessage->bodyHTML;
        }

        if ($body == "") {
            $body = self::get_part($messageno, "TEXT/HTML");
            // if HTML body is empty, try getting text body
            if ($body == "") {
                $body = self::get_part($messageno, "TEXT/PLAIN");
            }
        }

        return $body;
    }

    public function get_part($messageno, $mimetype, $structure = false, $partNumber = false) {
        if (!$structure) {
            $structure = imap_fetchstructure($this->stream, $messageno, FT_UID);
        }
        if ($structure) {
            if ($mimetype == self::get_mime_type($structure)) {
                if (!$partNumber) {
                    $partNumber = 1;
                }
                $text = imap_fetchbody($this->stream, $messageno, $partNumber, FT_UID);
                switch ($structure->encoding) {
                    case 3: return imap_base64($text);
                    case 4: return imap_qprint($text);
                    default: return $text;
                }
            }

            // multipart 
            if ($structure->type == 1) {
                foreach ($structure->parts as $index => $subStruct) {
                    $prefix = "";
                    if ($partNumber) {
                        $prefix = $partNumber . ".";
                    }
                    $data = self::get_part($messageno, $mimetype, $subStruct, $prefix . ($index + 1));
                    if ($data) {
                        return $data;
                    }
                }
            }
        }
        return false;
    }

    public function setFolderMessageFlags($messageno, $flags) {
        $isSet = imap_setflag_full($this->stream, $messageno, $flags);
        return $isSet;
    }

    public function unsetFolderMessageFlags($messageno, $flags) {
        $isSet = imap_clearflag_full($this->stream, $messageno, $flags);
        return $isSet;
    }

    public function get_mime_type($structure) {
        $primaryMimetype = array("TEXT", "MULTIPART", "MESSAGE", "APPLICATION", "AUDIO", "IMAGE", "VIDEO", "OTHER");

        if ($structure->subtype) {
            return $primaryMimetype[(int) $structure->type] . "/" . $structure->subtype;
        }
        return "TEXT/PLAIN";
    }

    public function getAttachedfiles($messageno) {

        $mailStruct = imap_fetchstructure($this->stream, $messageno);
        $attachments = self::getAttachments($messageno, $mailStruct, "");

        return $attachments;
    }

    function getAttachments($mailNum, $part, $partNum) {
        $attachments = array();

        if (isset($part->parts)) {
            $attachmentno = 0;
            foreach ($part->parts as $key => $subpart) {
                if ($partNum != "") {
                    $newPartNum = $partNum . "." . ($key + 1);
                } else {
                    $newPartNum = ($key + 1);
                }
                $result = self::getAttachments($mailNum, $subpart, $newPartNum);
                if (count($result) != 0) {
                    array_push($attachments, $result);
                }
            }
        } else if (isset($part->disposition)) {
            // print_r($part);
            if (strtoupper($part->disposition) == "ATTACHMENT") {
                $this->ano++;
                $partStruct = imap_bodystruct($this->stream, $mailNum, $partNum);
                $attachmentDetails = array(
                    "name" => $part->dparameters[0]->value,
                    "subtype" => $partStruct->subtype,
                    "partNum" => $partNum,
                    "enc" => $partStruct->encoding,
                    "ano" => $this->ano,
                    "method" => 'imap',
                    "mailno" => $mailNum
                );
                return $attachmentDetails;
            }
        }

        return $attachments;
    }

    public function downloadAttachment($stream, $messageno, $ano) {
        $structure = imap_fetchstructure($stream, $messageno);
        $attachments = '';
        $attachmentno = 0;
        if (isset($structure->parts) && count($structure->parts)) {
            for ($i = 0; $i < count($structure->parts); $i++) {
                if (strtoupper($structure->parts[$i]->disposition) == 'ATTACHMENT') {
                    $attachmentno++;
                    if ($ano == $attachmentno) {
                        $attachments[$i] = array(
                            'is_attachment' => false,
                            'filename' => '',
                            'name' => '',
                            'attachment' => '');

                        if ($structure->parts[$i]->ifdparameters) {
                            foreach ($structure->parts[$i]->dparameters as $object) {
                                if (strtolower($object->attribute) == 'filename') {
                                    $attachments[$i]['is_attachment'] = true;
                                    $attachments[$i]['filename'] = $object->value;
                                }
                            }
                        }

                        if ($structure->parts[$i]->ifparameters) {
                            foreach ($structure->parts[$i]->parameters as $object) {
                                if (strtolower($object->attribute) == 'name') {
                                    $attachments[$i]['is_attachment'] = true;
                                    $attachments[$i]['name'] = $object->value;
                                }
                            }
                        }

                        if ($attachments[$i]['is_attachment']) {
                            $attachments[$i]['attachment'] = imap_fetchbody($stream, $messageno, $i + 1);
                            if ($structure->parts[$i]->encoding == 3) { // 3 = BASE64
                                $attachments[$i]['attachment'] = base64_decode($attachments[$i]['attachment']);
                            } elseif ($structure->parts[$i]->encoding == 4) { // 4 = QUOTED-PRINTABLE
                                $attachments[$i]['attachment'] = quoted_printable_decode($attachments[$i]['attachment']);
                            }
                        }

                        $time = time() . "_" . rand(99, 9999);
                        file_put_contents(UPLOAD_ATTACHMENT_PATH . $time . $attachments[$i]['filename'], $attachments[$i]['attachment']);
                        header("Content-Type: application/octet-stream");
                        header("Content-Transfer-Encoding: Binary");
                        header("Content-disposition: attachment; filename=\"" . $attachments[$i]['filename'] . "\"");
                        //  return readfile(DOWNLOAD_ATTACHMENT_PATH . $time . $attachments[$i]['filename']);
                        return array('filename' => $time . $attachments[$i]['filename'], 'path' => DOWNLOAD_ATTACHMENT_PATH);
                        // unlink('directorio/' . $time . $attachments[$i]['filename']);
                        // break;
//                        $file = DOWNLOAD_ATTACHMENT_PATH . $time . $attachments[$i]['filename'];
//                        $f = fopen($file, 'w+');
//                        fwrite($f, base64_decode($this->returnBodyStr($messageno, $structure)));
//                        fclose($f);
//                        $f = fopen($file, 'r');
//                        fread($f, filesize($file));
//                        return $file;
                    }
                }
            }
        }
    }

    /**
     * returnImapMailBoxmMsgInfoObj - returns general mailbox information
     * @see http://www.php.net/manual/en/function.imap-mailboxmsginfo.php
     * @param void
     * @return object
     */
    public function returnImapMailBoxmMsgInfoObj() {
        return imap_mailboxmsginfo($this->stream);
    }

    public function getImapMessageCount() {
        return imap_num_msg($this->stream);
    }

    /**
     * returnMailBoxHeaderArr - this is all you need to see email header information for all emails within a mailbox
     * @param void
     * @return array
     */
    public function isMailForwarded($messageno) {

        $forwarded = '';
        $arr = $this->returnImapHeadersArr();
        if (is_array($arr)) {
            $i = $arr[$messageno - 1];
            $position = strpos($i, ')');
            $sub = substr($i, 0, $position);
            $spaces = explode(" ", $sub);
            $mNumber = $spaces[COUNT($spaces) - 1];
            if ($messageno == $mNumber) {
                if (strpos($i, '$Forwarded') > 0) {
                    $forwarded = 'F';
                }
            }
        }
        return $forwarded;
    }

    public function returnMailBoxHeaderArr() {

        $array = array();
        $mCount = self::getImapMessageCount();
        $j = 0;
        if ($mCount > 0) {
            for ($i = $mCount; $i >= 1; $i--) {

                $emailHeaderArr = $this->returnEmailHeaderArr($i);

                if ($emailHeaderArr) {
                    $array[$j] = $emailHeaderArr;
                    $j++;
                }
            }
        }
        return $array;
    }

    /**
     * returnMailboxListArr - returns lists of mailboxes
     * @see http://www.php.net/manual/en/function.imap-list.php
     * @param void
     * @return array
     */
    public function returnMailboxListArr() {
        return imap_list($this->stream, $this->mbox, '*');
    }

    /**
     * returnEmailHeaderArr
     * This returns detailed header information for the given message number
     * @param messageNumber
     * @return array
     */
    public function returnEmailHeaderArr($messageNumber) {

        $array = array();
        $head = $this->returnImapHeader($messageNumber);
	
		
        if ($head->Deleted != "D") {
            $isForwarded = self::isMailForwarded($messageNumber);
            $MessageStr = $this->returnMessageStructureObj($messageNumber);
            $array['Attachment'] = '';
            foreach ($MessageStr->parts as $part) {
                if ($part->ifdisposition == 1 && $part->disposition == "attachment") {
                    $array['Attachment'] = 'A';
                    break;
                }
            }
           
			$array['date'] = trim($head->date);
            $array['subject'] = trim($head->subject);
            $array['in_reply_to'] = trim($head->in_reply_to);
            $array['message_id'] = trim($head->message_id);
            $array['references'] = trim($head->references);
            // $array['toaddress'] = $head->toaddress;
            $array['to'] = array();

            if ($head->to) {
                $i = 0;
                foreach ($head->to as $to) {
                    $array['to'][$i] = array('personal' => trim($to->personal), 'to' => trim($to->mailbox) . '@' . trim($to->host));
                    $i++;
                }
            }

            //$array['fromaddress'] = $head->fromaddress;
            $array['from'] = array();
            if ($head->from) {
                $j = 0;
                foreach ($head->from as $from) {
                    $array['from'][$j] = array('personal' => trim($from->personal), 'from' => trim($from->mailbox) . '@' . trim($from->host));
                    $j++;
                }
            }

            //$array['ccaddress'] = $head->ccaddress;
            $array['cc'] = array();
            if ($head->cc) {
                $k = 0;
                foreach ($head->cc as $cc) {
                    $array['cc'][$k] = array('personal' => trim($cc->personal), 'cc' => trim($cc->mailbox) . '@' . trim($cc->host));
                    $k++;
                }
            }

            // $array['reply_toaddress'] = $head->reply_toaddress;
            $array['reply_to'] = array();
            if ($head->reply_to) {
                $l = 0;
                foreach ($head->reply_to as $reply_to) {
                    $array['reply_to'][$l] = array('personal' => trim($reply_to->personal), 'reply_to' => trim($reply_to->mailbox) . '@' . trim($reply_to->host));
                    $l++;
                }
            }

            //$array['senderaddress'] = $head->senderaddress;
            $array['sender'] = array();
            if ($head->sender) {
                $m = 0;
                foreach ($head->sender as $sender) {
                    $array['sender'][$m] = array('personal' => trim($sender->personal), 'sender' => trim($sender->mailbox) . '@' . trim($sender->host));
                    $m++;
                }
            }

            $array['Forwarded'] = $isForwarded;
            $array['Recent'] = trim($head->Recent);
            $array['Unseen'] = trim($head->Unseen);
            $array['Flagged'] = trim($head->Flagged);
            $array['Answered'] = trim($head->Answered);
            $array['Deleted'] = trim($head->Deleted);
            $array['Draft'] = trim($head->Draft);
            $array['Msgno'] = trim($head->Msgno);
            $array['MailDate'] = trim($head->MailDate);
            $array['Size'] = trim($head->Size);
            $array['udate'] = trim($head->udate);
        
			//print_r($head);
			$array['custom-field'] = trim($head->custom-field);
	    }

        return $array;
    }

    /**
     * returnEmailMessageArr
     * This returns the entire email for the given message number
     * @param unknown_type $messageNumber
     * @return array
     * @example array('header'=>object,'plain'=>'','html'=>'','attachment'=>array());
     */
    public function returnEmailMessageArr($messageNumber, $withEncodedAttachment = 0) {
        $array = array();

        $o = $this->returnMessageStructureObj($messageNumber);
        if (is_object($o)) {
            $array['header'] = $this->returnEmailHeaderArr($messageNumber);
            if (is_array($o->parts)) {
                // first build plain and/or html part of array
                foreach ($o->parts as $x => $i) {
                    if (is_array($i->parts)) {
                        foreach ($i->parts as $j => $k) {
                            if ($k->subtype == 'PLAIN') {
                                $array['plain'] = $this->returnBodyStr($messageNumber, '1.1');
                            } else if ($k->subtype == 'HTML') {
                                $array['html'] = $this->returnBodyStr($messageNumber, '1.2');
                            } else if ($k->disposition == 'attachment') {
                                $attachments++;
                            }
                        }
                    } else {
                        if ($i->subtype == 'PLAIN') {
                            $array['plain'] = $this->returnBodyStr($messageNumber, '1');
                        } else if ($i->subtype == 'HTML') {
                            $array['html'] = $this->returnBodyStr($messageNumber, '2');
                        } else if ($i->disposition == 'attachment') {
                            $attachments++;
                            $array['attachments'][] = array('type' => $i->subtype, 'bytes' => $i->bytes, 'name' => $i->parameters[0]->value, 'part' => "2");
                        }
                    }
                }

                if ($attachments > 1) {
                    $array['attachments'] = array();
                    foreach ($o->parts as $x => $i) {
                        if ($i->disposition == 'attachment') {
                            $part = $x + 1;
                            $array['attachments'][] = array('type' => $i->subtype, 'bytes' => $i->bytes, 'name' => $i->parameters[0]->value, 'part' => $part, 'msgno' => $messageNumber);
                        }
                    }
                }
            }
            // simple plain text email
            else if ($o->subtype == 'PLAIN') {
                $array['plain'] = $this->returnBodyStr($messageNumber, '1');
            } else {
                $array['error'][] = 'Error encountered parsing email';
            }
        } else { // report error
        }
        return $array;
    }

    /**
     * saveAttachmentAndReturnFullFilePathStr
     * @param messageNumber(int),part(str),saveToFile(str)
     * @example saveToFile = '/var/www/attachment/myAttachement' (do not include an extension i do this for you at return!)
     * @return string
     */
    public function saveAttachment($messageNumber, $part, $saveToFile) {


       // echo ($messageNumber.'-'.$part.'-'.$saveToFile);
        $arr = $this->returnEmailMessageArr($messageNumber, 1);

        if (is_array($arr['attachments'])) {
            foreach ($arr['attachments'] as $i) {
                if ($i['part'] == $part) {

                   //$new_name = $i['name'].time();
                   $extensionArr = explode('.', $i['name']);
                    $extension = $extensionArr[(count($extensionArr) - 1)];
                    $name = $extensionArr[(count($extensionArr) - 2)];
                    $new_name = $name.time().'.'.$extension;
                    $old_name = $i['name'];
                   // echo $extension;echo '--'.$name;
                   // print_r($extensionArr);
                    $file = $saveToFile . $new_name;
                    $f = fopen($file, 'w+');
                    fwrite($f, base64_decode($this->returnBodyStr($messageNumber, $part)));
                    fclose($f);
                    $f = fopen($file, 'r');
                    fread($f, filesize($file));

                    $fileArr = array(
                        'new_name' => $new_name,
                        'old_name' => $old_name
                    );
                    return $fileArr;
                }
            }
        }
        return '';
    }

    public function get_is_connected() {
        return $this->is_connected;
    }

    public function get_mbox() {
        return $this->mbox;
    }

    public function get_host() {
        return $this->host;
    }

    public function get_username() {
        return $this->username;
    }

    public function get_password() {
        return $this->password;
    }

    public function get_folder() {
        return $this->folder;
    }

    public function get_port() {
        return $this->port;
    }

    public function get_tls() {
        return $this->tls;
    }

    public function get_stream() {
        return $this->stream;
    }

    // METHODS BELOW ARE PRIVATE - YOU CAN CHANGE THESE TO PUBLIC IF NEED BE - BUT THE ABOVE METHODS SHOULD GIVE YOU EVERYTHING YOU NEED

    /**
     * returnImapHeader
     * @see http://www.php.net/manual/en/function.imap-headerinfo.php
     * @param void
     * @return object
     */
    private function returnImapHeader($messageNumber) {
        return imap_header($this->stream, $messageNumber);
    }

    /**
     * returnMessageStructureObj
     * @see http://www.php.net/manual/en/function.imap-fetchstructure.php
     * @param unknown_type $messageNumber
     * @return object
     */
    private function returnMessageStructureObj($messageNumber) {
        return imap_fetchstructure($this->stream, $messageNumber);
    }

    /**
     * returnRawMessageBodyStr
     * @see http://www.php.net/manual/en/function.imap-body.php
     * @param unknown_type $messageNumber
     * @return string
     */
    private function returnRawBodyStr($messageNumber) {
        return imap_body($this->stream, $messageNumber);
    }

    /**
     * returnImapHeadersArr - returns general info on emails in this box
     * @see http://www.php.net/manual/en/function.imap-headers.php
     * @param void
     * @return array
     */
    private function returnImapHeadersArr() {
        return imap_headers($this->stream);
    }

    /**
     * returnMessageBodyStructureObj
     * @see http://www.php.net/manual/en/function.imap-bodystruct.php
     * @param $messageNumber(int),part(int)
     * @return object
     */
    private function returnBodyStructureObj($messageNumber, $part) {
        return imap_bodystruct($this->stream, $messageNumber, $part);
    }

    /**
     * returnBodyStr
     * @see http://www.php.net/manual/en/function.imap-fetchbody.php
     * @param $messageNumber(int),part(int)
     * @return string
     */
    private function returnBodyStr($messageNumber, $section) {
        return imap_fetchbody($this->stream, $messageNumber, $section);
    }

}

class EmailMessage {

    protected $connection;
    protected $messageNumber;
    public $bodyHTML = '';
    public $bodyPlain = '';
    public $attachments;
    public $getAttachments = true;

    public function __construct($connection, $messageNumber) {

        $this->connection = $connection;
        $this->messageNumber = $messageNumber;
    }

    public function fetch() {

        $structure = @imap_fetchstructure($this->connection, $this->messageNumber);
        if (!$structure) {
            return false;
        } else {
            $this->recurse($structure->parts);
            return true;
        }
    }

    public function recurse($messageParts, $prefix = '', $index = 1, $fullPrefix = true) {

        foreach ($messageParts as $part) {

            $partNumber = $prefix . $index;

            if ($part->type == 0) {
                if ($part->subtype == 'PLAIN') {
                    $this->bodyPlain .= $this->getPart($partNumber, $part->encoding);
                } else {
                    $this->bodyHTML .= $this->getPart($partNumber, $part->encoding);
                }
            } elseif ($part->type == 2) {
                $msg = new EmailMessage($this->connection, $this->messageNumber);
                $msg->getAttachments = $this->getAttachments;
                $msg->recurse($part->parts, $partNumber . '.', 0, false);
                $this->attachments[] = array(
                    'type' => $part->type,
                    'subtype' => $part->subtype,
                    'filename' => '',
                    'data' => $msg,
                    'inline' => false,
                );
            } elseif (isset($part->parts)) {
                if ($fullPrefix) {
                    $this->recurse($part->parts, $prefix . $index . '.');
                } else {
                    $this->recurse($part->parts, $prefix);
                }
            } elseif ($part->type > 2) {
                if (isset($part->id)) {
                    $id = str_replace(array('<', '>'), '', $part->id);
                    $this->attachments[$id] = array(
                        'type' => $part->type,
                        'subtype' => $part->subtype,
                        'filename' => $this->getFilenameFromPart($part),
                        'data' => $this->getAttachments ? $this->getPart($partNumber, $part->encoding) : '',
                        'inline' => true,
                    );
                } else {
                    $this->attachments[] = array(
                        'type' => $part->type,
                        'subtype' => $part->subtype,
                        'filename' => $this->getFilenameFromPart($part),
                        'data' => $this->getAttachments ? $this->getPart($partNumber, $part->encoding) : '',
                        'inline' => false,
                    );
                }
            }

            $index++;
        }
    }

    function getPart($partNumber, $encoding) {

        $data = imap_fetchbody($this->connection, $this->messageNumber, $partNumber);
        switch ($encoding) {
            case 0: return $data; // 7BIT
            case 1: return $data; // 8BIT
            case 2: return $data; // BINARY
            case 3: return base64_decode($data); // BASE64
            case 4: return quoted_printable_decode($data); // QUOTED_PRINTABLE
            case 5: return $data; // OTHER
        }
    }

    function getFilenameFromPart($part) {

        $filename = '';

        if ($part->ifdparameters) {
            foreach ($part->dparameters as $object) {
                if (strtolower($object->attribute) == 'filename') {
                    $filename = $object->value;
                }
            }
        }

        if (!$filename && $part->ifparameters) {
            foreach ($part->parameters as $object) {
                if (strtolower($object->attribute) == 'name') {
                    $filename = $object->value;
                }
            }
        }

        return $filename;
    }

}
