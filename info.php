<?php

        echo SERVER_PATH . '/libraries/mpdf/mpdf/mpdf.php';
        echo "|   ------------------clients ip2 : ";
        echo getRealIpAddr();



function getRealIpAddr()
    {
        if (!empty($_SERVER['HTTP_CLIENT_IP']))   //check ip from share internet
        {
          $ip= parse_url($_SERVER['HTTP_CLIENT_IP'])['host'];
        }
        elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR']))   //to check ip is pass from proxy
        {
          $ip=$_SERVER['HTTP_X_FORWARDED_FOR'];
        }
        else
        {
          $ip=$_SERVER['REMOTE_ADDR'];
        }
        return $ip;
    }


?>