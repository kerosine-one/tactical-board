<?php
$conn = new mysqli("localhost", "root", "", "training_app");

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$firstName = $_POST['firstName'];
$lastName = $_POST['lastName'];
$password = password_hash($_POST['password'], PASSWORD_DEFAULT);

$sql = "INSERT INTO users (first_name, last_name, password)
        VALUES ('$firstName', '$lastName', '$password')";

if ($conn->query($sql) === TRUE) {
    header("Location: loginPage.html");
    exit();
} else {
    echo "error: " . $conn->error;
}

$conn->close();
?>