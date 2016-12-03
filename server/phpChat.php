<?php
    
    $link = mysqli_connect("", "", "", "");

    if($_GET['action']=='get_conversation') {
        get_conversation($link);
    }
    else if($_GET['action']=='add_data') {
        add_data($link);
    }

function add_data($link) { 
    $data = json_decode(file_get_contents("php://input"));
    $to_id = $data->to_id;
    $from_id = $data->from_id;
    $message = $data->message;

    mysqli_query($link, "INSERT INTO chat(to_id, from_id, message) VALUES 
    (".$to_id.", ".$from_id.", '".$message."')");
}

function get_conversation($link) {
    $data = json_decode(file_get_contents("php://input"));
    $to_id = $data->to_id;
    $from_id = $data->from_id;
    $arr = array();

    $fetch = mysqli_query($link, "SELECT * FROM chat WHERE (to_id=".$to_id." AND from_id=".$from_id.") OR (to_id=".$from_id." AND from_id=".$to_id.")");
    while ($row = mysqli_fetch_array($fetch) ) {
        array_push($arr, $row);
     }
    header('Content-Type: application/json');
    echo json_encode($arr);
}


function get_data_id($link) {
    $data = json_decode(file_get_contents("php://input"));
    $id = $data->id;

    $resource = mysqli_query($link, "SELECT * FROM chat WHERE id=".$id);
    $response = mysqli_fetch_array($resource);

    header('Content-Type: application/json');
    echo json_encode($response);
}

?>