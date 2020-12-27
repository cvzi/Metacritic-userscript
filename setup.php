<?php

require_once '../mysql.php';

$mysqli = new mysqli($db_host, $db_user, $db_pass, $db_name);
if ($mysqli->connect_errno) {
  echo 'MySQL connection failed!';
}

$result = $mysqli->query('CREATE TABLE `whitelist` (
  `id` varchar(100) COLLATE ascii_bin NOT NULL,
  `docurl` varchar(1000) COLLATE ascii_bin NOT NULL,
  `metaurl` varchar(200) COLLATE ascii_bin NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `docurl` (`docurl`),
  KEY `metaurl` (`metaurl`)
) ENGINE=MyISAM DEFAULT CHARSET=ascii COLLATE=ascii_bin');

if(!$result) {
  echo 'MySQL1 failed!';
}
echo 'Done1';



$result = $mysqli->query('CREATE TABLE `blacklist` (
  `id` varchar(100) COLLATE ascii_bin NOT NULL,
  `docurl` varchar(1000) COLLATE ascii_bin NOT NULL,
  `metaurl` varchar(200) COLLATE ascii_bin NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `docurl` (`docurl`),
  KEY `metaurl` (`metaurl`)
) ENGINE=MyISAM DEFAULT CHARSET=ascii COLLATE=ascii_bin');

if(!$result) {
  echo 'MySQL2 failed!';
}
echo 'Done2';


?>