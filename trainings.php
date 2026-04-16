<?php
$conn = new mysqli("localhost", "root", "", "training_app");

$type = $_GET['type'] ?? '';
$age = $_GET['age'] ?? '';
$search = $_GET['search'] ?? '';

$sql = "SELECT * FROM trainings WHERE 1=1";

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
?>

<?php while($row = $result->fetch_assoc()): ?>

  <div class="training-card">
    <h2><?= htmlspecialchars($row['name']) ?></h2>

    <p><b>Age:</b> <?= htmlspecialchars($row['age_group']) ?></p>
    <p><b>Type:</b> <?= htmlspecialchars($row['type']) ?></p>

    <p><?= htmlspecialchars($row['comment']) ?></p>

    <img src="<?= $row['image_name'] ?>" width="300">

    <p class="date"><?= $row['created_at'] ?></p>
  </div>

<?php endwhile; ?>

</div>

</body>
</html>