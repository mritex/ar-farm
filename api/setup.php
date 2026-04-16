<?php
/**
 * Database Setup Script
 * 
 * Run this ONCE to create the products table and seed it with initial data.
 * After running successfully, DELETE this file from the server for security.
 * 
 * Usage: Visit /api/setup.php in the browser
 */

require_once __DIR__ . '/config.php';

$pdo = getDBConnection();

echo "<h2>AR Green Plant - Database Setup</h2>";
echo "<pre>";

try {
    // Step 1: Create the products table
    echo "Creating 'products' table...\n";
    
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS products (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            weight VARCHAR(100) DEFAULT '',
            price VARCHAR(100) NOT NULL,
            type VARCHAR(100) DEFAULT 'Vegetable',
            status VARCHAR(100) DEFAULT 'Regular',
            img TEXT DEFAULT '',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ");
    
    echo "✅ Table 'products' created successfully.\n\n";

    // Step 2: Check if table already has data
    $count = $pdo->query("SELECT COUNT(*) FROM products")->fetchColumn();
    
    if ($count > 0) {
        echo "⚠️  Table already has {$count} products. Skipping seed.\n";
        echo "   To re-seed, manually TRUNCATE the table first.\n";
    } else {
        // Step 3: Seed with initial products
        echo "Seeding initial products...\n";
        
        $products = [
            ['Fresh Lettuce',   '250g',    '60 ৳',  'Vegetable', 'Hot Sale',  '/images/lettuce.png'],
            ['Pudina (Mint)',   '100g',    '30 ৳',  'Herb',      'Regular',   '/images/custom_2.jpeg'],
            ['Oregano',        '50g',     '150 ৳', 'Herb',      'Stock Out', '/images/oregano.png'],
            ['Rui Fish',       '1kg',     '400 ৳', 'Fish',      'Regular',   '/images/rui.png'],
            ['Cat Fish',       '1kg',     '350 ৳', 'Fish',      'Hot Sale',  '/images/catfish.png'],
            ['Pabda Fish',     '500g',    '500 ৳', 'Fish',      'Regular',   '/images/pabda.png'],
            ['Custard Apple',  '1 Kg',    '250 ৳', 'Fruit',     'Regular',   '/images/custard_apple.jpg'],
            ['Orange',         '1 Kg',    '280 ৳', 'Fruit',     'Regular',   '/images/orange.jpg'],
            ['Mango',          '1 Kg',    '200 ৳', 'Fruit',     'Regular',   '/images/mango.jpg'],
            ['Malta',          '1 Kg',    '180 ৳', 'Fruit',     'Regular',   '/images/malta.jpg'],
            ['Local Banana',   '1 Dozen', '100 ৳', 'Fruit',     'Regular',   '/images/banana.jpg'],
            ['Guava',          '1 Kg',    '80 ৳',  'Fruit',     'Regular',   '/images/guava.jpg'],
            ['Dragon Fruit',   '1 Kg',    '450 ৳', 'Fruit',     'Regular',   '/images/dragon_fruit.jpg'],
        ];

        $stmt = $pdo->prepare("
            INSERT INTO products (name, weight, price, type, status, img)
            VALUES (:name, :weight, :price, :type, :status, :img)
        ");

        foreach ($products as $p) {
            $stmt->execute([
                ':name'   => $p[0],
                ':weight' => $p[1],
                ':price'  => $p[2],
                ':type'   => $p[3],
                ':status' => $p[4],
                ':img'    => $p[5],
            ]);
            echo "  ✅ Added: {$p[0]}\n";
        }

        echo "\n✅ Successfully seeded " . count($products) . " products.\n";
    }

    echo "\n========================================\n";
    echo "🎉 Setup complete!\n";
    echo "⚠️  DELETE this file (setup.php) from your server now!\n";
    echo "========================================\n";

} catch (PDOException $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}

echo "</pre>";
