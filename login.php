<?php
session_start();

$conn = new mysqli("localhost", "root", "", "training_app");

$firstName = $_POST['firstName'];
$password = $_POST['password'];

$sql = "SELECT * FROM users WHERE first_name='$firstName'";
$result = $conn->query($sql);

$user = $result->fetch_assoc();

if ($user && password_verify($password, $user['password'])) {
    $_SESSION['user_id'] = $user['id'];
    header("Location: trainings.html");
    exit();
} else {
    echo "wrong username or password";
}
?>