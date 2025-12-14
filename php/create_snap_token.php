<?php
// Include Composer autoload
require_once __DIR__ . '/vendor/autoload.php';


// Konfigurasi Midtrans
\Midtrans\Config::$serverKey = getenv('MIDTRANS_SERVER_KEY');
\Midtrans\Config::$isProduction = false; // sandbox mode
\Midtrans\Config::$isSanitized = true;
\Midtrans\Config::$is3ds = true;

if (!getenv('MIDTRANS_SERVER_KEY')) {
    http_response_code(500);
    echo json_encode(['error' => 'Server key not set']);
    exit;
}


// Validasi input POST
$total = isset($_POST['total']) ? (int)$_POST['total'] : 0;
$items = isset($_POST['items']) ? json_decode($_POST['items'], true) : [];
$name = isset($_POST['name']) ? $_POST['name'] : 'Guest';
$email = isset($_POST['email']) ? $_POST['email'] : '';
$phone = isset($_POST['phone']) ? $_POST['phone'] : '';

// Parameter transaksi
$params = [
    'transaction_details' => [
        'order_id' => 'ORDER-' . time(),
        'gross_amount' => $total,
    ],
    'item_details' => $items,
    'customer_details' => [
        'first_name' => $name,
        'email' => $email,
        'phone' => $phone,
    ],
];

// Generate Snap Token
try {
    $snapToken = \Midtrans\Snap::getSnapToken($params);
    echo json_encode(['token' => $snapToken]);
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
