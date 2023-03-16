<?php

require_once(SERVER_PATH . "/classes/Xtreme.php");
require_once(SERVER_PATH . "/classes/General.php");
require_once(SERVER_PATH . "/classes/class.phpmailer.php");

class Calendar extends Xtreme
{

    private $Conn = null;
    private $objGeneral = null;
    private $arrUser = null;
    private $path = null;

    function __construct($user_info = array())
    {
        parent::__construct();
        $this->Conn = parent::GetConnection();
        $this->objGeneral = new General($user_info);
        $this->arrUser = $user_info;
        $this->path = $_SERVER['HTTP_HOST'] . "/silverow";
    }

    function countEvents($day, $month, $year, $users)
    {

        $UsersIn = "";

        foreach ($users as $key => $value) {
            $UsersIn .= "$value,";
        }

        $UsersEnum = substr($UsersIn, 0, strlen($UsersIn) - 1);
        $UserId = $this->arrUser['id'];
        $Sql = "SELECT * FROM calendar_event WHERE ($day BETWEEN from_day AND to_day) AND ($month BETWEEN from_month AND to_month) AND ($year BETWEEN from_year AND to_year) AND user_id = $UserId ORDER BY from_time";

        $RS = $this->Conn->Execute($Sql);


        return $total;
    }

    function countSharedEvents($day, $month, $year, $ownerId)
    {

        $Sql = "SELECT * FROM calendar_event WHERE ($day BETWEEN from_day AND to_day) AND ($month BETWEEN from_month AND to_month) AND ($year BETWEEN from_year AND to_year) AND user_id = $ownerId ORDER BY from_time";

        $RS = $this->Conn->Execute($Sql);

        $sql_total = "SELECT COUNT(*) as total FROM ($Sql) as tabless";
        $rs_count = $this->Conn->Execute($sql_total);

        $total = $rs_count->fields['total'];

        return $total;
    }

    function getSharedCalendars($attr)
    {

        $this->objGeneral->mysql_clean($attr);
        $month = (isset($attr['month'])) ? trim(stripslashes(strip_tags($attr['month']))) : '';
        $year = (isset($attr['year'])) ? trim(stripslashes(strip_tags($attr['year']))) : '';

        if (!$month || !is_numeric($month))
            $month = date('n');

        if (!$year || !is_numeric($year))
            $year = date('Y');

        $UserId = $this->arrUser['id'];
        $Sql = "SELECT * FROM calendar_share WHERE shared_with = $UserId AND status = 1  ORDER BY id DESC";
        $RS = $this->Conn->Execute($Sql);

        $results = array();
        $sid = 1;
        $count = 0;
        if ($RS->RecordCount() > 0) {
            while ($row = $RS->FetchRow()) {
                $results[$count] = self::getSharedMonthCalendar(array('month' => $month, 'year' => $year, 'owner_id' => $row['owner_id'], 'level' => $row['level']));
                $color = "";
                switch ($sid) {
                    case 1:
                        $color = "#76B6E7";
                        break;
                    case 2:
                        $color = "#A0CF9F";
                        break;
                    case 3:
                        $color = "#C1B09C";
                        break;
                    case 4:
                        $color = "#E7CE83";
                        break;
                    case 5:
                        $color = "#DE8C8C";
                        break;
                    default:
                        $color = "#76B6E7";
                        break;
                }
                $results[$count]['info'] = array('id' => "std" . $sid, 'color' => $color);
                if ($sid == 5) {
                    $sid = 1;
                } else {
                    $sid++;
                }
                $count++;
            }
        }

        return $results;
    }

    function getSharedMonthCalendar($attr)
    {

        $this->objGeneral->mysql_clean($attr);
        $firstDayOfWeek = 'Monday';
        $type = CAL_GREGORIAN;
        $month = (isset($attr['month'])) ? trim(stripslashes(strip_tags($attr['month']))) : '';
        $year = (isset($attr['year'])) ? trim(stripslashes(strip_tags($attr['year']))) : '';
        $ownerId = (isset($attr['owner_id'])) ? trim(stripslashes(strip_tags($attr['owner_id']))) : '';
        $level = (isset($attr['level'])) ? trim(stripslashes(strip_tags($attr['level']))) : '';

        if (!$month || !is_numeric($month))
            $month = date('n');

        if (!$year || !is_numeric($year))
            $year = date('Y');

        $today = date('Y/n/d');
        $dayCount = cal_days_in_month($type, $month, $year);

        $lastMonth = $month - 1;
        $nextMonth = $month + 1;

        $lastYear = $year - 1;
        $nextYear = $year + 1;

        $changeYear = "";
        $changeMonth = "";

        if ($month == 12):
            $changeYear = $year;
            $changeMonth = $lastMonth;
        elseif ($month == 1):
            $changeYear = $lastYear;
            $changeMonth = '12';
        else:
            $changeYear = $year;
            $changeMonth = $lastMonth;
        endif;

        $changeYearNext = "";
        $changeMonthNext = "";

        if ($month == 1):
            $changeYearNext = $year;
            $changeMonthNext = $nextMonth;
        elseif ($month == 12):
            $changeYearNext = $nextYear;
            $changeMonthNext = '1';
        else:
            $changeYearNext = $year;
            $changeMonthNext = $nextMonth;
        endif;


        $result['selectedMonthInfo'] = array('monthNumber' => $month, 'monthTitle' => date('F', mktime(0, 0, 0, $month, 1)), 'monthSubTitle' => date('M', mktime(0, 0, 0, $month, 1)), 'year' => $year);
        $result['previousMonthInfo'] = array('monthNumber' => $changeMonth, 'year' => $changeYear);
        $result['nextMonthInfo'] = array('monthNumber' => $changeMonthNext, 'year' => $changeYearNext);
        $OwnerInfo = self::getUserInfo($ownerId);
        $result['sharedInfo'] = array('level' => $level, 'ownerName' => $OwnerInfo['fname'] . " " . $OwnerInfo['lname'], 'ownerId' => $ownerId);
        $result['dates'] = array();

        $format = 1;

        /* Previous Month */

        $firstDay = date('N', mktime(0, 0, 0, $month, 1, $year));
        $rowno = 0;
        $elementno = 0;
        if (($firstDayOfWeek == 'Monday' && $firstDay != 1) || ($firstDayOfWeek == 'Sunday' && $firstDay != 7)) :

            $lastMonthDayCount = cal_days_in_month($type, $changeMonth, $changeYear);

            if ($firstDayOfWeek == 'Monday') :
                if ('Monday' == date('l', mktime(0, 0, 0, $changeMonth, $lastMonthDayCount, $changeYear))) :
                    $finalDay = date('j', mktime(0, 0, 0, $changeMonth, $lastMonthDayCount, $changeYear));
                else :
                    $finalDay = date('j', strtotime('last Monday', mktime(0, 0, 0, $changeMonth, $lastMonthDayCount, $changeYear)));
                endif;
            else :
                if ('Sunday' == date('l', mktime(0, 0, 0, $changeMonth, $lastMonthDayCount, $changeYear))) :
                    $finalDay = date('j', mktime(0, 0, 0, $changeMonth, $lastMonthDayCount, $changeYear));
                else :
                    $finalDay = date('j', strtotime('last Sunday', mktime(0, 0, 0, $changeMonth, $lastMonthDayCount, $changeYear)));
                endif;
            endif;


            for ($i = $finalDay; $i <= $lastMonthDayCount; $i++):

                $date = date("Y/n/d", strtotime($changeYear . '/' . $changeMonth . '/' . $i));

                $dayDate = "";
                if ($i >= 1 && $i <= 9) {
                    $dayDate = "0$i";
                } else {
                    $dayDate = $i;
                }

                $date1 = "";
                switch ($format) {
                    case 1:
                        $date1 = $dayDate . "/" . $changeMonth . "/" . $changeYear;
                        break;
                    case 2:
                        $date1 = $changeYear . "/" . $changeMonth . "/" . $dayDate;
                        break;
                    case 3:
                        $date1 = $changeMonth . "/" . $dayDate . "/" . $changeYear;
                        break;
                    default:
                        $date1 = $dayDate . "/" . $changeMonth . "/" . $changeYear;
                        break;
                }

                $monthName = date('F', strtotime($date));
                $eventCount = self::countSharedEvents($i, $changeMonth, $changeYear, $ownerId);
                $isEvent = 0;
                if ($eventCount == 0) {
                    $isEvent = 0;
                } else {
                    $isEvent = 1;
                }

                $isToday = 0;
                if (strtotime($today) == strtotime($date)):
                    $isToday = 1;
                else:
                    $isToday = 0;
                endif;

                $shortDayName = date("D", strtotime($changeYear . "/" . $changeMonth . "/" . $i));
                $isSat = 0;
                $isSun = 0;
                if (strtolower($shortDayName) == "sat") {
                    $isSat = 1;
                } else if (strtolower($shortDayName) == "sun") {
                    $isSun = 1;
                }
                $events = self::getSharedCalendarEvents(array('day' => $i, 'month' => $changeMonth, 'year' => $changeYear, 'owner_id' => $ownerId));
                $result['dates'][$rowno][$elementno] = array('status' => -1, 'date' => $date1, 'day' => $i, 'monthNumber' => $changeMonth, 'monthTitle' => $monthName, 'year' => $changeYear, 'isEvent' => $isEvent, 'eventCount' => $eventCount, 'events' => $events, 'isToday' => $isToday, 'isSat' => $isSat, 'isSun' => $isSun);
                if ($elementno == 6) {
                    $rowno++;
                    $elementno = 0;
                } else {
                    $elementno++;
                }

            endfor;

        endif;

        /* Selected Month */

        for ($i = 1; $i <= $dayCount; $i++):

            $date = date("Y/n/d", strtotime($year . '/' . $month . '/' . $i));

            $dayDate = "";
            if ($i >= 1 && $i <= 9) {
                $dayDate = "0$i";
            } else {
                $dayDate = $i;
            }

            $date1 = "";
            switch ($format) {
                case 1:
                    $date1 = $dayDate . "/" . $month . "/" . $year;
                    break;
                case 2:
                    $date1 = $year . "/" . $month . "/" . $dayDate;
                    break;
                case 3:
                    $date1 = $month . "/" . $dayDate . "/" . $year;
                    break;
                default:
                    $date1 = $dayDate . "/" . $month . "/" . $year;
                    break;
            }

            $monthName = date('F', strtotime($date));
            $eventCount = self::countSharedEvents($i, $month, $year, $ownerId);

            $isEvent = 0;
            if ($eventCount == 0) {
                $isEvent = 0;
            } else {
                $isEvent = 1;
            }

            $isToday = 0;
            if (strtotime($today) == strtotime($date)):
                $isToday = 1;
            else:
                $isToday = 0;
            endif;

            $shortDayName = date("D", strtotime($year . "/" . $month . "/" . $i));
            $isSat = 0;
            $isSun = 0;
            if (strtolower($shortDayName) == "sat") {
                $isSat = 1;
            } else if (strtolower($shortDayName) == "sun") {
                $isSun = 1;
            }
            $events = self::getSharedCalendarEvents(array('day' => $i, 'month' => $month, 'year' => $year, 'owner_id' => $ownerId));
            $result['dates'][$rowno][$elementno] = array('status' => 0, 'date' => $date1, 'day' => $i, 'monthNumber' => $month, 'monthTitle' => $monthName, 'year' => $year, 'isEvent' => $isEvent, 'eventCount' => $eventCount, 'events' => $events, 'isToday' => $isToday, 'isSat' => $isSat, 'isSun' => $isSun);
            if ($elementno == 6) {
                $rowno++;
                $elementno = 0;
            } else {
                $elementno++;
            }
        endfor;

        /* Next Month */
        $lastDay = date('N', mktime(0, 0, 0, $month, $dayCount, $year));

        if (($firstDayOfWeek == 'Monday' && $lastDay != 7) || ($firstDayOfWeek == 'Sunday' && $lastDay != 1)) :

            if ($firstDayOfWeek == 'Monday') :
                if ('Sunday' == date('l', mktime(0, 0, 0, $changeMonthNext, 1, $changeYearNext))) :
                    $firstDay = date('j', mktime(0, 0, 0, $changeMonthNext, 1, $changeYearNext));
                else :
                    $firstDay = date('j', strtotime('first Sunday', mktime(0, 0, 0, $changeMonthNext, 1, $changeYearNext)));
                endif;
            else :
                if ('Saturday' == date('l', mktime(0, 0, 0, $changeMonthNext, 1, $changeYearNext))) :
                    $firstDay = date('j', mktime(0, 0, 0, $changeMonthNext, 1, $changeYearNext));
                else :
                    $firstDay = date('j', strtotime('first Saturday', mktime(0, 0, 0, $changeMonthNext, 1, $changeYearNext)));
                endif;
            endif;

            for ($i = 1; $i <= $firstDay; $i++):

                $date = date("Y/n/d", strtotime($changeYearNext . '/' . $changeMonthNext . '/' . $i));


                $dayDate = "";
                if ($i >= 1 && $i <= 9) {
                    $dayDate = "0$i";
                } else {
                    $dayDate = $i;
                }

                $date1 = "";
                switch ($format) {
                    case 1:
                        $date1 = $dayDate . "/" . $changeMonthNext . "/" . $changeYearNext;
                        break;
                    case 2:
                        $date1 = $changeYearNext . "/" . $changeMonthNext . "/" . $dayDate;
                        break;
                    case 3:
                        $date1 = $changeMonthNext . "/" . $dayDate . "/" . $changeYearNext;
                        break;
                    default:
                        $date1 = $dayDate . "/" . $changeMonthNext . "/" . $changeYearNext;
                        break;
                }

                $monthName = date('F', strtotime($date));
                $eventCount = self::countSharedEvents($i, $changeMonthNext, $changeYearNext, $ownerId);

                $isEvent = 0;
                if ($eventCount == 0) {
                    $isEvent = 0;
                } else {
                    $isEvent = 1;
                }

                $isToday = 0;
                if (strtotime($today) == strtotime($date)):
                    $isToday = 1;
                else:
                    $isToday = 0;
                endif;

                $shortDayName = date("D", strtotime($changeYearNext . "/" . $changeMonthNext . "/" . $i));
                $isSat = 0;
                $isSun = 0;
                if (strtolower($shortDayName) == "sat") {
                    $isSat = 1;
                } else if (strtolower($shortDayName) == "sun") {
                    $isSun = 1;
                }
                $events = self::getSharedCalendarEvents(array('day' => $i, 'month' => $changeMonthNext, 'year' => $changeYearNext, 'owner_id' => $ownerId));
                $result['dates'][$rowno][$elementno] = array('status' => 1, 'date' => $date1, 'day' => $i, 'monthNumber' => $changeMonthNext, 'monthTitle' => $monthName, 'year' => $changeYearNext, 'isEvent' => $isEvent, 'eventCount' => $eventCount, 'events' => $events, 'isToday' => $isToday, 'isSat' => $isSat, 'isSun' => $isSun);
                if ($elementno == 6) {
                    $rowno++;
                    $elementno = 0;
                } else {
                    $elementno++;
                }
            endfor;

        endif;

        return $result;
    }

    function getSharedCalendarEvents($attr)
    {

        $this->objGeneral->mysql_clean($attr);
        $day = isset($attr['day']) ? $attr['day'] : date('j');
        $month = isset($attr['month']) ? $attr['month'] : date('n');
        $year = isset($attr['year']) ? $attr['year'] : date('Y');
        $OwnerId = isset($attr['owner_id']) ? $attr['owner_id'] : '';

        $Sql = "SELECT * FROM calendar_event WHERE ($day BETWEEN from_day AND to_day) AND ($month BETWEEN from_month AND to_month) AND ($year BETWEEN from_year AND to_year) AND user_id = $OwnerId  ORDER BY from_time ASC";
        $RS = $this->Conn->Execute($Sql);

        if ($RS->RecordCount() == 0) {
            $results['isEvent'] = 0;
        } else {
            $results['isEvent'] = 1;
            $results['eventsNum'] = "$total";
            $results['events'] = array();
            $x = 0;
            $format = 1;
            while ($row = $RS->FetchRow()) {
                $x++;
                $from = str_split($row['from_time'], 2);
                $from_hr = $from[0];
                if ($from_hr >= 12) {
                    if ($from_hr > 12) {
                        $from_hr = ($from_hr - 12) . ' :';
                    } else {
                        $from_hr = $from_hr . ' :';
                    }
                    $dial_from = 'PM';
                } else {
                    $from_hr = $from_hr . ' :';
                    $dial_from = 'AM';
                }

                $from_min = $from[1] . " " . $dial_from;

                $to = str_split($row['to_time'], 2);
                $to_hr = $to[0];
                if ($to_hr >= 12) {
                    if ($to_hr > 12) {
                        $to_hr = ($to_hr - 12) . ' :';
                    } else {
                        $to_hr = $to_hr . ' :';
                    }
                    $dial_to = 'PM';
                } else {
                    $to_hr = $to_hr . ' :';
                    $dial_to = 'AM';
                }
                $to_min = $to[1] . " " . $dial_to;


                $fromDay = $row['from_day'];
                $fromMonth = $row['from_month'];
                $fromYear = $row['from_year'];
                $eventFromDate = "";
                switch ($format) {
                    case 1:
                        $eventFromDate = $fromDay . "/" . $fromMonth . "/" . $fromYear;
                        break;
                    case 2:
                        $eventFromDate = $fromYear . "/" . $fromMonth . "/" . $fromDay;
                        break;
                    case 3:
                        $eventFromDate = $fromMonth . "/" . $fromDay . "/" . $fromYear;
                        break;
                    default:
                        $eventFromDate = $fromDay . "/" . $fromMonth . "/" . $fromYear;
                        break;
                }

                $toDay = $row['to_day'];
                $toMonth = $row['to_month'];
                $toYear = $row['to_year'];
                $eventToDate = "";
                switch ($format) {
                    case 1:
                        $eventToDate = $toDay . "/" . $toMonth . "/" . $toYear;
                        break;
                    case 2:
                        $eventToDate = $toYear . "/" . $toMonth . "/" . $toDay;
                        break;
                    case 3:
                        $eventToDate = $toMonth . "/" . $toDay . "/" . $toYear;
                        break;
                    default:
                        $eventToDate = $toDay . "/" . $toMonth . "/" . $toYear;
                        break;
                }

                $inviteEmails = self::getEventInviteEmails(array('eventId' => $row['id']));

                $SqlRemind = "SELECT * FROM event_reminder WHERE event_id = " . $row['id'];
                $RSRemind = $this->Conn->Execute($SqlRemind);
                $notificationType = "";
                $remind = "";
                $daysOrWeeks = "";
                $hours = "";
                $minutes = "";
                if ($RSRemind->RecordCount() > 0) {

                    while ($row2 = $RSRemind->FetchRow()) {

                        $notificationType = stripslashes($row2['notificationType']);
                        $remind = stripslashes($row2['remind']);
                        $daysOrWeeks = stripslashes($row2['daysOrWeeks']);
                        $hours = stripslashes($row2['hours']);
                        $minutes = stripslashes($row2['minutes']);
                    }
                }

                $SqlAttach = "SELECT * FROM event_attachments WHERE event_id = " . $row['id'];
                $RSAttach = $this->Conn->Execute($SqlAttach);
                $name = "";
                $newname = "";

                $attachedFiles = array();
                $i = 0;
                if ($RSAttach->RecordCount() > 0) {
                    while ($row3 = $RSAttach->FetchRow()) {
                        $attachedFiles[$i] = array('id' => $row3['id'], 'name' => $row3['name'], 'newname' => $row3['newname']);
                        $i++;
                    }
                }

                $SqlReoccurance = "SELECT * FROM calendar_event_reoccurrance WHERE event_id = " . $row['id'];
                $RSReoccurance = $this->Conn->Execute($SqlReoccurance);
                $repeats = "";
                $repeat_every = "";
                $repeat_on_mon = "";
                $repeat_on_tue = "";
                $repeat_on_wed = "";
                $repeat_on_thu = "";
                $repeat_on_fri = "";
                $repeat_on_sat = "";
                $repeat_on_sun = "";
                $repeat_by = "";
                $start_on = "";
                $ends = "";
                $ends_after = "";
                $ends_on = "";
                $summary = "";
                if ($RSReoccurance->RecordCount() > 0) {

                    while ($row2 = $RSReoccurance->FetchRow()) {
                        $repeats = stripslashes($row2['repeats']);
                        $repeat_every = stripslashes($row2['repeat_every']);
                        $repeat_on_mon = stripslashes($row2['repeat_on_mon']);
                        $repeat_on_tue = stripslashes($row2['repeat_on_tue']);
                        $repeat_on_wed = stripslashes($row2['repeat_on_wed']);
                        $repeat_on_thu = stripslashes($row2['repeat_on_thu']);
                        $repeat_on_fri = stripslashes($row2['repeat_on_fri']);
                        $repeat_on_sat = stripslashes($row2['repeat_on_sat']);
                        $repeat_on_sun = stripslashes($row2['repeat_on_sun']);
                        $repeat_by = stripslashes($row2['repeat_by']);
                        $start_on = stripslashes($row2['start_on']);
                        $ends = stripslashes($row2['ends']);
                        $ends_after = stripslashes($row2['ends_after']);
                        $ends_on = stripslashes($row2['ends_on']);
                        $summary = stripslashes($row2['summary']);
                    }
                }

                $results['events'][$x - 1] = array('id' => $row['id'], 'eventNumber' => $x, 'title' => stripslashes($row['event']), 'fromDate' => $eventFromDate,
                    'toDate' => $eventToDate, 'fromTime' => $from_hr . " " . $from_min, 'toTime' => $to_hr . " " . $to_min,
                    'content' => stripslashes($row['description']), 'inviteEmails' => $inviteEmails, 'location' => stripslashes($row['location']), 'allDay' => stripslashes($row['allday']),
                    'eventcolor' => stripslashes($row['eventcolor']), 'showMeAs' => stripslashes($row['showmeas']),
                    'reoccurance' => stripslashes($row['reoccurrance']), 'notificationType' => $notificationType, 'remind' => $remind,
                    'daysOrWeeks' => $daysOrWeeks, 'hours' => $hours, 'minutes' => $minutes, 'attachedFiles' => $attachedFiles, 'repeats' => $repeats,
                    'repeat_every' => $repeat_every, 'repeat_on_mon' => $repeat_on_mon, 'repeat_on_tue' => $repeat_on_tue, 'repeat_on_wed' => $repeat_on_wed,
                    'repeat_on_thu' => $repeat_on_thu, 'repeat_on_fri' => $repeat_on_fri, 'repeat_on_sat' => $repeat_on_sat, 'repeat_on_sun' => $repeat_on_sun,
                    'repeat_by' => $repeat_by, 'start_on' => $start_on, 'ends' => $ends, 'ends_after' => $ends_after, 'ends_on' => $ends_on, 'summary' => $summary);
            }
        }

        return $results;
    }

    function get_events($attr)
    {
        return; // removing table event_attachments from db as it is not being used
        $this->objGeneral->mysql_clean($attr);
        $day = isset($attr['day']) ? $attr['day'] : date('j');
        $month = isset($attr['month']) ? $attr['month'] : date('n');
        $year = isset($attr['year']) ? $attr['year'] : date('Y');

        $UserId = $this->arrUser['id'];

        $Sql = "SELECT * FROM calendar_event WHERE ($day BETWEEN from_day AND to_day) AND ($month BETWEEN from_month AND to_month) AND ($year BETWEEN from_year AND to_year) AND user_id = $UserId  ORDER BY from_time ASC";
        $RS = $this->Conn->Execute($Sql);

        if ($RS->RecordCount() == 0) {
            $results['isEvent'] = 0;
        } else {
            $results['isEvent'] = 1;
            $results['eventsNum'] = "$total";
            $results['events'] = array();
            $x = 0;
            $format = 1;
            while ($row = $RS->FetchRow()) {
                $x++;
                $from = str_split($row['from_time'], 2);
                $from_hr = $from[0];
                if ($from_hr >= 12) {
                    if ($from_hr > 12) {
                        $from_hr = ($from_hr - 12) . ' :';
                    } else {
                        $from_hr = $from_hr . ' :';
                    }
                    $dial_from = 'PM';
                } else {
                    $from_hr = $from_hr . ' :';
                    $dial_from = 'AM';
                }

                $from_min = $from[1] . " " . $dial_from;

                $to = str_split($row['to_time'], 2);
                $to_hr = $to[0];
                if ($to_hr >= 12) {
                    if ($to_hr > 12) {
                        $to_hr = ($to_hr - 12) . ' :';
                    } else {
                        $to_hr = $to_hr . ' :';
                    }
                    $dial_to = 'PM';
                } else {
                    $to_hr = $to_hr . ' :';
                    $dial_to = 'AM';
                }
                $to_min = $to[1] . " " . $dial_to;


                $fromDay = $row['from_day'];
                $fromMonth = $row['from_month'];
                $fromYear = $row['from_year'];
                $eventFromDate = "";
                switch ($format) {
                    case 1:
                        $eventFromDate = $fromDay . "/" . $fromMonth . "/" . $fromYear;
                        break;
                    case 2:
                        $eventFromDate = $fromYear . "/" . $fromMonth . "/" . $fromDay;
                        break;
                    case 3:
                        $eventFromDate = $fromMonth . "/" . $fromDay . "/" . $fromYear;
                        break;
                    default:
                        $eventFromDate = $fromDay . "/" . $fromMonth . "/" . $fromYear;
                        break;
                }

                $toDay = $row['to_day'];
                $toMonth = $row['to_month'];
                $toYear = $row['to_year'];
                $eventToDate = "";
                switch ($format) {
                    case 1:
                        $eventToDate = $toDay . "/" . $toMonth . "/" . $toYear;
                        break;
                    case 2:
                        $eventToDate = $toYear . "/" . $toMonth . "/" . $toDay;
                        break;
                    case 3:
                        $eventToDate = $toMonth . "/" . $toDay . "/" . $toYear;
                        break;
                    default:
                        $eventToDate = $toDay . "/" . $toMonth . "/" . $toYear;
                        break;
                }

                $inviteEmails = self::getEventInviteEmails(array('eventId' => $row['id']));

                $SqlRemind = "SELECT * FROM event_reminder WHERE event_id = " . $row['id'];
                $RSRemind = $this->Conn->Execute($SqlRemind);
                $notificationType = "";
                $remind = "";
                $daysOrWeeks = "";
                $hours = "";
                $minutes = "";
                if ($RSRemind->RecordCount() > 0) {

                    while ($row2 = $RSRemind->FetchRow()) {

                        $notificationType = stripslashes($row2['notificationType']);
                        $remind = stripslashes($row2['remind']);
                        $daysOrWeeks = stripslashes($row2['daysOrWeeks']);
                        $hours = stripslashes($row2['hours']);
                        $minutes = stripslashes($row2['minutes']);
                    }
                }

                $SqlAttach = "SELECT * FROM event_attachments WHERE event_id = " . $row['id'];
                $RSAttach = $this->Conn->Execute($SqlAttach);
                $name = "";
                $newname = "";

                $attachedFiles = array();
                $i = 0;
                if ($RSAttach->RecordCount() > 0) {
                    while ($row3 = $RSAttach->FetchRow()) {
                        $attachedFiles[$i] = array('id' => $row3['id'], 'name' => $row3['name'], 'newname' => $row3['newname']);
                        $i++;
                    }
                }

                $SqlReoccurance = "SELECT * FROM calendar_event_reoccurrance WHERE event_id = " . $row['id'];
                $RSReoccurance = $this->Conn->Execute($SqlReoccurance);
                $repeats = "";
                $repeat_every = "";
                $repeat_on_mon = "";
                $repeat_on_tue = "";
                $repeat_on_wed = "";
                $repeat_on_thu = "";
                $repeat_on_fri = "";
                $repeat_on_sat = "";
                $repeat_on_sun = "";
                $repeat_by = "";
                $start_on = "";
                $ends = "";
                $ends_after = "";
                $ends_on = "";
                $summary = "";
                if ($RSReoccurance->RecordCount() > 0) {

                    while ($row2 = $RSReoccurance->FetchRow()) {
                        $repeats = stripslashes($row2['repeats']);
                        $repeat_every = stripslashes($row2['repeat_every']);
                        $repeat_on_mon = stripslashes($row2['repeat_on_mon']);
                        $repeat_on_tue = stripslashes($row2['repeat_on_tue']);
                        $repeat_on_wed = stripslashes($row2['repeat_on_wed']);
                        $repeat_on_thu = stripslashes($row2['repeat_on_thu']);
                        $repeat_on_fri = stripslashes($row2['repeat_on_fri']);
                        $repeat_on_sat = stripslashes($row2['repeat_on_sat']);
                        $repeat_on_sun = stripslashes($row2['repeat_on_sun']);
                        $repeat_by = stripslashes($row2['repeat_by']);
                        $start_on = stripslashes($row2['start_on']);
                        $ends = stripslashes($row2['ends']);
                        $ends_after = stripslashes($row2['ends_after']);
                        $ends_on = stripslashes($row2['ends_on']);
                        $summary = stripslashes($row2['summary']);
                    }
                }

                $results['events'][$x - 1] = array('id' => $row['id'], 'eventNumber' => $x, 'title' => stripslashes($row['event']), 'fromDate' => $eventFromDate,
                    'toDate' => $eventToDate, 'fromTime' => $from_hr . " " . $from_min, 'toTime' => $to_hr . " " . $to_min,
                    'content' => stripslashes($row['description']), 'inviteEmails' => $inviteEmails, 'location' => stripslashes($row['location']), 'allDay' => stripslashes($row['allday']),
                    'eventcolor' => stripslashes($row['eventcolor']), 'showMeAs' => stripslashes($row['showmeas']),
                    'reoccurance' => stripslashes($row['reoccurrance']), 'notificationType' => $notificationType, 'remind' => $remind,
                    'daysOrWeeks' => $daysOrWeeks, 'hours' => $hours, 'minutes' => $minutes, 'attachedFiles' => $attachedFiles, 'repeats' => $repeats,
                    'repeat_every' => $repeat_every, 'repeat_on_mon' => $repeat_on_mon, 'repeat_on_tue' => $repeat_on_tue, 'repeat_on_wed' => $repeat_on_wed,
                    'repeat_on_thu' => $repeat_on_thu, 'repeat_on_fri' => $repeat_on_fri, 'repeat_on_sat' => $repeat_on_sat, 'repeat_on_sun' => $repeat_on_sun,
                    'repeat_by' => $repeat_by, 'start_on' => $start_on, 'ends' => $ends, 'ends_after' => $ends_after, 'ends_on' => $ends_on, 'summary' => $summary);
            }
        }

        return $results;
    }

    function getDayEvents($attr)
    {

        $this->objGeneral->mysql_clean($attr);
        $day = (isset($attr['day']) && $attr['day'] != "") ? $attr['day'] : date('j');
        $month = (isset($attr['month']) && $attr['month'] != "") ? $attr['month'] : date('n');
        $year = (isset($attr['year']) && $attr['year'] != "") ? $attr['year'] : date('Y');

        $UserId = $this->arrUser['id'];

        $time = array();
        $time[0] = array('from' => '0000', 'to' => '0030');
        $time[1] = array('from' => '0031', 'to' => '0059');
        $time[2] = array('from' => '0101', 'to' => '0130');
        $time[3] = array('from' => '0131', 'to' => '0159');
        $time[4] = array('from' => '0201', 'to' => '0230');
        $time[5] = array('from' => '0231', 'to' => '0259');
        $time[6] = array('from' => '0301', 'to' => '0330');
        $time[7] = array('from' => '0331', 'to' => '0359');
        $time[8] = array('from' => '0401', 'to' => '0430');
        $time[9] = array('from' => '0431', 'to' => '0459');
        $time[10] = array('from' => '0501', 'to' => '0530');
        $time[11] = array('from' => '0531', 'to' => '0559');
        $time[12] = array('from' => '0601', 'to' => '0630');
        $time[13] = array('from' => '0631', 'to' => '0659');
        $time[14] = array('from' => '0701', 'to' => '0730');
        $time[15] = array('from' => '0731', 'to' => '0759');
        $time[16] = array('from' => '0801', 'to' => '0830');
        $time[17] = array('from' => '0831', 'to' => '0859');
        $time[18] = array('from' => '0901', 'to' => '0930');
        $time[19] = array('from' => '0931', 'to' => '0959');
        $time[20] = array('from' => '1001', 'to' => '1030');
        $time[21] = array('from' => '1031', 'to' => '1059');
        $time[22] = array('from' => '1101', 'to' => '1130');
        $time[23] = array('from' => '1131', 'to' => '1159');
        $time[24] = array('from' => '1201', 'to' => '1230');
        $time[25] = array('from' => '1231', 'to' => '1259');
        $time[26] = array('from' => '1301', 'to' => '1330');
        $time[27] = array('from' => '1331', 'to' => '1359');
        $time[28] = array('from' => '1401', 'to' => '1430');
        $time[29] = array('from' => '1431', 'to' => '1459');
        $time[30] = array('from' => '1501', 'to' => '1530');
        $time[31] = array('from' => '1531', 'to' => '1559');
        $time[32] = array('from' => '1601', 'to' => '1630');
        $time[33] = array('from' => '1631', 'to' => '1659');
        $time[34] = array('from' => '1701', 'to' => '1730');
        $time[35] = array('from' => '1731', 'to' => '1759');
        $time[36] = array('from' => '1801', 'to' => '1830');
        $time[37] = array('from' => '1831', 'to' => '1859');
        $time[38] = array('from' => '1901', 'to' => '1930');
        $time[39] = array('from' => '1931', 'to' => '1959');
        $time[40] = array('from' => '2001', 'to' => '2030');
        $time[41] = array('from' => '2031', 'to' => '2059');
        $time[42] = array('from' => '2101', 'to' => '2130');
        $time[43] = array('from' => '2131', 'to' => '2159');
        $time[44] = array('from' => '2201', 'to' => '2230');
        $time[45] = array('from' => '2231', 'to' => '2259');
        $time[46] = array('from' => '2301', 'to' => '2330');
        $time[47] = array('from' => '2331', 'to' => '2359');

        $results['E0000'] = array();
        $results['E0000']['events'] = array();
        $results['E0031'] = array();
        $results['E0031']['events'] = array();
        $results['E0101'] = array();
        $results['E0101']['events'] = array();
        $results['E0131'] = array();
        $results['E0131']['events'] = array();
        $results['E0201'] = array();
        $results['E0201']['events'] = array();
        $results['E0231'] = array();
        $results['E0231']['events'] = array();
        $results['E0301'] = array();
        $results['E0301']['events'] = array();
        $results['E0331'] = array();
        $results['E0331']['events'] = array();
        $results['E0401'] = array();
        $results['E0401']['events'] = array();
        $results['E0431'] = array();
        $results['E0431']['events'] = array();
        $results['E0501'] = array();
        $results['E0501']['events'] = array();
        $results['E0531'] = array();
        $results['E0531']['events'] = array();
        $results['E0601'] = array();
        $results['E0601']['events'] = array();
        $results['E0631'] = array();
        $results['E0631']['events'] = array();
        $results['E0701'] = array();
        $results['E0701']['events'] = array();
        $results['E0731'] = array();
        $results['E0731']['events'] = array();
        $results['E0801'] = array();
        $results['E0801']['events'] = array();
        $results['E0831'] = array();
        $results['E0831']['events'] = array();
        $results['E0901'] = array();
        $results['E0901']['events'] = array();
        $results['E0931'] = array();
        $results['E0931']['events'] = array();
        $results['E1001'] = array();
        $results['E1001']['events'] = array();
        $results['E1031'] = array();
        $results['E1031']['events'] = array();
        $results['E1101'] = array();
        $results['E1101']['events'] = array();
        $results['E1131'] = array();
        $results['E1131']['events'] = array();
        $results['E1201'] = array();
        $results['E1201']['events'] = array();
        $results['E1231'] = array();
        $results['E1231']['events'] = array();
        $results['E1301'] = array();
        $results['E1301']['events'] = array();
        $results['E1331'] = array();
        $results['E1331']['events'] = array();
        $results['E1401'] = array();
        $results['E1401']['events'] = array();
        $results['E1431'] = array();
        $results['E1431']['events'] = array();
        $results['E1501'] = array();
        $results['E1501']['events'] = array();
        $results['E1531'] = array();
        $results['E1531']['events'] = array();
        $results['E1601'] = array();
        $results['E1601']['events'] = array();
        $results['E1631'] = array();
        $results['E1631']['events'] = array();
        $results['E1701'] = array();
        $results['E1701']['events'] = array();
        $results['E1731'] = array();
        $results['E1731']['events'] = array();
        $results['E1801'] = array();
        $results['E1801']['events'] = array();
        $results['E1831'] = array();
        $results['E1831']['events'] = array();
        $results['E1901'] = array();
        $results['E1901']['events'] = array();
        $results['E1931'] = array();
        $results['E1931']['events'] = array();
        $results['E2001'] = array();
        $results['E2001']['events'] = array();
        $results['E2031'] = array();
        $results['E2031']['events'] = array();
        $results['E2101'] = array();
        $results['E2101']['events'] = array();
        $results['E2131'] = array();
        $results['E2131']['events'] = array();
        $results['E2201'] = array();
        $results['E2201']['events'] = array();
        $results['E2231'] = array();
        $results['E2231']['events'] = array();
        $results['E2301'] = array();
        $results['E2301']['events'] = array();
        $results['E2331'] = array();
        $results['E2331']['events'] = array();


        for ($i = 0; $i < 48; $i++) {

            $fromTime = $time[$i]['from'];
            $toTime = $time[$i]['to'];

            $Sql = "SELECT * FROM calendar_event WHERE ($day BETWEEN from_day AND to_day) AND ($month BETWEEN from_month AND to_month) AND "
                . "($year BETWEEN from_year AND to_year) AND (('$fromTime' BETWEEN from_time AND to_time) || ('$toTime' BETWEEN from_time AND to_time)) "
                . " AND user_id = $UserId  ORDER BY from_time ASC";
            $RS = $this->Conn->Execute($Sql);

            $fromTime1 = "E$fromTime";
            if ($RS->RecordCount() == 0) {

                $results[$fromTime1]['isEvent'] = 0;
            } else {
                $results[$fromTime1]['isEvent'] = 1;

                $results[$fromTime1]['total'] = $Total;
                $x = 0;
                $format = 1;
                while ($row = $RS->FetchRow()) {

                    $from = str_split($row['from_time'], 2);
                    $from_hr = $from[0];
                    if ($from_hr >= 12) {
                        if ($from_hr > 12) {
                            $from_hr = ($from_hr - 12) . ' :';
                        } else {
                            $from_hr = $from_hr . ' :';
                        }
                        $dial_from = 'PM';
                    } else {
                        $from_hr = $from_hr . ' :';
                        $dial_from = 'AM';
                    }

                    $from_min = $from[1] . " " . $dial_from;

                    $to = str_split($row['to_time'], 2);
                    $to_hr = $to[0];
                    if ($to_hr >= 12) {
                        if ($to_hr > 12) {
                            $to_hr = ($to_hr - 12) . ' :';
                        } else {
                            $to_hr = $to_hr . ' :';
                        }
                        $dial_to = 'PM';
                    } else {
                        $to_hr = $to_hr . ' :';
                        $dial_to = 'AM';
                    }
                    $to_min = $to[1] . " " . $dial_to;


                    $fromDay = $row['from_day'];
                    $fromMonth = $row['from_month'];
                    $fromYear = $row['from_year'];
                    $eventFromDate = "";
                    switch ($format) {
                        case 1:
                            $eventFromDate = $fromDay . "/" . $fromMonth . "/" . $fromYear;
                            break;
                        case 2:
                            $eventFromDate = $fromYear . "/" . $fromMonth . "/" . $fromDay;
                            break;
                        case 3:
                            $eventFromDate = $fromMonth . "/" . $fromDay . "/" . $fromYear;
                            break;
                        default:
                            $eventFromDate = $fromDay . "/" . $fromMonth . "/" . $fromYear;
                            break;
                    }

                    $toDay = $row['to_day'];
                    $toMonth = $row['to_month'];
                    $toYear = $row['to_year'];
                    $eventToDate = "";
                    switch ($format) {
                        case 1:
                            $eventToDate = $toDay . "/" . $toMonth . "/" . $toYear;
                            break;
                        case 2:
                            $eventToDate = $toYear . "/" . $toMonth . "/" . $toDay;
                            break;
                        case 3:
                            $eventToDate = $toMonth . "/" . $toDay . "/" . $toYear;
                            break;
                        default:
                            $eventToDate = $toDay . "/" . $toMonth . "/" . $toYear;
                            break;
                    }
                    $isEventFlag = 0;
                    foreach ($results as $resulttimes) {
                        foreach ($resulttimes['events'] as $resultEvent) {
                            if ($resultEvent['id'] == $row['id']) {
                                $isEventFlag = 1;
                                break;
                            }
                        }
                    }
                    if ($isEventFlag) {
                        $results[$fromTime1]['events'][$x] = array('id' => $row['id'], 'title' => '...', 'title1' => stripslashes($row['event']), 'fromDate' => $eventFromDate,
                            'toDate' => $eventToDate, 'fromTime' => $from_hr . " " . $from_min, 'toTime' => $to_hr . " " . $to_min,
                            'content' => stripslashes($row['description']), 'eventcolor' => stripslashes($row['eventcolor']), 'location' => $row['location']);
                    } else {
                        $results[$fromTime1]['events'][$x] = array('id' => $row['id'], 'title' => stripslashes($row['event']), 'title1' => stripslashes($row['event']), 'fromDate' => $eventFromDate,
                            'toDate' => $eventToDate, 'fromTime' => $from_hr . " " . $from_min, 'toTime' => $to_hr . " " . $to_min,
                            'content' => stripslashes($row['description']), 'eventcolor' => stripslashes($row['eventcolor']), 'location' => $row['location']);
                    }

                    $x++;
                }
            }
        }

        return $results;
    }

    function getEventById($attr)
    {
        return; // removing table event_attachments from db as it is not being used
        $this->objGeneral->mysql_clean($attr);
        $id = isset($attr['id']) ? $attr['id'] : 0;

        $Sql = "SELECT * FROM calendar_event WHERE id = $id";
        $RS = $this->Conn->Execute($Sql);

        if ($RS->RecordCount() == 0) {
            $results['isEvent'] = 0;
        } else {
            $results['isEvent'] = 1;
            $results['event'] = array();
            $format = 1;
            while ($row = $RS->FetchRow()) {
                $from = str_split($row['from_time'], 2);
                $from_hr = $from[0];
                if ($from_hr >= 12) {
                    if ($from_hr > 12) {
                        $from_hr = '0' . ($from_hr - 12) . ' :';
                    } else {
                        $from_hr = $from_hr . ' :';
                    }
                    $dial_from = 'PM';
                } else {
                    $from_hr = $from_hr . ' :';
                    $dial_from = 'AM';
                }
                $from_min = $from[1] . " " . $dial_from;

                if ($row['to_time'] == '2359') {
                    $to_hr = "11 :";
                    $dial_to = 'PM';
                    $to_min = "30 " . $dial_to;
                } else {
                    $to = str_split($row['to_time'], 2);
                    $to_hr = $to[0];
                    if ($to_hr >= 12) {
                        if ($to_hr > 12) {
                            $to_hr = '0' . ($to_hr - 12) . ' :';
                        } else {
                            $to_hr = $to_hr . ' :';
                        }
                        $dial_to = 'PM';
                    } else {
                        $to_hr = $to_hr . ' :';
                        $dial_to = 'AM';
                    }
                    $to_min = $to[1] . " " . $dial_to;
                }

                $fromDay = $row['from_day'];
                if ($row['from_day'] >= 0 && $row['from_day'] <= 9) {
                    $fromDay = "0" . $row['from_day'];
                }

                $fromMonth = $row['from_month'];
                if ($row['from_month'] >= 0 && $row['from_month'] <= 9) {
                    $fromMonth = "0" . $row['from_month'];
                }

                $fromYear = $row['from_year'];
                $eventFromDate = "";
                switch ($format) {
                    case 1:
                        $eventFromDate = $fromDay . "/" . $fromMonth . "/" . $fromYear;
                        break;
                    case 2:
                        $eventFromDate = $fromYear . "/" . $fromMonth . "/" . $fromDay;
                        break;
                    case 3:
                        $eventFromDate = $fromMonth . "/" . $fromDay . "/" . $fromYear;
                        break;
                    default:
                        $eventFromDate = $fromDay . "/" . $fromMonth . "/" . $fromYear;
                        break;
                }

                $toDay = $row['to_day'];
                if ($row['to_day'] >= 0 && $row['to_day'] <= 9) {
                    $toDay = "0" . $row['to_day'];
                }
                $toMonth = $row['to_month'];
                if ($row['to_month'] >= 0 && $row['to_month'] <= 9) {
                    $toMonth = "0" . $row['to_month'];
                }
                $toYear = $row['to_year'];
                $eventToDate = "";
                switch ($format) {
                    case 1:
                        $eventToDate = $toDay . "/" . $toMonth . "/" . $toYear;
                        break;
                    case 2:
                        $eventToDate = $toYear . "/" . $toMonth . "/" . $toDay;
                        break;
                    case 3:
                        $eventToDate = $toMonth . "/" . $toDay . "/" . $toYear;
                        break;
                    default:
                        $eventToDate = $toDay . "/" . $toMonth . "/" . $toYear;
                        break;
                }

                $inviteEmails = self::getEventInviteEmails(array('eventId' => $id));

                $SqlRemind = "SELECT * FROM event_reminder WHERE event_id = $id";
                $RSRemind = $this->Conn->Execute($SqlRemind);
                $notificationType = "";
                $remind = "";
                $daysOrWeeks = "";
                $hours = "";
                $minutes = "";
                if ($RSRemind->RecordCount() > 0) {

                    while ($row2 = $RSRemind->FetchRow()) {

                        $notificationType = stripslashes($row2['notificationType']);
                        $remind = stripslashes($row2['remind']);
                        $daysOrWeeks = stripslashes($row2['daysOrWeeks']);
                        $hours = stripslashes($row2['hours']);
                        $minutes = stripslashes($row2['minutes']);
                    }
                }

                $SqlAttach = "SELECT * FROM event_attachments WHERE event_id = $id";
                $RSAttach = $this->Conn->Execute($SqlAttach);
                $name = "";
                $newname = "";

                $attachedFiles = array();
                $i = 0;
                if ($RSAttach->RecordCount() > 0) {
                    while ($row3 = $RSAttach->FetchRow()) {
                        $attachedFiles[$i] = array('id' => $row3['id'], 'name' => $row3['name'], 'newname' => $row3['newname']);
                        $i++;
                    }
                }

                $SqlReoccurance = "SELECT * FROM calendar_event_reoccurrance WHERE event_id = $id";
                $RSReoccurance = $this->Conn->Execute($SqlReoccurance);
                $repeats = "";
                $repeat_every = "";
                $repeat_on_mon = "";
                $repeat_on_tue = "";
                $repeat_on_wed = "";
                $repeat_on_thu = "";
                $repeat_on_fri = "";
                $repeat_on_sat = "";
                $repeat_on_sun = "";
                $repeat_by = "";
                $start_on = "";
                $ends = "";
                $ends_after = "";
                $ends_on = "";
                $summary = "";
                if ($RSReoccurance->RecordCount() > 0) {

                    while ($row2 = $RSReoccurance->FetchRow()) {
                        $repeats = stripslashes($row2['repeats']);
                        $repeat_every = stripslashes($row2['repeat_every']);
                        $repeat_on_mon = stripslashes($row2['repeat_on_mon']);
                        $repeat_on_tue = stripslashes($row2['repeat_on_tue']);
                        $repeat_on_wed = stripslashes($row2['repeat_on_wed']);
                        $repeat_on_thu = stripslashes($row2['repeat_on_thu']);
                        $repeat_on_fri = stripslashes($row2['repeat_on_fri']);
                        $repeat_on_sat = stripslashes($row2['repeat_on_sat']);
                        $repeat_on_sun = stripslashes($row2['repeat_on_sun']);
                        $repeat_by = stripslashes($row2['repeat_by']);
                        $start_on = stripslashes($row2['start_on']);
                        $ends = stripslashes($row2['ends']);
                        $ends_after = stripslashes($row2['ends_after']);
                        $ends_on = stripslashes($row2['ends_on']);
                        $summary = stripslashes($row2['summary']);
                    }
                }


                $results['event'] = array('id' => $row['id'], 'title' => stripslashes($row['event']), 'fromDate' => $eventFromDate, 'toDate' => $eventToDate,
                    'fromTime' => $from_hr . " " . $from_min, 'toTime' => $to_hr . " " . $to_min, 'content' => stripslashes($row['description']),
                    'inviteEmails' => $inviteEmails, 'location' => stripslashes($row['location']), 'allDay' => stripslashes($row['allday']),
                    'eventcolor' => stripslashes($row['eventcolor']), 'showMeAs' => stripslashes($row['showmeas']),
                    'reoccurance' => stripslashes($row['reoccurrance']), 'notificationType' => $notificationType, 'remind' => $remind,
                    'daysOrWeeks' => $daysOrWeeks, 'hours' => $hours, 'minutes' => $minutes, 'attachedFiles' => $attachedFiles, 'repeats' => $repeats,
                    'repeat_every' => $repeat_every, 'repeat_on_mon' => $repeat_on_mon, 'repeat_on_tue' => $repeat_on_tue, 'repeat_on_wed' => $repeat_on_wed,
                    'repeat_on_thu' => $repeat_on_thu, 'repeat_on_fri' => $repeat_on_fri, 'repeat_on_sat' => $repeat_on_sat, 'repeat_on_sun' => $repeat_on_sun,
                    'repeat_by' => $repeat_by, 'start_on' => $start_on, 'ends' => $ends, 'ends_after' => $ends_after, 'ends_on' => $ends_on, 'summary' => $summary);
            }
        }

        return $results;
    }

    function getEventInviteEmails($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $eventId = (isset($attr['eventId'])) ? trim(stripslashes(strip_tags($attr['eventId']))) : '';
        $inviteEmails = "";
        $Sql = "SELECT * FROM event_invitors WHERE event_id = $eventId";
        $RS = $this->Conn->Execute($Sql);
        $results = "";
        if ($RS->RecordCount() > 0) {

            while ($row = $RS->FetchRow()) {
                $inviteEmails .= $row['email'] . "; ";
            }
        }
        $results = $inviteEmails;
        return $results;
    }

    function getMonthCalendar($attr)
    {

        $this->objGeneral->mysql_clean($attr);
        $firstDayOfWeek = 'Monday';
        $type = CAL_GREGORIAN;
        $month = (isset($attr['month'])) ? trim(stripslashes(strip_tags($attr['month']))) : '';
        $year = (isset($attr['year'])) ? trim(stripslashes(strip_tags($attr['year']))) : '';
        $users = $this->arrUser['id'];
        if (!$month || !is_numeric($month))
            $month = date('n');
        if (!$year || !is_numeric($year))
            $year = date('Y');
        $today = date('Y/n/d');
        $dayCount = cal_days_in_month($type, $month, $year);

        $lastMonth = $month - 1;
        $nextMonth = $month + 1;

        $lastYear = $year - 1;
        $nextYear = $year + 1;

        $changeYear = "";
        $changeMonth = "";

        if ($month == 12):
            $changeYear = $year;
            $changeMonth = $lastMonth;
        elseif ($month == 1):
            $changeYear = $lastYear;
            $changeMonth = '12';
        else:
            $changeYear = $year;
            $changeMonth = $lastMonth;
        endif;

        $changeYearNext = "";
        $changeMonthNext = "";

        if ($month == 1):
            $changeYearNext = $year;
            $changeMonthNext = $nextMonth;
        elseif ($month == 12):
            $changeYearNext = $nextYear;
            $changeMonthNext = '1';
        else:
            $changeYearNext = $year;
            $changeMonthNext = $nextMonth;
        endif;


        $result['selectedMonthInfo'] = array('monthNumber' => $month, 'monthTitle' => date('F', mktime(0, 0, 0, $month, 1)), 'monthSubTitle' => date('M', mktime(0, 0, 0, $month, 1)), 'year' => $year);
        $result['previousMonthInfo'] = array('monthNumber' => $changeMonth, 'year' => $changeYear);
        $result['nextMonthInfo'] = array('monthNumber' => $changeMonthNext, 'year' => $changeYearNext);
        $result['dates'] = array();

        $format = 1;

        /* Previous Month */

        $firstDay = date('N', mktime(0, 0, 0, $month, 1, $year));
        $rowno = 0;
        $elementno = 0;
        if (($firstDayOfWeek == 'Monday' && $firstDay != 1) || ($firstDayOfWeek == 'Sunday' && $firstDay != 7)) :

            $lastMonthDayCount = cal_days_in_month($type, $changeMonth, $changeYear);

            if ($firstDayOfWeek == 'Monday') :
                if ('Monday' == date('l', mktime(0, 0, 0, $changeMonth, $lastMonthDayCount, $changeYear))) :
                    $finalDay = date('j', mktime(0, 0, 0, $changeMonth, $lastMonthDayCount, $changeYear));
                else :
                    $finalDay = date('j', strtotime('last Monday', mktime(0, 0, 0, $changeMonth, $lastMonthDayCount, $changeYear)));
                endif;
            else :
                if ('Sunday' == date('l', mktime(0, 0, 0, $changeMonth, $lastMonthDayCount, $changeYear))) :
                    $finalDay = date('j', mktime(0, 0, 0, $changeMonth, $lastMonthDayCount, $changeYear));
                else :
                    $finalDay = date('j', strtotime('last Sunday', mktime(0, 0, 0, $changeMonth, $lastMonthDayCount, $changeYear)));
                endif;
            endif;


            for ($i = $finalDay; $i <= $lastMonthDayCount; $i++):

                $date = date("Y/n/d", strtotime($changeYear . '/' . $changeMonth . '/' . $i));

                $dayDate = "";
                if ($i >= 1 && $i <= 9) {
                    $dayDate = "0$i";
                } else {
                    $dayDate = $i;
                }

                $changeMonth1 = "";
                if ($changeMonth >= 0 && $changeMonth <= 9) {
                    $changeMonth1 = "0$changeMonth";
                } else {
                    $changeMonth1 = $changeMonth;
                }

                $date1 = "";
                switch ($format) {
                    case 1:
                        $date1 = $dayDate . "/" . $changeMonth1 . "/" . $changeYear;
                        break;
                    case 2:
                        $date1 = $changeYear . "/" . $changeMonth1 . "/" . $dayDate;
                        break;
                    case 3:
                        $date1 = $changeMonth1 . "/" . $dayDate . "/" . $changeYear;
                        break;
                    default:
                        $date1 = $dayDate . "/" . $changeMonth1 . "/" . $changeYear;
                        break;
                }

                $monthName = date('F', strtotime($date));
                $eventCount = self::countEvents($i, $changeMonth, $changeYear, $users);
                $isEvent = 0;
                if ($eventCount == 0) {
                    $isEvent = 0;
                } else {
                    $isEvent = 1;
                }

                $isToday = 0;
                if (strtotime($today) == strtotime($date)):
                    $isToday = 1;
                else:
                    $isToday = 0;
                endif;

                $shortDayName = date("D", strtotime($changeYear . "/" . $changeMonth . "/" . $i));
                $isSat = 0;
                $isSun = 0;
                if (strtolower($shortDayName) == "sat") {
                    $isSat = 1;
                } else if (strtolower($shortDayName) == "sun") {
                    $isSun = 1;
                }
                $events = self::get_events(array('day' => $i, 'month' => $changeMonth, 'year' => $changeYear));
                $AllDay = 0;
                $AllDayColor = "";
                foreach ($events['events'] as $event) {
                    if ($event['allDay'] == 1) {
                        $AllDay = 1;
                        $AllDayColor = $event['eventcolor'];
                        break;
                    }
                }
                $result['dates'][$rowno][$elementno] = array('allDay' => $AllDay, 'color' => $AllDayColor, 'status' => -1, 'date' => $date1, 'day' => $i, 'monthNumber' => $changeMonth, 'monthTitle' => $monthName, 'year' => $changeYear, 'isEvent' => $isEvent, 'eventCount' => $eventCount, 'events' => $events, 'isToday' => $isToday, 'isSat' => $isSat, 'isSun' => $isSun);
                if ($elementno == 6) {
                    $rowno++;
                    $elementno = 0;
                } else {
                    $elementno++;
                }

            endfor;

        endif;

        /* Selected Month */

        for ($i = 1; $i <= $dayCount; $i++):

            $date = date("Y/n/d", strtotime($year . '/' . $month . '/' . $i));

            $dayDate = "";
            if ($i >= 1 && $i <= 9) {
                $dayDate = "0$i";
            } else {
                $dayDate = $i;
            }

            $month1 = "";
            if ($month >= 0 && $month <= 9) {
                $month1 = "0$month";
            } else {
                $month1 = $month;
            }
            $date1 = "";
            switch ($format) {
                case 1:
                    $date1 = $dayDate . "/" . $month1 . "/" . $year;
                    break;
                case 2:
                    $date1 = $year . "/" . $month1 . "/" . $dayDate;
                    break;
                case 3:
                    $date1 = $month1 . "/" . $dayDate . "/" . $year;
                    break;
                default:
                    $date1 = $dayDate . "/" . $month1 . "/" . $year;
                    break;
            }

            $monthName = date('F', strtotime($date));
            $eventCount = self::countEvents($i, $month, $year, $users);

            $isEvent = 0;
            if ($eventCount == 0) {
                $isEvent = 0;
            } else {
                $isEvent = 1;
            }

            $isToday = 0;
            if (strtotime($today) == strtotime($date)):
                $isToday = 1;
            else:
                $isToday = 0;
            endif;

            $shortDayName = date("D", strtotime($year . "/" . $month . "/" . $i));
            $isSat = 0;
            $isSun = 0;
            if (strtolower($shortDayName) == "sat") {
                $isSat = 1;
            } else if (strtolower($shortDayName) == "sun") {
                $isSun = 1;
            }
            $events = self::get_events(array('day' => $i, 'month' => $month, 'year' => $year));
            $AllDay = 0;
            $AllDayColor = "";
            foreach ($events['events'] as $event) {
                if ($event['allDay'] == 1) {
                    $AllDay = 1;
                    $AllDayColor = $event['eventcolor'];
                    break;
                }
            }
            $result['dates'][$rowno][$elementno] = array('allDay' => $AllDay, 'color' => $AllDayColor, 'status' => 0, 'date' => $date1, 'day' => $i, 'monthNumber' => $month, 'monthTitle' => $monthName, 'year' => $year, 'isEvent' => $isEvent, 'eventCount' => $eventCount, 'events' => $events, 'isToday' => $isToday, 'isSat' => $isSat, 'isSun' => $isSun);
            if ($elementno == 6) {
                $rowno++;
                $elementno = 0;
            } else {
                $elementno++;
            }
        endfor;

        /* Next Month */
        $lastDay = date('N', mktime(0, 0, 0, $month, $dayCount, $year));

        if (($firstDayOfWeek == 'Monday' && $lastDay != 7) || ($firstDayOfWeek == 'Sunday' && $lastDay != 1)) :

            if ($firstDayOfWeek == 'Monday') :
                if ('Sunday' == date('l', mktime(0, 0, 0, $changeMonthNext, 1, $changeYearNext))) :
                    $firstDay = date('j', mktime(0, 0, 0, $changeMonthNext, 1, $changeYearNext));
                else :
                    $firstDay = date('j', strtotime('first Sunday', mktime(0, 0, 0, $changeMonthNext, 1, $changeYearNext)));
                endif;
            else :
                if ('Saturday' == date('l', mktime(0, 0, 0, $changeMonthNext, 1, $changeYearNext))) :
                    $firstDay = date('j', mktime(0, 0, 0, $changeMonthNext, 1, $changeYearNext));
                else :
                    $firstDay = date('j', strtotime('first Saturday', mktime(0, 0, 0, $changeMonthNext, 1, $changeYearNext)));
                endif;
            endif;

            for ($i = 1; $i <= $firstDay; $i++):

                $date = date("Y/n/d", strtotime($changeYearNext . '/' . $changeMonthNext . '/' . $i));


                $dayDate = "";
                if ($i >= 1 && $i <= 9) {
                    $dayDate = "0$i";
                } else {
                    $dayDate = $i;
                }

                $changeMonthNext1 = "";
                if ($changeMonthNext >= 0 && $changeMonthNext <= 9) {
                    $changeMonthNext1 = "0$changeMonthNext";
                } else {
                    $changeMonthNext1 = $changeMonthNext;
                }
                $date1 = "";
                switch ($format) {
                    case 1:
                        $date1 = $dayDate . "/" . $changeMonthNext1 . "/" . $changeYearNext;
                        break;
                    case 2:
                        $date1 = $changeYearNext . "/" . $changeMonthNext1 . "/" . $dayDate;
                        break;
                    case 3:
                        $date1 = $changeMonthNext1 . "/" . $dayDate . "/" . $changeYearNext;
                        break;
                    default:
                        $date1 = $dayDate . "/" . $changeMonthNext1 . "/" . $changeYearNext;
                        break;
                }

                $monthName = date('F', strtotime($date));
                $eventCount = self::countEvents($i, $changeMonthNext, $changeYearNext, $users);

                $isEvent = 0;
                if ($eventCount == 0) {
                    $isEvent = 0;
                } else {
                    $isEvent = 1;
                }

                $isToday = 0;
                if (strtotime($today) == strtotime($date)):
                    $isToday = 1;
                else:
                    $isToday = 0;
                endif;

                $shortDayName = date("D", strtotime($changeYearNext . "/" . $changeMonthNext . "/" . $i));
                $isSat = 0;
                $isSun = 0;
                if (strtolower($shortDayName) == "sat") {
                    $isSat = 1;
                } else if (strtolower($shortDayName) == "sun") {
                    $isSun = 1;
                }
                $events = self::get_events(array('day' => $i, 'month' => $changeMonthNext, 'year' => $changeYearNext));
                $AllDay = 0;
                $AllDayColor = "";
                foreach ($events['events'] as $event) {
                    if ($event['allDay'] == 1) {
                        $AllDay = 1;
                        $AllDayColor = $event['eventcolor'];
                        break;
                    }
                }
                $result['dates'][$rowno][$elementno] = array('allDay' => $AllDay, 'color' => $AllDayColor, 'status' => 1, 'date' => $date1, 'day' => $i, 'monthNumber' => $changeMonthNext, 'monthTitle' => $monthName, 'year' => $changeYearNext, 'isEvent' => $isEvent, 'eventCount' => $eventCount, 'events' => $events, 'isToday' => $isToday, 'isSat' => $isSat, 'isSun' => $isSun);
                if ($elementno == 6) {
                    $rowno++;
                    $elementno = 0;
                } else {
                    $elementno++;
                }
            endfor;

        endif;

        return $result;
    }

    function getWeekCalendar($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $week = (isset($attr['week'])) ? trim(stripslashes(strip_tags($attr['week']))) : '';
        $year = (isset($attr['year'])) ? trim(stripslashes(strip_tags($attr['year']))) : '';

        if (!$week || !is_numeric($week))
            $week = date("W");

        if (!$year || !is_numeric($year))
            $year = date('Y');


        $lastWeekOfYear = new DateTime('December 31th, ' . $year);
        $timestampForMonday = "";
        if ($week == $lastWeekOfYear->format('W')) {
            $timestamp = mktime(0, 0, 0, 1, 1, $year) + (($week - 1) * 7 * 24 * 60 * 60);
            $timestampForMonday = $timestamp - 86400 * (date('N', $timestamp) - 1);
        } else if ($week == 1) {
            $timestamp = mktime(0, 0, 0, 1, 1, $year) + (($week) * 7 * 24 * 60 * 60);
            $timestampForMonday = $timestamp - 86400 * (date('N', $timestamp) - 1);
        } else {
            $timestamp = mktime(0, 0, 0, 1, 1, $year) + (($week) * 7 * 24 * 60 * 60);
            $timestampForMonday = $timestamp - 86400 * (date('N', $timestamp) - 1);
        }

        $currentDate = date("Y-m-d");

        $firstDayOfWeek = date("Y-m-d", $timestampForMonday);
        $firstDayOfWeek1 = date("Y-m-d", $timestampForMonday);
        $firstDateOfWeek = explode("-", $firstDayOfWeek);

        $isMonToday = 0;
        if ($currentDate == $firstDayOfWeek1) {
            $isMonToday = 1;
        }

        $result['monday']['events'] = self::getDayEvents(array('day' => $firstDateOfWeek[2], 'month' => $firstDateOfWeek[1], 'year' => $firstDateOfWeek[0]));
        $result['monday']['year'] = $firstDateOfWeek[0];
        $result['monday']['month'] = $firstDateOfWeek[1];
        $result['monday']['day'] = $firstDateOfWeek[2];
        $result['monday']['isToday'] = $isMonToday;

        $secondDayOfWeek = date("Y-m-d", strtotime($firstDayOfWeek . " +1 day"));
        $secondDateOfWeek = explode("-", $secondDayOfWeek);

        $isTueToday = 0;
        if ($currentDate == $secondDayOfWeek) {
            $isTueToday = 1;
        }

        $result['tuesday']['events'] = self::getDayEvents(array('day' => $secondDateOfWeek[2], 'month' => $secondDateOfWeek[1], 'year' => $secondDateOfWeek[0]));
        $result['tuesday']['year'] = $secondDateOfWeek[0];
        $result['tuesday']['month'] = $secondDateOfWeek[1];
        $result['tuesday']['day'] = $secondDateOfWeek[2];
        $result['tuesday']['isToday'] = $isTueToday;

        $thirdDayOfWeek = date("Y-m-d", strtotime($firstDayOfWeek . " +2 day"));
        $thirdDateOfWeek = explode("-", $thirdDayOfWeek);

        $isWedToday = 0;
        if ($currentDate == $thirdDayOfWeek) {
            $isWedToday = 1;
        }

        $result['wednesday']['events'] = self::getDayEvents(array('day' => $thirdDateOfWeek[2], 'month' => $thirdDateOfWeek[1], 'year' => $thirdDateOfWeek[0]));
        $result['wednesday']['year'] = $thirdDateOfWeek[0];
        $result['wednesday']['month'] = $thirdDateOfWeek[1];
        $result['wednesday']['day'] = $thirdDateOfWeek[2];
        $result['wednesday']['isToday'] = $isWedToday;

        $fourthDayOfWeek = date("Y-m-d", strtotime($firstDayOfWeek . " +3 day"));
        $fourthDateOfWeek = explode("-", $fourthDayOfWeek);

        $isThuToday = 0;
        if ($currentDate == $fourthDayOfWeek) {
            $isThuToday = 1;
        }

        $result['thursday']['events'] = self::getDayEvents(array('day' => $fourthDateOfWeek[2], 'month' => $fourthDateOfWeek[1], 'year' => $fourthDateOfWeek[0]));
        $result['thursday']['year'] = $fourthDateOfWeek[0];
        $result['thursday']['month'] = $fourthDateOfWeek[1];
        $result['thursday']['day'] = $fourthDateOfWeek[2];
        $result['thursday']['isToday'] = $isThuToday;

        $fifthDayOfWeek = date("Y-m-d", strtotime($firstDayOfWeek . " +4 day"));
        $fifthDateOfWeek = explode("-", $fifthDayOfWeek);

        $isFriToday = 0;
        if ($currentDate == $fifthDayOfWeek) {
            $isFriToday = 1;
        }

        $result['friday']['events'] = self::getDayEvents(array('day' => $fifthDateOfWeek[2], 'month' => $fifthDateOfWeek[1], 'year' => $fifthDateOfWeek[0]));
        $result['friday']['year'] = $fifthDateOfWeek[0];
        $result['friday']['month'] = $fifthDateOfWeek[1];
        $result['friday']['day'] = $fifthDateOfWeek[2];
        $result['friday']['isToday'] = $isFriToday;

        $sixthDayOfWeek = date("Y-m-d", strtotime($firstDayOfWeek . " +5 day"));
        $sixthDateOfWeek = explode("-", $sixthDayOfWeek);

        $isSatToday = 0;
        if ($currentDate == $sixthDayOfWeek) {
            $isSatToday = 1;
        }

        $result['saturday']['events'] = self::getDayEvents(array('day' => $sixthDateOfWeek[2], 'month' => $sixthDateOfWeek[1], 'year' => $sixthDateOfWeek[0]));
        $result['saturday']['year'] = $sixthDateOfWeek[0];
        $result['saturday']['month'] = $sixthDateOfWeek[1];
        $result['saturday']['day'] = $sixthDateOfWeek[2];
        $result['saturday']['isToday'] = $isSatToday;

        $seventhDayOfWeek = date("Y-m-d", strtotime($firstDayOfWeek . " +6 day"));
        $seventhDateOfWeek = explode("-", $seventhDayOfWeek);

        $isSunToday = 0;
        if ($currentDate == $seventhDayOfWeek) {
            $isSunToday = 1;
        }

        $result['sunday']['events'] = self::getDayEvents(array('day' => $seventhDateOfWeek[2], 'month' => $seventhDateOfWeek[1], 'year' => $seventhDateOfWeek[0]));
        $result['sunday']['year'] = $seventhDateOfWeek[0];
        $result['sunday']['month'] = $seventhDateOfWeek[1];
        $result['sunday']['day'] = $seventhDateOfWeek[2];
        $result['sunday']['isToday'] = $isSunToday;


        $currentWeekTitle = "";
        if ($firstDateOfWeek[0] == $seventhDateOfWeek[0]) {
            if ($firstDateOfWeek[1] == $seventhDateOfWeek[1]) {
                $currentWeekTitle = date('M', strtotime($firstDayOfWeek)) . " " . $firstDateOfWeek[2] . " - " . $seventhDateOfWeek[2] . ", " . $firstDateOfWeek[0];
            } else if ($firstDateOfWeek[1] != $seventhDateOfWeek[1]) {
                $currentWeekTitle = date('M', strtotime($firstDayOfWeek)) . " " . $firstDateOfWeek[2] . " - " . date('M', strtotime($seventhDayOfWeek)) . " " . $seventhDateOfWeek[2] . ", " . $firstDateOfWeek[0];
            }
        } else if ($firstDateOfWeek[0] != $seventhDateOfWeek[0]) {
            $currentWeekTitle = date('M', strtotime($firstDayOfWeek)) . " " . $firstDateOfWeek[2] . ", " . $firstDateOfWeek[0] . " - " . date('M', strtotime($seventhDayOfWeek)) . " " . $seventhDateOfWeek[2] . ", " . $seventhDateOfWeek[0];
        }

        $result['current'] = array('title' => $currentWeekTitle, 'year' => $year, 'week' => $week);
        if ($week == 1) {
            $previousWeekYear = $year - 1;
            $dt = new DateTime('December 31th, ' . $previousWeekYear);
            $previousWeek = $dt->format('W');
        } else {
            $previousWeek = $week - 1;
            $previousWeekYear = $year;
        }

        $lastWeekOfYear = new DateTime('December 31th, ' . $year);
        if ($week == $lastWeekOfYear->format('W')) {
            $nextWeek = 1;
            $nextWeekYear = $year + 1;
        } else {
            $nextWeek = $week + 1;
            $nextWeekYear = $year;
        }
        $result['last'] = array('week' => $week, 'last' => $lastWeekOfYear->format('W'));
        $result['previous'] = array('week' => $previousWeek, 'year' => $previousWeekYear);
        $result['next'] = array('week' => $nextWeek, 'year' => $nextWeekYear);

        return $result;
    }

    function getDayCalendar($attr)
    {

        $this->objGeneral->mysql_clean($attr);

        $day = (isset($attr['day'])) ? trim(stripslashes(strip_tags($attr['day']))) : '';
        $month = (isset($attr['month'])) ? trim(stripslashes(strip_tags($attr['month']))) : '';
        $year = (isset($attr['year'])) ? trim(stripslashes(strip_tags($attr['year']))) : '';

        if (!$day || !is_numeric($day))
            $day = date("d");

        if (!$month || !is_numeric($month))
            $month = date("m");

        if (!$year || !is_numeric($year))
            $year = date('Y');

        $result['events'] = self::getDayEvents(array('day' => $day, 'month' => $month, 'year' => $year));

        $selectedDate = date("Y-m-d", strtotime("$year-$month-$day"));

        $previousDate = date("Y-m-d", strtotime($selectedDate . " -1 day"));
        $previous = explode("-", $previousDate);
        $result['previous'] = array('date' => $previousDate, 'day' => $previous[2], 'month' => $previous[1], 'year' => $previous[0]);

        $nextDate = date("Y-m-d", strtotime($selectedDate . " +1 day"));
        $next = explode("-", $nextDate);
        $result['next'] = array('date' => $nextDate, 'day' => $next[2], 'month' => $next[1], 'year' => $next[0]);

        $currentDate = date("Y-m-d");
        $isToday = 0;
        if ($currentDate == "$year-$month-$day") {
            $isToday = 1;
        }
        $day1 = $day;
        if ($day >= 0 && $day <= 9) {
            $day1 = "0" . $day;
        }
        $month1 = $month;
        if ($month >= 0 && $month <= 9 && strlen($month) == 1) {
            $month1 = "0" . $month;
        }
        $currentDayTitle = date('l', strtotime($selectedDate)) . ", " . date('M', strtotime($selectedDate)) . " $day, " . $year;
        $result['current'] = array('isToday' => $isToday, 'title' => $currentDayTitle, 'day' => $day1, 'dayName' => date('l', strtotime($selectedDate)), 'month' => $month1, 'year' => $year);

        return $result;
    }

    function getYearCalendar($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $year = (isset($attr['year'])) ? trim(stripslashes(strip_tags($attr['year']))) : '';
        $month = (isset($attr['month'])) ? trim(stripslashes(strip_tags($attr['month']))) : '';

        if (!$year || !is_numeric($year))
            $year = date('Y');

        if (!$month || !is_numeric($month))
            $month = date("m");

        $result = array();


        if (($month - 1) == 0) $previousMonth = 12;
        else  $previousMonth = $month - 1;

        if (($month + 1) == 13) $nextMonth = 1;
        else  $nextMonth = $month + 1;

        $nextYear = $year;

        $monthCalendar = self::getMonthCalendar(array('month' => $previousMonth, 'year' => $year - 1));
        $result['months'][0]['selectedMonthInfo'] = $monthCalendar['selectedMonthInfo'];
        if (date("m") == $month) $result['months'][0]['selectedMonthInfo']['currentMonth'] = 1;
        else  $result['months'][0]['selectedMonthInfo']['currentMonth'] = 0;

        $result['months'][0]['dates'] = $monthCalendar['dates'];

        $monthCalendar = self::getMonthCalendar(array('month' => 1, 'year' => $year));
        $result['months'][1]['selectedMonthInfo'] = $monthCalendar['selectedMonthInfo'];
        if (date("m") == $month)
            $result['months'][1]['selectedMonthInfo']['currentMonth'] = 1;
        else
            $result['months'][1]['selectedMonthInfo']['currentMonth'] = 0;

        $result['months'][1]['dates'] = $monthCalendar['dates'];

        $monthCalendar = self::getMonthCalendar(array('month' => 2, 'year' => $year));
        $result['months'][2]['selectedMonthInfo'] = $monthCalendar['selectedMonthInfo'];
        if (date("m") == $month) $result['months'][2]['selectedMonthInfo']['currentMonth'] = 1;
        else
            $result['months'][2]['selectedMonthInfo']['currentMonth'] = 0;

        $result['months'][2]['dates'] = $monthCalendar['dates'];

        $result['currentMonthInfo'] = array('month' => $month, 'year' => $year);
        $result['previousMonthInfo'] = array('month' => $previousMonth, 'year' => $previousYear);
        $result['nextMonthInfo'] = array('month' => $nextMonth, 'year' => $nextYear);

        return $result;
        exit;


        if ($month == 1) {
            $previousMonth = 10;
            $previousYear = $year - 1;
            $nextMonth = 4;
            $nextYear = $year;

            $monthCalendar = self::getMonthCalendar(array('month' => 12, 'year' => $year - 1));
            $result['months'][0]['selectedMonthInfo'] = $monthCalendar['selectedMonthInfo'];
            if (date("m") == 12) {
                $result['months'][0]['selectedMonthInfo']['currentMonth'] = 1;
            } else {
                $result['months'][0]['selectedMonthInfo']['currentMonth'] = 0;
            }
            $result['months'][0]['dates'] = $monthCalendar['dates'];

            $monthCalendar = self::getMonthCalendar(array('month' => 1, 'year' => $year));
            $result['months'][1]['selectedMonthInfo'] = $monthCalendar['selectedMonthInfo'];
            if (date("m") == 1) {
                $result['months'][1]['selectedMonthInfo']['currentMonth'] = 1;
            } else {
                $result['months'][1]['selectedMonthInfo']['currentMonth'] = 0;
            }
            $result['months'][1]['dates'] = $monthCalendar['dates'];

            $monthCalendar = self::getMonthCalendar(array('month' => 2, 'year' => $year));
            $result['months'][2]['selectedMonthInfo'] = $monthCalendar['selectedMonthInfo'];
            if (date("m") == 2) {
                $result['months'][2]['selectedMonthInfo']['currentMonth'] = 1;
            } else {
                $result['months'][2]['selectedMonthInfo']['currentMonth'] = 0;
            }
            $result['months'][2]['dates'] = $monthCalendar['dates'];
        } else if ($month == 2) {
            $previousMonth = 11;
            $previousYear = $year - 1;
            $nextMonth = 5;
            $nextYear = $year;

            $monthCalendar = self::getMonthCalendar(array('month' => 1, 'year' => $year));
            $result['months'][0]['selectedMonthInfo'] = $monthCalendar['selectedMonthInfo'];
            if (date("m") == 1) {
                $result['months'][0]['selectedMonthInfo']['currentMonth'] = 1;
            } else {
                $result['months'][0]['selectedMonthInfo']['currentMonth'] = 0;
            }
            $result['months'][0]['dates'] = $monthCalendar['dates'];

            $monthCalendar = self::getMonthCalendar(array('month' => 2, 'year' => $year));
            $result['months'][1]['selectedMonthInfo'] = $monthCalendar['selectedMonthInfo'];
            if (date("m") == 2) {
                $result['months'][1]['selectedMonthInfo']['currentMonth'] = 1;
            } else {
                $result['months'][1]['selectedMonthInfo']['currentMonth'] = 0;
            }
            $result['months'][1]['dates'] = $monthCalendar['dates'];

            $monthCalendar = self::getMonthCalendar(array('month' => 3, 'year' => $year));
            $result['months'][2]['selectedMonthInfo'] = $monthCalendar['selectedMonthInfo'];
            if (date("m") == 3) {
                $result['months'][2]['selectedMonthInfo']['currentMonth'] = 1;
            } else {
                $result['months'][2]['selectedMonthInfo']['currentMonth'] = 0;
            }
            $result['months'][2]['dates'] = $monthCalendar['dates'];
        } else if ($month == 3) {
            $previousMonth = 12;
            $previousYear = $year - 1;
            $nextMonth = 6;
            $nextYear = $year;

            $monthCalendar = self::getMonthCalendar(array('month' => 2, 'year' => $year));
            $result['months'][0]['selectedMonthInfo'] = $monthCalendar['selectedMonthInfo'];
            if (date("m") == 2) {
                $result['months'][0]['selectedMonthInfo']['currentMonth'] = 1;
            } else {
                $result['months'][0]['selectedMonthInfo']['currentMonth'] = 0;
            }
            $result['months'][0]['dates'] = $monthCalendar['dates'];

            $monthCalendar = self::getMonthCalendar(array('month' => 3, 'year' => $year));
            $result['months'][1]['selectedMonthInfo'] = $monthCalendar['selectedMonthInfo'];
            if (date("m") == 3) {
                $result['months'][1]['selectedMonthInfo']['currentMonth'] = 1;
            } else {
                $result['months'][1]['selectedMonthInfo']['currentMonth'] = 0;
            }
            $result['months'][1]['dates'] = $monthCalendar['dates'];

            $monthCalendar = self::getMonthCalendar(array('month' => 4, 'year' => $year));
            $result['months'][2]['selectedMonthInfo'] = $monthCalendar['selectedMonthInfo'];
            if (date("m") == 4) {
                $result['months'][2]['selectedMonthInfo']['currentMonth'] = 1;
            } else {
                $result['months'][2]['selectedMonthInfo']['currentMonth'] = 0;
            }
            $result['months'][2]['dates'] = $monthCalendar['dates'];
        } else if ($month == 4) {
            $previousMonth = 1;
            $previousYear = $year;
            $nextMonth = 7;
            $nextYear = $year;

            $monthCalendar = self::getMonthCalendar(array('month' => 3, 'year' => $year));
            $result['months'][0]['selectedMonthInfo'] = $monthCalendar['selectedMonthInfo'];
            if (date("m") == 3) {
                $result['months'][0]['selectedMonthInfo']['currentMonth'] = 1;
            } else {
                $result['months'][0]['selectedMonthInfo']['currentMonth'] = 0;
            }
            $result['months'][0]['dates'] = $monthCalendar['dates'];

            $monthCalendar = self::getMonthCalendar(array('month' => 4, 'year' => $year));
            $result['months'][1]['selectedMonthInfo'] = $monthCalendar['selectedMonthInfo'];
            if (date("m") == 4) {
                $result['months'][1]['selectedMonthInfo']['currentMonth'] = 1;
            } else {
                $result['months'][1]['selectedMonthInfo']['currentMonth'] = 0;
            }
            $result['months'][1]['dates'] = $monthCalendar['dates'];

            $monthCalendar = self::getMonthCalendar(array('month' => 5, 'year' => $year));
            $result['months'][2]['selectedMonthInfo'] = $monthCalendar['selectedMonthInfo'];
            if (date("m") == 5) {
                $result['months'][2]['selectedMonthInfo']['currentMonth'] = 1;
            } else {
                $result['months'][2]['selectedMonthInfo']['currentMonth'] = 0;
            }
            $result['months'][2]['dates'] = $monthCalendar['dates'];
        } else if ($month == 5) {
            $previousMonth = 2;
            $previousYear = $year;
            $nextMonth = 8;
            $nextYear = $year;

            $monthCalendar = self::getMonthCalendar(array('month' => 4, 'year' => $year));
            $result['months'][0]['selectedMonthInfo'] = $monthCalendar['selectedMonthInfo'];
            if (date("m") == 4) {
                $result['months'][0]['selectedMonthInfo']['currentMonth'] = 1;
            } else {
                $result['months'][0]['selectedMonthInfo']['currentMonth'] = 0;
            }
            $result['months'][0]['dates'] = $monthCalendar['dates'];

            $monthCalendar = self::getMonthCalendar(array('month' => 5, 'year' => $year));
            $result['months'][1]['selectedMonthInfo'] = $monthCalendar['selectedMonthInfo'];
            if (date("m") == 5) {
                $result['months'][1]['selectedMonthInfo']['currentMonth'] = 1;
            } else {
                $result['months'][1]['selectedMonthInfo']['currentMonth'] = 0;
            }
            $result['months'][1]['dates'] = $monthCalendar['dates'];

            $monthCalendar = self::getMonthCalendar(array('month' => 6, 'year' => $year));
            $result['months'][2]['selectedMonthInfo'] = $monthCalendar['selectedMonthInfo'];
            if (date("m") == 6) {
                $result['months'][2]['selectedMonthInfo']['currentMonth'] = 1;
            } else {
                $result['months'][2]['selectedMonthInfo']['currentMonth'] = 0;
            }
            $result['months'][2]['dates'] = $monthCalendar['dates'];
        } else if ($month == 6) {
            $previousMonth = 3;
            $previousYear = $year;
            $nextMonth = 9;
            $nextYear = $year;

            $monthCalendar = self::getMonthCalendar(array('month' => 5, 'year' => $year));
            $result['months'][0]['selectedMonthInfo'] = $monthCalendar['selectedMonthInfo'];
            if (date("m") == 5) {
                $result['months'][0]['selectedMonthInfo']['currentMonth'] = 1;
            } else {
                $result['months'][0]['selectedMonthInfo']['currentMonth'] = 0;
            }
            $result['months'][0]['dates'] = $monthCalendar['dates'];

            $monthCalendar = self::getMonthCalendar(array('month' => 6, 'year' => $year));
            $result['months'][1]['selectedMonthInfo'] = $monthCalendar['selectedMonthInfo'];
            if (date("m") == 6) {
                $result['months'][1]['selectedMonthInfo']['currentMonth'] = 1;
            } else {
                $result['months'][1]['selectedMonthInfo']['currentMonth'] = 0;
            }
            $result['months'][1]['dates'] = $monthCalendar['dates'];

            $monthCalendar = self::getMonthCalendar(array('month' => 7, 'year' => $year));
            $result['months'][2]['selectedMonthInfo'] = $monthCalendar['selectedMonthInfo'];
            if (date("m") == 7) {
                $result['months'][2]['selectedMonthInfo']['currentMonth'] = 1;
            } else {
                $result['months'][2]['selectedMonthInfo']['currentMonth'] = 0;
            }
            $result['months'][2]['dates'] = $monthCalendar['dates'];
        } else if ($month == 7) {
            $previousMonth = 4;
            $previousYear = $year;
            $nextMonth = 10;
            $nextYear = $year;

            $monthCalendar = self::getMonthCalendar(array('month' => 6, 'year' => $year));
            $result['months'][0]['selectedMonthInfo'] = $monthCalendar['selectedMonthInfo'];
            if (date("m") == 6) {
                $result['months'][0]['selectedMonthInfo']['currentMonth'] = 1;
            } else {
                $result['months'][0]['selectedMonthInfo']['currentMonth'] = 0;
            }
            $result['months'][0]['dates'] = $monthCalendar['dates'];

            $monthCalendar = self::getMonthCalendar(array('month' => 7, 'year' => $year));
            $result['months'][1]['selectedMonthInfo'] = $monthCalendar['selectedMonthInfo'];
            if (date("m") == 7) {
                $result['months'][1]['selectedMonthInfo']['currentMonth'] = 1;
            } else {
                $result['months'][1]['selectedMonthInfo']['currentMonth'] = 0;
            }
            $result['months'][1]['dates'] = $monthCalendar['dates'];

            $monthCalendar = self::getMonthCalendar(array('month' => 8, 'year' => $year));
            $result['months'][2]['selectedMonthInfo'] = $monthCalendar['selectedMonthInfo'];
            if (date("m") == 8) {
                $result['months'][2]['selectedMonthInfo']['currentMonth'] = 1;
            } else {
                $result['months'][2]['selectedMonthInfo']['currentMonth'] = 0;
            }
            $result['months'][2]['dates'] = $monthCalendar['dates'];
        } else if ($month == 8) {
            $previousMonth = 5;
            $previousYear = $year;
            $nextMonth = 11;
            $nextYear = $year;

            $monthCalendar = self::getMonthCalendar(array('month' => 7, 'year' => $year));
            $result['months'][0]['selectedMonthInfo'] = $monthCalendar['selectedMonthInfo'];
            if (date("m") == 7) {
                $result['months'][0]['selectedMonthInfo']['currentMonth'] = 1;
            } else {
                $result['months'][0]['selectedMonthInfo']['currentMonth'] = 0;
            }
            $result['months'][0]['dates'] = $monthCalendar['dates'];

            $monthCalendar = self::getMonthCalendar(array('month' => 8, 'year' => $year));
            $result['months'][1]['selectedMonthInfo'] = $monthCalendar['selectedMonthInfo'];
            if (date("m") == 8) {
                $result['months'][1]['selectedMonthInfo']['currentMonth'] = 1;
            } else {
                $result['months'][1]['selectedMonthInfo']['currentMonth'] = 0;
            }
            $result['months'][1]['dates'] = $monthCalendar['dates'];

            $monthCalendar = self::getMonthCalendar(array('month' => 9, 'year' => $year));
            $result['months'][2]['selectedMonthInfo'] = $monthCalendar['selectedMonthInfo'];
            if (date("m") == 9) {
                $result['months'][2]['selectedMonthInfo']['currentMonth'] = 1;
            } else {
                $result['months'][2]['selectedMonthInfo']['currentMonth'] = 0;
            }
            $result['months'][2]['dates'] = $monthCalendar['dates'];
        } else if ($month == 9) {
            $previousMonth = 6;
            $previousYear = $year;
            $nextMonth = 12;
            $nextYear = $year;

            $monthCalendar = self::getMonthCalendar(array('month' => 8, 'year' => $year));
            $result['months'][0]['selectedMonthInfo'] = $monthCalendar['selectedMonthInfo'];
            if (date("m") == 8) {
                $result['months'][0]['selectedMonthInfo']['currentMonth'] = 1;
            } else {
                $result['months'][0]['selectedMonthInfo']['currentMonth'] = 0;
            }
            $result['months'][0]['dates'] = $monthCalendar['dates'];

            $monthCalendar = self::getMonthCalendar(array('month' => 9, 'year' => $year));
            $result['months'][1]['selectedMonthInfo'] = $monthCalendar['selectedMonthInfo'];
            if (date("m") == 9) {
                $result['months'][1]['selectedMonthInfo']['currentMonth'] = 1;
            } else {
                $result['months'][1]['selectedMonthInfo']['currentMonth'] = 0;
            }
            $result['months'][1]['dates'] = $monthCalendar['dates'];

            $monthCalendar = self::getMonthCalendar(array('month' => 10, 'year' => $year));
            $result['months'][2]['selectedMonthInfo'] = $monthCalendar['selectedMonthInfo'];
            if (date("m") == 10) {
                $result['months'][2]['selectedMonthInfo']['currentMonth'] = 1;
            } else {
                $result['months'][2]['selectedMonthInfo']['currentMonth'] = 0;
            }
            $result['months'][2]['dates'] = $monthCalendar['dates'];
        } else if ($month == 10) {
            $previousMonth = 7;
            $previousYear = $year;
            $nextMonth = 1;
            $nextYear = $year + 1;

            $monthCalendar = self::getMonthCalendar(array('month' => 9, 'year' => $year));
            $result['months'][0]['selectedMonthInfo'] = $monthCalendar['selectedMonthInfo'];
            if (date("m") == 9) {
                $result['months'][0]['selectedMonthInfo']['currentMonth'] = 1;
            } else {
                $result['months'][0]['selectedMonthInfo']['currentMonth'] = 0;
            }
            $result['months'][0]['dates'] = $monthCalendar['dates'];

            $monthCalendar = self::getMonthCalendar(array('month' => 10, 'year' => $year));
            $result['months'][1]['selectedMonthInfo'] = $monthCalendar['selectedMonthInfo'];
            if (date("m") == 10) {
                $result['months'][1]['selectedMonthInfo']['currentMonth'] = 1;
            } else {
                $result['months'][1]['selectedMonthInfo']['currentMonth'] = 0;
            }
            $result['months'][1]['dates'] = $monthCalendar['dates'];

            $monthCalendar = self::getMonthCalendar(array('month' => 11, 'year' => $year));
            $result['months'][2]['selectedMonthInfo'] = $monthCalendar['selectedMonthInfo'];
            if (date("m") == 11) {
                $result['months'][2]['selectedMonthInfo']['currentMonth'] = 1;
            } else {
                $result['months'][2]['selectedMonthInfo']['currentMonth'] = 0;
            }
            $result['months'][2]['dates'] = $monthCalendar['dates'];
        } else if ($month == 11) {
            $previousMonth = 8;
            $previousYear = $year;
            $nextMonth = 2;
            $nextYear = $year + 1;

            $monthCalendar = self::getMonthCalendar(array('month' => 10, 'year' => $year));
            $result['months'][0]['selectedMonthInfo'] = $monthCalendar['selectedMonthInfo'];
            if (date("m") == 10) {
                $result['months'][0]['selectedMonthInfo']['currentMonth'] = 1;
            } else {
                $result['months'][0]['selectedMonthInfo']['currentMonth'] = 0;
            }
            $result['months'][0]['dates'] = $monthCalendar['dates'];

            $monthCalendar = self::getMonthCalendar(array('month' => 11, 'year' => $year));
            $result['months'][1]['selectedMonthInfo'] = $monthCalendar['selectedMonthInfo'];
            if (date("m") == 11) {
                $result['months'][1]['selectedMonthInfo']['currentMonth'] = 1;
            } else {
                $result['months'][1]['selectedMonthInfo']['currentMonth'] = 0;
            }
            $result['months'][1]['dates'] = $monthCalendar['dates'];

            $monthCalendar = self::getMonthCalendar(array('month' => 12, 'year' => $year));
            $result['months'][2]['selectedMonthInfo'] = $monthCalendar['selectedMonthInfo'];
            if (date("m") == 12) {
                $result['months'][2]['selectedMonthInfo']['currentMonth'] = 1;
            } else {
                $result['months'][2]['selectedMonthInfo']['currentMonth'] = 0;
            }
            $result['months'][2]['dates'] = $monthCalendar['dates'];
        } else if ($month == 12) {
            $previousMonth = 9;
            $previousYear = $year;
            $nextMonth = 3;
            $nextYear = $year + 1;

            $monthCalendar = self::getMonthCalendar(array('month' => 11, 'year' => $year));
            $result['months'][0]['selectedMonthInfo'] = $monthCalendar['selectedMonthInfo'];
            if (date("m") == 11) {
                $result['months'][0]['selectedMonthInfo']['currentMonth'] = 1;
            } else {
                $result['months'][0]['selectedMonthInfo']['currentMonth'] = 0;
            }
            $result['months'][0]['dates'] = $monthCalendar['dates'];

            $monthCalendar = self::getMonthCalendar(array('month' => 12, 'year' => $year));
            $result['months'][1]['selectedMonthInfo'] = $monthCalendar['selectedMonthInfo'];
            if (date("m") == 12) {
                $result['months'][1]['selectedMonthInfo']['currentMonth'] = 1;
            } else {
                $result['months'][1]['selectedMonthInfo']['currentMonth'] = 0;
            }
            $result['months'][1]['dates'] = $monthCalendar['dates'];

            $monthCalendar = self::getMonthCalendar(array('month' => 1, 'year' => $year + 1));
            $result['months'][2]['selectedMonthInfo'] = $monthCalendar['selectedMonthInfo'];
            if (date("m") == 1) {
                $result['months'][2]['selectedMonthInfo']['currentMonth'] = 1;
            } else {
                $result['months'][2]['selectedMonthInfo']['currentMonth'] = 0;
            }
            $result['months'][2]['dates'] = $monthCalendar['dates'];
        }


        //    for ($month = 1; $month <= 12; $month++) {
//        $monthCalendar = self::getMonthCalendar(array('month' => $month, 'year' => $year));
//        //$smonth = $month - 1;
//        $smonth = 0;
//        $result[$smonth]['selectedMonthInfo'] = $monthCalendar['selectedMonthInfo'];
//        $result[$smonth]['dates'] = $monthCalendar['dates'];
//        $previousMonth = "";
//        $previousYear = "";
//        if ($month == 1) {
//            $previousMonth = "12";
//            $previousYear = $year - 1;
//        } else {
//            $previousMonth = $month - 1;
//            $previousYear = $year;
//        }
//        $nextMonth = "";
//        $nextYear = "";
//        if ($month == 12) {
//            $nextMonth = "1";
//            $nextYear = $year + 1;
//        } else {
//            $nextMonth = $month + 1;
//            $nextYear = $year;
//        }
        $result['currentMonthInfo'] = array('month' => $month, 'year' => $year);
        $result['previousMonthInfo'] = array('month' => $previousMonth, 'year' => $previousYear);
        $result['nextMonthInfo'] = array('month' => $nextMonth, 'year' => $nextYear);

        //    }

        return $result;
    }

    function addEvent($attr)
    {
        return; // removing table event_attachments from db as it is not being used

        //$this->objGeneral->mysql_clean($attr);

        $result = array('isError' => 0, 'errorMessage' => '');
        if (isset($attr['addEvent'])) {

            $ownerId = (isset($attr['ownerId'])) ? trim(stripslashes(strip_tags($attr['ownerId']))) : '';
            $eventTitle = (isset($attr['title'])) ? trim(stripslashes(strip_tags($attr['title']))) : '';
            $eventDes = (isset($attr['description'])) ? trim(stripslashes(strip_tags($attr['description']))) : '';
            $eventFromDate = (isset($attr['fromDate'])) ? trim(stripslashes(strip_tags($attr['fromDate']))) : '';
            $eventToDate = (isset($attr['toDate'])) ? trim(stripslashes(strip_tags($attr['toDate']))) : '';
            $eventFromTime = (isset($attr['fromTime'])) ? trim(stripslashes(strip_tags($attr['fromTime']))) : '';
            $eventToTime = (isset($attr['toTime'])) ? trim(stripslashes(strip_tags($attr['toTime']))) : '';
            $eventInviteEmails = (isset($attr['email'])) ? $attr['email'] : '';
            $eventLocation = (isset($attr['location'])) ? trim(stripslashes(strip_tags($attr['location']))) : '';
            $eventAllDay = (isset($attr['allday'])) ? trim(stripslashes(strip_tags($attr['allday']))) : '';
            $eventColor = (isset($attr['color']) && $attr['color'] != "") ? trim(stripslashes(strip_tags($attr['color']))) : 'label-info';
            $eventShowMeAs = (isset($attr['showmeas'])) ? trim(stripslashes(strip_tags($attr['showmeas']))) : '';
            $notificationType = (isset($attr['notificationType'])) ? trim(stripslashes(strip_tags($attr['notificationType']))) : '';
            $eventRemind = (isset($attr['remind'])) ? trim(stripslashes(strip_tags($attr['remind']))) : '';
            $daysOrWeeks = (isset($attr['daysOrWeeks'])) ? trim(stripslashes(strip_tags($attr['daysOrWeeks']))) : '';
            $hours = (isset($attr['hours'])) ? trim(stripslashes(strip_tags($attr['hours']))) : '';
            $minutes = (isset($attr['minutes'])) ? trim(stripslashes(strip_tags($attr['minutes']))) : '';
            $eventReoccurance = (isset($attr['reoccurance'])) ? 1 : 0;
            $fileName = (isset($attr['fileName'])) ? trim(stripslashes(strip_tags($attr['fileName']))) : '';
            $newFileName = (isset($attr['newFileName'])) ? trim(stripslashes(strip_tags($attr['newFileName']))) : '';

            $repeats = (isset($attr['repeats'])) ? trim(stripslashes(strip_tags($attr['repeats']))) : '';
            $repeatEvery = (isset($attr['repeatEvery'])) ? trim(stripslashes(strip_tags($attr['repeatEvery']))) : '';
            $repeatOnM = (isset($attr['repeatOnM'])) ? trim(stripslashes(strip_tags($attr['repeatOnM']))) : '';
            $repeatOnT = (isset($attr['repeatOnT'])) ? trim(stripslashes(strip_tags($attr['repeatOnT']))) : '';
            $repeatOnW = (isset($attr['repeatOnW'])) ? trim(stripslashes(strip_tags($attr['repeatOnW']))) : '';
            $repeatOnTh = (isset($attr['repeatOnTh'])) ? trim(stripslashes(strip_tags($attr['repeatOnTh']))) : '';
            $repeatOnF = (isset($attr['repeatOnF'])) ? trim(stripslashes(strip_tags($attr['repeatOnF']))) : '';
            $repeatOnSa = (isset($attr['repeatOnSa'])) ? trim(stripslashes(strip_tags($attr['repeatOnSa']))) : '';
            $repeatOnSu = (isset($attr['repeatOnSu'])) ? trim(stripslashes(strip_tags($attr['repeatOnSu']))) : '';
            $repeatBy = (isset($attr['repeatBy'])) ? trim(stripslashes(strip_tags($attr['repeatBy']))) : '';
            $startOn = (isset($attr['startOn'])) ? trim(stripslashes(strip_tags($attr['startOn']))) : '';
            $eventRepeatEnd = (isset($attr['eventRepeatEnd'])) ? trim(stripslashes(strip_tags($attr['eventRepeatEnd']))) : '';
            $after = (isset($attr['after'])) ? trim(stripslashes(strip_tags($attr['after']))) : '';
            $onDate = (isset($attr['onDate'])) ? trim(stripslashes(strip_tags($attr['onDate']))) : '';
            $summary = (isset($attr['summary'])) ? trim(stripslashes(strip_tags($attr['summary']))) : '';

            $users = $this->arrUser['id'];


            if (empty($eventTitle) || empty($eventFromDate) || empty($eventToDate) || empty($eventFromTime) || empty($eventToTime) ||
                empty($eventLocation)
            ) {

                $result['isError'] = 1;
                $result['errorMessage'] = "Please enter in required fields.";
            } else {

                $eventFrom = explode(" ", str_replace("  ", " ", str_replace(":", "", $eventFromTime)));
                $from = "";
                if (strtolower($eventFrom[2]) == "pm") {
                    if ($eventFrom[0] != 12) {
                        $from = ($eventFrom[0] + 12) . "" . $eventFrom[1];
                    } else {
                        $from = $eventFrom[0] . "" . $eventFrom[1];
                    }
                } else {
                    $from = $eventFrom[0] . "" . $eventFrom[1];
                }

                $eventTo = explode(" ", str_replace("  ", " ", str_replace(":", "", $eventToTime)));
                $to = "";
                if (strtolower($eventTo[2]) == "pm") {
                    if ($eventTo[0] != 12) {
                        $to = ($eventTo[0] + 12) . "" . $eventTo[1];
                    } else {
                        $to = $eventTo[0] . "" . $eventTo[1];
                    }
                } else {
                    $to = $eventTo[0] . "" . $eventTo[1];
                }

                if ($eventAllDay) {
                    $from = "0000";
                    $to = "2359";
                }

                //$eventFromDate = date("Y-m-d", strtotime($eventFromDate));
                $breakFromDate = explode('/', $eventFromDate);
                $fromYear = $breakFromDate[2];
                $fromMonth = $breakFromDate[1];
                $fromDay = $breakFromDate[0];

                //$eventToDate = date("Y-m-d", strtotime($eventToDate));
                $breakToDate = explode('/', $eventToDate);
                $toYear = $breakToDate[2];
                $toMonth = $breakToDate[1];
                $toDay = $breakToDate[0];

                if (($fromYear > $toYear) || ($fromYear == $toYear && $fromMonth > $toMonth) || ($fromYear == $toYear && $fromMonth == $toMonth && $fromDay > $toDay) || ($fromYear == $toYear && $fromMonth == $toMonth && $fromDay == $toDay && $from >= $to)) {
                    $result['isError'] = 1;
                    $result['errorMessage'] = "From date time cannot be greater than to date time";
                } else {

                    if ($ownerId != "") {
                        $users = $ownerId;
                    }
                    $Sql = "SELECT * FROM calendar_event WHERE ((from_day BETWEEN $fromDay AND $toDay) OR (to_day BETWEEN $fromDay AND $toDay)) AND ((from_month BETWEEN $fromMonth AND $toMonth) OR (to_month BETWEEN $fromMonth AND $toMonth)) AND ((from_year BETWEEN $fromYear AND $toYear) OR (to_year BETWEEN $fromYear AND $toYear)) AND ((from_time BETWEEN '$from' AND '$to') OR (to_time BETWEEN '$from' AND '$to' )) AND user_id = $users";

                    $RS = $this->Conn->Execute($Sql);
                    if ($RS->RecordCount() > 0) {
                        $result['isError'] = 1;
                        $result['errorMessage'] = "Event already exist.";
                    } else {
                        $Sql = "INSERT INTO calendar_event (event, description, from_day, from_month, from_year,from_time, to_day, to_month, to_year, to_time, "
                            . " location, allday, eventcolor, showmeas, user_id, reoccurrance) VALUES ('$eventTitle','$eventDes','$fromDay','$fromMonth',"
                            . "'$fromYear','$from', $toDay, $toMonth, $toYear, '$to', '$eventLocation', '$eventAllDay', '$eventColor', '$eventShowMeAs', "
                            . " $users, '$eventReoccurance')";
                        $RS = $this->Conn->Execute($Sql);
                        $id = $this->Conn->Insert_ID();

                        if ($notificationType != "" && $eventRemind != "" && $daysOrWeeks != "" && $hours != "" && $minutes) {
                            $Sql = "INSERT INTO event_reminder (event_id, notificationType, remind, daysOrWeeks, hours, minutes) VALUES ($id, '$notificationType', '$eventRemind', '$daysOrWeeks', '$hours', '$minutes');";
                            $RS = $this->Conn->Execute($Sql);
                        }

                        if (!empty($fileName) && !empty($newFileName)) {
                            $Sql = "INSERT INTO event_attachments (event_id, name, newname) VALUES ($id, '$fileName', '$newFileName');";
                            $RS = $this->Conn->Execute($Sql);
                        }

                        $SqlReoccu = "INSERT INTO calendar_event_reoccurrance (event_id, repeats, repeat_every, repeat_on_mon, repeat_on_tue, repeat_on_wed, "
                            . "repeat_on_thu, repeat_on_fri, repeat_on_sat, repeat_on_sun, repeat_by, start_on, ends, ends_after, ends_on, summary) VALUES "
                            . "($id, '$repeats', '$repeatEvery', '$repeatOnM', '$repeatOnT', "
                            . "'$repeatOnW', '$repeatOnTh', '$repeatOnF', '$repeatOnSa', '$repeatOnSu', '$repeatBy', '$startOn', '$eventRepeatEnd', '$after', '$onDate', '$summary');";
                        $RSReoccu = $this->Conn->Execute($SqlReoccu);


                        if ($eventInviteEmails) {

                            //$Invitors = explode(";", $eventInviteEmails);
                            // $eventInviteEmails = str_replace(";", ",", $eventInviteEmails);
                            $eventInviteEmails1 = "";
                            for ($k = 0; $k < COUNT($eventInviteEmails); $k++) {
                                $eventInviteEmails1 .= $eventInviteEmails[$k] . ",";
                            }
                            $Invitors = $eventInviteEmails;
                            for ($i = 0; $i < COUNT($Invitors); $i++) {
                                if (!empty($Invitors[$i])) {
                                    $Sql = "INSERT INTO event_invitors (event_id, email) VALUES ($id, '" . $Invitors[$i] . "');";
                                    $RS = $this->Conn->Execute($Sql);
                                    $attendorId = $this->Conn->Insert_ID();

                                    $userInfo = self::getUserInfo("");
                                    $mail = new PHPMailer();

                                    $hash = md5("123" . $attendorId . "123" . $Invitors[$i] . "123");

                                    $body = "<table border='0' cellpadding='0' cellspacing='0' style='text-align: left; border: 2px solid #000; height: auto;'>
    <tbody><tr style='height: 50px; text-align: center; font-size: 20px'>
      <th colspan='2' style='background-color: #5bc0de; color: #FFF;'>" . $userInfo['fname'] . " " . $userInfo['lname'] . " has invited you to meeting</th>
    </tr>
    <tr><th style='background-color: #CCC; font-size: 18px;'>Title:</th><td style='font-size: 18px;'>$eventTitle</td></tr>
    <tr><th style='background-color: #CCC; font-size: 18px;'>Location:</th><td style='font-size: 18px;'>$eventLocation</td></tr>
    <tr><th style='background-color: #CCC; font-size: 18px;'>When:</th><td style='font-size: 18px;'>$eventFromDate $eventFromTime - $eventToDate $eventToTime</td></tr>
    <tr><th style='background-color: #CCC; font-size: 18px;'>Description:</th><td style='font-size: 18px;'>$eventDes</td></tr>
        <tr><th style='background-color: #CCC; font-size: 18px;'>Attendees:</th><td style='font-size: 18px;'>$eventInviteEmails1</td></tr>
      <tr style='height: 50px;'><td colspan='2' style='text-align: center;'><a href='" . $this->path . "/attende.php?id=$attendorId&code=$hash&status=1' "
                                        . "style='border: 2px solid #319BAB; background-color: #5bc0de; color: #FFF; padding: 10px 20px; "
                                        . "text-decoration: none;'>Yes</a><a href='" . $this->path . "/attende.php?id=$attendorId&code=$hash&status=2' "
                                        . "style='width: 70px; border: 1px solid #319BAB; background-color: #5bc0de; color: #FFF; padding: 10px; width: 100px; "
                                        . "text-decoration: none;'>May be</a><a href='" . $this->path . "/attende.php?id=$attendorId&code=$hash&status=3'
                                                style='width: 70px; border: 1px solid #319BAB; background-color: #5bc0de; color: #FFF; padding: 10px; width: 100px;
                                                text-decoration: none;'>No</a></td></tr>
  </tbody></table>";

                                    $body = '<table width="100%" bgcolor="#5ab1b9" cellpadding="0" cellspacing="0" border="0" id="backgroundTable">
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
                                    <td align="left" valign="middle" style="font-family: Helvetica, arial, sans-serif; font-size: 13px;color: #ffffff"> ' . $userInfo['fname'] . ' ' . $userInfo['lname'] . ' has invited you to Event</td>
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
                                  <td colspan="2" style="font-family: Helvetica, arial, sans-serif; font-size: 14px; font-weight:bold; color: #333333; text-align:right;line-height: 24px;">
                                    <a href="' . $this->path . '/attende.php?id=' . $attendorId . '&code=' . $hash . '&status=1" style="text-decoration: none; background: #5ab1b9;color:#FFFFFF; padding:10px 20px;border:0px;border-radius:3px;">Yes</a>
                                    <a href="' . $this->path . '/attende.php?id=' . $attendorId . '&code=' . $hash . '&status=2" style="text-decoration: none; background: #5ab1b9;color:#FFFFFF; padding:10px 20px;border:0px;border-radius:3px;">Maybe</a>
                                    <a href="' . $this->path . '/attende.php?id=' . $attendorId . '&code=' . $hash . '&status=3" style="text-decoration: none; background: #5ab1b9;color:#FFFFFF; padding:10px 20px;border:0px;border-radius:3px;">No</a>
                                  </td>
                                </tr>
                                <tr>
                                  <td colspan="2">&nbsp;</td>
                                </tr>
                                <tr>
                                  <td style="font-family: Helvetica, arial, sans-serif; font-size: 14px; font-weight:bold; color: #333333; text-align:left;line-height: 24px;"> Title:</td>
                                  <td style="font-family: Helvetica, arial, sans-serif; font-size: 14px; color: #333333; text-align:left;line-height: 24px;">' . $eventTitle . '</td>
                                </tr>
                                <tr>
                                  <td style="font-family: Helvetica, arial, sans-serif; font-size: 14px; font-weight:bold; color: #333333; text-align:left;line-height: 24px;"> Location:</td>
                                  <td style="font-family: Helvetica, arial, sans-serif; font-size: 14px; color: #333333; text-align:left;line-height: 24px;">' . $eventLocation . '</td>
                                </tr>
                                <tr>
                                  <td style="font-family: Helvetica, arial, sans-serif; font-size: 14px; font-weight:bold; color: #333333; text-align:left;line-height: 24px;"> When:</td>
                                  <td style="font-family: Helvetica, arial, sans-serif; font-size: 14px; color: #333333; text-align:left;line-height: 24px;">' . $eventFromDate . ' ' . $eventFromTime . ' - ' . $eventToDate . ' ' . $eventToTime . '</td>
                                </tr>
                                <tr>
                                    <td width="27%" style="font-family: Helvetica, arial, sans-serif; font-size: 14px; font-weight:bold; color: #333333; text-align:left;line-height: 24px;"> Attendees:</td>
                                    <td width="73%" style="font-family: Helvetica, arial, sans-serif; font-size: 14px; color: #333333; text-align:left;line-height: 24px;">' . $eventInviteEmails . '</td>
                                </tr>
                                <tr>
                                  <td style="font-family: Helvetica, arial, sans-serif; font-size: 14px; font-weight:bold; color: #333333; text-align:left;line-height: 24px;"> Description:</td>
                                  <td style="font-family: Helvetica, arial, sans-serif; font-size: 14px; color: #333333; text-align:left;line-height: 24px;">' . $eventDes . '</td>
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
                                    <td height="20" colspan="2"></td>
                                  </tr>
                                <!-- Spacing -->
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
                            <td align="center" valign="middle" style="font-family: Helvetica, arial, sans-serif; font-size: 13px;color: #ffffff"><br><a href="#" style="text-decoration: none; color: #5ab1b9"></a></td>
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
      </table>';

                                    $mail->AddReplyTo("no-reply@navson.com", "Navson");
                                    $mail->AddAddress($Invitors[$i]);
                                    $mail->From = $userInfo['email'];
                                    $mail->FromName = $userInfo['fname'] . " " . $userInfo['lname'];
                                    $mail->Subject = "Event Invitation Email";
                                    $mail->WordWrap = 80; // set word wrap

                                    if (!empty($fileName) && !empty($newFileName)) {
                                        $file_to_attach = $this->path . '/upload/calendar_event_attachment/' . $newFileName;
                                        $mail->AddAttachment($file_to_attach, $newFileName);
                                    }

                                    $mail->MsgHTML($body);
                                    $mail->IsHTML(true); // send as HTML
                                    $mail->Send();
                                }
                            }
                        }
                    }
                }
            }
        }
        return $result;
    }

    function editEvent($attr)
    {
        return; // removing table event_attachments from db as it is not being used


//        echo "<pre>";
//        print_r($attr);
//        echo "</pre>";
        //  $this->objGeneral->mysql_clean($attr);
        $result = array();
        if (isset($attr['editEvent'])) {

            $ownerId = (isset($attr['ownerId'])) ? trim(stripslashes(strip_tags($attr['ownerId']))) : '';
            $eventId = (isset($attr['id'])) ? trim(stripslashes(strip_tags($attr['id']))) : '';
            $eventTitle = (isset($attr['title'])) ? trim(stripslashes(strip_tags($attr['title']))) : '';
            $eventDes = (isset($attr['description'])) ? trim(stripslashes(strip_tags($attr['description']))) : '';
            $eventFromDate = (isset($attr['fromDate'])) ? trim(stripslashes(strip_tags($attr['fromDate']))) : '';
            $eventToDate = (isset($attr['toDate'])) ? trim(stripslashes(strip_tags($attr['toDate']))) : '';
            $eventFromTime = (isset($attr['fromTime'])) ? trim(stripslashes(strip_tags($attr['fromTime']))) : '';
            $eventToTime = (isset($attr['toTime'])) ? trim(stripslashes(strip_tags($attr['toTime']))) : '';
            $eventInviteEmails = (isset($attr['email'])) ? $attr['email'] : '';
            $eventLocation = (isset($attr['location'])) ? trim(stripslashes(strip_tags($attr['location']))) : '';
            $eventAllDay = (isset($attr['allday'])) ? trim(stripslashes(strip_tags($attr['allday']))) : '';
            $eventColor = (isset($attr['color']) && $attr['color'] != "") ? trim(stripslashes(strip_tags($attr['color']))) : 'label-info';
            $eventShowMeAs = (isset($attr['showmeas'])) ? trim(stripslashes(strip_tags($attr['showmeas']))) : '';
            $notificationType = (isset($attr['notificationType'])) ? trim(stripslashes(strip_tags($attr['notificationType']))) : '';
            $eventRemind = (isset($attr['remind'])) ? trim(stripslashes(strip_tags($attr['remind']))) : '';
            $daysOrWeeks = (isset($attr['daysOrWeeks'])) ? trim(stripslashes(strip_tags($attr['daysOrWeeks']))) : '';
            $hours = (isset($attr['hours'])) ? trim(stripslashes(strip_tags($attr['hours']))) : '';
            $minutes = (isset($attr['minutes'])) ? trim(stripslashes(strip_tags($attr['minutes']))) : '';
            $eventReoccurance = (isset($attr['reoccurance'])) ? 1 : 0;
            $fileName = (isset($attr['fileName'])) ? trim(stripslashes(strip_tags($attr['fileName']))) : '';
            $newFileName = (isset($attr['newFileName'])) ? trim(stripslashes(strip_tags($attr['newFileName']))) : '';

            $repeats = (isset($attr['repeats'])) ? trim(stripslashes(strip_tags($attr['repeats']))) : '';
            $repeatEvery = (isset($attr['repeatEvery'])) ? trim(stripslashes(strip_tags($attr['repeatEvery']))) : '';
            $repeatOnM = (isset($attr['repeatOnM'])) ? trim(stripslashes(strip_tags($attr['repeatOnM']))) : '';
            $repeatOnT = (isset($attr['repeatOnT'])) ? trim(stripslashes(strip_tags($attr['repeatOnT']))) : '';
            $repeatOnW = (isset($attr['repeatOnW'])) ? trim(stripslashes(strip_tags($attr['repeatOnW']))) : '';
            $repeatOnTh = (isset($attr['repeatOnTh'])) ? trim(stripslashes(strip_tags($attr['repeatOnTh']))) : '';
            $repeatOnF = (isset($attr['repeatOnF'])) ? trim(stripslashes(strip_tags($attr['repeatOnF']))) : '';
            $repeatOnSa = (isset($attr['repeatOnSa'])) ? trim(stripslashes(strip_tags($attr['repeatOnSa']))) : '';
            $repeatOnSu = (isset($attr['repeatOnSu'])) ? trim(stripslashes(strip_tags($attr['repeatOnSu']))) : '';
            $repeatBy = (isset($attr['repeatBy'])) ? trim(stripslashes(strip_tags($attr['repeatBy']))) : '';
            $startOn = (isset($attr['startOn'])) ? trim(stripslashes(strip_tags($attr['startOn']))) : '';
            $eventRepeatEnd = (isset($attr['eventRepeatEnd'])) ? trim(stripslashes(strip_tags($attr['eventRepeatEnd']))) : '';
            $after = (isset($attr['after'])) ? trim(stripslashes(strip_tags($attr['after']))) : '';
            $onDate = (isset($attr['onDate'])) ? trim(stripslashes(strip_tags($attr['onDate']))) : '';
            $summary = (isset($attr['summary'])) ? trim(stripslashes(strip_tags($attr['summary']))) : '';

            $users = $this->arrUser['id'];

            if (empty($eventTitle) || empty($eventFromDate) || empty($eventToDate) || empty($eventFromTime) || empty($eventToTime) || empty($eventLocation)) {
                $result['isError'] = 1;
                $result['errorMessage'] = "Please enter in required fields.";
            } else {

                $eventFrom = explode(" ", str_replace("  ", " ", str_replace(":", "", $eventFromTime)));
                $from = "";
                if (strtolower($eventFrom[2]) == "pm") {
                    if ($eventFrom[0] != 12) {
                        $from = ($eventFrom[0] + 12) . "" . $eventFrom[1];
                    } else {
                        $from = $eventFrom[0] . "" . $eventFrom[1];
                    }
                } else {
                    $from = $eventFrom[0] . "" . $eventFrom[1];
                }

                $eventTo = explode(" ", str_replace("  ", " ", str_replace(":", "", $eventToTime)));
                $to = "";
                if (strtolower($eventTo[2]) == "pm") {
                    if ($eventTo[0] != 12) {
                        $to = ($eventTo[0] + 12) . "" . $eventTo[1];
                    } else {
                        $to = $eventTo[0] . "" . $eventTo[1];
                    }
                } else {
                    $to = $eventTo[0] . "" . $eventTo[1];
                }

//                $eventFromDate = date("Y-m-d", strtotime($eventFromDate));
//                echo "<pre>";
//                print_r($eventFromDate);
//                echo "</pre>";
//                $breakFromDate = explode('-', $eventFromDate);
//                $fromYear = $breakFromDate[0];
//                $fromMonth = $breakFromDate[1];
//                $fromDay = substr($breakFromDate[2], 0, 2);
//
//                $eventToDate = date("Y-m-d", strtotime($eventToDate));
//                echo "<pre>";
//                print_r($eventToDate);
//                echo "</pre>";
//                $breakToDate = explode('-', $eventToDate);
//                $toYear = $breakToDate[0];
//                $toMonth = $breakToDate[1];
//                $toDay = substr($breakToDate[2], 0, 2);

                $breakFromDate = explode('/', $eventFromDate);
                $fromYear = $breakFromDate[2];
                $fromMonth = $breakFromDate[1];
                $fromDay = $breakFromDate[0];

                //$eventToDate = date("Y-m-d", strtotime($eventToDate));
                $breakToDate = explode('/', $eventToDate);
                $toYear = $breakToDate[2];
                $toMonth = $breakToDate[1];
                $toDay = $breakToDate[0];

                if (($fromYear > $toYear) || ($fromYear == $toYear && $fromMonth > $toMonth) || ($fromYear == $toYear && $fromMonth == $toMonth && $fromDay > $toDay) || ($fromYear == $toYear && $fromMonth == $toMonth && $fromDay == $toDay && $from >= $to)) {
                    $result['isError'] = 1;
                    $result['errorMessage'] = "From date time cannot be greater than to date time";
                } else {
                    if ($ownerId != "") {
                        $users = $ownerId;
                    }

                    $Sql = "SELECT * FROM calendar_event WHERE id != $eventId AND ((from_day BETWEEN $fromDay AND $toDay) OR (to_day BETWEEN $fromDay AND $toDay)) AND ((from_month BETWEEN $fromMonth AND $toMonth) OR (to_month BETWEEN $fromMonth AND $toMonth)) AND ((from_year BETWEEN $fromYear AND $toYear) OR (to_year BETWEEN $fromYear AND $toYear)) AND ((from_time BETWEEN '$from' AND '$to') OR (to_time BETWEEN '$from' AND '$to' )) AND user_id = $users";

                    $RS = $this->Conn->Execute($Sql);
                    if ($RS->RecordCount() > 0) {
                        $result['isError'] = 1;
                        $result['errorMessage'] = "Event already exist.";
                    } else {
                        //$Sql = "UPDATE calendar_event SET event = '$eventTitle', description = '$eventDes', from_day = $fromDay, from_month = $fromMonth, from_year = $fromYear, from_time = '$from', to_day = $toDay,to_month = $toMonth, to_year = $toYear, to_time = '$to' WHERE id=$eventId";

                        $Sql = "UPDATE calendar_event SET event = '$eventTitle', description = '$eventDes', from_day = '$fromDay', from_month = '$fromMonth',"
                            . " from_year = '$fromYear', from_time = '$from', to_day = $toDay, to_month = $toMonth, to_year = $toYear, to_time = '$to', "
                            . " location = '$eventLocation', allday = '$eventAllDay', eventcolor = '$eventColor', showmeas = '$eventShowMeAs', "
                            . " reoccurrance = '$eventReoccurance'  WHERE id=$eventId";
                        $RS = $this->Conn->Execute($Sql);

                        if ($notificationType != "" && $eventRemind != "" && $daysOrWeeks != "" && $hours != "" && $minutes) {
                            $SqlSelRem = "SELECT * FROM event_reminder WHERE event_id=$eventId";
                            $RSSelRem = $this->Conn->Execute($SqlSelRem);
                            if ($RSSelRem->RecordCount() > 0) {
                                $SqlNotifi = "UPDATE event_reminder SET notificationType='$notificationType', remind='$eventRemind', daysOrWeeks='$daysOrWeeks', "
                                    . "hours='$hours', minutes='$minutes' WHERE event_id=$eventId";
                                $RSNotifi = $this->Conn->Execute($SqlNotifi);
                            } else {
                                $SqlNotifi = "INSERT INTO event_reminder (event_id, notificationType, remind, daysOrWeeks, hours, minutes) VALUES "
                                    . "($eventId, '$notificationType', '$eventRemind', '$daysOrWeeks', '$hours', '$minutes');";
                                $RSNotifi = $this->Conn->Execute($SqlNotifi);
                            }
                        }

                        if (!empty($fileName) && !empty($newFileName)) {
                            $Sql = "INSERT INTO event_attachments (event_id, name, newname) VALUES ($eventId, '$fileName', '$newFileName');";
                            $RS = $this->Conn->Execute($Sql);
                        }

                        $SqlSelReo = "SELECT * FROM calendar_event_reoccurrance WHERE event_id = $eventId";

                        $RSSelReo = $this->Conn->Execute($SqlSelReo);
                        if ($RSSelReo->RecordCount() > 0) {
                            $SqlEditReoccu = "UPDATE calendar_event_reoccurrance SET summary = '$summary', repeats='$repeats', repeat_every='$repeatEvery', repeat_on_mon='$repeatOnM', repeat_on_tue='$repeatOnT', "
                                . "repeat_on_wed='$repeatOnW', repeat_on_thu='$repeatOnTh', repeat_on_fri='$repeatOnF', repeat_on_sat='$repeatOnSa', "
                                . "repeat_on_sun='$repeatOnSu', repeat_by='$repeatBy', start_on='$startOn', ends='$eventRepeatEnd', ends_after='$after', "
                                . "ends_on='$onDate' WHERE event_id=$eventId;";
                            $RSEditReoccu = $this->Conn->Execute($SqlEditReoccu);
                        } else {
                            $SqlEditReoccu = "INSERT INTO calendar_event_reoccurrance (event_id, repeats, repeat_every, repeat_on_mon, repeat_on_tue, repeat_on_wed, "
                                . "repeat_on_thu, repeat_on_fri, repeat_on_sat, repeat_on_sun, repeat_by, start_on, ends, ends_after, ends_on, summary) VALUES "
                                . "($eventId, '$repeats', '$repeatEvery', '$repeatOnM', '$repeatOnT', '$repeatOnW', '$repeatOnTh', '$repeatOnF', '$repeatOnSa', "
                                . "'$repeatOnSu', '$repeatBy', '$startOn', '$eventRepeatEnd', '$after', '$onDate', '$summary')";
                            $RSEditReoccu = $this->Conn->Execute($SqlEditReoccu);
                        }


                        $AllInvitors = array();

//                        if ($eventInviteEmails != "") {
//                            $AllInvitors = explode(";", $eventInviteEmails);
//                        }
                        if ($eventInviteEmails) {
                            $AllInvitors = $eventInviteEmails;
                        }

                        $eventInviteEmails1 = "";
                        for ($k = 0; $k < COUNT($eventInviteEmails); $k++) {
                            $eventInviteEmails1 .= $eventInviteEmails[$k] . ",";
                        }
                        //$Invitors = $eventInviteEmails;
                        // $eventInviteEmails = str_replace(";", "'", $eventInviteEmails);

                        $SqlInvitors = "SELECT * FROM event_invitors WHERE event_id = $eventId";
                        $RSInvitors = $this->Conn->Execute($SqlInvitors);
                        $ExistingInvitors = array();
                        if ($RSInvitors->RecordCount() > 0) {
                            while ($row = $RSInvitors->FetchRow()) {
                                array_push($ExistingInvitors, $row['email']);
                            }
                        }

                        $Invitors = array_unique($AllInvitors);

                        if (COUNT($Invitors) > 0) {

                            for ($i = 0; $i < COUNT($Invitors); $i++) {
                                if (!empty($Invitors[$i])) {

                                    $SqlIsInvitor = "SELECT * FROM event_invitors WHERE event_id = $eventId AND email='" . $Invitors[$i] . "'";
                                    $RSIsInvitor = $this->Conn->Execute($SqlIsInvitor);

                                    if ($RSIsInvitor->RecordCount() == 0) {

                                        $Sql = "INSERT INTO event_invitors (event_id, email) VALUES ($eventId, '" . $Invitors[$i] . "');";
                                        $RS = $this->Conn->Execute($Sql);
                                        $attendorId = $this->Conn->Insert_ID();

                                        $userInfo = self::getUserInfo("");
                                        $mail = new PHPMailer();

                                        $hash = md5("123" . $attendorId . "123" . $Invitors[$i] . "123");

                                        $body = "<table border='0' cellpadding='0' cellspacing='0' style='text-align: left; border: 2px solid #000; height: auto;'>
    <tbody><tr style='height: 50px; text-align: center; font-size: 20px'>
      <th colspan='2' style='background-color: #5bc0de; color: #FFF;'>" . $userInfo['fname'] . " " . $userInfo['lname'] . " has invited you to meeting</th>
    </tr>
    <tr><th style='background-color: #CCC; font-size: 18px;'>Title:</th><td style='font-size: 18px;'>$eventTitle</td></tr>
    <tr><th style='background-color: #CCC; font-size: 18px;'>Location:</th><td style='font-size: 18px;'>$eventLocation</td></tr>
    <tr><th style='background-color: #CCC; font-size: 18px;'>When:</th><td style='font-size: 18px;'>$eventFromDate $eventFromTime</td></tr>
    <tr><th style='background-color: #CCC; font-size: 18px;'>Description:</th><td style='font-size: 18px;'>$eventDes</td></tr>
        <tr><th style='background-color: #CCC; font-size: 18px;'>Attendees:</th><td style='font-size: 18px;'>$eventInviteEmails1</td></tr>
      <tr style='height: 50px;'><td colspan='2' style='text-align: center;'><a href='" . $this->path . "/attende.php?id=$attendorId&code=$hash&status=1' style='border: 2px solid #319BAB; background-color: #5bc0de; color: #FFF; padding: 10px 20px; text-decoration: none;'>Yes</a><a href='" . $this->path . "/attende.php?id=$attendorId&code=$hash&status=2' style='width: 70px; border: 1px solid #319BAB; background-color: #5bc0de; color: #FFF; padding: 10px; width: 100px; text-decoration: none;'>May be</a><a href='" . $this->path . "/attende.php?id=$attendorId&code=$hash&status=3' style='width: 70px; border: 1px solid #319BAB; background-color: #5bc0de; color: #FFF; padding: 10px; width: 100px; text-decoration: none;'>No</a></td></tr>
  </tbody></table>";

                                        $body = "<table border='0' cellpadding='0' cellspacing='0' style='text-align: left; border: 2px solid #000; height: auto;'>
    <tbody><tr style='height: 50px; text-align: center; font-size: 20px'>
      <th colspan='2' style='background-color: #5bc0de; color: #FFF;'>" . $userInfo['fname'] . " " . $userInfo['lname'] . " has invited you to meeting</th>
    </tr>
    <tr><th style='background-color: #CCC; font-size: 18px;'>Title:</th><td style='font-size: 18px;'>$eventTitle</td></tr>
    <tr><th style='background-color: #CCC; font-size: 18px;'>Location:</th><td style='font-size: 18px;'>$eventLocation</td></tr>
    <tr><th style='background-color: #CCC; font-size: 18px;'>When:</th><td style='font-size: 18px;'>$eventFromDate $eventFromTime - $eventToDate $eventToTime</td></tr>
    <tr><th style='background-color: #CCC; font-size: 18px;'>Description:</th><td style='font-size: 18px;'>$eventDes</td></tr>
        <tr><th style='background-color: #CCC; font-size: 18px;'>Attendees:</th><td style='font-size: 18px;'>$eventInviteEmails1</td></tr>
      <tr style='height: 50px;'><td colspan='2' style='text-align: center;'><a href='" . $this->path . "/attende.php?id=$attendorId&code=$hash&status=1' "
                                            . "style='border: 2px solid #319BAB; background-color: #5bc0de; color: #FFF; padding: 10px 20px; "
                                            . "text-decoration: none;'>Yes</a><a href='" . $this->path . "/attende.php?id=$attendorId&code=$hash&status=2' "
                                            . "style='width: 70px; border: 1px solid #319BAB; background-color: #5bc0de; color: #FFF; padding: 10px; width: 100px; "
                                            . "text-decoration: none;'>May be</a><a href='" . $this->path . "/attende.php?id=$attendorId&code=$hash&status=3'
                                                style='width: 70px; border: 1px solid #319BAB; background-color: #5bc0de; color: #FFF; padding: 10px; width: 100px;
                                                text-decoration: none;'>No</a></td></tr>
  </tbody></table>";

                                        $body = '<table width="100%" bgcolor="#5ab1b9" cellpadding="0" cellspacing="0" border="0" id="backgroundTable">
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
                                    <td align="left" valign="middle" style="font-family: Helvetica, arial, sans-serif; font-size: 13px;color: #ffffff"> ' . $userInfo['fname'] . ' ' . $userInfo['lname'] . ' has invited you to Event</td>
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
                                  <td colspan="2" style="font-family: Helvetica, arial, sans-serif; font-size: 14px; font-weight:bold; color: #333333; text-align:right;line-height: 24px;">
                                    <a href="' . $this->path . '/attende.php?id=' . $attendorId . '&code=' . $hash . '&status=1" style="text-decoration: none; background: #5ab1b9;color:#FFFFFF; padding:10px 20px;border:0px;border-radius:3px;">Yes</a>
                                    <a href="' . $this->path . '/attende.php?id=' . $attendorId . '&code=' . $hash . '&status=2" style="text-decoration: none; background: #5ab1b9;color:#FFFFFF; padding:10px 20px;border:0px;border-radius:3px;">Maybe</a>
                                    <a href="' . $this->path . '/attende.php?id=' . $attendorId . '&code=' . $hash . '&status=3" style="text-decoration: none; background: #5ab1b9;color:#FFFFFF; padding:10px 20px;border:0px;border-radius:3px;">No</a>
                                  </td>
                                </tr>
                                <tr>
                                  <td colspan="2">&nbsp;</td>
                                </tr>
                                <tr>
                                  <td style="font-family: Helvetica, arial, sans-serif; font-size: 14px; font-weight:bold; color: #333333; text-align:left;line-height: 24px;"> Title:</td>
                                  <td style="font-family: Helvetica, arial, sans-serif; font-size: 14px; color: #333333; text-align:left;line-height: 24px;">' . $eventTitle . '</td>
                                </tr>
                                <tr>
                                  <td style="font-family: Helvetica, arial, sans-serif; font-size: 14px; font-weight:bold; color: #333333; text-align:left;line-height: 24px;"> Location:</td>
                                  <td style="font-family: Helvetica, arial, sans-serif; font-size: 14px; color: #333333; text-align:left;line-height: 24px;">' . $eventLocation . '</td>
                                </tr>
                                <tr>
                                  <td style="font-family: Helvetica, arial, sans-serif; font-size: 14px; font-weight:bold; color: #333333; text-align:left;line-height: 24px;"> When:</td>
                                  <td style="font-family: Helvetica, arial, sans-serif; font-size: 14px; color: #333333; text-align:left;line-height: 24px;">' . $eventFromDate . ' ' . $eventFromTime . ' - ' . $eventToDate . ' ' . $eventToTime . '</td>
                                </tr>
                                <tr>
                                    <td width="27%" style="font-family: Helvetica, arial, sans-serif; font-size: 14px; font-weight:bold; color: #333333; text-align:left;line-height: 24px;"> Attendees:</td>
                                    <td width="73%" style="font-family: Helvetica, arial, sans-serif; font-size: 14px; color: #333333; text-align:left;line-height: 24px;">' . $eventInviteEmails . '</td>
                                </tr>
                                <tr>
                                  <td style="font-family: Helvetica, arial, sans-serif; font-size: 14px; font-weight:bold; color: #333333; text-align:left;line-height: 24px;"> Description:</td>
                                  <td style="font-family: Helvetica, arial, sans-serif; font-size: 14px; color: #333333; text-align:left;line-height: 24px;">' . $eventDes . '</td>
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
                                    <td height="20" colspan="2"></td>
                                  </tr>
                                <!-- Spacing -->
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
                            <td align="center" valign="middle" style="font-family: Helvetica, arial, sans-serif; font-size: 13px;color: #ffffff"><br><a href="#" style="text-decoration: none; color: #5ab1b9"></a></td>
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
      </table>';

                                        $mail->AddReplyTo("no-reply@navson.com", "Navson");
                                        $mail->AddAddress($Invitors[$i]);
                                        $mail->From = $userInfo['email'];
                                        $mail->FromName = $userInfo['fname'] . " " . $userInfo['lname'];
                                        $mail->Subject = "Event Invitation Email";
                                        $mail->WordWrap = 80; // set word wrap

                                        if (!empty($fileName) && !empty($newFileName)) {
                                            $file_to_attach = $this->path . '/upload/calendar_event_attachment/' . $newFileName;
                                            $mail->AddAttachment($file_to_attach, $newFileName);
                                        }

                                        $mail->MsgHTML($body);
                                        $mail->IsHTML(true); // send as HTML
                                        $mail->Send();
                                    } else {


                                        $userInfo = self::getUserInfo("");
                                        $mail = new PHPMailer();

                                        $body = "<table border='0' cellpadding='0' cellspacing='0' style='text-align: left; border: 2px solid #000; height: auto;'>
    <tbody><tr style='height: 50px; text-align: center; font-size: 20px'>
      <th colspan='2' style='background-color: #5bc0de; color: #FFF;'>" . $userInfo['fname'] . " " . $userInfo['lname'] . " has updated meeting</th>
    </tr>
    <tr><th style='background-color: #CCC; font-size: 18px;'>Title:</th><td style='font-size: 18px;'>$eventTitle</td></tr>
    <tr><th style='background-color: #CCC; font-size: 18px;'>Location:</th><td style='font-size: 18px;'>$eventLocation</td></tr>
    <tr><th style='background-color: #CCC; font-size: 18px;'>When:</th><td style='font-size: 18px;'>$eventFromDate $eventFromTime</td></tr>
    <tr><th style='background-color: #CCC; font-size: 18px;'>Description:</th><td style='font-size: 18px;'>$eventDes</td></tr>
        <tr><th style='background-color: #CCC; font-size: 18px;'>Attendees:</th><td style='font-size: 18px;'>$eventInviteEmails1</td></tr>
  </tbody></table>";

                                        $body = '<table width="100%" bgcolor="#5ab1b9" cellpadding="0" cellspacing="0" border="0" id="backgroundTable">
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
                                    <td align="left" valign="middle" style="font-family: Helvetica, arial, sans-serif; font-size: 13px;color: #ffffff"> ' . $userInfo['fname'] . ' ' . $userInfo['lname'] . ' has updated Event</td>
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
                                  <td style="font-family: Helvetica, arial, sans-serif; font-size: 14px; font-weight:bold; color: #333333; text-align:left;line-height: 24px;"> Title:</td>
                                  <td style="font-family: Helvetica, arial, sans-serif; font-size: 14px; color: #333333; text-align:left;line-height: 24px;">' . $eventTitle . '</td>
                                </tr>
                                <tr>
                                  <td style="font-family: Helvetica, arial, sans-serif; font-size: 14px; font-weight:bold; color: #333333; text-align:left;line-height: 24px;"> Location:</td>
                                  <td style="font-family: Helvetica, arial, sans-serif; font-size: 14px; color: #333333; text-align:left;line-height: 24px;">' . $eventLocation . '</td>
                                </tr>
                                <tr>
                                  <td style="font-family: Helvetica, arial, sans-serif; font-size: 14px; font-weight:bold; color: #333333; text-align:left;line-height: 24px;"> When:</td>
                                  <td style="font-family: Helvetica, arial, sans-serif; font-size: 14px; color: #333333; text-align:left;line-height: 24px;">' . $eventFromDate . ' ' . $eventFromTime . ' - ' . $eventToDate . ' ' . $eventToTime . '</td>
                                </tr>
                                <tr>
                                    <td width="27%" style="font-family: Helvetica, arial, sans-serif; font-size: 14px; font-weight:bold; color: #333333; text-align:left;line-height: 24px;"> Attendees:</td>
                                    <td width="73%" style="font-family: Helvetica, arial, sans-serif; font-size: 14px; color: #333333; text-align:left;line-height: 24px;">' . $eventInviteEmails . '</td>
                                </tr>                                
                                <tr>
                                  <td style="font-family: Helvetica, arial, sans-serif; font-size: 14px; font-weight:bold; color: #333333; text-align:left;line-height: 24px;"> Description:</td>
                                  <td style="font-family: Helvetica, arial, sans-serif; font-size: 14px; color: #333333; text-align:left;line-height: 24px;">' . $eventDes . '</td>
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
                                    <td height="20" colspan="2"></td>
                                  </tr>
                                <!-- Spacing -->
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
                            <td align="center" valign="middle" style="font-family: Helvetica, arial, sans-serif; font-size: 13px;color: #ffffff"><br><a href="#" style="text-decoration: none; color: #5ab1b9"></a></td>
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
      </table>';

                                        $mail->AddReplyTo("no-reply@navson.com", "Navson");
                                        $mail->AddAddress($Invitors[$i]);
                                        $mail->From = $userInfo['email'];
                                        $mail->FromName = $userInfo['fname'] . " " . $userInfo['lname'];
                                        $mail->Subject = "Event Updation Email";
                                        $mail->WordWrap = 80; // set word wrap

                                        if (!empty($fileName) && !empty($newFileName)) {
                                            $file_to_attach = $this->path . '/upload/calendar_event_attachment/' . $newFileName;
                                            $mail->AddAttachment($file_to_attach, $newFileName);
                                        }

                                        $mail->MsgHTML($body);
                                        $mail->IsHTML(true); // send as HTML
                                        $mail->Send();
                                    }

                                    foreach ($ExistingInvitors as $EInvitor) {
                                        if (!empty($EInvitor)) {
                                            if (!in_array($EInvitor, $Invitors)) {
                                                $SqlInvitors = "DELETE FROM event_invitors WHERE event_id = $eventId and email='$EInvitor'";
                                                $this->Conn->Execute($SqlInvitors);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return $result;
    }

    function deleteEvent($attr)
    {
        return; // removing table event_attachments from db as it is not being used
        $this->objGeneral->mysql_clean($attr);

        $result = array('isError' => 0, 'errorMessage' => '');
        if (isset($attr['id'])) {

            $eventId = (isset($attr['id'])) ? trim(stripslashes(strip_tags($attr['id']))) : '';
            if (empty($eventId)) {
                $result['isError'] = 1;
                $result['errorMessage'] = "Please select an event.";
            } else {
                $userInfo = self::getUserInfo("");
                $mail = new PHPMailer();

                $Sql22 = "SELECT * FROM calendar_event WHERE id = $eventId limit 1";
                $RS22 = $this->Conn->Execute($Sql22);
                $format = 1;
                if ($RS22->RecordCount() > 0) {
                    $result = array();
                    while ($row = $RS22->FetchRow()) {
                        $eventTitle = $row['event'];
                        $eventLocation = $row['location'];
                        $eventFromTime = "";
                        $eventToTime = "";
                        $eventDes = $row['description'];
                        $from = str_split($row['from_time'], 2);
                        $from_hr = $from[0];
                        if ($from_hr >= 12) {
                            if ($from_hr > 12) {
                                $from_hr = '0' . ($from_hr - 12) . ' :';
                            } else {
                                $from_hr = $from_hr . ' :';
                            }
                            $dial_from = 'PM';
                        } else {
                            $from_hr = $from_hr . ' :';
                            $dial_from = 'AM';
                        }
                        $from_min = $from[1] . " " . $dial_from;
                        $eventFromTime = $from_hr . $from_min;
                        if ($row['to_time'] == '2359') {
                            $to_hr = "11 :";
                            $dial_to = 'PM';
                            $to_min = "30 " . $dial_to;
                        } else {
                            $to = str_split($row['to_time'], 2);
                            $to_hr = $to[0];
                            if ($to_hr >= 12) {
                                if ($to_hr > 12) {
                                    $to_hr = '0' . ($to_hr - 12) . ' :';
                                } else {
                                    $to_hr = $to_hr . ' :';
                                }
                                $dial_to = 'PM';
                            } else {
                                $to_hr = $to_hr . ' :';
                                $dial_to = 'AM';
                            }
                            $to_min = $to[1] . " " . $dial_to;
                        }

                        $eventToTime = $to_hr . $to_min;

                        $fromDay = $row['from_day'];
                        $fromMonth = $row['from_month'];
                        $fromYear = $row['from_year'];
                        $eventFromDate = "";
                        switch ($format) {
                            case 1:
                                $eventFromDate = $fromDay . "/" . $fromMonth . "/" . $fromYear;
                                break;
                            case 2:
                                $eventFromDate = $fromYear . "/" . $fromMonth . "/" . $fromDay;
                                break;
                            case 3:
                                $eventFromDate = $fromMonth . "/" . $fromDay . "/" . $fromYear;
                                break;
                            default:
                                $eventFromDate = $fromDay . "/" . $fromMonth . "/" . $fromYear;
                                break;
                        }

                        $toDay = $row['to_day'];
                        $toMonth = $row['to_month'];
                        $toYear = $row['to_year'];
                        $eventToDate = "";
                        switch ($format) {
                            case 1:
                                $eventToDate = $toDay . "/" . $toMonth . "/" . $toYear;
                                break;
                            case 2:
                                $eventToDate = $toYear . "/" . $toMonth . "/" . $toDay;
                                break;
                            case 3:
                                $eventToDate = $toMonth . "/" . $toDay . "/" . $toYear;
                                break;
                            default:
                                $eventToDate = $toDay . "/" . $toMonth . "/" . $toYear;
                                break;
                        }

                        $body = '<table width="100%" bgcolor="#5ab1b9" cellpadding="0" cellspacing="0" border="0" id="backgroundTable">
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
                                    <td align="left" valign="middle" style="font-family: Helvetica, arial, sans-serif; font-size: 13px;color: #ffffff"> ' . $userInfo['fname'] . ' ' . $userInfo['lname'] . ' has deleted Event</td>
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
                                  <td colspan="2">&nbsp;</td>
                                </tr>
                                <tr>
                                  <td style="font-family: Helvetica, arial, sans-serif; font-size: 14px; font-weight:bold; color: #333333; text-align:left;line-height: 24px;"> Title:</td>
                                  <td style="font-family: Helvetica, arial, sans-serif; font-size: 14px; color: #333333; text-align:left;line-height: 24px;">' . $eventTitle . '</td>
                                </tr>
                                <tr>
                                  <td style="font-family: Helvetica, arial, sans-serif; font-size: 14px; font-weight:bold; color: #333333; text-align:left;line-height: 24px;"> Location:</td>
                                  <td style="font-family: Helvetica, arial, sans-serif; font-size: 14px; color: #333333; text-align:left;line-height: 24px;">' . $eventLocation . '</td>
                                </tr>
                                <tr>
                                  <td style="font-family: Helvetica, arial, sans-serif; font-size: 14px; font-weight:bold; color: #333333; text-align:left;line-height: 24px;"> When:</td>
                                  <td style="font-family: Helvetica, arial, sans-serif; font-size: 14px; color: #333333; text-align:left;line-height: 24px;">' . $eventFromDate . ' ' . $eventFromTime . ' - ' . $eventToDate . ' ' . $eventToTime . '</td>
                                </tr>
                                <tr>
                                  <td style="font-family: Helvetica, arial, sans-serif; font-size: 14px; font-weight:bold; color: #333333; text-align:left;line-height: 24px;"> Description:</td>
                                  <td style="font-family: Helvetica, arial, sans-serif; font-size: 14px; color: #333333; text-align:left;line-height: 24px;">' . $eventDes . '</td>
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
                                    <td height="20" colspan="2"></td>
                                  </tr>
                                <!-- Spacing -->
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
                            <td align="center" valign="middle" style="font-family: Helvetica, arial, sans-serif; font-size: 13px;color: #ffffff"><br><a href="#" style="text-decoration: none; color: #5ab1b9"></a></td>
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
      </table>';

                        $Sql = "SELECT * FROM event_invitors WHERE event_id = $eventId";
                        $RS = $this->Conn->Execute($Sql);

                        if ($RS->RecordCount() > 0) {
                            while ($row = $RS->FetchRow()) {
                                $mail->AddReplyTo("no-reply@navson.com", "Navson");
                                $mail->AddAddress($row['email']);
                                $mail->From = $userInfo['email'];
                                $mail->FromName = $userInfo['fname'] . " " . $userInfo['lname'];
                                $mail->Subject = "Delete Event Email";
                                $mail->WordWrap = 80; // set word wrap

                                $mail->MsgHTML($body);
                                $mail->IsHTML(true); // send as HTML
                                $mail->Send();
                            }
                        }
                    }
                }
                $Sql = "DELETE FROM calendar_event WHERE id=" . $eventId;
                $RS = $this->Conn->Execute($Sql);
                $Sql = "DELETE FROM calendar_event_reoccurrance WHERE event_id=" . $eventId;
                $RS = $this->Conn->Execute($Sql);
                $Sql = "DELETE FROM event_attachments WHERE event_id=" . $eventId;
                $RS = $this->Conn->Execute($Sql);
                $Sql = "DELETE FROM event_invitors WHERE event_id=" . $eventId;
                $RS = $this->Conn->Execute($Sql);
                $Sql = "DELETE FROM event_reminder WHERE event_id=" . $eventId;
                $RS = $this->Conn->Execute($Sql);
            }
        }
        return $result;
    }

    function getUsers()
    {

        $this->objGeneral->mysql_clean($attr);
        $result = array();
        $UserId = $this->arrUser['id'];
        $Sql = "SELECT * FROM employees WHERE status = 1 AND id != $UserId Order By id ASC";
        $RS = $this->Conn->Execute($Sql);

        if ($RS->RecordCount() == 0) {
            $results['isUser'] = 0;
        } else {
            $results['isUser'] = 1;
            $results['total'] = "$total";
            $results['users'] = array();
            $x = 0;
            while ($row = $RS->FetchRow()) {
                $results['users'][$x] = array('id' => $row['id'], 'name' => $row['first_name'] . " " . $row['last_name']);
                $x++;
            }
        }
        return $results;
    }

    function getUserInfo($userId)
    {
        $UserId = "";
        if ($userId == "") {
            $UserId = $this->arrUser['id'];
        } else {
            $UserId = $userId;
        }

        $Sql = "SELECT * FROM employees WHERE id = $UserId";
        $RS = $this->Conn->Execute($Sql);

        if ($RS->RecordCount() > 0) {
            $result = array();
            while ($row = $RS->FetchRow()) {
                $result = array('id' => $row['id'], 'name' => $row['name'], 'email' => $row['user_email'], 'fname' => $row['first_name'], 'lname' => $row['last_name']);
                break;
            }
        }
        return $result;
    }

    function shareCalendar($attr)
    {

        //$this->objGeneral->mysql_clean($attr);
        $UserId = $this->arrUser['id'];
        $result = array();
        $users = (isset($attr['users'])) ? $attr['users'] : '';
        $level = (isset($attr['level'])) ? trim(stripslashes(strip_tags($attr['level']))) : '';
        $levelName = "";
        switch ($level) {
            case 1:
                $levelName = "View";
                break;
            case 2:
                $levelName = "Add";
                break;
            case 3:
                $levelName = "Edit";
                break;
            case 4:
                $levelName = "View and Add";
                break;
            case 5:
                $levelName = "Edit";
                break;
            case 6:
                $levelName = "View, Add and Edit";
                break;
            default:
                $levelName = "";
                break;
        }
        $message = (isset($attr['message'])) ? trim(stripslashes(strip_tags($attr['message']))) : '';

        $LoggedUserInfo = self::getUserInfo($UserId);
        $OwnerName = $LoggedUserInfo['fname'] . " " . $LoggedUserInfo['lname'];
        $OwnerEmail = $LoggedUserInfo['email'];
        //$usersData = explode(",", $users);
        $usersData = $users;
        for ($i = 0; $i < COUNT($usersData); $i++) {
            if ($usersData[$i] != "") {
                $SqlEmployees = "SELECT employees.id from employees 
left JOIN company on company.id=employees.user_company 
where employees.status=1 and (employees.user_email='" . $usersData[$i] . "' or employees.personal_email='" . $usersData[$i] . "' or employees.work_email='" . $usersData[$i] . "' or 
    employees.next_of_kin_email='" . $usersData[$i] . "') and 
(employees.user_company=" . $this->arrUser['company_id'] . " 
or  company.parent_id=" . $this->arrUser['company_id'] . ")
ORDER BY employees.id ASC LIMIT 1";
                $sharewithid = "";
                $RSEmployees = $this->Conn->Execute($SqlEmployees);
                if ($RSEmployees->RecordCount() > 0) {
                    while ($rowEmployee = $RSEmployees->FetchRow()) {
                        $sharewithid = $rowEmployee['id'];
                    }
                }

                $SqlCheckOwner = "SELECT * FROM calendar_share WHERE owner_id = $UserId AND shared_with=" . $sharewithid;
                $RSCheckOwner = $this->Conn->Execute($SqlCheckOwner);

                if ($RSCheckOwner->RecordCount() > 0) {
                    $result = array();
                    while ($row = $RSCheckOwner->FetchRow()) {
                        $this->Conn->Execute("DELETE FROM calendar_share WHERE id=" . $row['id']);
                    }
                }
                $Sql = "INSERT INTO calendar_share (owner_id, shared_with, level, status) VALUES ($UserId, $sharewithid, '$level', 1)";
                $RS = $this->Conn->Execute($Sql);
                $Friend = self::getUserInfo($sharewithid);
                $FriendEmail = $Friend['email'];

                $mail = new PHPMailer();

                $body = "<table border='0' cellpadding='0' cellspacing='0' style='text-align: left; border: 2px solid #000; height: auto; '>
    <tbody><tr style='height: 50px; text-align: center; font-size: 20px'>
      <th colspan='2' style='background-color: #5bc0de; color: #FFF;'>" . $OwnerName . " has shared his/her calendar with you and you have previligious to $levelName events into his/her Calendar.</th>
    </tr><tr><td style='font-size: 18px;' colspan='2'>$message</td></tr>
  </tbody></table>";

                $body = '<table width="100%" bgcolor="#5ab1b9" cellpadding="0" cellspacing="0" border="0" id="backgroundTable">
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
                                    <td align="left" valign="middle" style="font-family: Helvetica, arial, sans-serif; font-size: 13px;color: #ffffff">Shared Calendar Info</td>
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
                                  <td style="font-family: Helvetica, arial, sans-serif; font-size: 14px; color: #333333; text-align:left;line-height: 24px;">' . $OwnerName . ' has shared his/her calendar with you and you have previligious to ' . $levelName . ' events into his/her Calendar.</td>
                                </tr>
                                <tr>
                                  <td style="font-family: Helvetica, arial, sans-serif; font-size: 14px; font-weight:bold; color: #333333; text-align:left;line-height: 24px;"> Message:</td>
                                  <td style="font-family: Helvetica, arial, sans-serif; font-size: 14px; color: #333333; text-align:left;line-height: 24px;">' . $message . '</td>
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
                                    <td height="20" colspan="2"></td>
                                  </tr>
                                <!-- Spacing -->
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
                            <td align="center" valign="middle" style="font-family: Helvetica, arial, sans-serif; font-size: 13px;color: #ffffff"><br><a href="#" style="text-decoration: none; color: #5ab1b9"></a></td>
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
      </table>';

                $mail->AddReplyTo("no-reply@navson.com", "Navson");
                $mail->AddAddress($FriendEmail);
                $mail->From = $OwnerEmail;
                $mail->FromName = $OwnerName;
                $mail->Subject = "Shared Calendar Info";
                $mail->WordWrap = 80; // set word wrap

                $mail->MsgHTML($body);
                $mail->IsHTML(true); // send as HTML
                $mail->Send();
            }
        }

        return $result;
    }

}
