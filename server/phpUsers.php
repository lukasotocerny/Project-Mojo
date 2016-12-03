<?php

if($_GET['action']=='add_data') {
    $link = mysqli_connect("###", "###", "###", "###");
    $data = json_decode(file_get_contents("php://input"));
    $username = $data->username;
    $password = $data->password;
    $q1 = $data->q1;
    $a1 = $data->a1;
    $q2 = $data->q2;
    $a2 = $data->a2;
    $q3 = $data->q3;
    $a3 = $data->a3;
    $age = $data->age;
    $me_male = $data->me_male;
    $me_female = $data->me_female;
    $male = $data->male;
    $female = $data->female;
    $work = $data->work;
    $date = $data->date;
    $friends = $data->friends;
    $fun = $data->fun;
    $hobbies = $data->hobbies;
    $other = $data->other;
    $min_age = $data->min_age;
    $max_age = $data->max_age;
    $distance = $data->distance;
    $latitude = $data->latitude;
    $longitude = $data->longitude;
    $photo = $data->photo;

    mysqli_query($link, "INSERT INTO users (username, password, age, male, female, latitude, longitude, photo) VALUES ('".$username."', '".$password."', ".$age.",".$me_male.", ".$me_female.",".$latitude.",".$longitude.",".$photo.")");

    $id = mysqli_fetch_row(mysqli_query($link, "SELECT id FROM users WHERE username='".$username."'"));

    mysqli_query($link, "INSERT INTO preferences (user_id, male, female, work, date, friends, fun, hobbies, other, min_age, max_age, distance) VALUES (".$id[0].",".$male.", ".$female.", ".$work.", ".$date.",
    ".$friends.", ".$fun.", ".$hobbies.", ".$other.", ".$min_age.", ".$max_age.", ".$distance.")");

    mysqli_query($link, "INSERT INTO questions (user_id, q1, a1, q2, a2, q3, a3) VALUES (".$id[0].", '".$q1."', 
    ".$a1.",'".$q2."', ".$a2.",'".$q3."', ".$a3.")");

    echo $id[0];
}

else if($_GET['action']=='edit_preferences') {
    $link = mysqli_connect("###", "###", "###", "###");
    $data = json_decode(file_get_contents("php://input"));
    $id = $data->id;
    $male = $data->male;
    $female = $data->female;
    $work = $data->work;
    $date = $data->date;
    $friends = $data->friends;
    $hobbies = $data->hobbies;
    $fun = $data->fun;
    $other = $data->other;

    mysqli_query($link, "UPDATE preferences SET friends=".$friends.", date=".$date.", work=".$work.", fun=".$fun.", other=".$other.", hobbies=".$hobbies.",
    male=".$male.", female=".$female." WHERE user_id=".$id);
}

else if($_GET['action']=='get_data'){
    $link = mysqli_connect("###", "###", "###", "###");
    $data = json_decode(file_get_contents("php://input"));
    $username = $data->username;
    $resource = mysqli_query($link, "SELECT users.id, users.photo, users.password, users.username, users.age, users.male AS me_male, users.female AS me_female, preferences.fun, preferences.date, preferences.work, preferences.friends, preferences.hobbies, preferences.other, preferences.female,                                       preferences.male, preferences.distance, preferences.min_age, preferences.max_age, questions.q1, questions.q2, questions.q3, questions.a1, questions.a2, questions.a3
                                    FROM users 
                                    INNER JOIN questions ON questions.user_id=users.id
                                    INNER JOIN preferences ON preferences.user_id=users.id
                                    WHERE username='".$username."'");
    $response = mysqli_fetch_array($resource);
    echo json_encode($response);
}

else if($_GET['action']=='get_id'){
    $link = mysqli_connect("###", "###", "###", "###");
    $data = json_decode(file_get_contents("php://input"));
    $username = $data->username;
    $resource = mysqli_query($link, "SELECT id FROM users WHERE username='".$username."'");
    $response = mysqli_fetch_array($resource);
    echo $response[0];
}

else if($_GET['action']=='edit_photo') {
    $link = mysqli_connect("###", "###", "###", "###");
    $data = json_decode(file_get_contents("php://input"));
    $answer_id = $data->answer_id;
    $photo = $data->photo;
    
    mysqli_query($link, "UPDATE users SET ".$photo."=".$photo." id=".$answer_id);
}

else if($_GET['action']=='delete_account'){
    $link = mysqli_connect("###", "###", "###", "###");
    $data = json_decode(file_get_contents("php://input"));
    $id = $data->id;
    mysqli_query($link, "DELETE FROM users WHERE id =".$id);
    mysqli_query($link, "DELETE FROM preferences WHERE user_id =".$id);
    mysqli_query($link, "DELETE FROM questions WHERE user_id =".$id);
    mysqli_query($link, "DELETE FROM chat WHERE ((from_id =".$id.") OR (to_id=".$id."))");
    mysqli_query($link, "DELETE FROM publicmojo WHERE ((answer_id =".$id.") OR (question_id=".$id."))");
}

else if($_GET['action']=='check_username'){
    $link = mysqli_connect("###", "###", "###", "###");
    $data = json_decode(file_get_contents("php://input"));
    $username = $data->username;
    $resource = mysqli_query($link, "SELECT CASE
                                        WHEN EXISTS(SELECT * FROM users WHERE username='".$username."') THEN 1 
                                        ELSE 0
                                        END
                                        AS userex");
    $response = mysqli_fetch_row($resource);
    echo $response[0];
}

else if($_GET['action']=='get_responses') {
    $link = mysqli_connect("###", "###", "###", "###");
    $data = json_decode(file_get_contents("php://input"));
    $user_id = $data->user_id;

    $resource = mysqli_query($link, "SELECT users.username, users.id, users.age, users.photo, questions.q1,
    SUM(CASE publicmojo.a1 WHEN 1 THEN 1 ELSE 0 END) AS a1_yes, SUM(CASE publicmojo.a1_like WHEN 1 THEN 1 ELSE 0 END) AS a1_like, SUM(CASE WHEN publicmojo.a1 IS NOT null THEN 1 ELSE 0 END) AS totala1,
    questions.q2, 
    SUM(CASE publicmojo.a2 WHEN 1 THEN 1 ELSE 0 END) AS a2_yes, SUM(CASE publicmojo.a2_like WHEN 1 THEN 1 ELSE 0 END) AS a2_like, SUM(CASE WHEN publicmojo.a2 IS NOT null THEN 1 ELSE 0 END) AS totala2,
    questions.q3,
    SUM(CASE publicmojo.a3 WHEN 1 THEN 1 ELSE 0 END) AS a3_yes, SUM(CASE publicmojo.a3_like WHEN 1 THEN 1 ELSE 0 END) AS a3_like, SUM(CASE WHEN publicmojo.a3 IS NOT null THEN 1 ELSE 0 END) AS totala3 
    FROM users
    INNER JOIN questions ON questions.user_id=users.id
    LEFT JOIN publicmojo ON publicmojo.question_id=questions.user_id
    WHERE users.id=".$user_id);
    $response = mysqli_fetch_array($resource);
    echo json_encode($response);
}


else if($_GET['action']=='get_question') {
    $link = mysqli_connect("###", "###", "###", "###");
    $data = json_decode(file_get_contents("php://input"));
    $answer_id = $data->answer_id;
    $question = $data->question;
    $answer = $data->answer;

    $resource = mysqli_query($link, "SELECT ".$question.", ".$answer." FROM questions WHERE user_id=".$answer_id);
    $response = mysqli_fetch_array($resource);

    header('Content-Type: application/json');
    echo json_encode($response);
}

else if($_GET['action']=='edit_question') {
    $link = mysqli_connect("###", "###", "###", "###");
    $data = json_decode(file_get_contents("php://input"));
    $answer_id = $data->answer_id;
    $question = $data->question;
    $answer = $data->answer;
    $newquestion = $data->newquestion;
    $newanswer = $data->newanswer;
    
    mysqli_query($link, "UPDATE questions SET ".$question."='".$newquestion."', ".$answer."=".$newanswer." WHERE user_id=".$answer_id);

    mysqli_query($link, "UPDATE publicmojo SET ".$answer."=NULL, ".$answer."_like=NULL, wait=NULL WHERE question_id=".$answer_id);
}

else if($_GET['action']=='edit_location') {
    $link = mysqli_connect("###", "###", "###", "###");
    $data = json_decode(file_get_contents("php://input"));
    $id = $data->id;
    $latitude = $data->latitude;
    $longitude = $data->longitude;
    
    mysqli_query($link, "UPDATE users SET latitude=".$latitude.", longitude=".$longitude." WHERE id=".$id);
}
?>