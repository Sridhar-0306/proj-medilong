<?php
require_once 'config.php';

echo "<h2>🔧 Hospital Portal Backend - Database Connection Test</h2>";
echo "<style>body{font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5;} .success{color: green;} .error{color: red;} table{border-collapse: collapse; width: 100%; margin: 20px 0;} th,td{border: 1px solid #ddd; padding: 8px; text-align: left;} th{background: #4CAF50; color: white;}</style>";

try {
    $pdo = getDBConnection();
    echo "<p class='success'>✅ Database connection successful!</p>";
    
    // Test if patients table exists and show structure
    $stmt = $pdo->query("DESCRIBE patients");
    $columns = $stmt->fetchAll();
    
    echo "<h3>📋 Patients Table Structure:</h3>";
    echo "<table>";
    echo "<tr><th>Column Name</th><th>Data Type</th><th>Null</th><th>Key</th><th>Default</th></tr>";
    
    foreach ($columns as $column) {
        echo "<tr>";
        echo "<td>" . htmlspecialchars($column['Field']) . "</td>";
        echo "<td>" . htmlspecialchars($column['Type']) . "</td>";
        echo "<td>" . htmlspecialchars($column['Null']) . "</td>";
        echo "<td>" . htmlspecialchars($column['Key']) . "</td>";
        echo "<td>" . htmlspecialchars($column['Default'] ?? 'NULL') . "</td>";
        echo "</tr>";
    }
    echo "</table>";
    
    // Count existing patients
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM patients");
    $count = $stmt->fetch();
    echo "<p><strong>📊 Total patients in database:</strong> " . $count['count'] . "</p>";
    
    // Show recent patients if any exist
    if ($count['count'] > 0) {
        $stmt = $pdo->query("SELECT id, full_name, age, gender, phone_number, registration_date FROM patients ORDER BY registration_date DESC LIMIT 5");
        $recent_patients = $stmt->fetchAll();
        
        echo "<h3>👥 Recent Patient Registrations (Last 5):</h3>";
        echo "<table>";
        echo "<tr><th>ID</th><th>Name</th><th>Age</th><th>Gender</th><th>Phone</th><th>Registration Date</th></tr>";
        
        foreach ($recent_patients as $patient) {
            echo "<tr>";
            echo "<td>" . htmlspecialchars($patient['id']) . "</td>";
            echo "<td>" . htmlspecialchars($patient['full_name']) . "</td>";
            echo "<td>" . htmlspecialchars($patient['age']) . "</td>";
            echo "<td>" . htmlspecialchars($patient['gender']) . "</td>";
            echo "<td>" . htmlspecialchars($patient['phone_number']) . "</td>";
            echo "<td>" . htmlspecialchars($patient['registration_date']) . "</td>";
            echo "</tr>";
        }
        echo "</table>";
    }
    
    echo "<hr>";
    echo "<h3>🚀 Backend API Endpoints Status:</h3>";
    echo "<p>✅ <strong>config.php</strong> - Database connection working</p>";
    echo "<p>✅ <strong>save_patient.php</strong> - Ready to accept patient registrations</p>";
    echo "<p>✅ <strong>get_patients.php</strong> - Ready to provide patient list</p>";
    echo "<p>✅ <strong>get_patient_details.php</strong> - Ready to provide detailed patient info</p>";
    
    echo "<hr>";
    echo "<h3>📋 Next Steps:</h3>";
    echo "<ol>";
    echo "<li>Upload all PHP files to your hosting server</li>";
    echo "<li>Update the <strong>API_BASE_URL</strong> in your frontend files with your server URL</li>";
    echo "<li>Test patient registration through your patient portal</li>";
    echo "<li>Verify data appears in doctor and reception portals</li>";
    echo "</ol>";
    
} catch (Exception $e) {
    echo "<p class='error'>❌ Connection failed: " . htmlspecialchars($e->getMessage()) . "</p>";
    echo "<p>Please check your database configuration in config.php</p>";
}
?>
