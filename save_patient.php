<?php
// save_patient.php
require_once 'config.php';

header('Content-Type: application/json');
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'POST method required']);
    exit;
}

$fields = [
    'full_name', 'date_of_birth', 'age', 'gender', 'blood_group', 'marital_status',
    'phone_number', 'email', 'address', 'city', 'state', 'zip_code',
    'height_cm', 'weight_kg', 'allergies', 'medical_conditions', 'current_medications', 'medical_history'
];

$data = [];
foreach ($fields as $f) {
    $data[$f] = $_POST[$f] ?? null;
}

// Basic validation
if (empty($data['full_name']) || empty($data['age']) || empty($data['gender']) || empty($data['phone_number'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Required fields missing']);
    exit;
}

// Establish DB connection
try {
    require 'config.php'; // ensure config.php has your DB credentials
    $pdo = new PDO("mysql:host=".DB_HOST.";dbname=".DB_NAME, DB_USER, DB_PASSWORD);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $stmt = $pdo->prepare("INSERT INTO patients 
        (full_name, date_of_birth, age, gender, blood_group, marital_status,
         phone_number, email, address, city, state, zip_code,
         height_cm, weight_kg, allergies, medical_conditions, current_medications, medical_history)
        VALUES 
        (:full_name, :date_of_birth, :age, :gender, :blood_group, :marital_status,
         :phone_number, :email, :address, :city, :state, :zip_code,
         :height_cm, :weight_kg, :allergies, :medical_conditions, :current_medications, :medical_history)");
    
    $stmt->execute($data);
    $lastId = $pdo->lastInsertId();
    echo json_encode(['success' => true, 'message' => 'Patient data saved', 'patient_id' => $lastId]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error']);
}
?>
