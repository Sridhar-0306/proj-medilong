<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Only GET method allowed']);
    exit;
}

$patient_id = intval($_GET['id'] ?? 0);

if ($patient_id <= 0) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Valid Patient ID is required']);
    exit;
}

try {
    $pdo = getDBConnection();
    
    // Get detailed patient information by ID
    $sql = "SELECT 
        id,
        full_name,
        date_of_birth,
        age,
        gender,
        blood_group,
        marital_status,
        phone_number,
        email,
        address,
        city,
        state,
        zip_code,
        height_cm,
        weight_kg,
        allergies,
        medical_conditions,
        current_medications,
        medical_history,
        registration_date,
        status
    FROM patients 
    WHERE id = :id";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([':id' => $patient_id]);
    
    $patient = $stmt->fetch();
    
    if ($patient) {
        // Format the patient data for display
        $formatted_patient = [
            'id' => $patient['id'],
            'full_name' => $patient['full_name'],
            'date_of_birth' => $patient['date_of_birth'] ?: 'Not provided',
            'age' => $patient['age'],
            'gender' => $patient['gender'],
            'blood_group' => $patient['blood_group'] ?: 'Not specified',
            'marital_status' => $patient['marital_status'] ?: 'Not specified',
            'phone_number' => $patient['phone_number'],
            'email' => $patient['email'] ?: 'Not provided',
            'address' => $patient['address'] ?: 'Not provided',
            'city' => $patient['city'] ?: 'Not provided',
            'state' => $patient['state'] ?: 'Not provided',
            'zip_code' => $patient['zip_code'] ?: 'Not provided',
            'height_cm' => $patient['height_cm'] ? $patient['height_cm'] . ' cm' : 'Not provided',
            'weight_kg' => $patient['weight_kg'] ? $patient['weight_kg'] . ' kg' : 'Not provided',
            'allergies' => $patient['allergies'] ?: 'None',
            'medical_conditions' => $patient['medical_conditions'] ?: 'None',
            'current_medications' => $patient['current_medications'] ?: 'None',
            'medical_history' => $patient['medical_history'] ?: 'None',
            'registration_date' => date('Y-m-d H:i:s', strtotime($patient['registration_date'])),
            'status' => $patient['status']
        ];
        
        echo json_encode([
            'success' => true,
            'data' => $formatted_patient,
            'message' => 'Patient details retrieved successfully'
        ]);
    } else {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'message' => 'Patient not found with ID: ' . $patient_id,
            'data' => null
        ]);
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to retrieve patient details: ' . $e->getMessage(),
        'data' => null
    ]);
}
?>
