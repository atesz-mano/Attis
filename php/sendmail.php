<?php
// Email konfigurációs fájl
// Hamarosan aktiválható

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Form adatok
    $name = sanitize_input($_POST['name'] ?? '');
    $phone = sanitize_input($_POST['phone'] ?? '');
    $email = sanitize_input($_POST['email'] ?? '');
    $message = sanitize_input($_POST['message'] ?? '');

    // Ellenőrzés
    if (empty($name) || empty($phone) || empty($email) || empty($message)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Minden mező kitöltése kötelező!']);
        exit;
    }

    // Email fejléc
    $to = 'your-email@example.com'; // ITT ÍRJA BE AZ E-MAIL CÍMÉT
    $subject = "Új ajánlatkérés: $name";
    $body = "Név: $name\n";
    $body .= "Telefonszám: $phone\n";
    $body .= "E-mail: $email\n";
    $body .= "Üzenet:\n$message\n";

    $headers = "From: $email\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

    // E-mail küldése
    if (mail($to, $subject, $body, $headers)) {
        http_response_code(200);
        echo json_encode(['success' => true, 'message' => 'Köszönöm az ajánlatkérést!']);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Hiba történt az e-mail küldésénél.']);
    }
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
}

// Funkció az input sanitizálásához
function sanitize_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}
?>
