<?php

require_once '../mysql.php';

if(!isset($_REQUEST['m'])) {
  echo 0;
  exit;
}


$mysqli = @new mysqli($db_host, $db_user, $db_pass, $db_name);
if ($mysqli->connect_errno) {
  echo -1;
  exit;
}

// TODO blacklist?
$result = @$mysqli->query('/*' . MYSQLND_QC_ENABLE_SWITCH . '*/ SELECT docurl,metaurl,COUNT(`id`) AS count FROM `whitelist` WHERE docurl = "'.$mysqli->real_escape_string($_REQUEST['m']).'" GROUP BY docurl,metaurl ORDER BY count DESC LIMIT 1');
if(!$result) {
  echo -2;
  exit;
}

$value = $result->fetch_array(MYSQLI_NUM);
if(!is_array($value)) {
  // No whitelist entry found
  if(isset($_REQUEST['a'])) {
    // Check blacklist
    $result = @$mysqli->query('/*' . MYSQLND_QC_ENABLE_SWITCH . '*/ SELECT docurl,metaurl FROM `blacklist` WHERE docurl = "'.$mysqli->real_escape_string($_REQUEST['m']).'" GROUP BY docurl,metaurl');
    $blacklist = $result->fetch_all(MYSQLI_ASSOC);
    echo '{"jsonRedirect":"'. substr($_REQUEST['a'], 26) .'", "blacklist":'.json_encode($blacklist).' }'; // http -> 25, https -> 26
    exit;
  } else {
    echo -3;
    exit;
  }

}
$metaurl = $value[1];
echo '{"jsonRedirect":"/'. $metaurl .'"}';
exit;

?>