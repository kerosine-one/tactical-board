<?php
session_start();
$conn = new mysqli("localhost", "root", "", "training_app");

if (!isset($_SESSION['user_id'])) {
    echo json_encode([]);
    exit;
}

$user_id = $_SESSION['user_id'];

$type = $_GET['type'] ?? '';
$age = $_GET['age'] ?? '';
$search = $_GET['search'] ?? '';

$sql = "SELECT * FROM trainings WHERE user_id='$user_id'";

if ($type != '') {
    $sql .= " AND type='$type'";
}

if ($age != '') {
    $sql .= " AND age_group='$age'";
}

if ($search != '') {
    $sql .= " AND name LIKE '%$search%'";
}

$sql .= " ORDER BY created_at DESC";

$result = $conn->query($sql);

$data = [];

while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode($data);
?>