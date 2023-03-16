<?php
error_reporting(0);

//echo $dir = dirname(__FILE__)."<hr>";

$mysqli = mysqli_connect('10.169.0.75', 'navsonso_silver', 'NgDb@Navson321/', 'navsonso_silver');
$message = "";
$success = "";
$eventId = "";
$eventTitle = "";
if ((isset($_REQUEST['code']) && $_REQUEST['code'] != "") && (isset($_REQUEST['id']) && $_REQUEST['id'] != "") && (isset($_REQUEST['status']) && $_REQUEST['status'] != "")) {

    $Sql = "SELECT * FROM event_invitors WHERE status=0 AND id=" . $_REQUEST['id'];
    $result = mysqli_query($mysqli, $Sql);
    
    if ($result->num_rows > 0) {
        while ($row = mysqli_fetch_array($result)) {
            $email = $row['email'];
            $eventId = $row['event_id'];
            $hash = md5("123" . $_REQUEST['id'] . "123" . $email . "123");
            if ($hash == $_REQUEST['code']) {
                mysqli_query($mysqli, "UPDATE event_invitors SET status=" . $_REQUEST['status'] . " WHERE id=" . $_REQUEST['id']);
            }
        }

        $SqlEvent = "SELECT * FROM calendar_event WHERE id=$eventId";
        $resultEvent = mysqli_query($mysqli, $SqlEvent);
        if ($resultEvent) {
            while ($row = mysqli_fetch_array($resultEvent)) {
                $eventTitle = $row['event'];
            }
        }
        if ($_REQUEST['status'] == 1) {
            $success = "Congratulations!";
            $message = "You have accepted event.";
        } else if ($_REQUEST['status'] == 2) {
            $success = "";
            $message = "You have clicked Maybe for the event invitation.";
        } else if ($_REQUEST['status'] == 3) {
            $success = "";
            $message = "You didn't accept event invitation.";
        }
    } else {
        $success = "";
        $message = "There is some error. Only one time action is allowed. You can't click more than one time to buttons of event invitation.";
    }
}
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Navson Email</title>
        <script type="text/javascript">
            //window.close();
        </script>
        <style type="text/css">
            /* Client-specific Styles */

            #outlook a {
                padding: 0;
            } /* Force Outlook to provide a "view in browser" menu link. */
            body {
                width: 100% !important;
                -webkit-text-size-adjust: 100%;
                -ms-text-size-adjust: 100%;
                margin: 0;
                padding: 0;
            }
            /* Prevent Webkit and Windows Mobile platforms from changing default font sizes, while not breaking desktop design. */
            .ExternalClass {
                width: 100%;
            } /* Force Hotmail to display emails at full width */
            .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div {
                line-height: 100%;
            } /* Force Hotmail to display normal line spacing.  */
            #backgroundTable {
                margin: 0;
                padding: 0;
                width: 100% !important;
                line-height: 100% !important;
            }
            img {
                outline: none;
                text-decoration: none;
                border: none;
                -ms-interpolation-mode: bicubic;
            }
            a img {
                border: none;
            }
            .image_fix {
                display: block;
            }
            p {
                margin: 0px 0px !important;
            }
            table td {
                border-collapse: collapse;
            }
            table {
                border-collapse: collapse;
                mso-table-lspace: 0pt;
                mso-table-rspace: 0pt;
            }
            a {
                color: #9ec459;
                text-decoration: none;
                text-decoration: none!important;
            }
            /*STYLES*/
            table[class=full] {
                width: 100%;
                clear: both;
            }
            /*IPAD STYLES*/
            @media only screen and (max-width: 640px) {
                a[href^="tel"], a[href^="sms"] {
                    text-decoration: none;
                    color: #9ec459; /* or whatever your want */
                    pointer-events: none;
                    cursor: default;
                }
                .mobile_link a[href^="tel"], .mobile_link a[href^="sms"] {
                    text-decoration: default;
                    color: #9ec459 !important;
                    pointer-events: auto;
                    cursor: default;
                }
                table[class=devicewidth] {
                    width: 440px!important;
                    text-align: center!important;
                }
                td[class=devicewidth] {
                    width: 440px!important;
                    text-align: center!important;
                }
                img[class=devicewidth] {
                    width: 440px!important;
                    text-align: center!important;
                }
                img[class=banner] {
                    width: 440px!important;
                    height: 147px!important;
                }
                table[class=devicewidthinner] {
                    width: 420px!important;
                    text-align: center!important;
                }
                table[class=icontext] {
                    width: 345px!important;
                    text-align: center!important;
                }
                img[class="colimg2"] {
                    width: 420px!important;
                    height: 243px!important;
                }
                table[class="emhide"] {
                    display: none!important;
                }
                img[class="logo"] {
                    width: 440px!important;
                    height: 110px!important;
                }
            }
            /*IPHONE STYLES*/
            @media only screen and (max-width: 480px) {
                a[href^="tel"], a[href^="sms"] {
                    text-decoration: none;
                    color: #9ec459; /* or whatever your want */
                    pointer-events: none;
                    cursor: default;
                }
                .mobile_link a[href^="tel"], .mobile_link a[href^="sms"] {
                    text-decoration: default;
                    color: #9ec459 !important;
                    pointer-events: auto;
                    cursor: default;
                }
                table[class=devicewidth] {
                    width: 280px!important;
                    text-align: center!important;
                }
                td[class=devicewidth] {
                    width: 280px!important;
                    text-align: center!important;
                }
                img[class=devicewidth] {
                    width: 280px!important;
                    text-align: center!important;
                }
                img[class=banner] {
                    width: 280px!important;
                    height: 93px!important;
                }
                table[class=devicewidthinner] {
                    width: 260px!important;
                    text-align: center!important;
                }
                table[class=icontext] {
                    width: 186px!important;
                    text-align: center!important;
                }
                img[class="colimg2"] {
                    width: 260px!important;
                    height: 150px!important;
                }
                table[class="emhide"] {
                    display: none!important;
                }
                img[class="logo"] {
                    width: 280px!important;
                    height: 70px!important;
                }
            }
        </style>
    </head>
    <body>
        <!-- Start of preheader -->
        <table width="100%" bgcolor="#5ab1b9" cellpadding="0" cellspacing="0" border="0" id="backgroundTable">
            <tbody>
                <tr>
                    <td><table width="600" cellpadding="0" cellspacing="0" border="0" align="center" class="devicewidth">
                            <tbody>
                                <tr>
                                    <td width="100%"><table width="600" cellpadding="0" cellspacing="0" border="0" align="center" class="devicewidth">
                                            <tbody>
                                                <!-- Spacing -->
                                                <tr>
                                                    <td width="100%" height="20"></td>
                                                </tr>
                                                <!-- Spacing -->
                                                <tr>
                                                    <td><table width="280" align="left" border="0" cellpadding="0" cellspacing="0" class="devicewidthinner">
                                                            <tbody>
                                                                <tr>
                                                                    <td align="left" valign="middle" style="font-family: Helvetica, arial, sans-serif; font-size: 13px;color: #ffffff"> <?php echo $eventTitle;?></td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                        <table width="280" align="left" border="0" cellpadding="0" cellspacing="0" class="emhide">
                                                            <tbody>
                                                                <tr>
                                                                    <td align="right" valign="middle" style="font-family: Helvetica, arial, sans-serif; font-size: 13px;color: #ffffff"></td>
                                                                </tr>
                                                            </tbody>
                                                        </table></td>
                                                </tr>
                                                <!-- Spacing -->
                                                <tr>
                                                    <td width="100%" height="20"></td>
                                                </tr>
                                                <!-- Spacing -->
                                            </tbody>
                                        </table></td>
                                </tr>
                            </tbody>
                        </table></td>
                </tr>
            </tbody>
        </table>
        <!-- End of preheader --> 
        <!-- Start of LOGO -->
        <table width="100%" bgcolor="#e8eaed" cellpadding="0" cellspacing="0" border="0" id="backgroundTable">
            <tbody>
                <tr>
                    <td><table width="600" cellpadding="0" cellspacing="0" border="0" align="center" class="devicewidth">
                            <tbody>
                                <tr>
                                    <td width="100%"><table bgcolor="#e8eaed" width="600" align="center" cellspacing="0" cellpadding="0" border="0" class="devicewidth">
                                            <tbody>
                                                <tr> 
                                                    <!-- start of image -->
                                                    <td align="center">&nbsp;

                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>

                                        <!-- end of image --></td>
                                </tr>
                            </tbody>
                        </table></td>
                </tr>
            </tbody>
        </table>
        </td>
        </tr>
        </tbody>
        </table>
        <!-- End of LOGO --> 
        <!-- start textbox-with-title -->
        <table width="100%" bgcolor="#e8eaed" cellpadding="0" cellspacing="0" border="0" id="backgroundTable">
            <tbody>
                <tr>
                    <td><table width="600" cellpadding="0" cellspacing="0" border="0" align="center" class="devicewidth">
                            <tbody>
                                <tr>
                                    <td width="100%"><table bgcolor="#ffffff" width="600" cellpadding="0" cellspacing="0" border="0" align="center" class="devicewidth">
                                            <tbody>
                                                <!-- Spacing -->
                                                <tr>
                                                    <td width="100%" height="20"></td>
                                                </tr>
                                                <!-- Spacing -->
                                                <tr>
                                                    <td>

                                                        <table width="560" align="center" cellpadding="0" cellspacing="0" border="0" class="devicewidthinner">
                                                            <tbody>
                                                                <!-- Title -->
                                                                <tr>
                                                                    <td style="font-family: Helvetica, arial, sans-serif; font-size: 14px; font-weight:bold; color: #333333; text-align:left;line-height: 24px;">&nbsp;</td>
                                                                    <td style="font-family: Helvetica, arial, sans-serif; font-size: 14px; color: #333333; text-align:left;line-height: 24px;">&nbsp;</td>
                                                                </tr>
                                                                <tr>
                                                                    <td colspan="2" style="font-family: Helvetica, arial, sans-serif; font-size: 14px; font-weight:bold; color: #333333; text-align:center;line-height: 24px;"> 
                                                                        <h1><?php echo $success;?></h1></td>
                                                                </tr>
                                                                <tr>
                                                                    <td width="27%" style="font-family: Helvetica, arial, sans-serif; font-size: 14px; font-weight:bold; color: #333333; text-align:left;line-height: 24px;">&nbsp;</td>
                                                                    <td width="73%" style="font-family: Helvetica, arial, sans-serif; font-size: 14px; color: #333333; text-align:left;line-height: 24px;">&nbsp;</td>
                                                                </tr>
                                                                <!-- End of Title --> 
                                                                <!-- spacing -->
                                                                <tr>
                                                                    <td height="5" colspan="2"></td>
                                                                </tr>
                                                                <!-- End of spacing --> 
                                                                <!-- content -->                                <!-- End of content --> 
                                                                <!-- Spacing -->                                <!-- Spacing --> 
                                                                <!-- button -->                                <!-- /button --> 
                                                                <!-- Spacing -->
                                                                <tr>
                                                                    <td height="20" colspan="2" style="text-align:center;">
                                                                        <p>
                                                                            <?php echo $message;?>
                                                                        </p>
                                                                    </td>
                                                                </tr>
                                                                <!-- Spacing -->
                                                            </tbody>
                                                        </table>

                                                        <table width="560" align="center" cellpadding="0" cellspacing="0" border="0" class="devicewidthinner">
                                                            <tbody>
                                                                <!-- Title -->
                                                                <tr>
                                                                    <td width="27%" style="font-family: Helvetica, arial, sans-serif; font-size: 14px; font-weight:bold; color: #333333; text-align:left;line-height: 24px;">&nbsp;</td>
                                                                    <td width="73%" style="font-family: Helvetica, arial, sans-serif; font-size: 14px; color: #333333; text-align:left;line-height: 24px;">&nbsp;</td>
                                                                </tr>
                                                                <tr>
                                                                    <td colspan="2" style="font-family: Helvetica, arial, sans-serif; font-size: 14px; font-weight:bold; color: #333333; text-align:center;line-height: 24px;">&nbsp;</td>
                                                                </tr>
                                                                <tr>
                                                                    <td height="5" colspan="2"></td>
                                                                </tr>
                                                                <tr>
                                                                    <td height="20" colspan="2"></td>
                                                                </tr>
                                                            </tbody>
                                                        </table>

                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table></td>
                                </tr>
                            </tbody>
                        </table></td>
                </tr>
            </tbody>
        </table>
        <table width="100%" bgcolor="#e8eaed" cellpadding="0" cellspacing="0" border="0" id="backgroundTable">
            <tbody>
                <tr>
                    <td><table width="600" cellpadding="0" cellspacing="0" border="0" align="center" class="devicewidth">
                            <tbody>
                                <tr>
                                    <td width="100%">&nbsp;</td>
                                </tr>
                            </tbody>
                        </table></td>
                </tr>
            </tbody>
        </table>
        <table width="100%" bgcolor="#e8eaed" cellpadding="0" cellspacing="0" border="0" id="backgroundTable">
            <tbody>
                <tr>
                    <td><table width="600" cellpadding="0" cellspacing="0" border="0" align="center" class="devicewidth">
                            <tbody>
                                <tr>
                                    <td width="100%"><table bgcolor="#ffffff" width="600" cellpadding="0" cellspacing="0" border="0" align="center" class="devicewidth">
                                            <tbody>
                                                <tr>
                                                    <td></td>
                                                </tr>
                                            </tbody>
                                        </table></td>
                                </tr>
                            </tbody>
                        </table></td>
                </tr>
            </tbody>
        </table>
        <!-- End of 2-columns --> 
        <!-- Start of postfooter -->
        <table width="100%" bgcolor="#202020" cellpadding="0" cellspacing="0" border="0" id="backgroundTable">
            <tbody>
                <tr>
                    <td><table width="600" cellpadding="0" cellspacing="0" border="0" align="center" class="devicewidth">
                            <tbody>
                                <tr>
                                    <td width="100%"><table width="600" cellpadding="0" cellspacing="0" border="0" align="center" class="devicewidth">
                                            <tbody>
                                                <!-- Spacing -->
                                                <tr>
                                                    <td width="100%" height="20"></td>
                                                </tr>
                                                <!-- Spacing -->
                                                <tr>
                                                    <td align="center" valign="middle" style="font-family: Helvetica, arial, sans-serif; font-size: 13px;color: #ffffff"></td>
                                                </tr>
                                                <!-- Spacing -->
                                                <tr>
                                                    <td width="100%" height="20"></td>
                                                </tr>
                                                <!-- Spacing -->
                                            </tbody>
                                        </table></td>
                                </tr>
                            </tbody>
                        </table></td>
                </tr>
            </tbody>
        </table>
        <!-- End of postfooter -->
    </body>
</html>
