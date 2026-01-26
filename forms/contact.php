<?php
  // Receiving email address
  $receiving_email_address = 'fanuelokeno@gmail.com';

  // Check if form was submitted
  if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    // Get form data and sanitize
    $name = htmlspecialchars(trim($_POST['name'] ?? ''));
    $email = htmlspecialchars(trim($_POST['email'] ?? ''));
    $subject = htmlspecialchars(trim($_POST['subject'] ?? ''));
    $message = htmlspecialchars(trim($_POST['message'] ?? ''));

    // Validate form fields
    if (empty($name) || empty($email) || empty($subject) || empty($message)) {
      echo json_encode(['success' => false, 'message' => 'All fields are required']);
      exit;
    }

    // Validate email format
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
      echo json_encode(['success' => false, 'message' => 'Invalid email address']);
      exit;
    }

    // Prepare email headers
    $headers = "From: " . $email . "\r\n";
    $headers .= "Reply-To: " . $email . "\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";

    // Prepare email body
    $body = "<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; }
        .email-container { background-color: #f4f4f4; padding: 20px; }
        .email-content { background-color: #ffffff; padding: 20px; border-radius: 5px; }
        .field-label { font-weight: bold; color: #333; }
        .field-value { color: #666; margin-bottom: 15px; }
    </style>
</head>
<body>
    <div class='email-container'>
        <div class='email-content'>
            <h2>New Contact Form Submission</h2>
            <p class='field-value'><span class='field-label'>From:</span> {$name}</p>
            <p class='field-value'><span class='field-label'>Email:</span> {$email}</p>
            <p class='field-value'><span class='field-label'>Subject:</span> {$subject}</p>
            <p class='field-value'><span class='field-label'>Message:</span></p>
            <p style='background-color: #f9f9f9; padding: 15px; border-left: 4px solid #007bff;'>{$message}</p>
        </div>
    </div>
</body>
</html>";

    // Send email
    if (mail($receiving_email_address, $subject, $body, $headers)) {
      echo json_encode(['success' => true, 'message' => 'Your message has been sent successfully!']);
    } else {
      echo json_encode(['success' => false, 'message' => 'Failed to send email. Please try again later.']);
    }
  } else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
  }
?>
