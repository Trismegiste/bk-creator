<?php

$cnt = file_get_contents('./data/atout.json');
$json = json_decode($cnt, TRUE);

$flat = [];
foreach ($json as $group => $atout) {
    foreach ($atout as $row) {
        $row['group'] = $group;
        $row['subgroup'] = '2replacexxx';
        $flat[] = $row;
    }
}

//usort($flat, function($a, $b) {
//    return ($a['titre'] > $b['titre']) ? -1 : 1;
//});

print_r($flat);

file_put_contents('./data/atout2.json', json_encode($flat, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
