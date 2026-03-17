<?php

require('fpdf/fpdf.php');

$data = json_decode(file_get_contents("php://input"), true);

$image = $data["image"];
$comment = $data["comment"];


$image = str_replace('data:image/png;base64,', '', $image);
$image = str_replace(' ', '+', $image);

$imageData = base64_decode($image);

$fileName = "training_" . time() . ".png";

file_put_contents($fileName, $imageData);


$pdf = new FPDF();
$pdf->AddPage();

$pdf->SetFont('Arial','B',16);
$pdf->Cell(0,10,'Football Training Plan',0,1,'C');

$pdf->Image($fileName,10,30,190);

$pdf->SetY(200);

$pdf->SetFont('Arial','',12);
$pdf->MultiCell(0,10,"Coach comments:\n".$comment);

$pdf->Output("D","training-plan.pdf");

unlink($fileName);

?>