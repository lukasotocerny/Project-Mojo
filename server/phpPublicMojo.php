<?php
    
$link = mysqli_connect("###", "###", "###", "###");

    if($_GET['action']=='get_new_question') {
        get_new_question($link);
    }
    else if ($_GET['action']=='add_data') {
        add_data($link);
    }
    else if ($_GET['action']=='edit_data') {
        edit_data($link);
    }
    else if ($_GET['action']=='mojo_button') {
        mojo_button($link);
    }
    else if ($_GET['action']=='get_friends') {
        get_friends($link);
    }
    else if ($_GET['action']=='get_connected') {
        get_connected($link);
    }
    else if ($_GET['action']=='respond_mojo') {
        respond_mojo($link);
    }

function add_data($link) { 
    
    $data = json_decode(file_get_contents("php://input"));
    $question_id = $data->question_id;
    $answer_id = $data->answer_id;
    $a1 = $data->a1;
    $a1_like = $data->a1_like;
    $a2 = $data->a2;
    $a2_like = $data->a2_like;
    $a3 = $data->a3;
    $a3_like = $data->a3_like;

    $exists = mysqli_fetch_array(mysqli_query($link, "SELECT id FROM publicmojo WHERE answer_id=".$answer_id." AND question_id=".$question_id));

    if ($exists == null) {
        mysqli_query($link, "INSERT INTO publicmojo (question_id, answer_id, a1, a1_like, a2, a2_like, a3, a3_like, ans) 
                            VALUES (".$question_id.", ".$answer_id.", ".$a1.", ".$a1_like.", ".$a2.", ".$a2_like.", ".$a3.", ".$a3_like.", 0)");
    } else {
        mysqli_query($link, "UPDATE publicmojo SET a1=".$a1.", a2=".$a2.", a3=".$a3.", ans=0 WHERE id=".$exists[0]);
    }
}

function edit_data($link) 
    $data = json_decode(file_get_contents("php://input"));
    $id = $data->id;
    $statement = $data->statement;

    mysqli_query($link, "UPDATE publicmojo SET ".$statement." WHERE id=".$id);
}

function respond_mojo($link) {
    $data = json_decode(file_get_contents("php://input"));
    $answer_id = $data->answer_id;
    $question_id = $data->question_id;
    $mojo = $data->mojo;

    mysqli_query($link, "UPDATE publicmojo SET wait=0, mojo=".$mojo." WHERE (answer_id=".$answer_id.") AND (question_id=".$question_id.")");

    mysqli_query($link, "UPDATE publicmojo SET wait=0, mojo=".$mojo." WHERE (answer_id=".$question_id.") AND (question_id=".$answer_id.")");
}

function mojo_button($link) { 
    $data = json_decode(file_get_contents("php://input"));
    $question_id = $data->question_id;
    $answer_id = $data->answer_id;
    $a1 = $data->a1;
    $a1_like = $data->a1_like;
    $a2 = $data->a2;
    $a2_like = $data->a2_like;
    $a3 = $data->a3;
    $a3_like = $data->a3_like;
    $mojo = $data->mojo;

    $exists = mysqli_fetch_array(mysqli_query($link, "SELECT id FROM publicmojo WHERE answer_id=".$answer_id." AND question_id=".$question_id));

    if ($exists == null) {
        mysqli_query($link, "INSERT INTO publicmojo (question_id, answer_id, a1, a1_like, a2, a2_like, a3, a3_like, ans, wait, mojo) 
                            VALUES (".$question_id.", ".$answer_id.", ".$a1.", ".$a1_like.", ".$a2.", ".$a2_like.", ".$a3.", ".$a3_like.", 1, ".$mojo.", ".$mojo.")");
    } else {
        mysqli_query($link, "UPDATE publicmojo SET a1=".$a1.", a1_like=".$a1_like.", a2=".$a2.", a2_like=".$a2_like.", a3=".$a3.", a3_like=".$a3_like.", ans=1, wait=".$mojo.", mojo=".$mojo." 
                            WHERE (answer_id=".$answer_id." AND question_id=".$question_id.")");
    }

    $exists = mysqli_fetch_array(mysqli_query($link, "SELECT id FROM publicmojo WHERE question_id=".$answer_id." AND answer_id=".$question_id));

    if ($exists == null) {
        mysqli_query($link, "INSERT INTO publicmojo (question_id, answer_id, wait) 
                            VALUES (".$answer_id.", ".$question_id.", ".$mojo.")");
    } else {
        mysqli_query($link, "UPDATE publicmojo SET wait=".$mojo." WHERE (question_id=".$answer_id." AND answer_id=".$question_id.")");
    }
}

function get_friends($link) {
    $data = json_decode(file_get_contents("php://input"));
    $answer_id = $data->answer_id;                    

    $response = mysqli_query($link, "SELECT p.question_id AS id, users.username, users.photo FROM publicmojo AS p
                                        INNER JOIN users ON p.question_id=users.id
                                        WHERE (p.answer_id=".$answer_id." AND p.mojo=1 AND EXISTS(SELECT * FROM publicmojo WHERE (answer_id=p.question_id AND question_id=".$answer_id." AND mojo=1)))");
    
    $friends = array();

    while($row = mysqli_fetch_array($response)) {
        array_push($friends, $row);
    }

    header('Content-Type: application/json');
    echo json_encode($friends);
}

function get_connected($link) {
    $data = json_decode(file_get_contents("php://input"));
    $answer_id = $data->answer_id;

    $response = mysqli_query($link, "SELECT p.question_id AS id, users.username, users.photo FROM publicmojo AS p
                                            INNER JOIN users ON p.question_id=users.id
                                            WHERE (p.answer_id=".$answer_id." AND p.wait=1 AND p.mojo IS NULL AND EXISTS(SELECT * FROM publicmojo WHERE (answer_id=p.question_id AND question_id=".$answer_id." AND mojo=1)))");
    
    $connected = array();

    while($row = mysqli_fetch_array($response)) {
        array_push($connected, $row);
    }
    
    header('Content-Type: application/json');
    echo json_encode($connected);
}

function get_new_question($link) {
    $data = json_decode(file_get_contents("php://input"));
    $answer_id = $data->answer_id;
    $latitude = $data->latitude;
    $longitude = $data->longitude;

    mysqli_query($link, "CREATE OR REPLACE VIEW newquestionsview AS SELECT
                        ".$answer_id." AS me_id,
                        usershim.id AS newquestionuser_id,
                        FLOOR(ACOS(SIN(usershim.latitude) * SIN(".$latitude.") + COS(usershim.latitude) * COS(".$latitude.") * COS(usershim.longitude-".$longitude.")) * 6378) AS distance,
                        usershim.username,
                        usershim.photo,
                        questions.q1 AS q1,
                        questions.a1 AS a1,
                        questions.q2 AS q2,
                        questions.a2 AS a2,
                        questions.q3 AS q3,
                        questions.a3 AS a3,
                        preferences.date,
                        preferences.work,
                        preferences.friends,
                        preferences.fun,
                        preferences.hobbies,
                        preferences.other,
                        usershim.male,
                        usershim.female,
                        usershim.age
                        FROM
                        users AS usershim
                        LEFT JOIN questions
                        ON usershim.id = questions.user_id 
                        LEFT JOIN preferences
                        ON preferences.user_id = questions.user_id 
                        LEFT JOIN publicmojo
                        ON publicmojo.question_id = preferences.user_id
                        WHERE
                        (usershim.id NOT IN (SELECT question_id FROM publicmojo WHERE answer_id =".$answer_id." AND ans IS NOT NULL)) AND (usershim.id !=".$answer_id.")");

    $resource = mysqli_query($link, 
        "SELECT DISTINCT
        newquestionsview.newquestionuser_id AS user_id,
        newquestionsview.username,
        newquestionsview.photo,
        newquestionsview.age,
        newquestionsview.q1,
        newquestionsview.a1,
        newquestionsview.q2,
        newquestionsview.a2,
        newquestionsview.q3,
        newquestionsview.a3
        FROM
        newquestionsview
        JOIN preferences
        ON newquestionsview.me_id = preferences.user_id
        WHERE
        (age <= max_age AND age >= min_age) AND
        ((preferences.male = newquestionsview.male) OR (preferences.female = newquestionsview.female)) AND
        ((preferences.date AND newquestionsview.date) OR 
        (preferences.friends AND newquestionsview.friends) OR 
        (preferences.hobbies AND newquestionsview.hobbies) OR 
        (preferences.work AND newquestionsview.work) OR 
        (preferences.fun AND newquestionsview.fun) OR 
        (preferences.other AND newquestionsview.other)) AND
        (newquestionsview.distance<=preferences.distance)
        ORDER BY
        newquestionsview.distance ASC LIMIT 50");
    
    $arr=array();
    while ( $row = mysqli_fetch_array($resource) ) {
        array_push($arr, $row);
    }

    echo json_encode($arr);
}
?>