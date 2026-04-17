<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Support\Facades\File;

class ProductImportSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $jsonPath = base_path('resources/js/data/products.json');
        
        if (!File::exists($jsonPath)) {
            $this->command->error("JSON file not found at: $jsonPath");
            return;
        }

        $json = File::get($jsonPath);
        $products = json_decode($json, true);

        // Map category names (from JSON 'type') to IDs
        $categoryMap = Category::pluck('id', 'name')->toArray();

        // If names like 'Vegetable' aren't found, we'll need to be careful
        // The ones we saw in DB were: Vegetable, Herb, Fruit, Fish
        
        $count = 0;
        foreach ($products as $p) {
            $typeName = $p['type'] ?? 'Vegetable';
            
            // Check if category exists, if not maybe create it or skip
            $categoryId = $categoryMap[$typeName] ?? null;

            if (!$categoryId) {
                // Try to find a partial match or just create it if missing
                $category = Category::firstOrCreate(
                    ['name' => $typeName],
                    ['title' => $typeName . 's'] // Fallback title
                );
                $categoryId = $category->id;
                $categoryMap[$typeName] = $categoryId;
            }

            Product::create([
                'name' => $p['name'],
                'weight' => $p['weight'] ?? null,
                'price' => $p['price'],
                'status' => $p['status'] ?? 'Regular',
                'img' => $p['img'] ?? null,
                'category_id' => $categoryId,
            ]);
            $count++;
        }

        $this->command->info("Successfully imported $count products.");
    }
}
