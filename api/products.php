<?php
/**
 * Products REST API
 * 
 * GET    /api/products.php         — Fetch all products
 * POST   /api/products.php         — Add a new product
 * PUT    /api/products.php         — Update an existing product
 * DELETE /api/products.php?id=X    — Delete a product by ID
 */

require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];
$pdo = getDBConnection();

switch ($method) {
    case 'GET':
        handleGet($pdo);
        break;
    case 'POST':
        handlePost($pdo);
        break;
    case 'PUT':
        handlePut($pdo);
        break;
    case 'DELETE':
        handleDelete($pdo);
        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}

/**
 * GET — Fetch all products ordered by id.
 */
function handleGet($pdo) {
    try {
        $stmt = $pdo->query("SELECT * FROM products ORDER BY id ASC");
        $products = $stmt->fetchAll();

        // Convert numeric fields
        foreach ($products as &$product) {
            $product['id'] = (int)$product['id'];
        }

        echo json_encode($products);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to fetch products: ' . $e->getMessage()]);
    }
}

/**
 * POST — Add a new product.
 * Expects JSON body: { name, weight, price, type, status, img }
 */
function handlePost($pdo) {
    try {
        $data = json_decode(file_get_contents('php://input'), true);

        if (!$data || !isset($data['name']) || !isset($data['price'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Name and price are required']);
            return;
        }

        $stmt = $pdo->prepare("
            INSERT INTO products (name, weight, price, type, status, img)
            VALUES (:name, :weight, :price, :type, :status, :img)
        ");

        $stmt->execute([
            ':name'   => $data['name'],
            ':weight' => $data['weight'] ?? '',
            ':price'  => $data['price'] ?? '',
            ':type'   => $data['type'] ?? 'Vegetable',
            ':status' => $data['status'] ?? 'Regular',
            ':img'    => $data['img'] ?? '',
        ]);

        $newId = (int)$pdo->lastInsertId();

        // Return the newly created product
        $stmt = $pdo->prepare("SELECT * FROM products WHERE id = :id");
        $stmt->execute([':id' => $newId]);
        $product = $stmt->fetch();
        $product['id'] = (int)$product['id'];

        http_response_code(201);
        echo json_encode($product);

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to add product: ' . $e->getMessage()]);
    }
}

/**
 * PUT — Update an existing product.
 * Expects JSON body: { id, name, weight, price, type, status, img }
 */
function handlePut($pdo) {
    try {
        $data = json_decode(file_get_contents('php://input'), true);

        if (!$data || !isset($data['id'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Product ID is required']);
            return;
        }

        $stmt = $pdo->prepare("
            UPDATE products 
            SET name = :name, weight = :weight, price = :price, 
                type = :type, status = :status, img = :img
            WHERE id = :id
        ");

        $stmt->execute([
            ':id'     => (int)$data['id'],
            ':name'   => $data['name'] ?? '',
            ':weight' => $data['weight'] ?? '',
            ':price'  => $data['price'] ?? '',
            ':type'   => $data['type'] ?? 'Vegetable',
            ':status' => $data['status'] ?? 'Regular',
            ':img'    => $data['img'] ?? '',
        ]);

        if ($stmt->rowCount() === 0) {
            http_response_code(404);
            echo json_encode(['error' => 'Product not found']);
            return;
        }

        // Return the updated product
        $stmt = $pdo->prepare("SELECT * FROM products WHERE id = :id");
        $stmt->execute([':id' => (int)$data['id']]);
        $product = $stmt->fetch();
        $product['id'] = (int)$product['id'];

        echo json_encode($product);

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to update product: ' . $e->getMessage()]);
    }
}

/**
 * DELETE — Delete a product by ID.
 * Expects query param: ?id=X
 */
function handleDelete($pdo) {
    try {
        $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;

        if ($id <= 0) {
            http_response_code(400);
            echo json_encode(['error' => 'Valid product ID is required']);
            return;
        }

        $stmt = $pdo->prepare("DELETE FROM products WHERE id = :id");
        $stmt->execute([':id' => $id]);

        if ($stmt->rowCount() === 0) {
            http_response_code(404);
            echo json_encode(['error' => 'Product not found']);
            return;
        }

        echo json_encode(['success' => true, 'message' => 'Product deleted']);

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to delete product: ' . $e->getMessage()]);
    }
}
