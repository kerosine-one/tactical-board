<?php
session_start();
$conn = new mysqli("localhost", "root", "", "training_app");

require('fpdf/fpdf.php');

$data = json_decode(file_get_contents("php://input"), true);

$image = $data["image"];
$comment = $data["comment"];
$name = $data["name"];
$age = $data["age"];
$type = $data["type"];

$image = str_replace('data:image/png;base64,', '', $image);
$image = str_replace(' ', '+', $image);
$imageData = base64_decode($image);


$fileName = "images/" . time() . ".png";
file_put_contents($fileName, $imageData);

$user_id = $_SESSION['user_id'] ?? 0;

$sql = "INSERT INTO trainings 
(user_id, name, age_group, type, image_name, comment)
VALUES
('$user_id', '$name', '$age', '$type', '$fileName', '$comment')";

$conn->query($sql);

ob_end_clean();

// converting to pdf
$pdf = new FPDF();
$pdf->AddPage();

$pdf->SetFont('Arial','B',16);
$pdf->Cell(0,10,'Football Training Plan',0,1,'C');

$pdf->Image($fileName,10,30,190);

$pdf->SetY(145);
$pdf->SetFont('Arial','',12);
$pdf->MultiCell(0,10,"Coach comments:\n".$comment);

$pdf->Output("D","training-plan.pdf");
exit;